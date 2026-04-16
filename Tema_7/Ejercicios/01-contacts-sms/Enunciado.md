# Ejercicio 1 — Compartir recetas por SMS con Contactos (RecetApp)

## Objetivo

Ampliar **RecetApp** para que el usuario pueda **compartir una receta con un contacto del dispositivo vía SMS**. Desde la pantalla de detalle de una receta (Nivel 3), el usuario pulsará un botón "Compartir por SMS", accederá a su lista de contactos, buscará un contacto y le enviará un mensaje con el resumen de la receta.

Se practicarán los módulos **expo-contacts** y **expo-sms**, incluyendo solicitud de permisos, lectura de contactos y envío de SMS.

---

## Conceptos previos

### expo-contacts

Permite acceder a la agenda de contactos del dispositivo. Requiere permiso del usuario.

```jsx
import * as Contacts from 'expo-contacts';

// Solicitar permisos
const { status } = await Contacts.requestPermissionsAsync();

// Obtener contactos (con campos específicos)
const { data } = await Contacts.getContactsAsync({
    fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Emails],
});
```

**Funciones principales:**

| Función | Descripción |
|---|---|
| `requestPermissionsAsync()` | Solicita permiso para acceder a los contactos. Devuelve `{ status }` |
| `getPermissionsAsync()` | Comprueba el estado del permiso sin solicitarlo |
| `getContactsAsync(options)` | Obtiene los contactos. `options.fields` especifica qué datos traer |
| `getContactByIdAsync(id)` | Obtiene un contacto por su ID |

**Campos disponibles (`Contacts.Fields`):**

| Campo | Descripción |
|---|---|
| `PhoneNumbers` | Números de teléfono |
| `Emails` | Direcciones de email |
| `FirstName` | Nombre |
| `LastName` | Apellido |
| `Image` | Imagen del contacto |

> 📖 [expo-contacts — Documentación](https://docs.expo.dev/versions/latest/sdk/contacts/)

### expo-sms

Permite abrir la app de SMS del dispositivo con un mensaje predefinido.

```jsx
import * as SMS from 'expo-sms';

// Verificar disponibilidad
const isAvailable = await SMS.isAvailableAsync();

// Enviar SMS (abre la app de mensajes con el texto prellenado)
if (isAvailable) {
    await SMS.sendSMSAsync(
        ['612345678'],          // Array de destinatarios
        '¡Hola! Mira esta receta...' // Mensaje
    );
}
```

**Funciones principales:**

| Función | Descripción |
|---|---|
| `isAvailableAsync()` | Devuelve `true` si el dispositivo puede enviar SMS |
| `sendSMSAsync(addresses, message, options?)` | Abre la app de SMS con destinatarios y mensaje prellenados |

**Parámetros de `sendSMSAsync`:**

| Parámetro | Tipo | Descripción |
|---|---|---|
| `addresses` | `string[]` | Array de números de teléfono destinatarios |
| `message` | `string` | Cuerpo del mensaje de texto |
| `options` | `object` | Opciones adicionales (ej. `attachments` en iOS) |

> ⚠️ `sendSMSAsync` **no envía el SMS directamente**. Abre la app de mensajes nativa con los campos prellenados para que el usuario confirme el envío.

> 📖 [expo-sms — Documentación](https://docs.expo.dev/versions/latest/sdk/sms/)

### Permisos en Expo

Los módulos que acceden a datos sensibles (contactos, cámara, calendario, etc.) requieren permisos explícitos del usuario:

```jsx
// Patrón estándar para solicitar permisos
const { status } = await SomeModule.requestPermissionsAsync();

if (status === 'granted') {
    // El usuario ha concedido el permiso → acceder a los datos
} else {
    // Permiso denegado → mostrar mensaje informativo
    Alert.alert('Permisos insuficientes', 'Necesitamos acceso a X para esta funcionalidad.');
}
```

Los valores posibles de `status` son:
- `'granted'` — permiso concedido.
- `'denied'` — permiso denegado.
- `'undetermined'` — aún no se ha pedido.

---

## Parte 1 — Instalar dependencias adicionales

Partiendo del proyecto RecetApp del ejercicio 3 del Tema 6 (Drawer + Tabs + Stack):

```bash
npm install expo-contacts expo-sms
```

---

## Parte 2 — Nueva pantalla: Seleccionar contacto para compartir

### 2.1 — Estructura de archivos

Añade una nueva ruta dentro del Stack del detalle de receta:

```
app/(drawer)/(tabs)/(stack)/landing/categories/[categoryName]/recipes/[idRecipe]/
  index.jsx                    ← Detalle de la receta (existente)
  cooking/index.jsx            ← Paso a paso (existente)
  share/index.jsx              ← NUEVA: Pantalla de compartir por SMS
```

### 2.2 — Registrar la nueva ruta en el Stack layout

Añade un nuevo `Stack.Screen` en `(stack)/_layout.jsx`:

```jsx
<Stack.Screen
    name="landing/categories/[categoryName]/recipes/[idRecipe]/share/index"
    options={{ title: "Compartir receta" }}
/>
```

### 2.3 — Botón "Compartir por SMS" en el detalle

En la pantalla de detalle de la receta (`recipes/[idRecipe]/index.jsx`), añade un nuevo botón debajo de "Empezar a cocinar":

- Icono: `chatbubble-outline` de Ionicons.
- Texto: "Compartir por SMS".
- Al pulsar, navega a la nueva ruta `share`.

### 2.4 — Pantalla `share/index.jsx`

La pantalla debe:

1. **Solicitar permisos** de contactos al montar el componente (`useEffect`).
2. **Cargar los contactos** con `Contacts.getContactsAsync({ fields: [Contacts.Fields.PhoneNumbers] })`.
3. **Filtrar contactos válidos** (que tengan al menos un número de teléfono).
4. **Barra de búsqueda** (`TextInput`) que filtra contactos por nombre en tiempo real.
5. **Lista de contactos** (`FlatList`) mostrando nombre y número de teléfono.
6. **Al pulsar un contacto**, verificar que SMS está disponible (`SMS.isAvailableAsync()`) y enviar un mensaje con el resumen de la receta.
7. **Gestionar estados**: carga, lista vacía, permiso denegado.

**Formato del mensaje SMS:**

```
🍳 ¡Te comparto una receta de RecetApp!

📖 {recipe.title}
👨‍🍳 {recipe.author}
⏱️ {recipe.time} · {recipe.difficulty}
👥 {recipe.servings} porciones

{recipe.description}

¡Descarga RecetApp para ver los ingredientes y el paso a paso!
```

---

## Parte 3 — Obtener la receta desde el contexto

La pantalla `share/index.jsx` recibe `idRecipe` y `categoryName` via `useLocalSearchParams()`. Utiliza `useRecipesContext()` para acceder al array de recetas y buscar la receta por ID (mismo patrón que en el detalle).

---

## Estructura final (archivos nuevos/modificados)

```
app/(drawer)/(tabs)/(stack)/
  _layout.jsx                          ← Añadir Stack.Screen para share
  landing/categories/[categoryName]/recipes/[idRecipe]/
    index.jsx                          ← Añadir botón "Compartir por SMS"
    share/
      index.jsx                        ← NUEVA: Lista de contactos + envío SMS
```

---

## Checklist

- [ ] `expo-contacts` instalado y funcionando
- [ ] `expo-sms` instalado y funcionando
- [ ] Permiso de contactos solicitado con `requestPermissionsAsync()`
- [ ] Contactos cargados con `getContactsAsync()` filtrando por `PhoneNumbers`
- [ ] Filtro de contactos que tengan número de teléfono
- [ ] Barra de búsqueda que filtra contactos por nombre
- [ ] `FlatList` con contactos renderizados
- [ ] `SMS.isAvailableAsync()` verificado antes de enviar
- [ ] `SMS.sendSMSAsync()` con número del contacto y mensaje de receta
- [ ] Gestión de errores y permisos denegados
- [ ] `KeyboardAvoidingView` para la barra de búsqueda

---

## Referencias técnicas

| Recurso | Enlace |
|---|---|
| expo-contacts | https://docs.expo.dev/versions/latest/sdk/contacts/ |
| expo-sms | https://docs.expo.dev/versions/latest/sdk/sms/ |
| FlatList | https://reactnative.dev/docs/flatlist |
| TextInput | https://reactnative.dev/docs/textinput |
| KeyboardAvoidingView | https://reactnative.dev/docs/keyboardavoidingview |
| Permissions overview | https://docs.expo.dev/guides/permissions/ |


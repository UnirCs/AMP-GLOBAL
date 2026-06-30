# Repaso 1 — Desarrollo de Aplicaciones Móviles con React Native y Expo

> Material de repaso. Cada pregunta tiene 4 opciones y solo una es correcta.
> Despliega el bloque **«Ver solución»** de cada pregunta para comprobar la respuesta y las justificaciones.

---

## Enunciado General

El equipo de desarrollo de **UnirEats** trabaja en una aplicación móvil multiplataforma de pedidos de comida a domicilio, construida con React Native, Expo SDK 55 y NativeWind v4 (Tailwind CSS para React Native). La navegación está gestionada por Expo Router v4 (enrutamiento basado en archivos). La app consume una API REST desplegada en `https://unir-eats-repaso.com/api`.

El equipo está formado por:
- **Marta** — lead developer, macOS, prueba exclusivamente en simulador iOS (Xcode)
- **Diego** — frontend developer, Windows, prueba en emulador Android (AVD Manager)
- **Nuria** — QA engineer, Pixel 8 físico (Android)
- **Iván** — junior developer, macOS, simulador iOS exclusivamente
- **Clara** — UI/UX developer, macOS, simulador iOS (Xcode 15)
- **Hugo** — backend developer (apoyo mobile), Linux, emulador Android (AVD)
- **Sofía** — QA junior, Windows, emulador Android Pixel 7 (sin dispositivo físico)
- **Raúl** — tech lead, macOS, revisión de código únicamente (sin entorno de ejecución configurado)

### Funcionalidades implementadas

- Login y registro: `POST /auth-sessions`, `POST /users`
- Catálogo de restaurantes por ciudad: `GET /restaurants?city={city}`
- Detalle y platos: `GET /restaurants/{id}/dishes`
- Carrito y pedido: `POST /orders`
- Seguimiento del repartidor en mapa: `expo-location`
- Avisos de estado del pedido: `expo-notifications`
- Compartir el ticket del pedido: `expo-sharing`
- Recordatorio de reparto en calendario: `expo-calendar`

---

## Preguntas

---

### Pregunta 1

El equipo quiere que los testers del departamento de calidad prueben la última versión de UnirEats sin publicarla en App Store ni Play Store. Usan **EAS Update** para distribuir la nueva versión. ¿Qué mecanismo permite que los testers accedan a la actualización de forma inmediata?

A) Generan un **QR de distribución** vinculado al update publicado en EAS; los testers lo escanean con la app de Expo Go o un development build compatible y cargan la nueva versión del JavaScript/bundle sin reinstalar el binario nativo.

B) EAS Update compila un nuevo binario `.apk` / `.ipa` completo que los testers deben descargar e instalar manualmente en su dispositivo cada vez.

C) EAS Update solo funciona para apps que ya están publicadas en las tiendas oficiales; no permite distribución interna.

D) El QR contiene el código fuente completo del proyecto y los testers deben ejecutar `expo start` en su propia máquina para probarlo.

<details>
<summary><strong>Ver solución</strong></summary>

✅ **Respuesta correcta: A**

**Por qué es correcta:** EAS Update envía actualizaciones de JavaScript y assets alojados en los servidores de Expo. Mediante un QR de distribución, los testers acceden al update desde Expo Go o un development build sin necesidad de recompilar ni reinstalar el binario nativo.

**Por qué las demás no:**
- **B)** EAS Update no genera nuevos binarios nativos; actualiza el bundle JS y assets sobre el binario existente.
- **C)** EAS Update está precisamente pensado para distribución interna, previews y testing, sin depender de las tiendas.
- **D)** El QR apunta al update hospedado en Expo; no transporta el código fuente ni requiere un entorno de desarrollo local.

</details>

---

### Pregunta 2

El equipo evalúa cambiar los botones de «Añadir al carrito» de `TouchableOpacity` a `Pressable`. ¿Cuál es la ventaja principal de `Pressable`?

A) `Pressable` añade automáticamente una animación de escala al pulsar sin necesidad de configuración adicional.

B) `Pressable` proporciona estados de interacción más precisos (`pressed`, `hovered`, `focused`) y permite personalizar completamente el feedback visual mediante una función render prop, mientras que `TouchableOpacity` solo ofrece un fundido de opacidad fijo.

C) `TouchableOpacity` es más performante porque está escrito en código nativo puro, mientras que `Pressable` es un componente JavaScript.

D) `Pressable` no soporta el prop `onPress`, por lo que hay que usar `onPressIn` obligatoriamente.

<details>
<summary><strong>Ver solución</strong></summary>

✅ **Respuesta correcta: B**

**Por qué es correcta:** `Pressable` expone el estado `pressed` (y otros) mediante una función hijo o render prop, permitiendo feedback visual flexible (escala, opacidad, color, etc.). `TouchableOpacity` solo realiza un fundido de opacidad predefinido sin tanta flexibilidad.

**Por qué las demás no:**
- **A)** No añade animación automática; el feedback se define manualmente con el estado `pressed`.
- **C)** Ambos componentes son nativos; la diferencia está en la API de interacción, no en el rendimiento.
- **D)** `Pressable` sí soporta `onPress` como cualquier componente táctil.

</details>

---

### Pregunta 3

Clara ha extendido el tema de NativeWind en `tailwind.config.js` para añadir el color corporativo de UnirEats:

```js
module.exports = {
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        brand: '#ea580c',
      },
    },
  },
};
```

¿Cómo aplica ese color a un componente `View`?

A) `<View className="bg-brand" />` — NativeWind genera la clase `bg-{clave}` a partir de las extensiones del tema.

B) `<View style={{ backgroundColor: 'brand' }} />` — el nombre de la clave del config se usa directamente como string de estilo inline.

C) `<View className="bg-[#ea580c]" />` — NativeWind ignora las extensiones de `tailwind.config.js` y obliga a escribir el valor literal.

D) `<View className="color-brand" />` — para fondos se usa el prefijo `color-` en lugar de `bg-`.

<details>
<summary><strong>Ver solución</strong></summary>

✅ **Respuesta correcta: A**

**Por qué es correcta:** NativeWind v4 respeta la configuración de Tailwind. Al extender `theme.extend.colors` con una clave personalizada (`brand`), Tailwind genera las utilidades correspondientes (`bg-brand`, `text-brand`, etc.) que NativeWind mapea a estilos nativos.

**Por qué las demás no:**
- **B)** `style` requiere el valor real del color (`#ea580c`), no la clave del config.
- **C)** NativeWind sí lee la configuración; no es necesario hardcodear el literal.
- **D)** El prefijo para fondos es `bg-`, no `color-`.

</details>

---

### Pregunta 4

En la pantalla de términos y condiciones, el equipo usa un `ScrollView` largo:

```jsx
<ScrollView style={{ padding: 16 }}>
  <Text>{termsContent}</Text>
</ScrollView>
```

El padding no se aplica correctamente al contenido desplazable. ¿Qué prop debería usarse para aplicar estilos al contenedor que envuelve los elementos desplazables?

A) `style` aplica estilos al contenedor exterior del `ScrollView`, mientras que `contentContainerStyle` aplica estilos al contenedor interior que envuelve todos los hijos desplazables.

B) No hay diferencia; ambos aplican estilos al mismo nodo y el error debe deberse a otro factor.

C) `contentContainerStyle` solo funciona cuando `horizontal={true}`.

D) `style` está deprecado y se debe usar `contentContainerStyle` para todo.

<details>
<summary><strong>Ver solución</strong></summary>

✅ **Respuesta correcta: A**

**Por qué es correcta:** `ScrollView` tiene dos contenedores: el exterior (el propio ScrollView, que controla el área de scroll) y el interior (el content container, que contiene todos los hijos y se desplaza). Para aplicar padding o alineación a los elementos desplazables se usa `contentContainerStyle`.

**Por qué las demás no:**
- **B)** No son el mismo nodo; `style` afecta al wrapper exterior y puede recortar o no desplazar correctamente.
- **C)** `contentContainerStyle` funciona en ambas orientaciones.
- **D)** `style` no está deprecado; tiene un propósito diferente (estilos del contenedor exterior).

</details>

---

### Pregunta 5

La estructura de archivos de UnirEats incluye:

```
app/
├── (app)/
│   ├── _layout.js
│   ├── index.js
│   └── restaurants/
│       └── [id].js
└── (auth)/
    ├── login.js
    └── register.js
```

¿Qué efecto tienen los paréntesis en los nombres de carpeta `(app)` y `(auth)`?

A) Indican que las rutas dentro de ellas están protegidas; Expo Router redirige automáticamente a `login.js` si no hay sesión activa.

B) Son «grupos de rutas» que organizan archivos sin añadir el nombre del grupo al path final; la ruta de `login.js` es `/login`, no `/auth/login`.

C) Marcan esas carpetas como de carga diferida (lazy loading): sus pantallas no se incluyen en el bundle inicial.

D) No tienen ningún efecto especial; son una convención visual y la URL incluiría `/app/login`.

<details>
<summary><strong>Ver solución</strong></summary>

✅ **Respuesta correcta: B**

**Por qué es correcta:** Los grupos de rutas `(nombre)` permiten agrupar pantallas bajo un layout o una lógica organizativa sin que el nombre del grupo aparezca en la URL. Así `(auth)/login.js` responde a `/login`.

**Por qué las demás no:**
- **A)** Los paréntesis no implican autenticación ni redirección automática.
- **C)** No activan lazy loading; el bundle incluye las pantallas normalmente.
- **D)** Sí tienen efecto real en la formación de la URL.

</details>

---

### Pregunta 6

El equipo quiere mostrar el filtro de restaurantes como una pantalla deslizable desde abajo (modal). En el layout del stack:

```jsx
<Stack>
  <Stack.Screen name="index" options={{ title: 'Restaurantes' }} />
  <Stack.Screen
    name="filter"
    options={{ presentation: 'modal' }}
  />
</Stack>
```

¿Qué efecto visual tiene `presentation: 'modal'` en iOS?

A) La pantalla de filtros aparece como una tarjeta modal que se desliza desde abajo y puede descartarse con un gesto de swipe hacia abajo en iOS.

B) Cambia la animación a un fundido (fade) sin ningún movimiento de traslación.

C) Oculta el header de navegación superior de forma permanente para todas las pantallas del stack.

D) Fuerza la orientación a horizontal mientras la pantalla de filtros está activa.

<details>
<summary><strong>Ver solución</strong></summary>

✅ **Respuesta correcta: A**

**Por qué es correcta:** En iOS, `presentation: 'modal'` utiliza el estilo de presentación nativo de modal (tarjeta que sube desde la parte inferior), compatible con el gesto de descarte hacia abajo. En Android también produce una transición de tipo modal.

**Por qué las demás no:**
- **B)** No es un fade; es una traslación desde abajo.
- **C)** No oculta el header de forma global; solo afecta a la presentación de esa pantalla.
- **D)** No modifica la orientación del dispositivo.

</details>

---

### Pregunta 7

En el listado de platos favoritos, cada `DishCard` tiene un botón de corazón que alterna el estado:

```jsx
const [favorites, setFavorites] = useState(new Set());

// dentro del renderItem
<FlatList
  data={dishes}
  renderItem={({ item }) => (
    <DishCard
      dish={item}
      isFavorite={favorites.has(item.id)}
      onToggle={() => {
        const next = new Set(favorites);
        if (next.has(item.id)) next.delete(item.id);
        else next.add(item.id);
        setFavorites(next);
      }}
    />
  )}
/>
```

El usuario pulsa el corazón, `favorites` cambia, pero el icono del corazón **no se actualiza**. ¿Qué falta?

A) `FlatList` no detecta que debe re-renderizar las filas porque la prop `data` (`dishes`) no ha cambiado de referencia.

B) Falta declarar `favorites` en el array de dependencias del `renderItem`.

C) `FlatList` necesita la prop `extraData={favorites}` para saber que debe re-renderizar aunque `data` no haya cambiado.

D) `new Set(favorites)` no crea una copia nueva; hay que usar `Array.from` para que React detecte el cambio.

<details>
<summary><strong>Ver solución</strong></summary>

✅ **Respuesta correcta: C**

**Por qué es correcta:** `FlatList` optimiza re-renders comparando `data`. Si el estado que afecta al render de las filas (como `favorites`) no forma parte de `data`, hay que pasarlo en `extraData`. Así FlatList sabe que debe volver a renderizar las filas visibles.

**Por qué las demás no:**
- **A)** Aunque `data` no cambie, `extraData` es el mecanismo previsto para este caso.
- **B)** `renderItem` no tiene array de dependencias; eso es de `useCallback`.
- **D)** `new Set(favorites)` sí crea una nueva referencia; el problema es que FlatList no la recibe.

</details>

---

### Pregunta 8

El buscador de restaurantes aplica un filtro de «abierto ahora» sobre una lista de 200 locales:

```jsx
const openNow = restaurants.filter(r => isOpen(r.openingHours));
```

¿Cómo evita que este filtro se recalcule en cada render si `restaurants` y `isOpen` no cambian frecuentemente?

A) Envolver la lista en `useEffect` y guardar el resultado en `useState`.

B) Usar `useMemo(() => restaurants.filter(r => isOpen(r.openingHours)), [restaurants, isOpen])` para memoizar el resultado entre renders mientras las dependencias no cambien.

C) Extraer la lógica a una función normal fuera del componente y llamarla directamente en el render; React memoiza automáticamente funciones puras externas.

D) Declarar `openNow` con `let` en el cuerpo del componente y modificarlo solo dentro de un `useCallback`.

<details>
<summary><strong>Ver solución</strong></summary>

✅ **Respuesta correcta: B**

**Por qué es correcta:** `useMemo` guarda el resultado de una computación costosa y solo lo recalcula cuando cambian las dependencias. Como `restaurants` e `isOpen` son estables, el filtro no se ejecuta en cada render.

**Por qué las demás no:**
- **A)** `useEffect` + `useState` es más verboso y propenso a estados intermedios innecesarios.
- **C)** React no memoiza automáticamente funciones externas; se ejecutarán en cada render.
- **D)** Modificar `let` en render es un antipatrón que puede provocar comportamientos no deterministas.

</details>

---

### Pregunta 9

En el formulario de login de UnirEats, cuando el teclado virtual aparece tapa el campo de contraseña. ¿Qué componente de React Native se usa habitualmente para que el layout se desplace automáticamente cuando el teclado se abre?

A) `<KeyboardAvoidingView>` con `behavior="padding"` o `"position"`, que ajusta el layout del hijo para mantener visible el campo con foco.

B) `<ScrollView>` con `keyboardShouldPersistTaps="handled"`; sin embargo, esto solo controla si el teclado se cierra al tocar, no desplaza el contenido.

C) `<TouchableWithoutFeedback onPress={Keyboard.dismiss}>`; esto cierra el teclado al tocar fuera, pero no evita que tape los campos cuando aparece.

D) React Native no tiene solución nativa; hay que calcular la altura del teclado manualmente con un listener de eventos nativos.

<details>
<summary><strong>Ver solución</strong></summary>

✅ **Respuesta correcta: A**

**Por qué es correcta:** `KeyboardAvoidingView` es el componente estándar de React Native para adaptar el layout ante la aparición del teclado virtual. Según la plataforma y el `behavior` elegido, ajusta la posición o el padding de su contenido.

**Por qué las demás no:**
- **B)** `keyboardShouldPersistTaps` gestiona el cierre del teclado al tocar, no el desplazamiento del layout.
- **C)** `TouchableWithoutFeedback` solo cierra el teclado; no previene que tape los campos.
- **D)** React Native proporciona `KeyboardAvoidingView` precisamente para evitar ese cálculo manual.

</details>

---

### Pregunta 10

En la pantalla de detalle de restaurante, el equipo quiere un botón que lleve al carrito de compras. Usan Expo Router. ¿Cómo navegan correctamente a `/cart`?

A) `<Link href="/cart">Ir al carrito</Link>` crea un enlace navegable que empuja la ruta `/cart` en el stack actual.

B) `<Link to="/cart">Ir al carrito</Link>`; `to` es la prop correcta en Expo Router para definir la ruta destino.

C) `<a href="/cart">Ir al carrito</a>` funciona igual que en la web porque Expo Router utiliza un motor de navegación web interno.

D) `<Link href="/cart" replace>` siempre abre la ruta en un navegador externo del dispositivo (Safari/Chrome).

<details>
<summary><strong>Ver solución</strong></summary>

✅ **Respuesta correcta: A**

**Por qué es correcta:** En Expo Router, `Link` se comporta como un componente de enrutado interno. La prop `href` indica la ruta destino y al pulsar se navega dentro de la app (por defecto con `push`).

**Por qué las demás no:**
- **B)** La prop correcta es `href`, no `to` (`to` es de React Router DOM).
- **C)** No se usa la etiqueta `<a>` nativa de HTML; Expo Router no renderiza una webview.
- **D)** `replace` cambia el comportamiento del historial, pero la navegación sigue siendo interna a la app.

</details>

---

### Pregunta 11

El carrito de UnirEats maneja acciones complejas: añadir plato, eliminar plato, aplicar código promocional y vaciar carrito. El equipo opta por `useReducer`:

```jsx
const [cart, dispatch] = useReducer(cartReducer, { items: [], total: 0 });
```

¿Cuál es la ventaja principal de `useReducer` frente a múltiples `useState` en este caso?

A) `useReducer` guarda el estado fuera del componente en un almacén global, por lo que otros componentes pueden acceder al carrito sin Context.

B) Centraliza la lógica de transición de estado en una función pura (el reducer), haciendo que las actualizaciones complejas (añadir, eliminar, descuento) sean predecibles y más fáciles de testear.

C) Ejecuta las actualizaciones de forma asíncrona por defecto, evitando renders bloqueantes cuando el carrito crece.

D) Permite mutar directamente el estado anterior porque el reducer recibe una copia automática.

<details>
<summary><strong>Ver solución</strong></summary>

✅ **Respuesta correcta: B**

**Por qué es correcta:** Cuando un objeto de estado tiene múltiples acciones interrelacionadas, un reducer encapsula toda la lógica de transformación en un solo lugar. Eso facilita testear las transiciones de estado de forma aislada y evita dispersar lógica en distintos handlers.

**Por qué las demás no:**
- **A)** `useReducer` no es global; sigue siendo local al componente.
- **C)** Las actualizaciones de estado en React son sincrónicas; el reducer no es async.
- **D)** El reducer debe devolver un estado nuevo sin mutar el anterior.

</details>

---

### Pregunta 12

El carrito envía el pedido al backend:

```jsx
const res = await fetch('https://unir-eats-repaso.com/api/orders', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ items }),
});

if (res.ok) {
  router.push('/orders/confirm');
} else {
  Alert.alert('Error', 'No se pudo realizar el pedido');
}
```

¿Qué verifica exactamente `res.ok`?

A) Que la respuesta tiene un cuerpo JSON válido y parseable.

B) Que el código de estado HTTP está en el rango 200-299 (éxito), por lo que el `if` actúa como comprobación de éxito antes de navegar.

C) Que los headers de la respuesta incluyen `Content-Type: application/json`.

D) Que la petición tardó menos de 1 segundo en resolverse y no hubo timeout.

<details>
<summary><strong>Ver solución</strong></summary>

✅ **Respuesta correcta: B**

**Por qué es correcta:** `res.ok` es una propiedad de la interfaz `Response` que devuelve `true` cuando el código de estado HTTP está entre 200 y 299 (inclusive). Es una forma conveniente de comprobar si la petición fue exitosa antes de procesar la respuesta.

**Por qué las demás no:**
- **A)** No verifica el formato del cuerpo; eso requiere `res.json()` y un `try/catch` si el cuerpo no es JSON.
- **C)** No inspecciona los headers de respuesta.
- **D)** No tiene relación con el tiempo de respuesta ni con timeouts de red.

</details>

---

### Pregunta 13

Tras confirmar el pedido, el usuario puede compartir el ticket digital con `expo-sharing`:

```jsx
import * as Sharing from 'expo-sharing';

const shareTicket = async (ticketUri) => {
  const available = await Sharing.isAvailableAsync();
  if (!available) {
    Alert.alert('No disponible', 'Compartir no está soportado aquí.');
    return;
  }
  await Sharing.shareAsync(ticketUri);
};
```

¿Qué ocurre exactamente al llamar `shareAsync(ticketUri)` en un dispositivo móvil nativo (iOS/Android)?

A) Abre el **Share Sheet** nativo del sistema operativo para que el usuario elija la app destino (mensajería, email, etc.).

B) Sube automáticamente el archivo a un servidor de Expo y devuelve una URL pública para compartir.

C) Solo funciona si la app ha solicitado previamente el permiso de escritura en almacenamiento externo; de lo contrario falla silenciosamente.

D) Convierte el archivo a texto plano antes de enviarlo al sistema de compartir.

<details>
<summary><strong>Ver solución</strong></summary>

✅ **Respuesta correcta: A**

**Por qué es correcta:** `Sharing.shareAsync` invoca la interfaz nativa de compartir del sistema operativo (Share Sheet en iOS, Intent de compartir en Android), permitiendo al usuario elegir entre las apps instaladas.

**Por qué las demás no:**
- **B)** No sube nada a servidores de Expo; opera localmente con el archivo del dispositivo.
- **C)** No requiere permiso de escritura previo; el SO gestiona el acceso de lectura temporal para el Share Sheet.
- **D)** No transforma el formato del archivo; lo comparte tal cual.

</details>

---

### Pregunta 14

El listado de pedidos implementa pull-to-refresh:

```jsx
const [refreshing, setRefreshing] = useState(false);

const onRefresh = async () => {
  setRefreshing(true);
  const next = await fetchOrders();
  setOrders(next);
  setRefreshing(false);
};

<FlatList
  data={orders}
  renderItem={({ item }) => <OrderCard order={item} />}
  keyExtractor={item => item.id}
  refreshing={refreshing}
  onRefresh={onRefresh}
/>
```

¿Qué ocurre exactamente cuando `refreshing={true}`?

A) React Native bloquea la interacción de la lista y muestra el indicador de carga nativo en la parte superior hasta que `refreshing` vuelva a `false`.

B) `FlatList` desmonta todos los elementos y los vuelve a montar desde cero para forzar una actualización limpia.

C) El prop `onRefresh` se ejecuta de forma automática y continuamente mientras `refreshing` sea `true`.

D) Cambia el color de fondo de la lista a gris para indicar visualmente que los datos pueden estar desactualizados.

<details>
<summary><strong>Ver solución</strong></summary>

✅ **Respuesta correcta: A**

**Por qué es correcta:** El par `refreshing` / `onRefresh` activa el control nativo de pull-to-refresh. Cuando `refreshing` es `true`, se muestra el spinner de carga en la parte superior de la lista y se bloquea la interacción de refresh hasta que la app establezca `refreshing` en `false`.

**Por qué las demás no:**
- **B)** No desmonta los elementos; solo muestra el indicador de carga.
- **C)** `onRefresh` se dispara solo una vez al hacer el gesto de pull; no se ejecuta continuamente.
- **D)** No altera el color de fondo de la lista; el feedback es el spinner nativo.

</details>

---

### Pregunta 15

El equipo quiere añadir escaneo de código QR para leer los tickets de pedido. Consideran usar `expo-camera` con la función de barcode scanning en el flujo de desarrollo. ¿Qué limitación tiene **Expo Go** respecto a un **development build** en este escenario?

A) Expo Go no soporta ningún módulo de Expo; solo permite probar componentes visuales básicos.

B) Expo Go incluye un conjunto fijo de módulos nativos precompilados; si `expo-camera` requiere una versión específica o configuración nativa adicional, puede ser necesario un development build para acceder a todas sus funcionalidades o para evitar conflictos de versiones.

C) Expo Go ejecuta la app en un WebView, por lo que el acceso a la cámara nativa está bloqueado completamente.

D) Development build es solo un entorno de producción; no permite pruebas en desarrollo.

<details>
<summary><strong>Ver solución</strong></summary>

✅ **Respuesta correcta: B**

**Por qué es correcta:** Expo Go contiene una versión predefinida del runtime nativo de Expo. Algunos módulos con requisitos nativos específicos o versiones más recientes pueden no funcionar correctamente (o requerir configuración extra) dentro de Expo Go, siendo necesario generar un development build con `expo-dev-client` para tener control total sobre los módulos nativos.

**Por qué las demás no:**
- **A)** Expo Go soporta muchos módulos de Expo estándar; no se limita a componentes visuales.
- **C)** Expo Go no usa WebView; ejecuta código nativo real, aunque con un runtime predefinido.
- **D)** El development build está precisamente pensado para desarrollo y pruebas con módulos nativos personalizados.

</details>

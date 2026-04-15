# Ejercicio 1 — Componentes Básicos y Navegación Simulada por Estado

## Objetivo

Construir una aplicación **UNIR Cinema** con **4 vistas** intercambiables mediante una **barra de pestañas superior** compuesta por `Pressable`. La navegación entre vistas se gestionará con una **variable de estado** (`useState`), sin usar ninguna librería de navegación.

A lo largo del ejercicio se practicarán los componentes y APIs fundamentales de React Native, se crearán **componentes funcionales personalizados reutilizables** y se trabajará con datos de ejemplo (50 películas).

---

## Conceptos previos

### Navegación simulada por estado

Antes de usar librerías como React Navigation, podemos simular el cambio de pantallas con un simple estado:

```jsx
const [vista, setVista] = useState('inicio');

// En el render — renderizado condicional:
{vista === 'inicio' && <InicioView />}
{vista === 'catalogo' && <CatalogoView />}
{vista === 'perfil' && <PerfilView />}
{vista === 'ajustes' && <AjustesView />}
```

El estado `vista` determina qué componente se muestra. Un grupo de `Pressable` en la parte superior permite cambiar ese estado.

---

### Componentes y APIs a utilizar

A continuación se resumen las APIs y componentes de React Native / Expo que **debes** utilizar en este ejercicio, junto con la vista en la que se espera su uso:

| Componente / API | Vista(s) sugerida(s) | Documentación |
|---|---|---|
| `View` | Todas | [View — React Native](https://reactnative.dev/docs/view) |
| `SafeAreaProvider`, `SafeAreaView` | `App.js` (envolvente global) | [react-native-safe-area-context](https://github.com/th3rdwave/react-native-safe-area-context#safeareaview) |
| `useSafeAreaInsets` | PerfilView | [useSafeAreaInsets](https://github.com/th3rdwave/react-native-safe-area-context#usesafeareainsets) |
| `ScrollView` | InicioView | [ScrollView — React Native](https://reactnative.dev/docs/scrollview) |
| `FlatList` | CatalogoView | [FlatList — React Native](https://reactnative.dev/docs/flatlist) |
| `Text` (`numberOfLines`, `ellipsizeMode`) | CatalogoView (sinopsis truncada) | [Text — React Native](https://reactnative.dev/docs/text) |
| `Text` (`selectable`) | PerfilView (datos copiables) | [Text — React Native](https://reactnative.dev/docs/text#selectable) |
| `Pressable` (`onPress`) | Todas (botones, pestañas) | [Pressable — React Native](https://reactnative.dev/docs/pressable) |
| `Pressable` (`onLongPress`) | AjustesView (acción peligrosa) | [Pressable — React Native](https://reactnative.dev/docs/pressable#onlongpress) |
| `Pressable` (`style` como función) | AjustesView (feedback visual) | [Pressable — React Native](https://reactnative.dev/docs/pressable#style) |
| `StatusBar` de `expo-status-bar` | `App.js` (`style="auto"`) | [expo-status-bar](https://docs.expo.dev/versions/latest/sdk/status-bar/) |
| `expo-haptics` | AjustesView | [expo-haptics](https://docs.expo.dev/versions/latest/sdk/haptics/) |
| `Animated` (rotación) | LoadingButton (spinner) | [Animated — React Native](https://reactnative.dev/docs/animated) |

---

### ScrollView vs FlatList

| Característica | `ScrollView` | `FlatList` |
|---|---|---|
| **Cuándo usarlo** | Contenido limitado y estático | Listas largas con muchos elementos |
| **Renderizado** | Renderiza **todos** los hijos a la vez | Solo renderiza los elementos **visibles** (virtualización) |
| **Performance** | Se degrada con muchos elementos | Optimizado para listas grandes |
| **Props clave** | `contentContainerStyle`, `showsVerticalScrollIndicator` | `data`, `renderItem`, `keyExtractor` |

> 📖 [ScrollView docs](https://reactnative.dev/docs/scrollview) · [FlatList docs](https://reactnative.dev/docs/flatlist)

---

### Text avanzado

```jsx
{/* Texto truncado a 2 líneas con puntos suspensivos al final */}
<Text numberOfLines={2} ellipsizeMode="tail">
  Esta sinopsis es muy larga y se cortará después de dos líneas...
</Text>

{/* Texto seleccionable (el usuario puede copiar) */}
<Text selectable>ana.martinez@unir.net</Text>
```

| Prop | Valores posibles | Efecto |
|---|---|---|
| `numberOfLines` | `{1}`, `{2}`, `{3}`... | Limita el número de líneas visibles |
| `ellipsizeMode` | `"head"`, `"middle"`, `"tail"`, `"clip"` | Dónde colocar los puntos suspensivos |
| `selectable` | `{true}` / `{false}` | Permite al usuario seleccionar y copiar el texto |

> 📖 [Text — React Native](https://reactnative.dev/docs/text)

---

### Pressable avanzado

```jsx
{/* onPress normal */}
<Pressable onPress={() => console.log('Pulsado')}>
  <Text>Pulsa aquí</Text>
</Pressable>

{/* onLongPress (pulsación larga) */}
<Pressable onLongPress={() => console.log('Pulsación larga')}>
  <Text>Mantén pulsado</Text>
</Pressable>

{/* style como función — recibe { pressed } */}
<Pressable
  onPress={handlePress}
  style={({ pressed }) => ({
    opacity: pressed ? 0.7 : 1,
    transform: [{ scale: pressed ? 0.98 : 1 }],
  })}
>
  <Text>Botón con feedback visual</Text>
</Pressable>
```

> 📖 [Pressable — React Native](https://reactnative.dev/docs/pressable)

---

### Animated — Rotación básica

Para crear un spinner (icono girando), se usa `Animated.Value`, `Animated.loop` y `interpolate`:

```jsx
import { Animated } from 'react-native';
import { useRef, useEffect } from 'react';

const spinValue = useRef(new Animated.Value(0)).current;

useEffect(() => {
  Animated.loop(
    Animated.timing(spinValue, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    })
  ).start();
}, []);

const spin = spinValue.interpolate({
  inputRange: [0, 1],
  outputRange: ['0deg', '360deg'],
});

// En el render:
<Animated.Text style={{ transform: [{ rotate: spin }] }}>⟳</Animated.Text>
```

> 📖 [Animated — React Native](https://reactnative.dev/docs/animated)

---

### expo-haptics

Permite generar vibraciones hápticas en dispositivos físicos:

```jsx
import * as Haptics from 'expo-haptics';

// Impacto (3 intensidades)
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

// Notificación (3 tipos)
Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
```

> ⚠️ Las vibraciones hápticas **solo funcionan en dispositivos físicos**, no en simuladores/emuladores.

> 📖 [expo-haptics](https://docs.expo.dev/versions/latest/sdk/haptics/)

---

### SafeAreaProvider, SafeAreaView y useSafeAreaInsets

```jsx
// En App.js — envuelve toda la app
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

<SafeAreaProvider>
  <SafeAreaView className="flex-1 bg-gray-900">
    {/* contenido */}
  </SafeAreaView>
</SafeAreaProvider>

// En una vista específica — obtener los insets manualmente
import { useSafeAreaInsets } from 'react-native-safe-area-context';

function MiVista() {
  const insets = useSafeAreaInsets();
  return (
    <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 16 }}>
      {/* contenido */}
    </ScrollView>
  );
}
```

> 📖 [react-native-safe-area-context](https://github.com/th3rdwave/react-native-safe-area-context)

---

### StatusBar de expo-status-bar

```jsx
import { StatusBar } from 'expo-status-bar';

// style="auto" adapta el color de la barra al tema del sistema
<StatusBar style="auto" />
```

> 📖 [expo-status-bar](https://docs.expo.dev/versions/latest/sdk/status-bar/)

---

## Parte 1 — Crear el proyecto y configurar

### 1.1 — Crear el proyecto

```bash
npx create-expo-app@latest --template blank mi-app-cine
cd mi-app-cine
```

### 1.2 — Instalar dependencias

```bash
npm install nativewind tailwindcss react-native-safe-area-context expo-status-bar expo-haptics
```

### 1.3 — Configurar NativeWind

Configura los archivos necesarios para NativeWind siguiendo la guía oficial:

👉 [https://www.nativewind.dev/docs/getting-started/installation](https://www.nativewind.dev/docs/getting-started/installation)

Archivos a crear/modificar:

| Archivo | Propósito |
|---|---|
| `tailwind.config.js` | Configurar Tailwind con rutas a `./App.js`, `./views/**/*.{js,jsx}`, `./components/**/*.{js,jsx}` |
| `babel.config.js` | Añadir `jsxImportSource: "nativewind"` y preset `"nativewind/babel"` |
| `metro.config.js` | Envolver config de Metro con `withNativeWind` |
| `global.css` | Directivas `@tailwind base/components/utilities` |
| `app.json` | Añadir `"bundler": "metro"` en la sección `web` |

### 1.4 — Crear `index.js`

```javascript
import { registerRootComponent } from 'expo';
import App from './App';

registerRootComponent(App);
```

> `registerRootComponent` es el punto de entrada que registra tu componente raíz. Es equivalente a `AppRegistry.registerComponent`.

---

## Parte 2 — Archivo de datos

Crea la carpeta `data/` y dentro un archivo `movies.js` que exporte un **array de 50 películas**. Cada película debe tener esta estructura:

```javascript
{
  id: 1,
  title: 'Título de la película',
  genre: 'Ciencia Ficción',
  year: 2024,
  director: 'Nombre del Director',
  rating: 8.5,
  synopsis: 'Una sinopsis lo suficientemente larga como para que al mostrarla con numberOfLines={2} se trunque visiblemente...'
}
```

> 💡 La sinopsis debe tener al menos 2-3 frases para que el truncado con `numberOfLines` sea evidente.

---

## Parte 3 — Componentes personalizados reutilizables

Crea la carpeta `components/` con los siguientes componentes:

### 3.1 — `TabBar.js`

Barra de pestañas horizontal en la parte superior de la app.

| Prop | Tipo | Descripción |
|---|---|---|
| `vistaActual` | `string` | La vista activa actualmente |
| `onCambiarVista` | `function` | Callback para cambiar de vista |

- Debe renderizar **4 `Pressable`** en fila, uno por cada vista.
- La pestaña activa debe tener un estilo diferente (color de fondo distinto).
- Cada pestaña muestra un emoji y un texto.

### 3.2 — `Card.js`

Tarjeta genérica reutilizable que envuelve contenido con un estilo de "card".

| Prop | Tipo | Descripción |
|---|---|---|
| `children` | `node` | Contenido hijo |
| `className` | `string` | Clases adicionales de Tailwind (opcional) |

### 3.3 — `Banner.js`

Banner promocional destacado con título, subtítulo y botón de acción.

| Prop | Tipo | Descripción |
|---|---|---|
| `title` | `string` | Título principal |
| `subtitle` | `string` | Texto secundario |
| `buttonText` | `string` | Texto del botón (opcional) |
| `onPress` | `function` | Acción del botón |

### 3.4 — `ProfileCard.js`

Tarjeta de perfil del usuario con avatar (iniciales), nombre, email y biografía.

| Prop | Tipo | Descripción |
|---|---|---|
| `name` | `string` | Nombre del usuario |
| `email` | `string` | Email (debe ser seleccionable) |
| `bio` | `string` | Biografía (debe ser seleccionable) |

- El **email** y la **bio** deben usar la prop `selectable` de `Text`.
- El avatar se genera con las iniciales del nombre.

### 3.5 — `MovieItem.js`

Elemento individual para renderizar dentro de `FlatList`.

| Prop | Tipo | Descripción |
|---|---|---|
| `movie` | `object` | Objeto de película |
| `onPress` | `function` | Callback al pulsar |

- Debe usar el componente `Card` internamente.
- La **sinopsis** se muestra con `numberOfLines={2}` y `ellipsizeMode="tail"`.
- Al pulsar, se invoca `onPress` con la película completa.

### 3.6 — `LoadingButton.js`

Botón que muestra un estado de carga con un **spinner animado** (flechas girando).

| Prop | Tipo | Descripción |
|---|---|---|
| `title` | `string` | Texto del botón |
| `loading` | `boolean` | Si está en estado de carga |
| `onPress` | `function` | Callback al pulsar |

- Cuando `loading` es `true`:
  - El texto cambia a "Cargando..."
  - Se muestra un carácter **⟳** girando usando `Animated` (rotación 0° → 360° en bucle).
  - El botón no responde a pulsaciones.
  - El fondo cambia a un color más apagado.
- Debe usar `Pressable` con `style` como **función** para dar feedback visual al pulsar (`pressed`).

---

## Parte 4 — Las 4 vistas

Crea la carpeta `views/` con los siguientes componentes funcionales:

### 4.1 — `InicioView.js` (Inicio)

| Requisito | API/Componente |
|---|---|
| Scroll vertical del contenido | `ScrollView` |
| Banner promocional | Componente `Banner` |
| Tarjetas de películas destacadas | Componente `Card` |
| Título de bienvenida | `Text` |

- Muestra un título "🎬 UNIR Cinema" en grande.
- Debajo, un `Banner` con un mensaje promocional.
- Luego, una sección "Destacados" con 3-4 `Card` mostrando películas estáticas.
- Todo dentro de un `ScrollView`.

### 4.2 — `CatalogoView.js` (Catálogo)

| Requisito | API/Componente |
|---|---|
| Lista de 50 películas | `FlatList` con datos de `data/movies.js` |
| Cada elemento | Componente `MovieItem` |
| Sinopsis truncada | `Text` con `numberOfLines` y `ellipsizeMode` |
| Detalle al pulsar | `Pressable` con `onPress` → `Alert.alert` |

- Importa el array de películas desde `data/movies.js`.
- Renderiza una `FlatList` con `MovieItem` como `renderItem`.
- Al pulsar una película, muestra un `Alert` con toda la información.

### 4.3 — `PerfilView.js` (Perfil)

| Requisito | API/Componente |
|---|---|
| Insets manuales | `useSafeAreaInsets` |
| Tarjeta de perfil | Componente `ProfileCard` |
| Texto copiable | `Text` con `selectable` |
| Botón con carga | Componente `LoadingButton` |

- Usa `useSafeAreaInsets()` para obtener los insets y aplicar `paddingBottom` manualmente.
- Muestra un `ProfileCard` con datos de ejemplo.
- Incluye una sección de "Información de contacto" con textos seleccionables.
- Un `LoadingButton` que al pulsarlo entra en estado de carga durante 3 segundos.
- Opcionalmente, una sección de "Estadísticas" con `Card`.

### 4.4 — `AjustesView.js` (Ajustes)

| Requisito | API/Componente |
|---|---|
| Pulsación larga | `Pressable` con `onLongPress` |
| Feedback visual al pulsar | `Pressable` con `style` como función |
| Vibraciones hápticas | `expo-haptics` |
| Componente local | `SettingRow` (definido dentro del archivo) |

- Crea un componente local `SettingRow` con props `emoji`, `title`, `subtitle`, `onPress`, `onLongPress` y `destructive`.
- `SettingRow` usa `Pressable` con `style` como **función** para cambiar `opacity` y `scale` al pulsar.
- Sección "Haptics": varios `SettingRow` que al pulsar ejecutan diferentes tipos de vibración háptica (`impactAsync` con Light/Medium/Heavy y `notificationAsync` con Success/Warning/Error).
- Sección "Zona de peligro": un `SettingRow` con `onLongPress` para "Restablecer ajustes" que ejecuta una vibración de advertencia.
- El `onPress` simple del botón peligroso muestra un `Alert` indicando que debe mantener pulsado.

---

## Parte 5 — App.js

Construye el componente principal `App.js` que:

1. Importa `./global.css` (NativeWind).
2. Usa `SafeAreaProvider` y `SafeAreaView` como contenedores raíz.
3. Incluye `<StatusBar style="auto" />` de `expo-status-bar`.
4. Declara un estado `vistaActual` con `useState('inicio')`.
5. Renderiza el componente `TabBar` pasándole `vistaActual` y `onCambiarVista`.
6. Según el valor de `vistaActual`, renderiza la vista correspondiente (InicioView, CatalogoView, PerfilView o AjustesView).

---

## Estructura final esperada

```
mi-app-cine/
  index.js
  App.js
  app.json
  babel.config.js
  metro.config.js
  tailwind.config.js
  global.css
  package.json
  data/
    movies.js
  components/
    TabBar.js
    Card.js
    Banner.js
    ProfileCard.js
    MovieItem.js
    LoadingButton.js
  views/
    InicioView.js
    CatalogoView.js
    PerfilView.js
    AjustesView.js
```

---

## Checklist de APIs practicadas

Antes de dar por finalizado el ejercicio, verifica que has usado:

- [ ] `View`
- [ ] `SafeAreaProvider` + `SafeAreaView`
- [ ] `useSafeAreaInsets`
- [ ] `ScrollView`
- [ ] `FlatList` (con 50 elementos)
- [ ] `Text` con `numberOfLines` y `ellipsizeMode`
- [ ] `Text` con `selectable`
- [ ] `Pressable` con `onPress`
- [ ] `Pressable` con `onLongPress`
- [ ] `Pressable` con `style` como función (`{ pressed }`)
- [ ] `StatusBar` de `expo-status-bar` con `style="auto"`
- [ ] `expo-haptics` (`impactAsync` y `notificationAsync`)
- [ ] `Animated` (rotación en bucle para spinner)
- [ ] `useState` para navegación simulada
- [ ] Al menos 6 componentes funcionales personalizados

---

## Referencias técnicas

| Recurso | Enlace |
|---|---|
| View | https://reactnative.dev/docs/view |
| Text | https://reactnative.dev/docs/text |
| ScrollView | https://reactnative.dev/docs/scrollview |
| FlatList | https://reactnative.dev/docs/flatlist |
| Pressable | https://reactnative.dev/docs/pressable |
| Animated | https://reactnative.dev/docs/animated |
| SafeAreaView / SafeAreaProvider | https://github.com/th3rdwave/react-native-safe-area-context |
| useSafeAreaInsets | https://github.com/th3rdwave/react-native-safe-area-context#usesafeareainsets |
| expo-status-bar | https://docs.expo.dev/versions/latest/sdk/status-bar/ |
| expo-haptics | https://docs.expo.dev/versions/latest/sdk/haptics/ |
| NativeWind (instalación) | https://www.nativewind.dev/docs/getting-started/installation |
| Tailwind CSS (clases) | https://tailwindcss.com/docs |


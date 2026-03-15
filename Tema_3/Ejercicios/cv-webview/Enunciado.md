# Ejercicio — CV Online con React Native WebView

## Conceptos previos

### ¿Qué es `react-native-webview`?

`react-native-webview` es un componente de React Native que permite **incrustar un navegador web dentro de una aplicación nativa**. Es el equivalente al `<iframe>` del mundo web, pero para móvil. Con él puedes cargar cualquier URL o contenido HTML directamente en tu app, de forma que el usuario lo experimenta como parte de la aplicación nativa sin necesidad de abrir un navegador externo.

Es especialmente útil cuando ya tienes una web existente y quieres envolverla en una app móvil, o cuando quieres mostrar contenido web dinámico sin replicar toda la lógica en React Native.

```bash
# Se instala como cualquier otro paquete de Expo
npx expo install react-native-webview
```

Uso básico:

```jsx
import WebView from 'react-native-webview';

<WebView source={{ uri: 'https://tu-web.vercel.app' }} />
```

👉 Documentación oficial: [https://github.com/react-native-webview/react-native-webview](https://github.com/react-native-webview/react-native-webview)

---

### ¿Qué es `react-native-safe-area-context`?

Los dispositivos móviles modernos tienen zonas del sistema que "recortan" la pantalla: el **notch**, la **isla dinámica**, la **barra de estado** o la **barra de navegación inferior**. Si posicionas contenido en esas zonas, quedará oculto o inutilizable.

`react-native-safe-area-context` proporciona `SafeAreaProvider` y `SafeAreaView`, que **delimitan automáticamente el área segura** del dispositivo para que tu contenido siempre sea visible y accesible, sin importar el modelo de teléfono.

```jsx
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

<SafeAreaProvider>
  <SafeAreaView style={{ flex: 1 }}>
    {/* Tu contenido aquí, siempre dentro del área segura */}
  </SafeAreaView>
</SafeAreaProvider>
```

👉 Documentación oficial: [https://docs.expo.dev/versions/latest/sdk/safe-area-context/](https://docs.expo.dev/versions/latest/sdk/safe-area-context/)

---

## Parte 1 — Crear tu CV como SPA con React y desplegarlo en Vercel

Antes de construir la app móvil necesitas tener **una web que mostrar**. Para ello vas a crear una pequeña SPA (Single Page Application) que funcione como tu **CV online**.

### 1.1 — Prototipa con ayuda de IA

Usa el asistente de IA de tu elección (ChatGPT, GitHub Copilot, Claude...) para generar rápidamente una SPA en **React con React Router** que incluya las siguientes secciones/rutas:

| Ruta | Vista | Contenido |
|---|---|---|
| `/` | Vista general | Foto, nombre, puesto actual y un breve resumen |
| `/educacion` | Educación | Tus estudios, títulos, cursos relevantes |
| `/experiencia` | Experiencia profesional | Tus trabajos, proyectos y responsabilidades |

La SPA debe tener una barra de navegación que permita moverse entre las tres vistas.

> 💡 **Consejo:** Puedes pedir a la IA algo como: *"Crea una SPA en React con React Router que sirva como CV online, con rutas para inicio, educación y experiencia profesional. Usa estilos inline o CSS básico."*

### 1.2 — Despliega en Vercel

Una vez que la SPA funcione correctamente en local, despliégala en **Vercel** de forma gratuita:

1. Sube el proyecto a un repositorio de **GitHub**.
2. Entra en [https://vercel.com](https://vercel.com) e inicia sesión con tu cuenta de GitHub.
3. Haz clic en **"Add New Project"** e importa tu repositorio.
4. Vercel detectará automáticamente que es un proyecto React. Haz clic en **Deploy**.
5. En unos segundos tendrás una URL pública del tipo `https://tu-cv.vercel.app`.

> ✅ Guarda esa URL, la necesitarás en la siguiente parte.

---

## Parte 2 — Construir la app WebView con React Native y Expo

Con tu CV desplegado en Vercel, ahora vas a construir la aplicación móvil que lo muestre usando `react-native-webview`.

Crea un nuevo proyecto de Expo:

```bash
npx create-expo-app@latest --template blank mi-cv-webview
cd mi-cv-webview
```

Instala las dependencias necesarias:

```bash
npx expo install react-native-webview react-native-safe-area-context
```

### 2.1 — Versión básica (sin navegación asistida)

Crea un componente `App.js` que cargue tu URL de Vercel dentro de un `WebView`, usando `SafeAreaProvider` y `SafeAreaView` para respetar las zonas seguras del dispositivo.

Toma como referencia el archivo `EmptyApp.js` del código de apoyo de la asignatura.

### 2.2 — Versión con navegación asistida *(opcional)*

Amplía la app añadiendo una barra de navegación inferior con tres botones: **Atrás**, **Recargar** y **Adelante**. Para ello deberás:

- Usar `useRef` para obtener una referencia al componente `WebView`.
- Usar `useState` para controlar si el usuario puede navegar hacia atrás o hacia adelante.
- Usar el evento `onNavigationStateChange` del `WebView` para actualizar ese estado.
- Deshabilitar visualmente los botones cuando no estén disponibles.

Toma como referencia el archivo `AppWithNavigation.js` del código de apoyo de la asignatura.

### 2.3 — Registrar los componentes

En el archivo `index.js` de tu proyecto, registra el componente que quieras usar como punto de entrada de la app con `registerRootComponent`.

---

## Entregable

- URL pública de tu CV desplegado en Vercel.
- Captura de pantalla del simulador mostrando tu CV dentro de la app React Native.

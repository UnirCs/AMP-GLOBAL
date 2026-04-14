# Ejercicio 2 — Fuentes personalizadas con expo-font y NativeWind

## Objetivo

Aprender a **instalar y cargar fuentes personalizadas de Google Fonts** en un proyecto Expo con NativeWind, registrarlas en la configuración de Tailwind y utilizarlas con clases `font-*` en los componentes.

---

## Conceptos previos

### ¿Por qué fuentes personalizadas?

React Native no incluye las fuentes del sistema web (Roboto, Inter, Montserrat...). Por defecto solo tienes acceso a la fuente del sistema operativo. Para usar cualquier otra fuente necesitas:

1. **Descargar el archivo `.ttf`** (o `.otf`) de la fuente.
2. **Cargarla en tiempo de ejecución** con `expo-font`.
3. **Registrarla en Tailwind** para poder usarla con clases.

### ¿Qué es `expo-font`?

`expo-font` es el paquete oficial de Expo para cargar fuentes personalizadas. Proporciona el hook `useFonts` que:

- **Carga las fuentes de forma asíncrona** al iniciar la app.
- Devuelve `[fontsLoaded, error]` para saber cuándo están listas.
- Mientras no estén cargadas, debes mostrar una pantalla de carga o `null`.

```jsx
import { useFonts } from "expo-font";

const [fontsLoaded, error] = useFonts({
  "MiFuente": require("./assets/fonts/MiFuente-Regular.ttf"),
});

if (!fontsLoaded && !error) return null; // Esperar a que carguen
```

### ¿Cómo se integra con NativeWind?

Una vez cargada la fuente con `useFonts`, debes registrarla en `tailwind.config.js` para poder usarla como clase:

```javascript
// tailwind.config.js
theme: {
  extend: {
    fontFamily: {
      "mi-fuente": ["MiFuente", "sans-serif"],
    },
  },
},
```

Después la usas con la clase `font-mi-fuente`:

```jsx
<Text className="font-mi-fuente text-xl">Texto con fuente personalizada</Text>
```

> ⚠️ **Importante**: El nombre que uses en `useFonts` (clave del objeto) **debe coincidir** con el primer valor del array en `fontFamily` de Tailwind.

### ¿Dónde descargar fuentes?

Google Fonts ofrece cientos de fuentes gratuitas: [https://fonts.google.com](https://fonts.google.com)

Algunas sugerencias interesantes para una app:

| Fuente | Estilo | URL |
|---|---|---|
| **Rasa** | Serif elegante | [fonts.google.com/specimen/Rasa](https://fonts.google.com/specimen/Rasa) |
| **Poppins** | Sans-serif moderna | [fonts.google.com/specimen/Poppins](https://fonts.google.com/specimen/Poppins) |
| **Playfair Display** | Serif editorial | [fonts.google.com/specimen/Playfair+Display](https://fonts.google.com/specimen/Playfair+Display) |
| **Space Grotesk** | Sans-serif técnica | [fonts.google.com/specimen/Space+Grotesk](https://fonts.google.com/specimen/Space+Grotesk) |
| **Caveat** | Manuscrita casual | [fonts.google.com/specimen/Caveat](https://fonts.google.com/specimen/Caveat) |

Para descargar:
1. Ve a la página de la fuente en Google Fonts.
2. Haz clic en **"Download family"** (arriba a la derecha).
3. Descomprime el ZIP y copia los archivos `.ttf` que necesites a tu proyecto.

---

## Parte 1 — Preparar el proyecto

Parte de un proyecto Expo con NativeWind ya configurado (puedes continuar desde el Ejercicio 1 o crear uno nuevo).

### 1.1 — Instalar `expo-font`

```bash
npx expo install expo-font
```

### 1.2 — Añadir el plugin en `app.json`

Asegúrate de que `expo-font` aparezca en la sección `plugins`:

```json
{
  "expo": {
    "plugins": ["expo-font"]
  }
}
```

### 1.3 — Descargar una fuente de Google Fonts

1. Elige **una fuente de Google Fonts** que te guste (o usa [Rasa](https://fonts.google.com/specimen/Rasa) como ejemplo).
2. Descarga la familia y extrae el archivo `.ttf` variable o los pesos que quieras.
3. Crea la carpeta `assets/fonts/` en tu proyecto y copia allí los archivos `.ttf`.

---

## Parte 2 — Cargar y usar la fuente

### 2.1 — Cargar la fuente con `useFonts`

En tu componente principal (`App.js`), usa el hook `useFonts` para cargar la fuente. Mientras no esté cargada, no renderices nada (devuelve `null`).

### 2.2 — Registrar la fuente en `tailwind.config.js`

Añade la fuente dentro de `theme.extend.fontFamily` con un nombre descriptivo.

### 2.3 — Usar la fuente con clases de Tailwind

Aplica la clase `font-<nombre>` en los componentes `<Text>` donde quieras usar la fuente personalizada.

---

## Parte 3 — Diseñar una pantalla tipográfica

Construye una pantalla que **demuestre el uso de la fuente personalizada** y combine diferentes tamaños, pesos y estilos. La pantalla debe incluir:

1. **Encabezado grande** con la fuente personalizada.
2. **Subtítulo** con la fuente personalizada en un tamaño menor.
3. **Párrafo** con la fuente del sistema para comparar.
4. **Tarjetas** que mezclen la fuente personalizada (títulos) con la del sistema (cuerpo).
5. **Muestra tipográfica**: listado de diferentes tamaños de la fuente (`text-sm`, `text-base`, `text-lg`, `text-xl`, `text-2xl`, `text-3xl`).

### Patrones de diseño sugeridos

#### Hero tipográfico

```jsx
<View className="items-center py-8">
  <Text className="font-mi-fuente text-4xl text-gray-900">Título Grande</Text>
  <Text className="font-mi-fuente text-lg text-gray-500 mt-2">Subtítulo elegante</Text>
</View>
```

#### Escala tipográfica

Muestra la misma fuente en todos los tamaños para apreciar su forma:

```jsx
{["text-xs", "text-sm", "text-base", "text-lg", "text-xl", "text-2xl", "text-3xl"].map((size) => (
  <Text className={`font-mi-fuente ${size} text-gray-800 mb-2`}>
    {size} — La tipografía importa
  </Text>
))}
```

#### Comparativa fuente personalizada vs sistema

```jsx
<View className="flex-row gap-4">
  <View className="flex-1 bg-white rounded-xl p-4 border border-gray-200">
    <Text className="font-mi-fuente text-lg font-bold mb-2">Personalizada</Text>
    <Text className="font-mi-fuente text-sm text-gray-600">Lorem ipsum dolor sit amet</Text>
  </View>
  <View className="flex-1 bg-white rounded-xl p-4 border border-gray-200">
    <Text className="text-lg font-bold mb-2">Sistema</Text>
    <Text className="text-sm text-gray-600">Lorem ipsum dolor sit amet</Text>
  </View>
</View>
```

---


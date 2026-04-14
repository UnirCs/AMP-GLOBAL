# Solución — Instalación de NativeWind y CV con Tailwind

---

## Paso 1 — Crear el proyecto

```bash
npx create-expo-app@latest --template blank mi-cv-nativewind
cd mi-cv-nativewind
```

---

## Paso 2 — Instalar dependencias

```bash
npm install nativewind tailwindcss
```

> Esto añade NativeWind (el puente entre Tailwind y React Native) y Tailwind CSS (el motor de utilidades CSS).

---

## Paso 3 — Crear `tailwind.config.js`

```bash
npx tailwindcss init
```

Edita el archivo generado:

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.js", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

**¿Qué hace cada campo?**

- `content`: indica a Tailwind en qué archivos buscar clases. Solo genera CSS para las clases que realmente uses en esos archivos.
- `presets: [require("nativewind/preset")]`: carga la configuración base de NativeWind que adapta Tailwind para React Native (ajusta unidades, sombras, etc.).

---

## Paso 4 — Crear `global.css`

Crea el archivo `global.css` en la raíz del proyecto:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

Estas tres directivas le indican a Tailwind que inyecte sus estilos base, componentes reutilizables y las clases utilitarias.

---

## Paso 5 — Configurar `babel.config.js`

Reemplaza el contenido del archivo:

```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
  };
};
```

**¿Qué hace cada parte?**

- `jsxImportSource: "nativewind"`: cambia el runtime de JSX para que NativeWind intercepte la prop `className` y la convierta en `style`.
- `"nativewind/babel"`: preset que transforma las clases de Tailwind en estilos nativos en tiempo de compilación.

---

## Paso 6 — Configurar `metro.config.js`

Crea el archivo `metro.config.js` en la raíz:

```javascript
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { input: "./global.css" });
```

**¿Qué hace?**

- Obtiene la configuración por defecto de Metro para Expo.
- La envuelve con `withNativeWind` para que Metro sepa procesar el CSS de Tailwind usando `global.css` como punto de entrada.

---

## Paso 7 — Configurar `app.json`

Asegúrate de que la sección `web` incluya `"bundler": "metro"`:

```json
{
  "expo": {
    "name": "mi-cv-nativewind",
    "slug": "mi-cv-nativewind",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "userInterfaceStyle": "light",
    "splash": {
      "image": "./assets/splash-icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#ffffff"
    },
    "ios": {
      "supportsTablet": true
    },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#ffffff"
      }
    },
    "web": {
      "favicon": "./assets/favicon.png",
      "bundler": "metro"
    }
  }
}
```

> `"bundler": "metro"` garantiza que la web también use Metro como bundler (en lugar de Webpack), para que la configuración de NativeWind aplique en todas las plataformas.

---

## Paso 8 — Crear `App.js` con el CV

```jsx
import { Text, View, Pressable, ScrollView, Linking } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import "./global.css";

// ── Datos del CV ──────────────────────────────────────────────
const perfil = {
  nombre: "María García López",
  titulo: "Desarrolladora Full-Stack",
  resumen:
    "Ingeniera de software con 4 años de experiencia en desarrollo web y móvil. Apasionada por React Native, la accesibilidad y el diseño de interfaces limpias.",
};

const estudios = [
  {
    titulo: "Máster en Ingeniería del Software",
    centro: "UNIR — La Universidad en Internet",
    anio: "2022 – 2023",
  },
  {
    titulo: "Grado en Ingeniería Informática",
    centro: "Universidad Politécnica de Madrid",
    anio: "2017 – 2021",
  },
];

const experiencia = [
  {
    puesto: "Frontend Developer",
    empresa: "Tech Solutions S.L.",
    periodo: "2023 – Actualidad",
    descripcion:
      "Desarrollo de aplicaciones móviles con React Native y Expo para clientes del sector salud.",
  },
  {
    puesto: "Junior Web Developer",
    empresa: "Digital Agency",
    periodo: "2021 – 2023",
    descripcion:
      "Creación de SPAs con React, integración de APIs REST y despliegue en Vercel.",
  },
];

const habilidades = [
  "React Native",
  "NativeWind",
  "TypeScript",
  "Node.js",
  "Firebase",
  "Tailwind CSS",
  "Git",
  "Figma",
];

// ── Componentes auxiliares ────────────────────────────────────

function SeccionTitulo({ emoji, texto }) {
  return (
    <View className="mb-4 mt-6">
      <Text className="text-xl font-bold text-gray-900">
        {emoji} {texto}
      </Text>
      <View className="w-12 h-1 bg-blue-500 rounded-full mt-1" />
    </View>
  );
}

function Tarjeta({ children }) {
  return (
    <View className="bg-white rounded-xl p-4 mb-3 border border-gray-200 shadow-sm">
      {children}
    </View>
  );
}

function Badge({ texto }) {
  return (
    <View className="bg-blue-100 px-3 py-1 rounded-full">
      <Text className="text-blue-700 text-xs font-medium">{texto}</Text>
    </View>
  );
}

// ── Componente principal ──────────────────────────────────────

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-gray-50">
        <ScrollView className="flex-1 px-5 py-4">

          {/* ── Cabecera ── */}
          <View className="items-center mb-6">
            <View className="w-24 h-24 rounded-full bg-blue-600 items-center justify-center mb-3">
              <Text className="text-white text-3xl font-bold">MG</Text>
            </View>
            <Text className="text-2xl font-bold text-gray-900">
              {perfil.nombre}
            </Text>
            <Text className="text-base text-blue-600 font-semibold mt-1">
              {perfil.titulo}
            </Text>
          </View>

          {/* ── Sobre mí ── */}
          <SeccionTitulo emoji="👋" texto="Sobre mí" />
          <Tarjeta>
            <Text className="text-sm text-gray-700 leading-5">
              {perfil.resumen}
            </Text>
          </Tarjeta>

          {/* ── Educación ── */}
          <SeccionTitulo emoji="🎓" texto="Educación" />
          {estudios.map((item, i) => (
            <Tarjeta key={i}>
              <Text className="text-base font-bold text-gray-900">
                {item.titulo}
              </Text>
              <Text className="text-sm text-gray-500 mt-1">{item.centro}</Text>
              <Text className="text-xs text-blue-600 font-semibold mt-1">
                {item.anio}
              </Text>
            </Tarjeta>
          ))}

          {/* ── Experiencia ── */}
          <SeccionTitulo emoji="💼" texto="Experiencia" />
          {experiencia.map((item, i) => (
            <Tarjeta key={i}>
              <Text className="text-base font-bold text-gray-900">
                {item.puesto}
              </Text>
              <Text className="text-sm text-gray-500 mt-1">
                {item.empresa}
              </Text>
              <Text className="text-xs text-blue-600 font-semibold mt-1">
                {item.periodo}
              </Text>
              <Text className="text-sm text-gray-700 mt-2 leading-5">
                {item.descripcion}
              </Text>
            </Tarjeta>
          ))}

          {/* ── Habilidades ── */}
          <SeccionTitulo emoji="🛠" texto="Habilidades" />
          <View className="flex-row flex-wrap gap-2 mb-4">
            {habilidades.map((skill, i) => (
              <Badge key={i} texto={skill} />
            ))}
          </View>

          {/* ── Botón de contacto ── */}
          <Pressable
            className="bg-blue-600 px-6 py-4 rounded-xl items-center mt-4 mb-10 shadow-lg shadow-blue-500/50"
            onPress={() => Linking.openURL("mailto:maria@example.com")}
          >
            <Text className="text-white text-base font-bold">
              ✉️  Contactar por email
            </Text>
          </Pressable>

        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
```

---

## Paso 9 — Configurar `index.js`

```javascript
import { registerRootComponent } from "expo";
import App from "./App";

registerRootComponent(App);
```

---

## Paso 10 — Ejecutar

```bash
npx expo start
# Pulsa 'i' para iOS o 'a' para Android
```

---

## Estructura final del proyecto

```
mi-cv-nativewind/
  App.js
  app.json
  babel.config.js
  global.css
  index.js
  metro.config.js
  package.json
  tailwind.config.js
  assets/
    icon.png
    splash-icon.png
    adaptive-icon.png
    favicon.png
```

---

## Resumen de comandos

```bash
npx create-expo-app@latest --template blank mi-cv-nativewind
cd mi-cv-nativewind
npm install nativewind tailwindcss
npx tailwindcss init
# Configurar: tailwind.config.js, babel.config.js, metro.config.js, global.css, app.json
# Crear: App.js con el CV
npx expo start
```

---

## Patrones de diseño utilizados

| Patrón | Clases clave | Uso |
|---|---|---|
| **Card** | `bg-white rounded-xl p-4 border border-gray-200 shadow-sm` | Envolver cada entrada de estudios/experiencia |
| **Section header** | `text-xl font-bold` + barra `w-12 h-1 bg-blue-500 rounded-full` | Separar visualmente secciones |
| **Avatar placeholder** | `w-24 h-24 rounded-full bg-blue-600 items-center justify-center` | Iniciales en círculo como foto de perfil |
| **Badge / Pill** | `bg-blue-100 px-3 py-1 rounded-full` | Mostrar habilidades como etiquetas |
| **CTA Button** | `bg-blue-600 px-6 py-4 rounded-xl shadow-lg` | Botón de acción principal |
| **Flex wrap** | `flex-row flex-wrap gap-2` | Distribuir badges en múltiples líneas |


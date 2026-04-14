# Solución — Fuentes personalizadas con expo-font y NativeWind

---

## Paso 1 — Instalar `expo-font`

```bash
npx expo install expo-font
```

---

## Paso 2 — Añadir el plugin en `app.json`

```json
{
  "expo": {
    "plugins": ["expo-font"]
  }
}
```

---

## Paso 3 — Descargar la fuente

En este ejemplo usamos **Rasa** de Google Fonts:

1. Ve a [https://fonts.google.com/specimen/Rasa](https://fonts.google.com/specimen/Rasa).
2. Haz clic en **"Download family"**.
3. Descomprime el ZIP.
4. Copia `Rasa-VariableFont_wght.ttf` (o los pesos individuales que prefieras) a `assets/fonts/`.

```
assets/
  fonts/
    Rasa-VariableFont.ttf
```

---

## Paso 4 — Registrar la fuente en `tailwind.config.js`

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.js", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      fontFamily: {
        rasa: ["Rasa-VariableFont", "sans-serif"],
      },
    },
  },
  plugins: [],
};
```

> El nombre `"Rasa-VariableFont"` debe coincidir exactamente con la clave que usarás en `useFonts`.

---

## Paso 5 — Crear `App.js`

```jsx
import { Text, View, ScrollView } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { useFonts } from "expo-font";
import "./global.css";

// ── Datos de ejemplo ──────────────────────────────────────────

const escalaTipografica = [
  { clase: "text-xs", label: "text-xs (12px)" },
  { clase: "text-sm", label: "text-sm (14px)" },
  { clase: "text-base", label: "text-base (16px)" },
  { clase: "text-lg", label: "text-lg (18px)" },
  { clase: "text-xl", label: "text-xl (20px)" },
  { clase: "text-2xl", label: "text-2xl (24px)" },
  { clase: "text-3xl", label: "text-3xl (30px)" },
  { clase: "text-4xl", label: "text-4xl (36px)" },
];

// ── Componente principal ──────────────────────────────────────

export default function App() {
  const [fontsLoaded, error] = useFonts({
    "Rasa-VariableFont": require("./assets/fonts/Rasa-VariableFont.ttf"),
  });

  // Mientras las fuentes cargan, no renderizar nada
  if (!fontsLoaded && !error) return null;

  return (
    <SafeAreaProvider>
      <SafeAreaView className="flex-1 bg-gray-50">
        <ScrollView className="flex-1 px-5 py-4">

          {/* ── Hero tipográfico ── */}
          <View className="items-center py-8 mb-4">
            <Text className="font-rasa text-4xl text-gray-900 text-center">
              La tipografía importa
            </Text>
            <Text className="font-rasa text-lg text-gray-500 mt-2 text-center">
              Fuente Rasa de Google Fonts
            </Text>
            <View className="w-16 h-1 bg-blue-500 rounded-full mt-4" />
          </View>

          {/* ── Escala tipográfica ── */}
          <View className="mb-8">
            <Text className="text-xl font-bold text-gray-900 mb-1">
              📐 Escala tipográfica
            </Text>
            <View className="w-12 h-1 bg-blue-500 rounded-full mb-4" />

            <View className="bg-white rounded-xl p-5 border border-gray-200">
              {escalaTipografica.map((item, i) => (
                <View key={i} className="flex-row items-baseline justify-between mb-3">
                  <Text className={`font-rasa ${item.clase} text-gray-800`}>
                    Rasa Font
                  </Text>
                  <Text className="text-xs text-gray-400">{item.label}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* ── Comparativa: personalizada vs sistema ── */}
          <View className="mb-8">
            <Text className="text-xl font-bold text-gray-900 mb-1">
              🔀 Personalizada vs Sistema
            </Text>
            <View className="w-12 h-1 bg-blue-500 rounded-full mb-4" />

            <View className="flex-row gap-3">
              {/* Fuente personalizada */}
              <View className="flex-1 bg-white rounded-xl p-4 border border-blue-200">
                <View className="bg-blue-100 px-2 py-1 rounded self-start mb-3">
                  <Text className="text-blue-700 text-xs font-medium">
                    Rasa
                  </Text>
                </View>
                <Text className="font-rasa text-2xl text-gray-900 mb-2">
                  Elegante
                </Text>
                <Text className="font-rasa text-sm text-gray-600 leading-5">
                  Las fuentes serif aportan personalidad y carácter al diseño de tu app.
                </Text>
              </View>

              {/* Fuente del sistema */}
              <View className="flex-1 bg-white rounded-xl p-4 border border-gray-200">
                <View className="bg-gray-100 px-2 py-1 rounded self-start mb-3">
                  <Text className="text-gray-700 text-xs font-medium">
                    Sistema
                  </Text>
                </View>
                <Text className="text-2xl font-bold text-gray-900 mb-2">
                  Funcional
                </Text>
                <Text className="text-sm text-gray-600 leading-5">
                  La fuente del sistema es neutra, legible y familiar para el usuario.
                </Text>
              </View>
            </View>
          </View>

          {/* ── Tarjetas con fuente mixta ── */}
          <View className="mb-8">
            <Text className="text-xl font-bold text-gray-900 mb-1">
              🃏 Tarjetas con fuente mixta
            </Text>
            <View className="w-12 h-1 bg-blue-500 rounded-full mb-4" />

            <View className="bg-white rounded-xl p-5 border border-gray-200 mb-3">
              <Text className="font-rasa text-2xl text-gray-900 mb-2">
                Diseño con propósito
              </Text>
              <Text className="text-sm text-gray-600 leading-5">
                Combinar una fuente serif personalizada para títulos con la fuente
                del sistema para el cuerpo es un patrón clásico que mejora la
                jerarquía visual y la legibilidad.
              </Text>
            </View>

            <View className="bg-blue-600 rounded-xl p-5 mb-3">
              <Text className="font-rasa text-2xl text-white mb-2">
                Destaca lo importante
              </Text>
              <Text className="text-sm text-blue-100 leading-5">
                Los fondos de color con fuentes personalizadas en blanco crean
                secciones llamativas que captan la atención del usuario.
              </Text>
            </View>

            <View className="bg-gray-900 rounded-xl p-5 mb-3">
              <Text className="font-rasa text-2xl text-white mb-2">
                Modo oscuro elegante
              </Text>
              <Text className="text-sm text-gray-400 leading-5">
                Las fuentes serif funcionan especialmente bien en fondos oscuros,
                aportando sofisticación y contraste.
              </Text>
            </View>
          </View>

          {/* ── Cita destacada ── */}
          <View className="bg-gray-100 rounded-xl p-6 mb-10 border-l-4 border-blue-500">
            <Text className="font-rasa text-xl text-gray-800 italic leading-7">
              "La tipografía es la voz del diseño. Elegir la fuente correcta es
              tan importante como elegir las palabras correctas."
            </Text>
            <Text className="text-sm text-gray-500 mt-3">— Erik Spiekermann</Text>
          </View>

        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
```

---

## Paso 6 — Ejecutar

```bash
npx expo start
```

---

## Estructura del proyecto

```
mi-cv-nativewind/
  App.js                  ← Componente con useFonts y clases font-rasa
  app.json                ← Plugin expo-font registrado
  babel.config.js
  global.css
  index.js
  metro.config.js
  tailwind.config.js      ← fontFamily.rasa registrada
  assets/
    fonts/
      Rasa-VariableFont.ttf   ← Fuente descargada de Google Fonts
```

---

## Resumen del flujo de fuentes personalizadas

```
1. Descargar .ttf de Google Fonts
          │
          ▼
2. Copiar a assets/fonts/
          │
          ▼
3. useFonts({ "Nombre": require("./assets/fonts/Nombre.ttf") })
          │
          ▼
4. tailwind.config.js → fontFamily: { alias: ["Nombre"] }
          │
          ▼
5. className="font-alias" en los componentes <Text>
```

---

## Patrones de diseño utilizados

| Patrón | Clases clave | Uso |
|---|---|---|
| **Hero tipográfico** | `font-rasa text-4xl items-center py-8` | Encabezado grande centrado con la fuente personalizada |
| **Escala tipográfica** | `text-xs` a `text-4xl` con `font-rasa` | Mostrar todos los tamaños de la fuente |
| **Comparativa side-by-side** | `flex-row gap-3` con dos `flex-1` | Comparar fuente personalizada vs sistema |
| **Tarjeta con fondo de color** | `bg-blue-600 rounded-xl p-5` + texto blanco | Sección destacada |
| **Cita (blockquote)** | `border-l-4 border-blue-500 bg-gray-100 p-6 italic` | Cita tipográfica |
| **Badge de etiqueta** | `bg-blue-100 px-2 py-1 rounded self-start` | Indicar nombre de la fuente |

---

## Errores comunes

| Error | Causa | Solución |
|---|---|---|
| La fuente no se aplica | Nombre en `useFonts` ≠ nombre en `fontFamily` | Asegúrate de que coincidan exactamente |
| Pantalla en blanco | `fontsLoaded` es `false` y no devuelves `null` | Añade `if (!fontsLoaded && !error) return null` |
| `font-rasa` no hace efecto | `tailwind.config.js` no tiene `content` correcto | Verifica que `App.js` está incluido en `content` |
| Error al importar la fuente | Ruta del `require` incorrecta | Comprueba que el `.ttf` está en `assets/fonts/` |


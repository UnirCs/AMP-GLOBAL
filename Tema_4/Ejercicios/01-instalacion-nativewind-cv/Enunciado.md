# Ejercicio 1 — Instalación de NativeWind y CV con Tailwind

## Objetivo

Aprender a **instalar y configurar NativeWind desde cero** en un proyecto Expo siguiendo la guía oficial, y construir una primera pantalla que muestre un **CV personal** usando clases de Tailwind directamente en componentes de React Native.

---

## Conceptos previos

### ¿Qué es NativeWind?

NativeWind es una librería que permite usar **clases de Tailwind CSS** en React Native. En lugar de escribir objetos `StyleSheet.create(...)`, puedes usar la prop `className` directamente en tus componentes:

```jsx
// ❌ Sin NativeWind (estilo tradicional)
<View style={{ flex: 1, backgroundColor: '#fff', padding: 16 }}>
  <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Hola</Text>
</View>

// ✅ Con NativeWind (clases de Tailwind)
<View className="flex-1 bg-white p-4">
  <Text className="text-2xl font-bold">Hola</Text>
</View>
```

### ¿Qué archivos de configuración necesita NativeWind?

NativeWind requiere integrar **tres piezas** en tu proyecto Expo:

| Archivo | Propósito |
|---|---|
| `babel.config.js` | Transforma el JSX para que `className` se convierta en estilos nativos |
| `metro.config.js` | Permite que Metro (el bundler de RN) procese el CSS de Tailwind |
| `tailwind.config.js` | Configura Tailwind: qué archivos escanear, extensiones de tema, etc. |
| `global.css` | Punto de entrada CSS con las directivas `@tailwind` |

### Clases de Tailwind más útiles para empezar

| Categoría | Ejemplos | Equivalente en RN |
|---|---|---|
| **Layout** | `flex-1`, `flex-row`, `items-center`, `justify-between` | `flex: 1`, `flexDirection: 'row'`, `alignItems: 'center'` |
| **Espaciado** | `p-4`, `px-6`, `mt-2`, `mb-4`, `gap-3` | `padding: 16`, `paddingHorizontal: 24`, `marginTop: 8` |
| **Tipografía** | `text-xl`, `text-2xl`, `font-bold`, `text-center` | `fontSize: 20`, `fontWeight: 'bold'`, `textAlign: 'center'` |
| **Colores** | `bg-white`, `bg-gray-100`, `text-gray-900`, `text-blue-600` | `backgroundColor: '#fff'`, `color: '#1e3a5f'` |
| **Bordes** | `rounded-lg`, `rounded-full`, `border`, `border-gray-300` | `borderRadius: 8`, `borderWidth: 1` |
| **Tamaños** | `w-full`, `w-32`, `h-40`, `w-64` | `width: '100%'`, `width: 128` |

> 📖 Referencia completa de clases: [https://tailwindcss.com/docs](https://tailwindcss.com/docs)

---

## Parte 1 — Crear el proyecto e instalar NativeWind

Sigue la guía oficial de instalación de NativeWind con Expo:

👉 [https://www.nativewind.dev/docs/getting-started/installation#installation-with-expo](https://www.nativewind.dev/docs/getting-started/installation#installation-with-expo)

Los pasos resumidos son:

### 1.1 — Crear un proyecto Expo en blanco

```bash
npx create-expo-app@latest --template blank mi-cv-nativewind
cd mi-cv-nativewind
```

### 1.2 — Instalar las dependencias de NativeWind y Tailwind

```bash
npm install nativewind tailwindcss
```

### 1.3 — Crear y configurar `tailwind.config.js`

Inicializa la configuración de Tailwind:

```bash
npx tailwindcss init
```

Edita el archivo generado para:
- Añadir en `content` las rutas de los archivos que contendrán clases de Tailwind.
- Añadir el preset de NativeWind.

### 1.4 — Crear el archivo `global.css`

Crea un archivo `global.css` en la raíz del proyecto con las tres directivas de Tailwind.

### 1.5 — Configurar `babel.config.js`

Modifica el archivo para:
- Usar `babel-preset-expo` con la opción `jsxImportSource` apuntando a `nativewind`.
- Añadir el preset `nativewind/babel`.

### 1.6 — Configurar `metro.config.js`

Crea o modifica el archivo para envolver la configuración de Metro con `withNativeWind`, indicando `global.css` como entrada CSS.

### 1.7 — Configurar `app.json`

Asegúrate de que la sección `web` use `"bundler": "metro"` para que NativeWind funcione también en web.

### 1.8 — Importar `global.css` en tu `App.js`

Añade `import './global.css'` en el archivo principal de la app.

### 1.9 — Verificar la instalación

Arranca la app y comprueba que las clases de Tailwind se aplican correctamente:

```bash
npx expo start
```

---

## Parte 2 — Construir tu CV personal con NativeWind

Con NativeWind configurado, construye un componente `App.js` que muestre tu CV personal en una sola pantalla usando **solo clases de Tailwind** (sin `StyleSheet.create`).

### Requisitos mínimos

La pantalla debe incluir las siguientes secciones, ordenadas verticalmente:

1. **Cabecera**: nombre completo y título profesional, centrado.
2. **Sobre mí**: breve párrafo descriptivo.
3. **Estudios**: al menos dos entradas con título, centro y año.
4. **Experiencia profesional**: al menos dos entradas con puesto, empresa y período.
5. **Botón de contacto**: un `Pressable` estilizado que simule una acción de contacto.

### Patrones de diseño sugeridos con Tailwind

#### Tarjeta (Card)

Usa combinaciones de fondo, borde, padding y sombra para crear tarjetas:

```jsx
<View className="bg-white rounded-xl p-4 mb-3 border border-gray-200 shadow-sm">
  <Text className="text-lg font-bold text-gray-900">Título</Text>
  <Text className="text-sm text-gray-500 mt-1">Subtítulo</Text>
</View>
```

#### Sección con título

Usa un encabezado con separador visual:

```jsx
<View className="mb-6">
  <Text className="text-xl font-bold text-gray-900 mb-1">🎓 Educación</Text>
  <View className="w-12 h-1 bg-blue-500 rounded-full mb-4" />
  {/* Contenido de la sección */}
</View>
```

#### Botón con Pressable

Estiliza botones sólidos, outline o con iconos:

```jsx
<Pressable className="bg-blue-600 px-6 py-3 rounded-lg items-center">
  <Text className="text-white text-base font-semibold">Contactar</Text>
</Pressable>
```

#### Pill / Badge

Para mostrar tecnologías o habilidades:

```jsx
<View className="flex-row flex-wrap gap-2">
  <View className="bg-blue-100 px-3 py-1 rounded-full">
    <Text className="text-blue-700 text-xs font-medium">React Native</Text>
  </View>
  <View className="bg-green-100 px-3 py-1 rounded-full">
    <Text className="text-green-700 text-xs font-medium">NativeWind</Text>
  </View>
</View>
```

### Consideraciones

- Usa `<ScrollView>` en lugar de `<View>` como contenedor principal si el contenido excede la pantalla.
- Usa `SafeAreaView` de `react-native-safe-area-context` para respetar las zonas seguras.
- Recuerda que en NativeWind las clases se pasan con `className`, no con `style`.

---


# Solución — Sistema de temas dinámicos con useState y NativeWind

---

## Estrategia

La solución se basa en un **objeto de configuración de temas** donde cada tema mapea a un conjunto de clases de Tailwind. Un `useState` controla el tema activo, y todas las clases de la UI se resuelven dinámicamente con template literals.

---

## Código completo — `App.js`

```jsx
import { StatusBar } from "expo-status-bar";
import { Text, View, Pressable, ScrollView } from "react-native";
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";
import { useState } from "react";
import "./global.css";

// ══════════════════════════════════════════════════════════════
// Configuración de temas
// ══════════════════════════════════════════════════════════════

const temas = {
  claro: {
    nombre: "☀️ Claro",
    fondo: "bg-white",
    texto: "text-gray-900",
    textoSecundario: "text-gray-500",
    tarjeta: "bg-gray-50 border-gray-200",
    tarjetaDestacada: "bg-blue-50 border-blue-200",
    boton: "bg-blue-600",
    botonTexto: "text-white",
    acento: "bg-blue-500",
    acentoTexto: "text-blue-600",
    separador: "bg-gray-200",
    statusBar: "dark",
  },
  oscuro: {
    nombre: "🌙 Oscuro",
    fondo: "bg-gray-950",
    texto: "text-white",
    textoSecundario: "text-gray-400",
    tarjeta: "bg-gray-800 border-gray-700",
    tarjetaDestacada: "bg-gray-800 border-blue-500",
    boton: "bg-blue-500",
    botonTexto: "text-white",
    acento: "bg-blue-400",
    acentoTexto: "text-blue-400",
    separador: "bg-gray-700",
    statusBar: "light",
  },
  naturaleza: {
    nombre: "🌿 Naturaleza",
    fondo: "bg-green-50",
    texto: "text-green-900",
    textoSecundario: "text-green-600",
    tarjeta: "bg-white border-green-200",
    tarjetaDestacada: "bg-green-100 border-green-400",
    boton: "bg-emerald-600",
    botonTexto: "text-white",
    acento: "bg-emerald-500",
    acentoTexto: "text-emerald-600",
    separador: "bg-green-200",
    statusBar: "dark",
  },
};

// ══════════════════════════════════════════════════════════════
// Datos de ejemplo
// ══════════════════════════════════════════════════════════════

const elementos = [
  {
    icono: "📱",
    titulo: "Aplicaciones móviles",
    descripcion: "React Native, Expo, NativeWind",
  },
  {
    icono: "🌐",
    titulo: "Desarrollo web",
    descripcion: "React, Next.js, Tailwind CSS",
  },
  {
    icono: "☁️",
    titulo: "Cloud & Backend",
    descripcion: "Firebase, Node.js, REST APIs",
  },
  {
    icono: "🎨",
    titulo: "Diseño UI/UX",
    descripcion: "Figma, accesibilidad, sistemas de diseño",
  },
];

// ══════════════════════════════════════════════════════════════
// Componentes auxiliares
// ══════════════════════════════════════════════════════════════

function SelectorTemas({ temaActivo, onCambiarTema, t }) {
  return (
    <View className="flex-row gap-2 justify-center flex-wrap">
      {Object.entries(temas).map(([clave, config]) => {
        const activo = temaActivo === clave;
        return (
          <Pressable
            key={clave}
            onPress={() => onCambiarTema(clave)}
            className={`px-4 py-2 rounded-full border-2 ${
              activo
                ? `${config.boton} border-transparent`
                : `bg-transparent ${t.tarjeta.split(" ").find((c) => c.startsWith("border-"))}`
            }`}
          >
            <Text
              className={`text-sm font-semibold ${
                activo ? "text-white" : t.texto
              }`}
            >
              {config.nombre}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

function SeccionTitulo({ emoji, texto, t }) {
  return (
    <View className="mb-4 mt-6">
      <Text className={`text-xl font-bold ${t.texto}`}>
        {emoji} {texto}
      </Text>
      <View className={`w-12 h-1 ${t.acento} rounded-full mt-1`} />
    </View>
  );
}

function TarjetaEjemplo({ t }) {
  return (
    <View className={`rounded-xl p-5 border ${t.tarjetaDestacada}`}>
      <Text className={`text-lg font-bold ${t.texto} mb-1`}>
        Tarjeta de ejemplo
      </Text>
      <Text className={`text-sm ${t.textoSecundario} mb-3`}>
        Subtítulo descriptivo del contenido
      </Text>
      <Text className={`text-sm ${t.textoSecundario} leading-5`}>
        Esta tarjeta demuestra cómo todos los colores — fondo, texto, bordes
        y acentos — cambian instantáneamente al seleccionar un tema diferente.
        No hay StyleSheet involucrado, todo son clases de Tailwind.
      </Text>
      <View className={`h-px ${t.separador} my-4`} />
      <View className="flex-row gap-2">
        <Pressable className={`${t.boton} px-4 py-2 rounded-lg`}>
          <Text className={`${t.botonTexto} text-sm font-semibold`}>
            Acción
          </Text>
        </Pressable>
        <Pressable className={`px-4 py-2 rounded-lg border ${t.tarjeta.split(" ").find((c) => c.startsWith("border-"))}`}>
          <Text className={`${t.acentoTexto} text-sm font-semibold`}>
            Secundario
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

function PaletaColores({ t }) {
  const colores = [
    { label: "Fondo", clase: t.fondo },
    { label: "Tarjeta", clase: t.tarjeta.split(" ")[0] },
    { label: "Acento", clase: t.acento },
    { label: "Botón", clase: t.boton },
  ];

  return (
    <View className="flex-row gap-3 justify-center">
      {colores.map((color, i) => (
        <View key={i} className="items-center">
          <View
            className={`w-14 h-14 rounded-xl ${color.clase} border border-gray-300`}
          />
          <Text className={`text-xs mt-1 ${t.textoSecundario}`}>
            {color.label}
          </Text>
        </View>
      ))}
    </View>
  );
}

function ListaElementos({ t }) {
  return (
    <View>
      {elementos.map((item, i) => (
        <View
          key={i}
          className={`flex-row items-center p-4 rounded-xl mb-2 border ${t.tarjeta}`}
        >
          <View
            className={`w-11 h-11 rounded-full ${t.acento} items-center justify-center mr-4`}
          >
            <Text className="text-lg">{item.icono}</Text>
          </View>
          <View className="flex-1">
            <Text className={`font-bold ${t.texto}`}>{item.titulo}</Text>
            <Text className={`text-sm ${t.textoSecundario} mt-0.5`}>
              {item.descripcion}
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}

// ══════════════════════════════════════════════════════════════
// Componente principal
// ══════════════════════════════════════════════════════════════

export default function App() {
  const [tema, setTema] = useState("claro");
  const t = temas[tema];

  return (
    <SafeAreaProvider>
      <SafeAreaView className={`flex-1 ${t.fondo}`}>
        <ScrollView className="flex-1 px-5 py-4">

          {/* ── Cabecera ── */}
          <View className="items-center mb-6">
            <Text className={`text-3xl font-bold ${t.texto}`}>
              Temas Dinámicos
            </Text>
            <Text className={`text-base ${t.textoSecundario} mt-1`}>
              Tema activo: {t.nombre}
            </Text>
          </View>

          {/* ── Selector de temas ── */}
          <SelectorTemas
            temaActivo={tema}
            onCambiarTema={setTema}
            t={t}
          />

          {/* ── Paleta de colores ── */}
          <SeccionTitulo emoji="🎨" texto="Paleta de colores" t={t} />
          <PaletaColores t={t} />

          {/* ── Tarjeta de ejemplo ── */}
          <SeccionTitulo emoji="🃏" texto="Tarjeta de ejemplo" t={t} />
          <TarjetaEjemplo t={t} />

          {/* ── Lista de elementos ── */}
          <SeccionTitulo emoji="📋" texto="Habilidades" t={t} />
          <ListaElementos t={t} />

          {/* ── Botón de acción ── */}
          <Pressable
            className={`${t.boton} px-6 py-4 rounded-xl items-center mt-6 mb-10`}
            onPress={() => {
              const claves = Object.keys(temas);
              const actual = claves.indexOf(tema);
              const siguiente = claves[(actual + 1) % claves.length];
              setTema(siguiente);
            }}
          >
            <Text className={`${t.botonTexto} text-base font-bold`}>
              🔄 Siguiente tema
            </Text>
          </Pressable>

        </ScrollView>

        <StatusBar style={t.statusBar} />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}
```

---

## Ejecución

```bash
npx expo start
```

---

## Cómo funciona el sistema de temas

### 1. Objeto de configuración centralizado

```javascript
const temas = {
  claro: { fondo: "bg-white", texto: "text-gray-900", ... },
  oscuro: { fondo: "bg-gray-950", texto: "text-white", ... },
  naturaleza: { fondo: "bg-green-50", texto: "text-green-900", ... },
};
```

Cada tema es un objeto con las clases de Tailwind que le corresponden. Esto permite:
- **Añadir nuevos temas** simplemente añadiendo otra entrada al objeto.
- **Mantener consistencia**: todos los temas definen las mismas propiedades.
- **Evitar ternarios dispersos**: todo está centralizado.

### 2. Estado con useState

```javascript
const [tema, setTema] = useState("claro");
const t = temas[tema]; // Acceso directo al tema activo
```

### 3. Aplicación dinámica con template literals

```jsx
<View className={`flex-1 ${t.fondo}`}>
  <Text className={`text-2xl font-bold ${t.texto}`}>Hola</Text>
</View>
```

Las clases fijas (`flex-1`, `text-2xl`, `font-bold`) se mantienen, y las clases temáticas (`t.fondo`, `t.texto`) cambian según el estado.

### 4. Ciclo entre temas

```javascript
const claves = Object.keys(temas);          // ["claro", "oscuro", "naturaleza"]
const actual = claves.indexOf(tema);         // 0, 1 o 2
const siguiente = claves[(actual + 1) % claves.length];  // Cicla al siguiente
setTema(siguiente);
```

---

## Cómo añadir un cuarto tema

Simplemente añade una nueva entrada al objeto `temas`:

```javascript
const temas = {
  // ... temas existentes ...
  coral: {
    nombre: "🪸 Coral",
    fondo: "bg-orange-50",
    texto: "text-orange-900",
    textoSecundario: "text-orange-600",
    tarjeta: "bg-white border-orange-200",
    tarjetaDestacada: "bg-orange-100 border-orange-400",
    boton: "bg-orange-500",
    botonTexto: "text-white",
    acento: "bg-orange-400",
    acentoTexto: "text-orange-500",
    separador: "bg-orange-200",
    statusBar: "dark",
  },
};
```

No necesitas tocar ningún componente — automáticamente aparecerá en el selector y funcionará en toda la UI.

---

## Patrones de diseño utilizados

| Patrón | Descripción | Clases clave |
|---|---|---|
| **Config centralizada** | Objeto `temas` con todas las clases por tema | `temas[tema].fondo` |
| **Selector pill** | Botones redondeados, el activo con fondo sólido | `rounded-full border-2` + condicional |
| **Paleta visual** | Cuadrados de color que muestran los colores del tema | `w-14 h-14 rounded-xl ${clase}` |
| **Tarjeta temable** | Fondo, borde y textos cambian con el tema | `${t.tarjeta} border rounded-xl p-5` |
| **Lista con icono** | Items con avatar circular a la izquierda | `flex-row items-center` + `w-11 h-11 rounded-full` |
| **CTA cíclico** | Botón que rota entre temas | `Object.keys` + módulo |
| **StatusBar adaptable** | Estilo claro/oscuro según el tema | `<StatusBar style={t.statusBar} />` |

---

## Diferencia con `dark:` de Tailwind

| Aspecto | `dark:` de Tailwind | useState + objeto |
|---|---|---|
| Nº de temas | Solo 2 (claro/oscuro) | Ilimitados |
| Control | Depende de preferencia del sistema o clase `.dark` | Total, desde el estado de React |
| Configuración | En cada clase: `bg-white dark:bg-gray-900` | Centralizada en un objeto |
| Extensibilidad | Limitada | Añadir temas sin tocar componentes |
| Complejidad | Baja para 2 temas | Algo más de setup inicial |

Para apps con solo 2 temas, `dark:` puede ser suficiente. Para 3+ temas o control personalizado, el patrón con `useState` es más flexible.


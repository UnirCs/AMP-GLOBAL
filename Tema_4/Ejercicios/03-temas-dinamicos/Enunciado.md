# Ejercicio 3 — Sistema de temas dinámicos con useState y NativeWind

## Objetivo

Implementar un **sistema de temas dinámicos** (claro, oscuro y personalizado) usando `useState` de React y clases de Tailwind con NativeWind. El alumno aprenderá a cambiar la apariencia completa de la aplicación en tiempo real sin usar `StyleSheet`.

---

## Conceptos previos

### Temas con clases condicionales

En NativeWind no existe un "theme provider" mágico. La estrategia es sencilla:

1. Definir un **estado** con el tema activo (`'claro'`, `'oscuro'`, `'azul'`...).
2. Crear **variables de clases** que cambien según el estado.
3. Aplicar esas variables en la prop `className` con **template literals**.

```jsx
const [tema, setTema] = useState('claro');

// Variable de clases que cambia según el tema
const bgColor = tema === 'claro' ? 'bg-white' : 'bg-gray-900';

// Se aplica dinámicamente
<View className={`flex-1 ${bgColor}`}>
```

### Patrón recomendado: objeto de configuración de temas

En lugar de tener muchos ternarios dispersos, es más limpio definir un **objeto que mapee cada tema a sus clases**:

```jsx
const temas = {
  claro: {
    fondo: "bg-white",
    texto: "text-gray-900",
    textoSecundario: "text-gray-500",
    tarjeta: "bg-gray-50 border-gray-200",
    boton: "bg-blue-600",
    botonTexto: "text-white",
    acento: "bg-blue-500",
  },
  oscuro: {
    fondo: "bg-gray-950",
    texto: "text-white",
    textoSecundario: "text-gray-400",
    tarjeta: "bg-gray-800 border-gray-700",
    boton: "bg-blue-500",
    botonTexto: "text-white",
    acento: "bg-blue-400",
  },
};

// Uso
const t = temas[tema];

<View className={`flex-1 ${t.fondo}`}>
  <Text className={`text-2xl font-bold ${t.texto}`}>Hola</Text>
</View>
```

### ¿Por qué no usar el `dark:` de Tailwind?

Tailwind web ofrece el modificador `dark:` que activa estilos según la preferencia del sistema. NativeWind lo soporta parcialmente, pero para este ejercicio el objetivo es aprender a **gestionar temas manualmente con estado**, lo que ofrece más control (puedes tener 3+ temas, no solo claro/oscuro).

---

## Parte 1 — Definir los temas

Crea un objeto de configuración con **al menos tres temas**. Cada tema debe definir clases de Tailwind para:

| Propiedad | Descripción |
|---|---|
| `fondo` | Color de fondo principal de la app |
| `texto` | Color del texto principal |
| `textoSecundario` | Color del texto secundario (subtítulos, descripciones) |
| `tarjeta` | Fondo y borde de las tarjetas |
| `boton` | Color del botón de acción |
| `botonTexto` | Color del texto del botón |
| `acento` | Color de acentos decorativos (barras, badges) |

Temas sugeridos:

- **Claro**: fondos blancos, textos oscuros, acento azul.
- **Oscuro**: fondos gris muy oscuro, textos blancos, acento azul claro.
- **Naturaleza**: fondos verdes suaves, textos verdes oscuros, acento esmeralda.

---

## Parte 2 — Construir la interfaz

Crea una pantalla con las siguientes secciones, todas temables:

1. **Cabecera** con el nombre del tema activo.
2. **Botones de selección de tema** — Uno por cada tema. El tema activo debe verse visualmente destacado.
3. **Tarjeta de ejemplo** — Una tarjeta con título, subtítulo y texto que muestre los colores del tema.
4. **Paleta de colores** — Muestra visual de los colores principales del tema activo.
5. **Lista de elementos** — Al menos 3 items en lista que cambien de colores con el tema.

### Patrones de diseño sugeridos

#### Selector de tema con botones

```jsx
<View className="flex-row gap-3 justify-center">
  {Object.keys(temas).map((nombreTema) => (
    <Pressable
      key={nombreTema}
      onPress={() => setTema(nombreTema)}
      className={`px-4 py-2 rounded-full border ${
        tema === nombreTema
          ? "bg-blue-600 border-blue-600"
          : "bg-transparent border-gray-300"
      }`}
    >
      <Text className={tema === nombreTema ? "text-white font-bold" : "text-gray-600"}>
        {nombreTema}
      </Text>
    </Pressable>
  ))}
</View>
```

#### Paleta de colores visual

Muestra cuadrados con los colores del tema:

```jsx
<View className="flex-row gap-2">
  <View className={`w-12 h-12 rounded-lg ${t.fondo} border border-gray-300`} />
  <View className={`w-12 h-12 rounded-lg ${t.boton}`} />
  <View className={`w-12 h-12 rounded-lg ${t.acento}`} />
  <View className={`w-12 h-12 rounded-lg ${t.tarjeta.split(' ')[0]}`} />
</View>
```

#### Item de lista temable

```jsx
<View className={`flex-row items-center p-3 rounded-lg mb-2 ${t.tarjeta} border`}>
  <View className={`w-10 h-10 rounded-full ${t.acento} items-center justify-center mr-3`}>
    <Text className="text-white font-bold">1</Text>
  </View>
  <View className="flex-1">
    <Text className={`font-bold ${t.texto}`}>Elemento</Text>
    <Text className={`text-sm ${t.textoSecundario}`}>Descripción</Text>
  </View>
</View>
```

---

## Parte 3 — Funcionalidad completa

- Al pulsar un botón de tema, toda la pantalla (fondo, textos, tarjetas, botones) debe cambiar instantáneamente.
- El tema activo debe estar destacado visualmente en los botones.
- Usa `StatusBar` de `expo-status-bar` para cambiar el estilo de la barra de estado según el tema (claro → `"dark"`, oscuro → `"light"`).

---


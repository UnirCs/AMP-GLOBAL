# Ejercicio 1 — Navegación Stack con Expo Router (RecetApp)

## Objetivo

Construir una aplicación de recetas de cocina llamada **RecetApp** que utilice **navegación Stack** con **Expo Router** alcanzando **4 niveles de profundidad**. Se practicará la configuración de rutas basadas en archivos, el paso de parámetros dinámicos entre pantallas y la personalización visual de la cabecera del Stack.

El flujo de navegación será:

```
Nivel 1: Categorías de recetas
  └─ Nivel 2: Recetas de una categoría
       └─ Nivel 3: Detalle de una receta (ingredientes, info)
            └─ Nivel 4: Modo paso a paso de cocina
```

---

## Conceptos previos

### Expo Router — Navegación basada en archivos

Expo Router utiliza el **sistema de archivos** para definir las rutas de la aplicación, igual que frameworks web como Next.js. Cada archivo dentro de la carpeta `app/` se convierte automáticamente en una ruta.

> 📖 [Expo Router — Introduction](https://docs.expo.dev/router/introduction/)

### Stack Navigator en Expo Router

El componente `Stack` de Expo Router permite crear una pila de pantallas donde cada nueva pantalla se apila sobre la anterior, con un botón de retroceso automático.

```jsx
import { Stack } from "expo-router";

<Stack
    screenOptions={{
        headerShown: true,
        headerStyle: { backgroundColor: "#1a1a2e" },
        headerTintColor: "white",
        headerBackTitle: "Atrás",
    }}
>
    <Stack.Screen name="ruta/index" options={{ title: "Mi Pantalla" }} />
</Stack>
```

**Props principales de `Stack`:**

| Prop | Tipo | Descripción |
|---|---|---|
| `screenOptions` | `object` | Opciones por defecto para todas las pantallas del stack |

**Props principales de `screenOptions` / `options`:**

| Prop | Tipo | Descripción |
|---|---|---|
| `headerShown` | `boolean` | Muestra/oculta la cabecera |
| `headerStyle` | `object` | Estilo del contenedor de la cabecera |
| `headerTintColor` | `string` | Color del texto y los iconos de la cabecera |
| `headerBackTitle` | `string` | Texto del botón de retroceso (iOS) |
| `headerBackVisible` | `boolean` | Muestra/oculta el botón de retroceso |
| `headerShadowVisible` | `boolean` | Muestra/oculta la sombra inferior de la cabecera |
| `title` | `string` | Título que se muestra en la cabecera |
| `animation` | `string` | Tipo de animación de transición (`"default"`, `"fade"`, `"slide_from_right"`, `"slide_from_bottom"`, `"fade_from_bottom"`, `"none"`) |
| `headerRight` | `function` | Componente que se renderiza a la derecha de la cabecera |
| `headerLeft` | `function` | Componente que se renderiza a la izquierda de la cabecera |
| `contentStyle` | `object` | Estilo del contenedor del contenido de la pantalla |

> 📖 [Stack Navigator — Expo Router](https://docs.expo.dev/router/advanced/stack/)
> 📖 [Screen options — React Navigation](https://reactnavigation.org/docs/native-stack-navigator/#options)

### Rutas dinámicas con `[param]`

Para crear rutas dinámicas (como el detalle de una receta por ID), se usan corchetes en el nombre del archivo o carpeta:

```
app/(stack)/categories/[categoryName]/index.jsx    → /categories/Postres
app/(stack)/categories/[categoryName]/recipes/[idRecipe]/index.jsx  → /categories/Postres/recipes/9
```

Para acceder al parámetro dinámico:

```jsx
import { useLocalSearchParams } from 'expo-router';

const { categoryName, idRecipe } = useLocalSearchParams();
```

> 📖 [Dynamic routes — Expo Router](https://docs.expo.dev/router/create-pages/#dynamic-routes)

### Navegación programática con `useRouter`

```jsx
import { useRouter } from 'expo-router';

const router = useRouter();

// Navegar a una ruta (push en el stack)
router.push('/(stack)/categories/Entrantes');

// Navegar con parámetros dinámicos
router.push(`/(stack)/categories/${categoryName}/recipes/${recipeId}`);

// Volver atrás
router.back();
```

> 📖 [Navigating between pages — Expo Router](https://docs.expo.dev/router/navigating-pages/)

---

## Parte 1 — Crear el proyecto y configurar

### 1.1 — Crear el proyecto

```bash
npx create-expo-app@latest --template blank recetapp-stack
cd recetapp-stack
```

### 1.2 — Instalar dependencias

```bash
npm install nativewind tailwindcss expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar @expo/vector-icons
```

### 1.3 — Configurar NativeWind + Expo Router

Configura los archivos necesarios siguiendo las guías oficiales:

- 👉 [NativeWind — Installation](https://www.nativewind.dev/docs/getting-started/installation)
- 👉 [Expo Router — Installation](https://docs.expo.dev/router/installation/)

Archivos a crear/modificar:

| Archivo | Propósito |
|---|---|
| `tailwind.config.js` | Configurar Tailwind con rutas a `./app/**/*.{js,jsx}`, `./components/**/*.{js,jsx}`, `./views/**/*.{js,jsx}` |
| `babel.config.js` | Añadir `jsxImportSource: "nativewind"` y preset `"nativewind/babel"` |
| `metro.config.js` | Envolver config de Metro con `withNativeWind` |
| `global.css` | Directivas `@tailwind base/components/utilities` |
| `app.json` | Añadir `"scheme": "recetapp"` y `"bundler": "metro"` en web |

### 1.4 — Crear `index.js`

```javascript
import { registerRootComponent } from 'expo';
import { ExpoRoot } from 'expo-router';

export function App() {
    const ctx = require.context('./app');
    return <ExpoRoot context={ctx} />;
}

registerRootComponent(App);
```

---

## Parte 2 — Archivo de datos

Copia el archivo `data/recipesData.js` proporcionado junto a este ejercicio en tu proyecto. Este archivo contiene:

- **17 recetas** organizadas en **5 categorías**: Entrantes, Principales, Postres, Ensaladas, Bebidas.
- Cada receta incluye: `id`, `title`, `category`, `difficulty`, `time`, `servings`, `rating`, `author`, `description`, `ingredients[]`, `steps[]`.
- Funciones helper: `getAllRecipes()`, `getRecipeById(id)`.

Crea también una carpeta `context/` con un archivo `RecipesContext.js` para compartir estado entre pantallas:

El contexto debe exponer:
- `recipes` — array de recetas actual
- `setRecipes` — función para actualizar las recetas
- `currentCategory` — categoría seleccionada
- `setCurrentCategory` — función para actualizar la categoría

Y un hook `hooks/useRecipes.js` que:
- Recibe una categoría y simula una petición HTTP con un `setTimeout` de 300ms.
- Devuelve `{ recipes, loading, currentCategory }`.

---

## Parte 3 — Estructura de archivos del router

Crea la siguiente estructura dentro de `app/`:

```
app/
  _layout.jsx              ← Root layout (carga fuentes, splash)
  index.jsx                ← Redirección a home
  home.jsx                 ← Redirección alternativa
  (stack)/
    _layout.jsx            ← Stack layout (configuración del Stack)
    landing/
      index.jsx            ← Nivel 1: Lista de categorías
      categories/
        [categoryName]/
          index.jsx        ← Nivel 2: Recetas de la categoría
          recipes/
            [idRecipe]/
              index.jsx    ← Nivel 3: Detalle de la receta
              cooking/
                index.jsx  ← Nivel 4: Modo paso a paso
```

---

## Parte 4 — Las 4 pantallas

### 4.1 — `landing/index.jsx` (Nivel 1 — Categorías)

- Muestra un título "👨‍🍳 RecetApp" y un subtítulo.
- Lista las 5 categorías como tarjetas con emoji, nombre y número de recetas.
- Al pulsar una categoría, navega a `/(stack)/landing/categories/${categoryName}`.
- Usa un `ScrollView` para el contenido.

### 4.2 — `categories/[categoryName]/index.jsx` (Nivel 2 — Recetas por categoría)

- Recibe `categoryName` con `useLocalSearchParams()`.
- Muestra las recetas de esa categoría con imagen, título, dificultad y tiempo.
- Al pulsar una receta, navega a `/(stack)/landing/categories/${categoryName}/recipes/${recipeId}`.
- Muestra un `ActivityIndicator` durante la carga simulada.

### 4.3 — `recipes/[idRecipe]/index.jsx` (Nivel 3 — Detalle)

- Recibe `idRecipe` con `useLocalSearchParams()`.
- Muestra toda la información de la receta: título, autor, descripción, tiempo, dificultad, porciones, rating.
- Lista todos los ingredientes.
- Incluye un botón "🍳 Empezar a cocinar" que navega al nivel 4.

### 4.4 — `recipes/[idRecipe]/cooking/index.jsx` (Nivel 4 — Paso a paso)

- Recibe `idRecipe` con `useLocalSearchParams()`.
- Muestra los pasos de cocina uno a uno con su número, instrucción y duración estimada.
- Incluye un indicador de progreso (paso X de Y).
- Botones "Anterior" / "Siguiente" para navegar entre pasos.
- Al completar todos los pasos, muestra un mensaje de felicitación.

---

## Parte 5 — Stack Layout

El archivo `(stack)/_layout.jsx` debe:

1. Envolver las pantallas con el `RecipesProvider` del contexto.
2. Configurar el `Stack` con estilo de cabecera oscuro.
3. Registrar las 4 rutas con títulos descriptivos.

**Props a configurar en `screenOptions`:**
- `headerShown: true`
- `headerStyle: { backgroundColor: "#1a1a2e" }`
- `headerTintColor: "white"`
- `headerBackTitle: "Atrás"`
- `headerShadowVisible: true`

---

## Estructura final esperada

```
recetapp-stack/
  index.js
  App.js
  app.json
  babel.config.js
  metro.config.js
  tailwind.config.js
  global.css
  data/
    recipesData.js
  context/
    RecipesContext.js
  hooks/
    useRecipes.js
  app/
    _layout.jsx
    index.jsx
    home.jsx
    (stack)/
      _layout.jsx
      landing/
        index.jsx
        categories/
          [categoryName]/
            index.jsx
            recipes/
              [idRecipe]/
                index.jsx
                cooking/
                  index.jsx
```

---

## Checklist

Antes de dar por finalizado el ejercicio, verifica que has implementado:

- [ ] `Stack` de Expo Router con `screenOptions` personalizado
- [ ] 4 niveles de navegación stack anidados
- [ ] Rutas dinámicas con `[categoryName]` e `[idRecipe]`
- [ ] `useLocalSearchParams()` para leer parámetros
- [ ] `useRouter()` con `router.push()` para navegar
- [ ] `RecipesContext` para compartir datos entre pantallas
- [ ] Hook personalizado `useRecipes` con carga simulada
- [ ] Estilos con NativeWind / Tailwind

---

## Referencias técnicas

| Recurso | Enlace |
|---|---|
| Expo Router — Introduction | https://docs.expo.dev/router/introduction/ |
| Expo Router — Stack | https://docs.expo.dev/router/advanced/stack/ |
| Expo Router — Dynamic routes | https://docs.expo.dev/router/create-pages/#dynamic-routes |
| Expo Router — Navigating pages | https://docs.expo.dev/router/navigating-pages/ |
| Expo Router — useLocalSearchParams | https://docs.expo.dev/router/reference/hooks/#uselocalsearchparams |
| Expo Router — useRouter | https://docs.expo.dev/router/reference/hooks/#userouter |
| React Navigation — Stack options | https://reactnavigation.org/docs/native-stack-navigator/#options |
| NativeWind — Installation | https://www.nativewind.dev/docs/getting-started/installation |


# Ejercicio 2 — Navegación por Tabs con Expo Router (RecetApp)

## Objetivo

Ampliar la aplicación **RecetApp** incorporando **navegación por pestañas (Tabs)** con **Expo Router**. La aplicación tendrá **4 tabs** y dentro del primer tab se mantendrá la **navegación Stack** del ejercicio anterior. Se practicará la configuración de tabs, la personalización de iconos y estilos, y la combinación de tabs con stack.

Los 4 tabs serán:

```
Tab 1: 🍲 Recetas    → Navegación Stack dentro (categorías → recetas → detalle → paso a paso)
Tab 2: ❤️ Favoritos  → Lista de recetas guardadas como favoritas
Tab 3: 🛒 Compra     → Lista de la compra (ingredientes seleccionados)
Tab 4: 👤 Perfil     → Perfil del usuario
```

---

## Conceptos previos

### Tabs Navigator en Expo Router

El componente `Tabs` de Expo Router crea una barra de pestañas en la parte inferior de la pantalla. Cada pestaña corresponde a una ruta dentro de la carpeta `(tabs)/`.

```jsx
import { Tabs } from "expo-router";
import { Ionicons } from '@expo/vector-icons';

<Tabs
    screenOptions={{
        headerShown: false,
        tabBarStyle: { backgroundColor: "#1e2540", borderTopColor: "#374151" },
        tabBarActiveTintColor: "#3b82f6",
        tabBarInactiveTintColor: "#9ca3af",
    }}
>
    <Tabs.Screen
        name="(stack)"
        options={{
            title: "Recetas",
            tabBarIcon: ({ color, size }) => (
                <Ionicons name="restaurant" size={size} color={color} />
            ),
        }}
    />
</Tabs>
```

**Props principales de `Tabs`:**

| Prop | Tipo | Descripción |
|---|---|---|
| `screenOptions` | `object` | Opciones por defecto para todas las pestañas |

**Props principales de `screenOptions` / `options`:**

| Prop | Tipo | Descripción |
|---|---|---|
| `headerShown` | `boolean` | Muestra/oculta la cabecera del tab |
| `tabBarStyle` | `object` | Estilo de la barra de pestañas (color de fondo, bordes) |
| `tabBarActiveTintColor` | `string` | Color del icono/texto de la pestaña activa |
| `tabBarInactiveTintColor` | `string` | Color del icono/texto de las pestañas inactivas |
| `tabBarIcon` | `function` | Función que retorna el componente icono. Recibe `{ color, size, focused }` |
| `tabBarLabel` | `string` | Texto de la etiqueta (si difiere del `title`) |
| `tabBarBadge` | `string \| number` | Badge numérico sobre el icono |
| `tabBarShowLabel` | `boolean` | Muestra/oculta el texto bajo el icono |
| `title` | `string` | Título de la pestaña |

> 📖 [Tabs — Expo Router](https://docs.expo.dev/router/advanced/tabs/)
> 📖 [Bottom Tabs options — React Navigation](https://reactnavigation.org/docs/bottom-tab-navigator/#options)

### Combinación Tabs + Stack

Una estructura muy común es tener tabs donde uno (o varios) contienen un stack de navegación interno. En Expo Router, esto se logra anidando un grupo `(stack)` dentro de `(tabs)`:

```
app/
  (tabs)/
    _layout.jsx         ← Tabs layout
    (stack)/
      _layout.jsx       ← Stack layout (dentro del primer tab)
      landing/
        index.jsx
        ...
    favorites/
      index.jsx         ← Tab de favoritos
    shopping/
      index.jsx         ← Tab de compra
```

La clave es que el `name` del `Tabs.Screen` que contiene el stack debe ser `"(stack)"` (el nombre de la carpeta).

> 📖 [Nesting navigators — Expo Router](https://docs.expo.dev/router/advanced/nesting-navigators/)

### Iconos con `@expo/vector-icons`

Expo incluye la librería `@expo/vector-icons` con miles de iconos de varias familias (Ionicons, MaterialIcons, FontAwesome, etc.):

```jsx
import { Ionicons } from '@expo/vector-icons';

<Ionicons name="restaurant" size={24} color="blue" />
<Ionicons name="heart" size={24} color="red" />
<Ionicons name="cart" size={24} color="green" />
<Ionicons name="person" size={24} color="gray" />
```

> 📖 [Expo Vector Icons](https://docs.expo.dev/guides/icons/)
> 🔍 [Buscador de iconos](https://icons.expo.fyi/)

---

## Parte 1 — Crear el proyecto y configurar

### 1.1 — Crear el proyecto

```bash
npx create-expo-app@latest --template blank recetapp-tabs
cd recetapp-tabs
```

### 1.2 — Instalar dependencias

```bash
npm install nativewind tailwindcss expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar @expo/vector-icons
```

### 1.3 — Configurar NativeWind + Expo Router

Idéntico al ejercicio 1. Configura: `tailwind.config.js`, `babel.config.js`, `metro.config.js`, `global.css`, `app.json`, `index.js`.

---

## Parte 2 — Archivos de datos y contexto

Reutiliza el archivo `data/recipesData.js` del ejercicio anterior.

Amplía el `context/RecipesContext.js` para incluir:

- `favorites` — array de IDs de recetas favoritas.
- `toggleFavorite(id)` — función para añadir/quitar favoritos.
- `shoppingList` — array de ingredientes para la lista de la compra.
- `addToShoppingList(ingredients)` — añade ingredientes.
- `removeFromShoppingList(index)` — elimina un ingrediente.
- `clearShoppingList()` — vacía la lista.

Reutiliza el hook `hooks/useRecipes.js` del ejercicio anterior.

---

## Parte 3 — Estructura de archivos del router

Crea la siguiente estructura dentro de `app/`:

```
app/
  _layout.jsx                    ← Root layout
  index.jsx                      ← Redirect → /home
  home.jsx                       ← Redirect → /(tabs)/(stack)/landing
  (tabs)/
    _layout.jsx                  ← Tabs layout (4 pestañas)
    (stack)/
      _layout.jsx                ← Stack layout (dentro del tab "Recetas")
      landing/
        index.jsx                ← Categorías (Nivel 1)
        categories/
          [categoryName]/
            index.jsx            ← Recetas por categoría (Nivel 2)
            recipes/
              [idRecipe]/
                index.jsx        ← Detalle de receta (Nivel 3)
                cooking/
                  index.jsx      ← Paso a paso (Nivel 4)
    favorites/
      index.jsx                  ← Tab "Favoritos"
    shopping/
      index.jsx                  ← Tab "Lista de compra"
    profile/
      index.jsx                  ← Tab "Perfil"
```

---

## Parte 4 — Tabs Layout

### 4.1 — `(tabs)/_layout.jsx`

El archivo `(tabs)/_layout.jsx` debe:

1. Envolver todas las tabs con `RecipesProvider`.
2. Configurar 4 `Tabs.Screen`:
   - `(stack)` → title: "Recetas", icono: `restaurant`
   - `favorites/index` → title: "Favoritos", icono: `heart`
   - `shopping/index` → title: "Compra", icono: `cart`
   - `profile/index` → title: "Perfil", icono: `person`
3. Configurar `screenOptions` con estilo oscuro para la barra de pestañas.
4. Ocultar la cabecera de las tabs (`headerShown: false`) ya que el Stack tiene su propia cabecera.

**Props a configurar:**

| Prop | Valor |
|---|---|
| `tabBarStyle.backgroundColor` | `"#1e2540"` |
| `tabBarStyle.borderTopColor` | `"#374151"` |
| `tabBarActiveTintColor` | `"#f97316"` (naranja, color temático de cocina) |
| `tabBarInactiveTintColor` | `"#9ca3af"` |

### 4.2 — `(tabs)/(stack)/_layout.jsx`

Idéntico al Stack layout del ejercicio 1 pero **sin** `RecipesProvider` (ya lo incluye el Tabs layout padre).

---

## Parte 5 — Las 3 pantallas nuevas de Tabs

### 5.1 — `favorites/index.jsx` (Tab Favoritos)

- Muestra un título "❤️ Mis Favoritos".
- Si no hay favoritos, muestra un mensaje indicando al usuario que pulse el corazón en el detalle de una receta.
- Si hay favoritos, lista las recetas favoritas con su título, categoría y rating.
- Usa `SafeAreaView` para respetar las zonas seguras.

### 5.2 — `shopping/index.jsx` (Tab Lista de compra)

- Muestra un título "🛒 Lista de compra".
- Si la lista está vacía, muestra un mensaje invitando a añadir ingredientes desde el detalle de una receta.
- Si tiene ingredientes, los lista con checkboxes simulados (Pressable que marca/desmarca).
- Incluye un botón "Vaciar lista" que llama a `clearShoppingList()`.
- Usa `SafeAreaView`.

### 5.3 — `profile/index.jsx` (Tab Perfil)

- Muestra un perfil de usuario estático con:
  - Avatar con iniciales.
  - Nombre y email.
  - Estadísticas: recetas vistas, favoritos guardados, ingredientes en la lista.
- Los datos de favoritos y shopping list se leen del contexto para mostrar estadísticas reales.
- Usa `SafeAreaView`.

---

## Parte 6 — Modificar pantalla de detalle (Nivel 3)

Modifica la pantalla de detalle del ejercicio 1 para añadir:

1. Un **botón de favorito** (corazón) en la esquina superior derecha que llama a `toggleFavorite(recipeId)`.
2. Un **botón "Añadir ingredientes a la lista"** que llama a `addToShoppingList(recipe.ingredients)`.

---

## Estructura final esperada

```
recetapp-tabs/
  index.js
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
    (tabs)/
      _layout.jsx                    ← Tabs layout (4 pestañas)
      (stack)/
        _layout.jsx                  ← Stack layout
        landing/
          index.jsx                  ← Nivel 1: Categorías
          categories/
            [categoryName]/
              index.jsx              ← Nivel 2: Recetas
              recipes/
                [idRecipe]/
                  index.jsx          ← Nivel 3: Detalle
                  cooking/
                    index.jsx        ← Nivel 4: Paso a paso
      favorites/
        index.jsx                    ← Tab: Favoritos
      shopping/
        index.jsx                    ← Tab: Lista de compra
      profile/
        index.jsx                    ← Tab: Perfil
```

---

## Checklist

Antes de dar por finalizado el ejercicio, verifica que has implementado:

- [ ] `Tabs` de Expo Router con 4 pestañas
- [ ] `tabBarIcon` con iconos de `@expo/vector-icons`
- [ ] `tabBarActiveTintColor` y `tabBarInactiveTintColor` personalizados
- [ ] `tabBarStyle` con fondo oscuro
- [ ] `Stack` anidado dentro del primer tab
- [ ] `RecipesProvider` envolviendo los tabs (no el stack)
- [ ] Tab Favoritos funcional con `toggleFavorite`
- [ ] Tab Lista de compra con `addToShoppingList` y `clearShoppingList`
- [ ] Tab Perfil con estadísticas reales del contexto
- [ ] Botón de favorito en la pantalla de detalle (Nivel 3)
- [ ] Botón de añadir ingredientes en la pantalla de detalle

---

## Referencias técnicas

| Recurso | Enlace |
|---|---|
| Expo Router — Tabs | https://docs.expo.dev/router/advanced/tabs/ |
| Expo Router — Nesting navigators | https://docs.expo.dev/router/advanced/nesting-navigators/ |
| Bottom Tabs options — React Navigation | https://reactnavigation.org/docs/bottom-tab-navigator/#options |
| Expo Vector Icons | https://docs.expo.dev/guides/icons/ |
| Buscador de iconos | https://icons.expo.fyi/ |
| Expo Router — Stack | https://docs.expo.dev/router/advanced/stack/ |
| Expo Router — useLocalSearchParams | https://docs.expo.dev/router/reference/hooks/#uselocalsearchparams |
| Expo Router — useRouter | https://docs.expo.dev/router/reference/hooks/#userouter |


# Solución — Navegación Stack con Expo Router (RecetApp)

## Proceso mental

Antes de escribir código, razonamos la arquitectura:

1. **¿Cuántos niveles de stack necesitamos?** → 4: Categorías → Recetas → Detalle → Paso a paso.
2. **¿Qué datos necesitamos?** → Un archivo de datos con recetas organizadas por categorías, con ingredientes y pasos de cocina.
3. **¿Cómo compartimos datos entre pantallas?** → Un `Context` que almacena las recetas y la categoría actual. Un hook personalizado que simula la carga desde una API.
4. **¿Qué rutas dinámicas necesitamos?** → `[categoryName]` para filtrar por categoría e `[idRecipe]` para acceder al detalle de una receta.
5. **¿Cómo se estructura el sistema de archivos?** → Expo Router usa file-based routing: cada archivo `.jsx` dentro de `app/` es una ruta. Las carpetas con `[param]` son rutas dinámicas. Los archivos `_layout.jsx` definen el contenedor de navegación.

Con esta estructura en mente, vamos paso a paso.

---

## Paso 1 — Crear el proyecto

```bash
npx create-expo-app@latest --template blank recetapp-stack
cd recetapp-stack
```

---

## Paso 2 — Instalar dependencias

```bash
npm install nativewind tailwindcss expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar @expo/vector-icons
```

> **expo-router** → Sistema de navegación basado en archivos.
> **react-native-screens** + **react-native-safe-area-context** → Dependencias requeridas por el stack navigator.
> **@expo/vector-icons** → Iconos (Ionicons, MaterialIcons, etc.).

---

## Paso 3 — Configuración base

### `app.json`

```json
{
  "expo": {
    "name": "recetapp-stack",
    "slug": "recetapp-stack",
    "version": "1.0.0",
    "orientation": "portrait",
    "icon": "./assets/icon.png",
    "scheme": "recetapp",
    "userInterfaceStyle": "dark",
    "splash": {
      "image": "./assets/splash-icon.png",
      "resizeMode": "contain",
      "backgroundColor": "#1a1a2e"
    },
    "ios": { "supportsTablet": true },
    "android": {
      "adaptiveIcon": {
        "foregroundImage": "./assets/adaptive-icon.png",
        "backgroundColor": "#1a1a2e"
      }
    },
    "web": {
      "favicon": "./assets/favicon.png",
      "bundler": "metro"
    }
  }
}
```

> `"scheme": "recetapp"` es necesario para que Expo Router maneje deep links.

### `tailwind.config.js`

```javascript
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.js",
    "./app/**/*.{js,jsx}",
    "./views/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {},
  },
  plugins: [],
};
```

### `babel.config.js`

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

### `metro.config.js`

```javascript
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

module.exports = withNativeWind(config, { input: "./global.css" });
```

### `global.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### `index.js`

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

## Paso 4 — `data/recipesData.js`

Copia el archivo `recipesData.js` proporcionado en la carpeta `data/`. Este archivo exporta:

- `recipesByCategory` — objeto con 5 categorías y 17 recetas en total.
- `categories` — array con los nombres de las categorías.
- `getAllRecipes()` — helper que devuelve todas las recetas como array plano.
- `getRecipeById(id)` — helper que busca una receta por ID.

---

## Paso 5 — `context/RecipesContext.js`

El contexto permite compartir las recetas cargadas y la categoría actual entre todas las pantallas del stack sin tener que pasar props:

```javascript
import React, { createContext, useContext, useState } from 'react';

/**
 * Contexto para compartir las recetas entre componentes
 * Evita tener que hacer múltiples peticiones para acceder a los datos
 */
const RecipesContext = createContext();

export const RecipesProvider = ({ children }) => {
    const [recipes, setRecipes] = useState([]);
    const [currentCategory, setCurrentCategory] = useState('');
    const [favorites, setFavorites] = useState([]);

    const toggleFavorite = (recipeId) => {
        setFavorites(prev =>
            prev.includes(recipeId)
                ? prev.filter(id => id !== recipeId)
                : [...prev, recipeId]
        );
    };

    return (
        <RecipesContext.Provider value={{
            recipes, setRecipes,
            currentCategory, setCurrentCategory,
            favorites, toggleFavorite
        }}>
            {children}
        </RecipesContext.Provider>
    );
};

export const useRecipesContext = () => {
    const context = useContext(RecipesContext);
    if (!context) {
        throw new Error('useRecipesContext debe usarse dentro de un RecipesProvider');
    }
    return context;
};
```

**¿Por qué un Context?**

- Cuando el usuario navega del Nivel 2 (lista de recetas) al Nivel 3 (detalle), necesitamos acceder a la receta completa sin volver a "cargarla".
- El Context actúa como una caché en memoria que comparten todas las pantallas del stack.
- Patrón idéntico al `MoviesContext` del proyecto de referencia del cine.

---

## Paso 6 — `hooks/useRecipes.js`

Hook personalizado que simula una petición HTTP:

```javascript
import { useState, useEffect } from 'react';
import { recipesByCategory } from '../data/recipesData';
import { useRecipesContext } from '../context/RecipesContext';

/**
 * Custom hook para manejar la carga de recetas por categoría.
 * Simula un delay de red de 300ms.
 *
 * @param {string} category - Categoría de recetas a cargar
 * @returns {Object} Estado y funciones para manejar recetas
 */
export const useRecipes = (category) => {
    const { setRecipes: setContextRecipes, setCurrentCategory: setContextCategory } = useRecipesContext();
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!category) return;

        setLoading(true);

        // Simula un delay de red
        const timer = setTimeout(() => {
            const categoryRecipes = recipesByCategory[category] || [];
            setRecipes(categoryRecipes);
            setContextRecipes(categoryRecipes);
            setContextCategory(category);
            setLoading(false);
        }, 300);

        return () => clearTimeout(timer);
    }, [category]);

    return {
        recipes,
        loading,
        currentCategory: category,
    };
};
```

**¿Por qué simular el delay?**

- En una app real, las recetas vendrían de una API REST (ej. `fetch('https://api.recetapp.com/recipes?category=Postres')`).
- El `setTimeout` de 300ms simula esa latencia de red.
- Mientras `loading` es `true`, mostramos un `ActivityIndicator` → UX realista.
- El patrón es idéntico al hook `useMovies` del proyecto de referencia.

---

## Paso 7 — `app/_layout.jsx` (Root Layout)

El root layout carga fuentes y configura el splash screen:

```jsx
import "../global.css";
import { Slot, SplashScreen } from "expo-router";
import { useFonts } from "expo-font";
import React, { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
    const [fontsLoaded, error] = useFonts({
        "SpaceMono-Regular": require("../assets/fonts/SpaceMono-Regular.ttf"),
    });

    useEffect(() => {
        if (error) throw error;
        if (fontsLoaded) SplashScreen.hideAsync();
    }, [fontsLoaded, error]);

    if (!fontsLoaded && !error) return null;
    return <Slot />;
};

export default RootLayout;
```

> **`<Slot />`** renderiza la ruta hija actual. Es el equivalente de `{children}` en un layout de React pero para el router.
> Si no tienes la fuente `SpaceMono-Regular`, puedes eliminar esa parte o usar cualquier fuente disponible.

---

## Paso 8 — `app/index.jsx` y `app/home.jsx` (Redirecciones)

### `app/index.jsx`

```jsx
import { Redirect } from "expo-router";

export default function Index() {
    return <Redirect href="/home" />;
}
```

### `app/home.jsx`

```jsx
import { Redirect } from "expo-router";

export default function Home() {
    return <Redirect href="/(stack)/landing" />;
}
```

**¿Por qué dos redirecciones?**

- `index.jsx` es la ruta raíz (`/`). Redirige a `/home`.
- `home.jsx` redirige al grupo `(stack)` que contiene toda la navegación.
- Este patrón permite añadir lógica intermedia (como verificar autenticación) en `home.jsx`.

---

## Paso 9 — `app/(stack)/_layout.jsx` (Stack Layout)

Este es el archivo clave que configura la navegación Stack:

```jsx
import { Stack } from "expo-router";
import { RecipesProvider } from '../../context/RecipesContext';

const StackLayout = () => {
    return (
        <RecipesProvider>
            <Stack
                screenOptions={{
                    headerShown: true,
                    headerShadowVisible: true,
                    headerStyle: { backgroundColor: "#1a1a2e" },
                    headerTintColor: "white",
                    headerBackTitle: "Atrás",
                    headerBackVisible: true,
                }}
            >
                <Stack.Screen
                    name="landing/index"
                    options={{
                        title: "RecetApp",
                    }}
                />
                <Stack.Screen
                    name="landing/categories/[categoryName]/index"
                    options={({ route }) => ({
                        title: "Recetas",
                    })}
                />
                <Stack.Screen
                    name="landing/categories/[categoryName]/recipes/[idRecipe]/index"
                    options={{
                        title: "Detalle de la receta",
                    }}
                />
                <Stack.Screen
                    name="landing/categories/[categoryName]/recipes/[idRecipe]/cooking/index"
                    options={{
                        title: "Paso a paso",
                    }}
                />
            </Stack>
        </RecipesProvider>
    );
};

export default StackLayout;
```

**Desglose:**

1. **`<RecipesProvider>`** envuelve todo el Stack → cualquier pantalla hija puede acceder al contexto con `useRecipesContext()`.
2. **`screenOptions`** define el aspecto de la cabecera por defecto para TODAS las pantallas:
   - `headerStyle: { backgroundColor: "#1a1a2e" }` → fondo oscuro.
   - `headerTintColor: "white"` → texto e iconos blancos.
   - `headerBackTitle: "Atrás"` → texto del botón de retroceso en iOS.
3. **`<Stack.Screen name="...">`** registra cada ruta explícitamente con su título.
   - `name` debe coincidir con la ruta relativa del archivo dentro de `(stack)/`.
   - `options` puede ser un objeto o una función `({ route }) => ({...})` para títulos dinámicos.

---

## Paso 10 — Nivel 1: `landing/index.jsx` (Categorías)

La pantalla principal muestra las categorías de recetas como tarjetas pulsables:

```jsx
import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { recipesByCategory, categories } from '../../../data/recipesData';

const categoryEmojis = {
    'Entrantes': '🥗',
    'Principales': '🍲',
    'Postres': '🍰',
    'Ensaladas': '🥙',
    'Bebidas': '🍹',
};

const categoryColors = {
    'Entrantes': 'bg-emerald-600',
    'Principales': 'bg-orange-600',
    'Postres': 'bg-pink-600',
    'Ensaladas': 'bg-lime-600',
    'Bebidas': 'bg-cyan-600',
};

export default function CategoriesScreen() {
    const router = useRouter();

    const handleCategoryPress = (categoryName) => {
        router.push(`/(stack)/landing/categories/${categoryName}`);
    };

    return (
        <ScrollView className="flex-1 bg-gray-900 px-4 py-6">
            {/* Título */}
            <View className="mb-6">
                <Text className="text-3xl font-bold text-white text-center">
                    👨‍🍳 RecetApp
                </Text>
                <Text className="text-gray-400 text-center mt-2">
                    Descubre las mejores recetas del mundo
                </Text>
            </View>

            {/* Lista de categorías */}
            {categories.map((category) => (
                <Pressable
                    key={category}
                    onPress={() => handleCategoryPress(category)}
                    className="mb-4 active:opacity-70"
                >
                    <View
                        className={`${categoryColors[category]} rounded-2xl p-6 flex-row items-center`}
                    >
                        <Text className="text-4xl mr-4">
                            {categoryEmojis[category]}
                        </Text>
                        <View className="flex-1">
                            <Text className="text-white text-xl font-bold">
                                {category}
                            </Text>
                            <Text className="text-white/70 text-sm mt-1">
                                {recipesByCategory[category].length} recetas disponibles
                            </Text>
                        </View>
                        <Ionicons name="chevron-forward" size={24} color="white" />
                    </View>
                </Pressable>
            ))}

            {/* Footer */}
            <View className="mt-4 mb-8 bg-gray-800/50 rounded-xl p-4">
                <Text className="text-gray-400 text-center text-sm">
                    💡 Pulsa una categoría para explorar sus recetas
                </Text>
            </View>
        </ScrollView>
    );
}
```

**Puntos clave:**

- **`useRouter()`** → hook de Expo Router que nos da el objeto `router` para navegar programáticamente.
- **`router.push(...)`** → añade una nueva pantalla al stack de navegación. El usuario podrá volver con el botón de retroceso.
- Los objetos `categoryEmojis` y `categoryColors` mapean cada categoría a su visual correspondiente.
- Se usa `active:opacity-70` de NativeWind para feedback visual al pulsar (estilo `Pressable`).

---

## Paso 11 — Nivel 2: `categories/[categoryName]/index.jsx` (Recetas)

Muestra las recetas de la categoría seleccionada:

```jsx
import React from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useRecipes } from '../../../../../hooks/useRecipes';

export default function CategoryRecipesScreen() {
    const router = useRouter();
    const { categoryName } = useLocalSearchParams();
    const { recipes, loading } = useRecipes(categoryName);

    const handleRecipePress = (recipeId) => {
        router.push(`/(stack)/landing/categories/${categoryName}/recipes/${recipeId}`);
    };

    const difficultyColor = {
        'Fácil': 'text-green-400',
        'Media': 'text-yellow-400',
        'Difícil': 'text-red-400',
    };

    return (
        <View className="flex-1 bg-gray-900">
            {/* Cabecera */}
            <View className="px-4 pt-4 pb-2">
                <Text className="text-2xl font-bold text-white">
                    {categoryName}
                </Text>
                <Text className="text-gray-400 text-sm mt-1">
                    {recipes.length} recetas encontradas
                </Text>
            </View>

            {loading ? (
                <View className="flex-1 justify-center items-center">
                    <ActivityIndicator size="large" color="#60A5FA" />
                    <Text className="text-white text-center mt-4">
                        Cargando recetas...
                    </Text>
                </View>
            ) : (
                <ScrollView className="flex-1 px-4">
                    {recipes.map((recipe) => (
                        <Pressable
                            key={recipe.id}
                            onPress={() => handleRecipePress(recipe.id)}
                            className="mb-4 active:opacity-70"
                        >
                            <View
                                className="bg-gray-800 rounded-xl p-4 border border-gray-700"
                            >
                                <View className="flex-row justify-between items-start">
                                    <View className="flex-1 mr-3">
                                        <Text className="text-white text-lg font-bold">
                                            {recipe.title}
                                        </Text>
                                        <Text className="text-gray-400 text-sm mt-1">
                                            por {recipe.author}
                                        </Text>
                                        <Text
                                            className="text-gray-400 text-sm mt-2"
                                            numberOfLines={2}
                                            ellipsizeMode="tail"
                                        >
                                            {recipe.description}
                                        </Text>
                                    </View>
                                    <View className="items-end">
                                        <Text className="text-yellow-400 text-sm font-bold">
                                            ⭐ {recipe.rating}
                                        </Text>
                                    </View>
                                </View>

                                {/* Tags de info */}
                                <View className="flex-row mt-3 gap-3">
                                    <View className="flex-row items-center">
                                        <Ionicons name="time-outline" size={14} color="#9ca3af" />
                                        <Text className="text-gray-400 text-xs ml-1">{recipe.time}</Text>
                                    </View>
                                    <View className="flex-row items-center">
                                        <Ionicons name="speedometer-outline" size={14} color="#9ca3af" />
                                        <Text className={`text-xs ml-1 ${difficultyColor[recipe.difficulty]}`}>
                                            {recipe.difficulty}
                                        </Text>
                                    </View>
                                    <View className="flex-row items-center">
                                        <Ionicons name="people-outline" size={14} color="#9ca3af" />
                                        <Text className="text-gray-400 text-xs ml-1">{recipe.servings} personas</Text>
                                    </View>
                                </View>
                            </View>
                        </Pressable>
                    ))}
                    <View className="h-6" />
                </ScrollView>
            )}
        </View>
    );
}
```

**Puntos clave:**

- **`useLocalSearchParams()`** → hook de Expo Router que devuelve los parámetros de la URL. En este caso, `categoryName` coincide con el nombre de la carpeta `[categoryName]`.
- **`useRecipes(categoryName)`** → el hook personalizado carga las recetas de la categoría con el delay simulado.
- **`ActivityIndicator`** → se muestra mientras `loading === true` (durante los 300ms del setTimeout).
- **`numberOfLines={2}` + `ellipsizeMode="tail"`** → trunca la descripción larga de la receta.

---

## Paso 12 — Nivel 3: `recipes/[idRecipe]/index.jsx` (Detalle)

Pantalla completa de detalle de una receta:

```jsx
import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useRecipesContext } from '../../../../../../../context/RecipesContext';

export default function RecipeDetailScreen() {
    const router = useRouter();
    const { idRecipe, categoryName } = useLocalSearchParams();
    const { recipes } = useRecipesContext();

    const recipe = recipes.find(r => r.id === parseInt(idRecipe));

    if (!recipe) {
        return (
            <View className="flex-1 bg-gray-900 justify-center items-center">
                <Text className="text-white text-xl">Receta no encontrada</Text>
            </View>
        );
    }

    const handleStartCooking = () => {
        router.push(`/(stack)/landing/categories/${categoryName}/recipes/${idRecipe}/cooking`);
    };

    return (
        <ScrollView className="flex-1 bg-gray-900">
            <View className="px-4 py-6">
                {/* Título */}
                <Text className="text-3xl font-bold text-white text-center mb-2">
                    {recipe.title}
                </Text>
                <Text className="text-gray-400 text-center mb-6">
                    por {recipe.author}
                </Text>

                {/* Info cards */}
                <View className="flex-row justify-between mb-6">
                    <View className="bg-gray-800 rounded-xl p-3 flex-1 mx-1 items-center">
                        <Ionicons name="time-outline" size={24} color="#60a5fa" />
                        <Text className="text-white text-sm font-bold mt-1">{recipe.time}</Text>
                        <Text className="text-gray-400 text-xs">Tiempo</Text>
                    </View>
                    <View className="bg-gray-800 rounded-xl p-3 flex-1 mx-1 items-center">
                        <Ionicons name="speedometer-outline" size={24} color="#fbbf24" />
                        <Text className="text-white text-sm font-bold mt-1">{recipe.difficulty}</Text>
                        <Text className="text-gray-400 text-xs">Dificultad</Text>
                    </View>
                    <View className="bg-gray-800 rounded-xl p-3 flex-1 mx-1 items-center">
                        <Ionicons name="people-outline" size={24} color="#34d399" />
                        <Text className="text-white text-sm font-bold mt-1">{recipe.servings}</Text>
                        <Text className="text-gray-400 text-xs">Porciones</Text>
                    </View>
                    <View className="bg-gray-800 rounded-xl p-3 flex-1 mx-1 items-center">
                        <Ionicons name="star" size={24} color="#fbbf24" />
                        <Text className="text-white text-sm font-bold mt-1">{recipe.rating}</Text>
                        <Text className="text-gray-400 text-xs">Rating</Text>
                    </View>
                </View>

                {/* Descripción */}
                <View className="mb-6">
                    <Text className="text-xl font-bold text-white mb-3">📝 Descripción</Text>
                    <Text className="text-gray-300 text-base leading-6">
                        {recipe.description}
                    </Text>
                </View>

                {/* Ingredientes */}
                <View className="mb-6">
                    <Text className="text-xl font-bold text-white mb-3">
                        🛒 Ingredientes ({recipe.ingredients.length})
                    </Text>
                    {recipe.ingredients.map((ingredient, index) => (
                        <View key={index} className="flex-row items-center mb-2">
                            <View className="w-2 h-2 rounded-full bg-blue-500 mr-3" />
                            <Text className="text-gray-300 text-base flex-1">
                                {ingredient}
                            </Text>
                        </View>
                    ))}
                </View>

                {/* Botón para empezar a cocinar */}
                <Pressable
                    onPress={handleStartCooking}
                    className="bg-orange-500 rounded-xl py-4 px-6 flex-row items-center justify-center active:bg-orange-600 mb-6"
                >
                    <Ionicons name="flame" size={24} color="white" />
                    <Text className="text-white text-lg font-bold ml-2">
                        🍳 Empezar a cocinar
                    </Text>
                </Pressable>

                {/* Resumen de pasos */}
                <View className="bg-gray-800/50 rounded-xl p-4 mb-6">
                    <Text className="text-gray-400 text-center text-sm">
                        📋 Esta receta tiene {recipe.steps.length} pasos.
                        Pulsa el botón para verlos uno a uno.
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
}
```

**Puntos clave:**

- **`useRecipesContext()`** → accedemos a `recipes` del contexto (que fue cargado en el Nivel 2).
- **`recipes.find(...)`** → buscamos la receta por ID. Si no la encontramos, mostramos un mensaje de error.
- **`useLocalSearchParams()`** → extraemos tanto `idRecipe` como `categoryName` (ambos son segmentos dinámicos en la ruta).
- Los info cards de tiempo/dificultad/porciones/rating usan **Ionicons** para los iconos.
- El botón "Empezar a cocinar" navega al **Nivel 4**: el modo paso a paso.

---

## Paso 13 — Nivel 4: `recipes/[idRecipe]/cooking/index.jsx` (Paso a paso)

El nivel más profundo del stack. Muestra los pasos de cocina uno a uno:

```jsx
import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useRecipesContext } from '../../../../../../../../context/RecipesContext';

export default function CookingScreen() {
    const router = useRouter();
    const { idRecipe } = useLocalSearchParams();
    const { recipes } = useRecipesContext();
    const [currentStep, setCurrentStep] = useState(0);

    const recipe = recipes.find(r => r.id === parseInt(idRecipe));

    if (!recipe) {
        return (
            <View className="flex-1 bg-gray-900 justify-center items-center">
                <Text className="text-white text-xl">Receta no encontrada</Text>
            </View>
        );
    }

    const steps = recipe.steps;
    const isFirstStep = currentStep === 0;
    const isLastStep = currentStep === steps.length - 1;
    const isCompleted = currentStep >= steps.length;

    const handleNext = () => {
        if (isLastStep) {
            setCurrentStep(steps.length); // marcar como completado
        } else {
            setCurrentStep(prev => prev + 1);
        }
    };

    const handlePrevious = () => {
        setCurrentStep(prev => Math.max(0, prev - 1));
    };

    // Pantalla de completado
    if (isCompleted) {
        return (
            <View className="flex-1 bg-gray-900 justify-center items-center px-6">
                <Text className="text-6xl mb-6">🎉</Text>
                <Text className="text-3xl font-bold text-white text-center mb-4">
                    ¡Receta completada!
                </Text>
                <Text className="text-gray-400 text-center text-lg mb-8">
                    Has preparado "{recipe.title}" con éxito.{'\n'}¡Buen provecho!
                </Text>
                <Pressable
                    onPress={() => router.back()}
                    className="bg-blue-600 rounded-xl py-4 px-8 active:bg-blue-700"
                >
                    <Text className="text-white text-lg font-bold">Volver al detalle</Text>
                </Pressable>
            </View>
        );
    }

    const step = steps[currentStep];
    const progress = ((currentStep + 1) / steps.length) * 100;

    return (
        <View className="flex-1 bg-gray-900">
            <ScrollView className="flex-1 px-4 py-6">
                {/* Título de la receta */}
                <Text className="text-gray-400 text-center mb-2">
                    {recipe.title}
                </Text>

                {/* Barra de progreso */}
                <View className="bg-gray-800 rounded-full h-3 mb-4 overflow-hidden">
                    <View
                        className="bg-orange-500 h-3 rounded-full"
                        style={{ width: `${progress}%` }}
                    />
                </View>

                {/* Indicador de paso */}
                <Text className="text-gray-400 text-center mb-6">
                    Paso {currentStep + 1} de {steps.length}
                </Text>

                {/* Contenido del paso */}
                <View className="bg-gray-800 rounded-2xl p-6 mb-6">
                    <View className="flex-row items-center mb-4">
                        <View className="bg-orange-500 w-10 h-10 rounded-full items-center justify-center mr-3">
                            <Text className="text-white text-lg font-bold">{step.id}</Text>
                        </View>
                        <View className="flex-row items-center">
                            <Ionicons name="time-outline" size={16} color="#fbbf24" />
                            <Text className="text-yellow-400 text-sm ml-1">{step.duration}</Text>
                        </View>
                    </View>

                    <Text className="text-white text-lg leading-7">
                        {step.instruction}
                    </Text>
                </View>
            </ScrollView>

            {/* Botones de navegación */}
            <View className="flex-row px-4 pb-8 pt-4 gap-3">
                <Pressable
                    onPress={handlePrevious}
                    disabled={isFirstStep}
                    className={`flex-1 rounded-xl py-4 items-center ${
                        isFirstStep ? 'bg-gray-700' : 'bg-gray-600 active:bg-gray-500'
                    }`}
                >
                    <View className="flex-row items-center">
                        <Ionicons
                            name="arrow-back"
                            size={20}
                            color={isFirstStep ? '#6b7280' : 'white'}
                        />
                        <Text className={`font-bold ml-2 ${
                            isFirstStep ? 'text-gray-500' : 'text-white'
                        }`}>
                            Anterior
                        </Text>
                    </View>
                </Pressable>

                <Pressable
                    onPress={handleNext}
                    className="flex-1 bg-orange-500 rounded-xl py-4 items-center active:bg-orange-600"
                >
                    <View className="flex-row items-center">
                        <Text className="text-white font-bold mr-2">
                            {isLastStep ? 'Finalizar' : 'Siguiente'}
                        </Text>
                        <Ionicons
                            name={isLastStep ? 'checkmark' : 'arrow-forward'}
                            size={20}
                            color="white"
                        />
                    </View>
                </Pressable>
            </View>
        </View>
    );
}
```

**Puntos clave del Nivel 4:**

- **`useState(0)`** → controla el paso actual. Empieza en 0 (primer paso).
- **Barra de progreso** → calculada como `((currentStep + 1) / steps.length) * 100` y aplicada con `style={{ width: ... }}`.
- **Estado de completado** → cuando `currentStep >= steps.length`, se muestra la pantalla de felicitación.
- **Botones Anterior/Siguiente** → el botón "Anterior" se deshabilita en el primer paso cambiando su estilo y color.
- **`router.back()`** → vuelve a la pantalla anterior del stack (Nivel 3 — detalle).

---

## Paso 14 — Ejecutar

```bash
npx expo start
```

---

## Estructura final del proyecto

```
recetapp-stack/
  index.js                                            ← Punto de entrada
  app.json                                            ← Configuración de Expo
  babel.config.js                                     ← Babel + NativeWind
  metro.config.js                                     ← Metro + NativeWind
  tailwind.config.js                                  ← Tailwind config
  global.css                                          ← Directivas Tailwind
  data/
    recipesData.js                                    ← 17 recetas en 5 categorías
  context/
    RecipesContext.js                                  ← Contexto para compartir recetas
  hooks/
    useRecipes.js                                     ← Hook con carga simulada
  app/
    _layout.jsx                                       ← Root layout (fuentes, splash)
    index.jsx                                         ← Redirect → /home
    home.jsx                                          ← Redirect → /(stack)/landing
    (stack)/
      _layout.jsx                                     ← Stack config (4 pantallas)
      landing/
        index.jsx                                     ← Nivel 1: Categorías
        categories/
          [categoryName]/
            index.jsx                                 ← Nivel 2: Recetas de la categoría
            recipes/
              [idRecipe]/
                index.jsx                             ← Nivel 3: Detalle de la receta
                cooking/
                  index.jsx                           ← Nivel 4: Paso a paso
```

---

## Resumen de APIs de Expo Router utilizadas

| API / Componente | Dónde se usa | Para qué |
|---|---|---|
| `Stack` | `(stack)/_layout.jsx` | Contenedor de navegación stack |
| `Stack.Screen` | `(stack)/_layout.jsx` | Registra cada ruta con su configuración |
| `screenOptions` | `(stack)/_layout.jsx` | Estilos de cabecera por defecto |
| `useRouter()` | Niveles 1, 2, 3, 4 | Navegación programática con `router.push()` y `router.back()` |
| `useLocalSearchParams()` | Niveles 2, 3, 4 | Leer parámetros dinámicos de la URL |
| `Slot` | `_layout.jsx` | Renderizar la ruta hija actual |
| `Redirect` | `index.jsx`, `home.jsx` | Redirigir a otra ruta |
| `SplashScreen` | `_layout.jsx` | Controlar el splash screen |
| `[param]` (carpetas) | `[categoryName]`, `[idRecipe]` | Segmentos dinámicos en la URL |

---

## Flujo de navegación completo

```
/ (index.jsx)
  → Redirect a /home

/home (home.jsx)
  → Redirect a /(stack)/landing

/(stack)/landing (Nivel 1)
  → Muestra 5 categorías
  → Pulsar "Entrantes" → router.push("/(stack)/landing/categories/Entrantes")

/(stack)/landing/categories/Entrantes (Nivel 2)
  → Carga 4 recetas de entrantes
  → Pulsar "Croquetas de Jamón" → router.push("...recipes/4")

/(stack)/landing/categories/Entrantes/recipes/4 (Nivel 3)
  → Muestra ingredientes, info completa
  → Pulsar "Empezar a cocinar" → router.push("...recipes/4/cooking")

/(stack)/landing/categories/Entrantes/recipes/4/cooking (Nivel 4)
  → Muestra pasos 1 a 6 uno a uno
  → Al completar → pantalla de éxito → router.back()
```


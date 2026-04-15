# Solución — Navegación por Tabs con Expo Router (RecetApp)

## Proceso mental

Partimos del ejercicio 1 (Stack) y lo ampliamos:

1. **¿Cómo se integran los Tabs con el Stack?** → Los Tabs envuelven al Stack. El primer tab contiene el grupo `(stack)` con la navegación de recetas. Los otros 3 tabs son pantallas independientes.
2. **¿Dónde va el `RecipesProvider`?** → En el Tabs layout, ya que ahora los favoritos y la lista de compra (en otros tabs) también necesitan acceso al contexto. Si lo pusiéramos en el Stack, los otros tabs no podrían acceder.
3. **¿Qué estado nuevo necesitamos?** → `favorites` (array de IDs), `shoppingList` (array de strings), y funciones para gestionarlos.
4. **¿Cómo mostramos iconos en los tabs?** → Con `tabBarIcon`, una función que recibe `{ color, size }` y devuelve un `<Ionicons />`.

---

## Paso 1 — Crear el proyecto

```bash
npx create-expo-app@latest --template blank recetapp-tabs
cd recetapp-tabs
```

---

## Paso 2 — Instalar dependencias

```bash
npm install nativewind tailwindcss expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar @expo/vector-icons
```

---

## Paso 3 — Configuración base

Idéntica al ejercicio 1: `app.json`, `tailwind.config.js`, `babel.config.js`, `metro.config.js`, `global.css`, `index.js`.

---

## Paso 4 — `data/recipesData.js`

Copia el archivo `recipesData.js` proporcionado. Mismo archivo que en el ejercicio 1.

---

## Paso 5 — `context/RecipesContext.js` (Ampliado)

Ampliamos el contexto para incluir favoritos y lista de la compra:

```javascript
import React, { createContext, useContext, useState } from 'react';

const RecipesContext = createContext();

export const RecipesProvider = ({ children }) => {
    const [recipes, setRecipes] = useState([]);
    const [currentCategory, setCurrentCategory] = useState('');
    const [favorites, setFavorites] = useState([]);
    const [shoppingList, setShoppingList] = useState([]);

    // Toggle favorito: si ya está, lo quita; si no, lo añade
    const toggleFavorite = (recipeId) => {
        setFavorites(prev =>
            prev.includes(recipeId)
                ? prev.filter(id => id !== recipeId)
                : [...prev, recipeId]
        );
    };

    // Comprueba si una receta es favorita
    const isFavorite = (recipeId) => favorites.includes(recipeId);

    // Añade ingredientes a la lista de compra (evita duplicados)
    const addToShoppingList = (ingredients) => {
        setShoppingList(prev => {
            const newItems = ingredients.filter(item => !prev.includes(item));
            return [...prev, ...newItems];
        });
    };

    // Elimina un ingrediente por índice
    const removeFromShoppingList = (index) => {
        setShoppingList(prev => prev.filter((_, i) => i !== index));
    };

    // Vacía la lista completa
    const clearShoppingList = () => {
        setShoppingList([]);
    };

    return (
        <RecipesContext.Provider value={{
            recipes, setRecipes,
            currentCategory, setCurrentCategory,
            favorites, toggleFavorite, isFavorite,
            shoppingList, addToShoppingList, removeFromShoppingList, clearShoppingList,
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

**Cambios respecto al ejercicio 1:**

- `favorites` → array de IDs numéricos. `toggleFavorite(id)` añade o quita.
- `isFavorite(id)` → helper para comprobar rápidamente si una receta es favorita.
- `shoppingList` → array de strings (ingredientes). `addToShoppingList` evita duplicados.
- `removeFromShoppingList(index)` → elimina por posición.
- `clearShoppingList()` → vacía todo.

---

## Paso 6 — `hooks/useRecipes.js`

Idéntico al ejercicio 1:

```javascript
import { useState, useEffect } from 'react';
import { recipesByCategory } from '../data/recipesData';
import { useRecipesContext } from '../context/RecipesContext';

export const useRecipes = (category) => {
    const { setRecipes: setContextRecipes, setCurrentCategory: setContextCategory } = useRecipesContext();
    const [recipes, setRecipes] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!category) return;
        setLoading(true);
        const timer = setTimeout(() => {
            const categoryRecipes = recipesByCategory[category] || [];
            setRecipes(categoryRecipes);
            setContextRecipes(categoryRecipes);
            setContextCategory(category);
            setLoading(false);
        }, 300);
        return () => clearTimeout(timer);
    }, [category]);

    return { recipes, loading, currentCategory: category };
};
```

---

## Paso 7 — `app/_layout.jsx` (Root Layout)

```jsx
import "../global.css";
import { Slot, SplashScreen } from "expo-router";
import React, { useEffect } from "react";

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
    useEffect(() => {
        SplashScreen.hideAsync();
    }, []);

    return <Slot />;
};

export default RootLayout;
```

---

## Paso 8 — `app/index.jsx` y `app/home.jsx`

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
    return <Redirect href="/(tabs)/(stack)/landing" />;
}
```

> Ahora redirigimos a `/(tabs)/(stack)/landing` en lugar de `/(stack)/landing` porque el stack está dentro de los tabs.

---

## Paso 9 — `app/(tabs)/_layout.jsx` (Tabs Layout)

Este es el archivo principal de este ejercicio. Configura las 4 pestañas:

```jsx
import { Tabs } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import { RecipesProvider } from '../../context/RecipesContext';

const TabsLayout = () => {
    return (
        <RecipesProvider>
            <Tabs
                screenOptions={{
                    headerShown: false,
                    tabBarStyle: {
                        backgroundColor: "#1e2540",
                        borderTopColor: "#374151",
                    },
                    tabBarActiveTintColor: "#f97316",
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
                <Tabs.Screen
                    name="favorites/index"
                    options={{
                        title: "Favoritos",
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="heart" size={size} color={color} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="shopping/index"
                    options={{
                        title: "Compra",
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="cart" size={size} color={color} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="profile/index"
                    options={{
                        title: "Perfil",
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="person" size={size} color={color} />
                        ),
                    }}
                />
            </Tabs>
        </RecipesProvider>
    );
};

export default TabsLayout;
```

**Desglose:**

1. **`<RecipesProvider>`** envuelve `<Tabs>` → todos los tabs y sus hijos tienen acceso al contexto.
2. **`screenOptions.headerShown: false`** → oculta la cabecera de las Tabs porque el Stack (primer tab) ya tiene su propia cabecera. Sin esto habría una cabecera doble.
3. **`tabBarStyle`** → color de fondo oscuro y borde superior sutil.
4. **`tabBarActiveTintColor: "#f97316"`** → naranja (color temático de cocina) para la pestaña activa.
5. **`tabBarInactiveTintColor: "#9ca3af"`** → gris para las pestañas inactivas.
6. **`tabBarIcon`** → función que recibe `{ color, size }` y devuelve un `Ionicons`. El `color` ya viene calculado por React Navigation (activo o inactivo).
7. **`name="(stack)"`** → el primer tab apunta al grupo `(stack)` que contiene toda la navegación de recetas.
8. **`name="favorites/index"`** → los otros tabs apuntan directamente a su archivo `index.jsx`.

---

## Paso 10 — `app/(tabs)/(stack)/_layout.jsx` (Stack Layout)

Igual que en el ejercicio 1 pero **sin** `RecipesProvider` (ya está en los Tabs):

```jsx
import { Stack } from "expo-router";

const StackLayout = () => {
    return (
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
            <Stack.Screen name="landing/index" options={{ title: "RecetApp" }} />
            <Stack.Screen
                name="landing/categories/[categoryName]/index"
                options={{ title: "Recetas" }}
            />
            <Stack.Screen
                name="landing/categories/[categoryName]/recipes/[idRecipe]/index"
                options={{ title: "Detalle de la receta" }}
            />
            <Stack.Screen
                name="landing/categories/[categoryName]/recipes/[idRecipe]/cooking/index"
                options={{ title: "Paso a paso" }}
            />
        </Stack>
    );
};

export default StackLayout;
```

> **Clave:** El `RecipesProvider` NO está aquí porque ya está en `(tabs)/_layout.jsx`. Si lo pusiéramos aquí también, los tabs de Favoritos y Compra no tendrían acceso al contexto.

---

## Paso 11 — Pantallas del Stack (reutilización del ejercicio 1)

Las pantallas de Nivel 1, 2, 3 y 4 dentro de `(stack)/landing/` son prácticamente idénticas a las del ejercicio 1. La única diferencia es que las rutas de navegación ahora incluyen el prefijo `(tabs)`:

```jsx
// Antes (ejercicio 1):
router.push(`/(stack)/landing/categories/${categoryName}`);

// Ahora (ejercicio 2):
router.push(`/(tabs)/(stack)/landing/categories/${categoryName}`);
```

> Sin embargo, como estamos **dentro** del grupo `(tabs)/(stack)`, el prefijo relativo funciona igual. Expo Router resuelve la ruta relativa al grupo actual.

---

## Paso 12 — Modificar Nivel 3 (Detalle) para favoritos y compra

Añadimos botones de favorito y lista de compra al detalle:

```jsx
import React from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useRecipesContext } from '../../../../../../../context/RecipesContext';

export default function RecipeDetailScreen() {
    const router = useRouter();
    const { idRecipe, categoryName } = useLocalSearchParams();
    const { recipes, toggleFavorite, isFavorite, addToShoppingList } = useRecipesContext();

    const recipe = recipes.find(r => r.id === parseInt(idRecipe));

    if (!recipe) {
        return (
            <View className="flex-1 bg-gray-900 justify-center items-center">
                <Text className="text-white text-xl">Receta no encontrada</Text>
            </View>
        );
    }

    const favorite = isFavorite(recipe.id);

    const handleToggleFavorite = () => {
        toggleFavorite(recipe.id);
    };

    const handleAddToShoppingList = () => {
        addToShoppingList(recipe.ingredients);
        Alert.alert(
            '🛒 Ingredientes añadidos',
            `Se han añadido ${recipe.ingredients.length} ingredientes a tu lista de la compra.`
        );
    };

    const handleStartCooking = () => {
        router.push(`/(tabs)/(stack)/landing/categories/${categoryName}/recipes/${idRecipe}/cooking`);
    };

    return (
        <ScrollView className="flex-1 bg-gray-900">
            <View className="px-4 py-6">
                {/* Título con botón de favorito */}
                <View className="flex-row justify-between items-start mb-2">
                    <Text className="text-3xl font-bold text-white flex-1 mr-4">
                        {recipe.title}
                    </Text>
                    <Pressable onPress={handleToggleFavorite} className="active:opacity-70 mt-1">
                        <Ionicons
                            name={favorite ? "heart" : "heart-outline"}
                            size={32}
                            color={favorite ? "#ef4444" : "#9ca3af"}
                        />
                    </Pressable>
                </View>

                <Text className="text-gray-400 mb-6">por {recipe.author}</Text>

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
                    <Text className="text-gray-300 text-base leading-6">{recipe.description}</Text>
                </View>

                {/* Ingredientes */}
                <View className="mb-6">
                    <View className="flex-row justify-between items-center mb-3">
                        <Text className="text-xl font-bold text-white">
                            🛒 Ingredientes ({recipe.ingredients.length})
                        </Text>
                    </View>
                    {recipe.ingredients.map((ingredient, index) => (
                        <View key={index} className="flex-row items-center mb-2">
                            <View className="w-2 h-2 rounded-full bg-orange-500 mr-3" />
                            <Text className="text-gray-300 text-base flex-1">{ingredient}</Text>
                        </View>
                    ))}
                </View>

                {/* Botón añadir a lista de compra */}
                <Pressable
                    onPress={handleAddToShoppingList}
                    className="bg-blue-600 rounded-xl py-4 px-6 flex-row items-center justify-center active:bg-blue-700 mb-4"
                >
                    <Ionicons name="cart-outline" size={24} color="white" />
                    <Text className="text-white text-lg font-bold ml-2">
                        Añadir ingredientes a la lista
                    </Text>
                </Pressable>

                {/* Botón empezar a cocinar */}
                <Pressable
                    onPress={handleStartCooking}
                    className="bg-orange-500 rounded-xl py-4 px-6 flex-row items-center justify-center active:bg-orange-600 mb-6"
                >
                    <Ionicons name="flame" size={24} color="white" />
                    <Text className="text-white text-lg font-bold ml-2">
                        🍳 Empezar a cocinar
                    </Text>
                </Pressable>
            </View>
        </ScrollView>
    );
}
```

**Cambios respecto al ejercicio 1:**

- Botón **corazón** en la esquina derecha del título. Usa `Ionicons` con `name="heart"` (lleno, rojo) o `name="heart-outline"` (vacío, gris).
- Botón **"Añadir ingredientes a la lista"** que llama a `addToShoppingList(recipe.ingredients)` y muestra un `Alert`.
- El `toggleFavorite` y `isFavorite` vienen del contexto.

---

## Paso 13 — `favorites/index.jsx` (Tab Favoritos)

```jsx
import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRecipesContext } from '../../../context/RecipesContext';
import { getAllRecipes } from '../../../data/recipesData';

export default function FavoritesScreen() {
    const { favorites, toggleFavorite } = useRecipesContext();
    const allRecipes = getAllRecipes();
    const favoriteRecipes = allRecipes.filter(r => favorites.includes(r.id));

    return (
        <SafeAreaView className="flex-1 bg-gray-900">
            {favoriteRecipes.length === 0 ? (
                <View className="flex-1 justify-center items-center px-6">
                    <Ionicons name="heart-outline" size={64} color="#6b7280" />
                    <Text className="text-white text-xl text-center mt-4 font-bold">
                        No tienes favoritos aún
                    </Text>
                    <Text className="text-gray-400 text-center mt-2">
                        Pulsa el corazón ❤️ en el detalle de una receta para guardarla aquí.
                    </Text>
                </View>
            ) : (
                <ScrollView className="flex-1 px-4 py-6">
                    <Text className="text-3xl font-bold text-white mb-6 text-center">
                        ❤️ Mis Favoritos
                    </Text>
                    <Text className="text-gray-400 text-center mb-6">
                        {favoriteRecipes.length} receta{favoriteRecipes.length !== 1 ? 's' : ''} guardada{favoriteRecipes.length !== 1 ? 's' : ''}
                    </Text>

                    {favoriteRecipes.map((recipe) => (
                        <View
                            key={recipe.id}
                            className="bg-gray-800 rounded-xl p-4 mb-4 border border-gray-700"
                        >
                            <View className="flex-row justify-between items-start">
                                <View className="flex-1 mr-3">
                                    <Text className="text-white text-lg font-bold">{recipe.title}</Text>
                                    <Text className="text-gray-400 text-sm mt-1">
                                        {recipe.category} · {recipe.difficulty} · {recipe.time}
                                    </Text>
                                    <Text className="text-yellow-400 text-sm mt-1">
                                        ⭐ {recipe.rating}
                                    </Text>
                                </View>
                                <Pressable
                                    onPress={() => toggleFavorite(recipe.id)}
                                    className="active:opacity-70"
                                >
                                    <Ionicons name="heart" size={28} color="#ef4444" />
                                </Pressable>
                            </View>
                        </View>
                    ))}
                </ScrollView>
            )}
        </SafeAreaView>
    );
}
```

**Puntos clave:**

- **`getAllRecipes()`** → helper del archivo de datos que devuelve todas las recetas como array plano.
- **`favorites.includes(r.id)`** → filtra las recetas que el usuario ha marcado como favoritas.
- **Estado vacío** → cuando no hay favoritos, mostramos un icono grande y un mensaje descriptivo. Esto es una buena práctica de UX.
- **Botón de quitar favorito** → cada tarjeta tiene un corazón rojo que, al pulsarlo, llama a `toggleFavorite` y lo elimina de la lista.

---

## Paso 14 — `shopping/index.jsx` (Tab Lista de compra)

```jsx
import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRecipesContext } from '../../../context/RecipesContext';

export default function ShoppingScreen() {
    const { shoppingList, removeFromShoppingList, clearShoppingList } = useRecipesContext();
    const [checkedItems, setCheckedItems] = useState([]);

    const toggleChecked = (index) => {
        setCheckedItems(prev =>
            prev.includes(index)
                ? prev.filter(i => i !== index)
                : [...prev, index]
        );
    };

    const handleClearList = () => {
        Alert.alert(
            '¿Vaciar la lista?',
            'Se eliminarán todos los ingredientes de la lista de compra.',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Vaciar',
                    style: 'destructive',
                    onPress: () => {
                        clearShoppingList();
                        setCheckedItems([]);
                    }
                },
            ]
        );
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-900">
            {shoppingList.length === 0 ? (
                <View className="flex-1 justify-center items-center px-6">
                    <Ionicons name="cart-outline" size={64} color="#6b7280" />
                    <Text className="text-white text-xl text-center mt-4 font-bold">
                        Tu lista de compra está vacía
                    </Text>
                    <Text className="text-gray-400 text-center mt-2">
                        Pulsa "Añadir ingredientes" en el detalle de una receta para empezar.
                    </Text>
                </View>
            ) : (
                <ScrollView className="flex-1 px-4 py-6">
                    <Text className="text-3xl font-bold text-white mb-2 text-center">
                        🛒 Lista de compra
                    </Text>
                    <Text className="text-gray-400 text-center mb-6">
                        {shoppingList.length} ingredientes · {checkedItems.length} marcados
                    </Text>

                    {shoppingList.map((item, index) => {
                        const isChecked = checkedItems.includes(index);
                        return (
                            <Pressable
                                key={index}
                                onPress={() => toggleChecked(index)}
                                className="mb-2"
                            >
                                <View className={`flex-row items-center p-4 rounded-xl border ${
                                    isChecked ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-800 border-gray-600'
                                }`}>
                                    <Ionicons
                                        name={isChecked ? "checkbox" : "square-outline"}
                                        size={24}
                                        color={isChecked ? "#34d399" : "#9ca3af"}
                                    />
                                    <Text className={`flex-1 ml-3 text-base ${
                                        isChecked ? 'text-gray-500 line-through' : 'text-white'
                                    }`}>
                                        {item}
                                    </Text>
                                    <Pressable
                                        onPress={() => removeFromShoppingList(index)}
                                        className="active:opacity-50"
                                    >
                                        <Ionicons name="trash-outline" size={20} color="#ef4444" />
                                    </Pressable>
                                </View>
                            </Pressable>
                        );
                    })}

                    {/* Botón vaciar lista */}
                    <Pressable
                        onPress={handleClearList}
                        className="bg-red-600/20 rounded-xl py-4 px-6 flex-row items-center justify-center mt-4 mb-6 active:bg-red-600/30"
                    >
                        <Ionicons name="trash" size={20} color="#ef4444" />
                        <Text className="text-red-400 font-bold ml-2">Vaciar lista completa</Text>
                    </Pressable>
                </ScrollView>
            )}
        </SafeAreaView>
    );
}
```

**Puntos clave:**

- **Checkbox simulado** → `useState` local (`checkedItems`) controla qué items están marcados. `Ionicons` muestra `"checkbox"` o `"square-outline"`.
- **`line-through`** → NativeWind aplica el tachado al texto cuando el item está marcado.
- **Botón eliminar individual** → icono de papelera que llama a `removeFromShoppingList(index)`.
- **Confirmación antes de vaciar** → `Alert.alert` con botones "Cancelar" y "Vaciar" (estilo destructive).

---

## Paso 15 — `profile/index.jsx` (Tab Perfil)

```jsx
import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRecipesContext } from '../../../context/RecipesContext';

export default function ProfileScreen() {
    const { favorites, shoppingList } = useRecipesContext();

    return (
        <SafeAreaView className="flex-1 bg-gray-900">
            <ScrollView className="flex-1 px-4 py-6">
                {/* Avatar */}
                <View className="items-center mb-6">
                    <View className="w-24 h-24 rounded-full bg-orange-500 items-center justify-center mb-4">
                        <Text className="text-white text-3xl font-bold">CR</Text>
                    </View>
                    <Text className="text-white text-2xl font-bold">Chef Rookie</Text>
                    <Text className="text-gray-400 text-sm mt-1">chef.rookie@recetapp.com</Text>
                </View>

                {/* Estadísticas */}
                <Text className="text-xl font-bold text-white mb-4">📊 Estadísticas</Text>
                <View className="flex-row justify-between mb-6">
                    <View className="bg-gray-800 rounded-xl p-4 flex-1 mx-1 items-center border border-gray-700">
                        <Ionicons name="heart" size={28} color="#ef4444" />
                        <Text className="text-2xl font-bold text-white mt-2">{favorites.length}</Text>
                        <Text className="text-gray-400 text-xs mt-1">Favoritos</Text>
                    </View>
                    <View className="bg-gray-800 rounded-xl p-4 flex-1 mx-1 items-center border border-gray-700">
                        <Ionicons name="cart" size={28} color="#3b82f6" />
                        <Text className="text-2xl font-bold text-white mt-2">{shoppingList.length}</Text>
                        <Text className="text-gray-400 text-xs mt-1">Ingredientes</Text>
                    </View>
                    <View className="bg-gray-800 rounded-xl p-4 flex-1 mx-1 items-center border border-gray-700">
                        <Ionicons name="restaurant" size={28} color="#f97316" />
                        <Text className="text-2xl font-bold text-white mt-2">17</Text>
                        <Text className="text-gray-400 text-xs mt-1">Recetas</Text>
                    </View>
                </View>

                {/* Sobre la app */}
                <Text className="text-xl font-bold text-white mb-4">📱 Sobre RecetApp</Text>
                <View className="bg-gray-800 rounded-xl p-4 border border-gray-700 mb-6">
                    <Text className="text-gray-300 text-base leading-6">
                        RecetApp es tu compañero de cocina. Explora recetas de todo el mundo,
                        guarda tus favoritas y gestiona tu lista de la compra fácilmente.
                    </Text>
                    <Text className="text-gray-500 text-sm mt-3">
                        Versión 1.0.0 · Hecho con ❤️ y React Native
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
```

**Puntos clave:**

- Las estadísticas de **Favoritos** y **Ingredientes** se leen en tiempo real del contexto.
- **`SafeAreaView`** → necesario en tabs que no tienen cabecera de Stack, para que el contenido no quede bajo el notch.

---

## Paso 16 — Ejecutar

```bash
npx expo start
```

---

## Estructura final del proyecto

```
recetapp-tabs/
  index.js
  app.json / babel.config.js / metro.config.js / tailwind.config.js / global.css
  data/
    recipesData.js
  context/
    RecipesContext.js                  ← Ampliado con favoritos y shopping list
  hooks/
    useRecipes.js
  app/
    _layout.jsx                       ← Root layout
    index.jsx                         ← Redirect
    home.jsx                          ← Redirect
    (tabs)/
      _layout.jsx                     ← 4 Tabs configurados
      (stack)/
        _layout.jsx                   ← Stack (sin Provider, ya está en tabs)
        landing/
          index.jsx                   ← Categorías
          categories/[categoryName]/
            index.jsx                 ← Recetas
            recipes/[idRecipe]/
              index.jsx               ← Detalle (+ favorito + compra)
              cooking/index.jsx       ← Paso a paso
      favorites/
        index.jsx                     ← Lista de favoritos
      shopping/
        index.jsx                     ← Lista de compra con checkboxes
      profile/
        index.jsx                     ← Perfil con estadísticas
```

---

## Resumen de APIs de Tabs utilizadas

| API / Prop | Dónde se usa | Para qué |
|---|---|---|
| `Tabs` | `(tabs)/_layout.jsx` | Contenedor de navegación por pestañas |
| `Tabs.Screen` | `(tabs)/_layout.jsx` | Registra cada pestaña con nombre y opciones |
| `tabBarIcon` | `(tabs)/_layout.jsx` | Define el icono de cada pestaña |
| `tabBarActiveTintColor` | `screenOptions` | Color naranja de la pestaña activa |
| `tabBarInactiveTintColor` | `screenOptions` | Color gris de las pestañas inactivas |
| `tabBarStyle` | `screenOptions` | Fondo oscuro de la barra de pestañas |
| `headerShown: false` | `screenOptions` | Evita cabecera doble (Tab + Stack) |
| `Ionicons` | Iconos de tabs | restaurant, heart, cart, person |


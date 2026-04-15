# Solución — Navegación Drawer con Expo Router (RecetApp)

## Proceso mental

Partimos del ejercicio 2 (Tabs + Stack) y añadimos una capa exterior: el Drawer.

1. **¿Cómo se integra el Drawer?** → El Drawer es el contenedor exterior. Dentro de él están los Tabs (ejercicio 2), que a su vez contienen el Stack. La jerarquía completa es: `Drawer > Tabs > Stack`.
2. **¿Qué secciones tiene el Drawer?** → 3: "Inicio" (que son los Tabs), "Consejos de cocina" y "Sobre nosotros".
3. **¿Dónde va el `RecipesProvider`?** → Sigue en los Tabs layout, ya que las pantallas del drawer (tips, about) no necesitan acceso a recetas.
4. **¿Necesitamos dependencias nuevas?** → Sí: `@react-navigation/drawer`, `react-native-gesture-handler` y `react-native-reanimated`.
5. **¿Cómo personalizamos el drawer?** → Con un componente `RecetAppDrawer` que usa `DrawerContentScrollView` y `DrawerItemList`.

---

## Paso 1 — Crear el proyecto

```bash
npx create-expo-app@latest --template blank recetapp-drawer
cd recetapp-drawer
```

---

## Paso 2 — Instalar dependencias

```bash
npm install nativewind tailwindcss expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar @expo/vector-icons @react-navigation/drawer react-native-gesture-handler react-native-reanimated
```

> **Nuevas dependencias respecto al ejercicio 2:**
> - `@react-navigation/drawer` → componentes del drawer (DrawerContentScrollView, DrawerItemList, etc.).
> - `react-native-gesture-handler` → manejo de gestos (deslizar para abrir el drawer).
> - `react-native-reanimated` → animaciones fluidas del drawer.

---

## Paso 3 — Configuración base

Idéntica a los ejercicios anteriores con un cambio importante en `babel.config.js`:

### `babel.config.js` (con plugin Reanimated)

```javascript
module.exports = function (api) {
    api.cache(true);
    return {
        presets: [
            ["babel-preset-expo", { jsxImportSource: "nativewind" }],
            "nativewind/babel",
        ],
        plugins: ['react-native-reanimated/plugin'], // ⚠️ SIEMPRE el último
    };
};
```

> **⚠️ Importante:** El plugin `react-native-reanimated/plugin` debe ser **siempre el último** en el array de plugins. Si no, pueden producirse errores de compilación difíciles de depurar.

Resto de archivos (`app.json`, `tailwind.config.js`, `metro.config.js`, `global.css`, `index.js`) iguales al ejercicio 2.

---

## Paso 4 — Archivos reutilizados

Copia directamente del ejercicio 2:

- `data/recipesData.js` — datos de recetas.
- `context/RecipesContext.js` — contexto ampliado con favoritos y shopping list.
- `hooks/useRecipes.js` — hook de carga simulada.

---

## Paso 5 — `components/RecetAppDrawer.js` (Drawer personalizado)

El componente personalizado del drawer añade una cabecera visual con el branding de la app:

```javascript
import React from 'react';
import { View, Text } from "react-native";
import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";

const RecetAppDrawer = (props) => {
    return (
        <DrawerContentScrollView
            scrollEnabled={true}
            style={{ backgroundColor: '#1a1a2e' }}
        >
            {/* Cabecera del Drawer */}
            <View
                style={{
                    paddingVertical: 30,
                    paddingHorizontal: 20,
                    marginBottom: 10,
                    backgroundColor: '#f97316',
                    borderRadius: 12,
                    marginHorizontal: 12,
                    alignItems: 'center',
                }}
            >
                <Text style={{ fontSize: 48, marginBottom: 8 }}>👨‍🍳</Text>
                <Text style={{
                    fontSize: 24,
                    fontWeight: 'bold',
                    color: 'white',
                    textAlign: 'center',
                }}>
                    RecetApp
                </Text>
                <Text style={{
                    fontSize: 14,
                    color: 'rgba(255,255,255,0.8)',
                    textAlign: 'center',
                    marginTop: 4,
                }}>
                    Tu compañero de cocina
                </Text>
            </View>

            {/* Items del menú (Drawer.Screen) */}
            <DrawerItemList {...props} />
        </DrawerContentScrollView>
    );
};

export default RecetAppDrawer;
```

**¿Por qué un drawer personalizado?**

- `DrawerContentScrollView` → es un `ScrollView` configurado para el drawer (maneja los gestos correctamente).
- `DrawerItemList` → renderiza automáticamente los `Drawer.Screen` definidos en el layout. Recibe las props del drawer para funcionar.
- La cabecera con el logo/emoji/nombre da identidad visual a la app.
- Patrón idéntico al `CinemDrawer.js` del proyecto de referencia del cine.

---

## Paso 6 — `app/_layout.jsx` (Root Layout)

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

## Paso 7 — `app/index.jsx` y `app/home.jsx`

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
    return <Redirect href="/(drawer)/(tabs)/(stack)/landing" />;
}
```

> Ahora la ruta completa incluye `(drawer)` como prefijo: `/(drawer)/(tabs)/(stack)/landing`.

---

## Paso 8 — `app/(drawer)/_layout.jsx` (Drawer Layout)

El archivo clave de este ejercicio:

```jsx
import React from 'react';
import { Drawer } from "expo-router/drawer";
import { Ionicons } from "@expo/vector-icons";
import RecetAppDrawer from "../../components/RecetAppDrawer";

const DrawerLayout = () => {
    return (
        <Drawer
            drawerContent={RecetAppDrawer}
            screenOptions={{
                overlayColor: 'rgba(0,0,0,0.4)',
                drawerActiveTintColor: '#f97316',
                drawerInactiveTintColor: '#9ca3af',
                drawerActiveBackgroundColor: 'rgba(249, 115, 22, 0.1)',
                headerShadowVisible: false,
                headerShown: false,
                drawerStyle: {
                    backgroundColor: '#1a1a2e',
                    width: 280,
                },
                sceneContainerStyle: {
                    backgroundColor: 'transparent',
                },
            }}
        >
            <Drawer.Screen
                name="(tabs)"
                options={{
                    drawerLabel: 'Inicio',
                    title: 'Inicio',
                    drawerIcon: ({ color }) => (
                        <Ionicons name="home-outline" size={24} color={color} />
                    ),
                }}
            />
            <Drawer.Screen
                name="tips/index"
                options={{
                    drawerLabel: 'Consejos de cocina',
                    title: 'Consejos de cocina',
                    drawerIcon: ({ color }) => (
                        <Ionicons name="bulb-outline" size={24} color={color} />
                    ),
                }}
            />
            <Drawer.Screen
                name="about/index"
                options={{
                    drawerLabel: 'Sobre nosotros',
                    title: 'Sobre nosotros',
                    drawerIcon: ({ color }) => (
                        <Ionicons name="people-outline" size={24} color={color} />
                    ),
                }}
            />
        </Drawer>
    );
};

export default DrawerLayout;
```

**Desglose detallado:**

1. **`<Drawer drawerContent={RecetAppDrawer}>`** → usa nuestro componente personalizado para el contenido del drawer.
2. **`overlayColor: 'rgba(0,0,0,0.4)'`** → cuando el drawer se abre, el contenido de fondo se oscurece con una capa semitransparente negra al 40%.
3. **`drawerActiveTintColor: '#f97316'`** → el ítem activo del menú se colorea en naranja.
4. **`drawerActiveBackgroundColor: 'rgba(249,115,22,0.1)'`** → fondo naranja muy sutil para el ítem activo.
5. **`drawerStyle`** → fondo oscuro y ancho de 280px para el panel lateral.
6. **`headerShown: false`** → oculta la cabecera del drawer. El Stack ya tiene la suya.
7. **`sceneContainerStyle: { backgroundColor: 'transparent' }`** → evita fondo blanco durante las transiciones.
8. **`name="(tabs)"`** → el primer ítem del drawer apunta al grupo de tabs. Cuando el usuario selecciona "Inicio", ve los tabs completos.
9. **`drawerIcon`** → cada ítem tiene un icono de Ionicons. El `color` viene del `drawerActiveTintColor` o `drawerInactiveTintColor`.

---

## Paso 9 — `app/(drawer)/(tabs)/_layout.jsx` (Tabs Layout)

Idéntico al ejercicio 2:

```jsx
import { Tabs } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import { RecipesProvider } from '../../../context/RecipesContext';

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

---

## Paso 10 — `app/(drawer)/(tabs)/(stack)/_layout.jsx` (Stack Layout)

Idéntico al ejercicio 2:

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

---

## Paso 11 — Pantallas del Stack y Tabs

Las pantallas dentro de `(stack)/` y los tabs (favorites, shopping, profile) son las mismas del ejercicio 2. Las rutas de `router.push(...)` ahora incluyen el prefijo `(drawer)`:

```jsx
// Ejercicio 2:
router.push(`/(tabs)/(stack)/landing/categories/${categoryName}`);

// Ejercicio 3:
router.push(`/(drawer)/(tabs)/(stack)/landing/categories/${categoryName}`);
```

> **Nota:** Expo Router resuelve las rutas relativas, así que dentro del grupo `(drawer)/(tabs)/(stack)`, las rutas relativas funcionan igual.

---

## Paso 12 — `tips/index.jsx` (Consejos de cocina)

Pantalla accesible desde el drawer con consejos de cocina:

```jsx
import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';

const tips = {
    'Técnicas básicas': [
        { emoji: '🔪', title: 'Afilado de cuchillos', text: 'Afila tus cuchillos regularmente. Un cuchillo afilado es más seguro que uno sin filo, porque requiere menos presión y ofrece más control.' },
        { emoji: '🧂', title: 'Sazonar en capas', text: 'Sazona en cada paso de la cocción, no solo al final. Esto crea profundidad de sabor en el plato terminado.' },
        { emoji: '🍳', title: 'Precalienta la sartén', text: 'Siempre precalienta la sartén antes de añadir aceite o comida. Una sartén caliente evita que los alimentos se peguen.' },
        { emoji: '🌡️', title: 'Temperatura ambiente', text: 'Saca la carne del refrigerador 30 minutos antes de cocinar. Cocinar carne fría produce una cocción desigual.' },
    ],
    'Conservación de alimentos': [
        { emoji: '🧊', title: 'Congelar hierbas', text: 'Congela hierbas frescas en aceite de oliva en bandejas de cubitos de hielo. Tendrás sabor fresco todo el año.' },
        { emoji: '🍌', title: 'Plátanos maduros', text: 'Separa los plátanos del racimo para que maduren más lento. Envuelve los tallos en film para alargar su vida.' },
        { emoji: '🧅', title: 'Almacenar cebollas', text: 'Guarda las cebollas en un lugar fresco, seco y oscuro. Nunca las guardes junto a las patatas, ya que se aceleran mutuamente.' },
        { emoji: '🫙', title: 'Frascos herméticos', text: 'Usa frascos herméticos de cristal para almacenar especias, harinas y granos. Mantienen la frescura y evitan plagas.' },
    ],
    'Trucos de chef': [
        { emoji: '🍋', title: 'Más zumo de limón', text: 'Rueda el limón sobre la encimera presionando antes de cortarlo. Obtendrás el doble de zumo que si lo cortas directamente.' },
        { emoji: '🧄', title: 'Pelar ajos fácilmente', text: 'Aplasta el diente de ajo con el lado plano del cuchillo. La piel se desprende inmediatamente.' },
        { emoji: '🥚', title: 'Huevos frescos', text: 'Sumerge un huevo en agua. Si se hunde y queda horizontal, está fresco. Si flota, descártalo.' },
        { emoji: '🍝', title: 'Agua de pasta', text: 'Reserva siempre un vaso del agua de cocción de la pasta. Su almidón ayuda a espesar y ligar las salsas.' },
    ],
};

export default function TipsScreen() {
    const navigation = useNavigation();

    return (
        <SafeAreaView className="flex-1 bg-gray-900">
            <ScrollView className="flex-1 px-4 py-6">
                {/* Cabecera con botón hamburguesa */}
                <View className="flex-row items-center mb-6">
                    <Pressable
                        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
                        className="active:opacity-70 mr-4"
                    >
                        <Ionicons name="menu" size={28} color="white" />
                    </Pressable>
                    <Text className="text-3xl font-bold text-white flex-1">
                        💡 Consejos de cocina
                    </Text>
                </View>

                {Object.entries(tips).map(([section, sectionTips]) => (
                    <View key={section} className="mb-6">
                        <Text className="text-xl font-bold text-orange-400 mb-3">
                            {section}
                        </Text>
                        {sectionTips.map((tip, index) => (
                            <View
                                key={index}
                                className="bg-gray-800 rounded-xl p-4 mb-3 border border-gray-700"
                            >
                                <View className="flex-row items-start">
                                    <Text className="text-2xl mr-3">{tip.emoji}</Text>
                                    <View className="flex-1">
                                        <Text className="text-white text-base font-bold mb-1">
                                            {tip.title}
                                        </Text>
                                        <Text className="text-gray-400 text-sm leading-5">
                                            {tip.text}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </View>
                ))}

                <View className="mb-8 bg-gray-800/50 rounded-xl p-4">
                    <Text className="text-gray-400 text-center text-sm">
                        🍳 ¿Conoces más trucos? ¡Compártelos con otros chefs!
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
```

**Puntos clave:**

- **Botón hamburguesa** → `navigation.dispatch(DrawerActions.openDrawer())` abre el drawer programáticamente.
- **`useNavigation()`** → hook de Expo Router para acceder al objeto `navigation` de React Navigation.
- **`DrawerActions`** → importado de `@react-navigation/native`, contiene acciones para controlar el drawer.
- **`SafeAreaView`** → necesario porque esta pantalla NO tiene cabecera de Stack ni de Drawer (`headerShown: false`).
- Los consejos se definen como datos estáticos en el propio componente. En una app real vendrían de una API.

---

## Paso 13 — `about/index.jsx` (Sobre nosotros)

```jsx
import React from 'react';
import { View, Text, ScrollView, Pressable, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';

export default function AboutScreen() {
    const navigation = useNavigation();

    const handleLinkPress = async (url) => {
        try {
            await Linking.openURL(url);
        } catch (error) {
            Alert.alert('Error', 'No se pudo abrir el enlace.');
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-900">
            <ScrollView className="flex-1 px-4 py-6">
                {/* Cabecera con botón hamburguesa */}
                <View className="flex-row items-center mb-6">
                    <Pressable
                        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
                        className="active:opacity-70 mr-4"
                    >
                        <Ionicons name="menu" size={28} color="white" />
                    </Pressable>
                    <Text className="text-3xl font-bold text-white flex-1">
                        Sobre nosotros
                    </Text>
                </View>

                {/* Logo / Hero */}
                <View className="bg-orange-500 rounded-2xl p-8 items-center mb-6">
                    <Text className="text-6xl mb-4">👨‍🍳</Text>
                    <Text className="text-white text-3xl font-bold">RecetApp</Text>
                    <Text className="text-white/80 text-base mt-2">Tu compañero de cocina</Text>
                </View>

                {/* Descripción */}
                <View className="mb-6">
                    <Text className="text-lg text-gray-300 leading-6">
                        ¡Bienvenido a RecetApp! Somos una aplicación dedicada a hacer la cocina
                        accesible para todos. Desde principiantes hasta chefs experimentados,
                        RecetApp te ofrece recetas detalladas paso a paso, lista de ingredientes
                        organizada y consejos profesionales.
                    </Text>
                </View>

                <View className="mb-6">
                    <Text className="text-lg text-gray-300 leading-6">
                        Nuestra misión es que cualquier persona pueda preparar platos deliciosos
                        en casa. Con recetas de todo el mundo, desde la paella valenciana hasta
                        el pad thai tailandés, la cocina del mundo está a tu alcance.
                    </Text>
                </View>

                {/* Equipo */}
                <View className="mb-6">
                    <Text className="text-xl font-bold text-white mb-4">👥 Equipo</Text>
                    <View className="bg-gray-800 rounded-xl p-4 border border-gray-700">
                        <Text className="text-white text-base font-bold">Aplicaciones Móviles</Text>
                        <Text className="text-gray-400 text-sm mt-1">
                            UNIR — Universidad Internacional de La Rioja
                        </Text>
                        <Text className="text-gray-400 text-sm mt-1">
                            Proyecto de ejemplo para React Native con Expo Router
                        </Text>
                    </View>
                </View>

                {/* Tecnologías */}
                <View className="mb-6">
                    <Text className="text-xl font-bold text-white mb-4">🛠️ Tecnologías</Text>
                    <View className="flex-row flex-wrap gap-2">
                        {['React Native', 'Expo Router', 'NativeWind', 'Drawer Navigator', 'Tab Navigator', 'Stack Navigator'].map((tech, i) => (
                            <View key={i} className="bg-gray-800 rounded-lg px-3 py-2 border border-gray-700">
                                <Text className="text-gray-300 text-sm">{tech}</Text>
                            </View>
                        ))}
                    </View>
                </View>

                {/* Enlace externo */}
                <Pressable
                    onPress={() => handleLinkPress('https://docs.expo.dev/router/introduction/')}
                    className="bg-blue-600 rounded-xl py-4 px-6 flex-row items-center justify-center active:bg-blue-700 mb-6"
                >
                    <Ionicons name="globe-outline" size={24} color="white" />
                    <Text className="text-white font-bold text-base ml-2">
                        Documentación de Expo Router
                    </Text>
                </Pressable>

                {/* Versión */}
                <View className="mb-8 bg-gray-800/50 rounded-xl p-4">
                    <Text className="text-gray-500 text-center text-sm">
                        RecetApp v1.0.0 · Hecho con ❤️ y React Native
                    </Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
```

**Puntos clave:**

- **`Linking.openURL()`** → abre una URL externa en el navegador del sistema. Usa `try/catch` por si falla.
- **Botón hamburguesa** → mismo patrón que en tips: `DrawerActions.openDrawer()`.
- **Tags de tecnologías** → renderizados con `.map()` y estilo de pill/badge.
- Patrón similar al `about/index.jsx` del proyecto de referencia del cine.

---

## Paso 14 — Ejecutar

```bash
npx expo start
# Si hay problemas con la caché tras añadir reanimated:
npx expo start --clear
```

> **Tip:** Tras añadir `react-native-reanimated/plugin` al babel.config, es recomendable iniciar con `--clear` para limpiar la caché de Metro.

---

## Estructura final del proyecto

```
recetapp-drawer/
  index.js
  app.json
  babel.config.js                              ← Con plugin reanimated
  metro.config.js / tailwind.config.js / global.css
  data/
    recipesData.js                             ← 17 recetas en 5 categorías
  context/
    RecipesContext.js                           ← Con favoritos y shopping list
  hooks/
    useRecipes.js                              ← Carga simulada
  components/
    RecetAppDrawer.js                          ← Drawer personalizado con cabecera
  app/
    _layout.jsx                                ← Root layout
    index.jsx                                  ← Redirect
    home.jsx                                   ← Redirect
    (drawer)/
      _layout.jsx                              ← Drawer: 3 secciones
      (tabs)/
        _layout.jsx                            ← Tabs: 4 pestañas
        (stack)/
          _layout.jsx                          ← Stack: 4 niveles
          landing/
            index.jsx                          ← Categorías
            categories/[categoryName]/
              index.jsx                        ← Recetas
              recipes/[idRecipe]/
                index.jsx                      ← Detalle
                cooking/index.jsx              ← Paso a paso
        favorites/index.jsx                    ← Favoritos
        shopping/index.jsx                     ← Lista de compra
        profile/index.jsx                      ← Perfil
      tips/index.jsx                           ← Consejos de cocina
      about/index.jsx                          ← Sobre nosotros
```

---

## Jerarquía de navegación completa

```
📱 Root (_layout.jsx → <Slot />)
 └── 📂 (drawer) → <Drawer>
      ├── 📂 (tabs) → <Tabs>
      │    ├── 📂 (stack) → <Stack>              [Tab: Recetas]
      │    │    ├── landing/index.jsx              → Nivel 1: Categorías
      │    │    ├── .../[categoryName]/index.jsx   → Nivel 2: Recetas
      │    │    ├── .../[idRecipe]/index.jsx        → Nivel 3: Detalle
      │    │    └── .../cooking/index.jsx           → Nivel 4: Paso a paso
      │    ├── favorites/index.jsx                 [Tab: Favoritos]
      │    ├── shopping/index.jsx                  [Tab: Compra]
      │    └── profile/index.jsx                   [Tab: Perfil]
      ├── tips/index.jsx                           [Drawer: Consejos]
      └── about/index.jsx                          [Drawer: Sobre nosotros]
```

---

## Resumen de APIs del Drawer utilizadas

| API / Prop | Dónde se usa | Para qué |
|---|---|---|
| `Drawer` (de `expo-router/drawer`) | `(drawer)/_layout.jsx` | Contenedor de navegación con menú lateral |
| `Drawer.Screen` | `(drawer)/_layout.jsx` | Registra cada sección del drawer |
| `drawerContent` | `<Drawer>` | Componente personalizado del contenido del drawer |
| `drawerActiveTintColor` | `screenOptions` | Color naranja del ítem activo |
| `drawerInactiveTintColor` | `screenOptions` | Color gris de los ítems inactivos |
| `drawerActiveBackgroundColor` | `screenOptions` | Fondo semitransparente del ítem activo |
| `drawerStyle` | `screenOptions` | Fondo oscuro y ancho del panel lateral |
| `drawerIcon` | `Drawer.Screen options` | Icono del ítem del menú |
| `drawerLabel` | `Drawer.Screen options` | Texto del ítem del menú |
| `overlayColor` | `screenOptions` | Oscurecimiento del fondo al abrir el drawer |
| `headerShown: false` | `screenOptions` | Evita cabecera del drawer (Stack/tabs ya la tienen) |
| `DrawerContentScrollView` | `RecetAppDrawer.js` | ScrollView del contenido del drawer |
| `DrawerItemList` | `RecetAppDrawer.js` | Renderiza los Drawer.Screen como ítems de lista |
| `DrawerActions.openDrawer()` | `tips/index.jsx`, `about/index.jsx` | Abre el drawer programáticamente |
| `useNavigation()` | `tips/index.jsx`, `about/index.jsx` | Accede a navigation para dispatch de acciones |

---

## Flujo de navegación completo

```
Abrir app → / → redirect → /home → redirect → /(drawer)/(tabs)/(stack)/landing

En la pantalla de categorías:
  - Deslizar desde la izquierda → abre el Drawer
  - Seleccionar "Consejos de cocina" → /(drawer)/tips
  - Seleccionar "Sobre nosotros" → /(drawer)/about
  - Seleccionar "Inicio" → vuelve a los tabs

En los tabs:
  - Tab "Recetas" → stack de recetas (4 niveles)
  - Tab "Favoritos" → lista de favoritos
  - Tab "Compra" → lista de compra
  - Tab "Perfil" → perfil del usuario

En tips o about:
  - Pulsar botón hamburguesa ☰ → abre el Drawer
  - Seleccionar "Inicio" → vuelve a los tabs
```


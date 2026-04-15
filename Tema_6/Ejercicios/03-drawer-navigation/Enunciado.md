# Ejercicio 3 — Navegación Drawer con Expo Router (RecetApp)

## Objetivo

Completar la aplicación **RecetApp** incorporando un **menú lateral (Drawer)** con **Expo Router**. El Drawer envuelve la estructura de tabs del ejercicio anterior y añade secciones adicionales accesibles desde el menú lateral. Se practicará la configuración del Drawer, la personalización de su contenido con un componente personalizado y la combinación Drawer + Tabs + Stack.

La estructura de navegación completa será:

```
Drawer
  ├─ Inicio (Tabs)
  │    ├─ Tab Recetas (Stack: categorías → recetas → detalle → paso a paso)
  │    ├─ Tab Favoritos
  │    ├─ Tab Compra
  │    └─ Tab Perfil
  ├─ Consejos de cocina (pantalla independiente)
  └─ Sobre nosotros (pantalla independiente)
```

---

## Conceptos previos

### Drawer Navigator en Expo Router

El Drawer de Expo Router utiliza `@react-navigation/drawer`, que a su vez requiere `react-native-gesture-handler` y `react-native-reanimated`. El Drawer crea un menú lateral deslizable que contiene enlaces a las distintas secciones de la app.

```jsx
import { Drawer } from "expo-router/drawer";

<Drawer
    screenOptions={{
        headerShown: false,
        drawerActiveTintColor: '#f97316',
        drawerInactiveTintColor: '#9ca3af',
        overlayColor: 'rgba(0,0,0,0.4)',
    }}
>
    <Drawer.Screen
        name="(tabs)"
        options={{
            drawerLabel: 'Inicio',
            title: 'Inicio',
            drawerIcon: ({ color }) => <Ionicons name="home-outline" size={24} color={color} />,
        }}
    />
</Drawer>
```

**Props principales de `Drawer`:**

| Prop | Tipo | Descripción |
|---|---|---|
| `screenOptions` | `object` | Opciones por defecto para todas las pantallas del drawer |
| `drawerContent` | `function / component` | Componente personalizado para el contenido del drawer |

**Props principales de `screenOptions` / `options`:**

| Prop | Tipo | Descripción |
|---|---|---|
| `headerShown` | `boolean` | Muestra/oculta la cabecera del drawer |
| `drawerActiveTintColor` | `string` | Color del ítem activo en el menú |
| `drawerInactiveTintColor` | `string` | Color de los ítems inactivos |
| `drawerActiveBackgroundColor` | `string` | Fondo del ítem activo |
| `drawerStyle` | `object` | Estilos del panel lateral (ancho, fondo) |
| `drawerType` | `string` | Tipo de drawer: `"front"` (encima), `"back"` (detrás), `"slide"` (desliza), `"permanent"` (siempre visible) |
| `overlayColor` | `string` | Color de la capa oscura sobre el contenido cuando el drawer está abierto |
| `drawerLabel` | `string` | Texto que aparece en el menú lateral |
| `drawerIcon` | `function` | Icono del ítem. Recibe `{ color, size, focused }` |
| `sceneContainerStyle` | `object` | Estilo del contenedor de la pantalla |
| `swipeEnabled` | `boolean` | Habilita/deshabilita el gesto de deslizar para abrir |

> 📖 [Drawer — Expo Router](https://docs.expo.dev/router/advanced/drawer/)
> 📖 [Drawer Navigator — React Navigation](https://reactnavigation.org/docs/drawer-navigator/)
> 📖 [Drawer options — React Navigation](https://reactnavigation.org/docs/drawer-navigator/#options)

### Drawer personalizado con `drawerContent`

Puedes reemplazar el contenido por defecto del drawer con un componente personalizado. Esto permite añadir una cabecera con logo, información del usuario, etc.:

```jsx
import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";

const CustomDrawer = (props) => {
    return (
        <DrawerContentScrollView scrollEnabled={true}>
            {/* Cabecera personalizada (logo, nombre, etc.) */}
            <View style={{ padding: 20 }}>
                <Text>Mi App</Text>
            </View>
            
            {/* Items del drawer (los que definiste con Drawer.Screen) */}
            <DrawerItemList {...props} />
        </DrawerContentScrollView>
    );
};

// En el layout:
<Drawer drawerContent={CustomDrawer}>
    ...
</Drawer>
```

**Componentes del drawer personalizado:**

| Componente | De dónde importarlo | Descripción |
|---|---|---|
| `DrawerContentScrollView` | `@react-navigation/drawer` | ScrollView preparado para el drawer |
| `DrawerItemList` | `@react-navigation/drawer` | Renderiza los `Drawer.Screen` como ítems de lista |
| `DrawerItem` | `@react-navigation/drawer` | Un ítem individual personalizado |

> 📖 [Custom drawer content — React Navigation](https://reactnavigation.org/docs/drawer-navigator/#providing-a-custom-drawercontent)

### Abrir/cerrar el Drawer programáticamente

```jsx
import { DrawerActions } from '@react-navigation/native';
import { useNavigation } from 'expo-router';

const navigation = useNavigation();

// Abrir el drawer
navigation.dispatch(DrawerActions.openDrawer());

// Cerrar el drawer
navigation.dispatch(DrawerActions.closeDrawer());

// Toggle (abrir si está cerrado, cerrar si está abierto)
navigation.dispatch(DrawerActions.toggleDrawer());
```

> 📖 [Drawer actions — React Navigation](https://reactnavigation.org/docs/drawer-actions/)

### Dependencias adicionales del Drawer

El Drawer requiere dependencias adicionales no incluidas en ejercicios anteriores:

```bash
npm install @react-navigation/drawer react-native-gesture-handler react-native-reanimated
```

Y es necesario añadir el plugin de Reanimated al `babel.config.js`:

```javascript
// babel.config.js
module.exports = function (api) {
    api.cache(true);
    return {
        presets: [
            ["babel-preset-expo", { jsxImportSource: "nativewind" }],
            "nativewind/babel",
        ],
        plugins: ['react-native-reanimated/plugin'], // ← Añadir esto SIEMPRE al final
    };
};
```

> ⚠️ El plugin `react-native-reanimated/plugin` **siempre debe ser el último** en el array de plugins.

---

## Parte 1 — Crear el proyecto y configurar

### 1.1 — Crear el proyecto

```bash
npx create-expo-app@latest --template blank recetapp-drawer
cd recetapp-drawer
```

### 1.2 — Instalar dependencias

```bash
npm install nativewind tailwindcss expo-router react-native-safe-area-context react-native-screens expo-linking expo-constants expo-status-bar @expo/vector-icons @react-navigation/drawer react-native-gesture-handler react-native-reanimated
```

### 1.3 — Configurar NativeWind + Expo Router + Reanimated

Configura todos los archivos base como en ejercicios anteriores, pero **añade el plugin de Reanimated** al `babel.config.js`.

---

## Parte 2 — Archivos de datos y contexto

Reutiliza:

- `data/recipesData.js` — mismo archivo de datos.
- `context/RecipesContext.js` — versión ampliada del ejercicio 2 (con favoritos y shopping list).
- `hooks/useRecipes.js` — mismo hook.

---

## Parte 3 — Estructura de archivos del router

```
app/
  _layout.jsx                          ← Root layout
  index.jsx                            ← Redirect → /home
  home.jsx                             ← Redirect → /(drawer)/(tabs)/(stack)/landing
  (drawer)/
    _layout.jsx                        ← Drawer layout (3 secciones)
    (tabs)/
      _layout.jsx                      ← Tabs layout (4 pestañas)
      (stack)/
        _layout.jsx                    ← Stack layout
        landing/
          index.jsx                    ← Nivel 1: Categorías
          categories/
            [categoryName]/
              index.jsx                ← Nivel 2: Recetas
              recipes/
                [idRecipe]/
                  index.jsx            ← Nivel 3: Detalle
                  cooking/
                    index.jsx          ← Nivel 4: Paso a paso
      favorites/
        index.jsx                      ← Tab: Favoritos
      shopping/
        index.jsx                      ← Tab: Compra
      profile/
        index.jsx                      ← Tab: Perfil
    tips/
      index.jsx                        ← Drawer: Consejos de cocina
    about/
      index.jsx                        ← Drawer: Sobre nosotros
```

---

## Parte 4 — Drawer Layout

### 4.1 — `(drawer)/_layout.jsx`

El Drawer layout debe:

1. Configurar 3 `Drawer.Screen`:
   - `(tabs)` → label: "Inicio", icono: `home-outline`
   - `tips/index` → label: "Consejos de cocina", icono: `bulb-outline`
   - `about/index` → label: "Sobre nosotros", icono: `people-outline`
2. Usar un componente **CustomDrawer** con cabecera personalizada (logo o nombre de la app).
3. Configurar `screenOptions` ocultando la cabecera del drawer (`headerShown: false`).
4. Personalizar `drawerActiveTintColor`, `overlayColor` y `sceneContainerStyle`.

### 4.2 — `components/RecetAppDrawer.js` (Drawer personalizado)

Crea un componente que:

1. Importa `DrawerContentScrollView` y `DrawerItemList` de `@react-navigation/drawer`.
2. Muestra una cabecera con:
   - Un fondo de color temático (naranja/cocina).
   - El nombre "RecetApp" y un emoji 👨‍🍳.
   - Opcionalmente, un logo o imagen.
3. Debajo de la cabecera, renderiza `<DrawerItemList {...props} />` para mostrar los ítems del menú.

---

## Parte 5 — Pantallas adicionales del Drawer

### 5.1 — `tips/index.jsx` (Consejos de cocina)

Pantalla con consejos de cocina organizados por secciones:

- "Técnicas básicas" — 3-4 consejos con emoji e instrucción.
- "Conservación de alimentos" — 3-4 consejos.
- "Trucos de chef" — 3-4 consejos.
- Usa `SafeAreaView` ya que no tiene cabecera de Stack.
- Incluye un botón para abrir el drawer programáticamente (`navigation.dispatch(DrawerActions.openDrawer())`).

### 5.2 — `about/index.jsx` (Sobre nosotros)

Pantalla informativa con:

- Descripción de la app.
- Información del "equipo" de desarrollo (ficticia).
- Un enlace a LinkedIn usando `Linking.openURL()`.
- Versión de la app.
- Usa `SafeAreaView`.

---

## Parte 6 — Botón de menú hamburguesa

En las pantallas que no tienen cabecera de Stack (tips, about, y opcionalmente el Nivel 1 de categorías), añade un **botón de menú hamburguesa** (☰ o icono `menu`) que abre el drawer programáticamente:

```jsx
import { useNavigation } from 'expo-router';
import { DrawerActions } from '@react-navigation/native';

const navigation = useNavigation();

<Pressable onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
    <Ionicons name="menu" size={28} color="white" />
</Pressable>
```

Opcionalmente, puedes configurar `headerShown: true` en las pantallas del drawer (tips, about) y usar `headerLeft` para el botón hamburguesa:

```jsx
<Drawer.Screen
    name="tips/index"
    options={{
        title: 'Consejos de cocina',
        headerShown: true,
        headerStyle: { backgroundColor: '#1a1a2e' },
        headerTintColor: 'white',
        headerLeft: () => (
            <Pressable onPress={() => navigation.dispatch(DrawerActions.openDrawer())}>
                <Ionicons name="menu" size={24} color="white" style={{ marginLeft: 16 }} />
            </Pressable>
        ),
    }}
/>
```

---

## Estructura final esperada

```
recetapp-drawer/
  index.js
  app.json
  babel.config.js                     ← Con plugin reanimated
  metro.config.js
  tailwind.config.js
  global.css
  data/
    recipesData.js
  context/
    RecipesContext.js
  hooks/
    useRecipes.js
  components/
    RecetAppDrawer.js                 ← Drawer personalizado
  app/
    _layout.jsx
    index.jsx
    home.jsx
    (drawer)/
      _layout.jsx                     ← Drawer layout (3 secciones)
      (tabs)/
        _layout.jsx                   ← Tabs layout (4 pestañas)
        (stack)/
          _layout.jsx                 ← Stack layout
          landing/
            index.jsx                 ← Categorías
            categories/
              [categoryName]/
                index.jsx             ← Recetas
                recipes/
                  [idRecipe]/
                    index.jsx         ← Detalle
                    cooking/
                      index.jsx       ← Paso a paso
        favorites/
          index.jsx                   ← Favoritos
        shopping/
          index.jsx                   ← Lista de compra
        profile/
          index.jsx                   ← Perfil
      tips/
        index.jsx                     ← Consejos de cocina
      about/
        index.jsx                     ← Sobre nosotros
```

---

## Checklist

Antes de dar por finalizado el ejercicio, verifica que has implementado:

- [ ] `Drawer` de Expo Router con 3 secciones
- [ ] Componente `drawerContent` personalizado (`RecetAppDrawer`)
- [ ] `DrawerContentScrollView` + `DrawerItemList` de `@react-navigation/drawer`
- [ ] `drawerIcon` con iconos de `@expo/vector-icons` para cada sección
- [ ] `drawerActiveTintColor` y `drawerInactiveTintColor` personalizados
- [ ] `overlayColor` para oscurecer el fondo cuando el drawer está abierto
- [ ] `headerShown: false` en el drawer para evitar cabecera doble
- [ ] Tabs anidados dentro del Drawer
- [ ] Stack anidado dentro de los Tabs
- [ ] Pantalla "Consejos de cocina" con contenido estático
- [ ] Pantalla "Sobre nosotros" con enlace externo (`Linking.openURL`)
- [ ] Botón hamburguesa para abrir el drawer programáticamente
- [ ] `react-native-reanimated/plugin` en `babel.config.js`

---

## Referencias técnicas

| Recurso | Enlace |
|---|---|
| Drawer — Expo Router | https://docs.expo.dev/router/advanced/drawer/ |
| Drawer Navigator — React Navigation | https://reactnavigation.org/docs/drawer-navigator/ |
| Drawer options — React Navigation | https://reactnavigation.org/docs/drawer-navigator/#options |
| Custom drawer content | https://reactnavigation.org/docs/drawer-navigator/#providing-a-custom-drawercontent |
| Drawer actions | https://reactnavigation.org/docs/drawer-actions/ |
| react-native-gesture-handler | https://docs.swmansion.com/react-native-gesture-handler/ |
| react-native-reanimated | https://docs.swmansion.com/react-native-reanimated/ |
| Expo Router — Tabs | https://docs.expo.dev/router/advanced/tabs/ |
| Expo Router — Stack | https://docs.expo.dev/router/advanced/stack/ |
| Expo Router — Nesting navigators | https://docs.expo.dev/router/advanced/nesting-navigators/ |
| Linking — React Native | https://reactnative.dev/docs/linking |


# Solución — Compartir tarjeta de receta como imagen (RecetApp)

## Proceso mental

1. **¿Qué queremos compartir?** → Una imagen generada a partir de un componente React Native (una "tarjeta" visual con el resumen de la receta).
2. **¿Cómo generamos la imagen?** → Con `react-native-view-shot`: envolvemos un componente en `<ViewShot>`, lo renderizamos fuera de pantalla y llamamos a `.capture()`.
3. **¿Cómo la compartimos?** → Con `expo-sharing`: `shareAsync(uri)` abre la hoja de compartir nativa del sistema.
4. **¿Por qué fuera de pantalla?** → No queremos que el usuario vea la tarjeta de captura. La renderizamos con `position: absolute, left: -9999` para que exista en el render tree (necesario para la captura) pero sea invisible.

---

## Paso 1 — Instalar dependencias

```bash
npm install expo-sharing react-native-view-shot expo-file-system
```

---

## Paso 2 — `components/RecipeShareCard.js`

Componente visual diseñado específicamente para ser capturado como imagen:

```jsx
import React from 'react';
import { View, Text } from 'react-native';

const RecipeShareCard = ({ recipe }) => {
    if (!recipe) return null;

    const maxIngredients = 6;
    const displayedIngredients = recipe.ingredients.slice(0, maxIngredients);
    const remainingCount = recipe.ingredients.length - maxIngredients;

    return (
        <View style={{
            width: 400,
            backgroundColor: '#111827',
            padding: 32,
            borderRadius: 16,
        }}>
            {/* Header con emoji */}
            <Text style={{ fontSize: 48, textAlign: 'center', marginBottom: 8 }}>🍳</Text>

            {/* Título */}
            <Text style={{
                fontSize: 28,
                fontWeight: 'bold',
                color: '#ffffff',
                textAlign: 'center',
                marginBottom: 4,
            }}>
                {recipe.title}
            </Text>

            {/* Autor */}
            <Text style={{
                fontSize: 14,
                color: '#9ca3af',
                textAlign: 'center',
                marginBottom: 20,
            }}>
                por {recipe.author}
            </Text>

            {/* Info row */}
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                backgroundColor: '#1f2937',
                borderRadius: 12,
                padding: 16,
                marginBottom: 20,
            }}>
                <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontSize: 12, color: '#9ca3af' }}>Tiempo</Text>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#60a5fa' }}>
                        {recipe.time}
                    </Text>
                </View>
                <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontSize: 12, color: '#9ca3af' }}>Dificultad</Text>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#fbbf24' }}>
                        {recipe.difficulty}
                    </Text>
                </View>
                <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontSize: 12, color: '#9ca3af' }}>Porciones</Text>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#34d399' }}>
                        {recipe.servings}
                    </Text>
                </View>
                <View style={{ alignItems: 'center' }}>
                    <Text style={{ fontSize: 12, color: '#9ca3af' }}>Rating</Text>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#fbbf24' }}>
                        ⭐ {recipe.rating}
                    </Text>
                </View>
            </View>

            {/* Ingredientes */}
            <Text style={{
                fontSize: 16,
                fontWeight: 'bold',
                color: '#ffffff',
                marginBottom: 8,
            }}>
                Ingredientes:
            </Text>
            {displayedIngredients.map((ing, i) => (
                <Text key={i} style={{
                    fontSize: 13,
                    color: '#d1d5db',
                    marginBottom: 3,
                    paddingLeft: 8,
                }}>
                    • {ing}
                </Text>
            ))}
            {remainingCount > 0 && (
                <Text style={{ fontSize: 13, color: '#6b7280', paddingLeft: 8, marginTop: 4 }}>
                    ...y {remainingCount} ingrediente{remainingCount > 1 ? 's' : ''} más
                </Text>
            )}

            {/* Branding */}
            <View style={{
                marginTop: 24,
                paddingTop: 16,
                borderTopWidth: 1,
                borderTopColor: '#374151',
                alignItems: 'center',
            }}>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#f97316' }}>
                    👨‍🍳 RecetApp
                </Text>
                <Text style={{ fontSize: 11, color: '#6b7280', marginTop: 4 }}>
                    Tu compañero de cocina
                </Text>
            </View>
        </View>
    );
};

export default RecipeShareCard;
```

**¿Por qué `style` en vez de `className`?** → `ViewShot` captura mejor componentes con estilos inline. NativeWind/Tailwind puede tener inconsistencias en la captura.

---

## Paso 3 — Integrar en el detalle de la receta

En `recipes/[idRecipe]/index.jsx`:

```jsx
// Añadir imports:
import { useRef } from 'react';
import ViewShot from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import RecipeShareCard from '../../../../../../../../components/RecipeShareCard';

// Dentro del componente:
const shareCardRef = useRef();

const handleShareImage = async () => {
    try {
        // 1. Capturar la tarjeta como imagen
        const uri = await shareCardRef.current.capture();

        // 2. Verificar que se puede compartir
        const isAvailable = await Sharing.isAvailableAsync();
        if (!isAvailable) {
            Alert.alert('Error', 'No es posible compartir archivos en este dispositivo.');
            return;
        }

        // 3. Abrir la hoja de compartir nativa
        await Sharing.shareAsync(uri, {
            mimeType: 'image/png',
            dialogTitle: `Compartir: ${recipe.title}`,
            UTI: 'public.png',
        });
    } catch (error) {
        console.error('Error al compartir:', error);
        Alert.alert('Error', 'No se pudo compartir la receta.');
    }
};

// En el JSX — tarjeta oculta para captura:
<View style={{ position: 'absolute', left: -9999 }}>
    <ViewShot ref={shareCardRef} options={{ format: 'png', quality: 1.0 }}>
        <RecipeShareCard recipe={recipe} />
    </ViewShot>
</View>

// Botón de compartir (junto a los otros botones):
<Pressable
    onPress={handleShareImage}
    className="bg-purple-600 rounded-xl py-4 px-6 flex-row items-center justify-center active:bg-purple-700 mb-4"
>
    <Ionicons name="share-social-outline" size={24} color="white" />
    <Text className="text-white text-lg font-bold ml-2">
        Compartir como imagen
    </Text>
</Pressable>
```

**Desglose:**

1. **`useRef()`** → crea una referencia al componente `ViewShot`.
2. **`shareCardRef.current.capture()`** → captura el contenido del `ViewShot` como imagen PNG. Devuelve una URI local (ej. `file:///tmp/ReactNative/...png`).
3. **`position: 'absolute', left: -9999`** → renderiza la tarjeta fuera de la pantalla visible. `ViewShot` necesita que el componente esté en el render tree para capturarlo, pero no necesita ser visible.
4. **`Sharing.shareAsync(uri, options)`** → abre el sheet nativo. El `mimeType: 'image/png'` ayuda al sistema a mostrar las apps correctas (WhatsApp, Telegram, Mail, etc.).
5. **`UTI: 'public.png'`** → Uniform Type Identifier para iOS. Ayuda a identificar el tipo de archivo.

---

## Flujo completo

```
Detalle de receta (Nivel 3)
  → Componente RecipeShareCard renderizado fuera de pantalla
  → Pulsar "Compartir como imagen"
    → ViewShot.capture() → URI local de la imagen PNG
    → Sharing.isAvailableAsync() → verificar
    → Sharing.shareAsync(uri) → sheet nativo del SO
      → Usuario elige destino: WhatsApp, Telegram, AirDrop, Guardar, etc.
```

---

## Referencias

| Recurso | Enlace |
|---|---|
| expo-sharing | https://docs.expo.dev/versions/latest/sdk/sharing/ |
| react-native-view-shot | https://github.com/gre/react-native-view-shot |


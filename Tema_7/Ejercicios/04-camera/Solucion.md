# Solución — Fotografiar platos con la cámara (RecetApp)

## Proceso mental

1. **¿Cuándo tiene sentido tomar una foto?** → Al terminar de cocinar. La pantalla de felicitación del Nivel 4 es el punto perfecto para ofrecer esta opción.
2. **¿Qué módulo usar?** → `expo-camera` con `CameraView` (API moderna de Expo SDK 51+).
3. **¿Cómo gestionamos permisos?** → Con el hook `useCameraPermissions()` que Expo Camera proporciona.
4. **¿Dónde guardamos la foto?** → En el contexto como `recipePhotos[recipeId] = uri`. La URI local persiste mientras la app esté abierta.
5. **¿Cómo fluye la experiencia?** → Completar receta → botón "Fotografiar" → pantalla cámara → capturar → preview → guardar → volver al detalle (ahora con foto).

---

## Paso 1 — Instalar dependencia

```bash
npm install expo-camera
```

---

## Paso 2 — Ampliar el contexto

En `context/RecipesContext.js`, añade:

```jsx
// Dentro del RecipesProvider:
const [recipePhotos, setRecipePhotos] = useState({});

const saveRecipePhoto = (recipeId, uri) => {
    setRecipePhotos(prev => ({ ...prev, [recipeId]: uri }));
};

// Añadir al value del Provider:
// recipePhotos, saveRecipePhoto,
```

---

## Paso 3 — Registrar ruta en el Stack

En `(stack)/_layout.jsx`:

```jsx
<Stack.Screen
    name="landing/categories/[categoryName]/recipes/[idRecipe]/cooking/photo/index"
    options={{
        title: "Foto del plato",
        headerShown: false,
    }}
/>
```

---

## Paso 4 — Modificar pantalla de completado (Nivel 4)

En `cooking/index.jsx`, en la sección de `isCompleted`, añade el botón de cámara:

```jsx
// En la pantalla de completado (cuando isCompleted === true):
<Pressable
    onPress={() => router.push(
        `/(drawer)/(tabs)/(stack)/landing/categories/${categoryName}/recipes/${idRecipe}/cooking/photo`
    )}
    className="bg-purple-600 rounded-xl py-4 px-8 active:bg-purple-700 mb-4"
>
    <Text className="text-white text-lg font-bold text-center">📸 Fotografiar mi plato</Text>
</Pressable>
```

---

## Paso 5 — `cooking/photo/index.jsx` (Pantalla de cámara)

```jsx
import React, { useState, useRef } from 'react';
import { View, Text, Pressable, Image } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useRecipesContext } from '../../../../../../../../../context/RecipesContext';

export default function PhotoScreen() {
    const router = useRouter();
    const { idRecipe } = useLocalSearchParams();
    const { saveRecipePhoto } = useRecipesContext();

    const [permission, requestPermission] = useCameraPermissions();
    const [facing, setFacing] = useState('back');
    const [capturedPhoto, setCapturedPhoto] = useState(null);
    const cameraRef = useRef(null);

    // Tomar foto
    const takePicture = async () => {
        if (cameraRef.current) {
            try {
                const photo = await cameraRef.current.takePictureAsync({
                    quality: 0.8,
                    base64: false,
                });
                setCapturedPhoto(photo.uri);
            } catch (error) {
                console.error('Error al capturar foto:', error);
            }
        }
    };

    // Alternar cámara
    const toggleFacing = () => {
        setFacing(prev => prev === 'back' ? 'front' : 'back');
    };

    // Guardar foto y volver
    const handleSave = () => {
        saveRecipePhoto(parseInt(idRecipe), capturedPhoto);
        // Volver a la pantalla de detalle (retroceder 2 niveles: photo → cooking)
        router.back();
        router.back();
    };

    // Repetir foto
    const handleRetake = () => {
        setCapturedPhoto(null);
    };

    // --- Pantalla de permisos ---
    if (!permission) {
        return <View className="flex-1 bg-gray-900" />;
    }

    if (!permission.granted) {
        return (
            <View className="flex-1 bg-gray-900 justify-center items-center px-6">
                <Ionicons name="camera-outline" size={64} color="#6b7280" />
                <Text className="text-white text-xl text-center mt-4 font-bold">
                    Acceso a la cámara necesario
                </Text>
                <Text className="text-gray-400 text-center mt-2 mb-6">
                    Necesitamos acceso a la cámara para fotografiar tu plato terminado.
                </Text>
                <Pressable
                    onPress={requestPermission}
                    className="bg-blue-600 rounded-xl py-4 px-8 active:bg-blue-700"
                >
                    <Text className="text-white font-bold text-lg">Permitir acceso</Text>
                </Pressable>
                <Pressable
                    onPress={() => router.back()}
                    className="mt-4"
                >
                    <Text className="text-gray-400 text-base">Volver sin foto</Text>
                </Pressable>
            </View>
        );
    }

    // --- Preview de foto capturada ---
    if (capturedPhoto) {
        return (
            <View className="flex-1 bg-black">
                <Image
                    source={{ uri: capturedPhoto }}
                    style={{ flex: 1 }}
                    resizeMode="contain"
                />

                {/* Controles sobre la foto */}
                <View
                    className="absolute bottom-0 left-0 right-0 flex-row justify-around items-center pb-12 pt-6"
                    style={{ backgroundColor: 'rgba(0,0,0,0.6)' }}
                >
                    <Pressable
                        onPress={handleRetake}
                        className="items-center active:opacity-70"
                    >
                        <Ionicons name="refresh" size={32} color="white" />
                        <Text className="text-white text-sm mt-1">Repetir</Text>
                    </Pressable>

                    <Pressable
                        onPress={handleSave}
                        className="items-center active:opacity-70"
                    >
                        <View className="bg-green-500 w-16 h-16 rounded-full items-center justify-center">
                            <Ionicons name="checkmark" size={36} color="white" />
                        </View>
                        <Text className="text-white text-sm mt-1">Guardar</Text>
                    </Pressable>
                </View>
            </View>
        );
    }

    // --- Vista de cámara ---
    return (
        <View className="flex-1 bg-black">
            <CameraView
                ref={cameraRef}
                style={{ flex: 1 }}
                facing={facing}
            >
                {/* Controles superiores */}
                <View
                    className="absolute top-0 left-0 right-0 flex-row justify-between items-center px-6 pt-16"
                    style={{ backgroundColor: 'rgba(0,0,0,0.3)' }}
                >
                    <Pressable
                        onPress={() => router.back()}
                        className="active:opacity-70"
                    >
                        <Ionicons name="close" size={32} color="white" />
                    </Pressable>

                    <Text className="text-white text-lg font-bold">📸 Foto del plato</Text>

                    <Pressable
                        onPress={toggleFacing}
                        className="active:opacity-70"
                    >
                        <Ionicons name="camera-reverse-outline" size={32} color="white" />
                    </Pressable>
                </View>

                {/* Botón de captura */}
                <View className="absolute bottom-0 left-0 right-0 items-center pb-12 pt-6">
                    <Pressable
                        onPress={takePicture}
                        className="active:opacity-70"
                    >
                        <View
                            style={{
                                width: 80,
                                height: 80,
                                borderRadius: 40,
                                borderWidth: 5,
                                borderColor: 'white',
                                backgroundColor: 'rgba(255,255,255,0.3)',
                            }}
                        />
                    </Pressable>
                </View>
            </CameraView>
        </View>
    );
}
```

**Desglose:**

1. **`useCameraPermissions()`** → hook que devuelve `[permission, requestPermission]`. `permission` es `null` inicialmente, luego un objeto con `.granted`.
2. **3 estados de la pantalla**:
   - `!permission` → cargando.
   - `!permission.granted` → permiso no concedido, mostrar botón para pedirlo.
   - `capturedPhoto` → preview de la imagen con opciones guardar/repetir.
   - Default → vista de cámara con botón de captura.
3. **`takePictureAsync({ quality: 0.8 })`** → captura la foto con calidad 80% (buen equilibrio calidad/tamaño).
4. **`facing` toggle** → cambia entre cámara trasera (`'back'`) y frontal (`'front'`).
5. **Botón de captura** → un círculo blanco semitransparente con borde, estilo iOS.
6. **Preview** → muestra la imagen capturada con `<Image source={{ uri }}>`. "Guardar" llama a `saveRecipePhoto` y retrocede. "Repetir" vuelve a la cámara.
7. **`headerShown: false`** → la cámara se muestra a pantalla completa sin cabecera del Stack.

---

## Paso 6 — Mostrar la foto en el detalle

En `recipes/[idRecipe]/index.jsx`, al principio del `ScrollView`:

```jsx
// Importar Image de react-native
import { Image } from 'react-native';

// Obtener la foto del contexto:
const { recipePhotos } = useRecipesContext();
const recipePhoto = recipePhotos[recipe?.id];

// En el JSX, al inicio del contenido:
{recipePhoto && (
    <View className="mb-6">
        <View className="bg-gray-800 rounded-xl overflow-hidden">
            <Image
                source={{ uri: recipePhoto }}
                style={{ width: '100%', height: 250 }}
                resizeMode="cover"
            />
            <View className="absolute top-3 right-3 bg-black/60 rounded-lg px-3 py-1">
                <Text className="text-white text-sm font-bold">📸 Mi plato</Text>
            </View>
        </View>
    </View>
)}
```

---

## Flujo completo

```
Paso a paso (Nivel 4) → Completar todos los pasos
  → Pantalla de felicitación
    → Pulsar "📸 Fotografiar mi plato"
      → Navegar a cooking/photo/index.jsx
        → Se verifica/solicita permiso de cámara
        → Se muestra vista previa de cámara
          → Pulsar botón de captura → takePictureAsync()
            → Preview de la foto
              → "Guardar" → saveRecipePhoto() → router.back() × 2
              → "Repetir" → volver a la cámara

Detalle de receta (Nivel 3)
  → Si existe recipePhotos[id], muestra la foto en la parte superior
```

---

## Referencias

| Recurso | Enlace |
|---|---|
| expo-camera | https://docs.expo.dev/versions/latest/sdk/camera/ |
| CameraView | https://docs.expo.dev/versions/latest/sdk/camera/#cameraview |
| Image — React Native | https://reactnative.dev/docs/image |


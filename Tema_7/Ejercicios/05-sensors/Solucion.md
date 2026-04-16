# Solución — Receta aleatoria agitando el dispositivo (RecetApp)

## Proceso mental

1. **¿Qué sensor necesitamos?** → El acelerómetro (`Accelerometer` de `expo-sensors`). Mide la aceleración en x, y, z.
2. **¿Cómo detectamos una sacudida?** → Calculamos la fuerza total (`sqrt(x² + y² + z²)`). En reposo es ≈ 1 (gravedad). Si supera un umbral (1.8), es una sacudida.
3. **¿Cómo evitamos falsos positivos?** → Con un cooldown de 2 segundos entre detecciones.
4. **¿Dónde lo usamos?** → En la pantalla de categorías (Nivel 1). Es la "home" de la app, tiene sentido que al agitar aparezca una receta aleatoria.
5. **¿Cómo lo hacemos reutilizable?** → Con un hook `useShakeDetector` que encapsula toda la lógica del sensor.
6. **¿Cleanup?** → Fundamental desuscribirse del sensor al desmontar para no consumir batería innecesariamente.

---

## Paso 1 — Instalar dependencia

```bash
npm install expo-sensors
```

---

## Paso 2 — `hooks/useShakeDetector.js`

Hook personalizado reutilizable:

```javascript
import { useState, useEffect, useRef } from 'react';
import { Accelerometer } from 'expo-sensors';

/**
 * Hook que detecta sacudidas del dispositivo usando el acelerómetro.
 *
 * @param {Object} options
 * @param {Function} options.onShake - Callback ejecutado al detectar sacudida
 * @param {number} [options.threshold=1.8] - Umbral de fuerza para detectar sacudida
 * @param {number} [options.cooldown=2000] - Milisegundos de espera entre detecciones
 * @param {boolean} [options.enabled=true] - Activa/desactiva la detección
 * @returns {{ isShaking: boolean }}
 */
export const useShakeDetector = ({
    onShake,
    threshold = 1.8,
    cooldown = 2000,
    enabled = true,
} = {}) => {
    const [isShaking, setIsShaking] = useState(false);
    const lastShakeTime = useRef(0);
    const subscriptionRef = useRef(null);

    useEffect(() => {
        if (!enabled) {
            // Si está desactivado, limpiamos la suscripción existente
            if (subscriptionRef.current) {
                subscriptionRef.current.remove();
                subscriptionRef.current = null;
            }
            return;
        }

        // Configurar frecuencia de actualización (cada 100ms)
        Accelerometer.setUpdateInterval(100);

        // Suscribirse al acelerómetro
        subscriptionRef.current = Accelerometer.addListener(({ x, y, z }) => {
            // Calcular la fuerza total de aceleración
            const totalForce = Math.sqrt(x * x + y * y + z * z);
            const now = Date.now();

            if (totalForce > threshold && now - lastShakeTime.current > cooldown) {
                lastShakeTime.current = now;

                // Feedback visual: marcar como "shaking" brevemente
                setIsShaking(true);
                setTimeout(() => setIsShaking(false), 500);

                // Ejecutar el callback
                if (onShake) {
                    onShake();
                }
            }
        });

        // Cleanup: desuscribirse al desmontar
        return () => {
            if (subscriptionRef.current) {
                subscriptionRef.current.remove();
                subscriptionRef.current = null;
            }
        };
    }, [enabled, threshold, cooldown, onShake]);

    return { isShaking };
};
```

**Desglose:**

1. **`Accelerometer.setUpdateInterval(100)`** → recibimos datos cada 100ms. Un intervalo más corto es más sensible pero consume más batería.
2. **`Math.sqrt(x*x + y*y + z*z)`** → fuerza total en todas las direcciones. En reposo ≈ 1 (gravedad pura). Al sacudir puede llegar a 3-4.
3. **`threshold = 1.8`** → un valor que detecta sacudidas intencionadas sin activarse con movimientos normales (caminar, sacar el teléfono del bolsillo).
4. **`cooldown = 2000`** → 2 segundos entre detecciones. Una sacudida produce múltiples lecturas altas; el cooldown evita que se active 10 veces.
5. **`useRef` para `lastShakeTime`** → usamos ref en vez de state porque necesitamos el valor actualizado dentro del listener sin causar re-renders.
6. **`subscriptionRef`** → guardamos la suscripción en un ref para poder limpiarla en el cleanup.
7. **`isShaking`** → estado visual que se activa 500ms tras una sacudida (útil para animaciones).
8. **`enabled`** → permite desactivar el sensor cuando el modal está abierto o la pantalla no está enfocada.

---

## Paso 3 — Integrar en `landing/index.jsx` (Categorías)

```jsx
// Añadir imports:
import { useState, useCallback } from 'react';
import { Modal, Image } from 'react-native';
import * as Haptics from 'expo-haptics';
import { useShakeDetector } from '../../../hooks/useShakeDetector';
import { getAllRecipes } from '../../../data/recipesData';

// Dentro del componente CategoriesScreen:

const [randomRecipe, setRandomRecipe] = useState(null);
const [showRandomModal, setShowRandomModal] = useState(false);
const allRecipes = getAllRecipes();

// Seleccionar receta aleatoria
const pickRandomRecipe = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * allRecipes.length);
    return allRecipes[randomIndex];
}, [allRecipes]);

// Callback de sacudida
const handleShake = useCallback(() => {
    // Feedback háptico
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Seleccionar receta aleatoria
    const recipe = pickRandomRecipe();
    setRandomRecipe(recipe);
    setShowRandomModal(true);
}, [pickRandomRecipe]);

// Activar detector de sacudida
const { isShaking } = useShakeDetector({
    onShake: handleShake,
    threshold: 1.8,
    cooldown: 2000,
    enabled: !showRandomModal, // Desactivar mientras el modal está abierto
});

// Otra receta aleatoria (sin cerrar modal)
const handleAnotherRecipe = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setRandomRecipe(pickRandomRecipe());
};

// Navegar al detalle
const handleViewRecipe = () => {
    setShowRandomModal(false);
    if (randomRecipe) {
        router.push(
            `/(drawer)/(tabs)/(stack)/landing/categories/${randomRecipe.category}/recipes/${randomRecipe.id}`
        );
    }
};
```

---

## Paso 4 — Modal de receta aleatoria (JSX)

Añade al final del `ScrollView` existente:

```jsx
{/* Indicador de shake */}
<View className={`mt-4 mb-8 rounded-xl p-4 ${isShaking ? 'bg-orange-500/20' : 'bg-gray-800/50'}`}>
    <Text className="text-gray-400 text-center text-sm">
        📱 ¡Agita el teléfono para obtener una receta aleatoria!
    </Text>
</View>

{/* Modal de receta aleatoria */}
<Modal
    animationType="slide"
    transparent={true}
    visible={showRandomModal}
    onRequestClose={() => setShowRandomModal(false)}
>
    <View className="flex-1 justify-center items-center bg-black/60 px-6">
        <View className="bg-gray-800 rounded-2xl p-6 w-full max-w-sm">
            {/* Header */}
            <Text className="text-4xl text-center mb-2">🎲</Text>
            <Text className="text-white text-xl font-bold text-center mb-1">
                ¡Receta aleatoria!
            </Text>
            <Text className="text-gray-400 text-center text-sm mb-6">
                El destino ha elegido para ti:
            </Text>

            {randomRecipe && (
                <View className="bg-gray-700/50 rounded-xl p-4 mb-6">
                    {/* Título */}
                    <Text className="text-white text-2xl font-bold text-center mb-2">
                        {randomRecipe.title}
                    </Text>
                    <Text className="text-gray-400 text-center text-sm mb-4">
                        por {randomRecipe.author}
                    </Text>

                    {/* Info */}
                    <View className="flex-row justify-around mb-4">
                        <View className="items-center">
                            <Text className="text-gray-400 text-xs">Tiempo</Text>
                            <Text className="text-blue-400 font-bold">{randomRecipe.time}</Text>
                        </View>
                        <View className="items-center">
                            <Text className="text-gray-400 text-xs">Dificultad</Text>
                            <Text className="text-yellow-400 font-bold">{randomRecipe.difficulty}</Text>
                        </View>
                        <View className="items-center">
                            <Text className="text-gray-400 text-xs">Rating</Text>
                            <Text className="text-yellow-400 font-bold">⭐ {randomRecipe.rating}</Text>
                        </View>
                    </View>

                    {/* Descripción truncada */}
                    <Text
                        className="text-gray-300 text-sm leading-5"
                        numberOfLines={3}
                        ellipsizeMode="tail"
                    >
                        {randomRecipe.description}
                    </Text>
                </View>
            )}

            {/* Botones */}
            <Pressable
                onPress={handleViewRecipe}
                className="bg-orange-500 rounded-xl py-4 items-center active:bg-orange-600 mb-3"
            >
                <Text className="text-white text-lg font-bold">Ver receta completa</Text>
            </Pressable>

            <Pressable
                onPress={handleAnotherRecipe}
                className="bg-gray-600 rounded-xl py-4 items-center active:bg-gray-500 mb-3"
            >
                <Text className="text-white text-base">🎲 Otra receta</Text>
            </Pressable>

            <Pressable
                onPress={() => setShowRandomModal(false)}
                className="py-3 items-center"
            >
                <Text className="text-gray-400 text-base">Cerrar</Text>
            </Pressable>
        </View>
    </View>
</Modal>
```

**Desglose:**

1. **Indicador de shake** → el banner inferior cambia de color cuando `isShaking === true` (500ms). Da feedback visual sutil.
2. **`enabled: !showRandomModal`** → desactivamos el sensor mientras el modal está abierto para evitar que se dispare de nuevo.
3. **`handleAnotherRecipe`** → cambia la receta sin cerrar el modal. Haptic feedback ligero.
4. **`handleViewRecipe`** → cierra el modal y navega al detalle. Nótese que usamos `randomRecipe.category` para construir la ruta correcta.
5. **`useCallback`** → memoizamos los callbacks para evitar re-suscripciones innecesarias al acelerómetro.

---

## Flujo completo

```
Pantalla de categorías (Nivel 1)
  → Acelerómetro activo en segundo plano
  → Usuario agita el teléfono
    → totalForce > 1.8 → cooldown ok
      → Haptic feedback (vibración de éxito)
      → Se selecciona receta aleatoria de las 17 disponibles
      → Modal con la receta
        → "Ver receta completa" → navegar al detalle
        → "Otra receta" → nueva aleatoria (sin cerrar modal)
        → "Cerrar" → cerrar modal → acelerómetro se reactiva
```

---

## Nota sobre simuladores

El acelerómetro **no funciona en simuladores iOS ni emuladores Android**. Para probar:

- **Dispositivo físico**: ideal, simplemente sacude el teléfono.
- **Simulador iOS**: `Ctrl+Cmd+Z` simula una sacudida (aunque no llega al acelerómetro de expo-sensors).
- **Alternativa de debug**: añade un botón temporal "Simular shake" que llame directamente a `handleShake()`:

```jsx
{/* Solo para testing en simulador — eliminar en producción */}
{__DEV__ && (
    <Pressable onPress={handleShake} className="bg-red-600/20 rounded-xl p-3 mb-4">
        <Text className="text-red-400 text-center text-sm">
            🧪 [DEV] Simular shake
        </Text>
    </Pressable>
)}
```

---

## Referencias

| Recurso | Enlace |
|---|---|
| Accelerometer — expo-sensors | https://docs.expo.dev/versions/latest/sdk/accelerometer/ |
| expo-sensors (todos) | https://docs.expo.dev/versions/latest/sdk/sensors/ |
| expo-haptics | https://docs.expo.dev/versions/latest/sdk/haptics/ |


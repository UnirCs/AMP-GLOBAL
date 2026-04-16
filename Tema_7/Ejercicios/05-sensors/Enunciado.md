# Ejercicio 5 — Receta aleatoria agitando el dispositivo (RecetApp)

## Objetivo

Ampliar **RecetApp** para que el usuario pueda **obtener una receta aleatoria agitando el dispositivo** (shake gesture). En la pantalla de categorías (Nivel 1), al detectar una agitación del teléfono, se mostrará un modal con una receta aleatoria y opciones para verla o descartar. Esto demuestra el uso de sensores del dispositivo de forma creativa y lúdica.

Se practicará el módulo **expo-sensors**, específicamente el **acelerómetro**, para detectar el gesto de sacudida.

---

## Conceptos previos

### expo-sensors — Acelerómetro

El acelerómetro mide la aceleración del dispositivo en los 3 ejes (x, y, z) en m/s². Permite detectar movimiento, inclinación y gestos como sacudidas.

```jsx
import { Accelerometer } from 'expo-sensors';

// Suscribirse a las actualizaciones del acelerómetro
const subscription = Accelerometer.addListener(({ x, y, z }) => {
    console.log(`x: ${x}, y: ${y}, z: ${z}`);
});

// Configurar la frecuencia de actualización (en milisegundos)
Accelerometer.setUpdateInterval(100); // cada 100ms

// Cancelar la suscripción
subscription.remove();
```

**Ejes del acelerómetro:**

```
        y (+)
        |
        |
        |_____ x (+)
       /
      /
     z (+)
```

| Eje | Positivo | Negativo |
|---|---|---|
| `x` | Inclinación a la derecha | Inclinación a la izquierda |
| `y` | Inclinación hacia arriba | Inclinación hacia abajo |
| `z` | Pantalla hacia arriba (≈ 1.0) | Pantalla hacia abajo (≈ -1.0) |

**En reposo** (dispositivo plano sobre una mesa, pantalla arriba): `x ≈ 0, y ≈ 0, z ≈ 1` (la gravedad actúa sobre z).

**Funciones principales:**

| Función | Descripción |
|---|---|
| `addListener(callback)` | Se suscribe a las lecturas. Recibe `{ x, y, z }` |
| `removeAllListeners()` | Elimina todas las suscripciones |
| `setUpdateInterval(ms)` | Define cada cuánto se reciben datos (default: 100ms) |
| `isAvailableAsync()` | Verifica si el dispositivo tiene acelerómetro |

> 📖 [Accelerometer — expo-sensors](https://docs.expo.dev/versions/latest/sdk/accelerometer/)

### Otros sensores disponibles en expo-sensors

| Sensor | Qué mide | Caso de uso típico |
|---|---|---|
| `Accelerometer` | Aceleración (x, y, z) | Detectar sacudidas, paso a paso |
| `Gyroscope` | Velocidad de rotación | Estabilización, juegos |
| `Magnetometer` | Campo magnético | Brújula |
| `Barometer` | Presión atmosférica | Altitud |
| `Pedometer` | Pasos del usuario | Fitness, salud |
| `DeviceMotion` | Combinación de acelerómetro + giroscopio | Realidad aumentada |
| `LightSensor` | Nivel de luz ambiental (solo Android) | Ajuste automático de brillo |

> 📖 [expo-sensors — Documentación completa](https://docs.expo.dev/versions/latest/sdk/sensors/)

### Detectar sacudida (shake detection)

La fuerza de aceleración total se calcula como:

```javascript
const totalForce = Math.sqrt(x * x + y * y + z * z);
```

- En reposo: `totalForce ≈ 1.0` (gravedad).
- Sacudida suave: `totalForce ≈ 1.5 - 2.0`.
- Sacudida fuerte: `totalForce ≈ 2.5 - 4.0+`.

**Algoritmo de detección:**

```javascript
const SHAKE_THRESHOLD = 1.8; // Umbral de fuerza para considerar "sacudida"

Accelerometer.addListener(({ x, y, z }) => {
    const totalForce = Math.sqrt(x * x + y * y + z * z);
    if (totalForce > SHAKE_THRESHOLD) {
        // ¡Sacudida detectada!
    }
});
```

Para evitar detecciones múltiples por una sola sacudida, se usa un **cooldown**:

```javascript
const COOLDOWN_MS = 2000; // 2 segundos de espera entre detecciones
let lastShakeTime = 0;

const handleAccelerometerData = ({ x, y, z }) => {
    const totalForce = Math.sqrt(x * x + y * y + z * z);
    const now = Date.now();

    if (totalForce > SHAKE_THRESHOLD && now - lastShakeTime > COOLDOWN_MS) {
        lastShakeTime = now;
        onShakeDetected();
    }
};
```

---

## Parte 1 — Instalar dependencias

```bash
npm install expo-sensors
```

---

## Parte 2 — Hook personalizado: `useShakeDetector`

Crea un hook reutilizable `hooks/useShakeDetector.js` que:

1. Se suscribe al acelerómetro al montar.
2. Calcula la fuerza total en cada lectura.
3. Detecta si supera el umbral (`SHAKE_THRESHOLD = 1.8`).
4. Aplica un cooldown para evitar detecciones múltiples.
5. Llama a un callback `onShake()` cuando detecta una sacudida.
6. Se desuscribe al desmontar (cleanup).
7. Recibe una opción `enabled` para activar/desactivar la detección.

**Interfaz del hook:**

```javascript
const { isShaking } = useShakeDetector({
    onShake: () => { /* mostrar receta aleatoria */ },
    threshold: 1.8,
    cooldown: 2000,
    enabled: true,
});
```

---

## Parte 3 — Integrar en la pantalla de categorías (Nivel 1)

En `landing/index.jsx`:

1. **Usar `useShakeDetector`** con un callback que selecciona una receta aleatoria.
2. **Mostrar un modal** con la receta aleatoria seleccionada.
3. **Botones en el modal**:
   - "Ver receta" → navega al detalle de la receta (`router.push(...)`).
   - "Otra receta" → selecciona otra receta aleatoria (sin cerrar el modal).
   - "Cerrar" → cierra el modal.
4. **Indicador visual** sutil que informe al usuario de que puede agitar el dispositivo (ej. un texto en el footer: "📱 ¡Agita el teléfono para una receta aleatoria!").

---

## Parte 4 — Feedback háptico (opcional)

Si instalaste `expo-haptics` en ejercicios anteriores, añade feedback háptico al detectar la sacudida:

```javascript
import * as Haptics from 'expo-haptics';

const onShake = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    // Mostrar modal con receta aleatoria...
};
```

---

## Checklist

- [ ] `expo-sensors` instalado y funcionando
- [ ] Hook `useShakeDetector` creado con suscripción al acelerómetro
- [ ] `Accelerometer.addListener()` para recibir lecturas
- [ ] `Accelerometer.setUpdateInterval()` configurado (100-150ms)
- [ ] Cálculo de fuerza total: `Math.sqrt(x² + y² + z²)`
- [ ] Umbral de sacudida (`SHAKE_THRESHOLD ≈ 1.8`)
- [ ] Cooldown para evitar múltiples detecciones
- [ ] Cleanup al desmontar (`subscription.remove()`)
- [ ] Modal con receta aleatoria al agitar
- [ ] Botón "Ver receta" que navega al detalle
- [ ] Botón "Otra receta" que selecciona otra aleatoria
- [ ] Texto indicativo para el usuario
- [ ] (Opcional) Feedback háptico con `expo-haptics`

---

## Referencias técnicas

| Recurso | Enlace |
|---|---|
| Accelerometer — expo-sensors | https://docs.expo.dev/versions/latest/sdk/accelerometer/ |
| expo-sensors (todos) | https://docs.expo.dev/versions/latest/sdk/sensors/ |
| Gyroscope | https://docs.expo.dev/versions/latest/sdk/gyroscope/ |
| Pedometer | https://docs.expo.dev/versions/latest/sdk/pedometer/ |
| DeviceMotion | https://docs.expo.dev/versions/latest/sdk/devicemotion/ |
| expo-haptics | https://docs.expo.dev/versions/latest/sdk/haptics/ |


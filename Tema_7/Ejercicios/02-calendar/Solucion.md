# Solución — Añadir recetas al calendario (RecetApp)

## Proceso mental

1. **¿Dónde encaja?** → En el detalle de la receta (Nivel 3). No necesita pantalla nueva, sino un modal/sección dentro del detalle para seleccionar fecha y hora.
2. **¿Qué permisos?** → `Calendar.requestCalendarPermissionsAsync()`. Se pide al pulsar el botón.
3. **¿Cómo elegimos el calendario?** → Obtenemos todos con `getCalendarsAsync()` y usamos el `isPrimary` o el primero disponible.
4. **¿Cómo calculamos la duración?** → Parseamos `recipe.time` (ej. "90 min") para extraer los minutos y calcular `endDate`.
5. **¿Qué datos incluimos en el evento?** → Título con nombre de receta, ingredientes como notas, recordatorio 30 min antes.

---

## Paso 1 — Instalar dependencias

```bash
npm install expo-calendar @react-native-community/datetimepicker
```

---

## Paso 2 — Añadir lógica de calendario al detalle de la receta

Modificamos `recipes/[idRecipe]/index.jsx` para incluir la funcionalidad completa:

```jsx
// Añadir a los imports existentes:
import { useState } from 'react';
import { Modal } from 'react-native';
import * as Calendar from 'expo-calendar';
import DateTimePicker from '@react-native-community/datetimepicker';

// Dentro del componente, añadir estado y funciones:

const [showCalendarModal, setShowCalendarModal] = useState(false);
const [selectedDate, setSelectedDate] = useState(new Date());
const [showDatePicker, setShowDatePicker] = useState(false);
const [showTimePicker, setShowTimePicker] = useState(false);

// Parsear duración de la receta
const parseDuration = (timeString) => {
    const match = timeString.match(/(\d+)/);
    return match ? parseInt(match[1]) : 60;
};

const handleOpenCalendarModal = () => {
    setSelectedDate(new Date());
    setShowCalendarModal(true);
};

const handleCreateCalendarEvent = async () => {
    // 1. Solicitar permisos
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    if (status !== 'granted') {
        Alert.alert(
            'Permisos insuficientes',
            'Necesitamos acceso al calendario para crear el evento.'
        );
        return;
    }

    // 2. Obtener calendarios disponibles
    const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
    const defaultCalendar = calendars.find(cal => cal.isPrimary) || calendars[0];

    if (!defaultCalendar) {
        Alert.alert('Error', 'No se encontró ningún calendario en el dispositivo.');
        return;
    }

    // 3. Calcular fechas
    const durationMinutes = parseDuration(recipe.time);
    const startDate = new Date(selectedDate);
    const endDate = new Date(startDate.getTime() + durationMinutes * 60 * 1000);

    // 4. Preparar detalles del evento
    const eventDetails = {
        title: `🍳 Cocinar: ${recipe.title}`,
        startDate,
        endDate,
        timeZone: 'Europe/Madrid',
        location: 'Mi cocina',
        notes: `Receta: ${recipe.title}\n` +
               `Autor: ${recipe.author}\n` +
               `Dificultad: ${recipe.difficulty}\n` +
               `Porciones: ${recipe.servings}\n\n` +
               `Ingredientes:\n${recipe.ingredients.map(i => `• ${i}`).join('\n')}`,
        alarms: [{ relativeOffset: -30 }], // Recordatorio 30 min antes
    };

    // 5. Crear el evento
    try {
        await Calendar.createEventAsync(defaultCalendar.id, eventDetails);
        setShowCalendarModal(false);
        Alert.alert(
            '📅 ¡Evento creado!',
            `Se ha añadido "${recipe.title}" a tu calendario para el ${startDate.toLocaleDateString('es-ES')} a las ${startDate.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}.\n\nRecibirás un recordatorio 30 minutos antes.`
        );
    } catch (error) {
        console.error('Error creando evento:', error);
        Alert.alert('Error', 'No se pudo crear el evento en el calendario.');
    }
};

const onDateChange = (event, date) => {
    setShowDatePicker(false);
    if (date) {
        const updated = new Date(selectedDate);
        updated.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
        setSelectedDate(updated);
    }
};

const onTimeChange = (event, time) => {
    setShowTimePicker(false);
    if (time) {
        const updated = new Date(selectedDate);
        updated.setHours(time.getHours(), time.getMinutes());
        setSelectedDate(updated);
    }
};
```

---

## Paso 3 — Botón y Modal en el JSX

```jsx
{/* Botón "Planificar en calendario" — después de los otros botones */}
<Pressable
    onPress={handleOpenCalendarModal}
    className="bg-green-600 rounded-xl py-4 px-6 flex-row items-center justify-center active:bg-green-700 mb-4"
>
    <Ionicons name="calendar-outline" size={24} color="white" />
    <Text className="text-white text-lg font-bold ml-2">
        Planificar en calendario
    </Text>
</Pressable>

{/* Modal de selección de fecha/hora */}
<Modal
    animationType="slide"
    transparent={true}
    visible={showCalendarModal}
    onRequestClose={() => setShowCalendarModal(false)}
>
    <View className="flex-1 justify-end bg-black/50">
        <View className="bg-gray-800 rounded-t-3xl p-6">
            <Text className="text-white text-xl font-bold text-center mb-2">
                📅 Planificar receta
            </Text>
            <Text className="text-gray-400 text-center mb-6">
                ¿Cuándo quieres cocinar "{recipe.title}"?
            </Text>

            {/* Selector de fecha */}
            <Pressable
                onPress={() => setShowDatePicker(true)}
                className="bg-gray-700 rounded-xl p-4 mb-3 flex-row items-center"
            >
                <Ionicons name="calendar" size={24} color="#60a5fa" />
                <View className="ml-3">
                    <Text className="text-gray-400 text-sm">Fecha</Text>
                    <Text className="text-white text-lg font-bold">
                        {selectedDate.toLocaleDateString('es-ES', {
                            weekday: 'long', day: 'numeric', month: 'long'
                        })}
                    </Text>
                </View>
            </Pressable>

            {showDatePicker && (
                <DateTimePicker
                    value={selectedDate}
                    mode="date"
                    display="default"
                    minimumDate={new Date()}
                    onChange={onDateChange}
                />
            )}

            {/* Selector de hora */}
            <Pressable
                onPress={() => setShowTimePicker(true)}
                className="bg-gray-700 rounded-xl p-4 mb-3 flex-row items-center"
            >
                <Ionicons name="time" size={24} color="#fbbf24" />
                <View className="ml-3">
                    <Text className="text-gray-400 text-sm">Hora</Text>
                    <Text className="text-white text-lg font-bold">
                        {selectedDate.toLocaleTimeString('es-ES', {
                            hour: '2-digit', minute: '2-digit'
                        })}
                    </Text>
                </View>
            </Pressable>

            {showTimePicker && (
                <DateTimePicker
                    value={selectedDate}
                    mode="time"
                    display="default"
                    onChange={onTimeChange}
                />
            )}

            {/* Info de duración */}
            <View className="bg-gray-700/50 rounded-xl p-4 mb-6">
                <Text className="text-gray-400 text-center text-sm">
                    ⏱️ Duración estimada: {recipe.time}
                    {'\n'}🔔 Recordatorio: 30 min antes
                </Text>
            </View>

            {/* Botones */}
            <Pressable
                onPress={handleCreateCalendarEvent}
                className="bg-green-600 rounded-xl py-4 items-center active:bg-green-700 mb-3"
            >
                <Text className="text-white text-lg font-bold">Crear evento</Text>
            </Pressable>

            <Pressable
                onPress={() => setShowCalendarModal(false)}
                className="bg-gray-600 rounded-xl py-4 items-center active:bg-gray-500 mb-4"
            >
                <Text className="text-white text-lg">Cancelar</Text>
            </Pressable>
        </View>
    </View>
</Modal>
```

**Desglose:**

1. **Modal con fondo semitransparente** → `bg-black/50` oscurece el fondo. El contenido aparece como un "bottom sheet".
2. **DateTimePicker** → se muestra al pulsar la fila de fecha/hora. En iOS aparece como un picker inline; en Android como un diálogo nativo.
3. **`minimumDate={new Date()}`** → no permite seleccionar fechas pasadas.
4. **Duración calculada** → `parseDuration('90 min')` devuelve `90`. `endDate = startDate + 90 * 60 * 1000 ms`.
5. **Ingredientes como notas** → se formatean con bullets: `• 1 kg de tomates\n• 1 pepino...`.
6. **Alarm con `relativeOffset: -30`** → el dispositivo mostrará una notificación 30 minutos antes del evento.
7. **`Calendar.EntityTypes.EVENT`** → solo obtenemos calendarios de eventos (no de recordatorios).
8. **Fallback** → si no hay calendario primario, usamos el primero disponible (`calendars[0]`).

---

## Flujo completo

```
Detalle de receta (Nivel 3)
  → Pulsar "Planificar en calendario"
    → Se abre modal de selección
      → Seleccionar fecha (DateTimePicker modo date)
      → Seleccionar hora (DateTimePicker modo time)
      → Pulsar "Crear evento"
        → Se solicita permiso de calendario (primera vez)
        → Se obtiene el calendario principal
        → Se crea el evento con título, ubicación, ingredientes y alarma
        → Alert de confirmación
```

---

## Referencias

| Recurso | Enlace |
|---|---|
| expo-calendar | https://docs.expo.dev/versions/latest/sdk/calendar/ |
| DateTimePicker | https://github.com/react-native-datetimepicker/datetimepicker |


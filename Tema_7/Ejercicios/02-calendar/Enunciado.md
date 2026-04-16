# Ejercicio 2 — Añadir recetas al calendario (RecetApp)

## Objetivo

Ampliar **RecetApp** para que el usuario pueda **crear un evento en el calendario del dispositivo** para planificar cuándo va a cocinar una receta. Desde el detalle de la receta, el usuario seleccionará fecha y hora, y se creará un evento con el título de la receta, la duración estimada y los ingredientes como notas.

Se practicará el módulo **expo-calendar**, incluyendo solicitud de permisos, lectura de calendarios disponibles y creación de eventos.

---

## Conceptos previos

### expo-calendar

Permite leer y escribir eventos en el calendario nativo del dispositivo.

```jsx
import * as Calendar from 'expo-calendar';

// Solicitar permisos
const { status } = await Calendar.requestCalendarPermissionsAsync();

// Obtener calendarios del dispositivo
const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);

// Crear un evento
const eventId = await Calendar.createEventAsync(calendarId, {
    title: 'Cocinar Paella',
    startDate: new Date('2026-04-20T18:00:00'),
    endDate: new Date('2026-04-20T19:30:00'),
    timeZone: 'Europe/Madrid',
    location: 'Mi cocina',
    notes: 'Ingredientes: arroz, pollo, azafrán...',
    alarms: [{ relativeOffset: -30 }], // Recordatorio 30 min antes
});
```

**Funciones principales:**

| Función | Descripción |
|---|---|
| `requestCalendarPermissionsAsync()` | Solicita permiso para acceder al calendario |
| `getCalendarsAsync(entityType)` | Obtiene los calendarios disponibles. `entityType` puede ser `Calendar.EntityTypes.EVENT` o `REMINDER` |
| `createEventAsync(calendarId, eventDetails)` | Crea un evento en el calendario especificado |
| `updateEventAsync(eventId, eventDetails)` | Actualiza un evento existente |
| `deleteEventAsync(eventId)` | Elimina un evento |
| `getEventsAsync(calendarIds, startDate, endDate)` | Obtiene eventos en un rango de fechas |

**Propiedades del evento (`eventDetails`):**

| Propiedad | Tipo | Descripción |
|---|---|---|
| `title` | `string` | Título del evento |
| `startDate` | `Date` | Fecha y hora de inicio |
| `endDate` | `Date` | Fecha y hora de fin |
| `timeZone` | `string` | Zona horaria (ej. `'Europe/Madrid'`) |
| `location` | `string` | Ubicación del evento |
| `notes` | `string` | Notas o descripción del evento |
| `alarms` | `array` | Recordatorios. Ej: `[{ relativeOffset: -30 }]` (30 min antes) |
| `url` | `string` | URL asociada al evento |

**`alarms`** — Recordatorios:

```jsx
alarms: [
    { relativeOffset: -30 },  // 30 minutos antes
    { relativeOffset: -60 },  // 1 hora antes
    { relativeOffset: -1440 }, // 1 día antes (1440 min)
]
```

> `relativeOffset` es en **minutos**. Valores negativos indican "antes del evento".

> 📖 [expo-calendar — Documentación](https://docs.expo.dev/versions/latest/sdk/calendar/)

### Selección de fecha/hora

React Native no incluye un date picker nativo. Puedes usar un enfoque simplificado con inputs de texto o la librería `@react-native-community/datetimepicker`:

```bash
npm install @react-native-community/datetimepicker
```

```jsx
import DateTimePicker from '@react-native-community/datetimepicker';

<DateTimePicker
    value={date}
    mode="date"    // 'date', 'time', o 'datetime'
    display="default"
    onChange={(event, selectedDate) => setDate(selectedDate)}
/>
```

> 📖 [DateTimePicker — GitHub](https://github.com/react-native-datetimepicker/datetimepicker)

Alternativamente, puedes crear un selector simple con `Pressable` y `useState` que muestre opciones predefinidas (hoy, mañana, pasado mañana) y horas comunes (12:00, 14:00, 18:00, 20:00).

---

## Parte 1 — Instalar dependencias adicionales

Partiendo del proyecto del ejercicio anterior (con contacts + sms):

```bash
npm install expo-calendar @react-native-community/datetimepicker
```

---

## Parte 2 — Botón "Añadir al calendario" en el detalle

En la pantalla de detalle de la receta (`recipes/[idRecipe]/index.jsx`), añade un botón:

- Icono: `calendar-outline` de Ionicons.
- Texto: "Planificar en calendario".
- Al pulsarlo, muestra un **modal o sección desplegable** para seleccionar fecha y hora.

---

## Parte 3 — Funcionalidad del calendario

Implementa la lógica directamente en la pantalla de detalle (no necesita pantalla nueva):

1. **Solicitar permisos** al pulsar el botón.
2. **Obtener calendarios** y seleccionar el principal (`isPrimary`) o el primero disponible.
3. **Permitir al usuario seleccionar fecha y hora** (modal con DateTimePicker o selector simplificado).
4. **Calcular la duración** del evento: parsear `recipe.time` (ej. "90 min" → 90 minutos) y calcular `endDate = startDate + duración`.
5. **Crear el evento** con:
   - `title`: `"🍳 Cocinar: {recipe.title}"`
   - `startDate` y `endDate`: según la selección del usuario y la duración.
   - `location`: `"Mi cocina"`.
   - `notes`: lista de ingredientes (`recipe.ingredients.join('\n')`).
   - `alarms`: recordatorio 30 minutos antes.
6. **Confirmar al usuario** con un `Alert` indicando que el evento se ha creado.

---

## Parte 4 — Parseo de duración de la receta

Las recetas tienen `time` como string (ej. `"90 min"`, `"30 min + reposo"`, `"20 min"`). Crea una función helper para parsear la duración en minutos:

```javascript
const parseDuration = (timeString) => {
    const match = timeString.match(/(\d+)/);
    return match ? parseInt(match[1]) : 60; // Default 60 min
};
```

---

## Checklist

- [ ] `expo-calendar` instalado y funcionando
- [ ] Permiso de calendario solicitado con `requestCalendarPermissionsAsync()`
- [ ] Calendarios obtenidos con `getCalendarsAsync()`
- [ ] Calendario primario seleccionado automáticamente
- [ ] Selector de fecha y hora funcional (DateTimePicker o alternativa)
- [ ] Duración calculada a partir de `recipe.time`
- [ ] Evento creado con `createEventAsync()` con título, ubicación, notas e ingredientes
- [ ] Recordatorio (alarm) configurado 30 minutos antes
- [ ] `Alert` de confirmación al crear el evento
- [ ] Gestión de errores y permisos denegados

---

## Referencias técnicas

| Recurso | Enlace |
|---|---|
| expo-calendar | https://docs.expo.dev/versions/latest/sdk/calendar/ |
| DateTimePicker | https://github.com/react-native-datetimepicker/datetimepicker |
| Permissions | https://docs.expo.dev/guides/permissions/ |


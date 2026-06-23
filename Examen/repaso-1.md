# Repaso 1 — Desarrollo de Aplicaciones Móviles Multiplataforma con React Native y Expo

> Material de repaso. Cada pregunta tiene 4 opciones y solo una es correcta.
> Despliega el bloque **«Ver solución»** de cada pregunta para comprobar la respuesta y las justificaciones.
> Recuerda revisar el material de clase, código de apoyo y recursos audiovisuales.
---

## Enunciado General

El equipo de desarrollo de **UnirTravel** trabaja en una aplicación móvil multiplataforma de reserva de viajes (vuelos y hoteles), construida con React Native, Expo SDK 55 y NativeWind v4 (Tailwind CSS para React Native). La navegación está gestionada por Expo Router v4 (enrutamiento basado en archivos). La app consume una API REST desplegada en `https://unir-travel-repaso.com/api`.

El equipo está formado por:
- **Elena** — lead developer, macOS, prueba exclusivamente en simulador iOS (Xcode)
- **Javier** — frontend developer, Windows, prueba en emulador Android (AVD Manager)
- **Rocío** — QA engineer, iPhone 14 Pro físico
- **Tomás** — junior developer, macOS, simulador iOS exclusivamente
- **Alba** — UI/UX developer, macOS, simulador iOS (Xcode 15)
- **Gonzalo** — backend developer (apoyo mobile), Linux, emulador Android (AVD)
- **Marina** — QA junior, Windows, emulador Android Pixel 8 (sin dispositivo físico)
- **Sergio** — tech lead, macOS, revisión de código únicamente (sin entorno de ejecución configurado)

### Funcionalidades implementadas

- Login y registro: `POST /auth-sessions`, `POST /users`
- Búsqueda de destinos por ciudad: `GET /destinations?city={city}`
- Detalle del viaje: `GET /trips/{id}`
- Reserva: `POST /bookings`
- Añadir el vuelo al calendario: `expo-calendar`
- Compartir el itinerario por SMS: `expo-sms` + `expo-contacts`
- Compartir la tarjeta de embarque: `expo-sharing`
- Tipografía de marca personalizada: NativeWind + `expo-font`

---

## Preguntas

---

### Pregunta 1

El equipo debate si construir UnirTravel como `WebView` pura o como app nativa con React Native. ¿Cuál de las siguientes afirmaciones describe correctamente una diferencia relevante para las funcionalidades de UnirTravel?

A) Una `WebView` pura puede acceder directamente a `expo-calendar` y `expo-contacts` sin capa adicional, porque son parte del estándar de APIs web del navegador.

B) Una `WebView` pura no puede acceder directamente a APIs nativas como el calendario del sistema o la agenda de contactos sin un puente nativo; React Native sí lo permite mediante módulos como `expo-calendar` o `expo-contacts`.

C) La app `WebView` tendría acceso completo al hardware mediante el navegador embebido, incluyendo el calendario del sistema y la agenda de contactos nativa.

D) La ventaja de React Native frente a `WebView` es que compila el JavaScript a código máquina nativo, mientras que `WebView` interpreta el HTML/CSS en un bytecode propio.

<details>
<summary><strong>Ver solución</strong></summary>

✅ **Respuesta correcta: B**

**Por qué es correcta:** una `WebView` pura está limitada a las APIs del navegador y no puede acceder directamente al calendario del sistema ni a la agenda de contactos sin un puente nativo. React Native sí accede a ellos mediante módulos como `expo-calendar` o `expo-contacts`.

**Por qué las demás no:**
- **A)** `expo-calendar` y `expo-contacts` son módulos de Expo/React Native, no APIs estándar del navegador disponibles en una WebView pura.
- **C)** El navegador embebido no concede acceso «completo» al hardware; restringe esas capacidades.
- **D)** React Native no compila el JS a código máquina nativo; el JS corre en un motor (Hermes/JSC) y se comunica con lo nativo vía bridge/JSI. La descripción del mecanismo es falsa.

</details>

---

### Pregunta 2

Marina clona el repositorio en una máquina nueva (sin `package-lock.json`) y ejecuta `npm install`. Dado el extracto de `package.json`:

```json
"expo-calendar": "~14.0.0",
"expo-sms":      "^13.0.0",
"expo-contacts": "^14.0.0",
"react-native":  "0.79.0"
```

¿Qué dependencias podrían quedar en una versión distinta respecto a la del lead?

A) Ninguna: `npm install` instala siempre las versiones literales del `package.json`.

B) Solo `expo-calendar`, porque `~` es el único operador que admite resoluciones no exactas.

C) Solo `react-native`, porque al no llevar operador npm instala la última versión publicada.

D) `expo-calendar`, `expo-sms` y `expo-contacts`: `~14.0.0` admite parches (`14.0.x`); `^13.0.0` admite minor y patch (`13.x.x`); `^14.0.0` admite minor y patch (`14.x.x`). `react-native: 0.79.0` sin operador queda fijo.

<details>
<summary><strong>Ver solución</strong></summary>

✅ **Respuesta correcta: D**

**Por qué es correcta:**
- `~X.Y.Z` admite solo parches: `~14.0.0` → `14.0.x`.
- `^X.Y.Z` (major > 0) admite minor y patch: `^13.0.0` → `13.x.x` y `^14.0.0` → `14.x.x`.
- `react-native: 0.79.0` sin operador instala siempre esa versión exacta.

Sin lockfile, los rangos pueden resolverse a versiones más nuevas dentro del rango.

**Por qué las demás no:**
- **A)** Con `~` y `^`, npm puede resolver versiones más nuevas; sería el lockfile (ausente) lo que fijaría versiones exactas.
- **B)** `~` no es el único que admite rangos: `^` también, y de hecho con mayor amplitud.
- **C)** Una versión sin operador es exacta, no «la última publicada».

</details>

---

### Pregunta 3

Este componente del buscador de viajes se renderiza pero **sin estilos** (fondo blanco, texto negro):

```jsx
import { View, Text } from 'react-native';

export default function SearchHeader() {
  return (
    <View className="flex-1 bg-sky-700 px-4 py-3">
      <Text className="text-white text-2xl font-bold">UnirTravel</Text>
    </View>
  );
}
```

¿Cuál es la causa más probable?

A) Falta alguna pieza de la configuración de NativeWind (babel plugin, `withNativeWind` en Metro o la importación del CSS global); con la configuración incompleta, `className` se ignora silenciosamente y el componente se renderiza sin estilos.

B) `className` no es válido en React Native bajo ninguna circunstancia y el código lanzaría un error de compilación.

C) React Native imprime en consola `Unknown prop className on <View>` y deja de renderizar el componente.

D) NativeWind v4 no admite `className` en componentes del core como `View`/`Text`; hay que usar `style`.

<details>
<summary><strong>Ver solución</strong></summary>

✅ **Respuesta correcta: A**

**Por qué es correcta:** NativeWind requiere tres piezas (babel plugin, `withNativeWind` en `metro.config.js` y la importación del CSS global). Si falta alguna, `className` se ignora silenciosamente y el componente aparece sin estilos.

**Por qué las demás no:**
- **B)** Con NativeWind bien configurado, `className` funciona; no provoca un error de compilación.
- **C)** React Native no emite advertencias por props desconocidas en componentes del core ni deja de renderizar por ello.
- **D)** NativeWind v4 sí aplica `className` a `View`/`Text` del core mediante `cssInterop`.

</details>

---

### Pregunta 4

Dos versiones de la pantalla de resultados en un iPhone 14 Pro (con Dynamic Island):

```jsx
// Versión A
import { View, FlatList } from 'react-native';
export default function Results() {
  return (
    <View className="flex-1 bg-slate-900">
      <FlatList /* ... */ />
    </View>
  );
}

// Versión B
import { SafeAreaView } from 'react-native-safe-area-context';
import { FlatList } from 'react-native';
export default function Results() {
  return (
    <SafeAreaView className="flex-1 bg-slate-900">
      <FlatList /* ... */ />
    </SafeAreaView>
  );
}
```

¿Qué versión evita que el contenido quede oculto bajo el Dynamic Island/notch?

A) La Versión A, porque `FlatList` incluye soporte nativo de safe areas en su contenido.

B) Ambas son equivalentes en dispositivos con notch.

C) La Versión B, porque `SafeAreaView` de `react-native-safe-area-context` añade automáticamente el padding necesario para respetar el notch, la barra de estado y la zona de gestos.

D) La Versión A, porque `View` con `flex-1` calcula y reserva por defecto las áreas seguras del dispositivo.

<details>
<summary><strong>Ver solución</strong></summary>

✅ **Respuesta correcta: C**

**Por qué es correcta:** `SafeAreaView` de `react-native-safe-area-context` calcula y aplica el padding correspondiente a las áreas no seguras de cada dispositivo (notch/Dynamic Island, barra de estado, zona de gestos inferior).

**Por qué las demás no:**
- **A)** `FlatList` no inserta padding de safe area por sí mismo.
- **B)** No son equivalentes: la Versión A deja el contenido bajo el Dynamic Island.
- **D)** Un `View` con `flex-1` no aplica padding de área segura por defecto.

</details>

---

### Pregunta 5

Dada esta estructura:

```
app/
├── trips/
│   ├── index.js
│   └── [tripId].js
└── bookings/
    └── [bookingId]/
        └── boarding-pass.js
```

Y el componente:

```jsx
// app/trips/[tripId].js
import { useLocalSearchParams } from 'expo-router';
import { Text } from 'react-native';

export default function TripDetail() {
  const { tripId } = useLocalSearchParams();
  return <Text>ID del viaje: {tripId}</Text>;
}
```

El usuario navega a `/trips/2025`. ¿Qué tipo de dato contiene `tripId`?

A) La cadena `"2025"`, porque los parámetros de ruta en Expo Router se devuelven siempre como strings, igual que los query params en la web.

B) Un objeto `{ value: '2025', segment: 'tripId' }` con metadatos del segmento dinámico.

C) El número entero `2025`, porque Expo Router convierte automáticamente los segmentos numéricos a `number`.

D) `undefined`, porque `useLocalSearchParams` solo funciona con query params (`?param=valor`), no con segmentos dinámicos.

<details>
<summary><strong>Ver solución</strong></summary>

✅ **Respuesta correcta: A**

**Por qué es correcta:** `useLocalSearchParams` devuelve siempre strings, parezca o no un número el valor. Si hace falta el número, hay que convertirlo: `Number(tripId)` o `parseInt(tripId, 10)`.

**Por qué las demás no:**
- **B)** Devuelve los valores planos, no un objeto con metadatos por parámetro.
- **C)** Expo Router no convierte a `number` automáticamente.
- **D)** `useLocalSearchParams` sí captura los segmentos dinámicos `[param]` de la ruta actual.

</details>


---

### Pregunta 7

Para compartir el itinerario por SMS:

```jsx
const { result } = await SMS.sendSMSAsync(
  ['+34698765432'],
  'Itinerario UnirTravel: https://unir-travel-repaso.com/trip/xyz789'
);
```

¿Qué contiene `result` tras la llamada?

A) `true` si el SMS fue entregado a la red del operador, o `false` si el usuario canceló.

B) Un string: `"sent"` si el usuario envió el SMS desde la pantalla de composición o `"cancelled"` si la cerró sin enviar; `expo-sms` solo controla la pantalla de composición, no la entrega real.

C) Siempre `null`, porque `sendSMSAsync` solo abre la pantalla de composición y no devuelve información.

D) El estado de entrega final del operador: `"delivered"`, `"failed"` o `"pending"`.

<details>
<summary><strong>Ver solución</strong></summary>

✅ **Respuesta correcta: B**

**Por qué es correcta:** `expo-sms` abre la app nativa de mensajes con destinatario y texto pre-rellenados. `result` indica si el usuario pulsó enviar (`"sent"`) o cerró sin enviar (`"cancelled"`); la entrega real al destinatario queda fuera del alcance de la app.

**Por qué las demás no:**
- **A)** `result` no es un booleano ni informa de la entrega a la red del operador.
- **C)** Sí devuelve un objeto con `result`; no es siempre `null`.
- **D)** `expo-sms` no recibe el estado de entrega final del operador.

</details>

---

### Pregunta 8

Tomás ejecuta este código en el **simulador iOS**:

```jsx
import * as Sharing from 'expo-sharing';

const canShare = await Sharing.isAvailableAsync();
console.log(canShare);
```

¿Qué valor muestra la consola?

A) `false`, porque el simulador iOS no tiene conectividad de red y el Share Sheet requiere internet.

B) `true`, porque el simulador iOS incluye un Share Sheet funcional; `expo-sharing` funciona en el simulador para pruebas.

C) `undefined`, porque `isAvailableAsync()` no está implementado en iOS y devuelve una promesa sin resolver.

D) `false`, porque `expo-sharing` requiere un dispositivo físico; en el simulador es solo un stub visual.

<details>
<summary><strong>Ver solución</strong></summary>

✅ **Respuesta correcta: B**

**Por qué es correcta:** `expo-sharing` funciona en el simulador iOS: el Share Sheet del sistema se muestra correctamente, de modo que Tomás, Elena y Alba pueden testear esta funcionalidad sin dispositivo físico. `isAvailableAsync()` devuelve `false` principalmente en plataformas donde no existe el Share Sheet (como web).

**Por qué las demás no:**
- **A)** La disponibilidad del Share Sheet no depende de la conectividad de red.
- **C)** Está implementado en iOS y resuelve normalmente.
- **D)** No requiere dispositivo físico: funciona en el simulador iOS.

</details>

---

### Pregunta 9

El listado de resultados implementa scroll infinito:

```jsx
<FlatList
  data={trips}
  renderItem={({ item }) => <TripCard trip={item} />}
  keyExtractor={item => item.id.toString()}
  onEndReached={loadMoreTrips}
  onEndReachedThreshold={0.5}
/>
```

¿Qué define exactamente `onEndReachedThreshold={0.5}`?

A) El umbral para disparar `onEndReached`: cuando al usuario le queda por desplazar el equivalente al 50 % de la altura visible de la lista (media pantalla antes del final).

B) El número de páginas adicionales a precargar por adelantado: `0.5` significa media página antes de llegar al final.

C) La velocidad mínima de scroll (px/s) necesaria para disparar `onEndReached`; por debajo, se ignora.

D) El porcentaje de cada item que debe estar visible antes de activar el callback; `0.5` significa que el 50 % de cada item debe verse.

<details>
<summary><strong>Ver solución</strong></summary>

✅ **Respuesta correcta: A**

**Por qué es correcta:** `onEndReachedThreshold` es una fracción de la longitud visible del contenido. Con `0.5`, el callback se dispara cuando al usuario le queda por ver la mitad de la altura de pantalla antes del final de la lista.

**Por qué las demás no:**
- **B)** No cuenta páginas: es una fracción de la longitud visible.
- **C)** No tiene que ver con la velocidad de scroll.
- **D)** No mide la visibilidad de cada item individual; mide la distancia al final de la lista.

</details>

---

### Pregunta 10

Para añadir el vuelo al calendario del usuario:

```jsx
const addFlightToCalendar = async (flight) => {
  const { status } = await Calendar.requestCalendarPermissionsAsync();
  if (status !== 'granted') return;

  const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
  const writable = calendars.find(cal => cal.allowsModifications);
  if (!writable) {
    Alert.alert('No hay calendario editable disponible');
    return;
  }

  await Calendar.createEventAsync(writable.id, {
    title: `Vuelo ${flight.code}: ${flight.origin} → ${flight.destination}`,
    startDate: new Date(flight.departure),
    endDate: new Date(flight.arrival),
    timeZone: flight.timeZone,
  });
};
```

¿Qué afirmación describe correctamente el comportamiento de `await Calendar.requestCalendarPermissionsAsync()` en esta función?

A) Es una llamada síncrona que devuelve el objeto `{ status }` de inmediato; el `await` es innecesario y podría eliminarse sin cambiar el comportamiento.

B) Es asíncrona: devuelve una Promise que se resuelve con un objeto `{ status }` cuando el usuario responde al diálogo de permisos. El `await` suspende la función hasta tener la respuesta y, si `status` no es `'granted'`, se hace `return` sin continuar.

C) El `await` bloquea el hilo principal de JavaScript hasta que el usuario responde, congelando la interfaz mientras el diálogo está abierto.

D) `requestCalendarPermissionsAsync()` lanza una excepción si el usuario deniega el permiso, por lo que debería envolverse en `try/catch` en lugar de comprobar `status`.

<details>
<summary><strong>Ver solución</strong></summary>

✅ **Respuesta correcta: B**

**Por qué es correcta:** `requestCalendarPermissionsAsync()` es una función asíncrona que devuelve una Promise. Al resolverse entrega un objeto con la propiedad `status` (`'granted'`, `'denied'`…) según la respuesta del usuario al diálogo del sistema. El `await` suspende la ejecución de la función `async` —sin bloquear el hilo de JS— hasta que la promesa se resuelve; entonces se evalúa `status` y, si no es `'granted'`, la función hace `return` y no llega a acceder al calendario.

**Por qué las demás no:**
- **A)** No es síncrona: devuelve una Promise. Sin el `await`, la desestructuración `{ status }` se haría sobre la propia Promise (no sobre su valor resuelto) y `status` sería `undefined`, rompiendo la comprobación.
- **C)** `await` no bloquea el hilo principal: cede el control al event loop, por lo que la interfaz sigue respondiendo mientras se espera la resolución de la promesa.
- **D)** No lanza una excepción al denegar el permiso: resuelve la promesa con `status: 'denied'`. Por eso el flujo correcto es comprobar `status`, no usar `try/catch`.

</details>

---

### Pregunta 11

El enlace «Ver detalle del viaje» se implementa de dos formas:

```jsx
// Opción A — Text con onPress
<Text
  onPress={() => router.push(`/trips/${trip.id}`)}
  style={{ color: '#0284c7', textDecorationLine: 'underline' }}
>
  Ver detalle
</Text>

// Opción B — Pressable con Text
<Pressable
  onPress={() => router.push(`/trips/${trip.id}`)}
  style={({ pressed }) => ({ opacity: pressed ? 0.6 : 1 })}
>
  <Text style={{ color: '#0284c7', textDecorationLine: 'underline' }}>
    Ver detalle
  </Text>
</Pressable>
```

¿Cuál es la diferencia práctica más relevante?

A) Ambas funcionan, pero `Pressable` (Opción B) ofrece más control sobre la interacción: feedback visual durante la pulsación con la función `style`, ajuste del área táctil con `hitSlop` y mejor gestión de `onLongPress`.

B) La Opción A no funciona: `Text` no acepta `onPress` y lanza un error en tiempo de ejecución.

C) La Opción B no funciona: `Pressable` no puede envolver un `Text`; requiere un `View` como hijo directo.

D) Son completamente equivalentes, sin diferencias prácticas relevantes.

<details>
<summary><strong>Ver solución</strong></summary>

✅ **Respuesta correcta: A**

**Por qué es correcta:** `Text` sí acepta `onPress`, pero `Pressable` aporta un modelo de interacción más completo: su prop `style` recibe `{ pressed }` en tiempo real para el feedback visual, y props como `hitSlop`, `android_ripple` u `onLongPress` dan control total sobre el comportamiento táctil.

**Por qué las demás no:**
- **B)** `Text` sí admite `onPress` en React Native.
- **C)** `Pressable` puede envolver perfectamente un `Text` (o cualquier otro componente).
- **D)** No son equivalentes: difieren en el control de la interacción y el feedback.

</details>

---

### Pregunta 12

La tipografía de marca se configura así:

```js
// tailwind.config.js
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      fontFamily: {
        'brand': ['Montserrat-Variable', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
```

Con esta configuración (y la fuente cargada con `expo-font`), ¿cómo se aplica la tipografía a un componente `Text`?

A) `<Text style={{ fontFamily: 'brand' }}>Título</Text>` — la fuente del config se aplica con estilos inline, no con clases de NativeWind.

B) `<Text className="font-brand">Título</Text>` — NativeWind genera la clase `font-{clave}` a partir del nombre de la clave de `fontFamily`; aquí `font-brand`.

C) La fuente no puede usarse desde NativeWind; hay que aplicarla con `StyleSheet` directamente.

D) `<Text className="font-['Montserrat-Variable']">Título</Text>` — NativeWind exige usar el nombre literal del archivo de la fuente, no la clave del config.

<details>
<summary><strong>Ver solución</strong></summary>

✅ **Respuesta correcta: B**

**Por qué es correcta:** NativeWind genera clases utilitarias `font-{clave}` a partir de las entradas de `theme.extend.fontFamily`. Si la clave es `'brand'`, la clase resultante es `font-brand`, y NativeWind la mapea internamente al valor del array (el nombre de la fuente registrada).

**Por qué las demás no:**
- **A)** `fontFamily: 'brand'` inline no corresponde al nombre real de la fuente registrada; el inline necesitaría el nombre de la familia, no la clave Tailwind.
- **C)** La fuente sí puede usarse desde NativeWind a través de la clase generada.
- **D)** La clase se genera a partir de la **clave** del config (`brand`), no del nombre literal del archivo.

</details>

---

### Pregunta 13

Al recuperar contactos para sugerir compañeros de viaje:

```jsx
const { data: contacts } = await Contacts.getContactsAsync({
  fields: [Contacts.Fields.PhoneNumbers, Contacts.Fields.Name],
});
```

¿Cuál es la función del parámetro `fields`?

A) Restringe qué campos se recuperan por contacto, reduciendo los datos devueltos; sin él, el sistema podría devolver todos los campos disponibles (emails, cumpleaños, direcciones…), lo que es más lento y consume más memoria.

B) Filtra los contactos para devolver solo los que tienen valores en esos campos; los contactos sin teléfono quedan excluidos del resultado.

C) Define el orden en que se muestran los campos dentro de cada contacto devuelto.

D) Es obligatorio: sin `fields`, `getContactsAsync()` lanza una excepción.

<details>
<summary><strong>Ver solución</strong></summary>

✅ **Respuesta correcta: A**

**Por qué es correcta:** `fields` controla qué datos se incluyen en cada objeto de contacto. Sin especificarlo, el sistema puede traer todos los campos disponibles, aumentando el tiempo de respuesta y el uso de memoria innecesariamente.

**Por qué las demás no:**
- **B)** `fields` no filtra qué contactos se devuelven, sino qué campos lleva cada uno.
- **C)** No define ningún orden de presentación.
- **D)** No es obligatorio; sin él se devuelven (potencialmente) todos los campos, no se lanza una excepción.

</details>

---

### Pregunta 14

La reserva se confirma con una petición autenticada:

```jsx
const { token } = useContext(AuthContext);

const confirmBooking = async (tripId, passengers) => {
  const res = await fetch('https://unir-travel-repaso.com/api/bookings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ tripId, passengers }),
  });

  if (!res.ok) {
    throw new Error('No se pudo confirmar la reserva');
  }
  return res.json();
};
```

¿Qué afirmación describe correctamente el comportamiento de este código ante una respuesta **HTTP 403** (token caducado)?

A) `fetch()` lanza automáticamente la excepción al recibir el 403, por lo que el `if (!res.ok)` nunca llega a evaluarse.

B) `fetch()` no lanza excepción por el código HTTP; resuelve normalmente, `res.ok` es `false` (403 está fuera de 200–299) y el `throw` explícito propaga el error de forma controlada.

C) `res.ok` contendría el número 403, por lo que `!res.ok` sería `false` y la reserva se daría por buena erróneamente.

D) Al faltar el header `Accept`, `res.json()` falla antes de evaluar `res.ok` y el error se pierde.

<details>
<summary><strong>Ver solución</strong></summary>

✅ **Respuesta correcta: B**

**Por qué es correcta:** `fetch()` solo rechaza ante errores de red, no por códigos HTTP. Con un 403, la promesa resuelve y `res.ok` es `false` (403 está fuera del rango 200–299), de modo que el `if (!res.ok)` se cumple y el `throw` propaga el error de forma controlada. El `Bearer ${token}` es lo que el servidor valida; si el token caduca, responde 403.

**Por qué las demás no:**
- **A)** `fetch()` no lanza por el código HTTP; el `if` sí se evalúa.
- **C)** `res.ok` es un booleano (`false` aquí), no el número 403; `!res.ok` es `true`.
- **D)** `res.json()` no se ejecuta antes del `if`; y la ausencia de `Accept` no provoca ese fallo.

</details>

---

### Pregunta 15

Tras confirmar la reserva con éxito, el equipo decide cómo llevar al usuario a la pantalla de confirmación:

```jsx
// Opción A
router.push('/bookings/55012/confirmation');

// Opción B
router.replace('/bookings/55012/confirmation');
```

El usuario llega a la confirmación y pulsa **Atrás**. ¿Qué diferencia hay entre ambas opciones?

A) `router.replace` es asíncrono y `router.push` síncrono; en reservas, `replace` garantiza terminar antes de desmontar.

B) Son equivalentes en Expo Router; la diferencia solo existía en React Navigation v5.

C) `router.replace` navega sin animación de transición y `router.push` con animación.

D) `router.push` añade la confirmación sobre el historial conservando la pantalla de pago (el usuario podría volver a ella con Atrás); `router.replace` sustituye la entrada actual, evitando que el usuario regrese a la pantalla de pago. En un flujo de compra es preferible `replace`.

<details>
<summary><strong>Ver solución</strong></summary>

✅ **Respuesta correcta: D**

**Por qué es correcta:** `push` apila la nueva ruta y conserva la anterior (la de pago) en el historial; `replace` sustituye la entrada actual. Tras completar una compra se prefiere `replace` para que «Atrás» no devuelva a la pantalla de pago ya procesada.

**Por qué las demás no:**
- **A)** La diferencia no es síncrono/asíncrono, sino el efecto sobre el historial de navegación.
- **B)** La distinción existe y es relevante en Expo Router.
- **C)** Ambas usan la animación de transición por defecto; lo que cambia es el historial, no la animación.

</details>

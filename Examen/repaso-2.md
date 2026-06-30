# Repaso 2 — Desarrollo de Aplicaciones Móviles con React Native y Expo

> Material de repaso. Cada pregunta tiene 4 opciones y solo una es correcta.
> Despliega el bloque **«Ver solución»** de cada pregunta para comprobar la respuesta y las justificaciones.

---

## Enunciado General

El equipo de desarrollo de **UnirFit** trabaja en una aplicación móvil multiplataforma de entrenamiento personal, construida con React Native, Expo SDK 55 y NativeWind v4 (Tailwind CSS para React Native). La navegación está gestionada por Expo Router v4 (enrutamiento basado en archivos). La app consume una API REST desplegada en `https://unir-fit-repaso.com/api`.

El equipo está formado por:
- **Lucía** — lead developer, macOS, prueba exclusivamente en simulador iOS (Xcode)
- **Adrián** — frontend developer, Windows, prueba en emulador Android (AVD Manager)
- **Paula** — QA engineer, iPhone 15 físico
- **Mario** — junior developer, macOS, simulador iOS exclusivamente
- **Irene** — UI/UX developer, macOS, simulador iOS (Xcode 15)
- **Bruno** — backend developer (apoyo mobile), Linux, emulador Android (AVD)
- **Carmen** — QA junior, Windows, emulador Android Pixel 8 (sin dispositivo físico)
- **Óscar** — tech lead, macOS, revisión de código únicamente (sin entorno de ejecución configurado)

### Funcionalidades implementadas

- Login y registro: `POST /auth-sessions`, `POST /users`
- Catálogo de rutinas por nivel: `GET /routines?level={level}`
- Detalle de ejercicio: `GET /exercises/{id}`
- Registro de sesión completada: `POST /workouts`
- Feedback háptico al terminar serie: `expo-haptics`
- Recordatorio de entrenamiento en calendario: `expo-calendar`
- Invitar amigos por SMS: `expo-sms` + `expo-contacts`

---

## Preguntas

---

### Pregunta 1

El equipo debate si construir UnirFit como `WebView` pura o como app nativa con React Native. ¿Cuál de las siguientes afirmaciones describe correctamente una diferencia de **experiencia de usuario** entre ambos enfoques?

A) Una app `WebView` ofrece mejor experiencia porque se actualiza en el servidor al instante sin pasar por la revisión de las tiendas.

B) React Native renderiza componentes con primitivas nativas del SO (UIKit en iOS, Views en Android), con animaciones, scroll y gestos de respuesta nativa; una `WebView` renderiza HTML/CSS que puede parecerse visualmente pero carece de ese comportamiento gestual y fluidez nativos.

C) Ambos producen una UX idéntica, porque React Native también usa internamente un motor web (WebKit) para mostrar sus componentes.

D) La desventaja de UX de React Native es que no puede usar las fuentes del sistema ni respetar los ajustes de accesibilidad del dispositivo.

<details>
<summary><strong>Ver solución</strong></summary>

✅ **Respuesta correcta: B**

**Por qué es correcta:** React Native invoca componentes nativos reales (a través del bridge o JSI). Eso aporta animaciones, scroll y gestos con sensación nativa. Una `WebView` renderiza HTML/CSS y, aunque visualmente se parezca, no replica con la misma fidelidad el comportamiento gestual y la fluidez nativos.

**Por qué las demás no:**
- **A)** El despliegue instantáneo es una ventaja operativa de la WebView, no una mejora de la experiencia de usuario en interacción.
- **C)** React Native no renderiza su UI con un motor web; usa vistas nativas del sistema.
- **D)** React Native sí puede usar fuentes del sistema y respeta APIs de accesibilidad; la afirmación es falsa.

</details>

---

### Pregunta 2

El equipo fija así la versión del core:

```json
"react-native": "^0.79.0"
```

¿Qué rango de versiones permite instalar npm para esta dependencia?

A) Cualquier `>=0.79.0 <1.0.0`, porque `^` siempre permite todo por debajo del siguiente major.

B) Exactamente `0.79.0`, porque con major 0 el operador caret desactiva el rango.

C) Cualquier `>=0.79.0 <0.80.0`: cuando el major es 0, semver trata el minor como si fuera el major, de modo que `^` solo permite actualizaciones de patch.

D) Cualquier `>=0.79.0` sin límite superior, porque al ser inestable (major 0) npm ignora la restricción.

<details>
<summary><strong>Ver solución</strong></summary>

✅ **Respuesta correcta: C**

**Por qué es correcta:** la regla de semver para `^X.Y.Z` cuando `X=0` es `>=0.Y.Z <0.(Y+1).0`: el minor actúa como major. Así `^0.79.0` permite `0.79.x` pero nunca `0.80.0`.

**Por qué las demás no:**
- **A)** Ese rango (`<1.0.0`) sería el comportamiento de `^` cuando el major es **mayor que 0**.
- **B)** El caret no se «desactiva»: sigue permitiendo parches dentro de `0.79.x`.
- **D)** npm no ignora la restricción; el rango sí tiene límite superior (`<0.80.0`).

</details>

---

### Pregunta 3

El proyecto tiene el babel plugin de NativeWind y la importación de `global.css`, pero **`metro.config.js` no se ha actualizado**:

```js
// metro.config.js — sin configuración de NativeWind
const { getDefaultConfig } = require("expo/metro-config");
module.exports = getDefaultConfig(__dirname);
```

¿Qué ocurre al ejecutar la app?

A) El `global.css` no es procesado por el bundler y las clases Tailwind no están disponibles; los props `className` se ignoran silenciosamente y los componentes se renderizan sin estilos.

B) La app falla en compilación con el error `NativeWind requires withNativeWind in metro.config.js`.

C) Solo fallan las clases dinámicas (computadas en runtime); las estáticas como `bg-blue-600` están embebidas en el bundle en compilación y funcionan igual.

D) La app funciona con normalidad: en NativeWind v4 la configuración de Metro es opcional y basta con el babel plugin.

<details>
<summary><strong>Ver solución</strong></summary>

✅ **Respuesta correcta: A**

**Por qué es correcta:** sin `withNativeWind` en `metro.config.js`, el CSS no se procesa durante el bundling. El resultado es el mismo que cuando falta cualquier otra pieza de la configuración: `className` se ignora silenciosamente y no se aplica ningún estilo.

**Por qué las demás no:**
- **B)** No hay un fallo de compilación con ese mensaje; el problema es silencioso.
- **C)** No hay distinción «estáticas vs dinámicas» aquí: sin el transform de Metro no se aplican.
- **D)** La configuración de Metro **no** es opcional en NativeWind v4; es una de las piezas requeridas.

</details>

---

### Pregunta 4

```jsx
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View, FlatList } from 'react-native';

export default function RoutineList() {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, paddingTop: insets.top, paddingBottom: insets.bottom }}>
      <FlatList /* ... */ />
    </View>
  );
}
```

¿Qué ventaja aporta `useSafeAreaInsets` frente a envolver con `SafeAreaView`?

A) `useSafeAreaInsets` funciona sin instalar `react-native-safe-area-context`; usa directamente APIs del core.

B) El objeto `insets` solo expone `top`, lo que simplifica la API frente a `SafeAreaView`.

C) `useSafeAreaInsets` desactiva el manejo de muescas del sistema, dando control total de toda la pantalla.

D) `useSafeAreaInsets` expone los valores exactos en píxeles de cada borde del área segura (`top`, `bottom`, `left`, `right`), permitiendo aplicar los márgenes de forma selectiva o combinarlos con otra lógica de layout.

<details>
<summary><strong>Ver solución</strong></summary>

✅ **Respuesta correcta: D**

**Por qué es correcta:** el hook devuelve valores numéricos por cada inset, lo que permite aplicarlos solo donde haga falta (p. ej. solo `paddingTop` sin afectar al fondo de pantalla) o combinarlos con cálculos propios. `SafeAreaView` aplica el padding de forma más automática y menos granular.

**Por qué las demás no:**
- **A)** El hook pertenece a `react-native-safe-area-context`; sí requiere esa librería.
- **B)** El objeto expone los cuatro insets, no solo `top`.
- **C)** No «desactiva» nada del sistema; solo informa de los tamaños de las áreas seguras.

</details>

---

### Pregunta 5

```
app/
├── (auth)/
│   ├── login.js
│   └── register.js
├── (tabs)/
│   ├── index.js
│   └── profile.js
└── _layout.js
```

¿Qué significa que las carpetas se llamen `(auth)` y `(tabs)` con paréntesis en Expo Router?

A) Son carpetas protegidas: Expo Router redirige a los no autenticados a `(auth)/login.js` al intentar acceder a cualquier otra ruta.

B) Son «grupos de rutas» que organizan archivos sin añadir el nombre de la carpeta al path; la ruta de `login.js` es `/login`, no `/auth/login`.

C) Son carpetas con carga diferida: sus pantallas no entran al bundle hasta que el usuario navega a ellas.

D) Los paréntesis son una convención visual sin efecto; la carpeta se comporta igual que `auth/`.

<details>
<summary><strong>Ver solución</strong></summary>

✅ **Respuesta correcta: B**

**Por qué es correcta:** los grupos de ruta `(nombre)` son invisibles en la URL. Permiten organizar archivos y aplicar layouts compartidos sin contaminar el path. `(auth)/login.js` responde a `/login`.

**Por qué las demás no:**
- **A)** Los paréntesis no implican protección ni redirección automática; eso se implementa aparte.
- **C)** No definen carga diferida; solo afectan a cómo se forma la URL.
- **D)** Sí tienen efecto: ocultan el segmento en la URL, a diferencia de una carpeta `auth/` normal.

</details>

---

### Pregunta 6

```jsx
// app/(auth)/_layout.js
import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="login"
        options={{ title: "Iniciar sesión", headerShown: false }}
      />
      <Stack.Screen name="register" options={{ title: "Crear cuenta" }} />
    </Stack>
  );
}
```

¿Qué efecto tiene `headerShown: false` en la pantalla `login`?

A) La pantalla de login queda excluida del historial: el usuario no puede volver a ella con el botón atrás.

B) La pantalla se renderiza sin animación de transición, porque el header controla la transición.

C) El `title: "Iniciar sesión"` se descarta porque `headerShown: false` impide procesar las opciones del header.

D) La barra de navegación superior (header) queda oculta para `login`, mostrando su contenido a pantalla completa sin título ni botón de retroceso.

<details>
<summary><strong>Ver solución</strong></summary>

✅ **Respuesta correcta: D**

**Por qué es correcta:** `headerShown: false` oculta el header de esa pantalla concreta. El historial no se ve afectado: el usuario puede seguir usando el gesto de swipe (iOS) o el botón atrás físico (Android).

**Por qué las demás no:**
- **A)** No altera el historial; solo oculta el header.
- **B)** La animación de transición la gestiona el navegador `Stack`, no la visibilidad del header.
- **C)** El `title` simplemente no se muestra mientras el header está oculto, pero no provoca ningún error ni se «descarta» de forma destructiva.

</details>

---

### Pregunta 7

La descripción de un ejercicio se renderiza así:

```jsx
<Text
  numberOfLines={3}
  style={{ color: 'white', fontSize: 15 }}
>
  Este ejercicio compuesto trabaja de forma simultánea el tren inferior y la zona media, exige una técnica cuidadosa de la cadera y la columna, y debe ejecutarse con un peso moderado para mantener el control durante todo el recorrido.
</Text>
```

El texto supera las 3 líneas disponibles. ¿Qué muestra el componente?

A) Las tres primeras líneas, con `…` al final si no cabe el resto.

B) El texto completo en todas las líneas necesarias, porque `numberOfLines` es solo una sugerencia que React Native aplica según el espacio.

C) Solo la primera línea, porque `numberOfLines={3}` indica el índice base-1 de la última línea visible y React Native cuenta desde cero.

D) El componente queda en blanco: sin `ellipsizeMode`, `numberOfLines` no puede truncar y React Native no muestra nada.

<details>
<summary><strong>Ver solución</strong></summary>

✅ **Respuesta correcta: A**

**Por qué es correcta:** `numberOfLines` limita el número máximo de líneas visibles y trunca el texto con `…` al final (comportamiento por defecto, equivalente a `ellipsizeMode="tail"`). Es un límite estricto.

**Por qué las demás no:**
- **B)** No es una sugerencia: es un límite duro.
- **C)** `numberOfLines={3}` muestra hasta 3 líneas, no una; no es un índice base-1.
- **D)** El truncado por defecto funciona sin declarar `ellipsizeMode`; el componente no queda en blanco.

</details>

---

### Pregunta 8

El equipo mejora el login para detectar errores HTTP:

```jsx
const login = async (email, password) => {
  const res = await fetch('https://unir-fit-repaso.com/api/auth-sessions', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || 'Error de autenticación');
  }

  const { token } = await res.json();
  setToken(token);
};
```

El servidor devuelve **HTTP 401**. ¿Qué contiene `res.ok`?

A) `null` para cualquier código de error, distinguiéndolo de `undefined` (error de red) y `true` (éxito).

B) El código de estado HTTP (401) cuando hay error y `true` cuando hay éxito.

C) Un booleano: `false` para cualquier estado fuera del rango 200–299; para un 401 es `false`, lo que permite detectar el error y lanzar la excepción explícitamente.

D) `undefined`, porque `fetch()` no rellena este campo en respuestas de error; solo está disponible `res.status`.

<details>
<summary><strong>Ver solución</strong></summary>

✅ **Respuesta correcta: C**

**Por qué es correcta:** `res.ok` es un booleano: `true` si el status está entre 200 y 299, `false` en cualquier otro caso (4xx, 5xx). Es la forma idiomática de detectar errores HTTP sin inspeccionar `res.status` directamente.

**Por qué las demás no:**
- **A)** `res.ok` nunca es `null`; siempre es booleano.
- **B)** El código numérico está en `res.status`, no en `res.ok`.
- **D)** `res.ok` siempre está presente en la respuesta de `fetch`, también en errores.

</details>

---

### Pregunta 9

```jsx
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

function ProfileBadge() {
  const { user } = useContext(AuthContext);
  return <Text>{user?.name ?? 'Invitado'}</Text>;
}
```

Se llama a `setUser` con nuevos datos del usuario. ¿Qué ocurre?

A) Solo `AuthProvider` se re-renderiza; `ProfileBadge` no, porque `useContext` crea una copia local del valor al montar.

B) Todos los componentes que consumen `AuthContext` con `useContext(AuthContext)` se re-renderizan con el nuevo valor, incluido `ProfileBadge`, independientemente de su posición en el árbol.

C) El contexto provoca un re-render completo del árbol desde la raíz de la aplicación.

D) `ProfileBadge` debe suscribirse con `useEffect`; `useContext` por sí solo no dispara re-renders.

<details>
<summary><strong>Ver solución</strong></summary>

✅ **Respuesta correcta: B**

**Por qué es correcta:** cuando cambia el `value` de un Provider, React re-renderiza todos los componentes que consumen ese contexto. `useContext` crea una suscripción reactiva al valor del Provider más cercano.

**Por qué las demás no:**
- **A)** `useContext` no copia el valor al montar; se actualiza al cambiar el contexto.
- **C)** No re-renderiza todo el árbol desde la raíz, solo los consumidores del contexto (y sus subárboles).
- **D)** `useContext` ya provoca el re-render por sí solo; no hace falta `useEffect` para «suscribirse».

</details>

---

### Pregunta 10

Para añadir el entrenamiento al calendario:

```jsx
const addWorkoutToCalendar = async (workout) => {
  const { status } = await Calendar.requestCalendarPermissionsAsync();
  if (status !== 'granted') return;

  const calendars = await Calendar.getCalendarsAsync(
    Calendar.EntityTypes.EVENT
  );

  const writable = calendars.find(cal => cal.allowsModifications);
  if (!writable) {
    Alert.alert('No hay calendario editable disponible');
    return;
  }

  await Calendar.createEventAsync(writable.id, {
    title: `UnirFit: ${workout.name}`,
    startDate: new Date(workout.start),
    endDate: new Date(workout.start + 60 * 60 * 1000),
    timeZone: 'Europe/Madrid',
  });
};
```

¿Qué hace exactamente `Calendar.EntityTypes.EVENT` como argumento de `getCalendarsAsync()`?

A) Filtra para devolver únicamente los calendarios de tipo evento, excluyendo otros (como los de recordatorios/tareas en iOS).

B) Crea una nueva entidad de tipo `EVENT` en el sistema de calendarios si no existía.

C) Convierte todos los calendarios al formato estándar iCal/.ics antes de devolverlos.

D) Es el valor por defecto y no aplica filtro; `getCalendarsAsync()` siempre devuelve todos los calendarios.

<details>
<summary><strong>Ver solución</strong></summary>

✅ **Respuesta correcta: A**

**Por qué es correcta:** `Calendar.EntityTypes.EVENT` filtra para devolver solo los calendarios de eventos, excluyendo los de recordatorios/tareas, que en iOS son un tipo distinto de calendario.

**Por qué las demás no:**
- **B)** No crea ninguna entidad; solo consulta.
- **C)** No transforma a iCal/.ics.
- **D)** Sí actúa como filtro; no devuelve indiscriminadamente todos los tipos.

</details>

---

### Pregunta 11

Para invitar amigos al reto enviando SMS a sus contactos:

```jsx
const inviteFriends = async () => {
  const { status } = await Contacts.requestPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert('Sin acceso a contactos', 'Actívalo en Ajustes');
    return;
  }

  const { data: contacts } = await Contacts.getContactsAsync({
    fields: [Contacts.Fields.PhoneNumbers],
  });

  const phones = contacts
    .filter(c => c.phoneNumbers?.length > 0)
    .map(c => c.phoneNumbers[0].number);

  await SMS.sendSMSAsync(phones, 'Únete a mi reto en UnirFit 💪');
};
```

El usuario **denegó de forma permanente** el permiso de contactos en los ajustes. ¿Qué ocurre al ejecutar `inviteFriends()`?

A) La función continúa, pero `getContactsAsync()` devuelve un array vacío y `phones` queda vacío, por lo que `sendSMSAsync` no envía nada.

B) `requestPermissionsAsync()` abre automáticamente Ajustes para que el usuario active el permiso.

C) `requestPermissionsAsync()` lanza una excepción que, sin `try/catch`, cierra la app.

D) `requestPermissionsAsync()` devuelve `status: 'denied'` sin mostrar diálogo (ya estaba denegado); el `if` lo detecta, muestra la alerta y hace `return` antes de acceder a contactos o enviar SMS.

<details>
<summary><strong>Ver solución</strong></summary>

✅ **Respuesta correcta: D**

**Por qué es correcta:** con el permiso denegado permanentemente, `requestPermissionsAsync()` resuelve con `status: 'denied'` sin volver a mostrar el diálogo del sistema. El `if` lo detecta, muestra la alerta y hace `return` antes de tocar contactos o SMS.

**Por qué las demás no:**
- **A)** No se llega a `getContactsAsync()`: el `return` corta antes.
- **B)** La API no abre Ajustes por sí sola.
- **C)** No lanza excepción: resuelve con un `status`.

</details>

---

### Pregunta 12

Dos llamadas hápticas distintas en UnirFit:

```jsx
// Al completar una repetición
await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

// Al terminar la rutina entera
await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
```

¿Cuál es la diferencia semántica entre ambas?

A) Producen patrones de vibración idénticos; la diferencia entre `impactAsync` y `notificationAsync` es solo de nomenclatura.

B) `notificationAsync` solo existe en Android; en iOS hay que usar `impactAsync`.

C) `impactAsync` simula un impacto físico con tres intensidades (`Light`, `Medium`, `Heavy`); `notificationAsync` genera tres patrones pensados para resultados de operación: `Success`, `Warning` y `Error`.

D) `notificationAsync` requiere permiso explícito del usuario; `impactAsync` no.

<details>
<summary><strong>Ver solución</strong></summary>

✅ **Respuesta correcta: C**

**Por qué es correcta:** iOS distingue semánticamente el feedback de impacto (una acción física, como pulsar) del de notificación (el resultado de una operación). `impactAsync` ofrece `Light/Medium/Heavy`; `notificationAsync` ofrece `Success/Warning/Error`. Usar el tipo correcto mejora la coherencia con las HIG de Apple.

**Por qué las demás no:**
- **A)** No producen el mismo patrón; representan intenciones distintas.
- **B)** Ambas existen en iOS y Android (con matices de hardware), no es exclusivo de Android.
- **D)** El feedback háptico no requiere un permiso de usuario explícito.

</details>

---

### Pregunta 13

El equipo compara dos formas de definir los estilos del contenedor de una pantalla:

```jsx
// Opción A — estilos inline
<View style={{ flex: 1, backgroundColor: '#0f172a', padding: 16 }}>

// Opción B — StyleSheet.create fuera del componente
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', padding: 16 },
});
<View style={styles.container}>
```

¿Cuál es el enfoque recomendado y por qué?

A) La Opción A, porque los objetos inline son siempre más legibles y React Native memoiza todos los objetos de estilo planos.

B) Ambas son equivalentes; `StyleSheet.create` está deprecado en la nueva arquitectura.

C) Producen el mismo resultado; `StyleSheet.create` es solo una envoltura cosmética sin optimización.

D) La Opción B, porque `StyleSheet.create` genera una referencia de estilo estable: el objeto se crea una sola vez fuera del componente y React Native puede optimizar la comunicación enviando el ID del estilo registrado en lugar de serializar el objeto completo en cada render.

<details>
<summary><strong>Ver solución</strong></summary>

✅ **Respuesta correcta: D**

**Por qué es correcta:** `StyleSheet.create` valida los estilos en desarrollo, genera IDs estables y permite evitar serializar el objeto en cada render. Con estilos inline se crea un objeto nuevo en cada render, aumentando la presión sobre el recolector de basura.

**Por qué las demás no:**
- **A)** Los objetos inline no se memoizan automáticamente; se recrean en cada render.
- **B)** `StyleSheet.create` **no** está deprecado; sigue siendo el enfoque recomendado.
- **C)** No es solo cosmético: aporta validación y referencias estables.

</details>

---

### Pregunta 14

Tras completar el onboarding (que recoge nivel, peso y objetivos), el equipo navega a la app principal:

```jsx
// Opción A
router.push('/(tabs)/index');

// Opción B
router.replace('/(tabs)/index');
```

El usuario llega a la pantalla principal y pulsa el **botón físico de retroceso de Android**. ¿Qué pasa con cada opción?

A) Con ambas opciones vuelve a la pantalla anterior al onboarding (login o pantalla inicial).

B) Con la Opción A vuelve a la última pantalla del onboarding (`router.push` apila la ruta actual sobre el historial); con la Opción B no puede retroceder al onboarding, porque `router.replace` sustituye la entrada actual del historial.

C) Con ambas se cierra la app y va al inicio del sistema, porque navegar desde el onboarding limpia siempre el historial.

D) Con ambas se queda en la pantalla principal, porque los layouts de pestañas interceptan el botón atrás.

<details>
<summary><strong>Ver solución</strong></summary>

✅ **Respuesta correcta: B**

**Por qué es correcta:** `router.push` apila la nueva ruta y conserva la pantalla anterior (la del onboarding) en el historial, por lo que «Atrás» volvería a ella. `router.replace` sustituye la entrada actual, evitando que el usuario pueda retroceder al onboarding ya completado.

**Por qué las demás no:**
- **A)** Con `push` el atrás devolvería al onboarding, no a la pantalla previa al onboarding.
- **C)** Navegar no «limpia siempre el historial»; eso depende de usar `replace` (o `dismissAll`/reset).
- **D)** Los layouts de pestañas no interceptan el botón atrás de esa forma; el comportamiento lo decide el historial.

</details>

---

### Pregunta 15

El cronómetro de descanso entre series usa una referencia para guardar el identificador del intervalo:

```jsx
import { useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';

export default function RestTimer() {
  const intervalRef = useRef(null);
  const [seconds, setSeconds] = useState(0);

  const start = () => {
    intervalRef.current = setInterval(() => {
      setSeconds(s => s + 1);
    }, 1000);
  };

  const stop = () => {
    clearInterval(intervalRef.current);
  };

  return (
    <View>
      <Text>{seconds}s</Text>
      <Pressable onPress={start}><Text>Iniciar</Text></Pressable>
      <Pressable onPress={stop}><Text>Parar</Text></Pressable>
    </View>
  );
}
```

¿Por qué se usa `useRef` para guardar el `intervalRef` en lugar de `useState`?

A) `useRef` guarda un valor mutable que **persiste entre renders pero cuya actualización no provoca un re-render**, ideal para conservar el ID del intervalo sin disparar renders innecesarios. Con `useState`, cambiar el ID forzaría re-renders sin necesidad.

B) `useRef` y `useState` son intercambiables aquí; la única diferencia es que `useRef` ocupa menos memoria.

C) `useRef` es obligatorio porque `setInterval` no puede ejecutarse dentro de un componente que use `useState`.

D) `useRef` provoca un re-render cada vez que cambia `.current`, lo que mantiene el contador `seconds` sincronizado.

<details>
<summary><strong>Ver solución</strong></summary>

✅ **Respuesta correcta: A**

**Por qué es correcta:** `useRef` devuelve un objeto mutable `{ current: ... }` cuya referencia persiste durante toda la vida del componente y **no** provoca re-render al cambiar `.current`. Es el lugar idóneo para guardar el ID del intervalo: necesitamos conservarlo entre renders, pero su cambio no debe disparar renders. El contador `seconds`, que sí debe reflejarse en pantalla, va en `useState`.

**Por qué las demás no:**
- **B)** No son intercambiables: la diferencia clave es que `useState` re-renderiza y `useRef` no.
- **C)** `setInterval` puede convivir perfectamente con `useState`; no hay tal restricción.
- **D)** Justo al contrario: actualizar `.current` de un ref **no** provoca re-render.

</details>

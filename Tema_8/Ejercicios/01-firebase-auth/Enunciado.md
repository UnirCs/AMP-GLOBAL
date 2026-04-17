# Ejercicio 1 — Autenticación con Firebase Auth (RecetApp)

## Objetivo

Ampliar **RecetApp** para que incluya una **pantalla de inicio de sesión y registro** integrada con **Firebase Authentication** (proveedor Email/Password). Antes de acceder a las recetas, el usuario deberá autenticarse. Si ya tiene sesión activa, se le redirigirá automáticamente al contenido de la app.

Se practicará:

- Configuración de un proyecto Firebase y habilitación de Email/Password.
- Uso del SDK de Firebase (`firebase`) en un proyecto Expo (Expo Go).
- Persistencia de sesión con `@react-native-async-storage/async-storage`.
- Creación de un **AuthContext** con React Context API para gestionar el estado global de autenticación.
- Redirección condicional con `expo-router` según el estado de autenticación.

---

## Resultado esperado

1. Al abrir la app sin sesión activa, se muestra una pantalla con el formulario de **Login**.
2. El usuario puede alternar entre Login y Registro mediante un enlace en la parte inferior.
3. El formulario de Registro solicita: nombre, email, contraseña y confirmación de contraseña.
4. Tras registrarse correctamente, se muestra un mensaje de éxito y se redirige al Login.
5. Tras iniciar sesión correctamente, se redirige a `/(drawer)/(tabs)/(stack)/landing`.
6. Si ya hay sesión activa (persistida), la pantalla de login redirige automáticamente al landing.
7. Desde el **Drawer** se puede cerrar sesión, lo que devuelve al usuario a la pantalla de login.

---

## Conceptos previos

### Firebase Authentication (Email/Password)

Firebase Auth proporciona un backend completo de autenticación. El proveedor **Email/Password** permite crear y autenticar usuarios sin necesidad de configurar un servidor propio.

**Funciones principales del SDK:**

| Función | Descripción |
|---|---|
| `initializeApp(config)` | Inicializa la app Firebase con la configuración del proyecto |
| `initializeAuth(app, options)` | Inicializa Auth con opciones de persistencia |
| `getReactNativePersistence(storage)` | Adaptador para persistir la sesión con AsyncStorage |
| `createUserWithEmailAndPassword(auth, email, password)` | Registra un nuevo usuario |
| `signInWithEmailAndPassword(auth, email, password)` | Inicia sesión con email y contraseña |
| `signOut(auth)` | Cierra la sesión activa |
| `onAuthStateChanged(auth, callback)` | Listener que se ejecuta cuando cambia el estado de autenticación |
| `updateProfile(user, { displayName })` | Actualiza el perfil del usuario (nombre, foto, etc.) |

> 📖 [Firebase Auth — Documentación oficial](https://firebase.google.com/docs/auth)
> 📖 [Firebase Auth Web SDK Reference](https://firebase.google.com/docs/reference/js/auth)

### AsyncStorage y persistencia de sesión

En Expo Go no se puede usar `getAuth()` directamente porque requiere `react-native-persistence` nativo. En su lugar se usa `initializeAuth` con `getReactNativePersistence` y `AsyncStorage`:

```javascript
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});
```

> 📖 [@react-native-async-storage/async-storage — Documentación](https://react-native-async-storage.github.io/async-storage/)

### `onAuthStateChanged`

Este listener es la pieza clave: se suscribe a cambios en la sesión. Se ejecuta al iniciar la app (para recuperar sesión persistida) y cuando el usuario inicia/cierra sesión.

```javascript
onAuthStateChanged(auth, (user) => {
    if (user) {
        // Usuario autenticado → acceso a user.uid, user.email, user.displayName
    } else {
        // Sin sesión → mostrar login
    }
});
```

### Manejo de errores de Firebase Auth

Firebase lanza errores con códigos específicos que conviene traducir a mensajes legibles:

| Código | Significado |
|---|---|
| `auth/email-already-in-use` | El email ya está registrado |
| `auth/invalid-email` | Formato de email inválido |
| `auth/weak-password` | Contraseña demasiado débil (mínimo 6 caracteres) |
| `auth/invalid-credential` | Email o contraseña incorrectos |
| `auth/too-many-requests` | Demasiados intentos fallidos |

### Expo Router — Redirección programática

```javascript
import { useRouter } from 'expo-router';

const router = useRouter();
router.replace('/home');           // Reemplaza la ruta actual (sin back)
router.push('/alguna-ruta');       // Navega apilando en el historial
```

> 📖 [Expo Router — Navigating between pages](https://docs.expo.dev/router/navigating-pages/)

---

## Configuración de Firebase (paso previo)

Antes de programar, debes crear y configurar tu proyecto en Firebase Console:

### 1. Crear proyecto en Firebase Console

1. Ve a [Firebase Console](https://console.firebase.google.com).
2. Haz clic en **"Agregar proyecto"**.
3. Nombra tu proyecto (ejemplo: `recetapp`).
4. Desactiva Google Analytics si no lo necesitas.
5. Haz clic en **"Crear proyecto"**.

### 2. Registrar una App Web

1. En el dashboard, haz clic en el ícono **Web** (`</>`).
2. Nombra tu app: `RecetApp Web`.
3. **No** marques "Configure Firebase Hosting".
4. Haz clic en **"Registrar app"**.
5. Copia el objeto `firebaseConfig` que se muestra.

### 3. Habilitar Email/Password

1. En el menú lateral, ve a **Authentication → Get started**.
2. Ve a la pestaña **Sign-in method**.
3. Haz clic en **Email/Password** → **Activa** el interruptor → **Save**.

---

## Dependencias a instalar

```bash
npm install firebase @react-native-async-storage/async-storage
```

---

## Estructura de archivos a crear/modificar

```
config/
    firebaseConfig.js          ← NUEVO: configuración e inicialización de Firebase
context/
    AuthContext.js              ← NUEVO: contexto de autenticación
components/
    LoginForm.js               ← NUEVO: formulario de login
    RegisterForm.js            ← NUEVO: formulario de registro
views/
    AuthView.js                ← NUEVO: vista que alterna login/registro
app/
    _layout.jsx                ← MODIFICAR: envolver con AuthProvider
    home.jsx                   ← MODIFICAR: mostrar AuthView o redirigir si hay sesión
components/
    RecetAppDrawer.js          ← MODIFICAR: añadir botón de cerrar sesión
```

---

## Requisitos funcionales

### `config/firebaseConfig.js`
- Inicializar Firebase con `initializeApp`.
- Inicializar Auth con `initializeAuth` y `getReactNativePersistence(AsyncStorage)`.
- Exportar `auth`.

### `context/AuthContext.js`
- Estado: `user` (datos del usuario o null) y `loading` (boolean).
- `onAuthStateChanged` en un `useEffect` para suscribirse a cambios de sesión.
- Funciones: `register(email, password, name)`, `login(email, password)`, `signOut()`.
- Cada función devuelve `{ success: true }` o `{ success: false, error: 'mensaje' }`.
- `signOut` redirige a `/home` con `router.replace`.
- Hook `useAuth()` que consume el contexto.

### `components/LoginForm.js`
- Campos: email y contraseña.
- Validación básica (campos vacíos).
- Llama a `login()` del contexto.
- Muestra errores con estilo visual.
- Indicador de carga mientras se procesa.
- Enlace para cambiar a registro (`onSwitchToRegister`).

### `components/RegisterForm.js`
- Campos: nombre, email, contraseña y confirmación.
- Validaciones: campos vacíos, contraseñas coincidentes, longitud mínima (6).
- Llama a `register()` del contexto.
- Mensaje de éxito tras registro correcto.
- Enlace para cambiar a login (`onSwitchToLogin`).

### `views/AuthView.js`
- Estado `showLogin` (boolean) para alternar entre `LoginForm` y `RegisterForm`.
- Si `user` existe (del contexto), redirigir automáticamente a `/(drawer)/(tabs)/(stack)/landing`.
- Si `loading` es true, mostrar un `ActivityIndicator`.
- `KeyboardAvoidingView` para que el teclado no tape los campos.

### `app/_layout.jsx`
- Envolver `<Slot />` con `<AuthProvider>`.

### `app/home.jsx`
- En lugar de redirigir directamente al landing, renderizar `<AuthView />`.

### `components/RecetAppDrawer.js`
- Añadir un botón **"Cerrar sesión"** al final del drawer que llame a `signOut()`.
- Opcionalmente, mostrar el nombre o email del usuario autenticado en la cabecera del drawer.

---

## Pistas

1. Recuerda que `onAuthStateChanged` devuelve una función de *unsubscribe* que debes llamar en el *cleanup* del `useEffect`.
2. `updateProfile` es asíncrono; espera a que se resuelva antes de continuar.
3. Usa `KeyboardAvoidingView` con `behavior="padding"` en iOS y `behavior="height"` en Android.
4. El patrón de devolver `{ success, error }` en las funciones del contexto simplifica el manejo en los formularios.
5. `router.replace` (no `router.push`) evita que el usuario vuelva al login con el botón "atrás".


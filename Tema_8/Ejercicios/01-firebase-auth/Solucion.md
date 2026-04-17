# Solución — Autenticación con Firebase Auth (RecetApp)

## Proceso mental

1. **¿Qué necesitamos?** → Firebase SDK (`firebase`) para autenticación y `@react-native-async-storage/async-storage` para persistir la sesión en Expo Go.
2. **¿Dónde encaja en la app?** → La pantalla `home.jsx` actualmente redirige directamente al landing. Ahora mostrará un formulario de login/registro. Solo tras autenticarse se accede al contenido.
3. **¿Cómo gestionamos el estado de auth?** → Un `AuthContext` global (envolviendo toda la app desde `_layout.jsx`) que expone `user`, `loading`, `login`, `register` y `signOut`.
4. **¿Cómo persistimos la sesión?** → `initializeAuth` con `getReactNativePersistence(AsyncStorage)`. Al reabrir la app, `onAuthStateChanged` detecta la sesión guardada y redirige automáticamente.
5. **¿Cómo cerramos sesión?** → Un botón en el Drawer llama a `signOut()`, que limpia el estado y redirige a `/home`.

---

## Paso 1 — Instalar dependencias

```bash
npm install firebase @react-native-async-storage/async-storage
```

---

## Paso 2 — Configurar Firebase

### `config/firebaseConfig.js`

```javascript
import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Configuración de Firebase
 * Reemplaza estos valores con los de tu proyecto en Firebase Console
 */
const firebaseConfig = {
    apiKey: "TU_API_KEY",
    authDomain: "tu-proyecto.firebaseapp.com",
    projectId: "tu-proyecto",
    storageBucket: "tu-proyecto.appspot.com",
    messagingSenderId: "123456789012",
    appId: "1:123456789012:web:abcdef123456"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Auth con persistencia usando AsyncStorage
// Esto permite que la sesión se mantenga al cerrar y reabrir la app
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export default app;
```

**¿Por qué `initializeAuth` y no `getAuth`?**

En Expo Go, `getAuth()` intenta usar `indexedDB` o persistencia nativa que no está disponible. Con `initializeAuth` + `getReactNativePersistence(AsyncStorage)` le indicamos explícitamente que use AsyncStorage, que sí funciona en Expo Go.

---

## Paso 3 — Crear el AuthContext

### `context/AuthContext.js`

```javascript
import React, { createContext, useContext, useState, useEffect } from 'react';
import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    updateProfile
} from 'firebase/auth';
import { auth } from '../config/firebaseConfig';
import { router } from 'expo-router';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Suscribirse a cambios en el estado de autenticación
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                setUser({
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    displayName: firebaseUser.displayName || firebaseUser.email.split('@')[0],
                });
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        // Cleanup: cancelar la suscripción al desmontar
        return () => unsubscribe();
    }, []);

    // Registrar nuevo usuario
    const register = async (email, password, name) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            // Actualizar el perfil con el nombre proporcionado
            await updateProfile(userCredential.user, {
                displayName: name
            });

            console.log('✅ Usuario registrado:', userCredential.user.email);
            return { success: true };
        } catch (error) {
            console.error('❌ Error en registro:', error);
            let errorMessage = 'Error al crear la cuenta';

            switch (error.code) {
                case 'auth/email-already-in-use':
                    errorMessage = 'Este email ya está registrado';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'Email inválido';
                    break;
                case 'auth/weak-password':
                    errorMessage = 'La contraseña debe tener al menos 6 caracteres';
                    break;
                default:
                    errorMessage = error.message;
            }

            return { success: false, error: errorMessage };
        }
    };

    // Iniciar sesión
    const login = async (email, password) => {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            console.log('✅ Login exitoso:', userCredential.user.email);
            return { success: true };
        } catch (error) {
            console.error('❌ Error en login:', error);
            let errorMessage = 'Error al iniciar sesión';

            switch (error.code) {
                case 'auth/invalid-credential':
                case 'auth/user-not-found':
                case 'auth/wrong-password':
                    errorMessage = 'Email o contraseña incorrectos';
                    break;
                case 'auth/invalid-email':
                    errorMessage = 'Email inválido';
                    break;
                case 'auth/too-many-requests':
                    errorMessage = 'Demasiados intentos fallidos. Intenta más tarde';
                    break;
                default:
                    errorMessage = error.message;
            }

            return { success: false, error: errorMessage };
        }
    };

    // Cerrar sesión
    const signOut = async () => {
        try {
            await firebaseSignOut(auth);
            setUser(null);
            console.log('👋 Sesión cerrada');
            router.replace('/home');
            return { success: true };
        } catch (error) {
            console.error('❌ Error al cerrar sesión:', error);
            return { success: false, error: error.message };
        }
    };

    const value = {
        user,
        loading,
        register,
        login,
        signOut,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth debe usarse dentro de un AuthProvider');
    }
    return context;
};
```

**Decisiones clave:**

- `loading` empieza en `true` → mientras `onAuthStateChanged` no responda, mostramos un spinner. Esto evita un flash del formulario de login al reabrir la app con sesión activa.
- Cada función devuelve `{ success, error }` → el componente que la invoca decide qué hacer (mostrar error, redirigir, etc.), manteniendo la lógica de UI fuera del contexto.
- `signOut` usa `router.replace('/home')` → `replace` en lugar de `push` para que el usuario no pueda volver "atrás" al contenido protegido.

---

## Paso 4 — Formulario de Login

### `components/LoginForm.js`

```javascript
import { View, Text, TextInput, Pressable, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function LoginForm({ onSwitchToRegister, onLoginSuccess }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { login } = useAuth();

    const handleLogin = async () => {
        setError('');

        if (!email || !password) {
            setError('Por favor completa todos los campos');
            return;
        }

        setLoading(true);
        const result = await login(email, password);
        setLoading(false);

        if (result.success) {
            if (onLoginSuccess) onLoginSuccess();
        } else {
            setError(result.error);
        }
    };

    return (
        <View className="w-full px-8">
            <Text className="text-2xl font-bold text-white mb-6 text-center">
                Iniciar Sesión
            </Text>

            {error ? (
                <View className="bg-red-500/20 border border-red-500 rounded-lg p-3 mb-4">
                    <Text className="text-red-200 text-center">{error}</Text>
                </View>
            ) : null}

            <View className="mb-4">
                <Text className="text-white mb-2">Email</Text>
                <TextInput
                    className="bg-white rounded-lg px-4 py-4 text-gray-900"
                    placeholder="correo@ejemplo.com"
                    placeholderTextColor="#9CA3AF"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    editable={!loading}
                />
            </View>

            <View className="mb-6">
                <Text className="text-white mb-2">Contraseña</Text>
                <TextInput
                    className="bg-white rounded-lg px-4 py-4 text-gray-900"
                    placeholder="••••••••"
                    placeholderTextColor="#9CA3AF"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    editable={!loading}
                />
            </View>

            <Pressable
                onPress={handleLogin}
                disabled={loading}
                className={`py-4 rounded-lg mb-4 ${
                    loading ? 'bg-orange-400' : 'bg-orange-500 active:bg-orange-600'
                }`}
            >
                {loading ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <Text className="text-white text-center font-bold text-lg">
                        Entrar
                    </Text>
                )}
            </Pressable>

            <View className="flex-row justify-center mt-4">
                <Text className="text-gray-300">¿No tienes cuenta? </Text>
                <Pressable onPress={onSwitchToRegister} disabled={loading}>
                    <Text className="text-orange-400 font-bold">Regístrate</Text>
                </Pressable>
            </View>
        </View>
    );
}
```

**Notas:**

- Se usa `bg-orange-500` en lugar de `bg-blue-500` para mantener coherencia con la paleta de RecetApp.
- `secureTextEntry` en el campo de contraseña oculta el texto.
- `autoCapitalize="none"` evita que el teclado capitalice el email.
- `editable={!loading}` desactiva los campos mientras se procesa la petición.

---

## Paso 5 — Formulario de Registro

### `components/RegisterForm.js`

```javascript
import { View, Text, TextInput, Pressable, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function RegisterForm({ onSwitchToLogin }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const { register } = useAuth();

    const handleRegister = async () => {
        setError('');
        setSuccess(false);

        if (!name || !email || !password || !confirmPassword) {
            setError('Por favor completa todos los campos');
            return;
        }

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            return;
        }

        if (password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        setLoading(true);
        const result = await register(email, password, name);
        setLoading(false);

        if (result.success) {
            setSuccess(true);
            setName('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');

            // Cambiar a login tras 2 segundos
            setTimeout(() => {
                onSwitchToLogin();
            }, 2000);
        } else {
            setError(result.error);
        }
    };

    return (
        <View className="w-full px-8">
            <Text className="text-2xl font-bold text-white mb-6 text-center">
                Crear Cuenta
            </Text>

            {error ? (
                <View className="bg-red-500/20 border border-red-500 rounded-lg p-3 mb-4">
                    <Text className="text-red-200 text-center">{error}</Text>
                </View>
            ) : null}

            {success ? (
                <View className="bg-green-500/20 border border-green-500 rounded-lg p-3 mb-4">
                    <Text className="text-green-200 text-center">
                        ¡Cuenta creada con éxito! Redirigiendo al login...
                    </Text>
                </View>
            ) : null}

            <View className="mb-4">
                <Text className="text-white mb-2">Nombre completo</Text>
                <TextInput
                    className="bg-white rounded-lg px-4 py-4 text-gray-900"
                    placeholder="Tu nombre"
                    placeholderTextColor="#9CA3AF"
                    value={name}
                    onChangeText={setName}
                    editable={!loading}
                />
            </View>

            <View className="mb-4">
                <Text className="text-white mb-2">Email</Text>
                <TextInput
                    className="bg-white rounded-lg px-4 py-4 text-gray-900"
                    placeholder="correo@ejemplo.com"
                    placeholderTextColor="#9CA3AF"
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    editable={!loading}
                />
            </View>

            <View className="mb-4">
                <Text className="text-white mb-2">Contraseña</Text>
                <TextInput
                    className="bg-white rounded-lg px-4 py-4 text-gray-900"
                    placeholder="••••••••"
                    placeholderTextColor="#9CA3AF"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    editable={!loading}
                />
            </View>

            <View className="mb-6">
                <Text className="text-white mb-2">Confirmar contraseña</Text>
                <TextInput
                    className="bg-white rounded-lg px-4 py-4 text-gray-900"
                    placeholder="••••••••"
                    placeholderTextColor="#9CA3AF"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    editable={!loading}
                />
            </View>

            <Pressable
                onPress={handleRegister}
                disabled={loading || success}
                className={`py-4 rounded-lg mb-4 ${
                    loading || success ? 'bg-orange-400' : 'bg-orange-500 active:bg-orange-600'
                }`}
            >
                {loading ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <Text className="text-white text-center font-bold text-lg">
                        Registrarse
                    </Text>
                )}
            </Pressable>

            <View className="flex-row justify-center mt-4">
                <Text className="text-gray-300">¿Ya tienes cuenta? </Text>
                <Pressable onPress={onSwitchToLogin} disabled={loading}>
                    <Text className="text-orange-400 font-bold">Inicia sesión</Text>
                </Pressable>
            </View>
        </View>
    );
}
```

**Validaciones implementadas (3 niveles):**

1. **Campos vacíos** → comprobación básica antes de hacer la petición.
2. **Contraseñas coincidentes** → evita errores de typo del usuario.
3. **Longitud mínima** → Firebase requiere al menos 6 caracteres; lo validamos en cliente para dar feedback inmediato.

---

## Paso 6 — Vista de Autenticación

### `views/AuthView.js`

```javascript
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator } from 'react-native';
import { useState, useEffect } from 'react';
import { useRouter } from 'expo-router';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import { useAuth } from '../context/AuthContext';

export default function AuthView() {
    const [showLogin, setShowLogin] = useState(true);
    const router = useRouter();
    const { user, loading } = useAuth();

    // Si ya hay sesión activa, redirigir al contenido
    useEffect(() => {
        if (user) {
            router.replace('/(drawer)/(tabs)/(stack)/landing');
        }
    }, [user]);

    const handleLoginSuccess = () => {
        router.replace('/(drawer)/(tabs)/(stack)/landing');
    };

    // Spinner mientras se verifica la sesión persistida
    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-gray-900">
                <ActivityIndicator size="large" color="#f97316" />
                <Text className="text-white mt-4">Verificando sesión...</Text>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            className="flex-1"
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
            <ScrollView
                contentContainerStyle={{ flexGrow: 1 }}
                keyboardShouldPersistTaps="handled"
            >
                <View className="flex-1 justify-center items-center px-4 py-8">
                    {/* Branding */}
                    <View className="mb-8 items-center">
                        <Text style={{ fontSize: 64 }}>👨‍🍳</Text>
                        <Text className="text-4xl font-bold text-white text-center mt-4">
                            RecetApp
                        </Text>
                        <Text className="text-gray-400 text-center mt-2">
                            Tu compañero de cocina
                        </Text>
                    </View>

                    {/* Formularios: Login o Registro */}
                    {showLogin ? (
                        <LoginForm
                            onSwitchToRegister={() => setShowLogin(false)}
                            onLoginSuccess={handleLoginSuccess}
                        />
                    ) : (
                        <RegisterForm onSwitchToLogin={() => setShowLogin(true)} />
                    )}
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}
```

**¿Por qué `KeyboardAvoidingView` + `ScrollView`?**

- `KeyboardAvoidingView` → ajusta el contenido cuando aparece el teclado, evitando que tape los inputs.
- `ScrollView` con `keyboardShouldPersistTaps="handled"` → permite que el formulario sea scrollable (especialmente el de registro con 4 campos) y que los taps en botones funcionen aunque el teclado esté abierto.

---

## Paso 7 — Modificar `app/_layout.jsx`

Envolver toda la app con el `AuthProvider`:

```jsx
import "../global.css";
import { Slot, SplashScreen } from "expo-router";
import React, { useEffect } from "react";
import { AuthProvider } from "../context/AuthContext";

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {
    useEffect(() => {
        SplashScreen.hideAsync();
    }, []);

    return (
        <AuthProvider>
            <Slot />
        </AuthProvider>
    );
};

export default RootLayout;
```

**¿Por qué aquí y no más abajo?** El `AuthProvider` debe envolver **toda** la app para que tanto `home.jsx` (la pantalla de auth) como las rutas internas del drawer/tabs puedan acceder al contexto. Si lo pusiéramos en el layout del drawer, la pantalla de login no tendría acceso.

---

## Paso 8 — Modificar `app/home.jsx`

Cambiar la redirección directa por la vista de autenticación:

```jsx
import React from 'react';
import { StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AuthView from '../views/AuthView';

export default function HomeScreen() {
    return (
        <SafeAreaView className="flex-1 bg-gray-900">
            <StatusBar barStyle="light-content" />
            <AuthView />
        </SafeAreaView>
    );
}
```

Antes este archivo hacía `<Redirect href="/(drawer)/(tabs)/(stack)/landing" />`. Ahora muestra `AuthView`, que internamente decide: si hay sesión → redirige al landing; si no → muestra el formulario.

---

## Paso 9 — Añadir cierre de sesión al Drawer

### `components/RecetAppDrawer.js` (modificado)

Añadir al final del drawer, después de `<DrawerItemList>`, un botón de cerrar sesión:

```javascript
import React from 'react';
import { View, Text, Pressable } from "react-native";
import { DrawerContentScrollView, DrawerItemList } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from '../context/AuthContext';

const RecetAppDrawer = (props) => {
    const { user, signOut } = useAuth();

    return (
        <DrawerContentScrollView
            scrollEnabled={true}
            style={{ backgroundColor: '#1a1a2e' }}
        >
            {/* Cabecera del Drawer */}
            <View
                style={{
                    paddingVertical: 30,
                    paddingHorizontal: 20,
                    marginBottom: 10,
                    backgroundColor: '#f97316',
                    borderRadius: 12,
                    marginHorizontal: 12,
                    alignItems: 'center',
                }}
            >
                <Text style={{ fontSize: 48, marginBottom: 8 }}>👨‍🍳</Text>
                <Text style={{
                    fontSize: 24,
                    fontWeight: 'bold',
                    color: 'white',
                    textAlign: 'center',
                }}>
                    RecetApp
                </Text>
                {user && (
                    <Text style={{
                        fontSize: 14,
                        color: 'rgba(255,255,255,0.8)',
                        textAlign: 'center',
                        marginTop: 4,
                    }}>
                        👋 Hola, {user.displayName}
                    </Text>
                )}
            </View>

            {/* Items del menú */}
            <DrawerItemList {...props} />

            {/* Botón de cerrar sesión */}
            <View style={{ marginTop: 20, paddingHorizontal: 16 }}>
                <Pressable
                    onPress={signOut}
                    style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        backgroundColor: '#dc2626',
                        paddingVertical: 14,
                        paddingHorizontal: 16,
                        borderRadius: 10,
                    }}
                >
                    <Ionicons name="log-out-outline" size={22} color="white" />
                    <Text style={{
                        color: 'white',
                        fontSize: 16,
                        fontWeight: '600',
                        marginLeft: 12,
                    }}>
                        Cerrar sesión
                    </Text>
                </Pressable>
            </View>
        </DrawerContentScrollView>
    );
};

export default RecetAppDrawer;
```

**Mejoras respecto al drawer anterior:**

- Se muestra el nombre del usuario autenticado en la cabecera (`user.displayName`).
- Botón rojo de "Cerrar sesión" con icono, visualmente distinguido de los items normales del menú.
- `signOut()` del contexto se encarga de limpiar el estado y redirigir a `/home`.

---

## Resumen del flujo completo

```
App se abre
    └─ _layout.jsx (AuthProvider envuelve todo)
        └─ index.jsx → Redirect a /home
            └─ home.jsx → AuthView
                ├─ loading=true → Spinner (verificando sesión con Firebase)
                ├─ user existe → router.replace al landing (sesión persistida)
                └─ user null → Mostrar LoginForm / RegisterForm
                    ├─ Login exitoso → router.replace al landing
                    └─ Registro exitoso → mensaje + cambiar a LoginForm

Dentro de la app (autenticado):
    └─ Drawer → RecetAppDrawer
        └─ Botón "Cerrar sesión" → signOut() → router.replace('/home')
```

---

## Dependencias finales del `package.json`

Asegúrate de que tu `package.json` incluya (además de las existentes):

```json
{
    "dependencies": {
        "firebase": "^12.5.0",
        "@react-native-async-storage/async-storage": "2.2.0"
    }
}
```

> Las versiones pueden variar. Usa las compatibles con tu versión de Expo SDK (consulta [Expo SDK compatibility](https://docs.expo.dev/versions/latest/)).


import { initializeApp } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Configuración de Firebase
 *
 * IMPORTANTE: Reemplaza estos valores con tus credenciales de Firebase Console
 *
 * Para obtener tu configuración:
 * 1. Ve a Firebase Console (https://console.firebase.google.com)
 * 2. Selecciona tu proyecto o crea uno nuevo
 * 3. Ve a Configuración del proyecto (ícono de engranaje)
 * 4. En "Tus apps", selecciona la app web o créala
 * 5. Copia el objeto firebaseConfig
 */
const firebaseConfig = {
    apiKey: "AIzaSyBFDkdAoHnCT98JhdH4K86SvnD7HFccwUw",
    authDomain: "unir-cinema.firebaseapp.com",
    projectId: "unir-cinema",
    storageBucket: "unir-cinema.firebasestorage.app",
    messagingSenderId: "450261492775",
    appId: "1:450261492775:web:d2afb421a7db8731ff9a02",
    measurementId: "G-6P7735GGDN"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar Auth con persistencia usando AsyncStorage
export const auth = initializeAuth(app, {
    persistence: getReactNativePersistence(ReactNativeAsyncStorage)
});

export default app;

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

    // Escuchar cambios en el estado de autenticación
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                // Usuario autenticado
                setUser({
                    uid: firebaseUser.uid,
                    email: firebaseUser.email,
                    displayName: firebaseUser.displayName || firebaseUser.email.split('@')[0],
                });
            } else {
                // Usuario no autenticado
                setUser(null);
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    // Función para registrar nuevo usuario
    const register = async (email, password, name) => {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);

            // Actualizar el perfil con el nombre
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

    // Función para iniciar sesión
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

    // Función para cerrar sesión
    const signOut = async () => {
        try {
            await firebaseSignOut(auth);
            setUser(null);
            console.log('👋 Sesión cerrada');
            // Redirigir a la pantalla de login
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

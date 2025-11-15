import React from "react";
import {Redirect} from "expo-router";
import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";

/**
 * Componente principal de la aplicación
 * Redirige a la pantalla de home (login/registro)
 * En una app real, aquí verificarías si hay sesión activa
 * y redirigirías a /(stack)/landing o a /home según corresponda
 */
const CinemaApp = () => {
    return (
        <SafeAreaProvider>
            <SafeAreaView className="flex-1">
                <Redirect href="/home"/>
            </SafeAreaView>
        </SafeAreaProvider>
    );
};

export default CinemaApp;
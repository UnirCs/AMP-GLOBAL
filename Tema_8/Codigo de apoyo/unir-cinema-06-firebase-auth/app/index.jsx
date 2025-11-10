import React from "react";
import { Redirect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

/**
 * Componente principal de la aplicación
 * Redirige a la pantalla de home (login/registro)
 * El AuthContext se encarga de redirigir a la landing si ya hay sesión activa
 */
const CinemaApp = () => {
    return (
        <SafeAreaView className="flex-1">
            <Redirect href="/home" />
        </SafeAreaView>
    );
};

export default CinemaApp;
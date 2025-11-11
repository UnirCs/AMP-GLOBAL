import { View, Text, TextInput, Pressable } from 'react-native';
import { useState } from 'react';
import * as Haptics from 'expo-haptics';

export default function LoginForm({ onSwitchToRegister, onLoginSuccess }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        console.log('Login con:', email, password);

        // Validación hardcodeada: user/user
        if (email === 'user' && password === 'user') {
            console.log('Login exitoso!');
            if (onLoginSuccess) {
                onLoginSuccess();
            }
        } else {
            console.log('Credenciales incorrectas');
            // Aquí podrías mostrar un mensaje de error al usuario
            alert('Credenciales incorrectas. Usa: user/user');
        }
    };

    return (
        <View className="w-full px-8">
            <Text className="text-2xl font-bold text-white mb-6 text-center">
                Iniciar Sesión
            </Text>

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
                />
            </View>

            <Pressable
                onPress={handleLogin}
                className="bg-blue-500 py-4 rounded-lg mb-4 active:bg-blue-600"
            >
                <Text className="text-white text-center font-bold text-lg">
                    Entrar
                </Text>
            </Pressable>

            <View className="flex-row justify-center mt-4">
                <Text className="text-gray-300">¿No tienes cuenta? </Text>
                <Pressable onPress={onSwitchToRegister}>
                    <Text className="text-blue-500 font-bold">Regístrate</Text>
                </Pressable>
            </View>
        </View>
    );
}
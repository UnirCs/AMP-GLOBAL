import { View, Text, TextInput, Pressable, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import * as Haptics from 'expo-haptics';
import { useAuth } from '../context/AuthContext';

export default function LoginForm({ onSwitchToRegister, onLoginSuccess }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const { login } = useAuth();

    const handleLogin = async () => {
        // Limpiar error anterior
        setError('');

        // Validaciones básicas
        if (!email || !password) {
            setError('Por favor completa todos los campos');
            return;
        }

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setLoading(true);

        // Intentar login con Firebase
        const result = await login(email, password);

        setLoading(false);

        if (result.success) {
            console.log('✅ Login exitoso!');
            if (onLoginSuccess) {
                onLoginSuccess();
            }
        } else {
            setError(result.error);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
    };

    return (
        <View className="w-full px-8">
            <Text className="text-2xl font-bold text-white mb-6 text-center">
                Iniciar Sesión
            </Text>

            {/* Mostrar error si existe */}
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
                    loading ? 'bg-blue-400' : 'bg-blue-500 active:bg-blue-600'
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
                    <Text className="text-blue-500 font-bold">Regístrate</Text>
                </Pressable>
            </View>
        </View>
    );
}
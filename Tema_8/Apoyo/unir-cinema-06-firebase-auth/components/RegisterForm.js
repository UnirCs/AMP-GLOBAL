import { View, Text, TextInput, Pressable, ActivityIndicator } from 'react-native';
import { useState } from 'react';
import * as Haptics from 'expo-haptics';
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
        // Limpiar mensajes anteriores
        setError('');
        setSuccess(false);

        // Validaciones
        if (!name || !email || !password || !confirmPassword) {
            setError('Por favor completa todos los campos');
            return;
        }

        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden');
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
            return;
        }

        if (password.length < 6) {
            setError('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        setLoading(true);

        // Intentar registro con Firebase
        const result = await register(email, password, name);

        setLoading(false);

        if (result.success) {
            console.log('✅ Registro exitoso!');
            setSuccess(true);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

            // Limpiar formulario
            setName('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');

            // Cambiar a login después de 2 segundos
            setTimeout(() => {
                onSwitchToLogin();
            }, 2000);
        } else {
            setError(result.error);
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
        }
    };

    return (
        <View className="w-full px-8">
            <Text className="text-2xl font-bold text-white mb-6 text-center">
                Crear Cuenta
            </Text>

            {/* Mostrar error si existe */}
            {error ? (
                <View className="bg-red-500/20 border border-red-500 rounded-lg p-3 mb-4">
                    <Text className="text-red-200 text-center">{error}</Text>
                </View>
            ) : null}

            {/* Mostrar mensaje de éxito */}
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
                    loading || success ? 'bg-blue-400' : 'bg-blue-500 active:bg-blue-600'
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
                    <Text className="text-blue-500 font-bold">Inicia sesión</Text>
                </Pressable>
            </View>
        </View>
    );
}

import { View, Text, TextInput, Pressable } from 'react-native';
import { useState } from 'react';

export default function RegisterForm({ onSwitchToLogin }) {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleRegister = () => {
        console.log('Registro con:', name, email, password);
        // Aquí iría la lógica de registro
    };

    return (
        <View className="w-full px-8">
            <Text className="text-2xl font-bold text-white mb-6 text-center">
                Crear Cuenta
            </Text>

            <View className="mb-4">
                <Text className="text-white mb-2">Nombre completo</Text>
                <TextInput
                    className="bg-white rounded-lg px-4 py-4 text-gray-900"
                    placeholder="Tu nombre"
                    placeholderTextColor="#9CA3AF"
                    value={name}
                    onChangeText={setName}
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
                />
            </View>

            <Pressable
                onPress={handleRegister}
                className="bg-blue-500 py-4 rounded-lg mb-4 active:bg-blue-600"
            >
                <Text className="text-white text-center font-bold text-lg">
                    Registrarse
                </Text>
            </Pressable>

            <View className="flex-row justify-center mt-4">
                <Text className="text-gray-300">¿Ya tienes cuenta? </Text>
                <Pressable onPress={onSwitchToLogin}>
                    <Text className="text-blue-500 font-bold">Inicia sesión</Text>
                </Pressable>
            </View>
        </View>
    );
}

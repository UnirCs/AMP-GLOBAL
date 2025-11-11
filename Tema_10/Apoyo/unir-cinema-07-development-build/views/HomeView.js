import {View, Text, Image, KeyboardAvoidingView, Platform, ScrollView, ActivityIndicator} from 'react-native';
import {useState, useEffect} from 'react';
import { useRouter } from 'expo-router';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';
import { useAuth } from '../context/AuthContext';

export default function HomeView() {
    const [showLogin, setShowLogin] = useState(true);
    const router = useRouter();
    const { user, loading } = useAuth();

    // Si el usuario ya está autenticado, redirigir automáticamente
    useEffect(() => {
        if (user) {
            router.replace('/(drawer)/(tabs)/(stack)/landing');
        }
    }, [user]);

    const handleLoginSuccess = () => {
        // Redirigir al stack de navegación cuando el login es exitoso
        router.replace('/(drawer)/(tabs)/(stack)/landing');
    };

    // Mostrar indicador de carga mientras se verifica la sesión
    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-gray-900">
                <ActivityIndicator size="large" color="#3b82f6" />
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
                    {/* Logo */}
                    <View className="mb-4 items-center">
                        <Image className="mb-4"
                            source={require('../assets/unirLogo.png')}
                            style={{
                                width: 120,
                                height: 120,
                                borderRadius: 60,
                                alignSelf: 'center'
                            }}
                            resizeMode="cover"
                        />
                        <Text className="text-4xl font-bold text-white text-center mt-12">
                            UNIR CINEMA
                        </Text>
                    </View>

                    {/* Formularios */}
                    {showLogin ? (
                        <LoginForm
                            onSwitchToRegister={() => setShowLogin(false)}
                            onLoginSuccess={handleLoginSuccess}
                        />
                    ) : (
                        <RegisterForm onSwitchToLogin={() => setShowLogin(true)}/>
                    )}
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

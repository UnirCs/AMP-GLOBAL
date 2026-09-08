import {View, Text, Image, KeyboardAvoidingView, Platform, ScrollView} from 'react-native';
import {useState} from 'react';
import { useRouter } from 'expo-router';
import LoginForm from '../components/LoginForm';
import RegisterForm from '../components/RegisterForm';

export default function HomeView() {
    const [showLogin, setShowLogin] = useState(true);
    const router = useRouter();

    const handleLoginSuccess = () => {
        // Redirigir al stack de navegación cuando el login es exitoso
        router.replace('/(drawer)/(tabs)/(stack)/landing');
    };

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

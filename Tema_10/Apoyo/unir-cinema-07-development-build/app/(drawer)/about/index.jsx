import React from 'react';
import { View, Text, ScrollView, Pressable, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const AboutUs = () => {
    const handleLinkedInPress = async () => {
        const appUrl = 'linkedin://profile/jesusperezmelero';
        const webUrl = 'https://www.linkedin.com/in/jesusperezmelero/';

        try {
            // Intenta abrir la app de LinkedIn directamente
            await Linking.openURL(appUrl);
        } catch (error) {
            // Si falla, abre en el navegador
            try {
                await Linking.openURL(webUrl);
            } catch (err) {
                Alert.alert('Error', 'No se pudo abrir el enlace de LinkedIn.');
            }
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-900">
            <ScrollView className="flex-1 px-4 py-6">
                <View className="mb-6">
                    <Text className="text-3xl font-bold text-center text-blue-500">Sobre Nosotros</Text>
                </View>

                <View className="mb-6">
                    <Text className="text-lg text-gray-300 leading-6">
                        ¡Bienvenido a nuestra aplicación de cine! Estamos dedicados a proporcionar la mejor experiencia cinematográfica para nuestros clientes. Nuestra aplicación te permite navegar fácilmente por las películas, seleccionar tus asientos y comprar entradas desde la comodidad de tu hogar.
                    </Text>
                </View>

                <View className="mb-6">
                    <Text className="text-lg text-gray-300 leading-6">
                        Nuestros cines están equipados con la última tecnología para garantizar que tengas una experiencia inolvidable. Desde pantallas de alta definición hasta sistemas de sonido envolvente, tenemos todo lo que necesitas para disfrutar de tus películas favoritas.
                    </Text>
                </View>

                <View className="mb-6">
                    <Text className="text-lg text-gray-300 leading-6">
                        Gracias por elegir nuestra aplicación de cine. ¡Esperamos que tengas un gran momento!
                    </Text>
                </View>

                <View className="mb-6">
                    <Text className="text-lg text-gray-300 leading-6">
                        Esta es una aplicación de ejemplo de UNIR, la Universidad Internacional de La Rioja, para trabajar con React Native y aplicaciones multiplataforma.
                    </Text>
                </View>

                {/* Sección del Autor */}
                <View className="mt-8 mb-6 p-6 bg-gray-800 rounded-lg">
                    <Text className="text-2xl font-bold text-white mb-4 text-center">
                        Autor
                    </Text>
                    <Text className="text-lg text-gray-300 mb-4 text-center">
                        Profesor: Jesús Pérez Melero
                    </Text>

                    <Pressable
                        onPress={handleLinkedInPress}
                        className="flex-row items-center justify-center bg-blue-600 rounded-lg py-3 px-4 active:bg-blue-700"
                    >
                        <Ionicons name="logo-linkedin" size={24} color="white" />
                        <Text className="text-white font-bold text-base ml-2">
                            Ver perfil en LinkedIn
                        </Text>
                    </Pressable>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default AboutUs;

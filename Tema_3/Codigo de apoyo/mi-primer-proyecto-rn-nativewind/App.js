import {StatusBar} from 'expo-status-bar';
import {Text, View, Pressable} from 'react-native';
import {useState} from 'react';
import './global.css';
import {useFonts} from "expo-font";

export default function App() {

    const [fontsLoaded, error] = useFonts({
        'Rasa-VariableFont': require('./assets/fonts/Rasa-VariableFont.ttf')
    });
    if (!fontsLoaded && !error) return null;

    const [tema, setTema] = useState('claro');

    const cambiarTema = () => {
        if (tema === 'claro') {
            setTema('oscuro');
        } else if (tema === 'oscuro') {
            setTema('azul');
        } else {
            setTema('claro');
        }
    };

    // Definir los estilos según el tema
    const fondoTema = tema === 'claro'
        ? 'bg-white'
        : tema === 'oscuro'
            ? 'bg-gray-900'
            : 'bg-blue-500';

    const textoTema = tema === 'claro'
        ? 'text-gray-900'
        : 'text-white';

    const botonTema = tema === 'claro'
        ? 'bg-blue-500'
        : tema === 'oscuro'
            ? 'bg-gray-700'
            : 'bg-blue-700';

    return (
        <View className={`flex-1 items-center justify-center ${fondoTema}`}>
            <Text className={`text-3xl font-bold mb-2 ${textoTema}`}>
                Estilos con NativeWind
            </Text>

            <Text className={`text-base mb-6 ${textoTema}`}>
                Tema actual: {tema}
            </Text>

            {/* Botón para cambiar tema */}
            <Pressable
                onPress={cambiarTema}
                className={`${botonTema} px-6 py-3 rounded-lg mb-8`}
            >
                <Text className="text-white text-base font-semibold font-rasa-light">
                    Cambiar Tema
                </Text>
            </Pressable>

            {/* Separador visual */}
            <View className={`w-64 h-px mb-6 ${tema === 'claro' ? 'bg-gray-300' : 'bg-gray-600'}`}/>

            <Text className={`text-lg mb-6 ${textoTema}`}>
                Ejemplos de Botones:
            </Text>

            {/* Botón Primary - Sólido con sombra */}
            <Pressable className="bg-blue-600 px-8 py-4 rounded-lg mb-4 shadow-lg shadow-blue-500/50">
                <Text className="text-white text-lg font-bold text-center font-rasa-light">
                    Botón Primary
                </Text>
            </Pressable>

            {/* Botón Outline - Con borde */}
            <Pressable className="border-2 border-purple-600 px-8 py-4 rounded-lg mb-4 bg-white">
                <Text className="text-purple-600 text-lg font-bold text-center font-rasa-light">
                    Botón Outline
                </Text>
            </Pressable>

            {/* Botón Danger - Redondeado */}
            <Pressable className="bg-red-500 px-8 py-4 rounded-full shadow-xl shadow-red-500/60">
                <Text className="text-white text-lg font-bold text-center font-rasa-light">
                    Botón Danger
                </Text>
            </Pressable>

            <StatusBar style={tema === 'claro' ? 'dark' : 'light'}/>
        </View>
    );
}

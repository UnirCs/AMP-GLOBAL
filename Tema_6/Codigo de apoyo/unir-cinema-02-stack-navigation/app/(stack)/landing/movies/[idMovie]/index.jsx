import React from 'react';
import { View, Text, ScrollView, Pressable, Image, Dimensions } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useMoviesContext } from '../../../../../context/MoviesContext';
import * as Haptics from 'expo-haptics';

/**
 * Componente MovieDetail - Pantalla de detalle de una película
 * Obtiene los datos de la película desde el contexto usando el ID
 */
export default function MovieDetailScreen() {
    const router = useRouter();
    const { idMovie } = useLocalSearchParams();
    const { movies } = useMoviesContext();

    // Buscar la película en el contexto por ID
    const movie = movies.find(m => m.id === parseInt(idMovie));

    if (!movie) {
        return (
            <View className="flex-1 bg-gray-900 justify-center items-center">
                <Text className="text-white text-xl">Película no encontrada</Text>
            </View>
        );
    }

    const handleSessionPress = (sessionId) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        router.push(`/(stack)/landing/movies/${idMovie}/booking/${sessionId}`);
    };

    // Dividir sesiones en grupos de 3
    const sessionsRows = [];
    for (let i = 0; i < movie.sessions.length; i += 3) {
        sessionsRows.push(movie.sessions.slice(i, i + 3));
    }

    // Calcular el ancho de cada botón (ancho de pantalla menos padding y gaps)
    const screenWidth = Dimensions.get('window').width;
    const padding = 32; // px-4 * 2
    const gapsWidth = 16; // 2 gaps de 8px cada uno entre 3 botones
    const buttonWidth = (screenWidth - padding - gapsWidth) / 3;

    return (
        <ScrollView className="flex-1 bg-gray-900">
            <View className="px-4 py-6" style={{ marginTop: 20 }}>
                {/* Título centrado en mayúsculas */}
                <View className="mb-6">
                    <Text className="text-3xl font-bold text-white text-center">
                        {movie.title.toUpperCase()}
                    </Text>
                </View>

                {/* Imagen y datos de la película */}
                <View className="flex-row mb-6">
                    {/* Imagen a la izquierda */}
                    <View>
                        <Image
                            source={{ uri: movie.imageBase64 }}
                            style={{
                                width: 120,
                                height: 180,
                                borderRadius: 8,
                            }}
                            resizeMode="cover"
                        />
                    </View>

                    {/* Datos a la derecha */}
                    <View className="flex-1 justify-center" style={{ marginLeft: 16 }}>
                        <Text className="text-white text-lg mb-2">
                            <Text className="font-bold">Director: </Text>
                            {movie.director}
                        </Text>
                        <Text className="text-white text-lg mb-2">
                            <Text className="font-bold">Año: </Text>
                            {movie.year}
                        </Text>
                        <Text className="text-white text-lg">
                            <Text className="font-bold">Reparto: </Text>
                            {movie.cast}
                        </Text>
                    </View>
                </View>

                {/* Sinopsis */}
                <View className="mb-6">
                    <Text className="text-2xl font-bold text-white mb-4">
                        Sinopsis
                    </Text>
                    <Text className="text-white text-base leading-6">
                        {movie.synopsis}
                    </Text>
                </View>

                {/* Lista de sesiones */}
                <View className="mb-4">
                    <Text className="text-2xl font-bold text-white mb-4">
                        Sesiones Disponibles
                    </Text>

                    {sessionsRows.map((row, rowIndex) => (
                        <View key={rowIndex} className="flex-row mb-4" style={{ gap: 8 }}>
                            {row.map((session) => (
                                <Pressable
                                    key={session.id}
                                    onPress={() => handleSessionPress(session.id)}
                                    className="active:bg-blue-900"
                                    style={{
                                        borderWidth: 2,
                                        borderColor: '#3B82F6',
                                        paddingVertical: 12,
                                        paddingHorizontal: 12,
                                        width: buttonWidth,
                                    }}
                                >
                                    <Text className="text-blue-500 font-bold text-center text-lg">
                                        {session.time}
                                    </Text>
                                </Pressable>
                            ))}
                        </View>
                    ))}
                </View>
            </View>
        </ScrollView>
    );
}

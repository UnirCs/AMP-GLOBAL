import React from 'react';
import {View, Text, ScrollView, Pressable, ActivityIndicator, Dimensions, Image} from 'react-native';
import {useRouter} from 'expo-router';
import {useMovies} from '../../../../../hooks/useMovies';
import * as Haptics from 'expo-haptics';
import {Ionicons} from '@expo/vector-icons';

/**
 * Componente Landing - Pantalla principal después del login
 * Muestra la cartelera de películas disponibles por ciudad
 */
export default function LandingScreen() {
    const router = useRouter();
    const {currentCity, movies, loading, goToPreviousCity, goToNextCity} = useMovies('Madrid');
    const {width} = Dimensions.get('window');
    const cityBoxSize = width * 0.45;

    const handleCityChange = (direction) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        if (direction === 'prev') {
            goToPreviousCity();
        } else {
            goToNextCity();
        }
    };

    const handleMoviePress = (movieId) => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        router.push(`/(drawer)/(tabs)/(stack)/landing/movies/${movieId}`);
    };

    return (
        <View className="flex-1 bg-gray-900 px-4 py-6">
            {/* Selector de Ciudad */}
            <View className="mb-8">
                <View className="flex-row items-center justify-center">
                    {/* Flecha Izquierda */}
                    <Pressable
                        onPress={() => handleCityChange('prev')}
                        className="active:opacity-50"
                        style={{height: cityBoxSize, justifyContent: 'center'}}
                    >
                        <Ionicons name="chevron-back-outline" size={40} color="#3B82F6"/>
                    </Pressable>

                    {/* Cuadro de Ciudad */}
                    <View
                        style={{
                            width: cityBoxSize,
                            height: cityBoxSize,
                            marginHorizontal: 16,
                        }}
                    >
                        <View
                            style={{
                                width: cityBoxSize,
                                height: cityBoxSize,
                            }}
                            className="rounded-3xl overflow-hidden bg-blue-600"
                        >
                            <View className="flex-1 justify-center items-center p-6">
                                <Text
                                    className="text-white font-bold text-center"
                                    style={{
                                        fontSize: cityBoxSize * 0.15,
                                        textShadowColor: 'rgba(197,0,0,0.4)',
                                        textShadowOffset: {width: 0, height: 8},
                                        textShadowRadius: 8,
                                        letterSpacing: 1,
                                    }}
                                    numberOfLines={2}
                                >
                                    {currentCity.toUpperCase()}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Flecha Derecha */}
                    <Pressable
                        onPress={() => handleCityChange('next')}
                        className="active:opacity-50"
                        style={{height: cityBoxSize, justifyContent: 'center'}}>
                        <Ionicons name="chevron-forward-outline" size={40} color="#3B82F6"/>
                    </Pressable>
                </View>
            </View>

            <ScrollView className="flex-1 bg-gray-900">
                {/* Título de Cartelera */}
                <View className="mb-6">
                    <Text className="text-2xl font-bold text-white text-center">
                        Las mejores películas de la actualidad que te están esperando en {currentCity}
                    </Text>
                </View>

                {/* Loading State */}
                {loading ? (
                    <View className="flex-1 justify-center items-center py-20">
                        <ActivityIndicator size="large" color="#60A5FA"/>
                        <Text className="text-white text-center mt-4">Cargando películas...</Text>
                    </View>
                ) : (
                    /* Lista de Películas */
                    <View>
                        {movies.map((movie) => (
                            <View
                                key={movie.id}
                                className="bg-gray-900 rounded-lg mb-4 overflow-hidden"
                                style={{
                                    borderWidth: 1,
                                    borderColor: 'white',
                                }}
                            >
                                <View className="flex-row p-4">
                                    {/* Imagen de la película (izquierda) */}
                                    <View>
                                        <Image
                                            source={{uri: movie.imageBase64}}
                                            style={{
                                                width: 100,
                                                height: 140,
                                                borderRadius: 8,
                                            }}
                                            resizeMode="cover"
                                        />
                                    </View>

                                    {/* Contenido derecho: Título y Botón */}
                                    <View className="flex-1 justify-center" style={{marginLeft: 16}}>
                                        {/* Título en mayúsculas */}
                                        <Text className="text-white text-xl font-bold mb-4">
                                            {movie.title.toUpperCase()}
                                        </Text>

                                        {/* Botón Comprar Entradas */}
                                        <Pressable
                                            onPress={() => handleMoviePress(movie.id)}
                                            className="bg-blue-500 rounded-lg active:bg-blue-600"
                                            style={{
                                                alignSelf: 'flex-start',
                                                paddingVertical: 8,
                                                paddingHorizontal: 10,
                                                flexDirection: 'row',
                                                alignItems: 'center',
                                                gap: 10,
                                            }}
                                        >
                                            <Ionicons name="ticket-outline" size={20} color="white" />
                                            <Text className="text-white font-bold text-base">
                                                Comprar entradas
                                            </Text>
                                        </Pressable>
                                    </View>
                                </View>
                            </View>
                        ))}
                    </View>
                )}
                {/* Footer Info */}
                {!loading && movies.length > 0 && (
                    <View className="mt-6 mb-6 bg-gray-800/50 rounded-xl p-4">
                        <Text className="text-white text-center text-sm">
                            💡 Desliza entre ciudades para ver más cines
                        </Text>
                    </View>
                )}
            </ScrollView>
        </View>
    );
}

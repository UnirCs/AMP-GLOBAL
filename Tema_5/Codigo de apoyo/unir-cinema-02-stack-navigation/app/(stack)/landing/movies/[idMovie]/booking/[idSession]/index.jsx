import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable, Dimensions, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useMoviesContext } from '../../../../../../../context/MoviesContext';
import { useSessionDetails } from '../../../../../../../hooks/useSessionDetails';
import * as Haptics from 'expo-haptics';

/**
 * Componente BookingSession - Pantalla de selección de asientos
 */
export default function BookingSessionScreen() {
    const { idMovie, idSession } = useLocalSearchParams();
    const { movies } = useMoviesContext();
    const [selectedSeats, setSelectedSeats] = useState([]);

    // Usar el hook para obtener la disponibilidad de asientos
    const { seatsAvailability, loading, error } = useSessionDetails(parseInt(idSession));

    // Buscar la película
    const movie = movies.find(m => m.id === parseInt(idMovie));

    // Buscar la sesión
    const session = movie?.sessions.find(s => s.id === parseInt(idSession));

    // Obtener fecha actual
    const currentDate = new Date();
    const dateString = currentDate.toLocaleDateString('es-ES', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const pricePerSeat = 10;

    // Calcular tamaño dinámico de asientos basado en el ancho de pantalla
    const screenWidth = Dimensions.get('window').width;
    const horizontalPadding = 32; // 16px cada lado
    const rowNumberWidth = 30; // Ancho para el número de fila
    const aisleWidth = 12; // Ancho de pasillo reducido
    const maxSeatsInRow = 16; // Máximo de asientos en una fila
    const seatMargin = 2; // Margen de cada asiento

    // Calcular el ancho disponible para asientos
    const availableWidth = screenWidth - horizontalPadding - rowNumberWidth;
    // Calcular ancho de asiento considerando 2 pasillos y márgenes
    const totalMargins = (maxSeatsInRow * seatMargin * 2); // margin en ambos lados
    const totalAisles = aisleWidth * 2; // Dos pasillos
    const seatSize = Math.floor((availableWidth - totalAisles - totalMargins) / maxSeatsInRow);

    // Configuración de filas
    const getRowConfiguration = (rowNumber) => {
        if (rowNumber === 1) return { total: 6, side: 0, center: 6 };
        if (rowNumber === 2) return { total: 8, side: 0, center: 8 };
        if (rowNumber === 3) return { total: 12, side: 2, center: 8 };
        if (rowNumber === 13) return { total: 14, side: 3, center: 8, isVIP: true };
        if (rowNumber === 14 || rowNumber === 15) return { total: 16, side: 4, center: 8 };
        return { total: 14, side: 3, center: 8 };
    };

    const toggleSeat = (seatId, isOccupied) => {
        // No permitir seleccionar asientos ocupados
        if (isOccupied) {
            return;
        }

        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        setSelectedSeats(prev =>
            prev.includes(seatId)
                ? prev.filter(id => id !== seatId)
                : [...prev, seatId]
        );
    };

    const renderSeat = (rowNumber, seatNumber, isVIP = false) => {
        const seatId = `${rowNumber}-${seatNumber}`;
        const isSelected = selectedSeats.includes(seatId);

        // Obtener estado de ocupación desde seatsAvailability
        const isOccupied = seatsAvailability[rowNumber - 1]?.[seatNumber - 1] === 1;

        return (
            <Pressable
                key={seatId}
                onPress={() => toggleSeat(seatId, isOccupied)}
                disabled={isOccupied}
                style={{
                    width: seatSize,
                    height: seatSize,
                    margin: seatMargin,
                    borderRadius: 4,
                    backgroundColor: isOccupied
                        ? '#7f1d1d' // Rojo oscuro para ocupados
                        : isSelected
                            ? (isVIP ? '#3b82f6' : '#3b82f6')
                            : (isVIP ? '#eab308' : '#4b5563'),
                    justifyContent: 'center',
                    alignItems: 'center',
                    opacity: isOccupied ? 0.8 : 1,
                }}
            >
                <Text style={{ color: 'white', fontSize: Math.max(8, seatSize / 3.5) }}>
                    {seatNumber}
                </Text>
            </Pressable>
        );
    };

    const renderRow = (rowNumber) => {
        const config = getRowConfiguration(rowNumber);
        const { total, side, center, isVIP } = config;
        const seats = [];

        // Asientos laterales izquierdos
        if (side > 0) {
            for (let i = 1; i <= side; i++) {
                seats.push(renderSeat(rowNumber, i, isVIP));
            }
            // Pasillo izquierdo
            seats.push(
                <View key={`left-aisle-${rowNumber}`} style={{ width: aisleWidth }} />
            );
        }

        // Asientos centrales
        for (let i = side + 1; i <= side + center; i++) {
            seats.push(renderSeat(rowNumber, i, isVIP));
        }

        // Asientos laterales derechos
        if (side > 0) {
            // Pasillo derecho
            seats.push(
                <View key={`right-aisle-${rowNumber}`} style={{ width: aisleWidth }} />
            );
            for (let i = side + center + 1; i <= total; i++) {
                seats.push(renderSeat(rowNumber, i, isVIP));
            }
        }

        return (
            <View key={`row-${rowNumber}`} style={{ marginBottom: 6 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                    <Text style={{ color: '#9ca3af', fontSize: 11, width: rowNumberWidth, textAlign: 'center' }}>
                        {rowNumber}
                    </Text>
                    <View style={{ flexDirection: 'row', justifyContent: 'center', flexWrap: 'nowrap' }}>
                        {seats}
                    </View>
                </View>
            </View>
        );
    };

    if (!movie || !session) {
        return (
            <View className="flex-1 bg-gray-900 justify-center items-center">
                <Text className="text-white text-xl">Sesión no encontrada</Text>
            </View>
        );
    }

    // Mostrar spinner mientras carga
    if (loading) {
        return (
            <View className="flex-1 bg-gray-900 justify-center items-center">
                <ActivityIndicator size="large" color="#3b82f6" />
                <Text className="text-white text-lg mt-4 text-center">Cargando disponibilidad...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View className="flex-1 bg-gray-900 justify-center items-center">
                <Text className="text-white text-xl">Error al cargar la sesión</Text>
            </View>
        );
    }

    const totalPrice = selectedSeats.length * pricePerSeat;

    return (
        <ScrollView className="flex-1 bg-gray-900">
            <View className="px-4 py-6">
                {/* Información de la sesión */}
                <View className="bg-gray-800 p-4 rounded-lg mb-6">
                    <Text className="text-2xl font-bold text-white mb-4 text-center">
                        {movie.title.toUpperCase()}
                    </Text>
                    <View className="flex-row justify-between mb-2">
                        <Text className="text-white">Cuándo: </Text>
                        <Text className="text-white" numberOfLines={2}>
                            {dateString} - {session.time}
                        </Text>
                    </View>
                    <View className="flex-row justify-between">
                        <Text className="text-white">Precio: </Text>
                        <Text className="text-white">{pricePerSeat}€ por asiento</Text>
                    </View>
                </View>

                {/* Leyenda */}
                <View className="mb-6 flex-row justify-center" style={{ gap: 48 }}>
                    <View>
                        <View className="flex-row items-center mb-4">
                            <View style={{
                                width: 18,
                                height: 18,
                                backgroundColor: '#4b5563',
                                borderRadius: 3,
                                marginRight: 4
                            }} />
                            <Text className="text-gray-300 text-xs">Disponible</Text>
                        </View>
                        <View className="flex-row items-center">
                            <View style={{
                                width: 18,
                                height: 18,
                                backgroundColor: '#7f1d1d',
                                borderRadius: 3,
                                marginRight: 4
                            }} />
                            <Text className="text-gray-300 text-xs">No disponible</Text>
                        </View>
                    </View>
                    <View>
                        <View className="flex-row items-center mb-4">
                            <View style={{
                                width: 18,
                                height: 18,
                                backgroundColor: '#3b82f6',
                                borderRadius: 3,
                                marginRight: 4
                            }} />
                            <Text className="text-gray-300 text-xs">Seleccionado</Text>
                        </View>
                        <View className="flex-row items-center">
                            <View style={{
                                width: 18,
                                height: 18,
                                backgroundColor: '#eab308',
                                borderRadius: 3,
                                marginRight: 4
                            }} />
                            <Text className="text-gray-300 text-xs">VIP</Text>
                        </View>
                    </View>
                </View>

                {/* Pantalla */}
                <View className="mb-6">
                    <View style={{
                        height: 8,
                        backgroundColor: '#374151',
                        borderRadius: 4,
                        marginBottom: 4
                    }} />
                    <Text className="text-white text-center text-sm">PANTALLA</Text>
                </View>

                {/* Asientos */}
                <View className="mb-6">
                    {[...Array(15)].map((_, index) => renderRow(index + 1))}
                </View>

                {/* Resumen */}
                <View className="bg-gray-800 p-4 rounded-lg">
                    <Pressable
                        disabled={selectedSeats.length === 0}
                        onPress={() => {
                            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                        }}
                        style={{
                            backgroundColor: selectedSeats.length > 0 ? '#10b981' : '#374151',
                            padding: 16,
                            borderRadius: 8,
                            opacity: selectedSeats.length > 0 ? 1 : 0.5
                        }}
                    >
                        <Text className="text-white text-center font-bold text-lg">
                            Confirmar Reserva{selectedSeats.length > 0 ? ` (${totalPrice}€)` : ''}
                        </Text>
                    </Pressable>
                </View>
            </View>
        </ScrollView>
    );
}

import React, { useState, useRef } from 'react';
import { View, Text, ScrollView, Pressable, Modal, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMoviesContext } from '../../../../../../context/MoviesContext';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import * as Calendar from 'expo-calendar';
import * as Sharing from 'expo-sharing';
import QRCode from 'react-native-qrcode-svg';
import ViewShot from 'react-native-view-shot';

const AllTicketsScreen = () => {
    const { tickets } = useMoviesContext();
    const [modalVisible, setModalVisible] = useState(false);
    const [qrCodeValue, setQrCodeValue] = useState('');
    const [selectedTicket, setSelectedTicket] = useState(null);
    const qrRefs = useRef({});

    const handleSMSTicket = (id) => {
        router.push(`/(drawer)/(tabs)/tickets/(stack)/allTickets/share/${id}`);
    };

    const handleShareTicket = async (ticket) => {
        try {
            // Generar el QR como imagen
            const qrRef = qrRefs.current[ticket.id];
            if (!qrRef) {
                Alert.alert('Error', 'No se pudo generar la imagen del ticket');
                return;
            }

            const uri = await qrRef.capture();

            // Verificar si se puede compartir
            const isAvailable = await Sharing.isAvailableAsync();
            if (isAvailable) {
                await Sharing.shareAsync(uri, {
                    mimeType: 'image/png',
                    dialogTitle: `Compartir entrada: ${ticket.movieTitle}`,
                    UTI: 'public.png'
                });
            } else {
                Alert.alert('Error', 'No es posible compartir archivos en este dispositivo');
            }
        } catch (error) {
            console.error('Error al compartir:', error);
            Alert.alert('Error', 'No se pudo compartir la entrada');
        }
    };

    const handleQRCode = (ticket) => {
        const randomValue = Math.random().toString(36).substring(7);
        setQrCodeValue(randomValue);
        setSelectedTicket(ticket);
        setModalVisible(true);
    };

    const handleCreateCalendarEvent = async (ticket) => {
        const { status } = await Calendar.requestCalendarPermissionsAsync();
        if (status === 'granted') {
            const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
            const defaultCalendar = calendars.find(cal => cal.isPrimary) || calendars[0];

            const [hour, minute] = ticket.time.split(':').map(Number);
            const startDate = new Date();
            startDate.setHours(hour, minute, 0, 0);
            const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);

            const eventDetails = {
                title: `Película: ${ticket.movieTitle}`,
                startDate,
                endDate,
                timeZone: 'GMT',
                location: ticket.room,
                notes: `Butacas: ${ticket.seats?.join(', ')}`
            };

            try {
                await Calendar.createEventAsync(defaultCalendar.id, eventDetails);
                Alert.alert('¡Todo listo!', 'Se ha añadido un evento a tu calendario');
            } catch (error) {
                console.error('Error creando evento en calendario:', error);
                Alert.alert('¡Ups!', 'Ha ocurrido un error intentando añadir un evento a tu calendario');
            }
        } else {
            Alert.alert('Permisos insuficientes', 'Debes dar permisos a la aplicación para poder añadir eventos al calendario');
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-gray-900">
            {tickets.length === 0 ? (
                <View className="flex-1 justify-center items-center px-6">
                    <Text className="text-white text-lg text-center">
                        Aún no has comprado entradas para ninguna película
                    </Text>
                </View>
            ) : (
                <ScrollView className="flex-1 px-4 py-6">
                    <Text className="text-3xl font-bold text-white mb-6 text-center">Mis Tickets</Text>

                    {tickets.map((ticket) => (
                        <View key={ticket.id}>
                            {/* Vista oculta del QR para capturarlo */}
                            <View style={{ position: 'absolute', left: -9999 }}>
                                <ViewShot
                                    ref={(ref) => qrRefs.current[ticket.id] = ref}
                                    options={{ format: 'png', quality: 1.0 }}
                                >
                                    <View style={{ backgroundColor: 'white', padding: 40, alignItems: 'center', width: 400 }}>
                                        <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 10, color: '#000', textAlign: 'center' }}>
                                            {ticket.movieTitle}
                                        </Text>
                                        <Text style={{ fontSize: 16, marginBottom: 5, color: '#333' }}>
                                            {ticket.room} - {ticket.time}
                                        </Text>
                                        <Text style={{ fontSize: 16, marginBottom: 30, color: '#333' }}>
                                            {ticket.date}
                                        </Text>
                                        <QRCode
                                            value={`ticket-${ticket.id}-${Math.random().toString(36).substring(7)}`}
                                            size={250}
                                        />
                                        <Text style={{ fontSize: 14, marginTop: 30, color: '#666', textAlign: 'center' }}>
                                            Butacas: {ticket.seats?.join(', ')}
                                        </Text>
                                    </View>
                                </ViewShot>
                            </View>

                            {/* Tarjeta del ticket visible */}
                            <View
                                className="bg-gray-900 rounded-lg mb-4 overflow-hidden"
                                style={{
                                    borderWidth: 0.5,
                                    borderColor: 'white',
                                }}
                            >
                                <View className="p-4">
                                    <Text className="text-xl px-4 py-4 font-bold text-white">
                                        {ticket.movieTitle}
                                    </Text>
                                    <View className="px-4 border-t border-gray-600">
                                        <Text className="text-gray-300 mb-2">
                                            📅 {ticket.date}
                                        </Text>
                                        <Text className="text-gray-300 mb-2">
                                            🕐 {ticket.time}
                                        </Text>
                                        <Text className="text-gray-300 mb-2">
                                            🎭 {ticket.room}
                                        </Text>
                                        <Text className="text-gray-300 mb-2">
                                            💺 Butacas (F-C): {ticket.seats.join(', ')}
                                        </Text>
                                    </View>

                                    {/* Botones de acción */}
                                    <View className="flex-row items-center py-4 border-t border-gray-600 px-4" style={{ gap: 20 }}>
                                        <Pressable
                                            onPress={() => handleSMSTicket(ticket.id)}
                                            className="p-2"
                                        >
                                            <Ionicons name="chatbubble-outline" size={26} color="#3b82f6" />
                                        </Pressable>

                                        <Pressable
                                            onPress={() => handleShareTicket(ticket)}
                                            className="p-2"
                                        >
                                            <Ionicons name="share-social-outline" size={26} color="#3b82f6" />
                                        </Pressable>

                                        <Pressable
                                            onPress={() => handleQRCode(ticket)}
                                            className="p-2"
                                        >
                                            <Ionicons name="qr-code-outline" size={26} color="#3b82f6" />
                                        </Pressable>

                                        <Pressable
                                            onPress={() => handleCreateCalendarEvent(ticket)}
                                            className="p-2"
                                        >
                                            <Ionicons name="calendar-outline" size={26} color="#3b82f6" />
                                        </Pressable>
                                    </View>
                                </View>
                            </View>
                        </View>
                    ))}
                </ScrollView>
            )}

            {/* Modal para mostrar el código QR */}
            <Modal
                animationType="slide"
                transparent={false}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(false)}
            >
                <View className="flex-1 justify-center items-center bg-white w-full">
                    <View
                        className="items-center py-10 px-8 w-3/4 rounded-lg"
                        style={{
                            borderWidth: 1,
                            borderColor: '#1e2540'
                        }}
                    >
                        {selectedTicket && (
                            <View className="mb-10 items-center w-full">
                                <Text className="text-lg font-bold text-center text-gray-900" numberOfLines={1} adjustsFontSizeToFit>
                                    {selectedTicket.movieTitle}
                                </Text>
                                <Text className="text-sm text-center mt-2 text-gray-700">
                                    {selectedTicket.room} - {selectedTicket.time}
                                </Text>
                                <View className="mt-2">
                                    <Text className="text-lg text-center font-semibold text-gray-900">Asientos:</Text>
                                    {selectedTicket.seats.map((seat, i) => (
                                        <Text key={i} className="text-base text-center text-gray-700">{seat}</Text>
                                    ))}
                                </View>
                            </View>
                        )}
                        <QRCode value={qrCodeValue} size={200} />

                        <View className="mt-10">
                            <Pressable onPress={() => setModalVisible(false)}>
                                <Ionicons name="chevron-down-outline" size={40} color="#1e2540" />
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </SafeAreaView>
    );
};

export default AllTicketsScreen;

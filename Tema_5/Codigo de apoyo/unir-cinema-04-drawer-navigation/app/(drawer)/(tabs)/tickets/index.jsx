import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useMoviesContext } from '../../../../context/MoviesContext';

const TicketsScreen = () => {
    const { tickets } = useMoviesContext();

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
                        <View
                            key={ticket.id}
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
                            </View>
                        </View>
                    ))}
                </ScrollView>
            )}
        </SafeAreaView>
    );
};

export default TicketsScreen;

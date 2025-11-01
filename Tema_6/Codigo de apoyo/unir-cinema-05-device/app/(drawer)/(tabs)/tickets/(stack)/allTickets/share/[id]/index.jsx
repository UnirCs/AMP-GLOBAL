import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, Pressable, Alert } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useMoviesContext } from '../../../../../../../../context/MoviesContext';
import * as Contacts from 'expo-contacts';
import * as SMS from 'expo-sms';
import { Ionicons } from '@expo/vector-icons';

const ShareTicketsScreen = () => {
    const { tickets } = useMoviesContext();
    const [contacts, setContacts] = useState([]);
    const [search, setSearch] = useState('');
    const [filteredContacts, setFilteredContacts] = useState([]);
    const { id } = useLocalSearchParams();

    useEffect(() => {
        (async () => {
            const { status } = await Contacts.requestPermissionsAsync();
            if (status === 'granted') {
                const { data } = await Contacts.getContactsAsync({
                    fields: [Contacts.Fields.PhoneNumbers],
                });

                if (data.length > 0) {
                    // Filtramos los contactos que no tengan número de teléfono
                    const validContacts = data.filter(contact => contact.phoneNumbers && contact.phoneNumbers.length > 0);
                    setContacts(validContacts);
                    setFilteredContacts(validContacts);
                }
            } else {
                Alert.alert('Permisos insuficientes', 'Debes dar permisos a la aplicación para acceder a tus contactos');
            }
        })();
    }, []);

    useEffect(() => {
        setFilteredContacts(
            contacts.filter(contact =>
                contact.name && contact.name.toLowerCase().includes(search.toLowerCase())
            )
        );
    }, [search, contacts]);

    const handleShareTicket = async (contact) => {
        const ticket = tickets.find(ticket => id == ticket.id);
        if (contact.phoneNumbers && contact.phoneNumbers.length > 0) {
            const isAvailable = await SMS.isAvailableAsync();
            if (isAvailable) {
                await SMS.sendSMSAsync(
                    [contact.phoneNumbers[0].number],
                    `¡Recuerda que nos vemos el ${ticket.date} a las ${ticket.time} para ver ${ticket.movieTitle}!`,
                );
            } else {
                Alert.alert('Error', 'No es posible enviar SMS desde este dispositivo');
            }
        } else {
            Alert.alert('Error', 'Este contacto no tiene número de teléfono');
        }
    };

    const renderContact = ({ item }) => (
        <View
            className="mb-4 bg-gray-800 flex-row justify-between items-center"
            style={{
                borderWidth: 1,
                borderColor: '#374151',
                padding: 16
            }}
        >
            <View className="flex-1">
                <Text className="text-lg font-bold text-white mb-1">{item.name}</Text>
                {item.phoneNumbers && item.phoneNumbers.length > 0 && (
                    <Text className="text-base text-white">{item.phoneNumbers[0].number}</Text>
                )}
            </View>
            <Pressable onPress={() => handleShareTicket(item)} className="p-2">
                <Ionicons name="chatbubble-outline" size={28} color="#3b82f6" />
            </Pressable>
        </View>
    );

    return (
        <View className="flex-1 bg-gray-900">
            {/* Barra de búsqueda */}
            <View style={{ paddingHorizontal: 16, paddingTop: 24, paddingBottom: 20 }}>
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: '#4b5563',
                    paddingHorizontal: 16,
                    paddingVertical: 16,
                    borderWidth: 1,
                    borderColor: '#6b7280'
                }}>
                    <Ionicons name="search-outline" size={22} color="#9ca3af" />
                    <TextInput
                        placeholder="Buscar contactos"
                        placeholderTextColor="#9ca3af"
                        value={search}
                        onChangeText={setSearch}
                        style={{
                            flex: 1,
                            marginLeft: 12,
                            color: '#ffffff',
                            fontSize: 16
                        }}
                        autoFocus={true}
                    />
                </View>
            </View>

            {/* Lista de contactos con margen */}
            <FlatList
                data={filteredContacts}
                keyExtractor={(item) => item.id}
                renderItem={renderContact}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
                keyboardShouldPersistTaps="handled"
                ListEmptyComponent={
                    <View className="justify-center items-center mt-10">
                        <Text className="text-gray-400 text-center">
                            {contacts.length === 0 ? 'No se encontraron contactos' : 'No hay resultados para tu búsqueda'}
                        </Text>
                    </View>
                }
            />
        </View>
    );
};

export default ShareTicketsScreen;

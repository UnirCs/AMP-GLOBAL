import React from 'react';
import {Image, View, Text, Pressable, Alert} from "react-native";
import {DrawerContentScrollView, DrawerItemList} from "@react-navigation/drawer";
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const CustomDrawer = (props) => {
    const { user, signOut } = useAuth();
    const router = useRouter();

    const handleSignOut = async () => {
        Alert.alert(
            'Cerrar sesión',
            '¿Estás seguro de que quieres cerrar sesión?',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel'
                },
                {
                    text: 'Cerrar sesión',
                    style: 'destructive',
                    onPress: async () => {
                        const result = await signOut();
                        if (result.success) {
                            router.replace('/home');
                        }
                    }
                }
            ]
        );
    };

    return (
        <DrawerContentScrollView scrollEnabled={true}>
            <View className="flex justify-center items-center mx-3, p-10 mb-10 h-[150px] bg-unirLogoBg rounded-md">
                <View className="flex-1 w-full h-fit items-center self-center absolute">
                    <Image
                        source={{uri: 'https://pbs.twimg.com/profile_images/1665712824541143042/RtnpwzJp_400x400.png'}}
                        style={{
                            width: 150,
                            height: 100,
                            backgroundColor: '#0096c3',
                        }}
                    />
                </View>
            </View>

            {/* Información del usuario */}
            {user && (
                <View className="px-4 pb-4 mb-4 border-b border-gray-300">
                    <View className="flex-row items-center mb-2">
                        <View className="w-10 h-10 rounded-full bg-blue-500 items-center justify-center">
                            <Text className="text-white font-bold text-lg">
                                {user.displayName ? user.displayName[0].toUpperCase() : 'U'}
                            </Text>
                        </View>
                        <View className="ml-3 flex-1">
                            <Text className="font-bold text-gray-900" numberOfLines={1}>
                                {user.displayName}
                            </Text>
                            <Text className="text-sm text-gray-600" numberOfLines={1}>
                                {user.email}
                            </Text>
                        </View>
                    </View>
                </View>
            )}

            <DrawerItemList {...props} />

            {/* Botón de cerrar sesión */}
            {user && (
                <View className="px-4 pt-4 mt-4 border-t border-gray-300">
                    <Pressable
                        onPress={handleSignOut}
                        className="flex-row items-center py-3 px-2 active:bg-gray-100 rounded-md"
                    >
                        <Ionicons name="log-out-outline" size={24} color="#ef4444" />
                        <Text className="ml-8 text-red-500 font-semibold">
                            Cerrar sesión
                        </Text>
                    </Pressable>
                </View>
            )}
        </DrawerContentScrollView>
    );
}

export default CustomDrawer;
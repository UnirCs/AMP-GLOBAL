import React from 'react';
import {Drawer} from "expo-router/drawer";
import {Ionicons} from "@expo/vector-icons";
import CustomDrawer from "../../components/CinemDrawer";
import { MoviesProvider } from "../../context/MoviesContext";

const DrawerLayout = () => {

    return (
        <MoviesProvider>
            <Drawer
                drawerContent = {CustomDrawer}
                screenOptions={{
                    overlayColor: 'rgba(0,0,0,0.4)',
                    drawerActiveTintColor: '#427787',
                    headerShadowVisible: false,
                    headerShown: false,
                    sceneContainerStyle: {
                        backgroundColor: 'transparent'
                    }
                }}
            >
                <Drawer.Screen
                    name="(tabs)" //Este es el nombre de la página y debe coincidir con la url desde la raíz
                    options={{
                        drawerLabel: 'Inicio',
                        title: 'Inicio',
                        drawerIcon: () => <Ionicons name="home-outline" size={24} color="black"/>
                    }}
                />
                <Drawer.Screen
                    name="about/index"
                    options={{
                        drawerLabel: 'Sobre nosotros',
                        title: 'Sobre nosotros',
                        drawerIcon: () => <Ionicons name="people-outline" size={24} color="black"/>
                    }}
                />
            </Drawer>
        </MoviesProvider>
    );
}

export default DrawerLayout;

import { Tabs } from "expo-router";
import { Ionicons } from '@expo/vector-icons';
import { MoviesProvider } from '../../../context/MoviesContext';

const TabsLayout = () => {
    return (
        <MoviesProvider>
            <Tabs
                screenOptions={{
                    headerShown: false,
                    tabBarStyle: {
                        backgroundColor: "#1e2540",
                        borderTopColor: "#374151",
                    },
                    tabBarActiveTintColor: "#3b82f6",
                    tabBarInactiveTintColor: "#9ca3af",
                }}
            >
                <Tabs.Screen
                    name="(stack)"
                    options={{
                        title: "Home",
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="home" size={size} color={color} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="tickets"
                    options={{
                        title: "Tickets",
                        tabBarIcon: ({ color, size }) => (
                            <Ionicons name="ticket" size={size} color={color} />
                        ),
                    }}
                />
            </Tabs>
        </MoviesProvider>
    );
};

export default TabsLayout;

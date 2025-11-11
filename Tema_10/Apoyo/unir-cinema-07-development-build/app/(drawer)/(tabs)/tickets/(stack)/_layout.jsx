import { Stack } from "expo-router";

const StackLayout = () => {
    return (
        <Stack
            screenOptions={{
                headerShown: true,
                headerShadowVisible: false,
                headerStyle: {
                    backgroundColor: "#131827",
                },
                headerTintColor: "#fff",
                headerTitleStyle: {
                    fontWeight: "bold",
                }
            }}
        >
            <Stack.Screen
                name="allTickets/index"
                options={{
                    title: "Mis Entradas",
                }}
            />
            <Stack.Screen
                name="allTickets/share/[id]/index"
                options={{
                    title: `Compartir entrada`,
                    headerBackTitle: "Entradas"
                }}
            />
        </Stack>
    );
};

export default StackLayout;


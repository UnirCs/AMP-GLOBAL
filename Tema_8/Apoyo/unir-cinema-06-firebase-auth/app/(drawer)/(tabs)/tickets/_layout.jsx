import { Stack } from "expo-router";

const TicketsLayout = () => {
    return (
        <Stack
            screenOptions={{
                headerShown: false
            }}
        >
            <Stack.Screen name="(stack)" options={{ headerShown: false }} />
        </Stack>
    );
};

export default TicketsLayout;

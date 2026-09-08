import { Stack } from "expo-router";

const StackLayout = () => {

    return (
        <Stack
            screenOptions={{
                headerShown: true,
                headerShadowVisible: true,
                headerStyle: {backgroundColor: "#131827",},
                headerTintColor: "white",
                headerBackTitle: "Atrás",
                headerBackVisible: true
                //headerTitleStyle: {fontWeight: "bold",},
            }}
        >

            <Stack.Screen name="landing/index" options={({route}) => ({
                title: `Home`,
                //animation: "fade_from_bottom"
            })}>
            </Stack.Screen>
            <Stack.Screen name="landing/movies/[idMovie]/index" options={({route}) => ({
                title: `Detalles de la película`,
                //animation: "fade_from_bottom"
            })}>
            </Stack.Screen>
            <Stack.Screen name="landing/movies/[idMovie]/booking/[idSession]/index" options={({route}) => ({
                title: `Selecciona tus asientos`,
                //animation: "fade_from_bottom"
            })}>
            </Stack.Screen>
        </Stack>
    )
}

export default StackLayout;
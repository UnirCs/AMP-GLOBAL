import {router, Stack, useNavigation} from "expo-router";
import { MoviesProvider } from '../../context/MoviesContext';
import {Ionicons} from "@expo/vector-icons";
import {Pressable} from "react-native";

const StackLayout = () => {

    const navigation = useNavigation();
    const onHeaderLeftPress = (canGoBack) => {
        if (canGoBack) {
            router.back();
        }
    }

    return (
        <MoviesProvider>
            <Stack
                screenOptions={{
                    headerShown: true,
                    headerShadowVisible: true,
                    contentStyle: {backgroundColor: "white"}, //Prueba a cambiar el color de fondo, veras que pasa
                    headerStyle: {backgroundColor: "#131827",},
                    headerTintColor: "white",
                    headerBackTitleVisible: false,
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
        </MoviesProvider>
    )
}

export default StackLayout;
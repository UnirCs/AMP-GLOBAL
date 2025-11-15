import './global.css';
import HomeView from './views/HomeView';
import {SafeAreaProvider, SafeAreaView} from "react-native-safe-area-context";
import {StatusBar} from "react-native";

export default function App() {
    return (
        <SafeAreaProvider>
            <SafeAreaView className="flex-1 bg-gray-900">
                <StatusBar barStyle="light-content"/>
                <HomeView/>
            </SafeAreaView>
        </SafeAreaProvider>
    )
}

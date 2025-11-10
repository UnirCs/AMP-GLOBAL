import './global.css';
import HomeView from './views/HomeView';
import {SafeAreaView} from "react-native-safe-area-context";
import {StatusBar} from "react-native";

export default function App() {
    return (
        <SafeAreaView className="flex-1 bg-gray-900">
            <StatusBar barStyle="light-content" />
            <HomeView/>
        </SafeAreaView>
    )
}

import {StatusBar} from 'expo-status-bar';
import {StyleSheet} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from "react-native-safe-area-context";
import WebView from "react-native-webview";

export default function EmptyApp() {
    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <WebView source={{uri: 'https://unir-cinema-react.vercel.app'}}/>
                <StatusBar style="auto" />
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});


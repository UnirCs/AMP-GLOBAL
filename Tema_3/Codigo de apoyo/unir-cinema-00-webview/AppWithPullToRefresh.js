import {StatusBar} from 'expo-status-bar';
import {StyleSheet, View, Pressable, Text, RefreshControl, ScrollView} from 'react-native';
import {SafeAreaView, SafeAreaProvider} from "react-native-safe-area-context";
import WebView from "react-native-webview";
import {useRef, useState} from 'react';
import * as Haptics from 'expo-haptics';

export default function AppWithPullToRefresh() {
    const webViewRef = useRef(null);
    const [canGoBack, setCanGoBack] = useState(false);
    const [canGoForward, setCanGoForward] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    const handleNavigationStateChange = (navState) => {
        setCanGoBack(navState.canGoBack);
        setCanGoForward(navState.canGoForward);
    };

    const goBack = () => {
        if (webViewRef.current && canGoBack) {
            webViewRef.current.goBack();
        }
    };

    const goForward = () => {
        if (webViewRef.current && canGoForward) {
            webViewRef.current.goForward();
        }
    };

    const reload = () => {
        if (webViewRef.current) {
            webViewRef.current.reload();
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
        if (webViewRef.current) {
            webViewRef.current.reload();
        }
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        // Simular un pequeño delay para mejor UX
        setTimeout(() => {
            setRefreshing(false);
        }, 1000);
    };

    return (
        <SafeAreaProvider>
            <SafeAreaView style={styles.container}>
                <ScrollView
                    contentContainerStyle={styles.scrollViewContent}
                    refreshControl={
                        <RefreshControl
                            refreshing={refreshing}
                            onRefresh={onRefresh}
                            tintColor="#007AFF"
                            title="Recargando..."
                        />
                    }
                >
                    <WebView
                        ref={webViewRef}
                        source={{uri: 'https://unir-cinema-react.vercel.app'}}
                        onNavigationStateChange={handleNavigationStateChange}
                        style={styles.webView}
                        onLoadEnd={() => setRefreshing(false)}
                        startInLoadingState={false}
                        renderLoading={() => null}
                    />
                </ScrollView>

                <View style={styles.navigationBar}>
                    <Pressable
                        onPress={goBack}
                        style={[styles.button, !canGoBack && styles.buttonDisabled]}
                        disabled={!canGoBack}
                    >
                        <Text style={[styles.buttonText, !canGoBack && styles.buttonTextDisabled]}>
                            ← Atrás
                        </Text>
                    </Pressable>
                    <Pressable
                        onPress={reload}
                        style={styles.button}
                    >
                        <Text style={styles.buttonText}>⟳ Recargar</Text>
                    </Pressable>
                    <Pressable
                        onPress={goForward}
                        style={[styles.button, !canGoForward && styles.buttonDisabled]}
                        disabled={!canGoForward}
                    >
                        <Text style={[styles.buttonText, !canGoForward && styles.buttonTextDisabled]}>
                            Adelante →
                        </Text>
                    </Pressable>
                </View>
                <StatusBar style="auto" />
            </SafeAreaView>
        </SafeAreaProvider>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        flex: 1,
    },
    scrollViewContent: {
        flex: 1,
    },
    webView: {
        flex: 1,
    },
    navigationBar: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        paddingVertical: 12,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
    },
    button: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        backgroundColor: '#007AFF',
        borderRadius: 8,
        minWidth: 100,
        alignItems: 'center',
    },
    buttonDisabled: {
        backgroundColor: '#ccc',
    },
    buttonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: '600',
    },
    buttonTextDisabled: {
        color: '#999',
    },
});

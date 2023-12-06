import React from 'react'
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack, } from 'expo-router';
import { useEffect } from 'react';
import { AuthProvider } from '../utils/auth' 
export {
    // Catch any errors thrown by the Layout component.
    ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
    // Ensure that reloading on `/modal` keeps a back button present.
    initialRouteName: '(tabs)',
};

import { ThemeColors } from '../COLORS';
import { ChatProvider } from '../utils/chat';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();


export default function RootLayout() {
    const [loaded, error] = useFonts({
        SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
        ...FontAwesome.font,
    });

    // Expo Router uses Error Boundaries to catch errors in the navigation tree.
    useEffect(() => {
        if (error) throw error;
    }, [error]);

    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);

    if (!loaded) {
        return null;
    }

    return <RootLayoutNav />;
}

function RootLayoutNav() {
    return (
        <AuthProvider>
            <ChatProvider>
                <ThemeProvider value={ThemeColors}>
                    <Stack initialRouteName='index'>
                        <Stack.Screen name="(tabs)" options={{ headerShown: false,  }} />
                        <Stack.Screen name="TripInfo" options={{ presentation: 'modal', title: "Trip Information" }} />
                        <Stack.Screen name="BookRequest" options={{ presentation: 'modal', title: "Booking Request" }} />
                    </Stack>
                </ThemeProvider>
            </ChatProvider>
        </AuthProvider>
    );
}

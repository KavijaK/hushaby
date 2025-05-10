import React, { useCallback } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import {
  Poppins_100Thin,
  Poppins_200ExtraLight,
  Poppins_300Light,
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";
import AuthNavigator from "./navigation/AuthNavigator";
import AppNavigator from "./navigation/AppNavigator";
import { AuthProvider, useAuth } from "./context/AuthContext";

// Keep splash screen visible
SplashScreen.preventAutoHideAsync();

const RootNavigation = () => {
  const { user, loading } = useAuth();

  if (loading) return null; // You can add a spinner if you want

  return user ? <AppNavigator /> : <AuthNavigator />;
};

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    Poppins_100Thin,
    Poppins_200ExtraLight,
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer onReady={onLayoutRootView}>
          <RootNavigation />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}

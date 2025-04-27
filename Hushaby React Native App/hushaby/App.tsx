import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator} from '@react-navigation/native-stack';
import GetStartedScreen from './screens/GetStartedScreen';
import LoginScreen from './screens/LoginScreen';
import DashboardScreen from './screens/DashboardScreen';
import RegisterScreen from './screens/RegisterScreen';
import { Poppins_100Thin, Poppins_200ExtraLight, Poppins_300Light, Poppins_400Regular, Poppins_500Medium, Poppins_700Bold, useFonts } from '@expo-google-fonts/poppins';
import { Poppins_600SemiBold } from './node_modules/@expo-google-fonts/poppins/600SemiBold/index';
import { useCallback } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

const Stack = createNativeStackNavigator();

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();


export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    Poppins_100Thin,
    Poppins_200ExtraLight,
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold
  });
  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded || fontError) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }
  return (
    <SafeAreaProvider>  
      {/* <NavigationContainer onReady={onLayoutRootView}>
      <Stack.Navigator initialRouteName="GetStarted" screenOptions={{
        headerShown: false,
        gestureEnabled: true,
      }}>
        <Stack.Screen
          name="GetStarted"
          component={GetStartedScreen}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
        />
        <Stack.Screen
          name="Dashboard"
          component={DashboardScreen}
          options={{ title: 'Dashboard' }}
        />
      </Stack.Navigator>
    </NavigationContainer> */}
    <DashboardScreen/>
    </SafeAreaProvider>

  );
}
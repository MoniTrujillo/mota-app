import "./global.css";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context"; 
import { useState } from "react";
import { Dimensions } from "react-native";
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  Easing
} from "react-native-reanimated";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import LoginScreen from "./components/LoginScreen";
import HomeScreen from "./components/HomeScreen";
import AdminScreen from "./components/AdminScreen"; 
import LoadingScreen from "./components/LoadingScreen";
import OrderConfirmationScreen from "./components/screens/SavedOrderConfirmationScreen";
import ModifiedOrderConfirmationScreen from "./components/screens/ModifiedOrderConfirmationScreen";
import ShippingDataScreen from "./components/screens/shippingDataScreen";
function MainApp() {
  const { isAuthenticated, user } = useAuth();
  
  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      {isAuthenticated ? (
        user?.id_area === 1 ? <AdminScreen /> : <HomeScreen />
      ) : (
        <AdminScreen />
      )}
    </SafeAreaProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}

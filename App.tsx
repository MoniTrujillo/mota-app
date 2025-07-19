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
import RegisterScreen from "./components/RegisterScreen";
import HomeScreen from "./components/HomeScreen";
import AdminScreen from "./components/AdminScreen"; 


const { width } = Dimensions.get('window');

// Componente interno que usa el contexto de autenticación
function AppContent() {
  // const { isAuthenticated } = useAuth();
  // const [currentScreen, setCurrentScreen] = useState('Login');
  // const translateX = useSharedValue(0);

  // // Si está autenticado, mostrar HomeScreen
  // if (isAuthenticated) {
  //   return <HomeScreen />;
  // }

  // const navigation = {
  //   navigate: (screenName: string) => {
  //     if (screenName === 'RegisterScreen' && currentScreen === 'Login') {
  //       // Slide to left (register)
  //       translateX.value = withTiming(-width, {
  //         duration: 300,
  //         easing: Easing.out(Easing.quad)
  //       });
  //     } else if (screenName === 'Login' && currentScreen === 'RegisterScreen') {
  //       // Slide to right (login)
  //       translateX.value = withTiming(0, {
  //         duration: 300,
  //         easing: Easing.out(Easing.quad)
  //       });
  //     }
  //     setCurrentScreen(screenName);
  //   }
  // };

  // const containerStyle = useAnimatedStyle(() => {
  //   return {
  //     transform: [{ translateX: translateX.value }],
  //   };
  // });

  // return (
  //   <Animated.View 
  //     style={[
  //       { 
  //         flexDirection: 'row', 
  //         width: width * 2,
  //         height: '100%'
  //       }, 
  //       containerStyle
  //     ]}
  //   >
  //     {/* Login Screen */}
  //     <Animated.View style={{ width }}>
  //       <LoginScreen navigation={navigation} />
  //     </Animated.View>
      
  //     {/* Register Screen */}
  //     <Animated.View style={{ width }}>
  //       <RegisterScreen navigation={navigation} />
  //     </Animated.View>
  //   </Animated.View>
  // );
}

// export default function App() {
//   return (
//     <AuthProvider>
//       <SafeAreaProvider>
//         <StatusBar style="auto" />
//         {/* <AppContent /> */}
//       </SafeAreaProvider>
//     </AuthProvider>
//   );
// }
export default function App() {
  return (
    <AuthProvider>
      <SafeAreaProvider>
        <StatusBar style="auto" />
        <AdminScreen />  {/* ← Aquí muestras tu menú lateral animado */}
      </SafeAreaProvider>
    </AuthProvider>
  );
}

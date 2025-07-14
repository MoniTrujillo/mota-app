import "./global.css";
import { StatusBar } from "expo-status-bar";
import { SafeAreaProvider } from "react-native-safe-area-context"; 
import LoginScreen from "./components/LoginScreen";
// import RegisterScreen from "./components/RegisterScreen";

export default function App() {
  return (
    <SafeAreaProvider>
      <StatusBar style="auto" />
      <LoginScreen />
      {/* <RegisterScreen /> */}
    </SafeAreaProvider>
  );
}

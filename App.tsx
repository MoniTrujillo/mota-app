import "./global.css";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
// import LoginScreen from "./components/LoginScreen";
import RegisterScreen from "./components/RegisterScreen"; 

export default function App() {
  return (
    <View className="flex-1 bg-white">
      <StatusBar style="auto" />
          {/* <LoginScreen /> */}
      <RegisterScreen />
    </View>
  );
}


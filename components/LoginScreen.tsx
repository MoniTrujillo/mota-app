import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Keyboard,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "../contexts/AuthContext";

export default function LoginScreen({ navigation }: { navigation?: any }) {
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuth();
  const passwordInputRef = useRef<TextInput>(null);

  const handleLogin = async () => {
    try {
      // Validaciones básicas
      if (!correo.trim()) {
        Alert.alert("Error", "Por favor ingresa tu correo");
        return;
      }
      if (!password.trim()) {
        Alert.alert("Error", "Por favor ingresa tu contraseña");
        return;
      }

      // Intentar login - convertir correo a minúsculas para evitar errores
      const success = await login(correo.trim().toLowerCase(), password.trim());

      if (!success) {
        Alert.alert("Error", "Correo o contraseña incorrectos");
      }
      // Si success es true, el AuthContext cambiará isAuthenticated a true
      // y App.tsx automáticamente mostrará HomeScreen
    } catch (error) {
      Alert.alert("Error", "Error al iniciar sesión. Intenta nuevamente.");
    }
  };
  return (
    <SafeAreaView className="flex-1 bg-background-color">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="flex-1"
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : -150}
      >
        <View className="flex-1 items-center justify-center px-6">
          {/* Logo */}
          <Image
            source={require("../assets/logo_mota.png")}
            className="w-16 h-16 mb-3"
            resizeMode="contain"
          />

          {/* Título MOTA */}
          <Text className="text-primary-color text-heading-xl font-bold mb-2">
            MOTA
          </Text>

          {/* Subtítulo Iniciar Sesión */}
          <View className="w-full items-center">
            <Text className="text-title-color text-heading-lg font-semibold mb-8">
              Iniciar Sesión
            </Text>

            {/* Campo correo */}
            <View className="w-full max-w-xs mb-6">
              <Text className="text-label font-bold text-black mb-2">
                correo
              </Text>
              <TextInput
                className="bg-input-color rounded-md px-4 py-3 text-black text-base"
                placeholder="Correo electrónico"
                placeholderTextColor="#555"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                value={correo}
                onChangeText={(text) => setCorreo(text.toLowerCase())}
              />
            </View>

            {/* Campo contraseña */}
            <View className="w-full max-w-xs mb-10">
              <Text className="text-label font-bold text-black mb-2">
                contraseña
              </Text>
              <View className="relative">
                <TextInput
                  ref={passwordInputRef}
                  className="bg-input-color rounded-md px-4 py-3 pr-12 text-black text-base"
                  placeholder="••••••••"
                  placeholderTextColor="#555"
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                  autoComplete="password"
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3"
                  style={{ padding: 4 }}
                >
                  <Ionicons
                    name={showPassword ? "eye-off-outline" : "eye-outline"}
                    size={24}
                    color="#555"
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Botón Iniciar Sesión */}
            <TouchableOpacity
              className="bg-primary-color px-4 py-3 rounded-md shadow-md w-button-width"
              onPress={handleLogin}
              disabled={isLoading}
            >
              <Text className="text-white text-center font-medium text-base">
                {isLoading ? "Iniciando..." : "Iniciar Sesión"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

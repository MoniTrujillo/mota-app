import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';

export default function LoginScreen({ navigation }: { navigation?: any }) {
  const [correo, setCorreo] = useState('');
  const [password, setPassword] = useState('');
  const { login, isLoading } = useAuth();

  const handleLogin = async () => {
    try {
      // Validaciones básicas
      if (!correo.trim()) {
        Alert.alert('Error', 'Por favor ingresa tu correo');
        return;
      }
      if (!password.trim()) {
        Alert.alert('Error', 'Por favor ingresa tu contraseña');
        return;
      }

      // Intentar login - convertir correo a minúsculas para evitar errores
      const success = await login(correo.trim().toLowerCase(), password.trim());
      
      if (!success) {
        Alert.alert('Error', 'Correo o contraseña incorrectos');
      }
      // Si success es true, el AuthContext cambiará isAuthenticated a true
      // y App.tsx automáticamente mostrará HomeScreen
    } catch (error) {
      Alert.alert('Error', 'Error al iniciar sesión. Intenta nuevamente.');
    }
  };
  return (
    <SafeAreaView className="flex-1 bg-background-color">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <View className="flex-1 items-center px-6 mt-20">
          {/* Logo */}
          <Image
            source={require('../assets/logo_mota.png')}
            className="w-16 h-16 mb-3"
            resizeMode="contain"
          />

          {/* Título MOTA */}
          <Text className="text-primary-color text-heading-xl font-bold mb-2">
            MOTA
          </Text>

          {/* Subtítulo Iniciar Sesión */}
          <View className="w-full items-center mt-16">
            <Text className="text-title-color text-heading-lg font-semibold mb-8">
              Iniciar Sesión
            </Text>

            {/* Campo correo */}
            <View className="w-full max-w-xs mb-6">
              <Text className="text-label font-bold text-black mb-2">correo</Text>
              <TextInput
                className="bg-input-color rounded-md px-4 py-3 text-black text-base"
                placeholder="Correo electrónico"
                placeholderTextColor="#555"
                keyboardType="email-address"
                value={correo}
                onChangeText={setCorreo}
              />
            </View>

            {/* Campo contraseña */}
            <View className="w-full max-w-xs mb-10">
              <Text className="text-label font-bold text-black mb-2">contraseña</Text>
              <TextInput
                className="bg-input-color rounded-md px-4 py-3 text-black text-base"
                placeholder="••••••••"
                placeholderTextColor="#555"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
            </View>

            {/* Botón Iniciar Sesión */}
            <TouchableOpacity 
              className="bg-primary-color px-4 py-3 rounded-md shadow-md w-button-width"
              onPress={handleLogin}
              disabled={isLoading}
            >
              <Text className="text-white text-center font-medium text-base">
                {isLoading ? 'Iniciando...' : 'Iniciar Sesión'}
              </Text>
            </TouchableOpacity>

            {/* Botón Registrarse */}
            <TouchableOpacity 
              className="mt-4"
              onPress={() => navigation?.navigate?.('RegisterScreen')}
            >
              <Text className="text-primary-color font-medium underline">
                ¿No tienes cuenta? Regístrate
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

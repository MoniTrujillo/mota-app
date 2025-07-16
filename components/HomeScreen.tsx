import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';

export default function HomeScreen() {
  const { user, logout } = useAuth();

  return (
    <SafeAreaView className="flex-1 bg-background-color">
      <View className="flex-1 items-center justify-center px-6">
        {/* Logo */}
        <Image
          source={require('../assets/logo_mota.png')}
          className="w-20 h-20 mb-4"
          resizeMode="contain"
        />

        {/* Título MOTA */}
        <Text className="text-primary-color text-heading-xl font-bold mb-8">
          MOTA
        </Text>

        {/* Mensaje de bienvenida */}
        <View className="items-center mb-12">
          <Text className="text-title-color text-heading-lg font-semibold mb-2">
            ¡Bienvenido!
          </Text>
          <Text className="text-black text-lg text-center">
            {user?.nombre_completo}
          </Text>
        </View>

        {/* Información del usuario */}
        <View className="w-full max-w-xs mb-8">
          <View className="bg-white rounded-lg p-4 shadow-sm mb-4">
            <Text className="text-gray-600 text-sm">Correo:</Text>
            <Text className="text-black text-base font-medium">{user?.correo}</Text>
          </View>
          
          <View className="bg-white rounded-lg p-4 shadow-sm mb-4">
            <Text className="text-gray-600 text-sm">Teléfono:</Text>
            <Text className="text-black text-base font-medium">{user?.telefono}</Text>
          </View>

          {user?.telefono_consultorio && (
            <View className="bg-white rounded-lg p-4 shadow-sm mb-4">
              <Text className="text-gray-600 text-sm">Teléfono Consultorio:</Text>
              <Text className="text-black text-base font-medium">{user?.telefono_consultorio}</Text>
            </View>
          )}
        </View>

        {/* Botón Cerrar Sesión */}
        <TouchableOpacity 
          className="bg-red-500 px-6 py-3 rounded-md shadow-md"
          onPress={logout}
        >
          <Text className="text-white text-center font-medium text-base">
            Cerrar Sesión
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

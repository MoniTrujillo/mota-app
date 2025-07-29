import React from 'react';
import {
  View,
  Text,
  Image,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type LoadingScreenProps = {
  message?: string;
};

export default function LoadingScreen({ message = 'Cargando...' }: LoadingScreenProps) {
  return (
    <SafeAreaView className="flex-1 bg-background-color">
      <View className="flex-1 justify-center items-center px-6">
        {/* Logo */}
        <Image
          source={require('../assets/logo_mota.png')}
          className="w-20 h-20 mb-6"
          resizeMode="contain"
        />

        {/* Título MOTA */}
        <Text className="text-primary-color text-heading-xl font-bold mb-8">
          MOTA
        </Text>

        {/* Indicador de carga */}
        <ActivityIndicator size="large" color="#0088cc" className="mb-4" />
        
        {/* Mensaje de carga */}
        <Text className="text-black text-base text-center">
          {message}
        </Text>
      </View>
    </SafeAreaView>
  );
}

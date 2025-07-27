import React from 'react';
import { View, Text } from 'react-native';

export default function DefaultScreen() {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-title-color text-xl font-bold">Selecciona una opción</Text>
      <Text className="text-gray-600 mt-2">Utiliza el menú lateral para navegar</Text>
    </View>
  );
}

import React from 'react';
import { View, Text } from 'react-native';

export default function DefaultScreen() {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-title-color text-xl font-bold">Añade Un Producto</Text>
      <Text className="text-gray-600 mt-2">Completa los siguientes campos:</Text>
    </View>
  );
}

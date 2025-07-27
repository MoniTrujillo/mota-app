import React from 'react';
import { View, Text } from 'react-native';

export default function QualityControlScreen() {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-title-color text-xl font-bold">Control de Calidad</Text>
      <Text className="text-gray-600 mt-2">Supervisión de calidad de pedidos</Text>
    </View>
  );
}

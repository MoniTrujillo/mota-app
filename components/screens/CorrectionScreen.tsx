import React from 'react';
import { View, Text } from 'react-native';

export default function CorrectionScreen() {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-title-color text-xl font-bold">A Corrección</Text>
      <Text className="text-gray-600 mt-2">Pedidos que requieren ajustes</Text>
    </View>
  );
}

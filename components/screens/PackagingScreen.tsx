import React from 'react';
import { View, Text } from 'react-native';

export default function PackagingScreen() {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-title-color text-xl font-bold">Empaque</Text>
      <Text className="text-gray-600 mt-2">Pedidos en proceso de empaque</Text>
    </View>
  );
}

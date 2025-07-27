import React from 'react';
import { View, Text } from 'react-native';

export default function TrackingScreen() {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-title-color text-xl font-bold">Seguimiento</Text>
      <Text className="text-gray-600 mt-2">Seguimiento de pedidos activos</Text>
    </View>
  );
}

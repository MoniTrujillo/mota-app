import React from 'react';
import { View, Text } from 'react-native';

export default function PickupScreen() {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-title-color text-xl font-bold">Para Recoger</Text>
      <Text className="text-gray-600 mt-2">Pedidos listos para ser recogidos</Text>
    </View>
  );
}

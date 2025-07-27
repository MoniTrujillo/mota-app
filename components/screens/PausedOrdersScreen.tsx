import React from 'react';
import { View, Text } from 'react-native';

export default function PausedOrdersScreen() {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-title-color text-xl font-bold">Pedidos en Pausa</Text>
      <Text className="text-gray-600 mt-2">Lista de pedidos actualmente pausados</Text>
    </View>
  );
}

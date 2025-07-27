import React from 'react';
import { View, Text } from 'react-native';

export default function DeliveryScreen() {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-title-color text-xl font-bold">A Domicilio</Text>
      <Text className="text-gray-600 mt-2">Pedidos en ruta para entrega a domicilio</Text>
    </View>
  );
}

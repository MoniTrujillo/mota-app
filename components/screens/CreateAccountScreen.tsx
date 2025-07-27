import React from 'react';
import { View, Text } from 'react-native';

export default function CreateAccountScreen() {
  return (
    <View className="flex-1 items-center justify-center">
      <Text className="text-title-color text-xl font-bold">Crear Cuenta</Text>
      <Text className="text-gray-600 mt-2">Formulario para crear nuevas cuentas</Text>
    </View>
  );
}

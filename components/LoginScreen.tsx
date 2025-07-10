import React from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

export default function LoginScreen() {
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-background-color"
    >
     <View className="flex-1 items-center px-6 mt-20">
  {/* Logo */}
  <Image
    source={require('../assets/logo_mota.png')}
    className="w-16 h-16 mb-3"
    resizeMode="contain"
  />

  {/* Título MOTA */}
  <Text className="text-primary-color text-heading-xl font-bold mb-2">
    MOTA
  </Text>

  {/* Subtítulo Iniciar Sesión */}
  <View className="w-full items-center mt-16">
    <Text className="text-title-color text-heading-lg font-semibold mb-8">
      Iniciar Sesión
    </Text>

    {/* Campo correo */}
    <View className="w-full max-w-xs mb-6">
      <Text className="text-label font-bold text-black mb-2">correo</Text>
      <TextInput
        className="bg-input-color rounded-md px-4 py-3 text-black text-base"
        placeholder="Correo electrónico"
        placeholderTextColor="#555"
        keyboardType="email-address"
      />
    </View>

    {/* Campo contraseña */}
    <View className="w-full max-w-xs mb-10">
      <Text className="text-label font-bold text-black mb-2">contraseña</Text>
      <TextInput
        className="bg-input-color rounded-md px-4 py-3 text-black text-base"
        placeholder="••••••••"
        placeholderTextColor="#555"
        secureTextEntry
      />
    </View>

    {/* Botón */}
    <TouchableOpacity className="bg-primary-color px-4 py-3 rounded-md shadow-md w-button-width">
      <Text className="text-white text-center font-medium text-base">
        Iniciar Sesión
      </Text>
    </TouchableOpacity>
  </View>
</View>




    </KeyboardAvoidingView>
  );
}

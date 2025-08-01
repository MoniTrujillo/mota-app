import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function OrderConfirmationScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background-color">
      <ScrollView
        contentContainerStyle={{
          alignItems: 'center',
          paddingHorizontal: 24,
          paddingTop: 32,
          paddingBottom: 80,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Logo y título */}
        <Image
          source={require('../../assets/logo_mota.png')}
          className="w-16 h-16 mb-3"
          resizeMode="contain"
        />
        <Text className="text-primary-color text-heading-xl font-bold mb-2">MOTA</Text>
        
        {/* Mensaje de confirmación */}
        <Text className="text-title-color text-2xl font-bold mb-4 text-center">
          Pedido modificado correctamente!
        </Text>
        
        <View className="w-full px-1">
          <Text className="text-title-color text-base leading-[20px] text-justify mb-6">
            Se ha registrado y modificado correctamente el pedido. Si todo es correcto, darle a enviar para ser confirmado por el solicitante y el cliente, al momento de ser confirmado, solo se podrá modificar el status del pago.
          </Text>
          
          {/* Separador */}
          <View className="border-t border-input-color my-4 w-full" />

          {/* Botones - Contenedor centrado */}
          <View className="items-center space-y-4 mt-2">
            {/* Botón Ver Detalles */}
            <TouchableOpacity 
              className="bg-sidebar-bg px-6 py-2 rounded-md button-width"
              activeOpacity={0.7}
            >
              <Text className="text-title-color text-center font-medium text-menu">Ver Detalles</Text>
            </TouchableOpacity>
            
            {/* Botón Enviar */}
            <TouchableOpacity 
              className=" bg-primary-color px-14 py-2 rounded-md button-width mt-4"
              activeOpacity={0.7}
            >
              <Text className="text-white text-center font-medium text-menu">Enviar</Text>
            </TouchableOpacity>
            
            {/* Botón Eliminar (solo texto) */}
            <TouchableOpacity 
              className="button-width items-center py-1 mt-4"
              activeOpacity={0.7}
            >
              <Text className="text-primary-color font-medium text-menu underline">Eliminar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
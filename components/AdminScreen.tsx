import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import {
  Ionicons,
  FontAwesome5,
  MaterialCommunityIcons,
  Entypo,
} from '@expo/vector-icons';
import MenuItem from './MenuItem';

const MENU_WIDTH = 250;

export default function AdminScreen() {
  const [menuOpen, setMenuOpen] = useState(false);
  const translateX = useSharedValue(-MENU_WIDTH);

  const toggleMenu = () => {
    translateX.value = withTiming(menuOpen ? -MENU_WIDTH : 0, { duration: 250 });
    setMenuOpen(!menuOpen);
  };

  const animatedMenuStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  return (
    <SafeAreaView className="flex-1 bg-background-color" edges={['top', 'right', 'bottom', 'left']}>
      {/* Menú lateral -  */}
      <Animated.View
        style={[{ position: 'absolute', zIndex: 10, height: '100%', width: MENU_WIDTH, top: 0 }, animatedMenuStyle]}
        className="bg-sidebar-bg px-4 pt-10 pb-10" 
      >
        <ScrollView 
          showsVerticalScrollIndicator={false}
          className="pb-4" // Padding bottom para el scroll
        >
          {/* Logo y título  */}
          <View className="items-center mb-8 mt-12"> 
            <Image
              source={require('../assets/logo_mota.png')}
              className="w-12 h-12"
              resizeMode="contain"
            />
            <Text className="text-primary-color text-heading-xl font-bold mt-2">MOTA</Text>
          </View>

          {/* Menú completo */}
          <View className="space-y-1">
            <MenuItem icon={<Ionicons name="people-outline" size={20} />} label="Ver Usuarios" />
            <MenuItem icon={<Ionicons name="person-add-outline" size={20} />} label="Crear Cuenta" />
            <MenuItem icon={<Ionicons name="cart-outline" size={20} />} label="Crear Pedidos" />
            <MenuItem icon={<Ionicons name="time-outline" size={20} />} label="Seguimiento" />
            
            <View className="border-t border-gray-300 my-3 mx-2"></View>
            
            <Text className="text-title-color font-bold text-sm px-2 py-1">Tabla de pedidos</Text>
            
            <MenuItem icon={<MaterialCommunityIcons name="quality-high" size={20} />} label="Control de Calidad" />
            <MenuItem icon={<Ionicons name="pause-circle-outline" size={20} />} label="Pedidos pausa" />
            <MenuItem icon={<MaterialCommunityIcons name="file-refresh-outline" size={20} />} label="A corrección" />
            <MenuItem icon={<MaterialCommunityIcons name="package-variant" size={20} />} label="Empaque" />
            <MenuItem icon={<Ionicons name="car-outline" size={20} />} label="A domicilio" />
            <MenuItem icon={<Entypo name="shop" size={20} />} label="Para recoger" />
          </View>

          {/* Botón salir con espacio adecuado */}
          <TouchableOpacity className="flex-row items-center bg-menu-active px-4 py-3 mt-8 rounded-md mx-1">
            <Ionicons name="log-out-outline" size={20} color="white" />
            <Text className="text-white ml-2 font-semibold text-sm">Salir</Text>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>

      {/* Overlay */}
      {menuOpen && (
        <TouchableWithoutFeedback onPress={toggleMenu}>
          <View className="absolute inset-0 bg-black/30 z-5" />
        </TouchableWithoutFeedback>
      )}

      {/* Contenido principal */}
      <View className="flex-1 px-4 pt-3">
        <View className="flex-row items-center justify-between pt-2">
          <TouchableOpacity onPress={toggleMenu} className="p-2">
            <Ionicons name="menu" size={24} color="#313E4B" />
          </TouchableOpacity>
          <Text className="text-title-color text-lg font-bold">Pedidos</Text>
          <View className="w-6"></View>
        </View>

        <View className="flex-1 items-center justify-center">
          {/* Contenido adicional puede ir aquí */}
        </View>
      </View>
    </SafeAreaView>
  );
}
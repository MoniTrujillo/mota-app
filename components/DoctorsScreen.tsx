import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { Ionicons } from '@expo/vector-icons';
import MenuItem from './MenuItem';
import { useAuth } from '../contexts/AuthContext';

// Importar los componentes de pantalla
import OrdersDoctorsConfirmScreen from './screens/OrdersDoctorsConfirmScreen';
import DoctorNotificationScreen from './screens/DoctorNotificationScreen';

const MENU_WIDTH = 250;

type Screen = 
  | 'confirmOrders'
  | 'notifications';

export default function DoctorsScreen() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<Screen>('confirmOrders');
  const translateX = useSharedValue(-MENU_WIDTH);
  const insets = useSafeAreaInsets();
  const { logout } = useAuth();

  const toggleMenu = () => {
    translateX.value = withTiming(menuOpen ? -MENU_WIDTH : 0, { duration: 250 });
    setMenuOpen(!menuOpen);
  };

  const handleSelectMenuItem = (screen: Screen) => {
    setCurrentScreen(screen);
    if (menuOpen) {
      toggleMenu();
    }
  };

  const animatedMenuStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  const renderContent = () => {
    switch (currentScreen) {
      case 'confirmOrders':
        return <OrdersDoctorsConfirmScreen />;
      case 'notifications':
        return (
          <DoctorNotificationScreen 
            onNavigateToConfirm={() => handleSelectMenuItem('confirmOrders')} 
          />
        );
      default:
        return <OrdersDoctorsConfirmScreen />;
    }
  };

  const getCurrentTitle = () => {
    switch (currentScreen) {
      case 'confirmOrders': return 'Confirmar Pedidos';
      case 'notifications': return 'Notificaciones';
      default: return 'Panel del Doctor';
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background-color" edges={['top', 'right', 'bottom', 'left']}>
      <TouchableWithoutFeedback disabled={!menuOpen} onPress={menuOpen ? toggleMenu : undefined}>
        <View style={{ flex: 1 }}>
          <View style={{ zIndex: 1 }} className="flex-1 px-4 pt-3">
            <View className="flex-row items-center justify-between pt-2">
              <TouchableOpacity onPress={toggleMenu} className="p-2">
                <Ionicons name="menu" size={24} color="#313E4B" />
              </TouchableOpacity>
              <Text className="text-title-color text-lg font-bold">{getCurrentTitle()}</Text>
              <View className="w-6" />
            </View>

            {renderContent()}
          </View>
        </View>
      </TouchableWithoutFeedback>

      {menuOpen && (
        <TouchableWithoutFeedback onPress={toggleMenu}>
          <View className="absolute inset-0 bg-black/30" style={{ zIndex: 15 }} />
        </TouchableWithoutFeedback>
      )}

      {/* Menú lateral */}
      <Animated.View
        style={[
          { 
            position: 'absolute', 
            zIndex: 20,  
            width: MENU_WIDTH, 
            top: 0,
            left: 0,
            bottom: 0,
            paddingTop: insets.top,
            paddingLeft: insets.left,
            elevation: 5,
          }, 
          animatedMenuStyle
        ]}
        className="bg-sidebar-bg" 
      >
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 80 }}
        >
          <View className="items-center mb-8 mt-12"> 
            <Image
              source={require('../assets/logo_mota.png')}
              className="w-12 h-12"
              resizeMode="contain"
            />
            <Text className="text-primary-color text-heading-xl font-bold mt-2">MOTA</Text>
          </View>

          <View className="space-y-1">
            <MenuItem 
              icon={<Ionicons name="checkmark-circle-outline" size={20} />} 
              label="Confirmar Pedidos"
              onPress={() => handleSelectMenuItem('confirmOrders')}
              active={currentScreen === 'confirmOrders'}
            />
            <MenuItem 
              icon={<Ionicons name="notifications-outline" size={20} />} 
              label="Notificaciones"
              onPress={() => handleSelectMenuItem('notifications')}
              active={currentScreen === 'notifications'}
            />
          </View>
        </ScrollView>

        {/* Botón Salir fijo al fondo */}
        <TouchableOpacity 
          className="flex-row items-center bg-menu-active px-4 py-3 rounded-md mx-2 mb-4"
          onPress={logout}
          style={{
            position: 'absolute',
            bottom: insets.bottom + 10,
            left: 0,
            right: 0,
          }}
        >
          <Ionicons name="log-out-outline" size={20} color="white" />
          <Text className="text-white ml-2 font-semibold text-sm">Salir</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
}

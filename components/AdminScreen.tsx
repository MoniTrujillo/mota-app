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
import {
  Ionicons,
  FontAwesome5,
  MaterialCommunityIcons,
  Entypo,
} from '@expo/vector-icons';
import MenuItem from './MenuItem';
import { useAuth } from '../contexts/AuthContext';

// Importar los componentes de pantalla
import UsersScreen from './screens/UsersScreen';
import CreateAccountScreen from './screens/CreateAccountScreen';
import CreateOrdersScreen from './screens/CreateOrdersScreen';
import TrackingScreen from './screens/TrackingScreen';
import QualityControlScreen from './screens/QualityControlScreen';
import PausedOrdersScreen from './screens/PausedOrdersScreen';
import CorrectionScreen from './screens/CorrectionScreen';
import PackagingScreen from './screens/PackagingScreen';
import DeliveryScreen from './screens/DeliveryScreen';
import PickupScreen from './screens/PickupScreen';
import DefaultScreen from './screens/DefaultScreen';
import AddProductScreen from './screens/AddProductScreen'; // Importar AddProductScreen

const MENU_WIDTH = 250;

// Define los tipos de pantallas disponibles
type Screen = 
  | 'users' 
  | 'createAccount'
  | 'addProduct'
  | 'createOrders'
  | 'tracking'
  | 'qualityControl'
  | 'pausedOrders'
  | 'correction'
  | 'packaging'
  | 'delivery'
  | 'pickup';

export default function AdminScreen() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<Screen>('users');
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

  // Renderiza el contenido según la pantalla seleccionada
  const renderContent = () => {
    switch (currentScreen) {
      case 'users':
        return <UsersScreen />;
      case 'createAccount':
        return <CreateAccountScreen />;
      case 'addProduct':
        return <AddProductScreen />; // Usar AddProductScreen
      case 'createOrders':
        return <CreateOrdersScreen />;
      case 'tracking':
        return <TrackingScreen />;
      case 'qualityControl':
        return <QualityControlScreen />;
      case 'pausedOrders':
        return <PausedOrdersScreen />;
      case 'correction':
        return <CorrectionScreen />;
      case 'packaging':
        return <PackagingScreen />;
      case 'delivery':
        return <DeliveryScreen />;
      case 'pickup':
        return <PickupScreen />;
      default:
        return <DefaultScreen />;
    }
  };

  // Obtener el título según la pantalla actual
  const getCurrentTitle = () => {
    switch (currentScreen) {
      case 'users': return 'Ver Usuarios';
      case 'createAccount': return 'Crear Cuenta';
      case 'addProduct': return 'Añadir Producto';
      case 'createOrders': return 'Crear Pedidos';
      case 'tracking': return 'Seguimiento';
      case 'qualityControl': return 'Control de Calidad';
      case 'pausedOrders': return 'Pedidos en Pausa';
      case 'correction': return 'A Corrección';
      case 'packaging': return 'Empaque';
      case 'delivery': return 'A Domicilio';
      case 'pickup': return 'Para Recoger';
      default: return 'Panel de Administración';
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
              <View className="w-6"></View>
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
            paddingBottom: insets.bottom,
            paddingLeft: insets.left,
            elevation: 5,
          }, 
          animatedMenuStyle
        ]}
        className="bg-sidebar-bg" 
      >
        <ScrollView 
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
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
              icon={<Ionicons name="people-outline" size={20} />} 
              label="Ver Usuarios"
              onPress={() => handleSelectMenuItem('users')}
              active={currentScreen === 'users'}
            />
            <MenuItem 
              icon={<Ionicons name="person-add-outline" size={20} />} 
              label="Crear Cuenta"
              onPress={() => handleSelectMenuItem('createAccount')}
              active={currentScreen === 'createAccount'}
            />
            <MenuItem 
              icon={<Ionicons name="add-circle-outline" size={20} />} 
              label="Añadir Producto"
              onPress={() => handleSelectMenuItem('addProduct')}
              active={currentScreen === 'addProduct'}
            />
            <MenuItem 
              icon={<Ionicons name="cart-outline" size={20} />} 
              label="Crear Pedidos"
              onPress={() => handleSelectMenuItem('createOrders')}
              active={currentScreen === 'createOrders'}
            />
            <MenuItem 
              icon={<Ionicons name="time-outline" size={20} />} 
              label="Seguimiento"
              onPress={() => handleSelectMenuItem('tracking')}
              active={currentScreen === 'tracking'}
            />
            
            <View className="border-t border-gray-300 my-3 mx-2"></View>
            
            <Text className="text-title-color font-bold text-sm px-2 py-1">Tabla de pedidos</Text>
            
            <MenuItem 
              icon={<MaterialCommunityIcons name="quality-high" size={20} />} 
              label="Control de Calidad"
              onPress={() => handleSelectMenuItem('qualityControl')}
              active={currentScreen === 'qualityControl'}
            />
            <MenuItem 
              icon={<Ionicons name="pause-circle-outline" size={20} />} 
              label="Pedidos pausa"
              onPress={() => handleSelectMenuItem('pausedOrders')}
              active={currentScreen === 'pausedOrders'}
            />
            <MenuItem 
              icon={<MaterialCommunityIcons name="file-refresh-outline" size={20} />} 
              label="A corrección"
              onPress={() => handleSelectMenuItem('correction')}
              active={currentScreen === 'correction'}
            />
            <MenuItem 
              icon={<MaterialCommunityIcons name="package-variant" size={20} />} 
              label="Empaque"
              onPress={() => handleSelectMenuItem('packaging')}
              active={currentScreen === 'packaging'}
            />
            <MenuItem 
              icon={<Ionicons name="car-outline" size={20} />} 
              label="A domicilio"
              onPress={() => handleSelectMenuItem('delivery')}
              active={currentScreen === 'delivery'}
            />
            <MenuItem 
              icon={<Entypo name="shop" size={20} />} 
              label="Para recoger"
              onPress={() => handleSelectMenuItem('pickup')}
              active={currentScreen === 'pickup'}
            />
          </View>

          <TouchableOpacity 
            className="flex-row items-center bg-menu-active px-4 py-3 mt-8 rounded-md mx-1"
            onPress={logout}
          >
            <Ionicons name="log-out-outline" size={20} color="white" />
            <Text className="text-white ml-2 font-semibold text-sm">Salir</Text>
          </TouchableOpacity>
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}
import React, { useState } from 'react'; 
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

type OrdersDoctorsConfirmScreenProps = {
  onViewDetails?: (id: string) => void;
  onConfirm?: (id: string) => void;
  onReport?: (id: string) => void;
};

type OrderDetails = {
  clientName: string;
  phone: string;
  email: string;
  requestName: string;
  products: string[];
  priority: string;
  deliveryDate: string;
  status: string;
  price: string;
  details: string;
  designer: string;
};

type Order = {
  id: string;
  status: string;
  confirmed: boolean;
  showDetails?: boolean;
  details?: OrderDetails;
};

export default function OrdersDoctorsConfirmScreen({
  onViewDetails = (id: string) => console.log('Ver detalles', id),
  onConfirm = (id: string) => console.log('Confirmar', id),
  onReport = (id: string) => console.log('Reportar', id),
}: OrdersDoctorsConfirmScreenProps) {
  const [orders, setOrders] = useState<Order[]>([
    { id: '222', status: 'Confirmado', confirmed: true },
    { 
      id: '333', 
      status: 'Pendiente', 
      confirmed: false,
      details: {
        clientName: 'Juan Pérez Ramírez',
        phone: '6433223344',
        email: 'Juan@gmail.com',
        requestName: 'Dra. Karla Méndez',
        products: ['Corona de zirconia cantidad:1', 'Guarda cantidad:1'],
        priority: 'Normal',
        deliveryDate: '28/05/2025',
        status: 'Pendiente',
        price: '$1,350 MXN',
        details: 'Color seleccionado: A2',
        designer: 'Karla Herrera'
      }
    },
    { id: '530', status: 'Confirmado', confirmed: true },
    { 
      id: '690', 
      status: 'Pendiente', 
      confirmed: false,
      details: {
        clientName: 'Juan Pérez Ramírez',
        phone: '6433223344',
        email: 'Juan@gmail.com',
        requestName: 'Dra. Karla Méndez',
        products: ['Corona de zirconia cantidad:1', 'Guarda cantidad:1'],
        priority: 'Normal',
        deliveryDate: '28/05/2025',
        status: 'Pendiente',
        price: '$1,350 MXN',
        details: 'Color seleccionado: A2',
        designer: 'Karla Herrera'
      }
    },
  ]);

  const handleViewDetails = (id: string) => {
    setOrders(orders.map(order => ({
      ...order,
      showDetails: order.id === id ? !order.showDetails : order.showDetails
    })));
  };

  const handleConfirm = (id: string) => {
    setOrders(orders.map(order => 
      order.id === id ? { ...order, confirmed: true, status: 'Confirmado', showDetails: false } : order
    ));
  };

  const handleReport = (id: string) => {
    setOrders(orders.filter(order => order.id !== id));
  };

  return (
    <SafeAreaView className="flex-1 bg-background-color" edges={['top','right','bottom','left']}>
      <View className="flex-1 p-4">
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View className="min-w-[490px] bg-white rounded-lg shadow-md overflow-hidden">
            {/* Header */}
            <View className="flex-row border-b border-gray-300 p-3 bg-sidebar-bg items-center">
              <Text className="w-[90px] pl-1.5 text-title-color font-semibold">Pedido</Text>
              <Text className="w-[150px] text-title-color font-semibold text-center">Trabajo</Text>
              <Text className="w-[150px] text-title-color font-semibold text-center">Estado</Text>
              <Text className="w-[100px] text-title-color font-semibold text-center">Acción</Text>
            </View>

            {/* Filas */}
            <ScrollView className="max-h-[620px]" showsVerticalScrollIndicator>
              {orders.map((order, index) => (
                <View key={`${order.id}-${index}`}>
                  <View className="flex-row items-center border-b border-gray-200 p-4 bg-white">
                    {/* Pedido */}
                    <Text className="w-[90px] pl-1.5 text-title-color">{order.id}</Text>

                    {/* Ver detalles */}
                    <View className="w-[150px] items-center">
                      <TouchableOpacity
                        onPress={() => handleViewDetails(order.id)}
                        activeOpacity={order.confirmed ? 1 : 0.85}
                        disabled={order.confirmed}
                        className={`min-w-[80px] py-1.5 px-2.5 rounded-md items-center justify-center ${
                          order.confirmed ? 'bg-gray-200' : 'bg-primary-color'
                        }`}
                      >
                        <Text className={`font-semibold text-[13px] ${
                          order.confirmed ? 'text-gray-400' : 'text-white'
                        }`}>
                          Ver detalles
                        </Text>
                      </TouchableOpacity>
                    </View>

                    {/* Estado */}
                    <View className="w-[150px] items-center justify-center">
                      <View className="flex-row items-center">
                        <View className={`w-2.5 h-2.5 rounded-full mr-2 ${
                          order.confirmed ? 'bg-green-600' : 'bg-red-500'
                        }`}/>
                        <View className={`px-3 py-1.5 rounded-full ${
                          order.confirmed ? 'bg-green-50' : 'bg-red-50'
                        }`}>
                          <Text className={`text-sm ${
                            order.confirmed ? 'text-green-900' : 'text-red-700'
                          }`}>
                            {order.status}
                          </Text>
                        </View>
                      </View>
                    </View>

                    {/* Acción */}
                    <View className="w-[100px] justify-center items-center">
                      {order.confirmed ? (
                        <Ionicons name="checkmark-circle" size={26} color="#5FA2AD" />
                      ) : (
                        <Ionicons name="time" size={26} color="#5FA2AD" />
                      )}
                    </View>
                  </View>

                  {order.showDetails && order.details && !order.confirmed && (
                    <View className="bg-[#f5f9fa] p-4 border-b border-gray-200">
                      <View className="bg-white p-5 rounded-lg shadow-sm">
                        <Text className="text-base font-semibold text-gray-700 mb-3">
                          DATOS DEL CLIENTE
                        </Text>
                        <Text className="text-title-color">Cliente: {order.details.clientName}</Text>
                        <Text className="text-title-color">Teléfono: {order.details.phone}</Text>
                        <Text className="text-title-color">Correo: {order.details.email}</Text>

                        <Text className="text-base font-semibold text-gray-700 mb-3 mt-5">
                          DATOS DEL PEDIDO
                        </Text>
                        <Text className="text-title-color">Nombre del solicitante: {order.details.requestName}</Text>
                        <Text className="text-title-color">Productos:</Text>
                        {order.details.products.map((product, i) => (
                          <Text key={i} className="text-title-color">- {product}</Text>
                        ))}
                        <Text className="text-title-color">Prioridad: {order.details.priority}</Text>
                        <Text className="text-title-color">Fecha estimada de entrega: {order.details.deliveryDate}</Text>
                        <Text className="text-title-color">Estatus de pago: {order.details.status} ({order.details.price})</Text>
                        <Text className="text-title-color">Detalles del pedido: {order.details.details}</Text>

                        <Text className="text-base font-semibold text-gray-700 mb-3 mt-5">
                          DATOS ADICIONALES
                        </Text>
                        <Text className="text-title-color">Diseño: {order.details.designer}</Text>

                        <View className="flex-row justify-center gap-3 mt-6">
                          <TouchableOpacity
                            className="bg-primary-color py-2.5 px-5 rounded-lg min-w-[120px] items-center"
                            onPress={() => handleConfirm(order.id)}
                          >
                            <Text className="text-white font-semibold">Confirmar</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            className="bg-red-400 py-2.5 px-5 rounded-lg min-w-[120px] items-center"
                            onPress={() => handleReport(order.id)}
                          >
                            <Text className="text-white font-semibold">Reportar error</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  )}
                </View>
              ))}
            </ScrollView>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
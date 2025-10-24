import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import apiService from '../../services/apiService';

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
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);

  // Mapeo de prioridades
  const priorityNames: { [key: number]: string } = {
    1: 'Baja',
    2: 'Normal',
    3: 'Alta',
    4: 'Urgente',
    5: 'Crítica',
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('🔍 Obteniendo todos los pedidos...');
      const response = await apiService.get<any>('/pedidos');
      console.log('✅ Pedidos recibidos:', response);

      // La respuesta tiene la estructura { data: [...], total, page, totalPages }
      const pedidos = response.data || [];

      // Mapear los datos de la API al formato del componente
      const mappedOrders: Order[] = pedidos.map((pedido: any) => {
        const isPaused = pedido.estatus?.n_estatusp?.toLowerCase() === 'pausa';
        
        return {
          id: pedido.id_pedido.toString(),
          status: pedido.estatus?.n_estatusp || 'Pendiente',
          confirmed: !isPaused, // Solo los que NO están en pausa están "confirmados"
          showDetails: false,
          details: {
            clientName: pedido.cliente?.nombre_completo || 'N/A',
            phone: 'N/A', // No viene en la API
            email: 'N/A', // No viene en la API
            requestName: pedido.cliente?.nombre_completo || 'N/A',
            products: [], // Necesitarías hacer GET a /pedidos/{id} para obtener productos
            priority: priorityNames[pedido.id_prioridad] || 'Normal',
            deliveryDate: new Date(pedido.fecha_entrega).toLocaleDateString('es-ES'),
            status: pedido.id_estatuspago === 1 ? 'Pendiente' : 'Pagado',
            price: 'N/A', // No viene en este endpoint, necesitas GET a /pedidos/{id}
            details: pedido.direccion || 'Sin detalles',
            designer: `Diseñador #${pedido.id_disenador}`,
          }
        };
      });
      setOrders(mappedOrders);
    } catch (err: any) {
      console.error('❌ Error al obtener pedidos:', err);
      setError(err.message || 'Error al cargar los pedidos');
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (id: string) => {
    const order = orders.find(o => o.id === id);
    if (order) {
      setSelectedOrderDetails(order);
      setModalVisible(true);
    }
  };

  const handleConfirm = async (id: string) => {
    try {
      // Aquí deberías hacer un PUT/PATCH al endpoint para actualizar el estado
      console.log('Confirmando pedido:', id);
      
      setOrders(orders.map(order => 
        order.id === id ? { ...order, confirmed: true, status: 'Confirmado' } : order
      ));
      
      setModalVisible(false);
      setSelectedOrderDetails(null);
    } catch (err) {
      console.error('Error al confirmar pedido:', err);
    }
  };

  const handleReport = async (id: string) => {
    try {
      // Aquí deberías hacer la llamada a la API para reportar el error
      console.log('Reportando error del pedido:', id);
      
      setOrders(orders.filter(order => order.id !== id));
      
      setModalVisible(false);
      setSelectedOrderDetails(null);
    } catch (err) {
      console.error('Error al reportar pedido:', err);
    }
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-background-color items-center justify-center">
        <ActivityIndicator size="large" color="#5FA2AD" />
        <Text className="text-title-color mt-4">Cargando pedidos...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 bg-background-color items-center justify-center p-4">
        <Ionicons name="alert-circle-outline" size={48} color="#ef4444" />
        <Text className="text-red-500 text-lg mt-4 text-center">{error}</Text>
        <TouchableOpacity 
          className="bg-primary-color py-2.5 px-5 rounded-lg mt-4"
          onPress={fetchOrders}
        >
          <Text className="text-white font-semibold">Reintentar</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

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
              {orders.length === 0 ? (
                <View className="p-8 items-center">
                  <Ionicons name="document-outline" size={48} color="#94C6CC" />
                  <Text className="text-gray-500 mt-4">No hay pedidos disponibles</Text>
                </View>
              ) : (
                orders.map((order, index) => (
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
                </View>
              ))
              )}
            </ScrollView>
          </View>
        </ScrollView>

        {/* Modal de detalles */}
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View className="flex-1 justify-center items-center bg-black/50">
            <View className="bg-white rounded-lg w-11/12 max-w-2xl max-h-5/6">
              {/* Header del Modal */}
              <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
                <Text className="text-xl font-bold text-title-color">
                  Detalles del Pedido #{selectedOrderDetails?.id}
                </Text>
                <TouchableOpacity onPress={() => setModalVisible(false)}>
                  <Ionicons name="close" size={28} color="#5FA2AD" />
                </TouchableOpacity>
              </View>

              {/* Contenido del Modal */}
              <ScrollView className="p-5">
                {selectedOrderDetails?.details && (
                  <>
                    <Text className="text-base font-semibold text-gray-700 mb-3">
                      DATOS DEL CLIENTE
                    </Text>
                    <Text className="text-title-color mb-1">Cliente: {selectedOrderDetails.details.clientName}</Text>
                    <Text className="text-title-color mb-1">Teléfono: {selectedOrderDetails.details.phone}</Text>
                    <Text className="text-title-color mb-4">Correo: {selectedOrderDetails.details.email}</Text>

                    <Text className="text-base font-semibold text-gray-700 mb-3 mt-4">
                      DATOS DEL PEDIDO
                    </Text>
                    <Text className="text-title-color mb-1">Nombre del solicitante: {selectedOrderDetails.details.requestName}</Text>
                    <Text className="text-title-color mb-1">Productos:</Text>
                    {selectedOrderDetails.details.products.length > 0 ? (
                      selectedOrderDetails.details.products.map((product, i) => (
                        <Text key={i} className="text-title-color mb-1">  • {product}</Text>
                      ))
                    ) : (
                      <Text className="text-gray-500 mb-1">  • Sin productos registrados</Text>
                    )}
                    <Text className="text-title-color mb-1">Prioridad: {selectedOrderDetails.details.priority}</Text>
                    <Text className="text-title-color mb-1">Fecha estimada de entrega: {selectedOrderDetails.details.deliveryDate}</Text>
                    <Text className="text-title-color mb-1">Estatus de pago: {selectedOrderDetails.details.status} ({selectedOrderDetails.details.price})</Text>
                    <Text className="text-title-color mb-4">Detalles del pedido: {selectedOrderDetails.details.details}</Text>

                    <Text className="text-base font-semibold text-gray-700 mb-3 mt-4">
                      DATOS ADICIONALES
                    </Text>
                    <Text className="text-title-color mb-4">Diseñador: {selectedOrderDetails.details.designer}</Text>

                    {/* Botones */}
                    <View className="flex-row justify-center gap-3 mt-6">
                      <TouchableOpacity
                        className="bg-primary-color py-3 px-6 rounded-lg min-w-[130px] items-center"
                        onPress={() => handleConfirm(selectedOrderDetails.id)}
                      >
                        <Text className="text-white font-semibold text-base">Confirmar</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        className="bg-red-500 py-3 px-6 rounded-lg min-w-[130px] items-center"
                        onPress={() => handleReport(selectedOrderDetails.id)}
                      >
                        <Text className="text-white font-semibold text-base">Reportar error</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    </SafeAreaView>
  );
}
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, Keyboard, InputAccessoryView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import apiService from '../../services/apiService';

type OrderStage = {
  confirmacion: boolean;
  confirmadoDoctor: boolean;
  confirmadoCliente: boolean;
  inicioProceso: boolean;
  dado: boolean;
  diseño: boolean;
  fresadora: boolean;
  controlCalidad: boolean;
  areaEmpaque: boolean;
  entregado: boolean;
  devuelto: boolean;
};

type Order = {
  id: number;
  status: string;
  stages: OrderStage;
  createdAt?: string;
  createdBy?: string;
  events?: Array<{
    stage: keyof OrderStage;
    date: string;
    description: string;
  }>;
};

export default function TrackingScreen() {
  const [searchText, setSearchText] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Mapear estados de la API a eventos
  const statusMap: { [key: string]: Array<{ stage: keyof OrderStage; description: string }> } = {
    '1': [
      { stage: 'confirmacion', description: 'Pedido creado' },
      { stage: 'confirmadoDoctor', description: 'Confirmado por el Doctor' },
      { stage: 'confirmadoCliente', description: 'Confirmado por el Cliente' },
    ],
    '2': [
      { stage: 'confirmacion', description: 'Pedido creado' },
      { stage: 'confirmadoDoctor', description: 'Confirmado por el Doctor' },
      { stage: 'confirmadoCliente', description: 'Confirmado por el Cliente' },
      { stage: 'diseño', description: 'Entregado a Diseño' },
    ],
    '3': [
      { stage: 'confirmacion', description: 'Pedido creado' },
      { stage: 'confirmadoDoctor', description: 'Confirmado por el Doctor' },
      { stage: 'confirmadoCliente', description: 'Confirmado por el Cliente' },
      { stage: 'diseño', description: 'Entregado a Diseño' },
      { stage: 'diseño', description: 'Diseño completado' },
      { stage: 'fresadora', description: 'Entregado a Fresadora' },
    ],
    '4': [
      { stage: 'confirmacion', description: 'Pedido creado' },
      { stage: 'confirmadoDoctor', description: 'Confirmado por el Doctor' },
      { stage: 'confirmadoCliente', description: 'Confirmado por el Cliente' },
      { stage: 'diseño', description: 'Entregado a Diseño' },
      { stage: 'diseño', description: 'Diseño completado' },
      { stage: 'fresadora', description: 'Entregado a Fresadora' },
      { stage: 'fresadora', description: 'Fresadora completada' },
      { stage: 'controlCalidad', description: 'Control de Calidad' },
    ],
    '5': [
      { stage: 'confirmacion', description: 'Pedido creado' },
      { stage: 'confirmadoDoctor', description: 'Confirmado por el Doctor' },
      { stage: 'confirmadoCliente', description: 'Confirmado por el Cliente' },
      { stage: 'diseño', description: 'Entregado a Diseño' },
      { stage: 'diseño', description: 'Diseño completado' },
      { stage: 'fresadora', description: 'Entregado a Fresadora' },
      { stage: 'fresadora', description: 'Fresadora completada' },
      { stage: 'controlCalidad', description: 'Control de Calidad' },
      { stage: 'areaEmpaque', description: 'Área de Empaque' },
    ],
    '6': [
      { stage: 'confirmacion', description: 'Pedido creado' },
      { stage: 'confirmadoDoctor', description: 'Confirmado por el Doctor' },
      { stage: 'confirmadoCliente', description: 'Confirmado por el Cliente' },
      { stage: 'diseño', description: 'Entregado a Diseño' },
      { stage: 'diseño', description: 'Diseño completado' },
      { stage: 'fresadora', description: 'Entregado a Fresadora' },
      { stage: 'fresadora', description: 'Fresadora completada' },
      { stage: 'controlCalidad', description: 'Control de Calidad' },
      { stage: 'areaEmpaque', description: 'Área de Empaque' },
      { stage: 'entregado', description: 'Entregado' },
    ],
  };

  const fetchOrder = async (orderId: string) => {
    try {
      setLoading(true);
      setError('');
      
      const url = `/pedidos/${orderId}`;
      const fullUrl = `${process.env.EXPO_PUBLIC_API_URL}${url}`;
      console.log('🔍 Haciendo petición a:', fullUrl);
      
      const data = await apiService.get<any>(url);
      console.log('✅ Datos recibidos:', data);

      // Obtener los eventos según el estado
      const events = statusMap[data.id_estatusp] || [];
      
      // Crear objeto Order con los datos de la API
      const order: Order = {
        id: data.id_pedido,
        status: data.id_estatusp,
        createdAt: new Date(data.created_at).toLocaleDateString('es-ES'),
        stages: {
          confirmacion: true,
          confirmadoDoctor: Number(data.id_estatusp) >= 1,
          confirmadoCliente: Number(data.id_estatusp) >= 1,
          inicioProceso: Number(data.id_estatusp) >= 2,
          dado: false,
          diseño: Number(data.id_estatusp) >= 2,
          fresadora: Number(data.id_estatusp) >= 3,
          controlCalidad: Number(data.id_estatusp) >= 4,
          areaEmpaque: Number(data.id_estatusp) >= 5,
          entregado: Number(data.id_estatusp) >= 6,
          devuelto: false,
        },
        events: events.map((event, index) => ({
          ...event,
          date: new Date(data.created_at).toLocaleDateString('es-ES'),
        })),
      };

      setSelectedOrder(order);
    } catch (err: any) {
      console.error('❌ Error al buscar pedido:', err);
      setError(err.message || 'No se encontró el pedido');
      setSelectedOrder(null);
    } finally {
      setLoading(false);
    }
  };

  const stageLabels: { [key in keyof OrderStage]: string } = {
    confirmacion: 'En Espera De Confirmación',
    confirmadoDoctor: 'Confirmado Por El Doctor',
    confirmadoCliente: 'Confirmado Por El Cliente',
    inicioProceso: 'Inicio Del Proceso',
    dado: 'Dado',
    diseño: 'Diseño',
    fresadora: 'Fresadora',
    controlCalidad: 'Control De Calidad',
    areaEmpaque: 'Área De Empaque',
    entregado: 'Entregado',
    devuelto: 'Devuelto',
  };

  // Búsqueda automática después de escribir
  React.useEffect(() => {
    // Limpiar timeout anterior
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    // Si hay texto, buscar después de 800ms
    if (searchText.trim()) {
      const timeout = setTimeout(() => {
        fetchOrder(searchText);
      }, 800);
      
      setSearchTimeout(timeout);
    } else {
      setSelectedOrder(null);
    }

    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchText]);

  // Función para manejar el cambio de estado
  const toggleStage = (stage: keyof OrderStage) => {
    if (!selectedOrder) return;
    
    const updatedStages = {...selectedOrder.stages};
    
    // Si es devuelto, resetear todas las etapas excepto diseño y anteriores
    if (stage === 'devuelto') {
      Object.keys(updatedStages).forEach(key => {
        const stageKey = key as keyof OrderStage;
        if (stageKey !== 'devuelto') {
          updatedStages[stageKey] = stageKey === 'diseño' || 
                                  stageKey === 'dado' || 
                                  stageKey === 'inicioProceso' || 
                                  stageKey === 'confirmadoCliente' || 
                                  stageKey === 'confirmadoDoctor' || 
                                  stageKey === 'confirmacion';
        }
      });
      updatedStages[stage] = true;
    } 
    // Si no es devuelto, actualizar la etapa específica
    else {
      updatedStages[stage] = !updatedStages[stage];
      
      // Si se desmarca una etapa, desmarcar las siguientes
      if (!updatedStages[stage]) {
        const stageOrder: (keyof OrderStage)[] = [
          'confirmacion', 
          'confirmadoDoctor', 
          'confirmadoCliente', 
          'inicioProceso', 
          'dado', 
          'diseño', 
          'fresadora', 
          'controlCalidad', 
          'areaEmpaque', 
          'entregado', 
          'devuelto'
        ];
        
        const currentStageIndex = stageOrder.indexOf(stage);
        stageOrder.forEach((key, index) => {
          if (index > currentStageIndex) {
            updatedStages[key] = false;
          }
        });
      }
    }
    
    setSelectedOrder({
      ...selectedOrder,
      stages: updatedStages
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-background-color">
      <View className="flex-1 p-4">
        <Text className="text-title-color text-heading-lg font-bold text-center mb-6">
          Seguimiento de pedidos
        </Text>
        
        {/* Buscador */}
        <View className="flex-row mb-6 gap-2">
          <View className="flex-1 bg-input-color rounded-md px-4 py-3 justify-center">
            <TextInput
              className="text-black text-base"
              value={searchText}
              onChangeText={setSearchText}
              placeholder="Buscar pedido"
              placeholderTextColor="#666"
              keyboardType="numeric"
              inputAccessoryViewID="searchKeyboardAccessory"
            />
          </View>
        </View>

        {/* Accessory View para el teclado */}
        <InputAccessoryView nativeID="searchKeyboardAccessory">
          <View className="bg-gray-100 flex-row justify-end p-2 border-t border-gray-300">
            <TouchableOpacity 
              className="bg-primary-color rounded-md px-4 py-2"
              onPress={() => Keyboard.dismiss()}
            >
              <Ionicons name="chevron-down" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </InputAccessoryView>
        
        {selectedOrder ? (
          <ScrollView className="bg-white rounded-lg p-6 shadow-md">
            {/* Header del pedido */}
            <Text className="text-title-color text-2xl font-bold mb-2">
              Pedido #{selectedOrder.id}
            </Text>
            {selectedOrder.createdAt && (
              <Text className="text-gray-600 text-sm mb-6">
                {selectedOrder.createdAt}
              </Text>
            )}
            
            {/* Timeline */}
            <View>
              {selectedOrder.events?.map((event, index) => (
                <View key={index} className="flex-row mb-8">
                  {/* Línea vertical y círculo */}
                  <View className="items-center mr-4 pt-1">
                    {/* Círculo */}
                    <View className={`w-6 h-6 rounded-full border-2 justify-center items-center z-10
                      ${selectedOrder.stages[event.stage] 
                        ? 'bg-primary-color border-primary-color' 
                        : 'bg-white border-gray-300'}`}>
                      {selectedOrder.stages[event.stage] && (
                        <Ionicons name="checkmark" size={14} color="white" />
                      )}
                    </View>
                    {/* Línea conectora */}
                    {index < (selectedOrder.events?.length || 0) - 1 && (
                      <View className="w-1 h-24 bg-gray-400 mt-2" />
                    )}
                  </View>
                  
                  {/* Contenido del evento */}
                  <View className="flex-1 pt-1">
                    <Text className="text-gray-600 text-xs mb-1">
                      {event.date}
                    </Text>
                    <Text className="text-title-color text-base font-medium">
                      {event.description}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </ScrollView>
        ) : loading ? (
          <View className="bg-white rounded-lg p-6 items-center justify-center">
            <ActivityIndicator size="large" color="#94C6CC" />
            <Text className="text-title-color text-lg mt-4">
              Buscando pedido...
            </Text>
          </View>
        ) : (
          <View className="bg-white rounded-lg p-6 items-center justify-center">
            <Ionicons name="document-text-outline" size={48} color="#94C6CC" />
            <Text className="text-title-color text-lg mt-4 text-center">
              {error ? error : 'Busca un pedido para ver su seguimiento'}
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

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
};

export default function TrackingScreen() {
  const [searchText, setSearchText] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [orders] = useState<Order[]>([
    {
      id: 455,
      status: 'devuelto',
      stages: {
        confirmacion: true,
        confirmadoDoctor: true,
        confirmadoCliente: true,
        inicioProceso: true,
        dado: true,
        diseño: true,
        fresadora: true,
        controlCalidad: true,
        areaEmpaque: true,
        entregado: true,
        devuelto: true,
      }
    },
  ]);

  // Función para buscar pedido
  const handleSearch = () => {
    const foundOrder = orders.find(order => order.id.toString() === searchText);
    setSelectedOrder(foundOrder || null);
  };

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
        <View className="flex-row mb-6">
          <View className="flex-1 bg-input-color rounded-l-md px-4 py-3 justify-center">
            <TextInput
              className="text-black text-base"
              value={searchText}
              onChangeText={setSearchText}
              placeholder="Buscar pedido"
              placeholderTextColor="#666"
              keyboardType="numeric"
            />
          </View>
          <TouchableOpacity 
            className="bg-primary-color rounded-r-md px-4 justify-center"
            onPress={handleSearch}
          >
            <Ionicons name="search" size={24} color="white" />
          </TouchableOpacity>
        </View>
        
        {selectedOrder ? (
          <ScrollView className="bg-white rounded-lg p-4 shadow-md">
            <Text className="text-title-color text-xl font-bold mb-4 text-center">
              Pedido #{selectedOrder.id}
            </Text>
            
            <View className="space-y-3">
              {/* Etapa: En Espera De Confirmación */}
              <TouchableOpacity 
                className="flex-row items-center"
                onPress={() => toggleStage('confirmacion')}
              >
                <View className={`w-6 h-6 rounded-full border-2 mr-3 justify-center items-center 
                  ${selectedOrder.stages.confirmacion ? 'bg-primary-color border-primary-color' : 'border-title-color'}`}>
                  {selectedOrder.stages.confirmacion && (
                    <Ionicons name="checkmark" size={16} color="white" />
                  )}
                </View>
                <Text className="text-title-color text-base">En Espera De Confirmación</Text>
              </TouchableOpacity>
              
              {/* Etapa: Confirmado Por El Doctor */}
              <TouchableOpacity 
                className="flex-row items-center"
                onPress={() => toggleStage('confirmadoDoctor')}
              >
                <View className={`w-6 h-6 rounded-full border-2 mr-3 justify-center items-center 
                  ${selectedOrder.stages.confirmadoDoctor ? 'bg-primary-color border-primary-color' : 'border-title-color'}`}>
                  {selectedOrder.stages.confirmadoDoctor && (
                    <Ionicons name="checkmark" size={16} color="white" />
                  )}
                </View>
                <Text className="text-title-color text-base">Confirmado Por El Doctor</Text>
              </TouchableOpacity>
              
              {/* Etapa: Confirmado Por El Cliente */}
              <TouchableOpacity 
                className="flex-row items-center"
                onPress={() => toggleStage('confirmadoCliente')}
              >
                <View className={`w-6 h-6 rounded-full border-2 mr-3 justify-center items-center 
                  ${selectedOrder.stages.confirmadoCliente ? 'bg-primary-color border-primary-color' : 'border-title-color'}`}>
                  {selectedOrder.stages.confirmadoCliente && (
                    <Ionicons name="checkmark" size={16} color="white" />
                  )}
                </View>
                <Text className="text-title-color text-base">Confirmado Por El Cliente</Text>
              </TouchableOpacity>
              
              {/* Etapa: Inicio Del Proceso */}
              <TouchableOpacity 
                className="flex-row items-center"
                onPress={() => toggleStage('inicioProceso')}
              >
                <View className={`w-6 h-6 rounded-full border-2 mr-3 justify-center items-center 
                  ${selectedOrder.stages.inicioProceso ? 'bg-primary-color border-primary-color' : 'border-title-color'}`}>
                  {selectedOrder.stages.inicioProceso && (
                    <Ionicons name="checkmark" size={16} color="white" />
                  )}
                </View>
                <Text className="text-title-color text-base">Inicio Del Proceso</Text>
              </TouchableOpacity>
              
              {/* Etapa: Dado */}
              <TouchableOpacity 
                className="flex-row items-center"
                onPress={() => toggleStage('dado')}
              >
                <View className={`w-6 h-6 rounded-full border-2 mr-3 justify-center items-center 
                  ${selectedOrder.stages.dado ? 'bg-primary-color border-primary-color' : 'border-title-color'}`}>
                  {selectedOrder.stages.dado && (
                    <Ionicons name="checkmark" size={16} color="white" />
                  )}
                </View>
                <Text className="text-title-color text-base">Dado</Text>
              </TouchableOpacity>
              
              {/* Etapa: Diseño */}
              <TouchableOpacity 
                className="flex-row items-center"
                onPress={() => toggleStage('diseño')}
              >
                <View className={`w-6 h-6 rounded-full border-2 mr-3 justify-center items-center 
                  ${selectedOrder.stages.diseño ? 'bg-primary-color border-primary-color' : 'border-title-color'}`}>
                  {selectedOrder.stages.diseño && (
                    <Ionicons name="checkmark" size={16} color="white" />
                  )}
                </View>
                <Text className="text-title-color text-base">Diseño</Text>
              </TouchableOpacity>
              
              {/* Etapa: Fresadora */}
              <TouchableOpacity 
                className="flex-row items-center"
                onPress={() => toggleStage('fresadora')}
              >
                <View className={`w-6 h-6 rounded-full border-2 mr-3 justify-center items-center 
                  ${selectedOrder.stages.fresadora ? 'bg-primary-color border-primary-color' : 'border-title-color'}`}>
                  {selectedOrder.stages.fresadora && (
                    <Ionicons name="checkmark" size={16} color="white" />
                  )}
                </View>
                <Text className="text-title-color text-base">Fresadora</Text>
              </TouchableOpacity>
              
              {/* Etapa: Control De Calidad */}
              <TouchableOpacity 
                className="flex-row items-center"
                onPress={() => toggleStage('controlCalidad')}
              >
                <View className={`w-6 h-6 rounded-full border-2 mr-3 justify-center items-center 
                  ${selectedOrder.stages.controlCalidad ? 'bg-primary-color border-primary-color' : 'border-title-color'}`}>
                  {selectedOrder.stages.controlCalidad && (
                    <Ionicons name="checkmark" size={16} color="white" />
                  )}
                </View>
                <Text className="text-title-color text-base">Control De Calidad</Text>
              </TouchableOpacity>
              
              {/* Etapa: Área De Empaque */}
              <TouchableOpacity 
                className="flex-row items-center"
                onPress={() => toggleStage('areaEmpaque')}
              >
                <View className={`w-6 h-6 rounded-full border-2 mr-3 justify-center items-center 
                  ${selectedOrder.stages.areaEmpaque ? 'bg-primary-color border-primary-color' : 'border-title-color'}`}>
                  {selectedOrder.stages.areaEmpaque && (
                    <Ionicons name="checkmark" size={16} color="white" />
                  )}
                </View>
                <Text className="text-title-color text-base">Área De Empaque</Text>
              </TouchableOpacity>
              
              {/* Etapa: Entregado */}
              <TouchableOpacity 
                className="flex-row items-center"
                onPress={() => toggleStage('entregado')}
              >
                <View className={`w-6 h-6 rounded-full border-2 mr-3 justify-center items-center 
                  ${selectedOrder.stages.entregado ? 'bg-primary-color border-primary-color' : 'border-title-color'}`}>
                  {selectedOrder.stages.entregado && (
                    <Ionicons name="checkmark" size={16} color="white" />
                  )}
                </View>
                <Text className="text-title-color text-base">Entregado</Text>
              </TouchableOpacity>
              
              {/* Etapa: Devuelto */}
              <TouchableOpacity 
                className="flex-row items-center"
                onPress={() => toggleStage('devuelto')}
              >
                <View className={`w-6 h-6 rounded-full border-2 mr-3 justify-center items-center 
                  ${selectedOrder.stages.devuelto ? 'bg-primary-color border-primary-color' : 'border-title-color'}`}>
                  {selectedOrder.stages.devuelto && (
                    <Ionicons name="checkmark" size={16} color="white" />
                  )}
                </View>
                <Text className="text-title-color text-base">Devuelto</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        ) : (
          <View className="bg-white rounded-lg p-6 items-center justify-center">
            <Ionicons name="document-text-outline" size={48} color="#94C6CC" />
            <Text className="text-title-color text-lg mt-4 text-center">
              {searchText ? 'No se encontró el pedido' : 'Busca un pedido para ver su seguimiento'}
            </Text>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}
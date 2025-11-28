import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Image, Modal, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import apiService from '../../services/apiService';

type PedidoRaw = {
  id_pedido?: number;
  id?: number;
  direccion?: string;
  fecha_entrega?: string;
  productos?: Array<{ cantidad?: number }>;
  prioridad?: { n_prioridad?: string };
  estatuspago?: { n_estatuspago?: string };
  estatus_pago?: { n_estatuspago?: string };
};

type PedidoUI = {
  id: number;
  fechaEntrega: string;
  prioridad: string;
  estatusPago: string;
};

type PedidoDetalle = {
  id_pedido: number;
  id_cliente: number;
  fecha_entrega: string;
  id_prioridad: number;
  id_estatuspago: number;
  id_disenador: number;
  id_fresadora: number;
  id_dado: number;
  id_estatusp: number;
  created_at: string;
  direccion: string;
  productos: Array<{
    id_pedido_producto: number;
    id_pedido: number;
    id_producto: number;
    cantidad: number;
    precio_unitario: number;
    subtotal: number;
    producto: {
      precio: number;
      n_producto: string;
      descripcion: string;
      id_producto: number;
    };
  }>;
  total: number;
};

const formatFecha = (iso: string | undefined) => {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  const pad = (n: number) => `${n}`.padStart(2, '0');
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
};

const prioridadStyle = (label: string) => {
  const s = (label || '').toLowerCase();
  if (s.includes('urg')) return { bg: 'bg-red-200', text: 'text-red-800' };
  if (s.includes('norm')) return { bg: 'bg-green-200', text: 'text-green-800' };
  return { bg: 'bg-gray-200', text: 'text-gray-800' };
};

export default function PickupScreen() {
  const [items, setItems] = useState<PedidoUI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [prioridadMap, setPrioridadMap] = useState<Record<number, string>>({});
  const [estatusPagoMap, setEstatusPagoMap] = useState<Record<number, string>>({});
  const [showModal, setShowModal] = useState(false);
  const [selectedPedidoDetails, setSelectedPedidoDetails] = useState<PedidoDetalle | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [pedidoAFinalizar, setPedidoAFinalizar] = useState<number | null>(null);
  const [finalizando, setFinalizando] = useState(false);
  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [prioridadRes, estatusRes, pedidosRes] = await Promise.all([
        apiService.get<any>('/prioridad'),
        apiService.get<any>('/estatus-pago'),
        apiService.get<any>('/pedidos'),
      ]);

      const priList: Array<{ id_prioridad: number; n_prioridad: string }> = Array.isArray(prioridadRes)
        ? prioridadRes
        : Array.isArray(prioridadRes?.data)
        ? prioridadRes.data
        : [];
      const estList: Array<{ id_estatuspago: number; n_estatuspago: string }> = Array.isArray(estatusRes)
        ? estatusRes
        : Array.isArray(estatusRes?.data)
        ? estatusRes.data
        : [];

      const pMap = priList.reduce<Record<number, string>>((acc, it) => {
        acc[it.id_prioridad] = it.n_prioridad;
        return acc;
      }, {});
      const eMap = estList.reduce<Record<number, string>>((acc, it) => {
        acc[it.id_estatuspago] = it.n_estatuspago;
        return acc;
      }, {});

      setPrioridadMap(pMap);
      setEstatusPagoMap(eMap);

      const list: PedidoRaw[] = Array.isArray(pedidosRes)
        ? pedidosRes
        : Array.isArray(pedidosRes?.data)
        ? pedidosRes.data
        : [];
      const onlyPickup = list.filter((p) => (p.direccion || '').trim().toLowerCase() === 'recoger');
      const mapped: PedidoUI[] = onlyPickup.map((p) => {
        const id = p.id_pedido ?? (p as any).id ?? 0;
        let prioridad = p.prioridad?.n_prioridad || '';
        if (!prioridad) {
          const idp = (p as any).id_prioridad;
          if (idp != null) prioridad = pMap[idp] || '';
        }
        let estatusPago = p.estatuspago?.n_estatuspago || (p as any).estatus_pago?.n_estatuspago || '';
        if (!estatusPago) {
          const ide = (p as any).id_estatuspago;
          if (ide != null) estatusPago = eMap[ide] || '';
        }
        return {
          id,
          fechaEntrega: formatFecha(p.fecha_entrega),
          prioridad,
          estatusPago,
        };
      });
      setItems(mapped);
    } catch (e: any) {
      setError(e?.message || 'No se pudieron cargar los pedidos');
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleFinalizarPedido = (id: number) => {
    setPedidoAFinalizar(id);
    setShowConfirmModal(true);
  };

  const handleVerDireccion = async (id: number) => {
    try {
      setLoadingDetails(true);
      setShowModal(true);
      const detalles = await apiService.get<PedidoDetalle>(`/pedidos/${id}`);
      setSelectedPedidoDetails(detalles);
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'No se pudieron cargar los detalles del pedido');
      setShowModal(false);
    } finally {
      setLoadingDetails(false);
    }
  };

  const confirmarFinalizacion = async () => {
    if (!pedidoAFinalizar) return;
    try {
      setFinalizando(true);
      await apiService.put(`/pedidos/${pedidoAFinalizar}/estatus`, {
        id_estatusp: 7, // 7 = Finalizado
      });
      setShowConfirmModal(false);
      setPedidoAFinalizar(null);
      Alert.alert('Éxito', 'Pedido finalizado correctamente');
      // Recargar la lista de pedidos
      await loadData();
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'No se pudo finalizar el pedido');
    } finally {
      setFinalizando(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background-color">
      <ScrollView contentContainerStyle={{ paddingVertical: 24 }}>
        {/* Encabezado tipo mockup con logo */}
        <View className="items-center mb-6">
          <Image
                      source={require('../../assets/logo_mota.png')}
                      className="w-16 h-16 mb-3"
                      resizeMode="contain"
                    />
                    <Text className="text-primary-color text-heading-xl font-bold mb-2">MOTA</Text>
        </View>

        {loading && (
          <Text className="text-gray-500 text-center mt-6">Cargando...</Text>
        )}
        {!loading && error && (
          <Text className="text-red-600 text-center mt-6">{error}</Text>
        )}
        {!loading && !error && items.length === 0 && (
          <Text className="text-gray-500 text-center mt-6">No hay pedidos para recoger</Text>
        )}

        {!loading && !error && items.map((it) => {
          const pStyle = prioridadStyle(it.prioridad);
          return (
            <View key={it.id} className="mx-4 mb-6 rounded-lg border border-gray-200 bg-white overflow-hidden">
              {/* Header verde claro */}
              <View className="bg-green-100 px-4 py-3 flex-row items-center justify-between">
                <Text className="text-title-color font-bold">Pedido #{it.id}</Text>
                {!!it.prioridad && (
                  <View className={`px-2 py-1 rounded-full ${pStyle.bg}`}>
                    <Text className={`${pStyle.text} text-xs font-semibold`}>{it.prioridad}</Text>
                  </View>
                )}
              </View>

              {/* Info fila */}
              <View className="px-4 py-3 flex-row justify-between items-start border-t border-gray-200">
                <View>
                  {!!it.fechaEntrega && (
                    <Text className="text-title-color">{it.fechaEntrega}</Text>
                  )}
                </View>
                {!!it.estatusPago && (
                  <Text className="text-title-color">{it.estatusPago.toLowerCase()}</Text>
                )}
              </View>

              {/* Botones de acción */}
              <View className="px-4 pb-4">
                <View className="mt-2 flex-row justify-between gap-2">
                  <TouchableOpacity
                    onPress={() => handleVerDireccion(it.id)}
                    className="flex-1 px-4 py-2 rounded-md border border-sky-300 bg-sky-100"
                  >
                    <Text className="text-title-color text-center">Ver detalles</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleFinalizarPedido(it.id)}
                    className="flex-1 px-4 py-2 rounded-md border border-green-300 bg-green-100"
                  >
                    <Text className="text-title-color text-center">Finalizar</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>

      {/* Modal de detalles del pedido */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={showModal}
        onRequestClose={() => {
          setShowModal(false);
          setSelectedPedidoDetails(null);
        }}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white rounded-lg w-11/12 max-w-2xl max-h-5/6">
            {/* Header del Modal */}
            <View className="flex-row justify-between items-center p-4 border-b border-gray-200">
              <Text className="text-xl font-bold text-title-color">
                Detalles - Pedido #{selectedPedidoDetails?.id_pedido}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  setShowModal(false);
                  setSelectedPedidoDetails(null);
                }}
              >
                <Ionicons name="close" size={28} color="#5FA2AD" />
              </TouchableOpacity>
            </View>

            {/* Contenido del Modal */}
            {loadingDetails ? (
              <View className="items-center justify-center py-8">
                <ActivityIndicator size="large" color="#5FA2AD" />
                <Text className="text-title-color mt-4">Cargando detalles...</Text>
              </View>
            ) : selectedPedidoDetails ? (
              <ScrollView className="p-5">
                {/* Dirección - solo para recoger */}
                {selectedPedidoDetails.direccion && selectedPedidoDetails.direccion.toLowerCase() === 'recoger' && (
                  <View className="mb-6 p-4 bg-green-50 rounded-lg border border-green-200">
                    <Text className="text-gray-600 font-semibold mb-2">RETIRO EN LOCAL</Text>
                    <Text className="text-title-color text-lg font-bold">
                      {selectedPedidoDetails.direccion}
                    </Text>
                  </View>
                )}

                {/* Información del pedido */}
                <View className="mb-4">
                  <Text className="text-base font-semibold text-gray-700 mb-3">DATOS DEL PEDIDO</Text>

                  <View className="flex-row py-2 border-b border-gray-100">
                    <Text className="text-gray-600 font-medium">Fecha de entrega:</Text>
                    <Text className="text-title-color font-semibold flex-1 text-right">
                      {formatFecha(selectedPedidoDetails.fecha_entrega)}
                    </Text>
                  </View>

                  <View className="flex-row py-2 border-b border-gray-100">
                    <Text className="text-gray-600 font-medium">Total:</Text>
                    <Text className="text-title-color font-semibold flex-1 text-right">
                      ${selectedPedidoDetails.total?.toLocaleString('es-CO') || '0'}
                    </Text>
                  </View>
                </View>

                {/* Productos */}
                {selectedPedidoDetails.productos && selectedPedidoDetails.productos.length > 0 && (
                  <View className="mb-4">
                    <Text className="text-base font-semibold text-gray-700 mb-3">PRODUCTOS</Text>
                    {selectedPedidoDetails.productos.map((p, idx) => (
                      <View key={idx} className="mb-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <Text className="text-title-color font-semibold">
                          {p.producto?.n_producto || 'Producto desconocido'}
                        </Text>
                        <View className="flex-row justify-between mt-2">
                          <Text className="text-gray-600 text-sm">Cantidad: {p.cantidad}</Text>
                          <Text className="text-gray-600 text-sm">
                            ${p.subtotal?.toLocaleString('es-CO') || '0'}
                          </Text>
                        </View>
                      </View>
                    ))}
                  </View>
                )}

                {/* Botón de cerrar */}
                <TouchableOpacity
                  onPress={() => {
                    setShowModal(false);
                    setSelectedPedidoDetails(null);
                  }}
                  className="mt-6 bg-primary-color py-3 px-4 rounded-lg"
                >
                  <Text className="text-white font-semibold text-center">Cerrar</Text>
                </TouchableOpacity>
              </ScrollView>
            ) : null}
          </View>
        </View>
      </Modal>

      {/* Modal de confirmación de finalización */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showConfirmModal}
        onRequestClose={() => {
          if (!finalizando) {
            setShowConfirmModal(false);
            setPedidoAFinalizar(null);
          }
        }}
      >
        <View className="flex-1 justify-center items-center bg-black/50">
          <View className="bg-white rounded-lg w-11/12 max-w-md">
            {/* Header del Modal */}
            <View className="p-6 border-b border-gray-200">
              <Text className="text-xl font-bold text-title-color text-center">
                Confirmar Finalización
              </Text>
            </View>

            {/* Contenido */}
            <View className="p-6">
              <View className="mb-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                <Text className="text-title-color text-center font-semibold text-lg">
                  ¿Seguro que quieres finalizar el pedido #{pedidoAFinalizar}?
                </Text>
              </View>

              {/* Botones */}
              <View className="flex-row gap-3">
                <TouchableOpacity
                  onPress={() => {
                    setShowConfirmModal(false);
                    setPedidoAFinalizar(null);
                  }}
                  disabled={finalizando}
                  className="flex-1 py-3 px-4 rounded-lg bg-gray-200"
                >
                  <Text className="text-title-color font-semibold text-center">Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={confirmarFinalizacion}
                  disabled={finalizando}
                  className="flex-1 py-3 px-4 rounded-lg bg-green-500"
                >
                  {finalizando ? (
                    <ActivityIndicator color="white" />
                  ) : (
                    <Text className="text-white font-semibold text-center">Finalizar</Text>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

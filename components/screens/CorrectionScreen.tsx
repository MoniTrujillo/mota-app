import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import apiService from '../../services/apiService';

type PedidoRaw = {
  id_pedido?: number;
  id?: number;
  fecha_entrega?: string;
  prioridad?: { n_prioridad?: string };
  id_prioridad?: number;
};

type PedidoUI = {
  id: number;
  fechaEntrega: string;
  prioridad: string;
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
  if (s.includes('alta') || s.includes('urg')) return { bg: 'bg-red-200', text: 'text-red-800' };
  if (s.includes('normal') || s.includes('norm')) return { bg: 'bg-green-200', text: 'text-green-800' };
  if (s.includes('baja') || s.includes('baj')) return { bg: 'bg-blue-200', text: 'text-blue-800' };
  if (s.includes('devuelto') || s.includes('devu')) return { bg: 'bg-red-200', text: 'text-red-800' };
  return { bg: 'bg-gray-200', text: 'text-gray-800' };
};

export default function CorrectionScreen() {
  const [items, setItems] = useState<PedidoUI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [prioridadMap, setPrioridadMap] = useState<Record<number, string>>({});

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [prioridadRes, pedidosRes] = await Promise.all([
        apiService.get<any>('/prioridad'),
        apiService.get<any>('/pedidos/prioridad/5'),
      ]);

      const priList: Array<{ id_prioridad: number; n_prioridad: string }> = Array.isArray(prioridadRes)
        ? prioridadRes
        : Array.isArray(prioridadRes?.data)
        ? prioridadRes.data
        : [];
      const pMap = priList.reduce<Record<number, string>>((acc, it) => {
        acc[it.id_prioridad] = it.n_prioridad;
        return acc;
      }, {});
      setPrioridadMap(pMap);

      const list: PedidoRaw[] = Array.isArray(pedidosRes)
        ? pedidosRes
        : Array.isArray(pedidosRes?.data)
        ? pedidosRes.data
        : [];
      const mapped: PedidoUI[] = list.map((p) => {
        const id = p.id_pedido ?? (p as any).id ?? 0;
        let prioridad = p.prioridad?.n_prioridad || '';
        if (!prioridad && p.id_prioridad != null) prioridad = pMap[p.id_prioridad] || '';
        return {
          id,
          fechaEntrega: formatFecha(p.fecha_entrega),
          prioridad,
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

  const onVerDetalles = (id: number) => Alert.alert('Detalles', `Abrir detalles del pedido #${id}`);
  const onAnadirCorreccion = (id: number) => Alert.alert('Corrección', `Añadir corrección al pedido #${id}`);

  return (
    <SafeAreaView className="flex-1 bg-background-color">
      <ScrollView contentContainerStyle={{ paddingVertical: 24 }}>
        {/* Encabezado */}
        <View className="items-center mb-6">
          <Image
            source={require('../../assets/logo_mota.png')}
            className="w-16 h-16 mb-3"
            resizeMode="contain"
          />
          <Text className="text-primary-color text-heading-xl font-bold mb-4">MOTA</Text>
          <Text className="text-title-color text-2xl font-bold">Pedidos devueltos</Text>
        </View>

        {loading && <Text className="text-gray-500 text-center mt-6">Cargando...</Text>}
        {!loading && error && <Text className="text-red-600 text-center mt-6">{error}</Text>}
        {!loading && !error && items.length === 0 && (
          <Text className="text-gray-500 text-center mt-6">No hay pedidos devueltos</Text>
        )}

        {!loading && !error && items.map((it) => {
          const pStyle = prioridadStyle(it.prioridad);
          return (
            <View key={it.id} className="mx-4 mb-6 rounded-lg border border-gray-200 bg-white overflow-hidden">
              {/* Header verde */}
              <View className="bg-green-100 px-4 py-3 flex-row items-start justify-between">
                <Text className="text-title-color font-bold">Pedido #{it.id}</Text>
                <View className="items-end">
                  {!!it.prioridad && (
                    <View className={`px-2 py-1 rounded-full ${pStyle.bg} mb-1`}>
                      <Text className={`${pStyle.text} text-xs font-semibold`}>{it.prioridad}</Text>
                    </View>
                  )}
                  {!!it.fechaEntrega && (
                    <Text className="text-title-color text-xs">{it.fechaEntrega}</Text>
                  )}
                </View>
              </View>

              {/* Botones */}
              <View className="px-4 pb-4">
                <View className="mt-2 flex-row justify-between">
                  <TouchableOpacity onPress={() => onVerDetalles(it.id)} className="flex-1 mr-2 px-4 py-2 rounded-md border justify-center border-gray-400 bg-white">
                    <Text className="text-title-color text-center">Ver detalles</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => onAnadirCorreccion(it.id)} className="flex-1 ml-2 px-4 py-2 rounded-md border border-sky-300 bg-sky-100">
                    <Text className="text-title-color text-center">Añadir corrección</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

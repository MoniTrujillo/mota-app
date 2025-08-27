import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import apiService from '../../services/apiService';

type PedidoRaw = {
  id_pedido?: number;
  id?: number;
  direccion?: string;
  fecha_entrega?: string;
  prioridad?: { n_prioridad?: string };
  estatuspago?: { n_estatuspago?: string };
  estatus_pago?: { n_estatuspago?: string };
};

type PedidoUI = {
  id: number;
  fechaEntrega: string;
  prioridad: string;
  estatusPago: string;
  direccion: string;
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

export default function DeliveryScreen() {
  const [items, setItems] = useState<PedidoUI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [prioridadMap, setPrioridadMap] = useState<Record<number, string>>({});
  const [estatusPagoMap, setEstatusPagoMap] = useState<Record<number, string>>({});

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
      const onlyDelivery = list.filter((p) => {
        const dir = (p.direccion || '').trim().toLowerCase();
        return dir !== 'recoger' && dir.length > 0;
      });

      const mapped: PedidoUI[] = onlyDelivery.map((p) => {
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
          direccion: (p.direccion || '').toString(),
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

  const handleEntregado = (id: number) => {
    Alert.alert('Entregado', `Pedido #${id} marcado como entregado (pendiente de integrar API).`);
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
          <Text className="text-gray-500 text-center mt-6">No hay pedidos a domicilio</Text>
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
                <View className="mt-2 flex-row justify-between">
                  <TouchableOpacity
                    onPress={() => Alert.alert('Dirección', it.direccion || 'Sin dirección')}
                    className="flex-1 mr-2 px-4 py-2 rounded-md border border-sky-300 bg-sky-100"
                  >
                    <Text className="text-title-color text-center">Ver dirección</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => handleEntregado(it.id)}
                    className="flex-1 ml-2 px-4 py-2 rounded-md border border-sky-300 bg-sky-100"
                  >
                    <Text className="text-title-color text-center">Entregado</Text>
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

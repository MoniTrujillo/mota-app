import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
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
  id_prioridad?: number;
  id_estatuspago?: number;
};

type PedidoUI = {
  id: number;
  fechaEntrega: string;
  cantidadTotal: number;
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

export default function QualityControlScreen() {
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
        apiService.get<any>('/pedidos/estatus/5'),
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

      const mapped: PedidoUI[] = list.map((p) => {
        const id = p.id_pedido ?? (p as any).id ?? 0;
        const cantidadTotal = (p.productos || []).reduce((sum, pr) => sum + (Number(pr.cantidad) || 0), 0);
        let prioridad = p.prioridad?.n_prioridad || '';
        if (!prioridad && p.id_prioridad != null) prioridad = pMap[p.id_prioridad] || '';
        let estatusPago = p.estatuspago?.n_estatuspago || p.estatus_pago?.n_estatuspago || '';
        if (!estatusPago && p.id_estatuspago != null) estatusPago = eMap[p.id_estatuspago] || '';
        return {
          id,
          fechaEntrega: formatFecha(p.fecha_entrega),
          cantidadTotal,
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

  const onVerDetalles = (id: number) => Alert.alert('Detalles', `Abrir detalles del pedido #${id}`);
  const onEnviarCorreccion = (id: number) => Alert.alert('Corrección', `Enviar pedido #${id} a corrección`);
  const onPausar = (id: number) => Alert.alert('Pausar', `Pedido #${id} pausado`);
  const onEnviarEmpaque = (id: number) => Alert.alert('Empaque', `Enviar pedido #${id} a empaque`);

  return (
    <SafeAreaView className="flex-1 bg-background-color">
      <ScrollView contentContainerStyle={{ paddingVertical: 24 }}>
        {/* Encabezado con logo y título */}
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
          <Text className="text-gray-500 text-center mt-6">No hay pedidos en control de calidad</Text>
        )}

        {!loading && !error && items.map((it) => {
          const pStyle = prioridadStyle(it.prioridad);
          return (
            <View key={it.id} className="mx-4 mb-6 rounded-lg border border-gray-200 bg-white overflow-hidden">
              {/* Header con cantidad y fecha dentro */}
              <View className="bg-green-100 px-4 py-3 flex-row justify-between">
                <View>
                  <Text className="text-title-color font-bold">Pedido #{it.id}</Text>
                  <Text className="text-title-color mt-1">Cantidad {it.cantidadTotal}</Text>
                  {!!it.fechaEntrega && (
                    <Text className="text-title-color mt-1">{it.fechaEntrega}</Text>
                  )}
                </View>
                <View className="items-end">
                  {!!it.prioridad && (
                    <View className={`px-2 py-1 rounded-full ${pStyle.bg} mb-1`}>
                      <Text className={`${pStyle.text} text-xs font-semibold`}>{it.prioridad}</Text>
                    </View>
                  )}
                  {!!it.estatusPago && (
                    <Text className="text-title-color text-xs">{it.estatusPago.toLowerCase()}</Text>
                  )}
                </View>
              </View>

              {/* Row 1 buttons */}
              <View className="px-4">
                <View className="mt-1 flex-row justify-between">
                  <TouchableOpacity onPress={() => onVerDetalles(it.id)} className="flex-1 mr-2 px-4 py-2 rounded-md border justify-center border-sky-300 bg-sky-100">
                    <Text className="text-title-color text-center">Ver detalles</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => onEnviarCorreccion(it.id)} className="flex-1 ml-2 px-4 py-2 rounded-md border border-rose-300 bg-rose-100">
                    <Text className="text-title-color text-center">Enviar para corrección</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {/* Row 2 buttons */}
              <View className="px-4 pb-4">
                <View className="mt-1 flex-row justify-between">
                  <TouchableOpacity onPress={() => onPausar(it.id)} className="flex-1 mr-2 px-4 py-2 rounded-md border justify-center border-gray-300 bg-gray-100 ">
                    <Text className="text-title-color text-center">Pausar </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => onEnviarEmpaque(it.id)} className="flex-1 ml-2 px-4 py-2 rounded-md border border-sky-300 bg-sky-100">
                    <Text className="text-title-color text-center">Enviar a empaque</Text>
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

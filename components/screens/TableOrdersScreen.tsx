import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import apiService from "../../services/apiService";

type Pedido = {
  id_pedido: number;
  estatus?: { n_estatusp?: string };
  id_estatuspago?: number;
};

type TableOrdersScreenProps = {
  onEditPedido?: (pedidoId: number) => void;
};

const statusStyle = (statusRaw: string | undefined) => {
  const s = (statusRaw || "").toLowerCase();
  if (s.includes("confirm"))
    return {
      bg: "bg-green-100",
      dot: "bg-green-500",
      text: "text-green-700",
      label: "Confirmado",
    };
  if (s.includes("error"))
    return {
      bg: "bg-red-100",
      dot: "bg-red-500",
      text: "text-red-700",
      label: "Error",
    };
  if (s.includes("paus"))
    return {
      bg: "bg-yellow-100",
      dot: "bg-yellow-500",
      text: "text-yellow-700",
      label: "Pausado",
    };
  if (s.includes("termin"))
    return {
      bg: "bg-gray-200",
      dot: "bg-gray-500",
      text: "text-gray-700",
      label: "Terminado",
    };
  return {
    bg: "bg-blue-100",
    dot: "bg-blue-500",
    text: "text-blue-700",
    label: statusRaw || "—",
  };
};

export default function TableOrdersScreen({
  onEditPedido,
}: TableOrdersScreenProps) {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPedidos = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiService.get<any>("/pedidos");
      const list = Array.isArray(res)
        ? res
        : Array.isArray(res?.data)
          ? res.data
          : [];
      const mapped: Pedido[] = list.map((p: any) => ({
        id_pedido: p.id_pedido ?? p.id ?? 0,
        estatus: p.estatus,
      }));
      setPedidos(mapped);
    } catch (e: any) {
      setError("No se pudieron cargar los pedidos");
      setPedidos([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPedidos();
  }, []);

  const handleEdit = (p: Pedido) => {
    if (onEditPedido) {
      onEditPedido(p.id_pedido);
    } else {
      Alert.alert("Editar", `Editar pedido ${p.id_pedido}`);
    }
  };

  return (
    <View className="flex-1 bg-background-color">
      <View className="pl-6 pr-0 pt-4 pb-2 flex-row items-center justify-between">
        <TouchableOpacity onPress={fetchPedidos} className="p-2">
          <Ionicons name="reload" size={20} color="#313E4B" />
        </TouchableOpacity>
      </View>

      <View className="pl-6 pr-0">
        <View className="border-t border-gray-300" />
        <View className="flex-row items-center py-3">
          <Text className="w-16 text-title-color font-semibold">Pedido</Text>
          <Text className="flex-[1] text-title-color font-semibold ml-2">
            Estado
          </Text>
          <Text className="w-10" />
        </View>
        <View className="border-b border-gray-300" />
      </View>

      <ScrollView
        contentContainerStyle={{
          paddingLeft: 24,
          paddingRight: 0,
          paddingBottom: 24,
        }}
      >
        {loading && (
          <Text className="text-gray-500 text-center mt-6">Cargando...</Text>
        )}
        {!loading && error && (
          <Text className="text-red-600 text-center mt-6">{error}</Text>
        )}
        {!loading && !error && pedidos.length === 0 && (
          <Text className="text-gray-500 text-center mt-6">No hay pedidos</Text>
        )}

        {!loading &&
          !error &&
          pedidos.map((p, idx) => {
            const s = p.estatus?.n_estatusp || "";
            const st = statusStyle(s);
            return (
              <View key={`${p.id_pedido}-${idx}`} className="py-3">
                <View className="flex-row items-center">
                  <Text className="w-16 text-title-color">{p.id_pedido}</Text>
                  <View
                    className={`flex-row items-center ${st.bg} px-2 py-1 rounded-full flex-[1] self-start ml-2`}
                  >
                    <View className={`w-2 h-2 rounded-full mr-2 ${st.dot}`} />
                    <Text className={`${st.text} text-sm`}>{st.label}</Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => handleEdit(p)}
                    className="w-10 items-center"
                  >
                    <Ionicons name="create-outline" size={24} color="#313E4B" />
                  </TouchableOpacity>
                </View>
                <View className="border-b border-gray-200 mt-3" />
              </View>
            );
          })}
      </ScrollView>
    </View>
  );
}

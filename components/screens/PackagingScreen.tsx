import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  Modal,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import apiService from "../../services/apiService";

type PedidoRaw = {
  id_pedido?: number;
  id?: number;
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
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d.getTime())) return iso;
  const pad = (n: number) => `${n}`.padStart(2, "0");
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
};

const prioridadStyle = (label: string) => {
  const s = (label || "").toLowerCase();
  if (s.includes("alta") || s.includes("urg"))
    return { bg: "bg-red-200", text: "text-red-800" };
  if (s.includes("normal") || s.includes("norm"))
    return { bg: "bg-green-200", text: "text-green-800" };
  if (s.includes("baja") || s.includes("baj"))
    return { bg: "bg-blue-200", text: "text-blue-800" };
  if (s.includes("devuelto") || s.includes("devu"))
    return { bg: "bg-red-200", text: "text-red-800" };
  return { bg: "bg-gray-200", text: "text-gray-800" };
};

export default function PackagingScreen() {
  const [items, setItems] = useState<PedidoUI[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [prioridadMap, setPrioridadMap] = useState<Record<number, string>>({});
  const [estatusPagoMap, setEstatusPagoMap] = useState<Record<number, string>>(
    {}
  );
  const [showModal, setShowModal] = useState(false);
  const [selectedPedidoDetails, setSelectedPedidoDetails] =
    useState<PedidoDetalle | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);
  const [enviando, setEnviando] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [prioridadRes, estatusRes, pedidosRes] = await Promise.all([
        apiService.get<any>("/prioridad"),
        apiService.get<any>("/estatus-pago"),
        apiService.get<any>("/pedidos/estatus/6"),
      ]);

      const priList: Array<{ id_prioridad: number; n_prioridad: string }> =
        Array.isArray(prioridadRes)
          ? prioridadRes
          : Array.isArray(prioridadRes?.data)
            ? prioridadRes.data
            : [];
      const estList: Array<{ id_estatuspago: number; n_estatuspago: string }> =
        Array.isArray(estatusRes)
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
        const cantidadTotal = (p.productos || []).reduce(
          (sum, pr) => sum + (Number(pr.cantidad) || 0),
          0
        );
        let prioridad = p.prioridad?.n_prioridad || "";
        if (!prioridad && p.id_prioridad != null)
          prioridad = pMap[p.id_prioridad] || "";
        let estatusPago =
          p.estatuspago?.n_estatuspago || p.estatus_pago?.n_estatuspago || "";
        if (!estatusPago && p.id_estatuspago != null)
          estatusPago = eMap[p.id_estatuspago] || "";
        return {
          id,
          fechaEntrega: formatFecha(p.fecha_entrega),
          cantidadTotal,
          prioridad,
          estatusPago,
        };
      });
      setItems(mapped);
    } catch (e: any) {
      setError(e?.message || "No se pudieron cargar los pedidos");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const onNotaCobro = () => {};
  const onEnviarCliente = () => {};

  const handleVerDetalles = async (id: number) => {
    try {
      setLoadingDetails(true);
      setShowModal(true);
      const detalles = await apiService.get<PedidoDetalle>(`/pedidos/${id}`);
      setSelectedPedidoDetails(detalles);
    } catch (err: any) {
      Alert.alert(
        "Error",
        err?.message || "No se pudieron cargar los detalles del pedido"
      );
      setShowModal(false);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleEnviarAEntrega = async (id: number) => {
    try {
      setEnviando(true);
      await apiService.put(`/pedidos/${id}/estatus`, {
        id_estatusp: 11, // 11 = Entregar
      });
      Alert.alert("Éxito", "Pedido enviado a entrega correctamente");
      // Recargar la lista de pedidos
      await loadData();
    } catch (err: any) {
      Alert.alert(
        "Error",
        err?.message || "No se pudo enviar el pedido a entrega"
      );
    } finally {
      setEnviando(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-background-color">
      <ScrollView contentContainerStyle={{ paddingVertical: 24 }}>
        {/* Encabezado */}
        <View className="items-center mb-6">
          <Image
            source={require("../../assets/logo_mota.png")}
            className="w-16 h-16 mb-3"
            resizeMode="contain"
          />
          <Text className="text-primary-color text-heading-xl font-bold mb-2">
            MOTA
          </Text>
          <Text className="text-title-color  mt-1  text-2xl font-bold">
            Pedidos listos para empacar
          </Text>
        </View>

        {loading && (
          <Text className="text-gray-500 text-center mt-6">Cargando...</Text>
        )}
        {!loading && error && (
          <Text className="text-red-600 text-center mt-6">{error}</Text>
        )}
        {!loading && !error && items.length === 0 && (
          <Text className="text-gray-500 text-center mt-6">
            No hay pedidos listos para envío
          </Text>
        )}

        {!loading &&
          !error &&
          items.map((it) => {
            const pStyle = prioridadStyle(it.prioridad);
            return (
              <View
                key={it.id}
                className="mx-4 mb-6 rounded-lg border border-gray-200 bg-white overflow-hidden"
              >
                {/* Header verde */}
                <View className="bg-green-100 px-4 py-3 flex-row items-center justify-between">
                  <View>
                    <Text className="text-title-color font-bold">
                      Pedido #{it.id}
                    </Text>
                    <Text className="text-title-color mt-1">
                      Cantidad {it.cantidadTotal}
                    </Text>
                    {!!it.fechaEntrega && (
                      <Text className="text-title-color mt-1">
                        {it.fechaEntrega}
                      </Text>
                    )}
                  </View>
                  <View className="items-end">
                    {!!it.prioridad && (
                      <View
                        className={`px-2 py-1 rounded-full ${pStyle.bg} mb-1`}
                      >
                        <Text
                          className={`${pStyle.text} text-xs font-semibold`}
                        >
                          {it.prioridad}
                        </Text>
                      </View>
                    )}
                    {!!it.estatusPago && (
                      <Text className="text-title-color text-xs">
                        {it.estatusPago}
                      </Text>
                    )}
                  </View>
                </View>

                {/* Acciones: Detalles y Enviar a entrega */}
                <View className="px-4 py-3 border-t border-gray-200">
                  <View className="flex-row justify-between gap-2">
                    <TouchableOpacity
                      onPress={() => handleVerDetalles(it.id)}
                      className="flex-1 px-4 py-2 rounded-md border border-sky-300 bg-sky-100 items-center justify-center"
                    >
                      <Text className="text-title-color text-center">
                        Detalles
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleEnviarAEntrega(it.id)}
                      disabled={enviando}
                      className="flex-1 px-4 py-2 rounded-md border border-green-300 bg-green-100 items-center justify-center"
                    >
                      {enviando ? (
                        <ActivityIndicator color="#313E4B" size="small" />
                      ) : (
                        <Text className="text-title-color text-center">
                          Enviar a entrega
                        </Text>
                      )}
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
                <Text className="text-title-color mt-4">
                  Cargando detalles...
                </Text>
              </View>
            ) : selectedPedidoDetails ? (
              <ScrollView className="p-5">
                {/* Información del pedido */}
                <View className="mb-4">
                  <Text className="text-base font-semibold text-gray-700 mb-3">
                    DATOS DEL PEDIDO
                  </Text>

                  <View className="flex-row py-2 border-b border-gray-100">
                    <Text className="text-gray-600 font-medium">
                      Fecha de entrega:
                    </Text>
                    <Text className="text-title-color font-semibold flex-1 text-right">
                      {formatFecha(selectedPedidoDetails.fecha_entrega)}
                    </Text>
                  </View>

                  <View className="flex-row py-2 border-b border-gray-100">
                    <Text className="text-gray-600 font-medium">Total:</Text>
                    <Text className="text-title-color font-semibold flex-1 text-right">
                      $
                      {selectedPedidoDetails.total?.toLocaleString("es-CO") ||
                        "0"}
                    </Text>
                  </View>
                </View>

                {/* Productos */}
                {selectedPedidoDetails.productos &&
                  selectedPedidoDetails.productos.length > 0 && (
                    <View className="mb-4">
                      <Text className="text-base font-semibold text-gray-700 mb-3">
                        PRODUCTOS
                      </Text>
                      {selectedPedidoDetails.productos.map((p, idx) => (
                        <View
                          key={idx}
                          className="mb-3 p-3 bg-gray-50 rounded-lg border border-gray-200"
                        >
                          <Text className="text-title-color font-semibold">
                            {p.producto?.n_producto || "Producto desconocido"}
                          </Text>
                          <Text className="text-gray-600 text-sm mt-1">
                            {p.producto?.descripcion || ""}
                          </Text>
                          <View className="flex-row justify-between mt-2">
                            <Text className="text-gray-600 text-sm">
                              Cantidad: {p.cantidad}
                            </Text>
                            <Text className="text-gray-600 text-sm">
                              ${p.subtotal?.toLocaleString("es-CO") || "0"}
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
                  <Text className="text-white font-semibold text-center">
                    Cerrar
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            ) : null}
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

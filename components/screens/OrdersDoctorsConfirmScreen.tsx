import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import apiService from "../../services/apiService";

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
  onViewDetails = (id: string) => console.log("Ver detalles", id),
  onConfirm = (id: string) => console.log("Confirmar", id),
  onReport = (id: string) => console.log("Reportar", id),
}: OrdersDoctorsConfirmScreenProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedOrderDetails, setSelectedOrderDetails] =
    useState<Order | null>(null);

  // Mapeo de prioridades
  const priorityNames: { [key: number]: string } = {
    1: "Baja",
    2: "Normal",
    3: "Alta",
    4: "Urgente",
    5: "Crítica",
  };

  // Mapeo de estados del proceso
  const statusNames: { [key: number]: string } = {
    1: "Pausa",
    2: "Dado",
    3: "Diseño",
    4: "Fresadora",
    5: "Control de calidad",
    6: "Empaque",
    7: "Finalizado",
    8: "Confirmado",
    9: "Rechazado",
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");

      console.log("🔍 Obteniendo pedidos del cliente 6...");
      const pedidos = await apiService.get<any[]>("/pedidos/cliente/6");
      console.log("✅ Pedidos recibidos:", pedidos);

      // Mapear los datos de la API al formato del componente
      const mappedOrders: Order[] = (pedidos || []).map((pedido: any) => {
        // Mapear productos
        const productos = (pedido.productos || []).map(
          (p: any) => `${p.producto?.n_producto || "Producto"} (x${p.cantidad})`
        );

        // Obtener nombre del estado desde el id_estatusp
        const estatusPedido = statusNames[pedido.id_estatusp] || "Pendiente";
        const estatusLower = estatusPedido.toLowerCase();
        // Confirmado si está en proceso (confirmado, dado, diseño, fresadora, etc.) y no está en pausa o rechazado
        const isConfirmed = !["pausa", "rechazado"].includes(estatusLower);

        return {
          id: pedido.id_pedido.toString(),
          status: estatusPedido,
          confirmed: isConfirmed,
          showDetails: false,
          details: {
            clientName: pedido.cliente?.nombre_completo || "Sin información",
            phone: "N/A",
            email: "N/A",
            requestName: pedido.cliente?.nombre_completo || "Sin información",
            products: productos,
            priority: priorityNames[pedido.id_prioridad] || "Normal",
            deliveryDate: new Date(pedido.fecha_entrega).toLocaleDateString(
              "es-ES"
            ),
            status: estatusPedido,
            price: "N/A",
            details: pedido.direccion || "Sin detalles",
            designer: `Diseñador #${pedido.id_disenador}`,
          },
        };
      });
      setOrders(mappedOrders);
    } catch (err: any) {
      console.error("❌ Error al obtener pedidos:", err);
      setError(err.message || "Error al cargar los pedidos");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = async (id: string) => {
    try {
      console.log("🔍 Obteniendo detalles del pedido:", id);

      // Obtener detalles completos del pedido
      const pedidoDetalle = await apiService.get<any>(`/pedidos/${id}`);
      console.log("✅ Detalle del pedido:", pedidoDetalle);

      // Obtener información de dado, diseñador y fresadora
      const [dadoInfo, disenadorInfo, fresadoraInfo, clienteInfo] =
        await Promise.all([
          apiService
            .get<any>(`/usuarios/${pedidoDetalle.id_dado}`)
            .catch(() => null),
          apiService
            .get<any>(`/usuarios/${pedidoDetalle.id_disenador}`)
            .catch(() => null),
          apiService
            .get<any>(`/usuarios/${pedidoDetalle.id_fresadora}`)
            .catch(() => null),
          apiService
            .get<any>(`/usuarios/${pedidoDetalle.id_cliente}`)
            .catch(() => null),
        ]);

      // Mapear productos con información completa
      const productos = (pedidoDetalle.productos || []).map(
        (p: any) =>
          `${p.producto?.n_producto || "Producto"} - Cantidad: ${p.cantidad} - Precio unitario: $${p.precio_unitario} - Subtotal: $${p.subtotal}`
      );

      const estatusPedido = pedidoDetalle.estatus?.n_estatusp || "Pendiente";
      const isPaused = estatusPedido.toLowerCase() === "pausa";

      const orderWithDetails: Order = {
        id: pedidoDetalle.id_pedido.toString(),
        status: estatusPedido,
        confirmed: !isPaused,
        showDetails: false,
        details: {
          clientName: clienteInfo?.nombre_completo || "Sin información",
          phone:
            clienteInfo?.telefono || clienteInfo?.telefono_consultorio || "N/A",
          email: clienteInfo?.correo || "N/A",
          requestName: clienteInfo?.nombre_completo || "Sin información",
          products: productos,
          priority: priorityNames[pedidoDetalle.id_prioridad] || "Normal",
          deliveryDate: new Date(
            pedidoDetalle.fecha_entrega
          ).toLocaleDateString("es-ES"),
          status: estatusPedido,
          price: `$${pedidoDetalle.total || 0}`,
          details: pedidoDetalle.direccion || "Sin detalles",
          designer:
            disenadorInfo?.nombre_completo ||
            `Diseñador #${pedidoDetalle.id_disenador}`,
        },
      };

      setSelectedOrderDetails(orderWithDetails);
      setModalVisible(true);
    } catch (err) {
      console.error("❌ Error al obtener detalles:", err);
    }
  };

  const handleConfirm = async (id: string) => {
    try {
      console.log("Confirmando pedido:", id);

      // Actualizar el estado del pedido a "Confirmado" (id_estatusp = 8)
      await apiService.put(`/pedidos/${id}/estatus`, {
        id_estatusp: 8,
      });

      console.log("✅ Pedido confirmado exitosamente");

      // Cerrar modal primero
      setModalVisible(false);
      setSelectedOrderDetails(null);

      // Refrescar la lista de pedidos desde el servidor
      await fetchOrders();
    } catch (err) {
      console.error("Error al confirmar pedido:", err);
    }
  };

  const handleReport = async (id: string) => {
    try {
      // Aquí deberías hacer la llamada a la API para reportar el error
      console.log("Reportando error del pedido:", id);

      setOrders(orders.filter((order) => order.id !== id));

      setModalVisible(false);
      setSelectedOrderDetails(null);
    } catch (err) {
      console.error("Error al reportar pedido:", err);
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
    <SafeAreaView
      className="flex-1 bg-background-color"
      edges={["top", "right", "bottom", "left"]}
    >
      <View className="flex-1 p-4">
        <ScrollView showsVerticalScrollIndicator={false}>
          {orders.length === 0 ? (
            <View className="p-8 items-center">
              <Ionicons name="document-outline" size={48} color="#94C6CC" />
              <Text className="text-gray-500 mt-4">
                No hay pedidos disponibles
              </Text>
            </View>
          ) : (
            orders.map((order, index) => (
              <View
                key={`${order.id}-${index}`}
                className="bg-white rounded-lg mb-4 p-4 shadow-sm border border-gray-100"
              >
                {/* Header de la tarjeta */}
                <View className="flex-row justify-between items-center mb-3">
                  <Text className="text-lg font-bold text-title-color">
                    Pedido #{order.id}
                  </Text>
                  <View className="flex-row gap-2">
                    <TouchableOpacity
                      onPress={() => handleViewDetails(order.id)}
                      className="p-2"
                    >
                      <Ionicons name="eye-outline" size={20} color="#313E4B" />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleReport(order.id)}
                      className="p-2"
                    >
                      <Ionicons
                        name="alert-circle-outline"
                        size={20}
                        color="#313E4B"
                      />
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() => handleConfirm(order.id)}
                      className="p-2"
                    >
                      <Ionicons
                        name="checkmark-circle-outline"
                        size={20}
                        color="#313E4B"
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                {/* Información del pedido */}
                <View className="space-y-2">
                  {order.details?.clientName &&
                    order.details.clientName !== "Sin información" && (
                      <View className="flex-row py-2 border-b border-gray-100">
                        <Text className="text-gray-600 w-28">Cliente</Text>
                        <Text className="text-title-color font-medium flex-1">
                          {order.details.clientName}
                        </Text>
                      </View>
                    )}

                  <View className="flex-row py-2 border-b border-gray-100">
                    <Text className="text-gray-600 w-28">Prioridad</Text>
                    <Text className="text-title-color font-medium flex-1">
                      {order.details?.priority || "N/A"}
                    </Text>
                  </View>

                  <View className="flex-row py-2 border-b border-gray-100">
                    <Text className="text-gray-600 w-28">Entrega</Text>
                    <Text className="text-title-color font-medium flex-1">
                      {order.details?.deliveryDate || "N/A"}
                    </Text>
                  </View>

                  <View className="flex-row py-2">
                    <Text className="text-gray-600 w-28">Estado</Text>
                    <View className="flex-row items-center flex-1">
                      <View
                        className={`w-2 h-2 rounded-full mr-2 ${
                          order.confirmed ? "bg-green-500" : "bg-red-500"
                        }`}
                      />
                      <Text className="text-title-color font-medium">
                        {order.status}
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Ver más */}
                <TouchableOpacity
                  onPress={() => handleViewDetails(order.id)}
                  className="mt-3 items-center"
                >
                  <View className="flex-row items-center">
                    <Text className="text-primary-color font-medium mr-1">
                      Ver más
                    </Text>
                    <Ionicons name="chevron-down" size={16} color="#5FA2AD" />
                  </View>
                </TouchableOpacity>
              </View>
            ))
          )}
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
                      DATOS DEL PEDIDO
                    </Text>
                    <Text className="text-title-color mb-1">
                      <Text className="font-bold text-black">
                        Nombre del solicitante:
                      </Text>{" "}
                      {selectedOrderDetails.details.requestName}
                    </Text>
                    <Text className="text-title-color mb-1">
                      <Text className="font-bold text-black">Productos:</Text>
                    </Text>
                    {selectedOrderDetails.details.products.length > 0 ? (
                      selectedOrderDetails.details.products.map(
                        (product, i) => (
                          <Text key={i} className="text-title-color mb-1">
                            {" "}
                            • {product}
                          </Text>
                        )
                      )
                    ) : (
                      <Text className="text-gray-500 mb-1">
                        {" "}
                        • Sin productos registrados
                      </Text>
                    )}
                    <Text className="text-title-color mb-1">
                      <Text className="font-bold text-black">Prioridad:</Text>{" "}
                      {selectedOrderDetails.details.priority}
                    </Text>
                    <Text className="text-title-color mb-1">
                      <Text className="font-bold text-black">
                        Fecha estimada de entrega:
                      </Text>{" "}
                      {selectedOrderDetails.details.deliveryDate}
                    </Text>
                    <Text className="text-title-color mb-1">
                      <Text className="font-bold text-black">
                        Estatus de pago:
                      </Text>{" "}
                      {selectedOrderDetails.details.status} (
                      {selectedOrderDetails.details.price})
                    </Text>
                    <Text className="text-title-color mb-4">
                      <Text className="font-bold text-black">
                        Detalles del pedido:
                      </Text>{" "}
                      {selectedOrderDetails.details.details}
                    </Text>

                    {/* Botones */}
                    <View className="flex-row justify-center gap-3 mt-6">
                      <TouchableOpacity
                        className="bg-primary-color py-3 px-6 rounded-lg min-w-[130px] items-center"
                        onPress={() => handleConfirm(selectedOrderDetails.id)}
                      >
                        <Text className="text-white font-semibold text-base">
                          Confirmar
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        className="bg-red-500 py-3 px-6 rounded-lg min-w-[130px] items-center"
                        onPress={() => handleReport(selectedOrderDetails.id)}
                      >
                        <Text className="text-white font-semibold text-base">
                          Reportar error
                        </Text>
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

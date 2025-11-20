import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import apiService from "../../services/apiService";

type Notification = {
  id_notificacion: number;
  id_usuario: number;
  titulo: string;
  mensaje: string;
  leida: boolean;
  tipo: string;
  id_pedido: number;
  created_at: string;
};

type NotificationResponse = {
  userId: string;
  count: number;
  notificaciones: Notification[];
};

type DoctorNotificationScreenProps = {
  onNavigateToConfirm: () => void;
};

export default function DoctorNotificationScreen({
  onNavigateToConfirm,
}: DoctorNotificationScreenProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await apiService.get<NotificationResponse>(
        "/notificaciones/user/6"
      );
      // Filtrar solo notificaciones no leídas
      const unread = (response?.notificaciones || []).filter((n) => !n.leida);
      setNotifications(unread);
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notification: Notification) => {
    try {
      // Marcar como leída en el backend (usando PATCH)
      await apiService.patch(
        `/notificaciones/mark-read/${notification.id_notificacion}`,
        {}
      );
      // Remover de la lista local
      setNotifications(
        notifications.filter(
          (n) => n.id_notificacion !== notification.id_notificacion
        )
      );
      // Navegar a confirmación
      onNavigateToConfirm();
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  if (loading) {
    return (
      <SafeAreaView
        className="flex-1 bg-background-color"
        edges={["right", "bottom", "left"]}
      >
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#2ECC71" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      className="flex-1 bg-background-color"
      edges={["right", "bottom", "left"]}
    >
      <View className="flex-1 p-4">
        <ScrollView showsVerticalScrollIndicator={false}>
          {notifications.length > 0 ? (
            notifications.map((notification) => (
              <TouchableOpacity
                key={notification.id_notificacion}
                className="bg-button-green rounded-lg mb-3 p-4 flex-row items-center justify-between"
                onPress={() => handleMarkAsRead(notification)}
              >
                <View className="flex-row items-center flex-1">
                  <Ionicons
                    name="notifications-outline"
                    size={24}
                    color="#313E4B"
                    style={{ marginRight: 12 }}
                  />
                  <View className="flex-1">
                    <Text className="text-title-color text-base font-semibold">
                      {notification.titulo}
                    </Text>
                    <Text className="text-title-color text-sm mt-1">
                      {notification.mensaje}
                    </Text>
                  </View>
                </View>
                <Ionicons name="chevron-forward" size={24} color="#313E4B" />
              </TouchableOpacity>
            ))
          ) : (
            <View className="items-center justify-center mt-8">
              <Text className="text-title-color text-base">
                No hay notificaciones
              </Text>
            </View>
          )}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

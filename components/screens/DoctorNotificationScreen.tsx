import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

type DoctorNotificationScreenProps = {
  onNavigateToConfirm: () => void;
};

export default function DoctorNotificationScreen({ onNavigateToConfirm }: DoctorNotificationScreenProps) {
  const notifications = [
    {
      id: '1',
      title: 'Confirmar pedido',
      description: 'Se requiere confirmación del pedido',
    },
    {
      id: '2',
      title: 'Confirmar pedido',
      description: 'Se requiere confirmación del pedido',
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-background-color" edges={['right', 'bottom', 'left']}>
      <View className="flex-1 p-4">
       

        <ScrollView>
          {notifications.map((notification) => (
            <TouchableOpacity
              key={notification.id}
              className="bg-button-green rounded-lg mb-3 p-4 flex-row items-center justify-between"
              onPress={onNavigateToConfirm}
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
                    {notification.title}
                  </Text>
                  <Text className="text-title-color text-sm mt-1">
                    {notification.description}
                  </Text>
                </View>
              </View>
              <Ionicons 
                name="chevron-forward" 
                size={24} 
                color="#313E4B" 
              />
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

type MenuItemProps = {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
};

export default function MenuItem({ icon, label, active = false }: MenuItemProps) {
  return (
    <TouchableOpacity
      className={`flex-row items-center px-3 py-2 rounded-md mx-1 ${active ? 'bg-menu-active' : ''}`}
    >
      <View className={`mr-3 ${active ? 'text-white' : 'text-title-color'}`}>{icon}</View>
      <Text 
        className={`text-sm font-medium ${active ? 'text-white' : 'text-title-color'}`}
        numberOfLines={1}
      >
        {label}
      </Text>
    </TouchableOpacity>
  );
}

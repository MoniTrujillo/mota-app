import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';

interface MenuItemProps {
  icon: React.ReactNode;
  label: string;
  onPress?: () => void;
  active?: boolean;
}

const MenuItem = ({ icon, label, onPress, active = false }: MenuItemProps) => {
  return (
    <TouchableOpacity
      onPress={onPress}
      className={`flex-row items-center px-4 mx-1 rounded-md ${active ? 'bg-menu-active' : ''}`}
      style={{ height: 44 }}
    >
      <View className="w-6 h-6 justify-center items-center">
        {icon}
      </View>
      <Text className={`ml-3 ${active ? 'text-white' : 'text-title-color'} text-sm`}>{label}</Text>
    </TouchableOpacity>
  );
};

export default MenuItem;

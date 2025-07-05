import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import './global.css';

export default function App() {
  const testAxios = async () => {
    try {
      const response = await axios.get('https://jsonplaceholder.typicode.com/posts/1');
      Alert.alert('Success', `Title: ${response.data.title}`);
    } catch (error) {
      Alert.alert('Error', 'Failed to fetch data');
    }
  };

  return (
    <View className="flex-1 bg-blue-100 items-center justify-center">
      <Text className="text-2xl font-bold text-blue-800 mb-4">
        ¡Mota App!
      </Text>
      
      <View className="bg-white p-6 rounded-lg shadow-lg mb-4">
        <Ionicons name="checkmark-circle" size={48} color="green" />
        <Text className="text-lg text-gray-800 mt-2">
          Packages installed successfully!
        </Text>
      </View>

      <TouchableOpacity
        className="bg-blue-500 px-6 py-3 rounded-full flex-row items-center"
        onPress={testAxios}
      >
        <Ionicons name="download" size={20} color="white" />
        <Text className="text-white ml-2 font-semibold">
          Test Axios
        </Text>
      </TouchableOpacity>

      <View className="mt-6 flex-row space-x-4">
        <Ionicons name="heart" size={24} color="red" />
        <Ionicons name="star" size={24} color="gold" />
        <Ionicons name="thumbs-up" size={24} color="blue" />
      </View>

      <StatusBar style="auto" />
    </View>
  );
}

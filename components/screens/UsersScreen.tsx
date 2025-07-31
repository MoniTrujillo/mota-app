import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  ActivityIndicator,
  RefreshControl,
  Alert,
  StyleSheet
} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import apiService from '../../services/apiService';
import { User } from '../../contexts/AuthContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import LoadingScreen from '../LoadingScreen';

interface UserExtended extends User {
  area?: {
    n_area: string;
    id_area: number;
  };
  funcion?: {
    n_funcion: string;
    id_funcion: number;
  };
}

export default function UsersScreen() {
  const [users, setUsers] = useState<UserExtended[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Función para cargar los usuarios
  const fetchUsers = async (showLoader = true) => {
    if (showLoader) setLoading(true);
    setError(null);
    
    try {
      // Obtener los usuarios desde la API
      const fetchedUsers = await apiService.get<UserExtended[]>('/usuarios');
      
      if (Array.isArray(fetchedUsers)) {
        setUsers(fetchedUsers);
      } else {
        console.error('Formato de respuesta inesperado:', fetchedUsers);
        setError('Error al obtener los datos de usuarios');
      }
    } catch (err: any) {
      console.error('Error al cargar usuarios:', err);
      setError(err.message || 'Error al cargar los usuarios');
      Alert.alert('Error', 'No se pudieron cargar los usuarios. Intente nuevamente.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Función para refrescar la lista
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchUsers(false);
  };

  // Cargar los usuarios al montar el componente
  useEffect(() => {
    fetchUsers();
  }, []);

  // Función para obtener el color según la función del usuario
  const getFunctionColor = (funcion: { n_funcion: string } | undefined) => {
    if (!funcion) return '#888'; // Color por defecto
    
    const funcionName = funcion.n_funcion;
    switch (funcionName.toLowerCase()) {
      case 'administrador':
        return '#1e88e5'; // Azul
      case 'médico':
      case 'medico':
        return '#43a047'; // Verde
      case 'trabajador':
        return '#fb8c00'; // Naranja
      default:
        return '#888'; // Gris para otras funciones
    }
  };

  // Renderizar cada usuario en la lista
  const renderUser = ({ item }: { item: UserExtended }) => {
    const functionColor = getFunctionColor(item.funcion);
    
    return (
      <View className="bg-white mb-3 rounded-lg shadow-sm overflow-hidden">
        <View className="p-4">
          {/* Nombre y función */}
          <View className="flex-row justify-between items-center">
            <Text className="text-title-color text-lg font-bold">{item.nombre_completo}</Text>
            <View style={{backgroundColor: functionColor}} className="rounded-full px-3 py-1">
              <Text className="text-white text-xs font-medium">{item.funcion?.n_funcion || 'Sin función'}</Text>
            </View>
          </View>
          
          {/* Área */}
          <Text className="text-gray-600 text-sm mt-1">{item.area?.n_area || 'Sin área asignada'}</Text>
          
          {/* Datos de contacto */}
          <View className="mt-3">
            <View className="flex-row items-center mt-1">
              <Ionicons name="mail-outline" size={16} color="#666" />
              <Text className="text-gray-700 ml-2">{item.correo}</Text>
            </View>
            
            <View className="flex-row items-center mt-1">
              <Ionicons name="call-outline" size={16} color="#666" />
              <Text className="text-gray-700 ml-2">{item.telefono}</Text>
            </View>
            
            {item.telefono_consultorio && (
              <View className="flex-row items-center mt-1">
                <MaterialCommunityIcons name="office-building" size={16} color="#666" />
                <Text className="text-gray-700 ml-2">Consultorio: {item.telefono_consultorio}</Text>
              </View>
            )}
          </View>
        </View>
      </View>
    );
  };

  // Mostrar pantalla de carga mientras se obtienen los usuarios
  if (loading) {
    return <LoadingScreen message="Cargando usuarios..." />;
  }

  // Mostrar mensaje de error si ocurrió un problema
  if (error) {
    return (
      <View className="flex-1 items-center justify-center bg-background-color p-4">
        <Ionicons name="alert-circle-outline" size={48} color="#e53935" />
        <Text className="text-title-color text-lg font-bold mt-4 text-center">
          No se pudieron cargar los usuarios
        </Text>
        <Text className="text-gray-600 mt-2 mb-6 text-center">
          {error}
        </Text>
        <TouchableOpacity 
          className="bg-primary-color px-4 py-3 rounded-md"
          onPress={() => fetchUsers()}
        >
          <Text className="text-white font-medium">Intentar nuevamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // Mostrar lista de usuarios o mensaje si no hay usuarios
  return (
    <View className="flex-1 bg-background-color p-4">
      {users.length > 0 ? (
        <FlatList
          data={users}
          renderItem={renderUser}
          keyExtractor={(item) => item.id_usuario.toString()}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 20 }}
          refreshControl={
            <RefreshControl 
              refreshing={refreshing} 
              onRefresh={onRefresh}
              colors={["#0088cc"]}
              tintColor="#0088cc"
            />
          }
        />
      ) : (
        <View className="flex-1 items-center justify-center">
          <Ionicons name="people-outline" size={64} color="#888" />
          <Text className="text-title-color text-lg font-bold mt-4">
            No hay usuarios registrados
          </Text>
          <Text className="text-gray-600 mt-2 text-center">
            Aún no se ha registrado ningún usuario en el sistema
          </Text>
          <TouchableOpacity 
            className="bg-primary-color px-4 py-3 rounded-md mt-6"
            onPress={() => fetchUsers()}
          >
            <Text className="text-white font-medium">Refrescar</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

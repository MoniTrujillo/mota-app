import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Modal,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import apiService from '../services/apiService';
import { Area, Funcion } from '../types/api'; 

export default function RegisterScreen() {
  const [area, setArea] = useState('');
  const [funcion, setFuncion] = useState('');
  const [showAreaModal, setShowAreaModal] = useState(false);
  const [showFuncionModal, setShowFuncionModal] = useState(false);

  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefonoConsultorio, setTelefonoConsultorio] = useState('');
  const [password, setPassword] = useState('');

  // Estados para datos de la API
  const [areas, setAreas] = useState<Area[]>([]);
  const [funciones, setFunciones] = useState<Funcion[]>([]);
  const [loading, setLoading] = useState(true);

  // Cargar datos al montar el componente
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Hacer peticiones en paralelo
        const [areasResponse, funcionesResponse] = await Promise.all([
          apiService.get<Area[]>('/areas'),
          apiService.get<Funcion[]>('/funciones')
        ]);
        
        // Cargar datos desde la API
        setAreas(areasResponse);
        setFunciones(funcionesResponse);
      } catch (error: any) {
        console.error('Error fetching data:', error);
        Alert.alert('Error', 'No se pudieron cargar los datos. Intenta nuevamente.');
        
        // Fallback a datos estáticos si falla la API
        setFunciones([
          { id_funcion: 1, n_funcion: 'administrador' },
          { id_funcion: 2, n_funcion: 'trabajador' },
          { id_funcion: 3, n_funcion: 'doctor' },
        ]);
        setAreas([
          { id_area: 1, n_area: 'administrativa' },
          { id_area: 2, n_area: 'secretaria' },
          { id_area: 3, n_area: 'diseño' },
          { id_area: 4, n_area: 'dado' },
          { id_area: 5, n_area: 'fresadora' },
          { id_area: 6, n_area: 'control de calidad' },
          { id_area: 7, n_area: 'área de empaque' },
          { id_area: 8, n_area: 'otro' },
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Si está cargando, mostrar mensaje
  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-background-color justify-center items-center">
        <Text className="text-black text-lg">Cargando...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background-color"> 
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{
            alignItems: 'center',
            paddingHorizontal: 24,
            paddingTop: 48,
            paddingBottom: 80,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Image
            source={require('../assets/logo_mota.png')}
            className="w-16 h-16 mb-3"
            resizeMode="contain"
          />
          <Text className="text-primary-color text-heading-xl font-bold mb-2">MOTA</Text>

          <Text className="text-title-color text-heading-lg font-semibold mb-8 mt-6">
            Crear Cuenta
          </Text>

          <View className="w-full max-w-xs">
            <Text className="text-label font-bold text-black mb-2">Nombre Completo</Text>
            <TextInput
              className="bg-input-color rounded-md px-4 py-3 text-black text-base mb-4"
              placeholder="Nombre"
              value={nombre}
              onChangeText={setNombre}
            />

            {/* Área */}
            <Text className="text-label font-bold text-black mb-2">Área</Text>
            <TouchableOpacity
              onPress={() => setShowAreaModal(true)}
              className="bg-input-color rounded-md px-4 py-3 mb-4"
            >
              <Text className="text-black">{area || 'Seleccionar Área'}</Text>
            </TouchableOpacity>

            {/* Función */}
            <Text className="text-label font-bold text-black mb-2">Función</Text>
            <TouchableOpacity
              onPress={() => setShowFuncionModal(true)}
              className="bg-input-color rounded-md px-4 py-3 mb-4"
            >
              <Text className="text-black">{funcion || 'Seleccionar Función'}</Text>
            </TouchableOpacity>

            {/* Teléfono */}
            <Text className="text-label font-bold text-black mb-2">Teléfono</Text>
            <TextInput
              className="bg-input-color rounded-md px-4 py-3 text-black text-base mb-4"
              keyboardType="phone-pad"
              value={telefono}
              onChangeText={setTelefono}
            />

            {/* Correo */}
            <Text className="text-label font-bold text-black mb-2">Correo</Text>
            <TextInput
              className="bg-input-color rounded-md px-4 py-3 text-black text-base mb-4"
              keyboardType="email-address"
              value={correo}
              onChangeText={setCorreo}
            />

            {/* Teléfono Consultorio solo si es doctor */}
            {funcion === 'doctor' && (
              <>
                <Text className="text-label font-bold text-black mb-2">Teléfono Consultorio</Text>
                <TextInput
                  className="bg-input-color rounded-md px-4 py-3 text-black text-base mb-4"
                  keyboardType="phone-pad"
                  value={telefonoConsultorio}
                  onChangeText={setTelefonoConsultorio}
                />
              </>
            )}

            {/* Contraseña */}
            <Text className="text-label font-bold text-black mb-2">Contraseña</Text>
            <TextInput
              className="bg-input-color rounded-md px-4 py-3 text-black text-base mb-6"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />

            {/* Botón */}
            <TouchableOpacity className="bg-primary-color px-4 py-3 rounded-md shadow-md w-button-width self-center">
              <Text className="text-white text-center font-medium text-base">
                Crear Cuenta
              </Text>
            </TouchableOpacity>

            <TouchableOpacity className="mt-4 self-center">
              <Text className="text-primary-color font-medium underline">Cancelar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        {/* Modal Área */}
        <Modal visible={showAreaModal} transparent animationType="fade">
          <TouchableOpacity 
            className="flex-1 justify-center items-center bg-black/40"
            activeOpacity={1}
            onPress={() => setShowAreaModal(false)}
          >
            <TouchableOpacity 
              className="bg-white rounded-lg w-4/5 p-4"
              activeOpacity={1}
              onPress={() => {}}
            >
              <ScrollView>
                {areas.map((item) => (
                  <TouchableOpacity
                    key={`area-${item.id_area}`}
                    onPress={() => {
                      setArea(item.n_area);
                      setShowAreaModal(false);
                    }}
                    className="py-2"
                  >
                    <Text className="text-black">{item.n_area}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>

        {/* Modal Función */}
        <Modal visible={showFuncionModal} transparent animationType="fade">
          <TouchableOpacity 
            className="flex-1 justify-center items-center bg-black/40"
            activeOpacity={1}
            onPress={() => setShowFuncionModal(false)}
          >
            <TouchableOpacity 
              className="bg-white rounded-lg w-4/5 p-4"
              activeOpacity={1}
              onPress={() => {}}
            >
              <ScrollView>
                {funciones.map((item) => (
                  <TouchableOpacity
                    key={`funcion-${item.id_funcion}`}
                    onPress={() => {
                      setFuncion(item.n_funcion);
                      setShowFuncionModal(false);
                    }}
                    className="py-2"
                  >
                    <Text className="text-black">{item.n_funcion}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView> 
  );
}

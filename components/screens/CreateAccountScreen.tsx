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
import apiService from '../../services/apiService';
import { Area, Funcion, CreateUserRequest } from '../../types/api';
import { Ionicons } from '@expo/vector-icons';

export default function CreateAccountScreen({ navigation }: { navigation?: any }) {
  const scrollViewRef = React.useRef<ScrollView>(null);

  const [area, setArea] = useState('');
  const [funcion, setFuncion] = useState('');
  const [showAreaModal, setShowAreaModal] = useState(false);
  const [showFuncionModal, setShowFuncionModal] = useState(false);

  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState('');
  const [telefonoConsultorio, setTelefonoConsultorio] = useState('');
  const [password, setPassword] = useState('');

  const [areas, setAreas] = useState<Area[]>([]);
  const [funciones, setFunciones] = useState<Funcion[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const resetForm = () => {
    setNombre('');
    setArea('');
    setFuncion('');
    setTelefono('');
    setCorreo('');
    setTelefonoConsultorio('');
    setPassword('');
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true });
    }
  };

  const handleRegister = async () => {
    try {
      if (!nombre.trim()) {
        Alert.alert('Error', 'Por favor ingresa tu nombre completo');
        return;
      }
      if (!area) {
        Alert.alert('Error', 'Por favor selecciona un área');
        return;
      }
      if (!funcion) {
        Alert.alert('Error', 'Por favor selecciona una función');
        return;
      }
      if (!telefono.trim()) {
        Alert.alert('Error', 'Por favor ingresa tu teléfono');
        return;
      }
      if (!correo.trim()) {
        Alert.alert('Error', 'Por favor ingresa tu correo');
        return;
      }
      if (!password.trim()) {
        Alert.alert('Error', 'Por favor ingresa una contraseña');
        return;
      }

      if ((funcion.toLowerCase() === 'doctor' || funcion.toLowerCase() === 'médico') && !telefonoConsultorio.trim()) {
        Alert.alert('Error', 'Por favor ingresa el teléfono del consultorio');
        return;
      }

      setSubmitting(true);

      const selectedArea = areas.find(a => a.n_area === area);
      const selectedFuncion = funciones.find(f => f.n_funcion === funcion);

      if (!selectedArea || !selectedFuncion) {
        Alert.alert('Error', 'Error al obtener la información seleccionada');
        return;
      }

      const userData: CreateUserRequest = {
        nombre_completo: nombre.trim(),
        id_area: selectedArea.id_area,
        id_funcion: selectedFuncion.id_funcion,
        telefono: telefono.trim(),
        contrasena: password.trim(),
        correo: correo.trim().toLowerCase(),
      };

      if ((funcion.toLowerCase() === 'doctor' || funcion.toLowerCase() === 'médico') && telefonoConsultorio.trim()) {
        userData.telefono_consultorio = telefonoConsultorio.trim();
      }

      await apiService.post('/usuarios', userData);

      Alert.alert('Éxito', 'Usuario creado exitosamente', [
        {
          text: 'OK',
          onPress: () => {
            resetForm();
            navigation?.navigate?.('Login');
          }
        }
      ]);

    } catch (error: any) {
      console.error('Error creating user:', error);
      Alert.alert('Error', error.message || 'Error al crear el usuario. Intenta nuevamente.');
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [areasResponse, funcionesResponse] = await Promise.all([
          apiService.get<Area[]>('/areas'),
          apiService.get<Funcion[]>('/funciones')
        ]);
        setAreas(areasResponse);
        setFunciones(funcionesResponse);
      } catch (error: any) {
        console.error('Error fetching data:', error);
        Alert.alert('Error', 'No se pudieron cargar los datos. Intenta nuevamente.');
        setFunciones([
          { id_funcion: 1, n_funcion: 'administrador' },
          { id_funcion: 2, n_funcion: 'trabajador' },
          { id_funcion: 3, n_funcion: 'médico' },
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

  if (loading) {
    return (
      <View className="flex-1 bg-background-color justify-center items-center">
        <Text className="text-black text-lg">Cargando...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-background-color">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={{
            alignItems: 'center',
            paddingHorizontal: 24,
            paddingTop: 32,
            paddingBottom: 80,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Image
            source={require('../../assets/logo_mota.png')}
            className="w-16 h-16 mb-3"
            resizeMode="contain"
          />
          <Text className="text-primary-color text-heading-xl font-bold mb-2">MOTA</Text>

          <View className="w-full max-w-xs">
            <Text className="text-title-color font-bold text-label mb-2">Nombre Completo</Text>
            <TextInput
              className="bg-input-color rounded-md px-4 py-3 text-black text-base mb-4 h-12"
              placeholder="Nombre"
              value={nombre}
              onChangeText={setNombre}
              multiline={false}
              style={{ fontSize: 16 }}
            />

            <Text className="text-title-color font-bold text-label mb-2">Área</Text>
            <TouchableOpacity
              onPress={() => setShowAreaModal(true)}
              className="bg-input-color rounded-md px-4 py-3 mb-4 flex-row items-center h-12"
            >
              <Text className={`flex-1 ${area ? 'text-black' : 'text-gray-500'}`}>{area || 'Seleccionar'}</Text>
              <Ionicons name="chevron-forward-outline" size={20} color="#313E4B" />
            </TouchableOpacity>

            <Text className="text-title-color font-bold text-label mb-2">Función</Text>
            <TouchableOpacity
              onPress={() => setShowFuncionModal(true)}
              className="bg-input-color rounded-md px-4 py-3 mb-4 flex-row items-center h-12"
            >
              <Text className={`flex-1 ${funcion ? 'text-black' : 'text-gray-500'}`}>{funcion || 'Seleccionar'}</Text>
              <Ionicons name="chevron-forward-outline" size={20} color="#313E4B" />
            </TouchableOpacity>

            <Text className="text-title-color font-bold text-label mb-2">Teléfono</Text>
            <TextInput
              className="bg-input-color rounded-md px-4 py-3 text-black text-base mb-4 h-12"
              keyboardType="phone-pad"
              value={telefono}
              onChangeText={setTelefono}
              multiline={false}
              style={{ fontSize: 16 }}
            />

            <Text className="text-title-color font-bold text-label mb-2">Correo</Text>
            <TextInput
              className="bg-input-color rounded-md px-4 py-3 text-black text-base mb-4 h-12"
              keyboardType="email-address"
              value={correo}
              onChangeText={setCorreo}
              multiline={false}
              style={{ fontSize: 16 }}
            />

            {(funcion.toLowerCase() === 'doctor' || funcion.toLowerCase() === 'médico') && (
              <>
                <Text className="text-title-color font-bold text-label mb-2">Teléfono Consultorio</Text>
                <TextInput
                  className="bg-input-color rounded-md px-4 py-3 text-black text-base mb-4 h-12"
                  keyboardType="phone-pad"
                  value={telefonoConsultorio}
                  onChangeText={setTelefonoConsultorio}
                  multiline={false}
                  style={{ fontSize: 16 }}
                />
              </>
            )}

            <Text className="text-title-color font-bold text-label mb-2">Contraseña</Text>
            <TextInput
              className="bg-input-color rounded-md px-4 py-3 text-black text-base mb-6 h-12"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              multiline={false}
              style={{ fontSize: 16 }}
            />

            <TouchableOpacity
              className="bg-primary-color px-4 py-3 rounded-md shadow-md w-button-width self-center"
              onPress={handleRegister}
              disabled={submitting}
            >
              <Text className="text-white text-center font-medium text-base">
                {submitting ? 'Creando...' : 'Crear Cuenta'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              className="mt-4 self-center"
              onPress={() => {
                resetForm();
                if (navigation?.canGoBack?.()) {
                  navigation.goBack();
                }
              }}
            >
              <Text className="text-primary-color font-medium underline">Cancelar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>

        <Modal
          visible={showAreaModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowAreaModal(false)}
        >
          <View className="flex-1 bg-black/50 justify-end">
            <SafeAreaView edges={['bottom']} className="bg-white rounded-t-2xl p-4">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-title-color text-lg font-bold">Área</Text>
                <TouchableOpacity onPress={() => setShowAreaModal(false)}>
                  <Ionicons name="close" size={24} color="#313E4B" />
                </TouchableOpacity>
              </View>
              <ScrollView>
                {areas.map((item) => (
                  <TouchableOpacity
                    key={`area-${item.id_area}`}
                    className="py-3 border-b border-gray-200 flex-row items-center"
                    onPress={() => {
                      setArea(item.n_area);
                      setShowAreaModal(false);
                    }}
                  >
                    <Text className="text-black flex-1">{item.n_area}</Text>
                    {area === item.n_area && (
                      <Ionicons name="checkmark" size={20} color="#0088cc" />
                    )}
                  </TouchableOpacity>
                ))}
                {areas.length === 0 && (
                  <View className="py-6 items-center">
                    <Text className="text-gray-500">No hay áreas disponibles</Text>
                  </View>
                )}
              </ScrollView>
            </SafeAreaView>
          </View>
        </Modal>

        <Modal
          visible={showFuncionModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowFuncionModal(false)}
        >
          <View className="flex-1 bg-black/50 justify-end">
            <SafeAreaView edges={['bottom']} className="bg-white rounded-t-2xl p-4">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-title-color text-lg font-bold">Función</Text>
                <TouchableOpacity onPress={() => setShowFuncionModal(false)}>
                  <Ionicons name="close" size={24} color="#313E4B" />
                </TouchableOpacity>
              </View>
              <ScrollView>
                {funciones.map((item) => (
                  <TouchableOpacity
                    key={`funcion-${item.id_funcion}`}
                    className="py-3 border-b border-gray-200 flex-row items-center"
                    onPress={() => {
                      setFuncion(item.n_funcion);
                      setShowFuncionModal(false);
                    }}
                  >
                    <Text className="text-black flex-1">{item.n_funcion}</Text>
                    {funcion === item.n_funcion && (
                      <Ionicons name="checkmark" size={20} color="#0088cc" />
                    )}
                  </TouchableOpacity>
                ))}
                {funciones.length === 0 && (
                  <View className="py-6 items-center">
                    <Text className="text-gray-500">No hay funciones disponibles</Text>
                  </View>
                )}
              </ScrollView>
            </SafeAreaView>
          </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

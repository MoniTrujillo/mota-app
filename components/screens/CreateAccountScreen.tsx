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

export default function CreateAccountScreen({ navigation }: { navigation?: any }) {
  // Referencia para el ScrollView
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

  // Estados para datos de la API
  const [areas, setAreas] = useState<Area[]>([]);
  const [funciones, setFunciones] = useState<Funcion[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Función para limpiar el formulario y volver arriba
  const resetForm = () => {
    setNombre('');
    setArea('');
    setFuncion('');
    setTelefono('');
    setCorreo('');
    setTelefonoConsultorio('');
    setPassword('');
    
    // Volver al inicio del ScrollView
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true });
    }
  };

  // Función para manejar el registro
  const handleRegister = async () => {
    try {
      // Validaciones básicas
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

      // Validar teléfono consultorio para doctores/médicos
      if ((funcion.toLowerCase() === 'doctor' || funcion.toLowerCase() === 'médico') && !telefonoConsultorio.trim()) {
        Alert.alert('Error', 'Por favor ingresa el teléfono del consultorio');
        return;
      }

      setSubmitting(true);

      // Buscar los IDs correspondientes
      const selectedArea = areas.find(a => a.n_area === area);
      const selectedFuncion = funciones.find(f => f.n_funcion === funcion);

      if (!selectedArea || !selectedFuncion) {
        Alert.alert('Error', 'Error al obtener la información seleccionada');
        return;
      }

      // Preparar datos para el POST - convertir correo a minúsculas para evitar errores
      const userData: CreateUserRequest = {
        nombre_completo: nombre.trim(),
        id_area: selectedArea.id_area,
        id_funcion: selectedFuncion.id_funcion,
        telefono: telefono.trim(),
        contrasena: password.trim(),
        correo: correo.trim().toLowerCase(),
      };

      // Agregar teléfono consultorio solo si es doctor/médico
      if ((funcion.toLowerCase() === 'doctor' || funcion.toLowerCase() === 'médico') && telefonoConsultorio.trim()) {
        userData.telefono_consultorio = telefonoConsultorio.trim();
      }

      // Hacer la petición POST
      const response = await apiService.post('/usuarios', userData);
      
      Alert.alert('Éxito', 'Usuario creado exitosamente', [
        {
          text: 'OK',
          onPress: () => {
            // Limpiar formulario
            resetForm();
            
            // Redirigir al LoginScreen
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

  // Si está cargando, mostrar mensaje
  if (loading) {
    return (
      <View className="flex-1 bg-background-color justify-center items-center">
        <Text className="text-black text-lg">Cargando...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-background-color"
    >
        <ScrollView
          ref={scrollViewRef}
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
            source={require('../../assets/logo_mota.png')}
            className="w-16 h-16 mb-3"
            resizeMode="contain"
          />
          <Text className="text-primary-color text-heading-xl font-bold mb-4">MOTA</Text>

          <View className="w-full max-w-xs">
            <Text className="text-label font-bold text-black mb-2">Nombre Completo</Text>
            <TextInput
              className="bg-input-color rounded-md px-4 py-3 text-black text-base mb-4"
              placeholder="Nombre"
              value={nombre}
              onChangeText={setNombre}
              multiline={false}
              style={{ fontSize: 16, height: 48, textAlignVertical: 'center' }}
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
              multiline={false}
              style={{ fontSize: 16, height: 48, textAlignVertical: 'center' }}
            />

            {/* Correo */}
            <Text className="text-label font-bold text-black mb-2">Correo</Text>
            <TextInput
              className="bg-input-color rounded-md px-4 py-3 text-black text-base mb-4"
              keyboardType="email-address"
              value={correo}
              onChangeText={setCorreo}
              multiline={false}
              style={{ fontSize: 16, height: 48, textAlignVertical: 'center' }}
            />

            {/* Teléfono Consultorio si la función es doctor o médico */}
            {(funcion.toLowerCase() === 'doctor' || funcion.toLowerCase() === 'médico') && (
              <>
                <Text className="text-label font-bold text-black mb-2">Teléfono Consultorio</Text>
                <TextInput
                  className="bg-input-color rounded-md px-4 py-3 text-black text-base mb-4"
                  keyboardType="phone-pad"
                  value={telefonoConsultorio}
                  onChangeText={setTelefonoConsultorio}
                  multiline={false}
                  style={{ fontSize: 16, height: 48, textAlignVertical: 'center' }}
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
              multiline={false}
              style={{ fontSize: 16, height: 48, textAlignVertical: 'center' }}
            />

            {/* Botón */}
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
  );
}

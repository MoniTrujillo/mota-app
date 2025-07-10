import React, { useState } from 'react';
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
} from 'react-native';

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

  const areas = [
    'administrativa',
    'secretaria',
    'diseño',
    'dado',
    'fresadora',
    'control de calidad',
    'área de empaque',
     'otro',
  ];

  const funciones = ['administrador', 'trabajador', 'doctor'];

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-background-color"
    >
      <ScrollView
        contentContainerStyle={{ alignItems: 'center', paddingHorizontal: 24, paddingTop: 48, paddingBottom: 80 }}
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
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white rounded-lg w-4/5 p-4">
            <ScrollView>
              {areas.map((item) => (
                <TouchableOpacity
                  key={item}
                  onPress={() => {
                    setArea(item);
                    setShowAreaModal(false);
                  }}
                  className="py-2"
                >
                  <Text className="text-black">{item}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal Función */}
      <Modal visible={showFuncionModal} transparent animationType="fade">
        <View className="flex-1 justify-center items-center bg-black bg-opacity-50">
          <View className="bg-white rounded-lg w-4/5 p-4">
            <ScrollView>
              {funciones.map((item) => (
                <TouchableOpacity
                  key={item}
                  onPress={() => {
                    setFuncion(item);
                    setShowFuncionModal(false);
                  }}
                  className="py-2"
                >
                  <Text className="text-black">{item}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

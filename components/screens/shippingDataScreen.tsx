import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function EnvioScreen() {
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [calleNumero, setCalleNumero] = useState('');
  const [colonia, setColonia] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [mejorHora, setMejorHora] = useState(new Date());
  const [instrucciones, setInstrucciones] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setMejorHora(selectedDate);
    }
  };

  const handleRegistrar = () => {
    // Lógica de registro aquí
  };

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
            paddingTop: 32,
            paddingBottom: 80,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Logo y título */}
          <Image
            source={require('../../assets/logo_mota.png')}
            className="w-16 h-16 mb-3"
            resizeMode="contain"
          />
          <Text className="text-primary-color text-heading-xl font-bold mb-2">MOTA</Text>
          <Text className="text-title-color text-2xl font-bold mb-6">Envío</Text>

          <View className="w-full max-w-xs">
            {/* Nombre */}
            <Text className="text-title-color font-bold text-label mb-2">Nombre</Text>
            <TextInput
              className="bg-input-color rounded-md px-4 py-3 text-black text-base mb-4 h-12"
              value={nombre}
              onChangeText={setNombre}
              placeholder=""
              multiline={false}
              style={{ fontSize: 16 }}
            />

            {/* Teléfono */}
            <Text className="text-title-color font-bold text-label mb-2">Telefono</Text>
            <TextInput
              className="bg-input-color rounded-md px-4 py-3 text-black text-base mb-4 h-12"
              keyboardType="phone-pad"
              value={telefono}
              onChangeText={setTelefono}
              placeholder=""
              multiline={false}
              style={{ fontSize: 16 }}
            />

            {/* Calle y Número */}
            <Text className="text-title-color font-bold text-label mb-2">Calle y Número</Text>
            <TextInput
              className="bg-input-color rounded-md px-4 py-3 text-black text-base mb-4 h-12"
              value={calleNumero}
              onChangeText={setCalleNumero}
              placeholder=""
              multiline={false}
              style={{ fontSize: 16 }}
            />

            {/* Colonia */}
            <Text className="text-title-color font-bold text-label mb-2">Colonia</Text>
            <TextInput
              className="bg-input-color rounded-md px-4 py-3 text-black text-base mb-4 h-12"
              value={colonia}
              onChangeText={setColonia}
              placeholder=""
              multiline={false}
              style={{ fontSize: 16 }}
            />

            {/* Ciudad */}
            <Text className="text-title-color font-bold text-label mb-2">Ciudad</Text>
            <TextInput
              className="bg-input-color rounded-md px-4 py-3 text-black text-base mb-4 h-12"
              value={ciudad}
              onChangeText={setCiudad}
              placeholder=""
              multiline={false}
              style={{ fontSize: 16 }}
            />

            {/* Mejor hora de entrega */}
            <Text className="text-title-color font-bold text-label mb-2">Mejor hora de entrega</Text>
            <TouchableOpacity 
              className="bg-input-color rounded-md px-4 py-3 text-black text-base mb-4 h-12 justify-center"
              onPress={() => setShowDatePicker(true)}
            >
              
            </TouchableOpacity>
            
            {showDatePicker && (
              <DateTimePicker
                value={mejorHora}
                mode="datetime"
                display="default"
                onChange={handleDateChange}
              />
            )}

            {/* Instrucciones Especiales */}
            <Text className="text-title-color font-bold text-label mb-3">Instruccion Especial</Text>
            <TextInput
              className="bg-input-color rounded-md px-4 py-3 text-black text-base mb-4 h-24"
              value={instrucciones}
              onChangeText={setInstrucciones}
              multiline
              style={{ textAlignVertical: 'top', fontSize: 16 }}
              placeholder=""
            />

            {/* Botones con espacio entre ellos */}
            <View className="flex-row justify-between mt-6" style={{ gap: 16 }}>
              <TouchableOpacity
                className="bg-button-green  px-4 py-3 rounded-md shadow-md w-[48%]"
                onPress={handleRegistrar}
              >
                <Text className="text-title-color text-center font-medium text-base">Registrar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="bg-input-color px-4 py-3 rounded-md shadow-md w-[48%]"
                onPress={() => {}}
              >
                <Text className="text-title-color text-center font-medium text-base">Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}


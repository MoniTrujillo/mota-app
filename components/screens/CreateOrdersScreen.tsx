import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function CreateOrdersScreen() {
  const [cliente, setCliente] = useState('');
  const [telefonoCliente, setTelefonoCliente] = useState('');
  const [correoCliente, setCorreoCliente] = useState('');
  const [solicitante, setSolicitante] = useState('');
  const [fechaEntrega, setFechaEntrega] = useState('');
  const [prioridad, setPrioridad] = useState('');
  const [estatusPago, setEstatusPago] = useState('');
  const [dado, setDado] = useState('');
  const [disenador, setDisenador] = useState('');
  const [fresadora, setFresadora] = useState('');

  // Productos dinámicos
  const [productos, setProductos] = useState([
    { nombre: '', cantidad: '', detalles: '' }
  ]);

  // Añadir otro producto
  const handleAddProducto = () => {
    setProductos([...productos, { nombre: '', cantidad: '', detalles: '' }]);
  };

  // Eliminar producto
  const handleRemoveProducto = (idx: number) => {
    setProductos(productos.filter((_, i) => i !== idx));
  };

  // Actualizar campo de producto
  const handleChangeProducto = (
    idx: number,
    field: 'nombre' | 'cantidad' | 'detalles',
    value: string
  ) => {
    const nuevos = [...productos];
    nuevos[idx][field] = value;
    setProductos(nuevos);
  };

  // Registrar pedido (dummy)
  const handleRegistrar = () => {
    // Aquí iría la lógica de registro
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
          <Text className="text-title-color text-2xl font-bold mb-6">Nuevo pedido</Text>

          <View className="w-full max-w-xs">
            {/* Cliente */}
            <Text className="text-title-color font-bold text-label mb-2">Cliente</Text>
            <TextInput
              className="bg-input-color rounded-md px-4 py-3 text-black text-base mb-4 h-12"
              value={cliente}
              onChangeText={setCliente}
              placeholder=""
              multiline={false}
              style={{ fontSize: 16 }}
            />

            {/* Teléfono del cliente */}
            <Text className="text-title-color font-bold text-label mb-2">Telefono del cliente</Text>
            <TextInput
              className="bg-input-color rounded-md px-4 py-3 text-black text-base mb-4 h-12"
              keyboardType="phone-pad"
              value={telefonoCliente}
              onChangeText={setTelefonoCliente}
              placeholder=""
              multiline={false}
              style={{ fontSize: 16 }}
            />

            {/* Correo del Cliente */}
            <Text className="text-title-color font-bold text-label mb-2">Correo del Cliente</Text>
            <TextInput
              className="bg-input-color rounded-md px-4 py-3 text-black text-base mb-4 h-12"
              keyboardType="email-address"
              value={correoCliente}
              onChangeText={setCorreoCliente}
              placeholder=""
              multiline={false}
              style={{ fontSize: 16 }}
            />

            {/* Nombre del solicitante */}
            <Text className="text-title-color font-bold text-label mb-2">Nombre del solicitante</Text>
            <TextInput
              className="bg-input-color rounded-md px-4 py-3 text-black text-base mb-4 h-12"
              value={solicitante}
              onChangeText={setSolicitante}
              placeholder=""
              multiline={false}
              style={{ fontSize: 16 }}
            />

            {/* Fecha de entrega */}
            <Text className="text-title-color font-bold text-label mb-2">Fecha de entrega</Text>
            <View className="flex-row items-center bg-input-color rounded-md mb-4 px-4">
              <TextInput
                className="flex-1 py-3 text-black text-base"
                value={fechaEntrega}
                onChangeText={setFechaEntrega}
                placeholder=""
              />
              <Ionicons name="calendar-outline" size={20} color="#313E4B" />
            </View>

            {/* Prioridad */}
            <Text className="text-title-color font-bold text-label mb-2">Prioridad</Text>
            <TextInput
              className="bg-input-color rounded-md px-4 py-3 text-black text-base mb-4 h-12"
              value={prioridad}
              onChangeText={setPrioridad}
              placeholder=""
              multiline={false}
              style={{ fontSize: 16 }}
            />

            {/* Estatus del pago */}
            <Text className="text-title-color font-bold text-label mb-2">Estatus del pago</Text>
            <TextInput
              className="bg-input-color rounded-md px-4 py-3 text-black text-base mb-4 h-12"
              value={estatusPago}
              onChangeText={setEstatusPago}
              placeholder=""
              multiline={false}
              style={{ fontSize: 16 }}
            />

            {/* Asignar Dado */}
            <Text className="text-title-color font-bold text-label mb-2">Asignar Dado</Text>
            <TouchableOpacity className="bg-input-color rounded-md px-4 py-3 mb-4 flex-row items-center">
              <Text className="text-black flex-1">{dado}</Text>
              <Ionicons name="chevron-forward-outline" size={20} color="#313E4B" />
            </TouchableOpacity>

            {/* Asignar Diseñador */}
            <Text className="text-title-color font-bold text-label mb-2">Asignar Diseñador</Text>
            <TouchableOpacity className="bg-input-color rounded-md px-4 py-3 mb-4 flex-row items-center">
              <Text className="text-black flex-1">{disenador}</Text>
              <Ionicons name="chevron-forward-outline" size={20} color="#313E4B" />
            </TouchableOpacity>

            {/* Fresadora */}
            <Text className="text-title-color font-bold text-label mb-2">Fresadora</Text>
            <TextInput
              className="bg-input-color rounded-md px-4 py-3 text-black text-base mb-4 h-12"
              value={fresadora}
              onChangeText={setFresadora}
              placeholder=""
              multiline={false}
              style={{ fontSize: 16 }}
            />

            {/* Productos dinámicos */}
            {productos.map((producto, idx) => (
              <View key={idx} className="mb-2">
                <Text className="text-title-color font-bold text-label mb-2">
                  {idx === 0 ? 'Producto' : `Producto ${idx + 1}`}
                </Text>
                <View className="flex-row items-center">
                  <TextInput
                    className="bg-input-color rounded-md px-4 py-3 text-black text-base flex-1 mb-2 h-12"
                    value={producto.nombre}
                    onChangeText={v => handleChangeProducto(idx, 'nombre', v)}
                    placeholder=""
                    multiline={false}
                    style={{ fontSize: 16 }}
                  />
                  {idx > 0 && (
                    <TouchableOpacity
                      className="ml-2 bg-input-color px-2 py-1 rounded shadow"
                      onPress={() => handleRemoveProducto(idx)}
                    >
                      <Text className="text-title-color text-xs">Borrar</Text>
                    </TouchableOpacity>
                  )}
                </View>

                <Text className="text-title-color font-bold text-label mb-2">Cantidad</Text>
                <TextInput
                  className="bg-input-color rounded-md px-4 py-3 text-black text-base mb-2 h-12"
                  value={producto.cantidad}
                  onChangeText={v => handleChangeProducto(idx, 'cantidad', v)}
                  keyboardType="numeric"
                  placeholder=""
                  multiline={false}
                  style={{ fontSize: 16 }}
                />

                <Text className="text-title-color font-bold text-label mb-2">Detalles del producto</Text>
                <TextInput
                  className="bg-input-color rounded-md px-4 py-3 text-black text-base mb-4 h-24"
                  value={producto.detalles}
                  onChangeText={v => handleChangeProducto(idx, 'detalles', v)}
                  multiline
                  style={{ textAlignVertical: 'top', fontSize: 16 }}
                  placeholder=""
                />
              </View>
            ))}

            {/* Botón Añadir Otro */}
            <TouchableOpacity
              className="bg-primary-color px-4 py-3 rounded-md shadow-md w-button-width self-center mb-4"
              onPress={handleAddProducto}
            >
              <Text className="text-white text-center font-medium text-base">+ Añadir Otro</Text>
            </TouchableOpacity>

            {/* Botón Registrar */}
            <TouchableOpacity
              className="bg-input-color px-4 py-3 rounded-md shadow-md w-button-width self-center"
              onPress={handleRegistrar}
            >
              <Text className="text-title-color text-center font-medium text-base">Registrar</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

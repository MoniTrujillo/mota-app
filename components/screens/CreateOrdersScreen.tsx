import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Platform,
  KeyboardAvoidingView,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import apiService from '../../services/apiService';
import { EstatusPago, Product, Prioridad, Funcion } from '../../types/api';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function CreateOrdersScreen() {
  const [cliente, setCliente] = useState('');
  const [telefonoCliente, setTelefonoCliente] = useState('');
  const [correoCliente, setCorreoCliente] = useState('');
  const [solicitante, setSolicitante] = useState('');
  const [fechaEntrega, setFechaEntrega] = useState('');
  const [prioridad, setPrioridad] = useState('');
  const [prioridadesList, setPrioridadesList] = useState<Prioridad[]>([]);
  const [showPrioridadModal, setShowPrioridadModal] = useState(false);
  const [estatusPago, setEstatusPago] = useState('');
  const [dado, setDado] = useState('');
  const [disenador, setDisenador] = useState('');
  const [fresadora, setFresadora] = useState('');
  const [direccion, setDireccion] = useState('');
  const [estatusPagoList, setEstatusPagoList] = useState<EstatusPago[]>([]);
  const [showEstatusPagoModal, setShowEstatusPagoModal] = useState(false);
  type UsuarioBasic = {
    id_usuario: number;
    nombre_completo: string;
    telefono?: string;
    telefono_consultorio?: string;
    correo?: string;
    area?: { n_area: string; id_area: number };
    funcion?: { n_funcion: string; id_funcion: number };
  };
  const [funcionesList, setFuncionesList] = useState<Funcion[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<UsuarioBasic[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [showUserSelectModal, setShowUserSelectModal] = useState(false);
  const [currentAssignKey, setCurrentAssignKey] = useState<null | 'cliente' | 'medico' | 'dado' | 'disenador' | 'fresadora'>(null);
  const [selectedClienteId, setSelectedClienteId] = useState<number | null>(null);
  const [selectedDadoId, setSelectedDadoId] = useState<number | null>(null);
  const [selectedDisenadorId, setSelectedDisenadorId] = useState<number | null>(null);
  const [selectedFresadoraId, setSelectedFresadoraId] = useState<number | null>(null);
  const [selectedEstatusPagoId, setSelectedEstatusPagoId] = useState<number | null>(null);
  const [selectedPrioridadId, setSelectedPrioridadId] = useState<number | null>(null);

  // Productos dinámicos - ahora con precio unitario
  const [productos, setProductos] = useState([
  { idProducto: null as number | null, nombre: '', cantidad: '', precioUnitario: '', detalles: '' }
  ]);
  const [productsList, setProductsList] = useState<Product[]>([]);
  const [showProductSelectModal, setShowProductSelectModal] = useState(false);
  const [currentProductIndex, setCurrentProductIndex] = useState<number | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [tempDate, setTempDate] = useState<Date>(new Date());

  const formatDate = (d: Date) => {
    const pad = (n: number) => `${n}`.padStart(2, '0');
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
  };

  // Formatear teléfono a formato MX: +52 AA BBBB CCCC
  const formatTelefonoMX = (input: string): string => {
    // Quitar todo lo que no sea dígito y quitar cualquier 52 inicial para normalizar a 10
    let num = (input || '').replace(/\D/g, '');
    if (num.startsWith('52')) num = num.slice(2);
    if (num.length > 10) num = num.slice(0, 10);
    const a = num.slice(0, 2);
    const b = num.slice(2, 6);
    const c = num.slice(6, 10);
    const parts: string[] = [];
    if (a) parts.push(a);
    if (b) parts.push(b);
    if (c) parts.push(c);
    const body = parts.join(' ').trim();
    // Siempre mostrar +52 y un espacio; si no hay dígitos, devolver "+52 "
    return `+52 ${body}`.trimEnd() + (body ? '' : '');
  };

  // Añadir otro producto
  const handleAddProducto = () => {
  setProductos([...productos, { idProducto: null, nombre: '', cantidad: '', precioUnitario: '', detalles: '' }]);
  };

  // Eliminar producto
  const handleRemoveProducto = (idx: number) => {
    setProductos(productos.filter((_, i) => i !== idx));
  };

  // Formatear precio a dos decimales
  const formatPrecio = (value: string): string => {
    if (!value) return '';
    
    // Eliminar cualquier carácter que no sea número o punto
    let numericValue = value.replace(/[^0-9.]/g, '');
    
    // Asegurar que solo haya un punto decimal
    const parts = numericValue.split('.');
    if (parts.length > 2) {
      numericValue = parts[0] + '.' + parts.slice(1).join('');
    }
    
    // Si es un número válido, formatear a dos decimales
    if (!isNaN(parseFloat(numericValue))) {
      return parseFloat(numericValue).toFixed(2);
    }
    
    return numericValue;
  };

  // Actualizar campo de producto
  const handleChangeProducto = (
    idx: number,
    field: 'nombre' | 'cantidad' | 'precioUnitario' | 'detalles',
    value: string
  ) => {
    const nuevos = [...productos];
    
    if (field === 'precioUnitario') {
      // Permitir edición libre mientras escribe
      nuevos[idx][field] = value;
    } else {
      nuevos[idx][field] = value;
    }
    
    setProductos(nuevos);
  };

  // Manejar blur en campo de precio (cuando sale del campo)
  const handlePrecioBlur = (idx: number) => {
    const nuevos = [...productos];
    const precioFormateado = formatPrecio(nuevos[idx].precioUnitario);
    nuevos[idx].precioUnitario = precioFormateado;
    setProductos(nuevos);
  };

  // Calcular el total
  const calcularTotal = () => {
    let total = 0;
    productos.forEach(producto => {
      const precio = parseFloat(producto.precioUnitario) || 0;
      const cantidad = parseFloat(producto.cantidad) || 0;
      total += precio * cantidad;
    });
    return total.toFixed(2);
  };

  // Registrar pedido
  const handleRegistrar = async () => {
    // Armar JSON con la estructura solicitada
    const order = {
      id_cliente: selectedClienteId,
      fecha_entrega: fechaEntrega || null,
      id_prioridad: selectedPrioridadId,
      id_estatuspago: selectedEstatusPagoId,
      id_disenador: selectedDisenadorId,
      id_fresadora: selectedFresadoraId,
      id_dado: selectedDadoId,
      id_estatusp: 1, // Valor por defecto; ajustar si existe otro estatus en el flujo
      direccion: direccion || '',
      productos: productos
        .filter((p) => p.idProducto)
        .map((p) => ({
          id_producto: p.idProducto as number,
          cantidad: Number(p.cantidad) || 0,
          precio_unitario: parseFloat(p.precioUnitario) || 0,
        })),
    };

    try {
      await apiService.post('/pedidos', order);
      Alert.alert('Éxito', 'Pedido registrado correctamente');
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'No se pudo registrar el pedido');
    }
  };

  // Cargar estatus de pago al montar
  useEffect(() => {
    const fetchEstatusPago = async () => {
      try {
        const data = await apiService.get<EstatusPago[]>('/estatus-pago');
        if (Array.isArray(data)) setEstatusPagoList(data);
      } catch (err) {
        console.error('Error al cargar estatus de pago', err);
      }
    };
    fetchEstatusPago();
  }, []);

  // Cargar productos
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await apiService.get<Product[]>('/productos');
        if (Array.isArray(data)) setProductsList(data);
      } catch (err) {
        console.error('Error al cargar productos', err);
      }
    };
    fetchProducts();
  }, []);

  // Cargar lista de funciones para mapear claves -> id_funcion
  useEffect(() => {
    const fetchFunciones = async () => {
      try {
        const data = await apiService.get<Funcion[]>('/funciones');
        if (Array.isArray(data)) setFuncionesList(data);
      } catch (err) {
        console.error('Error al cargar funciones', err);
      }
    };
    fetchFunciones();
  }, []);

  // Prefijar teléfono con +52 si está vacío al iniciar
  useEffect(() => {
    if (!telefonoCliente) {
      setTelefonoCliente('+52 ');
    }
  }, []);

  // Cargar prioridades
  useEffect(() => {
    const fetchPrioridades = async () => {
      try {
        const data = await apiService.get<Prioridad[]>('/prioridad');
        if (Array.isArray(data)) setPrioridadesList(data);
      } catch (err) {
        console.error('Error al cargar prioridades', err);
      }
    };
    fetchPrioridades();
  }, []);

  // Autocompletar correo/teléfono del cliente al seleccionar un cliente por ID
  useEffect(() => {
    const fetchClienteCorreo = async () => {
      try {
        if (selectedClienteId != null) {
          const data = await apiService.get<UsuarioBasic>(`/usuarios/${selectedClienteId}`);
          if (data && typeof data.correo === 'string') {
            setCorreoCliente(data.correo || '');
          }
          if (data) {
            setTelefonoCliente(formatTelefonoMX((data as any).telefono || (data as any).telefono_consultorio || ''));
          }
        }
      } catch (err) {
        console.error('Error al obtener correo del cliente', err);
      }
    };
    fetchClienteCorreo();
  }, [selectedClienteId]);

  // Helpers para filtrar usuarios por función al abrir modal
  const normalize = (s: string) => s.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  const funcionNameByKey: Record<NonNullable<typeof currentAssignKey>, string> = {
    cliente: 'cliente',
    medico: 'medico',
    dado: 'dado',
    disenador: 'disenador',
    fresadora: 'fresadora',
  };
  const funcionFallbackId: Partial<Record<NonNullable<typeof currentAssignKey>, number>> = {
    medico: 1,
    disenador: 3,
    fresadora: 4,
    dado: 5,
    cliente: 6,
  };

  const getFuncionIdForKey = (key: NonNullable<typeof currentAssignKey>): number | undefined => {
    const target = funcionNameByKey[key];
    const found = funcionesList.find((f) => normalize(f.n_funcion) === target);
    return found?.id_funcion ?? funcionFallbackId[key];
  };

  const openUserSelector = async (key: NonNullable<typeof currentAssignKey>) => {
    setCurrentAssignKey(key);
    setShowUserSelectModal(true);
    setLoadingUsers(true);
    try {
      const id = getFuncionIdForKey(key);
      if (id != null) {
        const data = await apiService.get<UsuarioBasic[]>(`/usuarios/por-funcion/${id}`);
        setFilteredUsers(Array.isArray(data) ? data : []);
      } else {
        setFilteredUsers([]);
      }
    } catch (err) {
      console.error('Error al cargar usuarios por función', err);
      setFilteredUsers([]);
    } finally {
      setLoadingUsers(false);
    }
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
            <TouchableOpacity
              className="bg-input-color rounded-md px-4 py-3 mb-4 flex-row items-center h-12"
              onPress={() => { openUserSelector('cliente'); }}
            >
              <Text className={`flex-1 ${cliente ? 'text-black' : 'text-gray-500'}`}>{cliente || 'Seleccionar'}</Text>
              <Ionicons name="chevron-forward-outline" size={20} color="#313E4B" />
            </TouchableOpacity>

            {/* Teléfono del cliente */}
            <Text className="text-title-color font-bold text-label mb-2">Telefono del cliente</Text>
            <TextInput
              className="bg-input-color rounded-md px-4 py-3 text-black text-base mb-4 h-12"
              keyboardType="phone-pad"
              value={telefonoCliente}
              onChangeText={(v) => setTelefonoCliente(formatTelefonoMX(v))}
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

            {/* Dirección */}
            <Text className="text-title-color font-bold text-label mb-2">Dirección</Text>
            <TextInput
              className="bg-input-color rounded-md px-4 py-3 text-black text-base mb-4 h-12"
              value={direccion}
              onChangeText={setDireccion}
              placeholder=""
              multiline={false}
              style={{ fontSize: 16 }}
            />

            {/* Nombre del médico */}
            <Text className="text-title-color font-bold text-label mb-2">Nombre del médico</Text>
            <TouchableOpacity
              className="bg-input-color rounded-md px-4 py-3 mb-4 flex-row items-center h-12"
              onPress={() => { openUserSelector('medico'); }}
            >
              <Text className={`flex-1 ${solicitante ? 'text-black' : 'text-gray-500'}`}>{solicitante || 'Seleccionar'}</Text>
              <Ionicons name="chevron-forward-outline" size={20} color="#313E4B" />
            </TouchableOpacity>

            {/* Fecha de entrega */}
            <Text className="text-title-color font-bold text-label mb-2">Fecha de entrega</Text>
            <TouchableOpacity
              className="flex-row items-center bg-input-color rounded-md mb-4 px-4 h-12"
              onPress={() => {
                // Inicializar tempDate con fecha actual o la existente si es parseable
                const parsed = fechaEntrega ? new Date(fechaEntrega) : new Date();
                setTempDate(isNaN(parsed.getTime()) ? new Date() : parsed);
                setShowDatePicker(true);
              }}
            >
              <Text className={`flex-1 ${fechaEntrega ? 'text-black' : 'text-gray-500'}`}>
                {fechaEntrega || 'Seleccionar'}
              </Text>
              <Ionicons name="calendar-outline" size={20} color="#313E4B" />
            </TouchableOpacity>

            {/* Prioridad */}
            <Text className="text-title-color font-bold text-label mb-2">Prioridad</Text>
            <TouchableOpacity
              className="bg-input-color rounded-md px-4 py-3 mb-4 flex-row items-center h-12"
              onPress={() => setShowPrioridadModal(true)}
            >
              <Text className={`flex-1 ${prioridad ? 'text-black' : 'text-gray-500'}`}>{prioridad || 'Seleccionar'}</Text>
              <Ionicons name="chevron-forward-outline" size={20} color="#313E4B" />
            </TouchableOpacity>

            {/* Estatus del pago */}
            <Text className="text-title-color font-bold text-label mb-2">Estatus del pago</Text>
            <TouchableOpacity
              className="bg-input-color rounded-md px-4 py-3 mb-4 flex-row items-center h-12"
              onPress={() => setShowEstatusPagoModal(true)}
            >
              <Text className={`flex-1 ${estatusPago ? 'text-black' : 'text-gray-500'}`}>{estatusPago || 'Seleccionar'}</Text>
              <Ionicons name="chevron-forward-outline" size={20} color="#313E4B" />
            </TouchableOpacity>

            {/* Asignar Dado */}
            <Text className="text-title-color font-bold text-label mb-2">Asignar Dado</Text>
            <TouchableOpacity
              className="bg-input-color rounded-md px-4 py-3 mb-4 flex-row items-center h-12"
              onPress={() => { openUserSelector('dado'); }}
            >
              <Text className={`flex-1 ${dado ? 'text-black' : 'text-gray-500'}`}>{dado || 'Seleccionar'}</Text>
              <Ionicons name="chevron-forward-outline" size={20} color="#313E4B" />
            </TouchableOpacity>

            {/* Asignar Diseñador */}
            <Text className="text-title-color font-bold text-label mb-2">Asignar Diseñador</Text>
            <TouchableOpacity
              className="bg-input-color rounded-md px-4 py-3 mb-4 flex-row items-center h-12"
              onPress={() => { openUserSelector('disenador'); }}
            >
              <Text className={`flex-1 ${disenador ? 'text-black' : 'text-gray-500'}`}>{disenador || 'Seleccionar'}</Text>
              <Ionicons name="chevron-forward-outline" size={20} color="#313E4B" />
            </TouchableOpacity>

            {/* Fresadora */}
            <Text className="text-title-color font-bold text-label mb-2">Fresadora</Text>
            <TouchableOpacity
              className="bg-input-color rounded-md px-4 py-3 mb-4 flex-row items-center h-12"
              onPress={() => { openUserSelector('fresadora'); }}
            >
              <Text className={`flex-1 ${fresadora ? 'text-black' : 'text-gray-500'}`}>{fresadora || 'Seleccionar'}</Text>
              <Ionicons name="chevron-forward-outline" size={20} color="#313E4B" />
            </TouchableOpacity>

            {/* Productos dinámicos */}
            {productos.map((producto, idx) => (
              <View key={idx} className="mb-2">
                {/* Título del producto con botón Borrar al lado */}
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-title-color font-bold text-label">
                    {idx === 0 ? 'Producto' : `Producto ${idx + 1}`}
                  </Text>
                  {idx > 0 && (
                    <TouchableOpacity
                      className="bg-input-color px-3 py-1 rounded shadow"
                      onPress={() => handleRemoveProducto(idx)}
                    >
                      <Text className="text-title-color text-xs font-bold">Borrar</Text>
                    </TouchableOpacity>
                  )}
                </View>
                
                {/* Selector de Producto (estilo combobox) */}
                <TouchableOpacity
                  className="bg-input-color rounded-md px-4 py-3 mb-2 flex-row items-center h-12"
                  onPress={() => { setCurrentProductIndex(idx); setShowProductSelectModal(true); }}
                >
                  <Text className={`flex-1 ${producto.nombre ? 'text-black' : 'text-gray-500'}`}>{producto.nombre || 'Seleccionar'}</Text>
                  <Ionicons name="chevron-forward-outline" size={20} color="#313E4B" />
                </TouchableOpacity>

                {/* Precio Unitario */}
                <Text className="text-title-color font-bold text-label mb-2">Precio Unitario</Text>
                <View className="flex-row items-center bg-input-color rounded-md mb-2 h-12 px-4">
                  <Text className="text-black mr-1">$</Text>
                  <TextInput
                    className="flex-1 text-black text-base h-12"
                    value={producto.precioUnitario}
                    onChangeText={v => handleChangeProducto(idx, 'precioUnitario', v)}
                    onBlur={() => handlePrecioBlur(idx)}
                    keyboardType="decimal-pad"
                    placeholder="0.00"
                    multiline={false}
                    style={{ fontSize: 16 }}
                  />
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

            {/* Total */}
            <View className="border-t border-title-color pt-4 mb-4">
              <Text className="text-title-color font-bold text-label mb-2">Total</Text>
              <View className="flex-row items-center">
                <Text className="text-black mr-1">$</Text>
                <Text className="text-black text-base">{calcularTotal()}</Text>
              </View>
            </View>

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

        {/* Modal: Selección de Estatus de Pago */}
        <Modal
          visible={showEstatusPagoModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowEstatusPagoModal(false)}
        >
          <View className="flex-1 bg-black/50 justify-end">
            <SafeAreaView edges={['bottom']} className="bg-white rounded-t-2xl p-4 pb-8">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-title-color text-lg font-bold">Estatus del pago</Text>
                <TouchableOpacity onPress={() => setShowEstatusPagoModal(false)}>
                  <Ionicons name="close" size={24} color="#313E4B" />
                </TouchableOpacity>
              </View>

              <ScrollView>
                {estatusPagoList.map((item) => (
                  <TouchableOpacity
                    key={item.id_estatuspago}
                    className="py-3 border-b border-gray-200 flex-row items-center"
                    onPress={() => {
                      setEstatusPago(item.n_estatuspago);
                      setSelectedEstatusPagoId(item.id_estatuspago);
                      setShowEstatusPagoModal(false);
                    }}
                  >
                    <Text className="text-black flex-1">{item.n_estatuspago}</Text>
                    {estatusPago === item.n_estatuspago && (
                      <Ionicons name="checkmark" size={20} color="#0088cc" />
                    )}
                  </TouchableOpacity>
                ))}
                {estatusPagoList.length === 0 && (
                  <View className="py-6 items-center">
                    <Text className="text-gray-500">No hay estatus disponibles</Text>
                  </View>
                )}
              </ScrollView>
            </SafeAreaView>
          </View>
        </Modal>

        {/* Modal: Fecha de entrega */}
        <Modal
          visible={showDatePicker}
          transparent
          animationType="fade"
          onRequestClose={() => setShowDatePicker(false)}
        >
          <View className="flex-1 bg-black/50 justify-end">
            <SafeAreaView edges={['bottom']} className="bg-white rounded-t-2xl p-4">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-title-color text-lg font-bold">Seleccionar fecha</Text>
                <TouchableOpacity onPress={() => setShowDatePicker(false)}>
                  <Ionicons name="close" size={24} color="#313E4B" />
                </TouchableOpacity>
              </View>

              <View className="mb-4">
                <DateTimePicker
                  value={tempDate}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'calendar'}
                  onChange={(event, date) => {
                    if (date) setTempDate(date);
                  }}
                />
              </View>

              <View className="flex-row justify-end space-x-4 mb-2">
                <TouchableOpacity className="px-4 py-2 mr-2" onPress={() => setShowDatePicker(false)}>
                  <Text className="text-gray-600">Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  className="bg-primary-color px-4 py-2 rounded-md"
                  onPress={() => {
                    setFechaEntrega(formatDate(tempDate));
                    setShowDatePicker(false);
                  }}
                >
                  <Text className="text-white font-medium">Listo</Text>
                </TouchableOpacity>
              </View>
            </SafeAreaView>
          </View>
        </Modal>

        {/* Modal: Selección de Prioridad */}
        <Modal
          visible={showPrioridadModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowPrioridadModal(false)}
        >
          <View className="flex-1 bg-black/50 justify-end">
            <SafeAreaView edges={['bottom']} className="bg-white rounded-t-2xl p-4">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-title-color text-lg font-bold">Prioridad</Text>
                <TouchableOpacity onPress={() => setShowPrioridadModal(false)}>
                  <Ionicons name="close" size={24} color="#313E4B" />
                </TouchableOpacity>
              </View>

              <ScrollView>
                {prioridadesList.map((p) => (
                  <TouchableOpacity
                    key={p.id_prioridad}
                    className="py-3 border-b border-gray-200 flex-row items-center"
                    onPress={() => {
                      setPrioridad(p.n_prioridad);
                      setSelectedPrioridadId(p.id_prioridad);
                      setShowPrioridadModal(false);
                    }}
                  >
                    <Text className="text-black flex-1">{p.n_prioridad}</Text>
                    {prioridad === p.n_prioridad && (
                      <Ionicons name="checkmark" size={20} color="#0088cc" />
                    )}
                  </TouchableOpacity>
                ))}
                {prioridadesList.length === 0 && (
                  <View className="py-6 items-center">
                    <Text className="text-gray-500">No hay prioridades disponibles</Text>
                  </View>
                )}
              </ScrollView>
            </SafeAreaView>
          </View>
        </Modal>

        {/* Modal: Selección de Producto */}
        <Modal
          visible={showProductSelectModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowProductSelectModal(false)}
        >
          <View className="flex-1 bg-black/50 justify-end">
            <SafeAreaView edges={['bottom']} className="bg-white rounded-t-2xl p-4">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-title-color text-lg font-bold">Seleccionar producto</Text>
                <TouchableOpacity onPress={() => setShowProductSelectModal(false)}>
                  <Ionicons name="close" size={24} color="#313E4B" />
                </TouchableOpacity>
              </View>

              <ScrollView>
                {productsList.map((p) => (
                  <TouchableOpacity
                    key={p.id_producto}
                    className="py-3 border-b border-gray-200"
                    onPress={() => {
                      if (currentProductIndex !== null) {
                        const nuevos = [...productos];
                        nuevos[currentProductIndex].nombre = p.n_producto;
                        (nuevos[currentProductIndex] as any).idProducto = p.id_producto;
                        setProductos(nuevos);
                      }
                      setShowProductSelectModal(false);
                    }}
                  >
                    <Text className="text-black">{p.n_producto}</Text>
                  </TouchableOpacity>
                ))}
                {productsList.length === 0 && (
                  <View className="py-6 items-center">
                    <Text className="text-gray-500">No hay productos disponibles</Text>
                  </View>
                )}
              </ScrollView>
            </SafeAreaView>
          </View>
        </Modal>
        {/* Modal: Selección de Usuario (Dado/Diseñador/Fresadora) */}
        <Modal
          visible={showUserSelectModal}
          transparent
          animationType="fade"
          onRequestClose={() => setShowUserSelectModal(false)}
        >
          <View className="flex-1 bg-black/50 justify-end">
            <SafeAreaView edges={['bottom']} className="bg-white rounded-t-2xl p-4">
              <View className="flex-row items-center justify-between mb-2">
                <Text className="text-title-color text-lg font-bold">
                  {currentAssignKey === 'cliente' && 'Seleccionar Cliente'}
                  {currentAssignKey === 'medico' && 'Seleccionar Médico'}
                  {currentAssignKey === 'dado' && 'Asignar Dado'}
                  {currentAssignKey === 'disenador' && 'Asignar Diseñador'}
                  {currentAssignKey === 'fresadora' && 'Asignar Fresadora'}
                </Text>
                <TouchableOpacity onPress={() => setShowUserSelectModal(false)}>
                  <Ionicons name="close" size={24} color="#313E4B" />
                </TouchableOpacity>
              </View>

              <ScrollView>
                {loadingUsers && (
                  <View className="py-6 items-center">
                    <Text className="text-gray-500">Cargando...</Text>
                  </View>
                )}
                {!loadingUsers && filteredUsers.map((u) => (
                  <TouchableOpacity
                    key={u.id_usuario}
                    className="py-3 border-b border-gray-200"
                    onPress={() => {
                      if (currentAssignKey === 'cliente') { setCliente(u.nombre_completo); setSelectedClienteId(u.id_usuario); }
                      if (currentAssignKey === 'medico') { setSolicitante(u.nombre_completo); }
                      if (currentAssignKey === 'dado') { setDado(u.nombre_completo); setSelectedDadoId(u.id_usuario); }
                      if (currentAssignKey === 'disenador') { setDisenador(u.nombre_completo); setSelectedDisenadorId(u.id_usuario); }
                      if (currentAssignKey === 'fresadora') { setFresadora(u.nombre_completo); setSelectedFresadoraId(u.id_usuario); }
                      setShowUserSelectModal(false);
                    }}
                  >
                    <View className="flex-row items-center">
                      <Text className="text-black flex-1">{u.nombre_completo}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
                {!loadingUsers && filteredUsers.length === 0 && (
                  <View className="py-6 items-center">
                    <Text className="text-gray-500">No hay usuarios disponibles</Text>
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
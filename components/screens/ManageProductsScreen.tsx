import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Modal, TextInput, Alert, KeyboardAvoidingView, Platform, Keyboard, Animated, Easing } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import apiService from '../../services/apiService';
import { Product } from '../../types/api';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ManageProductsScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ nombre: '', descripcion: '' });
  const [submitting, setSubmitting] = useState(false);
  const modalScrollRef = useRef<ScrollView>(null);
  const bottomOffset = useRef(new Animated.Value(0)).current;

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await apiService.get<Product[]>('/productos');
      setProducts(Array.isArray(data) ? data : []);
    } catch (err) {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const onShow = (e: any) => {
      const height = e?.endCoordinates?.height || 0;
      const duration = 450;
      Animated.timing(bottomOffset, {
        toValue: height,
        duration,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start();
    };
    const onHide = (e: any) => {
      const duration = 200;
      Animated.timing(bottomOffset, {
        toValue: 0,
        duration,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start();
    };

    const showSub = Keyboard.addListener(showEvent, onShow);
    const hideSub = Keyboard.addListener(hideEvent, onHide);
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, [bottomOffset]);

  const handleDelete = async (id: number) => {
    Alert.alert('Eliminar producto', '¿Estás seguro de eliminar este producto?', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar', style: 'destructive', onPress: async () => {
          try {
            await apiService.delete(`/productos/${id}`);
            fetchProducts();
          } catch (err) {
            Alert.alert('Error', 'No se pudo eliminar el producto');
          }
        }
      }
    ]);
  };

  const handleAdd = async () => {
    if (!form.nombre.trim()) {
      Alert.alert('Error', 'El nombre es obligatorio');
      return;
    }
    setSubmitting(true);
    try {
      await apiService.post('/productos', {
        n_producto: form.nombre.trim(),
        descripcion: form.descripcion.trim(),
  cantidad: 1,
      });
      setShowModal(false);
      setForm({ nombre: '', descripcion: '' });
      fetchProducts();
    } catch (err) {
      Alert.alert('Error', 'No se pudo agregar el producto');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View className="flex-1 bg-background-color">
      <View className="items-center mt-8 mb-4">
        <Text className="text-title-color text-xl font-bold">Productos</Text>
      </View>
      <ScrollView className="flex-1 px-4">
        {loading ? (
          <Text className="text-gray-500 text-center mt-8">Cargando...</Text>
        ) : products.length === 0 ? (
          <Text className="text-gray-500 text-center mt-8">No hay productos registrados</Text>
        ) : (
          products.map((p) => (
            <View key={p.id_producto} className="bg-white rounded-lg shadow p-4 mb-4 flex-row items-center justify-between">
              <View className="flex-1">
                <Text className="text-title-color font-bold text-base">{p.n_producto}</Text>
                {p.descripcion ? <Text className="text-gray-600 text-sm mt-1">{p.descripcion}</Text> : null}
                {/* Cantidad ocultada según solicitud */}
                {/* El backend no expone precio_unitario en Product, así que no lo mostramos aquí */}
              </View>
              <TouchableOpacity onPress={() => handleDelete(p.id_producto)} className="ml-4">
                <Ionicons name="trash" size={22} color="#e53935" />
              </TouchableOpacity>
            </View>
          ))
        )}
      </ScrollView>
      <TouchableOpacity
        className="bg-primary-color px-4 py-3 rounded-md shadow-md w-button-width self-center mb-8 mt-2"
        onPress={() => setShowModal(true)}
      >
        <Text className="text-white text-center font-medium text-base">+ Agregar Producto</Text>
      </TouchableOpacity>

      {/* Modal para agregar producto */}
      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <Animated.View style={{ marginBottom: bottomOffset }}>
            <SafeAreaView edges={['bottom']} className="bg-white rounded-t-2xl">
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
              <ScrollView
                ref={modalScrollRef}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ padding: 24, paddingBottom: 32 }}
              >
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-title-color text-lg font-bold">Nuevo Producto</Text>
                  <TouchableOpacity onPress={() => setShowModal(false)}>
                    <Ionicons name="close" size={24} color="#313E4B" />
                  </TouchableOpacity>
                </View>
                <Text className="text-title-color font-bold text-label mb-2">Nombre</Text>
                <TextInput
                  className="bg-input-color rounded-md px-4 py-3 text-black text-base mb-3 h-12"
                  value={form.nombre}
                  onChangeText={v => setForm(f => ({ ...f, nombre: v }))}
                  onFocus={() => setTimeout(() => modalScrollRef.current?.scrollToEnd({ animated: true }), 50)}
                  placeholder="Nombre del producto"
                  style={{ fontSize: 16 }}
                />
                <Text className="text-title-color font-bold text-label mb-2">Descripción</Text>
                <TextInput
                  className="bg-input-color rounded-md px-4 py-3 text-black text-base mb-3 h-12"
                  value={form.descripcion}
                  onChangeText={v => setForm(f => ({ ...f, descripcion: v }))}
                  onFocus={() => setTimeout(() => modalScrollRef.current?.scrollToEnd({ animated: true }), 50)}
                  placeholder="Descripción"
                  style={{ fontSize: 16 }}
                />
                {/* Solo nombre y descripción requeridos */}
                <TouchableOpacity
                  className="bg-primary-color px-4 py-3 rounded-md shadow-md w-button-width self-center"
                  onPress={handleAdd}
                  disabled={submitting}
                >
                  <Text className="text-white text-center font-medium text-base">{submitting ? 'Guardando...' : 'Guardar'}</Text>
                </TouchableOpacity>
              </ScrollView>
            </KeyboardAvoidingView>
            </SafeAreaView>
          </Animated.View>
        </View>
      </Modal>
    </View>
  );
}

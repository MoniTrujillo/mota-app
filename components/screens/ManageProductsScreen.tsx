import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Modal,
  TextInput,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import apiService from "../../services/apiService";
import { Product } from "../../types/api";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ManageProductsScreen() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ nombre: "", descripcion: "", precio: "" });
  const [submitting, setSubmitting] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await apiService.get<Product[]>("/productos");
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

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setForm({
      nombre: product.n_producto,
      descripcion: product.descripcion || "",
      precio: product.precio?.toString() || "",
    });
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    Alert.alert(
      "Eliminar producto",
      "¿Estás seguro de eliminar este producto?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            try {
              await apiService.delete(`/productos/${id}`);
              fetchProducts();
            } catch (err) {
              Alert.alert("Error", "No se pudo eliminar el producto");
            }
          },
        },
      ]
    );
  };

  const handleSave = async () => {
    if (!form.nombre.trim()) {
      Alert.alert("Error", "El nombre es obligatorio");
      return;
    }
    if (!form.precio.trim() || isNaN(Number(form.precio))) {
      Alert.alert("Error", "El precio debe ser un número válido");
      return;
    }
    setSubmitting(true);
    try {
      const precio = parseFloat(form.precio);
      if (editingProduct) {
        // Actualizar producto existente
        await apiService.put(`/productos/${editingProduct.id_producto}`, {
          n_producto: form.nombre.trim(),
          descripcion: form.descripcion.trim(),
          precio: precio,
        });
      } else {
        // Crear nuevo producto
        await apiService.post("/productos", {
          n_producto: form.nombre.trim(),
          descripcion: form.descripcion.trim(),
          precio: precio,
        });
      }
      setShowModal(false);
      setForm({ nombre: "", descripcion: "", precio: "" });
      setEditingProduct(null);
      fetchProducts();
    } catch (err) {
      Alert.alert(
        "Error",
        editingProduct
          ? "No se pudo actualizar el producto"
          : "No se pudo agregar el producto"
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View className="flex-1 bg-background-color">
      <View className="flex-row items-center justify-between mt-8 mb-4 px-4">
        <Text className="text-title-color text-xl font-bold">Productos</Text>
        <TouchableOpacity onPress={fetchProducts} className="p-2">
          <Ionicons name="reload" size={20} color="#313E4B" />
        </TouchableOpacity>
      </View>
      <ScrollView className="flex-1 px-4">
        {loading ? (
          <Text className="text-gray-500 text-center mt-8">Cargando...</Text>
        ) : products.length === 0 ? (
          <Text className="text-gray-500 text-center mt-8">
            No hay productos registrados
          </Text>
        ) : (
          products.map((p) => (
            <View
              key={p.id_producto}
              className="bg-white rounded-lg shadow p-4 mb-4 flex-row items-center justify-between"
            >
              <View className="flex-1">
                <Text className="text-title-color font-bold text-base">
                  {p.n_producto}
                </Text>
                {p.descripcion ? (
                  <Text className="text-gray-600 text-sm mt-1">
                    {p.descripcion}
                  </Text>
                ) : null}
                {p.precio != null ? (
                  <Text className="text-primary-color font-semibold text-sm mt-1">
                    ${p.precio.toFixed(2)}
                  </Text>
                ) : null}
              </View>
              <View className="flex-row items-center">
                <TouchableOpacity
                  onPress={() => handleEdit(p)}
                  className="ml-4"
                >
                  <Ionicons name="create-outline" size={24} color="#313E4B" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDelete(p.id_producto)}
                  className="ml-4"
                >
                  <Ionicons name="trash-outline" size={24} color="#313E4B" />
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>
      <TouchableOpacity
        className="bg-primary-color px-4 py-3 rounded-md shadow-md w-button-width self-center mb-8 mt-2"
        onPress={() => setShowModal(true)}
      >
        <Text className="text-white text-center font-medium text-base">
          + Agregar Producto
        </Text>
      </TouchableOpacity>

      {/* Modal para agregar producto */}
      <Modal
        visible={showModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          {/* Fondo negro translúcido para el SafeArea superior */}
          <SafeAreaView
            edges={["top"]}
            style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
          />
          <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={0}>
            <SafeAreaView edges={["bottom"]} className="bg-white rounded-t-2xl">
              <View style={{ padding: 24, paddingBottom: 32 }}>
                <View className="flex-row items-center justify-between mb-2">
                  <Text className="text-title-color text-lg font-bold">
                    {editingProduct ? "Editar Producto" : "Nuevo Producto"}
                  </Text>
                  <TouchableOpacity
                    onPress={() => {
                      setShowModal(false);
                      setEditingProduct(null);
                      setForm({ nombre: "", descripcion: "", precio: "" });
                    }}
                  >
                    <Ionicons name="close" size={24} color="#313E4B" />
                  </TouchableOpacity>
                </View>
                <Text className="text-title-color font-bold text-label mb-2">
                  Nombre
                </Text>
                <TextInput
                  className="bg-input-color rounded-md px-4 py-3 text-black text-base mb-3 h-12"
                  value={form.nombre}
                  onChangeText={(v) => setForm((f) => ({ ...f, nombre: v }))}
                  placeholder="Nombre del producto"
                  style={{ fontSize: 16 }}
                />
                <Text className="text-title-color font-bold text-label mb-2">
                  Descripción
                </Text>
                <TextInput
                  className="bg-input-color rounded-md px-4 py-3 text-black text-base mb-3 h-12"
                  value={form.descripcion}
                  onChangeText={(v) =>
                    setForm((f) => ({ ...f, descripcion: v }))
                  }
                  placeholder="Descripción"
                  style={{ fontSize: 16 }}
                />
                <Text className="text-title-color font-bold text-label mb-2">
                  Precio
                </Text>
                <TextInput
                  className="bg-input-color rounded-md px-4 py-3 text-black text-base mb-3 h-12"
                  value={form.precio}
                  onChangeText={(v) => setForm((f) => ({ ...f, precio: v }))}
                  placeholder="0.00"
                  keyboardType="decimal-pad"
                  style={{ fontSize: 16 }}
                />
                <TouchableOpacity
                  className="bg-primary-color px-4 py-3 rounded-md shadow-md w-button-width self-center"
                  onPress={handleSave}
                  disabled={submitting}
                >
                  <Text className="text-white text-center font-medium text-base">
                    {submitting
                      ? "Guardando..."
                      : editingProduct
                        ? "Actualizar"
                        : "Guardar"}
                  </Text>
                </TouchableOpacity>
              </View>
            </SafeAreaView>
          </KeyboardAvoidingView>
        </View>
      </Modal>
    </View>
  );
}

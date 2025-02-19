import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useTheme } from "../context/ThemeContext";
import axios from "axios";
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types'; // Adjust the path as necessary
import { API_URL } from "@env";

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Product'>;

interface Props {
  navigation: LoginScreenNavigationProp;
}

const CreateProductScreen: React.FC<Props> = ({ navigation }) => {
  const { theme } = useTheme();
  const colors = theme.colors;

  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [precio, setPrecio] = useState("");
  const [stock, setStock] = useState("");

  const handleCreateProduct = async () => {
    if (!nombre || !descripcion || !precio || !stock) {
      Alert.alert("Error", "Todos los campos son obligatorios");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/productos`, {
        nombre,
        descripcion,
        precio: parseFloat(precio),
        stock: parseInt(stock),
      });

      Alert.alert("Éxito", "Producto creado correctamente");
      navigation.goBack();
    } catch (error) {
      console.error("❌ Error al crear producto:", error);
      Alert.alert("Error", "No se pudo crear el producto");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.darkText }]}>Crear Producto</Text>

      <TextInput
        placeholder="Nombre del producto"
        placeholderTextColor={colors.lightText}
        style={[styles.input, { borderColor: colors.border, color: colors.darkText }]}
        onChangeText={setNombre}
      />

      <TextInput
        placeholder="Descripción"
        placeholderTextColor={colors.lightText}
        style={[styles.input, { borderColor: colors.border, color: colors.darkText }]}
        onChangeText={setDescripcion}
      />

      <TextInput
        placeholder="Precio"
        placeholderTextColor={colors.lightText}
        keyboardType="numeric"
        style={[styles.input, { borderColor: colors.border, color: colors.darkText }]}
        onChangeText={setPrecio}
      />

      <TextInput
        placeholder="Stock"
        placeholderTextColor={colors.lightText}
        keyboardType="numeric"
        style={[styles.input, { borderColor: colors.border, color: colors.darkText }]}
        onChangeText={setStock}
      />

      <TouchableOpacity onPress={handleCreateProduct} style={[styles.button, { backgroundColor: colors.primaryBlue }]}>
        <Text style={[styles.buttonText, { color: colors.white }]}>Guardar Producto</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
    marginBottom: 15,
  },
  button: {
    height: 50,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default CreateProductScreen;

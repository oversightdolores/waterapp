import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PedidoScreen({ navigation }) {
  const [producto, setProducto] = useState('');
  const [direccion, setDireccion] = useState('');

  const handlePedido = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      await axios.post(
        'http://localhost:4000/api/pedidos',
        { productos: [{ nombre: producto, cantidad: 1 }], direccionEntrega: direccion },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Alert.alert('Éxito', 'Pedido creado');
      navigation.navigate('Home');
    } catch (error) {
      Alert.alert('Error', 'No se pudo crear el pedido');
    }
  };

  return (
    <View>
      <Text>Producto:</Text>
      <TextInput placeholder="Ej: Botellón 20L" onChangeText={setProducto} />
      <Text>Dirección:</Text>
      <TextInput placeholder="Dirección de entrega" onChangeText={setDireccion} />
      <Button title="Confirmar Pedido" onPress={handlePedido} />
    </View>
  );
}

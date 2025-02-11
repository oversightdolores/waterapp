import React, { useEffect, useState } from 'react';
import { View, Text, Button, FlatList } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomeScreen({ navigation }) {
  const [pedidos, setPedidos] = useState([]);

  useEffect(() => {
    const fetchPedidos = async () => {
      const token = await AsyncStorage.getItem('token');
      const response = await axios.get('http://localhost:4000/api/pedidos', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setPedidos(response.data);
    };
    fetchPedidos();
  }, []);

  return (
    <View>
      <Text>Lista de Pedidos</Text>
      <FlatList
        data={pedidos}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => <Text>{item.productos[0].nombre} - {item.estado}</Text>}
      />
      <Button title="Crear Pedido" onPress={() => navigation.navigate('Pedido')} />
      <Button title="Perfil" onPress={() => navigation.navigate('Perfil')} />
    </View>
  );
}

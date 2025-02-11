import React from 'react';
import { View, Text, Button } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PerfilScreen({ navigation }) {
  const handleLogout = async () => {
    await AsyncStorage.removeItem('token');
    navigation.navigate('Login');
  };

  return (
    <View>
      <Text>Perfil de Usuario</Text>
      <Button title="Cerrar Sesión" onPress={handleLogout} />
    </View>
  );
}

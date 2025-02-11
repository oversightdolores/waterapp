import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, TouchableOpacity } from 'react-native';
import axios from 'axios';
import styles from './styles/RegisterStyles';

export function RegisterScreen({ navigation }) {
  const [data, setData] = useState({
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);

  
  const handleRegister = async () => {
    if (!data.nombre || !data.email || !data.telefono || !data.direccion || !data.password) {
      console.log('Estado actual de data:', data); // Verificar que los valores están cambiando
      Alert.alert('Error', 'Todos los campos son obligatoriosssss');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('http://192.168.1.33:4000/api/usuarios/registro', data);
      console.log('Registro exitoso:', response.data);

      if (response.status === 201) {
        Alert.alert('Éxito', 'Registro exitoso', [
          { text: 'OK', onPress: () => navigation.navigate('Login') },
        ]);
      }
    } catch (error) {
      console.error('Error en el registro:', error);
      Alert.alert('Error', error.response?.data?.message || 'Error en el registro');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registro</Text>
      <TextInput
        style={styles.input}
        placeholder="Nombre Completo"
        value={data.nombre}
        onChangeText={(text) => setData((prev) => ({ ...prev, nombre: text }))}
      />
      <TextInput
        style={styles.input}
        placeholder="Email"
        keyboardType="email-address"
        value={data.email}
        onChangeText={(text) => setData((prev) => ({ ...prev, email: text }))}
      />
      <TextInput
        style={styles.input}
        placeholder="Teléfono"
        keyboardType="phone-pad"
        value={data.telefono}
        onChangeText={(text) => setData((prev) => ({ ...prev, telefono: text }))}
      />
      <TextInput
        style={styles.input}
        placeholder="Dirección"
        value={data.direccion}
        onChangeText={(text) => setData((prev) => ({ ...prev, direccion: text }))}
      />
      <TextInput
        style={styles.input}
        placeholder="Contraseña"
        secureTextEntry
        value={data.password}
        onChangeText={(text) => setData((prev) => ({ ...prev, password: text }))}
      />

      <Button title={loading ? "Registrando..." : "Registrarse"} onPress={handleRegister} disabled={loading} />
      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.link}>¿Ya tienes cuenta? Inicia sesión</Text>
      </TouchableOpacity>
    </View>
  );
}

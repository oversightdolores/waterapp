/* import React, { useState } from 'react';
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
 */
import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { User, Mail, Phone, MapPin, Lock } from "lucide-react-native";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types";

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, "Registration">;

interface Props {
  navigation: RegisterScreenNavigationProp;
}

const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const { theme } = useTheme();
  const { register } = useAuth();
  const colors = theme.colors;

  // Estado único para manejar la data del formulario
  const [data, setData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    direccion: "",
    password: "",
    rol: "cliente",
  });

  const [loading, setLoading] = useState(false);

  // Función para manejar cambios en los inputs
  const handleChange = (key: string, value: string) => {
    setData({ ...data, [key]: value });
  };

  // Función de registro
  const handleRegister = async () => {
    const { nombre, email, telefono, direccion, password } = data;
    if (!nombre || !email || !telefono || !direccion || !password) {
      Alert.alert("Error", "Todos los campos son obligatorios.");
      return;
    }

    setLoading(true);
    try {
      await register(data.nombre, data.email, data.telefono, data.direccion, data.password, data.rol);
      Alert.alert("Éxito", "Cuenta creada correctamente.");
      navigation.navigate("login" as never);
    } catch (error) {
      Alert.alert("Error", (error as Error).message || "Error al registrarse.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.primaryBlue }]}>Create Account</Text>

      <View style={styles.inputContainer}>
        <User color={colors.primaryBlue} size={24} />
        <TextInput
          placeholder="Full Name"
          placeholderTextColor={colors.lightText}
          value={data.nombre}
          onChangeText={(text) => handleChange("nombre", text)}
          style={[styles.input, { color: colors.darkText, borderColor: colors.border }]}
        />
      </View>

      <View style={styles.inputContainer}>
        <Mail color={colors.primaryBlue} size={24} />
        <TextInput
          placeholder="Email"
          placeholderTextColor={colors.lightText}
          keyboardType="email-address"
          value={data.email}
          onChangeText={(text) => handleChange("email", text)}
          style={[styles.input, { color: colors.darkText, borderColor: colors.border }]}
        />
      </View>

      <View style={styles.inputContainer}>
        <Phone color={colors.primaryBlue} size={24} />
        <TextInput
          placeholder="Phone Number"
          placeholderTextColor={colors.lightText}
          keyboardType="phone-pad"
          value={data.telefono}
          onChangeText={(text) => handleChange("telefono", text)}
          style={[styles.input, { color: colors.darkText, borderColor: colors.border }]}
        />
      </View>

      <View style={styles.inputContainer}>
        <MapPin color={colors.primaryBlue} size={24} />
        <TextInput
          placeholder="Address"
          placeholderTextColor={colors.lightText}
          value={data.direccion}
          onChangeText={(text) => handleChange("direccion", text)}
          style={[styles.input, { color: colors.darkText, borderColor: colors.border }]}
        />
      </View>

      <View style={styles.inputContainer}>
        <Lock color={colors.primaryBlue} size={24} />
        <TextInput
          placeholder="Password"
          placeholderTextColor={colors.lightText}
          secureTextEntry
          value={data.password}
          onChangeText={(text) => handleChange("password", text)}
          style={[styles.input, { color: colors.darkText, borderColor: colors.border }]}
        />
      </View>

      <TouchableOpacity onPress={handleRegister} style={[styles.button, { backgroundColor: colors.primaryBlue }]} disabled={loading}>
        <Text style={[styles.buttonText, { color: colors.white }]}>{loading ? "Creando cuenta..." : "Register"}</Text>
      </TouchableOpacity>

      {/* 🔥 Redirigir al login si ya tienes cuenta */}
      <TouchableOpacity onPress={() => navigation.navigate("Login")} style={styles.loginRedirect}>
        <Text style={{ color: colors.primaryBlue }}>
          ¿Ya tienes cuenta? <Text style={{ fontWeight: "bold" }}>Inicia sesión</Text>
        </Text>
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
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 30,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
  },
  input: {
    flex: 1,
    height: 50,
    borderWidth: 1,
    borderRadius: 10,
    paddingLeft: 10,
    marginLeft: 10,
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
  loginRedirect: {
    marginTop: 20,
    alignItems: "center",
  },
});

export default RegisterScreen;

//creame screen para editar el perfil del usuario
import React, { useState } from "react";
import { View, Text, StyleSheet, TextInput, Button } from "react-native";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";

const EditProfile = () => {
  const { user, updateUser } = useAuth();
  const { theme } = useTheme();
  const colors = theme.colors;
  const [newName, setNewName] = useState(user?.nombre || "");
  const [newEmail, setNewEmail] = useState(user?.email || "");

  const handleUpdate = () => {
    updateUser({ nombre: newName, email: newEmail });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.primaryBlue }]}>
        Editar Perfil
      </Text>
      <TextInput
        style={[styles.input, { color: colors.darkText }]}
        placeholder="Nombre"
        value={newName}
        onChangeText={setNewName}
      />
      <TextInput
        style={[styles.input, { color: colors.darkText }]}
        placeholder="Correo Electrónico"
        value={newEmail}
        onChangeText={setNewEmail}
      />
      <Button title="Actualizar Perfil" onPress={handleUpdate} />
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
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
});

export default EditProfile;
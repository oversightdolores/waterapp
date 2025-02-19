import { View, TextInput, TouchableOpacity, Text, StyleSheet, Alert } from "react-native";
import { Mail, Lock } from "lucide-react-native";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useState } from "react";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../types";
//import * as Google from "expo-auth-session/providers/google"; // 🔥 Importación de Google Login

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, "Login">;

interface Props {
  navigation: LoginScreenNavigationProp;
}

const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const theme = useTheme();
  const colors = theme.theme.colors;
  const { login,token,user } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const Google = {
    useAuthRequest: () => {

      return [null, null, async () => {}];
    },
  }

  console.log(' estoy en el login ', token, user);

  // Configuración de Google Sign-In
  const [request, response, promptAsync] = Google.useAuthRequest();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Por favor ingresa tu email y contraseña.");
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      console.log("✅ Login exitoso");
    } catch (error) {
      Alert.alert("Error", (error as Error).message || "Credenciales incorrectas");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (!request) return;
    const result = { type: "success", authentication: { 'facke_token': 'fake_token' } }; // await promptAsync(); // 🔥 Línea original
    if (result.type === "success") {
      console.log("✅ Google login exitoso", result);
      // Aquí podrías enviar el `result.authentication.accessToken` a tu backend para autenticar
    } else {
      Alert.alert("Error", "No se pudo iniciar sesión con Google");
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.primaryBlue }]}>Welcome Back</Text>

      {/* Inputs */}
      <View style={styles.inputContainer}>
        <Mail color={colors.primaryBlue} size={24} />
        <TextInput
          placeholder="Email"
          keyboardType="email-address"
          placeholderTextColor={colors.lightText}
          value={email}
          onChangeText={setEmail}
          style={[styles.input, { borderColor: colors.lightBlue, color: colors.darkText }]}
        />
      </View>

      <View style={styles.inputContainer}>
        <Lock color={colors.primaryBlue} size={24} />
        <TextInput
          placeholder="Password"
          placeholderTextColor={colors.lightText}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
          style={[styles.input, { borderColor: colors.lightBlue, color: colors.darkText }]}
        />
      </View>

      {/* Botón de Login */}
      <TouchableOpacity onPress={handleLogin} style={[styles.button, { backgroundColor: colors.primaryBlue }]} disabled={loading}>
        <Text style={[styles.buttonText, { color: colors.white }]}>{loading ? "Ingresando..." : "Login"}</Text>
      </TouchableOpacity>

      {/* 🔥 Botón de Google Login */}
      <TouchableOpacity onPress={handleGoogleLogin} style={[styles.button, styles.googleButton]}>
        <Text style={[styles.buttonText, { color: colors.darkText }]}>Iniciar sesión con Google</Text>
      </TouchableOpacity>

      {/* 🔥 Botón para registrarse */}
      <TouchableOpacity onPress={() => navigation.navigate("Registration")} style={styles.registerContainer}>
        <Text style={{ color: colors.primaryBlue }}>¿No tienes cuenta? <Text style={{ fontWeight: "bold" }}>Regístrate</Text></Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.forgotPassword}>
        <Text style={{ color: colors.primaryBlue }}>Forgot Password?</Text>
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
  googleButton: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: "#DDDDDD",
    marginTop: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  registerContainer: {
    marginTop: 20,
    alignItems: "center",
  },
  forgotPassword: {
    marginTop: 15,
    alignItems: "center",
  },
});

export default LoginScreen;

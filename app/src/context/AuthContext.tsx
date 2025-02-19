import React, { createContext, useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { API_URL } from "@env"

// Definir el tipo de datos que manejará el contexto
interface AuthContextType {
  user: any | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
    register: (nombre: string, email: string, telefono: string, direccion: string, password: string, rol: string) => Promise<void>;
}

// Crear el contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);
// Proveedor del contexto
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // Nuevo estado para manejar la carga inicial

  // Función para obtener los datos del usuario desde la API
  const fetchUserData = async (authToken: string) => {
    try {
      if(!authToken) return 
      const response = await axios.get(`${API_URL}/usuarios/profile`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setUser(response.data);
      console.log("👤 Usuario cargado:", response.data);
    } catch (error) {
      console.error("❌ Error al obtener datos del usuario:", error);
      logout(); // Si el token es inválido, hacemos logout
    }
  };

  // Cargar usuario desde AsyncStorage al inicio
  useEffect(() => {
    const loadUser = async () => {
      const storedToken = await AsyncStorage.getItem("token");
      if (storedToken) {
        setToken(storedToken);
        await fetchUserData(storedToken);
      }
      setLoading(false); // Marcar que la carga ha finalizado
    };
    loadUser();
  }, []);

  // Función para iniciar sesión
  const login = async (email: string, password: string) => {
    console.log("email", email, "password", password );
    try {
        setLoading(true);
      const response = await axios.post(`${API_URL}/usuarios/login`, { email, password });
      await AsyncStorage.setItem("token", response.data.token);
      setToken(response.data.token);
      await fetchUserData(response.data.token);
        setLoading(false);
    } catch (error) {
      console.error("❌ Error en el login:", error);
      throw new Error("Credenciales incorrectas");
    }
  };

  const register = async (nombre: string, email: string, telefono: string, direccion: string, password: string, rol: string) => {
    console.log("nombre", nombre, "email", email, "telefono", telefono, "direccion", direccion, "password", password, "rol", rol);
    try {
       await axios.post(`{$API_URL}/usuarios/registro`, { nombre, email, telefono, direccion, password, rol });
       setLoading(true);
       
       return;
    } catch (error) {
        console.error("❌ Error en el registro:", error);
        throw new Error("Error en el registro");
        }
    }

  // Función para cerrar sesión
  const logout = async () => {
    setLoading(true);
    await AsyncStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setLoading(false);

  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar el contexto
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe ser usado dentro de AuthProvider");
  }
  return context;
};

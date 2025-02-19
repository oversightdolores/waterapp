import React, { createContext, useContext, useEffect, useState } from "react";
import { Appearance, useColorScheme } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface ThemeContextType {
  theme: typeof lightTheme;
  isDarkMode: boolean;
  toggleTheme: () => void;
}

// 🎨 Tema Claro
export const lightTheme = {
  colors: {
    primaryBlue: "#007AFF",
    secondaryBlue: "#0056b3",
    lightBlue: "#E3F2FD",
    white: "#FFFFFF",
    background: "#F8F9FA",
    card: "#FFFFFF",
    border: "#E0E0E0",
    darkText: "#2C3E50",
    lightText: "#6C757D",
    success: "#28A745",
    warning: "#FFC107",
    danger: "#DC3545",
  },
  spacing: {
    s: 8,
    m: 16,
    l: 24,
    xl: 40,
  },
};

// 🎨 Tema Oscuro
export const darkTheme = {
  colors: {
    primaryBlue: "#1E90FF",
    secondaryBlue: "#1565C0",
    lightBlue: "#1E3A8A",
    white: "#F8F9FA",
    background: "#121212",
    card: "#1E1E1E",
    border: "#333333",
    darkText: "#E0E0E0",
    lightText: "#A0A0A0",
    success: "#81C784",
    warning: "#FFD54F",
    danger: "#E57373",
  },
  spacing: lightTheme.spacing,
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const systemScheme = useColorScheme();
  const [isDarkMode, setIsDarkMode] = useState<boolean>(systemScheme === "dark");

  // Cargar la preferencia del usuario desde AsyncStorage
  useEffect(() => {
    const loadThemePreference = async () => {
      const storedTheme = await AsyncStorage.getItem("theme");
      if (storedTheme) {
        setIsDarkMode(storedTheme === "dark");
      } else {
        setIsDarkMode(systemScheme === "dark");
      }
    };
    loadThemePreference();
  }, [systemScheme]);

  // Cambiar entre Light/Dark Mode y guardar en AsyncStorage
  const toggleTheme = async () => {
    const newTheme = isDarkMode ? "light" : "dark";
    setIsDarkMode(!isDarkMode);
    await AsyncStorage.setItem("theme", newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme: isDarkMode ? darkTheme : lightTheme, isDarkMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook personalizado para acceder al tema
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme debe ser usado dentro de ThemeProvider");
  }
  return context;
};

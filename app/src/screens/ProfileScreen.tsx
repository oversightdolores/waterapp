import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Switch,
} from "react-native";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import {
  User,
  MapPin,
  CreditCard,
  ShoppingCart,
  ChevronRight,
  ClipboardList,
  LogOut,
  Menu,
} from "lucide-react-native";
import { DrawerActions, useNavigation } from "@react-navigation/native";

const ProfileScreen = () => {
  const { logout, user, loading } = useAuth();
  const { theme, toggleTheme, isDarkMode } = useTheme();
  const colors = theme.colors;
  const navigation = useNavigation();

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
    >

<TouchableOpacity
  style={styles.menuButton}
  onPress={() => navigation.dispatch(DrawerActions.openDrawer())} // 🔥 Abre el menú lateral
>
  <Menu color={colors.primaryBlue} size={24} />
</TouchableOpacity>

      {/* 📌 Encabezado */}
      <View style={styles.header}>
        <User color={colors.primaryBlue} size={60} />
        <Text style={[styles.name, { color: colors.darkText }]}>
          {user?.nombre || "Usuario"}
        </Text>
        <Text style={[styles.email, { color: colors.lightText }]}>
          {user?.email || "Correo no disponible"}
        </Text>
      </View>

      {/* 🌙 Cambiar Tema */}
      <View style={[styles.section, styles.rowBetween]}>
        <Text style={[styles.sectionTitle, { color: colors.primaryBlue }]}>
          Modo Oscuro
        </Text>
        <Switch
          value={isDarkMode}
          onValueChange={toggleTheme}
          thumbColor={colors.primaryBlue}
          trackColor={{ false: colors.lightText, true: colors.primaryBlue }}
        />
      </View>


      <TouchableOpacity
        style={styles.option}
        onPress={() => navigation.navigate("Order" as never)}
      >
        <ShoppingCart color={colors.primaryBlue} size={24} />
        <Text style={[styles.optionText, { color: colors.darkText }]}>
          Carrito de Compras
        </Text>
        <ChevronRight color={colors.lightText} size={24} />
      </TouchableOpacity>

      {/* 🛍 Pedidos */}
      <View style={[styles.section, { borderTopWidth: 1, borderColor: colors.border }]}>
        <Text style={[styles.sectionTitle, { color: colors.primaryBlue }]}>
          Mis Pedidos
        </Text>

        <TouchableOpacity
          style={styles.option}
          onPress={() => navigation.navigate("PedidosEnEspera")}
        >
          <ClipboardList color={"orange"} size={24} />
          <Text style={[styles.optionText, { color: colors.darkText }]}>
            Pedidos en Espera
          </Text>
          <ChevronRight color={colors.lightText} size={24} />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.option}
          onPress={() => navigation.navigate("PedidosFinalizados")}
        >
          <ClipboardList color={"green"} size={24} />
          <Text style={[styles.optionText, { color: colors.darkText }]}>
            Pedidos Finalizados
          </Text>
          <ChevronRight color={colors.lightText} size={24} />
        </TouchableOpacity>
      </View>

      {/* 🔴 Botón de Logout */}
      <TouchableOpacity
        onPress={logout}
        style={[styles.logoutButton, { backgroundColor: colors.primaryBlue }]}
      >
        <LogOut color={colors.white} size={24} />
        <Text style={[styles.logoutButtonText, { color: colors.white }]}>
          {loading ? "Cerrando sesión..." : "Cerrar sesión"}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

// 📌 **Estilos**
const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { alignItems: "center", padding: 20 },
  name: { fontSize: 24, fontWeight: "bold", marginTop: 10 },
  email: { fontSize: 16, marginTop: 5 },
  section: { padding: 20, borderBottomWidth: 1, borderBottomColor: "#e0e0e0" },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10 },
  option: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 15,
    paddingHorizontal: 20,
  },
  optionText: { flex: 1, fontSize: 16, marginLeft: 10 },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 15,
    borderRadius: 10,
    margin: 20,
  },
  logoutButtonText: { fontSize: 18, fontWeight: "bold", marginLeft: 10 },
  rowBetween: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  menuButton: { position: "absolute", top: 10, left: 10, padding: 10 },
});

export default ProfileScreen;

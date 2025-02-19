import { View, Text, FlatList, ActivityIndicator, StyleSheet } from "react-native";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchOrders } from "../redux/slices/orderSlice";
import { RootState, AppDispatch } from "../redux/store";
import { useTheme } from "../context/ThemeContext";

interface Pedido {
  id: string;
  total: number;
  estado: string;
  metodoPago: string; // "efectivo" | "electrónico"
  Usuario?: {
    nombre: string;
    direccion: string;
    telefono?: string;
  };
  productos: {
    id: string;
    nombre: string;
    cantidad: number;
  }[];
}

const PedidoScreen = () => {
  const { theme } = useTheme();
  const colors = theme.colors;
  const dispatch = useDispatch<AppDispatch>();
  const { orders, loading, error } = useSelector((state: RootState) => state.order);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  if (loading) return <ActivityIndicator size="large" color={colors.primaryBlue} style={styles.loader} />;
  if (error) return <Text style={styles.error}>{error}</Text>;

  console.log("orders", orders);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.primaryBlue }]}>📦 Pedidos</Text>

      <FlatList
        data={orders}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={[styles.orderItem, { backgroundColor: colors.card }]}>
            {/* 🆔 ID del pedido */}
            <Text style={[styles.orderTitle, { color: colors.darkText }]}>Pedido #{item.id}</Text>

            {/* 🛒 Cliente */}
            <Text style={[styles.customerInfo, { color: colors.lightText }]}>
              Cliente: {item.Usuario?.nombre || "Desconocido"}
            </Text>
            <Text style={[styles.customerInfo, { color: colors.lightText }]}>
              Dirección: {item.Usuario?.direccion || "No especificada"}
            </Text>
            {item.Usuario?.telefono && (
              <Text style={[styles.customerInfo, { color: colors.lightText }]}>
                Teléfono: {item.Usuario?.telefono}
              </Text>
            )}

            {/* 💰 Total del pedido */}
            <Text style={[styles.total, { color: colors.primaryBlue }]}>Total: ${item.total.toFixed(2)}</Text>

            {/* 📦 Estado del pedido */}
            <Text style={[styles.estado, { color: colors.darkText }]}>
              Estado:{" "}
              <Text style={{ color: item.estado === "entregado" ? "green" : "orange", fontWeight: "bold" }}>
                {item.estado.toUpperCase()}
              </Text>
            </Text>

            {/* 💳 Método de pago */}
            <Text style={[styles.metodoPago, { color: colors.darkText }]}>
              Método de Pago:{" "}
              <Text
                style={{
                  color: item.metodoPago === "electrónico" ? "blue" : "green",
                  fontWeight: "bold",
                }}
              >
                {item.metodoPago === "electrónico" ? "💳 Pago Electrónico" : "💵 Efectivo"}
              </Text>
            </Text>

            {/* 📦 Productos comprados */}
            <View style={styles.productList}>
              <Text style={[styles.productHeader, { color: colors.primaryBlue }]}>Productos:</Text>
              {item?.productos?.map((producto, index) => (
                <Text key={index} style={[styles.productItem, { color: colors.darkText }]}>
                  🛒 {producto.nombre} - {producto.cantidad}x
                </Text>
              ))}
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  orderItem: { padding: 15, borderRadius: 10, marginBottom: 10 },
  orderTitle: { fontSize: 18, fontWeight: "bold" },
  customerInfo: { fontSize: 14, marginTop: 5 },
  total: { fontSize: 16, fontWeight: "bold", marginTop: 5 },
  estado: { fontSize: 16, fontWeight: "bold", marginTop: 5 },
  metodoPago: { fontSize: 16, fontWeight: "bold", marginTop: 5 },
  productList: { marginTop: 10 },
  productHeader: { fontSize: 16, fontWeight: "bold", marginBottom: 5 },
  productItem: { fontSize: 14, marginLeft: 10 },
  loader: { marginTop: 20 },
  error: { color: "red", textAlign: "center", marginTop: 20 },
});

export default PedidoScreen;

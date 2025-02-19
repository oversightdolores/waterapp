import { useEffect } from "react";
import { View, Text, StyleSheet, FlatList, TouchableOpacity, TextInput, Alert } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { Minus, Plus, CreditCard } from "lucide-react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import { removeFromCart, updateQuantity, loadCartFromStorage, clearCart } from "../redux/slices/cartSlice";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import { useAuth } from "../context/AuthContext";

const OrderScreen = () => {
  const { theme } = useTheme();
  const {user } = useAuth();
  const colors = theme.colors;
  const dispatch = useDispatch<AppDispatch>();
  const navigation = useNavigation();

  // 🔥 Obtener el estado global del carrito
  const cart = useSelector((state: RootState) => state.cart.items);
  const total = useSelector((state: RootState) => state.cart.total);

  // 🔥 Cargar el carrito desde AsyncStorage al iniciar la pantalla
  useEffect(() => {
    dispatch(loadCartFromStorage());
  }, [dispatch]);

  const updateQuantityHandler = (id: string, cantidad: number) => {
    if (cantidad <= 0) {
      dispatch(removeFromCart(id));
    } else {
      dispatch(updateQuantity({ id, cantidad }));
    }
  };

  // 🔥 Función para confirmar la compra
  const handleCheckout = async () => {
    if (!user) {
      Alert.alert("Error", "Debes iniciar sesión para continuar.");
      return;
    }

    try {
      const response = await axios.post("http://192.168.1.33:4000/api/pedidos", {
        usuarioId: user.id,
        productos: cart,
        total,
      });

      console.log("✅ Pedido creado:", response.data);

      // Limpiar el carrito después de la compra
      dispatch(clearCart());

      // ✅ Navegar a la pantalla de pago
      navigation.navigate("Pedido" as never);
    } catch (error) {
      console.error("❌ Error al crear pedido:", error);
      Alert.alert("Error", "Hubo un problema al procesar el pedido.");
    }
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={[styles.item, { backgroundColor: colors.card }]}>
      <Text style={[styles.itemName, { color: colors.darkText }]}>{item.nombre}</Text>
      <View style={styles.quantityControl}>
        <TouchableOpacity onPress={() => updateQuantityHandler(item.id, item.cantidad - 1)}>
          <Minus color={colors.primaryBlue} size={24} />
        </TouchableOpacity>
        <Text style={[styles.quantity, { color: colors.darkText }]}>{item.cantidad}</Text>
        <TouchableOpacity onPress={() => updateQuantityHandler(item.id, item.cantidad + 1)}>
          <Plus color={colors.primaryBlue} size={24} />
        </TouchableOpacity>
      </View>
      <Text style={[styles.itemPrice, { color: colors.darkText }]}>${(item.precio * item.cantidad).toFixed(2)}</Text>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.primaryBlue }]}>🛒 Carrito</Text>

      {cart.length === 0 ? (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text style={[styles.emptyCart, { color: colors.darkText }]}>Tu carrito está vacío.</Text>
        </View>
      ) : (
        <FlatList data={cart} renderItem={renderItem} keyExtractor={(item) => item.id} style={styles.list} />
      )}

      <View style={styles.totalContainer}>
        <Text style={[styles.totalText, { color: colors.darkText }]}>Total:</Text>
        <Text style={styles.totalPrice}>${total.toFixed(2)}</Text>
      </View>

      <TextInput
        style={[styles.notes, { borderColor: colors.lightBlue, color: colors.darkText }]}
        placeholderTextColor={colors.lightText}
        placeholder="Notas para la entrega..."
        multiline
      />

      <TouchableOpacity
        disabled={cart.length === 0}
        onPress={handleCheckout}
        style={[styles.button, { backgroundColor: cart.length === 0 ? colors.lightText : colors.primaryBlue }]}
      >
        <CreditCard color={colors.white} size={24} style={styles.buttonIcon} />
        <Text style={[styles.buttonText, { color: colors.white }]}>Pagar ahora</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  emptyCart: { fontSize: 18, textAlign: "center", marginTop: 20 },
  list: { flex: 1 },
  item: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", padding: 10, borderRadius: 10, marginBottom: 10 },
  itemName: { fontSize: 16, flex: 1 },
  quantityControl: { flexDirection: "row", alignItems: "center", marginRight: 10 },
  quantity: { fontSize: 18, marginHorizontal: 10 },
  itemPrice: { fontSize: 16, fontWeight: "bold" },
  totalContainer: { flexDirection: "row", justifyContent: "space-between", marginVertical: 20 },
  totalText: { fontSize: 18, fontWeight: "bold" },
  totalPrice: { fontSize: 18, fontWeight: "bold", color: "#2ecc71" },
  notes: { height: 80, borderWidth: 1, borderRadius: 10, padding: 10, marginBottom: 20 },
  button: { flexDirection: "row", height: 50, borderRadius: 10, justifyContent: "center", alignItems: "center" },
  buttonIcon: { marginRight: 10 },
  buttonText: { fontSize: 18, fontWeight: "bold" },
});

export default OrderScreen;

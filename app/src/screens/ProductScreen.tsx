import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator, Alert, RefreshControl } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { ShoppingCart } from "lucide-react-native";
import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts } from "../redux/slices/productSlice";
import { addToCart } from "../redux/slices/cartSlice";
import { RootState, AppDispatch } from "../redux/store";
import { useNavigation } from "@react-navigation/native";

const ITEMS_PER_PAGE = 10; // Cantidad de productos por carga

const ProductsScreen = () => {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const colors = theme.colors;
  const dispatch = useDispatch<AppDispatch>();

  const { products, loading, error } = useSelector((state: RootState) => state.product);
  
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true); // ✅ Evitar carga infinita si no hay más productos

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  // 🔄 Actualizar lista (Pull to Refresh)
  const handleRefresh = async () => {
    setRefreshing(true);
    setPage(1);
    await dispatch(fetchProducts());
    setHasMore(true); // ✅ Resetear flag de más productos
    setRefreshing(false);
  };

  // 📜 Cargar más productos (Infinite Scroll)
  const handleLoadMore = async () => {
    if (!hasMore || loadingMore || loading) return; // ✅ Evita ejecución innecesaria

    setLoadingMore(true);
    setPage((prevPage) => prevPage + 1);
    
    const newProducts = await dispatch(fetchProducts());
    if (newProducts.payload.length < ITEMS_PER_PAGE) {
      setHasMore(false); // ✅ No hay más productos para cargar
    }

    setLoadingMore(false);
  };

  // 🛒 Agregar producto al carrito con alerta personalizada
  const handleAddToCart = (product: any) => {
    dispatch(addToCart(product));
    Alert.alert(
      "Producto añadido 🛒",
      `${product.nombre} fue agregado al carrito.`,
      [
        { text: "Seguir comprando", style: "cancel" },
        { text: "Ver carrito", onPress: () => navigation.navigate("Order" as never) },
      ]
    );
  };

  const renderProduct = ({ item }: { item: any }) => (
    <View style={[styles.productItem, { backgroundColor: colors.card }]}>
      <Image source={{ uri: item.image || "https://archive.org/download/placeholder-image/placeholder-image.jpg" }} style={styles.productImage} />
      <View style={styles.productInfo}>
        <Text style={[styles.productName, { color: colors.darkText }]}>{item.nombre}</Text>
        <Text style={[styles.productDescription, { color: colors.lightText }]}>{item.descripcion}</Text>
        <Text style={[styles.productPrice, { color: colors.primaryBlue }]}>{`$${item.precio}`}</Text>
      </View>
      <TouchableOpacity
        style={[styles.addToCartButton, { backgroundColor: colors.primaryBlue }]}
        onPress={() => handleAddToCart(item)}
      >
        <ShoppingCart color={colors.white} size={20} />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.primaryBlue }]}>Nuestros Productos</Text>

      {loading && !products.length ? (
        <ActivityIndicator size="large" color={colors.primaryBlue} style={styles.loader} />
      ) : (
        <FlatList
          data={products}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.productList}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
          onEndReached={handleLoadMore} // 📜 Infinite Scroll
          onEndReachedThreshold={0.2} // 🔥 Cargar más cuando esté al 20% del final
          ListFooterComponent={hasMore && loadingMore ? <ActivityIndicator size="small" color={colors.primaryBlue} /> : null} // ✅ No mostrar si no hay más productos
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  productList: { paddingBottom: 20 },
  productItem: { flexDirection: "row", borderRadius: 10, marginBottom: 15, overflow: "hidden" },
  productImage: { width: 100, height: 100, borderRadius: 10 },
  productInfo: { flex: 1, padding: 10 },
  productName: { fontSize: 18, fontWeight: "bold", marginBottom: 5 },
  productDescription: { fontSize: 14, marginBottom: 5 },
  productPrice: { fontSize: 16, fontWeight: "bold" },
  addToCartButton: { padding: 10, justifyContent: "center", alignItems: "center" },
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  error: { textAlign: "center", fontSize: 16, color: "red", marginTop: 20 },
});

export default ProductsScreen;

import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, TextInput, ActivityIndicator, RefreshControl } from "react-native"
import { useTheme } from "../context/ThemeContext"
import { Navigation, Search, ShoppingCart } from "lucide-react-native"
import { AppDispatch, RootState } from "../redux/store"
import { useDispatch, useSelector } from "react-redux"
import { useEffect, useState } from "react"
import { fetchProducts, Product } from "../redux/slices/productSlice"
import { useNavigation } from "@react-navigation/native"





const ITEMS_PER_PAGE = 10; // Cantidad de productos por carga


const HomeScreen = () => {
  const navigation = useNavigation()
  const {theme} = useTheme()
  const colors = theme.colors
  const dispatch = useDispatch<AppDispatch>()
  const {products, loading, error} = useSelector((state: RootState) => state.product)
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
  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity style={[styles.productItem, { backgroundColor: colors.card }]}>
      <Image source={{ uri: item.imagen ||  "https://archive.org/download/placeholder-image/placeholder-image.jpg" }} style={styles.productImage} />
      <Text style={[styles.productName, {color: colors.darkText }]}>{item.nombre}</Text>
      <Text style={[styles.productPrice, {color: colors.lightText} ]}>{item.precio}</Text>
    </TouchableOpacity>
  )

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.primaryBlue }]}>Inicio</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Order') } >
          <ShoppingCart color={colors.primaryBlue} size={24} />
        </TouchableOpacity>
      </View>

      <View style={[styles.searchBar, { backgroundColor: colors.card }]}>
        <Search color={colors.darkText} size={20} />
        <TextInput placeholderTextColor={colors.lightText} placeholder="Search products" style={[styles.searchInput, {color: colors.darkText}]} />
      </View>

      <Image source={{ uri: "https://archive.org/download/placeholder-image/placeholder-image.jpg" }} style={[styles.banner, {backgroundColor: colors.card}]} />

      <Text style={[styles.sectionTitle, { color: colors.darkText }]}>Popular Products</Text>

      {loading && !products.length ? (
              <ActivityIndicator size="large" color={colors.primaryBlue} style={styles.loader} />
            ) : (
              
              <FlatList
                data={products}
                renderItem={renderProduct}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.productRow}
                numColumns={2}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
                onEndReached={handleLoadMore} // 📜 Infinite Scroll
                onEndReachedThreshold={0.2} // 🔥 Cargar más cuando esté al 20% del final
                ListFooterComponent={hasMore && loadingMore ? <ActivityIndicator size="small" color={colors.primaryBlue} /> : null} // ✅ No mostrar si no hay más productos
              />
            )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 20,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
  },
  banner: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    marginBottom: 20,

  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  productRow: {
    justifyContent: "space-between",
    margin : 5,
  },
  loader: { justifyContent: "center", alignItems: "center" },
  productItem: {
    width: "48%",
    marginBottom: 20,
    alignItems: "center",
    borderRadius: 10,
    margin: 5,
  },
  productImage: {
    width: "100%",
    height: 150,
    borderRadius: 10,
    marginBottom: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  productPrice: {
    fontSize: 14,
    color: "#7f8c8d",
  },
})

export default HomeScreen


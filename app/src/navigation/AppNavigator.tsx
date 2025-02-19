import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { ActivityIndicator, useColorScheme } from "react-native";
import { ThemeProvider, useTheme } from "../context/ThemeContext";
import { AuthProvider, useAuth } from "../context/AuthContext";
import LoginScreen from "../screens/LoginScreen";
import HomeScreen from "../screens/HomeScreen";
import OrderScreen from "../screens/OrderScreen";
import ProfileScreen from "../screens/ProfileScreen";
import ProductsScreen from "../screens/ProductScreen";
import AdminScreen from "../screens/AdminScreen";
import PedidoScreen from "../screens/PedidoScreen";
import { Home, Key, Package, ShoppingCart, User, View } from "lucide-react-native";
import CreateProductScreen from "../screens/CreateProductScreen";
import { SafeAreaView } from "react-native-safe-area-context";
import { createDrawerNavigator } from "@react-navigation/drawer";
import RegisterScreen from "../screens/RegisterScreen";
import EditProfile from "../screens/EditProfile";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();


// 📌 **Bottom Tab Navigator**
function MainTabs() {
  const { theme } = useTheme();
  const { user } = useAuth(); // 👈 Obtener el usuario autenticado
  const colors = theme.colors;

  // 🔥 Definir las pestañas disponibles
  const tabs = [
    { name: "Home", component: HomeScreen, icon: Home },
    { name: "Products", component: ProductsScreen, icon: Package },
    { name: "Order", component: OrderScreen, icon: ShoppingCart },
    { name: "Profile", component: ProfileNavigator, icon: User },
    { name: "Pedido", component: PedidoScreen, icon: ShoppingCart },
  ];
  console.log(user.rol);
  // 🔥 Si el usuario es admin, agregar Admin a las pestañas
  if (user?.rol === "admin") {
    tabs.push({ name: "Admin", component: AdminScreen, icon: Key });
  }

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          const tab = tabs.find((tab) => tab.name === route.name);
          return tab ? <tab.icon color={color} size={size} /> : null;
        },
        tabBarActiveTintColor: colors.primaryBlue,
        tabBarInactiveTintColor: colors.lightText,
        headerShown: false,
      })}
    >
      {tabs.map((tab) => (
        <Tab.Screen key={tab.name} name={tab.name} component={tab.component} />
      ))}
    </Tab.Navigator>
  );
}



// 📌 **Stack Navigator con validación de usuario**
function AppStack() {
  const { user, token, loading } = useAuth();
  const {theme} = useTheme();
  const colors = theme.colors;

  // 🔥 Muestra el ActivityIndicator si está cargando
  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: colors.background }}>
        <ActivityIndicator size="large" animating={true} color={colors.darkText} />
      </SafeAreaView>
    );
  }

  return (
    <Stack.Navigator initialRouteName={token && user ? "MainTabs" : "Login"} screenOptions={{ headerShown: false }}>
      {!token || !user ? (
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Registration" component={RegisterScreen} />
        </>
      ) : (
        <>
          <Stack.Screen name="MainTabs" component={MainTabs} />
          <Stack.Screen name="Product" component={ProductsScreen} />
          <Stack.Screen name="Pedido" component={PedidoScreen} />
          <Stack.Screen name="Admin" component={AdminScreen} />
          <Stack.Screen name="Create" component={CreateProductScreen} />
          <Stack.Screen name="Order" component={OrderScreen} />
          <Stack.Screen name="MainApp" component={ProfileNavigator} />
        </>
      )}
    </Stack.Navigator>
  );
}

export function ProfileNavigator() {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerStyle: { backgroundColor: "#fff", width: 280 },
        headerShown: false,
      }}
    >
      <Drawer.Screen name="Perfil" component={ProfileScreen} />
      <Drawer.Screen name="EditarPerfil" component={EditProfile} />
      <Drawer.Screen name="Direcciones" component={() => <Text>Administrar Direcciones</Text>} />
      <Drawer.Screen name="MetodosPago" component={() => <Text>Métodos de Pago</Text>} />
      <Drawer.Screen name="Carrito" component={() => <Text>Carrito de Compras</Text>} />
      <Drawer.Screen name="PedidosEnEspera" component={() => <Text>Pedidos en Espera</Text>} />
      <Drawer.Screen name="PedidosFinalizados" component={() => <Text>Pedidos Finalizados</Text>} />
    </Drawer.Navigator>
  );
}


// 📌 **Navegación Principal**
export default function AppNavigator() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <NavigationContainer>
          <AppStack />
        </NavigationContainer>
      </ThemeProvider>
    </AuthProvider>
  );
}

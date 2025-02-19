import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import ProfileScreen from "../screens/ProfileScreen"; // Importa la pantalla correctamente
import { NavigationContainer } from "@react-navigation/native";

const Drawer = createDrawerNavigator();

const MenuScreen = () => {
  return (
    <NavigationContainer>
      <Drawer.Navigator
        initialRouteName="Profile"
        screenOptions={{
          drawerStyle: { backgroundColor: "#fff", width: 250 },
          headerShown: false, // Oculta el header predeterminado del drawer
        }}
      >
        <Drawer.Screen name="Perfil" component={ProfileScreen} />
      </Drawer.Navigator>
    </NavigationContainer>
  );
};

export default MenuScreen;

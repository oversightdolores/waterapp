

import { NavigatorScreenParams } from "@react-navigation/native";

export type RootStackParamList = {
  Login: undefined;
  Registration: undefined;
  MainTabs: NavigatorScreenParams<TabParamList>; // Incluye el Tab Navigator
  Admin: undefined;
    Pedido: undefined;
    Product: undefined;
    Create: undefined;
};

export type TabParamList = {
  Home: undefined;
  Products: undefined;
  Order: undefined;
  Profile: undefined;
    Admin: undefined;
    Pedido: undefined;
    Product: undefined;
    Create: undefined;
};

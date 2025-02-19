import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { Provider } from "react-redux";
import { store } from "./src/redux/store";
import { GestureHandlerRootView } from 'react-native-gesture-handler';

export default function App() {
  console.log('estoy en app');
  return(
    <GestureHandlerRootView>
  <Provider store={store}>
  <AppNavigator />
</Provider>
</GestureHandlerRootView>
  );
}

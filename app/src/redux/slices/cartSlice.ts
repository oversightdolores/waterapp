import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AppDispatch } from "../store";

interface CartItem {
  id: string;
  nombre: string;
  precio: number;
  image: string;
  cantidad: number;
}

interface CartState {
  items: CartItem[];
  total: number;
}

const initialState: CartState = {
  items: [],
  total: 0,
};

// 🔥 Guardar el carrito en AsyncStorage
const saveCartToStorage = async (cart: CartState) => {
  try {
    await AsyncStorage.setItem("cart", JSON.stringify(cart));
  } catch (error) {
    console.error("Error al guardar el carrito:", error);
  }
};

// 🔥 Cargar el carrito desde AsyncStorage
export const loadCartFromStorage = () => async (dispatch: AppDispatch) => {
  try {
    const cartData = await AsyncStorage.getItem("cart");
    if (cartData) {
      dispatch(setCart(JSON.parse(cartData)));
    }
  } catch (error) {
    console.error("Error al cargar el carrito:", error);
  }
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<CartItem>) => {
      const existingItem = state.items.find((item) => item.id === action.payload.id);
      if (existingItem) {
        existingItem.cantidad += 1;
      } else {
        state.items.push({ ...action.payload, cantidad: 1 });
      }
      state.total += action.payload.precio;
      saveCartToStorage(state);
    },
    updateQuantity: (state, action: PayloadAction<{ id: string; cantidad: number }>) => {
      const item = state.items.find((item) => item.id === action.payload.id);
      if (item) {
        item.cantidad = Math.max(0, action.payload.cantidad);
        if (item.cantidad === 0) {
          state.items = state.items.filter((i) => i.id !== item.id);
        }
      }
      state.total = state.items.reduce((total, item) => total + item.precio * item.cantidad, 0);
      saveCartToStorage(state);
    },
    removeFromCart: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      state.total = state.items.reduce((total, item) => total + item.precio * item.cantidad, 0);
      saveCartToStorage(state);
    },
    clearCart: (state) => {
      state.items = [];
      state.total = 0;
      saveCartToStorage(state);
    },
    setCart: (state, action: PayloadAction<CartState>) => {
      return action.payload;
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart, setCart } = cartSlice.actions;
export default cartSlice.reducer;

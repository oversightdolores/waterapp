import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "@env";

interface Usuario {
  id: string;
  nombre: string;
  email: string;
  direccion: string;
  telefono: string;
}


interface Order {
  id: string;
  total: number;
  estado: string;
  metodoPago: string; // "efectivo" | "electrónico"
  Usuario?: Usuario;
  productos: {
    id: string;
    nombre: string;
    cantidad: number;
  }[];
}

interface OrderState {
  orders: Order[];
  loading: boolean;
  error: string | null;
}

const initialState: OrderState = {
  orders: [],
  loading: false,
  error: null,
};

// 🔥 Función para obtener el token desde AsyncStorage
const getAuthToken = async () => {
  return await AsyncStorage.getItem("token");
};

// 🔥 Configurar axios para incluir el token en cada petición
axios.interceptors.request.use(async (config) => {
  const token = await getAuthToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 🔥 Obtener todos los pedidos
export const fetchOrders = createAsyncThunk("orders/fetchOrders", async () => {
  const response = await axios.get(`${API_URL}/pedidos/`);
  return response.data;
});

// 🔥 Obtener un pedido por ID
export const fetchOrderById = createAsyncThunk("orders/fetchOrderById", async (orderId: string) => {
  const response = await axios.get(`${API_URL}/pedidos/${orderId}`);
  return response.data;
});

// 🔥 Crear un nuevo pedido
export const createOrder = createAsyncThunk("orders/createOrder", async (orderData: Omit<Order, "id">) => {
  const response = await axios.post(`${API_URL}/pedidos/`, orderData);
  return response.data;
});

// 🔥 Actualizar pedido (Ej: cambiar estado)
export const updateOrder = createAsyncThunk(
  "orders/updateOrder",
  async ({ orderId, data }: { orderId: string; data: Partial<Order> }) => {
    const response = await axios.put(`${API_URL}/pedidos/${orderId}`, data);
    return response.data;
  }
);

// 🔥 Eliminar un pedido
export const deleteOrder = createAsyncThunk("orders/deleteOrder", async (orderId: string) => {
  await axios.delete(`${API_URL}/pedidos/${orderId}`);
  return orderId; // Retornar el ID eliminado para actualizar el estado
});

const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 🔥 Obtener todos los pedidos
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error al obtener pedidos";
      })

      // 🔥 Obtener un pedido por ID
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        const existingIndex = state.orders.findIndex((order) => order.id === action.payload.id);
        if (existingIndex !== -1) {
          state.orders[existingIndex] = action.payload;
        } else {
          state.orders.push(action.payload);
        }
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error al obtener el pedido";
      })

      // 🔥 Crear un pedido
      .addCase(createOrder.pending, (state) => {
        state.loading = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.orders.push(action.payload);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error al crear el pedido";
      })

      // 🔥 Actualizar pedido
      .addCase(updateOrder.fulfilled, (state, action) => {
        const index = state.orders.findIndex((order) => order.id === action.payload.id);
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      })

      // 🔥 Eliminar pedido
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.orders = state.orders.filter((order) => order.id !== action.payload);
      });
  },
});

export default orderSlice.reducer;

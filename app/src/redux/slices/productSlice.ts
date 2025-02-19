import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "@env";

export  interface Product {
  id: string;
  nombre: string;
  descripcion?: string;
  precio: string;
  stock?: string;
  imagen?: string;
}

interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  loading: false,
  error: null,
};

// 🔥 Obtener el token de autenticación
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

// 🔥 Obtener todos los productos
export const fetchProducts = createAsyncThunk("products/fetchProducts", async () => {
  const response = await axios.get(`${API_URL}/productos/`);
  return response.data;
});

// 🔥 Obtener un producto por ID
export const fetchProductById = createAsyncThunk("products/fetchProductById", async (productId: string) => {
  const response = await axios.get(`${API_URL}/productos/${productId}`);
  return response.data;
});

// 🔥 Crear un nuevo producto
export const createProduct = createAsyncThunk("products/createProduct", async (productData: Omit<Product, "id">) => {
  const response = await axios.post(`${API_URL}/productos/`, productData);
  return response.data;
});

// 🔥 Actualizar un producto
export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ productId, data }: { productId: string; data: Partial<Product> }) => {
    const response = await axios.put(`${API_URL}/productos/${productId}`, data);
    return response.data;
  }
);

// 🔥 Eliminar un producto
export const deleteProduct = createAsyncThunk("products/deleteProduct", async (productId: string) => {
  await axios.delete(`${API_URL}/productos/${productId}`);
  return productId; // Retornar el ID eliminado para actualizar el estado
});

// 📌 **Slice de productos**
const productSlice = createSlice({
  name: "product",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 🔥 Obtener todos los productos
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error al obtener productos";
      })

      // 🔥 Obtener un producto por ID
      .addCase(fetchProductById.fulfilled, (state, action) => {
        const existingIndex = state.products.findIndex((product) => product.id === action.payload.id);
        if (existingIndex !== -1) {
          state.products[existingIndex] = action.payload;
        } else {
          state.products.push(action.payload);
        }
      })

      // 🔥 Crear un producto
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error al crear el producto";
      })

      // 🔥 Actualizar producto
      .addCase(updateProduct.fulfilled, (state, action) => {
        const index = state.products.findIndex((product) => product.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })

      // 🔥 Eliminar producto
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.products = state.products.filter((product) => product.id !== action.payload);
      });
  },
});

export default productSlice.reducer;

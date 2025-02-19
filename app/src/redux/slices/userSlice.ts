import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { API_URL } from "@env";

interface User {
  id: string;
  nombre: string;
  email: string;
  role: string;
}

interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
};

// 🔥 Obtener todos los usuarios
export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const response = await axios.get(`${API_URL}/usuarios`);
  return response.data;
});

// 🔥 Obtener un usuario por ID
export const fetchUserById = createAsyncThunk("users/fetchUserById", async (userId: string) => {
  const response = await axios.get(`${API_URL}/usuarios/${userId}`);
  return response.data;
});

// 🔥 Eliminar usuario
export const deleteUser = createAsyncThunk("users/deleteUser", async (userId: string) => {
  await axios.delete(`${API_URL}/usuarios/${userId}`);
  return userId; // Retornar el ID para filtrarlo del estado
});

// 🔥 Actualizar usuario (Ej: cambiar rol)
export const updateUser = createAsyncThunk(
  "users/updateUser",
  async ({ userId, data }: { userId: string; data: Partial<User> }) => {
    const response = await axios.put(`${API_URL}/usuarios/${userId}`, data);
    return response.data;
  }
);

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error al obtener usuarios";
      })

      // Obtener usuario por ID
      .addCase(fetchUserById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.map((user) => (user.id === action.payload.id ? action.payload : user));
      })
      .addCase(fetchUserById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Error al obtener el usuario";
      })

      // Eliminar usuario
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.users = state.users.filter((user) => user.id !== action.payload);
      })

      // Actualizar usuario
      .addCase(updateUser.fulfilled, (state, action) => {
        state.users = state.users.map((user) => (user.id === action.payload.id ? action.payload : user));
      });
  },
});

export default userSlice.reducer;

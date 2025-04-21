import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';

export const register = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/register', userData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post('/auth/login', userData);
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response.data);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    token: localStorage.getItem('token') || null,
    status: 'idle', // initial state
    error: null
  },
  reducers: {
    logout: (state) => {
      localStorage.removeItem('token');
      sessionStorage.removeItem('token');
      state.user = null;
      state.token = null;
      state.status = 'idle'; // Reset status on logout
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Register cases
      .addCase(register.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.status = 'idle'; // Reset to idle after success
        state.token = action.payload.token;
        state.user = action.payload.user || null;
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(register.rejected, (state, action) => {
        state.status = 'idle'; // Reset to idle after failure
        state.error = action.payload?.message || 'Registration failed';
      })
      
      // Login cases
      .addCase(login.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.status = 'idle'; // Reset to idle after success
        state.token = action.payload.token;
        state.user = action.payload.user || null;
        localStorage.setItem('token', action.payload.token);
      })
      .addCase(login.rejected, (state, action) => {
        state.status = 'idle'; // Reset to idle after failure
        state.error = action.payload?.message || 'Login failed';
      });
  }
});

export const { logout, clearError } = authSlice.actions;
export default authSlice.reducer;
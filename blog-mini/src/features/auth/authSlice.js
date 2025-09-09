import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import authService from '../../services/authService'

// Async thunks
export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials, { rejectWithValue }) => {
    try {
      console.log('🔵 authSlice: Calling authService.login')
      const result = await authService.login(credentials)
      console.log('🟢 authSlice: Login successful:', result)
      return result
    } catch (error) {
      console.log('🔴 authSlice: Login error caught:', error)
      console.log('🔴 authSlice: Error response:', error.response)
      console.log('🔴 authSlice: Error message:', error.response?.data?.message)
      const errorMessage = error.response?.data?.message || 'Login failed'
      console.log('🔴 authSlice: Rejecting with:', errorMessage)
      return rejectWithValue(errorMessage)
    }
  }
)

export const registerUser = createAsyncThunk(
  'auth/register',
  async (userData, { rejectWithValue }) => {
    try {
      return await authService.register(userData)
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Registration failed')
    }
  }
)

export const logoutUser = createAsyncThunk(
  'auth/logout',
  async () => {
    authService.logout()
  }
)

export const updateUserProfile = createAsyncThunk(
  'auth/updateProfile',
  async (updateData, { rejectWithValue }) => {
    try {
      return await authService.updateProfile(updateData)
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Update failed')
    }
  }
)

export const verifyEmail = createAsyncThunk(
  'auth/verifyEmail',
  async ({ email, verificationCode }, { rejectWithValue }) => {
    try {
      return await authService.verifyEmail(email, verificationCode)
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Verification failed')
    }
  }
)

export const resendVerification = createAsyncThunk(
  'auth/resendVerification',
  async ({ email }, { rejectWithValue }) => {
    try {
      return await authService.resendVerification(email)
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Resend failed')
    }
  }
)

const initialState = {
  user: authService.getCurrentUser(),
  token: authService.getToken(),
  isLoading: false,
  error: null,
  isAuthenticated: !!authService.getToken(),
}

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    setCredentials: (state, action) => {
      state.user = action.payload.user
      state.token = action.payload.token
      state.isAuthenticated = true
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
        state.isAuthenticated = false
      })
      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        // Chỉ set authenticated nếu có token (đã verify email)
        if (action.payload.token) {
          state.token = action.payload.token
          state.isAuthenticated = true
        } else {
          // Nếu chưa verify, không set authenticated
          state.token = null
          state.isAuthenticated = false
        }
        state.error = null
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
        state.isAuthenticated = false
      })
      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null
        state.token = null
        state.isAuthenticated = false
        state.error = null
      })
      // Update Profile
      .addCase(updateUserProfile.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.error = null
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Email Verification
      .addCase(verifyEmail.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload.user
        state.token = action.payload.token
        state.isAuthenticated = true
        state.error = null
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Resend Verification
      .addCase(resendVerification.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(resendVerification.fulfilled, (state) => {
        state.isLoading = false
        state.error = null
      })
      .addCase(resendVerification.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  },
})

export const { clearError, setCredentials } = authSlice.actions
export default authSlice.reducer

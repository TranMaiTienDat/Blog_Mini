import api from '../api/axios'

const authService = {
  login: async (credentials) => {
    console.log('Login request to:', api.defaults.baseURL + '/auth/login')
    console.log('Credentials:', credentials)
    const response = await api.post('/auth/login', credentials)
    console.log('Login response:', response.data)
    if (response.data.token) {
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
    }
    return response.data
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData)
    if (response.data.token) {
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
    }
    return response.data
  },

  logout: () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  },

  getCurrentUser: () => {
    const user = localStorage.getItem('user')
    return user ? JSON.parse(user) : null
  },

  getToken: () => {
    return localStorage.getItem('token')
  },

  updateProfile: async (updateData) => {
    const response = await api.put('/auth/profile', updateData)
    if (response.data.user) {
      localStorage.setItem('user', JSON.stringify(response.data.user))
    }
    return response.data
  },

  verifyEmail: async (email, verificationCode) => {
    const response = await api.post('/auth/verify-email', { email, verificationCode })
    if (response.data.token) {
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
    }
    return response.data
  },

  resendVerification: async (email) => {
    const response = await api.post('/auth/resend-verification', { email })
    return response.data
  },
}

export default authService

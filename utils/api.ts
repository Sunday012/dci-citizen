// utils/api.ts
import axios from 'axios'
import Cookies from 'js-cookie'

const api = axios.create({
  baseURL: 'http://167.235.51.199:8000/api/v1'
})

// Add request interceptor
api.interceptors.request.use((config) => {
  const token = Cookies.get('auth_token')
  console.log('Current token:', token) // For debugging

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  } else {
    console.warn('No auth token found')
  }
  return config
}, (error) => {
  return Promise.reject(error)
})

// Add response interceptor to handle 401s
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401) {
//       // Redirect to login or handle unauthorized
//       console.error('Unauthorized - redirecting to login')
//       window.location.href = '/auth'
//     }
//     return Promise.reject(error)
//   }
// )

export default api
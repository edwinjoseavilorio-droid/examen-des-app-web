import axios from 'axios'

// URL base de MockAPI
const BASE_URL = 'https://6a0e46951736097c3609a66c.mockapi.io'

const api=axios.create({
  baseURL:BASE_URL,
  headers: {'Content-Type': 'application/json'}
})

// ── USUARIOS ──────────────────────────────────────
export const usuariosService = {
  getAll:  ()         => api.get('/usuarios'),
  getById: (id)       => api.get(`/usuarios/${id}`),
  create:  (data)     => api.post('/usuarios', data),
  update:  (id, data) => api.put(`/usuarios/${id}`, data),
  delete:  (id)       => api.delete(`/usuarios/${id}`)
}

// ── PRODUCTOS ─────────────────────────────────────
export const productosService = {
  getAll:  ()         => api.get('/productos'),
  getById: (id)       => api.get(`/productos/${id}`),
  create:  (data)     => api.post('/productos', data),
  update:  (id, data) => api.put(`/productos/${id}`, data),
  delete:  (id)       => api.delete(`/productos/${id}`)
}

export default api
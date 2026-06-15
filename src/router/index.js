import { createRouter, createWebHashHistory } from 'vue-router'
import { isAdmin } from '../utils/permissions.js'
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import ProductView from '../views/ProductView.vue'
import ClientesView from '../views/ClientesView.vue'
import ContactoView from '../views/ContactoView.vue'
import UsuariosView from '../views/UsuariosView.vue'

const routes = [
  { path: '/', redirect: '/login' },
  { path: '/login', component: LoginView },
  {
    path: '/dashboard',
    component: DashboardView,
    children: [
      { path: 'productos', component: ProductView },
      { path: 'clientes', component: ClientesView },
      { path: 'contacto', component: ContactoView },
      { 
        path: 'usuarios', 
        component: UsuariosView,
        meta: { requiresAdmin: true }
      }
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// Guard de autenticación y autorización
router.beforeEach((to, from, next) => {
  const loggedIn = localStorage.getItem('loggedIn') === 'true'

  // Si no está autenticado y no va a login
  if (to.path !== '/login' && !loggedIn) {
    return next('/login')
  }

  // Si está autenticado e intenta ir a login
  if (to.path === '/login' && loggedIn) {
    return next('/dashboard')
  }

  // Si la ruta requiere ser admin
  if (to.meta.requiresAdmin && !isAdmin()) {
    alert('⚠️ No tienes permiso para acceder a esta sección')
    return next('/dashboard')
  }

  next()
})

export default router
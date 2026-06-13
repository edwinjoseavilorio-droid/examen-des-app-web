import { createRouter, createWebHashHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import DashboardView from '../views/DashboardView.vue'
import ProductView from '../views/ProductView.vue'
import ClientesView from '../views/ClientesView.vue'
import ProyectosView from '../views/ProyectosView.vue'
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
      { path: 'proyectos', component: ProyectosView },
      { path: 'contacto', component: ContactoView },
      { path: 'usuarios', component: UsuariosView }  // 🆕 nueva ruta
    ]
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

// Guard de autenticación
router.beforeEach((to, from, next) => {
  const loggedIn = localStorage.getItem('loggedIn') === 'true'

  if (to.path !== '/login' && !loggedIn) {
    return next('/login')
  }

  if (to.path === '/login' && loggedIn) {
    return next('/dashboard')
  }

  next()
})

export default router
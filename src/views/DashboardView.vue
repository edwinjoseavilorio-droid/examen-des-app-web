<template>
  <div class="d-flex flex-column min-vh-100">

    <NavbarComponent />

    <div class="d-flex flex-grow-1">
      <SidebarComponent />

      <div class="main-content">
        <router-view />

        <div v-if="$route.path === '/dashboard'">

          <h2 class="fw-bold text-primary mb-1">
            <i class="bi bi-speedometer2 me-2"></i>Panel de Control
          </h2>
          <p class="text-muted mb-4">Bienvenido, {{ nombreUsuario }} 👋</p>

          <!-- Tarjetas de resumen dinámicas -->
          <div class="row g-3 mb-4">

            <div class="col-md-4">
              <div class="card border-0 shadow-sm">
                <div class="card-body d-flex align-items-center gap-3">
                  <div class="rounded-circle p-3" style="background:#e3f2fd;">
                    <i class="bi bi-flask fs-4 text-primary"></i>
                  </div>
                  <div>
                    <div v-if="cargando" class="spinner-border spinner-border-sm text-primary"></div>
                    <div v-else class="fw-bold fs-4">{{ totalProductos }}</div>
                    <div class="text-muted small">Servicios registrados</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-md-4">
              <div class="card border-0 shadow-sm">
                <div class="card-body d-flex align-items-center gap-3">
                  <div class="rounded-circle p-3" style="background:#e8f5e9;">
                    <i class="bi bi-people-fill fs-4 text-success"></i>
                  </div>
                  <div>
                    <div v-if="cargando" class="spinner-border spinner-border-sm text-success"></div>
                    <div v-else class="fw-bold fs-4">{{ totalUsuarios }}</div>
                    <div class="text-muted small">Usuarios registrados</div>
                  </div>
                </div>
              </div>
            </div>

            <div class="col-md-4">
              <div class="card border-0 shadow-sm">
                <div class="card-body d-flex align-items-center gap-3">
                  <div class="rounded-circle p-3" style="background:#fff3e0;">
                    <i class="bi bi-briefcase-fill fs-4 text-warning"></i>
                  </div>
                  <div>
                    <div class="fw-bold fs-4">8</div>
                    <div class="text-muted small">Proyectos en curso</div>
                  </div>
                </div>
              </div>
            </div>

          </div>

          <!-- Tabla de servicios recientes desde MockAPI -->
          <div class="card border-0 shadow-sm mb-4">
            <div class="card-header bg-primary text-white fw-bold">
              <i class="bi bi-clock-history me-2"></i>Servicios Recientes
            </div>
            <div class="card-body p-0">
              <div v-if="cargando" class="text-center py-4">
                <div class="spinner-border text-primary"></div>
                <p class="mt-2 text-muted small">Cargando...</p>
              </div>
              <table v-else class="table table-hover mb-0">
                <thead class="table-light">
                  <tr>
                    <th>#</th>
                    <th>Servicio</th>
                    <th>Precio</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(p, index) in productosRecientes" :key="p.id">
                    <td>{{ index + 1 }}</td>
                    <td>{{ p.name }}</td>
                    <td>{{ Number(p.price).toLocaleString('es-CO', { style: 'currency', currency: 'COP' }) }}</td>
                    <td><span class="badge bg-success">Activo</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Tabla de usuarios recientes desde MockAPI -->
          <div class="card border-0 shadow-sm">
            <div class="card-header bg-success text-white fw-bold">
              <i class="bi bi-people-fill me-2"></i>Usuarios Recientes
            </div>
            <div class="card-body p-0">
              <div v-if="cargando" class="text-center py-4">
                <div class="spinner-border text-success"></div>
              </div>
              <table v-else class="table table-hover mb-0">
                <thead class="table-light">
                  <tr>
                    <th>#</th>
                    <th>Nombre</th>
                    <th>Usuario</th>
                    <th>Email</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(u, index) in usuariosRecientes" :key="u.id">
                    <td>{{ index + 1 }}</td>
                    <td>{{ u.name }}</td>
                    <td>{{ u.username }}</td>
                    <td>{{ u.email }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>

    <FooterComponent />
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import NavbarComponent from '../components/NavbarComponent.vue'
import SidebarComponent from '../components/SidebarComponent.vue'
import FooterComponent from '../components/FooterComponent.vue'
import { productosService, usuariosService } from '../services/api.js'

const nombreUsuario     = ref(localStorage.getItem('nombreUsuario') || 'Usuario')
const totalProductos    = ref(0)
const totalUsuarios     = ref(0)
const productosRecientes = ref([])
const usuariosRecientes  = ref([])
const cargando           = ref(false)

async function cargarDatos() {
  cargando.value = true
  try {
    const [resProductos, resUsuarios] = await Promise.all([
      productosService.getAll(),
      usuariosService.getAll()
    ])
    totalProductos.value    = resProductos.data.length
    totalUsuarios.value     = resUsuarios.data.length
    productosRecientes.value = resProductos.data.slice(0, 5)
    usuariosRecientes.value  = resUsuarios.data.slice(0, 5)
  } catch (error) {
    console.error('Error al cargar datos del dashboard:', error)
  } finally {
    cargando.value = false
  }
}

onMounted(cargarDatos)
</script>
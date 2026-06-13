<template>
  <div>
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="fw-bold text-primary">
        <i class="bi bi-flask me-2"></i>Gestión de Servicios
      </h2>
      <button class="btn btn-primary" @click="abrirModalCrear">
        <i class="bi bi-plus-lg me-2"></i>Nuevo Servicio
      </button>
    </div>

    <!-- Alerta -->
    <div v-if="alerta.mensaje" :class="`alert alert-${alerta.tipo} alert-dismissible`">
      <i :class="`bi bi-${alerta.tipo === 'success' ? 'check-circle' : 'exclamation-circle'}-fill me-2`"></i>
      {{ alerta.mensaje }}
      <button type="button" class="btn-close" @click="alerta.mensaje = ''"></button>
    </div>

    <!-- Loading -->
    <div v-if="cargando" class="text-center py-5">
      <div class="spinner-border text-primary"></div>
      <p class="mt-2 text-muted">Cargando servicios...</p>
    </div>

    <!-- Tabla -->
    <div v-else class="card border-0 shadow-sm">
      <div class="card-body p-0">
        <table class="table table-hover mb-0">
          <thead class="table-primary">
            <tr>
              <th>#</th>
              <th>Imagen</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Precio</th>
              <th class="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(producto, index) in productos" :key="producto.id">
              <td>{{ index + 1 }}</td>
              <td>
                <img :src="producto.image || 'https://via.placeholder.com/60'"
                  :alt="producto.name"
                  @error="$event.target.src='https://via.placeholder.com/60'"
                  style="width:60px;height:60px;object-fit:cover;border-radius:8px;">
              </td>
              <td>{{ producto.name }}</td>
              <td class="text-muted small">{{ producto.description }}</td>
              <td>{{ Number(producto.price).toLocaleString('es-CO', { style: 'currency', currency: 'COP' }) }}</td>
              <td class="text-center">
                <button class="btn btn-sm btn-outline-info me-1" @click="verDetalle(producto)">
                  <i class="bi bi-eye"></i>
                </button>
                <button class="btn btn-sm btn-outline-primary me-1" @click="abrirModalEditar(producto)">
                  <i class="bi bi-pencil-fill"></i>
                </button>
                <button class="btn btn-sm btn-outline-danger" @click="abrirModalEliminar(producto)">
                  <i class="bi bi-trash-fill"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Crear/Editar -->
    <div v-if="mostrarModal" class="modal-overlay" @click.self="cerrarModal">
      <div class="modal-box card shadow-lg p-4">
        <h5 class="fw-bold text-primary mb-3">
          <i class="bi bi-flask me-2"></i>
          {{ modoEditar ? 'Editar Servicio' : 'Nuevo Servicio' }}
        </h5>

        <div class="mb-3">
          <label class="form-label fw-semibold">Nombre</label>
          <input v-model="form.name" type="text" class="form-control" placeholder="Nombre del servicio" />
        </div>

        <div class="mb-3">
          <label class="form-label fw-semibold">Descripción</label>
          <textarea v-model="form.description" class="form-control" rows="3" placeholder="Descripción del servicio"></textarea>
        </div>

        <div class="mb-3">
          <label class="form-label fw-semibold">Precio (COP)</label>
          <input v-model="form.price" type="number" class="form-control" placeholder="Ej: 120000" />
        </div>

        <div class="mb-3">
          <label class="form-label fw-semibold">URL de imagen</label>
          <input v-model="form.image" type="text" class="form-control" placeholder="https://..." />
        </div>

        <!-- Vista previa de imagen -->
        <div v-if="form.image" class="mb-3 text-center">
          <img :src="form.image" alt="Vista previa"
            @error="$event.target.style.display='none'"
            @load="$event.target.style.display='block'"
            style="max-height:180px;max-width:100%;border-radius:8px;object-fit:cover;">
          <p class="text-muted small mt-1"><i class="bi bi-image me-1"></i>Vista previa</p>
        </div>

        <div class="d-flex gap-2 justify-content-end">
          <button class="btn btn-secondary" @click="cerrarModal">
            <i class="bi bi-x-lg me-1"></i>Cancelar
          </button>
          <button class="btn btn-primary" @click="guardarProducto" :disabled="guardando">
            <span v-if="guardando"><span class="spinner-border spinner-border-sm me-1"></span>Guardando...</span>
            <span v-else><i class="bi bi-save me-1"></i>{{ modoEditar ? 'Guardar cambios' : 'Crear servicio' }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Modal Detalle -->
    <div v-if="mostrarDetalle" class="modal-overlay" @click.self="mostrarDetalle = false">
      <div class="modal-box card shadow-lg p-4">
        <h5 class="fw-bold text-primary mb-3"><i class="bi bi-eye me-2"></i>Detalle del Servicio</h5>
        <img :src="productoDetalle.image || 'https://via.placeholder.com/400x200'"
          :alt="productoDetalle.name" class="w-100 mb-3"
          @error="$event.target.src='https://via.placeholder.com/400x200'"
          style="height:200px;object-fit:cover;border-radius:8px;">
        <h6 class="fw-bold">{{ productoDetalle.name }}</h6>
        <p class="text-muted">{{ productoDetalle.description }}</p>
        <p class="fw-bold text-success fs-5">
          {{ Number(productoDetalle.price).toLocaleString('es-CO', { style: 'currency', currency: 'COP' }) }}
        </p>
        <button class="btn btn-secondary w-100" @click="mostrarDetalle = false">
          <i class="bi bi-x-lg me-1"></i>Cerrar
        </button>
      </div>
    </div>

    <!-- Modal Eliminar -->
    <div v-if="mostrarModalEliminar" class="modal-overlay" @click.self="mostrarModalEliminar = false">
      <div class="modal-box card shadow-lg p-4">
        <h5 class="fw-bold text-danger mb-3">
          <i class="bi bi-exclamation-triangle-fill me-2"></i>Confirmar eliminación
        </h5>
        <p class="text-muted">
          ¿Estás seguro de eliminar el servicio <strong>{{ productoAEliminar?.name }}</strong>?
          Esta acción no se puede deshacer.
        </p>
        <div class="d-flex gap-2 justify-content-end">
          <button class="btn btn-secondary" @click="mostrarModalEliminar = false">
            <i class="bi bi-x-lg me-1"></i>Cancelar
          </button>
          <button class="btn btn-danger" @click="confirmarEliminar" :disabled="guardando">
            <span v-if="guardando"><span class="spinner-border spinner-border-sm me-1"></span>Eliminando...</span>
            <span v-else><i class="bi bi-trash-fill me-1"></i>Eliminar</span>
          </button>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { productosService } from '../services/api.js'

const productos            = ref([])
const cargando             = ref(false)
const guardando            = ref(false)
const mostrarModal         = ref(false)
const mostrarDetalle       = ref(false)
const mostrarModalEliminar = ref(false)
const modoEditar           = ref(false)
const productoAEliminar    = ref(null)
const productoDetalle      = ref({})
const alerta               = ref({ mensaje: '', tipo: 'success' })
const form                 = ref({ id: null, name: '', description: '', price: 0, image: '' })

async function cargarProductos() {
  cargando.value = true
  try {
    const { data } = await productosService.getAll()
    productos.value = data
  } catch (error) {
    mostrarAlerta('Error al cargar servicios', 'danger')
  } finally {
    cargando.value = false
  }
}

function abrirModalCrear() {
  modoEditar.value = false
  form.value = { id: null, name: '', description: '', price: 0, image: '' }
  mostrarModal.value = true
}

function abrirModalEditar(producto) {
  modoEditar.value = true
  form.value = { ...producto }
  mostrarModal.value = true
}

function abrirModalEliminar(producto) {
  productoAEliminar.value = producto
  mostrarModalEliminar.value = true
}

function verDetalle(producto) {
  productoDetalle.value = producto
  mostrarDetalle.value = true
}

function cerrarModal() {
  mostrarModal.value = false
}

async function guardarProducto() {
  if (!form.value.name || !form.value.description || !form.value.price) {
    mostrarAlerta('Por favor completa todos los campos', 'danger')
    return
  }
  guardando.value = true
  try {
    if (modoEditar.value) {
      await productosService.update(form.value.id, form.value)
      mostrarAlerta('✅ Servicio actualizado correctamente', 'success')
    } else {
      await productosService.create(form.value)
      mostrarAlerta('✅ Servicio creado correctamente', 'success')
    }
    cerrarModal()
    cargarProductos()
  } catch (error) {
    mostrarAlerta('❌ Error al guardar el servicio', 'danger')
  } finally {
    guardando.value = false
  }
}

async function confirmarEliminar() {
  guardando.value = true
  try {
    await productosService.delete(productoAEliminar.value.id)
    mostrarAlerta('✅ Servicio eliminado correctamente', 'success')
    mostrarModalEliminar.value = false
    cargarProductos()
  } catch (error) {
    mostrarAlerta('❌ Error al eliminar el servicio', 'danger')
  } finally {
    guardando.value = false
  }
}

function mostrarAlerta(mensaje, tipo = 'success') {
  alerta.value = { mensaje, tipo }
  setTimeout(() => { alerta.value.mensaje = '' }, 4000)
}

onMounted(cargarProductos)
</script>

<style scoped>
.modal-overlay {
  position: fixed; inset: 0;
  background: rgba(0,0,0,0.5);
  display: flex; align-items: center; justify-content: center;
  z-index: 1000;
}
.modal-box {
  width: 100%; max-width: 520px;
  background: white; border-radius: 12px;
  max-height: 90vh; overflow-y: auto;
}
</style>
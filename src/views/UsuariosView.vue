<template>
  <div>
    <!-- Título y botón crear -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="fw-bold text-primary"><i class="bi bi-people-fill me-2"></i>Usuarios</h2>
      <button class="btn btn-primary" @click="abrirModalCrear">
        <i class="bi bi-plus-lg me-2"></i>Nuevo Usuario
      </button>
    </div>

    <!-- Alerta de éxito o error -->
    <div v-if="alerta.mensaje" :class="`alert alert-${alerta.tipo} alert-dismissible`">
      <i
        :class="`bi bi-${
          alerta.tipo === 'success' ? 'check-circle' : 'exclamation-circle'
        }-fill me-2`"
      ></i>
      {{ alerta.mensaje }}
      <button type="button" class="btn-close" @click="alerta.mensaje = ''"></button>
    </div>

    <!-- Loading -->
    <div v-if="cargando" class="text-center py-5">
      <div class="spinner-border text-primary"></div>
      <p class="mt-2 text-muted">Cargando usuarios...</p>
    </div>

    <!-- Tabla de usuarios -->
    <div v-else class="card border-0 shadow-sm">
      <div class="card-body p-0">
        <table class="table table-hover mb-0">
          <thead class="table-primary">
            <tr>
              <th>#</th>
              <th>Nombre</th>
              <th>Usuario</th>
              <th>Email</th>
              <th>Rol</th>

              <th class="text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="usuario in usuarios" :key="usuario.id">
              <td>{{ usuario.id }}</td>
              <td>{{ usuario.name }}</td>
              <td>{{ usuario.username }}</td>
              <td>{{ usuario.email }}</td>
              <td>{{ usuario.role }}</td>
              <td class="text-center">
                <!-- Editar -->
                <button
                  class="btn btn-sm btn-outline-primary me-1"
                  @click="abrirModalEditar(usuario)"
                  title="Editar"
                >
                  <i class="bi bi-pencil-fill"></i>
                </button>
                <!-- Eliminar -->
                <button
                  class="btn btn-sm btn-outline-danger"
                  @click="abrirModalEliminar(usuario)"
                  title="Eliminar"
                >
                  <i class="bi bi-trash-fill"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- ── MODAL CREAR / EDITAR ────────────────────── -->
    <div v-if="mostrarModal" class="modal-overlay" @click.self="cerrarModal">
      <div class="modal-box card shadow-lg p-4">
        <h5 class="fw-bold text-primary mb-3">
          <i class="bi bi-person-fill me-2"></i>
          {{ modoEditar ? "Editar Usuario" : "Nuevo Usuario" }}
        </h5>

        <div class="mb-3">
          <label class="form-label fw-semibold">Nombre completo</label>
          <input
            v-model="form.name"
            type="text"
            class="form-control"
            placeholder="Nombre completo"
          />
        </div>

        <div class="mb-3">
          <label class="form-label fw-semibold">Usuario</label>
          <input
            v-model="form.username"
            type="text"
            class="form-control"
            placeholder="Nombre de usuario"
          />
        </div>

        <div class="mb-3">
          <label class="form-label fw-semibold">Contraseña</label>
          <input
            v-model="form.password"
            type="password"
            class="form-control"
            placeholder="Contraseña"
          />
        </div>

        <div class="mb-3">
          <label class="form-label fw-semibold">Email</label>
          <input
            v-model="form.email"
            type="email"
            class="form-control"
            placeholder="correo@ejemplo.com"
          />
        </div>
        <div class="mb-3">
          <label class="form-label fw-semibold">Rol</label>
          <select v-model="form.role" class="form-control">
            <option value="">Selecciona un rol</option>
            <option value="admin">Admin</option>
            <option value="user">Cliente</option>
          </select>
        </div>
        <div class="d-flex gap-2 justify-content-end">
          <button class="btn btn-secondary" @click="cerrarModal">
            <i class="bi bi-x-lg me-1"></i>Cancelar
          </button>
          <button class="btn btn-primary" @click="guardarUsuario" :disabled="guardando">
            <span v-if="guardando">
              <span class="spinner-border spinner-border-sm me-1"></span>
              Guardando...
            </span>
            <span v-else>
              <i class="bi bi-save me-1"></i>
              {{ modoEditar ? "Guardar cambios" : "Crear usuario" }}
            </span>
          </button>
        </div>
      </div>
    </div>

    <!-- ── MODAL ELIMINAR ──────────────────────────── -->
    <div
      v-if="mostrarModalEliminar"
      class="modal-overlay"
      @click.self="mostrarModalEliminar = false"
    >
      <div class="modal-box card shadow-lg p-4">
        <h5 class="fw-bold text-danger mb-3">
          <i class="bi bi-exclamation-triangle-fill me-2"></i>
          Confirmar eliminación
        </h5>
        <p class="text-muted">
          ¿Estás seguro de que deseas eliminar al usuario
          <strong>{{ usuarioAEliminar?.name }}</strong
          >? Esta acción no se puede deshacer.
        </p>
        <div class="d-flex gap-2 justify-content-end">
          <button class="btn btn-secondary" @click="mostrarModalEliminar = false">
            <i class="bi bi-x-lg me-1"></i>Cancelar
          </button>
          <button class="btn btn-danger" @click="confirmarEliminar" :disabled="guardando">
            <span v-if="guardando">
              <span class="spinner-border spinner-border-sm me-1"></span>
              Eliminando...
            </span>
            <span v-else> <i class="bi bi-trash-fill me-1"></i>Eliminar </span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { isAdmin } from "../utils/permissions.js";
import { usuariosService } from "../services/api.js";

// ── VERIFICAR PERMISOS ─────────────────────────────
if (!isAdmin()) {
  alert("⚠️ No tienes permisos para acceder a esta sección");
  window.location.href = "/#/dashboard";
}

// ── ESTADO ────────────────────────────────────────
const usuarios = ref([]);
const cargando = ref(false);
const guardando = ref(false);
const mostrarModal = ref(false);
const mostrarModalEliminar = ref(false);
const modoEditar = ref(false);
const usuarioAEliminar = ref(null);
const alerta = ref({ mensaje: "", tipo: "success" });
const form = ref({ id: null, name: "", username: "", password: "", email: "", role: "" });

// ── CARGAR USUARIOS ───────────────────────────────
async function cargarUsuarios() {
  cargando.value = true;
  try {
    const { data } = await usuariosService.getAll();
    usuarios.value = data;
  } catch (error) {
    mostrarAlerta("Error al cargar usuarios", "danger");
    console.error(error);
  } finally {
    cargando.value = false;
  }
}

// ── MODALES ───────────────────────────────────────
function abrirModalCrear() {
  modoEditar.value = false;
  form.value = { id: null, name: "", username: "", password: "", email: "", role: "" };
  mostrarModal.value = true;
}

function abrirModalEditar(usuario) {
  modoEditar.value = true;
  form.value = { ...usuario };
  mostrarModal.value = true;
}

function abrirModalEliminar(usuario) {
  usuarioAEliminar.value = usuario;
  mostrarModalEliminar.value = true;
}

function cerrarModal() {
  mostrarModal.value = false;
}

// ── GUARDAR (CREAR O EDITAR) ──────────────────────
async function guardarUsuario() {
  if (!form.value.name || !form.value.username || !form.value.password) {
    mostrarAlerta("Por favor completa todos los campos", "danger");
    return;
  }
  guardando.value = true;
  try {
    if (modoEditar.value) {
      await usuariosService.update(form.value.id, form.value);
      mostrarAlerta("✅ Usuario actualizado correctamente", "success");
    } else {
      await usuariosService.create(form.value);
      mostrarAlerta("✅ Usuario creado correctamente", "success");
    }
    cerrarModal();
    cargarUsuarios();
  } catch (error) {
    mostrarAlerta("❌ Error al guardar el usuario", "danger");
    console.error(error);
  } finally {
    guardando.value = false;
  }
}

// ── ELIMINAR ──────────────────────────────────────
async function confirmarEliminar() {
  guardando.value = true;
  try {
    await usuariosService.delete(usuarioAEliminar.value.id);
    mostrarAlerta("✅ Usuario eliminado correctamente", "success");
    mostrarModalEliminar.value = false;
    cargarUsuarios();
  } catch (error) {
    mostrarAlerta("❌ Error al eliminar el usuario", "danger");
    console.error(error);
  } finally {
    guardando.value = false;
  }
}

// ── ALERTA ────────────────────────────────────────
function mostrarAlerta(mensaje, tipo = "success") {
  alerta.value = { mensaje, tipo };
  setTimeout(() => {
    alerta.value.mensaje = "";
  }, 4000);
}

// ── INICIO ────────────────────────────────────────
onMounted(cargarUsuarios);
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}
.modal-box {
  width: 100%;
  max-width: 500px;
  background: white;
  border-radius: 12px;
}
</style>

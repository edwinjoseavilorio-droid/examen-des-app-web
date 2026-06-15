<template>
  <div class="login-bg d-flex align-items-center justify-content-center min-vh-100">
    <div class="card shadow-lg p-4" style="max-width: 420px; width: 100%">
      <div class="text-center mb-4">
        <img
          src="https://ingeocimyc.com.co/assets/logo-ingeocimyc.svg"
          alt="INGEOCIMYC"
          style="height: 60px"
          class="mb-3"
        />
        <h4 class="fw-bold text-primary">Iniciar Sesión</h4>
        <p class="text-muted small">Sistema de Gestión — INGEOCIMYC</p>
      </div>

      <form @submit.prevent="handleLogin">
        <div class="mb-3">
          <label class="form-label fw-semibold">
            <i class="bi bi-person-fill me-1"></i> Usuario
          </label>
          <input
            v-model="username"
            type="text"
            class="form-control"
            placeholder="Ingresa tu usuario"
            required
            autofocus
          />
        </div>

        <div class="mb-3">
          <label class="form-label fw-semibold">
            <i class="bi bi-lock-fill me-1"></i> Contraseña
          </label>
          <input
            v-model="password"
            type="password"
            class="form-control"
            placeholder="Ingresa tu contraseña"
            required
          />
        </div>

        <!-- Botón con loading -->
        <button type="submit" class="btn btn-primary w-100 mt-2" :disabled="cargando">
          <span v-if="cargando">
            <span class="spinner-border spinner-border-sm me-2"></span>
            Verificando...
          </span>
          <span v-else> <i class="bi bi-box-arrow-in-right me-2"></i> Entrar </span>
        </button>

        <!-- Alerta de error -->
        <div v-if="errorMsg" class="alert alert-danger mt-3 py-2 small">
          <i class="bi bi-exclamation-circle-fill me-1"></i> {{ errorMsg }}
        </div>

        <!-- Alerta de éxito -->
        <div v-if="successMsg" class="alert alert-success mt-3 py-2 small">
          <i class="bi bi-check-circle-fill me-1"></i> {{ successMsg }}
        </div>
      </form>

      <div class="alert alert-info mt-4 small">
        <strong>💡 Tip:</strong> Usa cualquier usuario generado en MockAPI<br />
        <span class="text-muted">⚠️ Solo con fines educativos.</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { usuariosService } from "../services/api.js";

const router = useRouter();
const username = ref("");
const password = ref("");
const errorMsg = ref("");
const successMsg = ref("");
const cargando = ref(false);

async function handleLogin() {
  errorMsg.value = "";
  successMsg.value = "";
  cargando.value = true;

  try {
    // Trae todos los usuarios de MockAPI
    const { data: usuarios } = await usuariosService.getAll();

    // Busca si existe el usuario con esas credenciales
    const user = usuarios.find(
      (u) => u.username === username.value && u.password === password.value
    );

    if (user) {
      // Guarda token simulado y datos del usuario
      localStorage.setItem("loggedIn", "true");
      localStorage.setItem("nombreUsuario", user.name);
      localStorage.setItem("userId", user.id);
      localStorage.setItem("userRole", user.role);

      successMsg.value = "✅ Acceso correcto. Redirigiendo...";
      setTimeout(() => router.push("/dashboard"), 800);
    } else {
      errorMsg.value = "Usuario o contraseña incorrectos";
      username.value = "";
      password.value = "";
    }
  } catch (error) {
    // Error de conexión con la API
    errorMsg.value = "❌ Error al conectar con el servidor. Intenta de nuevo.";
    console.error(error);
  } finally {
    cargando.value = false;
  }
}
</script>

<style scoped>
.login-bg {
  background: linear-gradient(135deg, #034f84 0%, #0077b6 100%);
}
</style>

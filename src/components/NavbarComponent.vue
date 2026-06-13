<template>
  <nav class="navbar navbar-expand-lg shadow-sm" style="background-color: #034f84; padding: 0.75rem 0;">
    <div class="container-fluid">

      <div class="navbar-brand d-flex align-items-center gap-3" style="margin: 0; padding: 0;">
        <img :src="logoIngeocimyc"
             alt="INGEOCIMYC" style="height: 50px; width: 50px; object-fit: contain; flex-shrink: 0;">
        <span class="text-white fw-bold" style="font-size: 1.2rem; margin: 0;">INGEOCIMYC</span>
      </div>

      <div class="d-flex align-items-center gap-3 ms-auto">
        <span class="text-white small">
          <i class="fa-solid fa-user me-1"></i>{{ nombreUsuario }}
        </span>
        <button @click="logout" class="btn btn-outline-light btn-sm">
          <i class="fa-solid fa-right-from-bracket me-1"></i> Salir
        </button>
      </div>

    </div>
  </nav>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import logoIngeocimyc from '../assets/logo-ingeocimyc.svg'

const router = useRouter()
const nombreUsuario = ref(localStorage.getItem('nombreUsuario') || 'Usuario')

function logout() {
  localStorage.removeItem('loggedIn')
  localStorage.removeItem('nombreUsuario')
  router.push('/login')
}
</script>
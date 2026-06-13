<template>
  <div class="sidebar d-flex flex-column py-3">

    <p class="text-white-50 small px-3 mb-2 text-uppercase fw-bold">Menú</p>

    <router-link to="/dashboard" exact-active-class="active">
      <i class="bi bi-house-door-fill me-2"></i> Inicio
    </router-link>

    <router-link to="/dashboard/usuarios" active-class="active">
      <i class="bi bi-people-fill me-2"></i> Usuarios
    </router-link>

    <router-link to="/dashboard/productos" active-class="active">
      <i class="bi bi-flask me-2"></i> Servicios
    </router-link>

    <router-link to="/dashboard/clientes" active-class="active">
      <i class="bi bi-person-vcard-fill me-2"></i> Clientes
    </router-link>

    <router-link to="/dashboard/proyectos" active-class="active">
      <i class="bi bi-briefcase-fill me-2"></i> Proyectos
    </router-link>

    <router-link to="/dashboard/contacto" active-class="active">
      <i class="bi bi-envelope-fill me-2"></i> Contacto
    </router-link>

  </div>
</template>

<script setup>
</script>
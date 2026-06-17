# INGEOCIMYC — Sistema de Gestión Web
# Segundo Parcial — Desarrollo de Aplicaciones Web

# Descripción
Aplicación web modular para INGEOCIMYC, laboratorio de Geotecnia y Concretos.
Permite gestionar servicios, clientes y proyectos del laboratorio mediante
una interfaz moderna construida con Vue 3 y Bootstrap 5.

# Integrantes
| Nombre | Rol |
|--------|-----|
| EDWIN JOSE CONTRERAS 0192648 | Desarrollador Frontend |
| WALCOTJAKIN GARAY SANGINO 0192600 | Desarrollador Frontend |

# Tecnologías
- Vue 3 + Vite
- Vue Router 4
- Bootstrap 5.3
- LocalStorage (CRUD simulado)

#  Cómo ejecutar
bash
npm install
npm run dev
```

# Estructura del proyecto
src/
├── assets/
├── components/
│   ├── NavbarComponent.vue      # Barra superior con logo y botón logout
│   ├── SidebarComponent.vue     # Menú lateral con rutas
│   ├── FooterComponent.vue      # Pie de página
│   └── ProductCardComponent.vue # Tarjeta individual de servicio
├── data/
│   ├── usuarios.json            # Usuarios para validación de login
│   └── products.json            # Servicios iniciales del laboratorio
├── router/
│   └── index.js                 # Configuración de rutas con vue-router
├── views/
│   ├── LoginView.vue            # Vista de inicio de sesión
│   ├── DashboardView.vue        # Panel principal con resumen
│   ├── ProductView.vue          # CRUD de servicios
│   ├── ClientesView.vue         # Listado de clientes
│   ├── ProyectosView.vue        # Tarjetas de proyectos
│   └── ContactoView.vue         # Formulario de contacto
├── main.js                      # Punto de entrada, importa Bootstrap y router
└── style.css                    # Variables de color y estilos globales

# Credenciales de prueba
| Usuario | Contraseña |
|---------|-----------|
| admin   | 1234      |
| usuario | abcd      |

---

# Rutas de la aplicación
| Ruta | Vista | Descripción |
|------|-------|-------------|
| `/login` | LoginView | Inicio de sesión |
| `/dashboard` | DashboardView | Panel principal |
| `/dashboard/productos` | ProductView | CRUD de servicios |
| `/dashboard/clientes` | ClientesView | Listado de clientes |
| `/dashboard/proyectos` | ProyectosView | Proyectos en curso |
| `/dashboard/contacto` | ContactoView | Formulario de contacto |


# Modularización y componentes

La app está construida con componentes reutilizables que se comunican mediante props y eventos:

*NavbarComponent** recibe el nombre del usuario desde `localStorage` y emite el evento de logout.
*ProductCardComponent** recibe un objeto `producto` por props y emite `ver-detalle` al padre.
*SidebarComponent** es compartido en todas las vistas hijas del dashboard.

---

# CRUD simulado con LocalStorage

Los servicios se precargan desde `products.json` en el primer acceso.
A partir de ahí todas las operaciones (crear, editar, eliminar) se guardan
en `localStorage` bajo la clave `productos`, simulando una base de datos.

js
// Guardar en LocalStorage
localStorage.setItem('productos', JSON.stringify(productos.value))

// Leer desde LocalStorage
const guardados = localStorage.getItem('productos')
if (guardados) productos.value = JSON.parse(guardados)


---

# Trabajo colaborativo
- Repositorio: [segundo-parcial-des-app-web](https://github.com/)
- Ramas utilizadas: `main`
- Evidencia de commits en el historial del repositorio

---

# Referencias
- [Vue.js 3 Documentation](https://vuejs.org/guide/introduction.html)
- [Bootstrap 5.3 Documentation](https://getbootstrap.com/docs/5.3/)
- [Vue Router 4](https://router.vuejs.org/)
- [MDN LocalStorage](https://developer.mozilla.org/es/docs/Web/API/Window/localStorage)
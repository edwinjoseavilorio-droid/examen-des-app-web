/**
 * Sistema de permisos y roles
 */

export const ROLES = {
  ADMIN: 'admin',
  USUARIO: 'usuario'
}

/**
 * Obtener rol del usuario actual
 */
export function getUserRole() {
return sessionStorage.getItem('userRole') || null
}

/**
 * Verificar si es admin
 */
export function isAdmin() {
  return getUserRole() === ROLES.ADMIN
}

/**
 * Verificar si tiene permiso
 */
export function hasPermission(requiredRole) {
  const userRole = getUserRole()
  if (requiredRole === ROLES.ADMIN) {
    return userRole === ROLES.ADMIN
  }
  return userRole !== null
}

/**
 * Permisos por módulo
 */
export const PERMISSIONS = {
  // Productos/Servicios
  PRODUCTS_VIEW: 'productos:view',
  PRODUCTS_CREATE: 'productos:create',
  PRODUCTS_EDIT: 'productos:edit',
  PRODUCTS_DELETE: 'productos:delete',

  // Usuarios
  USERS_VIEW: 'usuarios:view',
  USERS_CREATE: 'usuarios:create',
  USERS_EDIT: 'usuarios:edit',
  USERS_DELETE: 'usuarios:delete',

  // Clientes
  CLIENTS_VIEW: 'clientes:view',
  CLIENTS_MANAGE: 'clientes:manage',
}

/**
 * Verificar permiso específico
 */
export function checkPermission(permission) {
  const role = getUserRole()

  // Permisos por rol
  const rolePermissions = {
    [ROLES.ADMIN]: [
      PERMISSIONS.PRODUCTS_VIEW,
      PERMISSIONS.PRODUCTS_CREATE,
      PERMISSIONS.PRODUCTS_EDIT,
      PERMISSIONS.PRODUCTS_DELETE,
      PERMISSIONS.USERS_VIEW,
      PERMISSIONS.USERS_CREATE,
      PERMISSIONS.USERS_EDIT,
      PERMISSIONS.USERS_DELETE,
      PERMISSIONS.CLIENTS_VIEW,
      PERMISSIONS.CLIENTS_MANAGE,
    ],
    [ROLES.USUARIO]: [
      PERMISSIONS.PRODUCTS_VIEW,
      PERMISSIONS.CLIENTS_VIEW,
    ]
  }

  return rolePermissions[role]?.includes(permission) || false
}

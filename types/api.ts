export interface Area {
  id_area: number;
  n_area: string;
}

export interface Funcion {
  id_funcion: number;
  n_funcion: string;
}

export interface User {
  id: string;
  nombre: string;
  email: string;
  telefono: string;
  area: string;
  funcion: string;
  createdAt: string;
}

export interface CreateUserRequest {
  nombre_completo: string;
  id_area: number;
  id_funcion: number;
  telefono: string;
  telefono_consultorio?: string;
  contrasena: string;
  correo: string;
}

// Estatus de pago
export interface EstatusPago {
  id_estatuspago: number;
  n_estatuspago: string;
}

// Productos
export interface Product {
  id_producto: number;
  n_producto: string;
  descripcion?: string;
  created_at?: string;
  cantidad?: number;
}

// Prioridades
export interface Prioridad {
  id_prioridad: number;
  n_prioridad: string;
}

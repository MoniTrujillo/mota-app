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
  nombre: string;
  email: string;
  telefono: string;
  telefonoConsultorio?: string;
  password: string;
  area: string;
  funcion: string;
}

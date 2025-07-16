import React, { createContext, useContext, useState, ReactNode } from 'react';
import apiService from '../services/apiService';

// Interfaces
export interface User {
  id_usuario: number;
  nombre_completo: string;
  correo: string;
  telefono: string;
  telefono_consultorio?: string;
  id_area: number;
  id_funcion: number;
  created_at: string;
}

interface UserWithPassword extends User {
  contrasena: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (correo: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

// Crear contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider del contexto
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const login = async (correo: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Obtener todos los usuarios
      const usuarios = await apiService.get<UserWithPassword[]>('/usuarios');
      
      // Buscar el usuario que haga match con correo y contraseña
      const foundUser = usuarios.find(
        (usuario) => 
          usuario.correo.toLowerCase() === correo.toLowerCase() && 
          // Nota: En producción, la contraseña debería compararse con hash
          // Por ahora asumo que la API devuelve la contraseña en texto plano
          usuario.contrasena === password
      );

      if (foundUser) {
        // Remover la contraseña del objeto usuario por seguridad
        const { contrasena, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error('Error en login:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    isLoading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook para usar el contexto
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

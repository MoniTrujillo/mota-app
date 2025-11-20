import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import apiService from "../services/apiService";

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
  logout: () => Promise<void>;
  isLoading: boolean;
}

// Crear contexto
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider del contexto
export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Cargar sesión guardada al iniciar
  useEffect(() => {
    loadStoredSession();
  }, []);

  const loadStoredSession = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("@user_session");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Error al cargar sesión:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (correo: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);

      // Enviar solicitud de login directamente al endpoint
      const loginData = {
        correo,
        contrasena: password,
      };

      // Hacer la petición POST al endpoint de login
      const userData = await apiService.post<User>(
        "/usuarios/login",
        loginData
      );

      if (userData) {
        // Guardar los datos del usuario en el estado y AsyncStorage
        setUser(userData);
        await AsyncStorage.setItem("@user_session", JSON.stringify(userData));
        return true;
      } else {
        return false;
      }
    } catch (error) {
      console.error("Error en login:", error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("@user_session");
      setUser(null);
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    isLoading,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook para usar el contexto
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth debe ser usado dentro de un AuthProvider");
  }
  return context;
};

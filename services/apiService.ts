import axios from "axios";

const API_URL = process.env.EXPO_PUBLIC_API_URL;

// Interfaces para tipado
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  data?: any;
}

// Crear instancia de axios
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor para requests
apiClient.interceptors.request.use(
  (config) => {
    // Agregar token si existe
    // const token = AsyncStorage.getItem('token');
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    console.log(
      `Making ${config.method?.toUpperCase()} request to: ${config.url}`
    );
    return config;
  },
  (error: any) => Promise.reject(error)
);

// Interceptor para responses
apiClient.interceptors.response.use(
  (response: any) => response.data,
  (error: any) => {
    const rawData = error.response?.data;
    const computedMessage =
      (rawData &&
        typeof rawData === "object" &&
        (rawData.message || rawData.error)) ||
      (typeof rawData === "string" ? rawData : undefined) ||
      error.message ||
      "Network Error";

    const apiError: ApiError = {
      message: computedMessage,
      status: error.response?.status,
      code: error.code,
      data: rawData,
    };

    console.error("API Error:", apiError);
    return Promise.reject(apiError);
  }
);

// Métodos del API con tipado
export const apiService = {
  // GET request
  get: async <T>(endpoint: string): Promise<T> => {
    const response = await apiClient.get(endpoint);
    return response as T;
  },

  // POST request
  post: async <T, D = any>(endpoint: string, data: D): Promise<T> => {
    const response = await apiClient.post(endpoint, data);
    return response as T;
  },

  // PUT request
  put: async <T, D = any>(endpoint: string, data: D): Promise<T> => {
    const response = await apiClient.put(endpoint, data);
    return response as T;
  },

  // DELETE request
  delete: async <T>(endpoint: string): Promise<T> => {
    const response = await apiClient.delete(endpoint);
    return response as T;
  },

  // PATCH request
  patch: async <T, D = any>(endpoint: string, data: D): Promise<T> => {
    const response = await apiClient.patch(endpoint, data);
    return response as T;
  },
};

export default apiService;

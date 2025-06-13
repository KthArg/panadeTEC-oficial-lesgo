import { useState, useCallback } from 'react';
import type { ApiResponse } from '@/types/database';

interface UseApiOptions {
  userAuth?: string;
}

interface UseApiReturn<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  execute: (url: string, options?: RequestInit) => Promise<ApiResponse<T>>;
  get: (url: string) => Promise<ApiResponse<T>>;
  post: (url: string, body: any) => Promise<ApiResponse<T>>;
  put: (url: string, body: any) => Promise<ApiResponse<T>>;
  del: (url: string) => Promise<ApiResponse<T>>;
  reset: () => void;
}

export function useApi<T = any>(options: UseApiOptions = {}): UseApiReturn<T> {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (url: string, requestOptions: RequestInit = {}): Promise<ApiResponse<T>> => {
    try {
      setLoading(true);
      setError(null);

      const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...requestOptions.headers,
      };

      // Add auth header if provided
      if (options.userAuth) {
        headers['x-user-id'] = options.userAuth;
      }

      const response = await fetch(url, {
        ...requestOptions,
        headers,
      });

      const result: ApiResponse<T> = await response.json();

      if (result.success && result.data) {
        setData(result.data);
      } else {
        setError(result.error || 'Error desconocido');
      }

      return result;
    } catch (err) {
      const errorMessage = 'Error de conexión';
      setError(errorMessage);
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      setLoading(false);
    }
  }, [options.userAuth]);

  const get = useCallback((url: string) => {
    return execute(url, { method: 'GET' });
  }, [execute]);

  const post = useCallback((url: string, body: any) => {
    return execute(url, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }, [execute]);

  const put = useCallback((url: string, body: any) => {
    return execute(url, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }, [execute]);

  const del = useCallback((url: string) => {
    return execute(url, { method: 'DELETE' });
  }, [execute]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    get,
    post,
    put,
    del,
    reset,
  };
}

// Specialized hooks for common operations
export function useInventario(userAuth?: string) {
  return useApi({ userAuth });
}

export function useProveedores(userAuth?: string) {
  return useApi({ userAuth });
}

export function useProductos(userAuth?: string) {
  return useApi({ userAuth });
}

export function useEmpleados(userAuth?: string) {
  return useApi({ userAuth });
}

export function useClientes(userAuth?: string) {
  return useApi({ userAuth });
}

export function usePedidos(userAuth?: string) {
  return useApi({ userAuth });
}
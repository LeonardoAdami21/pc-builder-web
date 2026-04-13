import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "/v1";

// ── Instância principal ────────────────────────────────────
export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  headers: { "Content-Type": "application/json" },
});

// ── Request interceptor: injeta Bearer token ───────────────
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem("accessToken");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ── Response interceptor: refresh token automático ────────
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (v: any) => void;
  reject: (e: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((p) => (error ? p.reject(error) : p.resolve(token)));
  failedQueue = [];
};

api.interceptors.response.use(
  (response) => {
    // Desempacota o wrapper { success, data, timestamp }
    if (response.data?.success !== undefined) {
      return { ...response, data: response.data.data };
    }
    return response;
  },
  async (error: AxiosError) => {
    const original = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status === 401 && !original._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            original.headers.Authorization = `Bearer ${token}`;
            return api(original);
          })
          .catch((e) => Promise.reject(e));
      }

      original._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        clearAuth();
        return Promise.reject(error);
      }

      try {
        const { data } = await axios.post(`${BASE_URL}/auth/refresh`, {
          refreshToken,
        });
        const { accessToken, refreshToken: newRefresh } = data.data ?? data;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", newRefresh);
        api.defaults.headers.common.Authorization = `Bearer ${accessToken}`;
        processQueue(null, accessToken);
        return api(original);
      } catch (refreshError) {
        processQueue(refreshError, null);
        clearAuth();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  },
);

function clearAuth() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  window.location.href = "/login";
}

export default api;

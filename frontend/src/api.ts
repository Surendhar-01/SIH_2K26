import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api';

let accessToken: string | null = null;
let refreshRequest: Promise<string | null> | null = null;
let onUnauthorized: (() => void) | null = null;

export type AuthUser = {
  id: string;
  fullName: string;
  email: string;
  role: 'admin' | 'engineer' | string;
};

type AuthSession = {
  accessToken: string;
  user: AuthUser;
};

type RetryableRequest = InternalAxiosRequestConfig & {
  _retry?: boolean;
  _skipAuthRefresh?: boolean;
};

export function setAccessToken(token: string | null) {
  accessToken = token;
}

export function getAccessToken() {
  return accessToken;
}

export function setUnauthorizedHandler(handler: (() => void) | null) {
  onUnauthorized = handler;
}

export async function refreshAccessToken() {
  if (!refreshRequest) {
    refreshRequest = axios
      .post<AuthSession>(
        `${API_BASE_URL}/auth/refresh`,
        {},
        {
          withCredentials: true,
          _skipAuthRefresh: true,
        } as RetryableRequest,
      )
      .then((response) => {
        setAccessToken(response.data.accessToken);
        return response.data.accessToken;
      })
      .catch(() => {
        setAccessToken(null);
        return null;
      })
      .finally(() => {
        refreshRequest = null;
      });
  }

  return refreshRequest;
}

axios.defaults.baseURL = API_BASE_URL;
axios.defaults.withCredentials = true;

axios.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }

  return config;
});

axios.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequest | undefined;

    if (
      error.response?.status !== 401 ||
      !originalRequest ||
      originalRequest._retry ||
      originalRequest._skipAuthRefresh
    ) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;
    const token = await refreshAccessToken();

    if (!token) {
      onUnauthorized?.();
      return Promise.reject(error);
    }

    originalRequest.headers.Authorization = `Bearer ${token}`;
    return axios(originalRequest);
  },
);

export const api = axios;
export { API_BASE_URL };

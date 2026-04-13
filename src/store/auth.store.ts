import { create } from "zustand";
import { authService, type LoginDto, type RegisterDto, type User } from "../service/types";
import { persist } from "zustand/middleware";


interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;

  login: (dto: LoginDto) => Promise<void>;
  register: (dto: RegisterDto) => Promise<void>;
  logout: () => Promise<void>;
  setUser: (user: User) => void;
  restore: () => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isLoading: false,
      isAuthenticated: false,

      login: async (dto) => {
        set({ isLoading: true });
        try {
          const { data } = await authService.login(dto);
          const { user, accessToken, refreshToken } = data;
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);
          set({ user, accessToken, refreshToken, isAuthenticated: true });
        } finally {
          set({ isLoading: false });
        }
      },

      register: async (dto) => {
        set({ isLoading: true });
        try {
          const { data } = await authService.register(dto);
          const { user, accessToken, refreshToken } = data;
          localStorage.setItem("accessToken", accessToken);
          localStorage.setItem("refreshToken", refreshToken);
          set({ user, accessToken, refreshToken, isAuthenticated: true });
        } finally {
          set({ isLoading: false });
        }
      },

      logout: async () => {
        const { refreshToken } = get();
        if (refreshToken) {
          await authService.logout(refreshToken).catch(() => {});
        }
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        });
      },

      setUser: (user) => set({ user }),

      restore: async () => {
        const token = localStorage.getItem("accessToken");
        if (!token) return;
        try {
          const { data } = await authService.me();
          set({ user: data, isAuthenticated: true });
        } catch {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
        }
      },
    }),
    {
      name: "auth-storage",
      partialize: (s) => ({
        user: s.user,
        accessToken: s.accessToken,
        refreshToken: s.refreshToken,
      }),
    },
  ),
);

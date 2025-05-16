import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  email: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      login: async (email, password) => {
        await new Promise((resolve) => setTimeout(resolve, 500));

        if (!email || !password) {
          throw new Error("Email and password are required");
        }

        if (email === "mock@example.com" && password === "password123") {
          const mockToken = "mock-jwt-token";
          const mockUser = { email };

          set({
            token: mockToken,
            user: mockUser,
            isAuthenticated: true,
          });

          return true;
        }
        return false;
      },
      logout: () => {
        set({ token: null, user: null, isAuthenticated: false });
      },
    }),
    {
      name: "auth-storage",
      storage: {
        getItem: (name) => {
          const value = localStorage.getItem(name);
          return value ? JSON.parse(value) : null;
        },
        setItem: (name, value) =>
          localStorage.setItem(name, JSON.stringify(value)),
        removeItem: (name) => localStorage.removeItem(name),
      },
    },
  ),
);

export default useAuthStore;

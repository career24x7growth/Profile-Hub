// "use client";
// import { create } from "zustand";
// import api from "../../lib/axios";
// import { IUser } from "../../types/user";

// interface AuthState {
//   user: IUser | null;
//   loading: boolean;
//   isLoggedIn: boolean;
//   login: (email: string, password: string) => Promise<void>;
//   logout: () => void;
//   initializeAuth: () => void;
// }

// export const useAuthStore = create<AuthState>((set) => ({
//   user: null,
//   loading: true,
//   isLoggedIn: false,

//   initializeAuth: () => {
//     const storedUser = localStorage.getItem("user");
//     if (storedUser) {
//       set({ user: JSON.parse(storedUser), isLoggedIn: true, loading: false });
//     } else {
//       set({ user: null, isLoggedIn: false, loading: false });
//     }
//   },

//   login: async (email, password) => {
//     set({ loading: true });
//     try {
//       const res = await api.post("/api/auth/login", { email, password });
//       const { user, token } = res.data;

//       localStorage.setItem("token", token);
//       localStorage.setItem("user", JSON.stringify(user));

//       set({
//         user,
//         isLoggedIn: true,
//         loading: false,
//       });
//     } catch (err) {
//       set({ loading: false });
//       throw err;
//     }
//   },

//   logout: () => {
//     localStorage.removeItem("token");
//     localStorage.removeItem("user");
//     set({ user: null, isLoggedIn: false, loading: false });
//   },
// }));

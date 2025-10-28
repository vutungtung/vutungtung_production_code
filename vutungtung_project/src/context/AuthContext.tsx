import { createContext } from "react";
import type { User } from "./AuthProvider";

// ✅ Define and export AuthContextType
export type AuthContextType = {
  user: User | null;
  login: (userData: User) => void;
  logout: () => void;
  loading: boolean;
};

// ✅ Export AuthContext itself
export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

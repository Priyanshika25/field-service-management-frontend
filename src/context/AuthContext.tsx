import { createContext, useContext, useState, type ReactNode } from "react";

interface AuthContextType {
  token: string | null;
  email: string | null;
  role: string | null;
  userId: number | null;
  login: (token: string, email: string, role: string, userId: number) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token"),
  );

  const [email, setEmail] = useState<string | null>(
    localStorage.getItem("email"),
  );

  const [role, setRole] = useState<string | null>(localStorage.getItem("role"));

  const [userId, setUserId] = useState<number | null>(() => {
    const id = localStorage.getItem("userId");
    return id ? Number(id) : null;
  });

  const login = (
    newToken: string,
    newEmail: string,
    newRole: string,
    newUserId: number,
  ) => {
    localStorage.setItem("token", newToken);
    localStorage.setItem("email", newEmail);
    localStorage.setItem("role", newRole);
    localStorage.setItem("userId", String(newUserId));

    setToken(newToken);
    setEmail(newEmail);
    setRole(newRole);
    setUserId(newUserId);
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");

    setToken(null);
    setEmail(null);
    setRole(null);
    setUserId(null);
  };

  return (
    <AuthContext.Provider
      value={{
        token,
        email,
        role,
        userId,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};

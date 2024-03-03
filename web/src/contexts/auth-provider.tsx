import { createContext, useContext, useEffect, useState, useMemo } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  sub: string;
  avatar: string;
}

interface BackendTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

interface AuthContextValue {
  backendTokens: BackendTokens | null;
  setToken: (newToken: BackendTokens, newUser: User) => void;
  user: User | null;
  setUser: (newUser: User) => void;
  clearAuth: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // State to hold the authentication token and user
  const [backendTokens, setBackendTokens] = useState<BackendTokens | null>(
    JSON.parse(localStorage.getItem("backendTokens") || "null")
  );
  const [user, setUser] = useState<User | null>(() => {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  });

  // Check if token is valid
  useEffect(() => {
    const verify = async () => {
      if (backendTokens) {
        try {
          if (backendTokens.expiresIn < Date.now()) {
            // Adjust this condition based on how verifyToken indicates an invalid token
            clearAuth();
          }
        } catch (error) {
          console.error("Error verifying token:", error);
          clearAuth();
        }
      }
    };
    verify();
  }, [backendTokens]); // Include token as a dependency

  // Function to clear authentication
  const clearAuth = () => {
    localStorage.removeItem("backendTokens");
    localStorage.removeItem("user");
    setBackendTokens(null);
    setUser(null);
  };

  // Function to set the authentication token
  const setTokenAndUser = (newToken: BackendTokens, newUser: User) => {
    setBackendTokens(newToken);
    setUser(newUser);
  };

  // Update axios headers and localStorage when token or user changes
  useEffect(() => {
    if (backendTokens) {
      localStorage.setItem("backendTokens", JSON.stringify(backendTokens));
      if (user) {
        localStorage.setItem("user", JSON.stringify(user));
      }
    } else {
      clearAuth();
    }
  }, [backendTokens, user]); // Include user as a dependency

  // Memoized value of the authentication context
  const contextValue = useMemo(
    () => ({
      backendTokens,
      setToken: setTokenAndUser,
      user,
      setUser,
      clearAuth,
    }),
    [backendTokens, user]
  );

  // Provide the authentication context to the children components
  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextValue => {
  return useContext(AuthContext) as AuthContextValue;
};

export default AuthProvider;

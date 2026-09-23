import {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import api from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ======================================================
  // CHECK EXISTING LOGIN WHEN APPLICATION STARTS
  // ======================================================
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      loadCurrentUser();
    } else {
      setLoading(false);
    }
  }, []);

  // ======================================================
  // LOAD CURRENT USER
  // ======================================================
  const loadCurrentUser = async () => {
    try {
      const response = await api.get("/api/auth/me");

      setUser(response.data);
    } catch (error) {
      console.error("Failed to load current user:", error);

      localStorage.removeItem("token");
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // ======================================================
  // LOGIN
  // ======================================================
  const login = async (email, password) => {
    const response = await api.post("/api/auth/login", {
      email,
      password,
    });

    console.log("LOGIN RESPONSE:", response.data);

    // Support the possible token field names
    const token =
      response.data?.token ||
      response.data?.accessToken ||
      response.data?.jwt;

    if (!token) {
      console.error(
        "Login successful but JWT token was not found in response."
      );

      throw new Error(
        "Login successful, but authentication token was not received."
      );
    }

    // Store JWT
    localStorage.setItem("token", token);

    console.log("TOKEN STORED:", true);

    // Store user
    if (response.data?.user) {
      setUser(response.data.user);
    } else {
      await loadCurrentUser();
    }

    return response.data;
  };

  // ======================================================
  // LOGOUT
  // ======================================================
  const logout = () => {
    localStorage.removeItem("token");

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// ======================================================
// USE AUTH HOOK
// ======================================================
export function useAuth() {
  return useContext(AuthContext);
}
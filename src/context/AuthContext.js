import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        if (parsed?.token) {
          setUser(parsed);
          setToken(parsed.token);
          console.log("AuthContext: Betöltve localStorage-ből:", parsed);
        }
      }
    } catch (err) {
      console.error("Hiba a localStorage olvasásakor:", err);
      localStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (token, id, email, fullName, role) => {
  const loggedInUser = { id, token, email, fullName, role };
  localStorage.setItem("user", JSON.stringify(loggedInUser));
  setUser(loggedInUser);
  setToken(token);
  console.log("User bejelentkezett:", loggedInUser);
};


  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
    console.log("User kijelentkezett");
  };

  const isAuthenticated = !!token && !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthenticated,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth() csak AuthProvider belsejében használható!");
  }
  return context;
};

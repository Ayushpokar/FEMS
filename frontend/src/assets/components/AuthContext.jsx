// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ loading, setLoading] = useState(true);
  useEffect(() => {
        axios.get(`/api/me`, { withCredentials: true })
            .then(res => setUser(res.data))
            .catch(() => setUser(null))
            .finally(() => setLoading(false));
    }, []);


  const login = (userData) => {
    setUser(userData);
  };
    
  if (loading) {
        return (
            <div className="h-screen w-screen flex items-center justify-center">
                <p className="text-gray-500 text-sm">Loading...</p>
            </div>
        );
    }
  const logout = async () => {
    try {
      await axios.post(`/api/logout`,{});
      setUser(null)
    } catch (error) {
      console.log(error)
      alert("Something went wrong");
    }finally{
    setUser(null);
    localStorage.removeItem("user");
    }
    
  };

  return (
    <AuthContext.Provider value={{ user, role: user?.role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}


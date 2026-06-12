// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ loading, setLoading] = useState(true);
  const navigate = useNavigate();
  useEffect(() => {    
    axios.get(`/api/me`)
        .then(res => {
            setUser(res.data);
        })
        .catch((err) => {
            console.log("me error:", err.response?.status, err.message);
            setUser(null);
            navigate('/login');
        })
        .finally(() => setLoading(false));
}, []);

  document.cookie
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
  const value = { user, id: user?.id, role: user?.role, login, logout };

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div className="h-screen w-screen flex items-center justify-center">
            <p className="text-gray-500 text-sm">Loading...</p>
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}


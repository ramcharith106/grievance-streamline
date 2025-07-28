import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface AdminUser {
  username: string;
  loginTime: string;
}

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    const authStatus = localStorage.getItem("adminAuth");
    const adminUser = localStorage.getItem("adminUser");
    
    if (authStatus === "true" && adminUser) {
      setIsAuthenticated(true);
      setUser(JSON.parse(adminUser));
    } else {
      setIsAuthenticated(false);
      setUser(null);
    }
    setIsLoading(false);
  };

  const logout = () => {
    localStorage.removeItem("adminAuth");
    localStorage.removeItem("adminUser");
    setIsAuthenticated(false);
    setUser(null);
    navigate("/admin");
  };

  return {
    isAuthenticated,
    user,
    isLoading,
    logout,
    checkAuthStatus,
  };
};
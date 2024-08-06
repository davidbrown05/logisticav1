import { createContext, useContext, useEffect, useState } from "react";
import { registerRequest, loginRequest, verifyTokenRequest } from "../api/auth";
import Cookies from "js-cookie";

export const AuthContext = createContext();


export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("auth error");
  }

  return context;
};

export const AuthProvider = ({ children }) => {
  
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(true);

  const signup = async (user) => {
    const res = await registerRequest(user);
  };

  const login = async (user) => {
    try {
      const res = await loginRequest(user);
      console.log("res", res);
      setUser(res.data);
      setIsAuthenticated(true);
     
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const checkLogin = async () => {
     
      const cookies = Cookies.get();
      const allCookies = document.cookie;
      console.log("cookieToken", cookies)
      console.log("Cookies directamente desde document.cookie:", allCookies);
      if (!cookies.acces_token        ) {
        setIsAuthenticated(false);
        setLoading(false);
        return;
      }

      try {
        const res = await verifyTokenRequest(cookies.acces_token);
        console.log(res);
        if (!res.data) return setIsAuthenticated(false);
        setIsAuthenticated(true);
        setUser(res.data);
        setLoading(false);
      } catch (error) {
        setIsAuthenticated(false);
        setLoading(false);
      }
    };
    checkLogin();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, errors,loading, login }}>
      {children}
    </AuthContext.Provider>
  );
};

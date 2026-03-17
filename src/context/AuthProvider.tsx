import {
  createContext,
  useEffect,
  useMemo,
  useState,
  useContext,
} from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/auth-Service";

const AuthContext = createContext<any>(undefined);

export const AuthProvider = ({ children }: any) => {
  const navigate = useNavigate();

  const [isAuthenticated, setIsAuthenticated] = useState(
    !!authService.getAccessToken()
  );

  useEffect(() => {
    const unSub = authService.onLogout(() => {
      setIsAuthenticated(false);
      navigate("/login");
    });

    return unSub;
  }, [navigate]);

  const value = useMemo(
    () => ({
      isAuthenticated,

      login: (accessToken: string) => {
        authService.setAccessToken(accessToken);
        setIsAuthenticated(true);
      },

      logout: () => {
        authService.triggerLogout();
      },
    }),
    [isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
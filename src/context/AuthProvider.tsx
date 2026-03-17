import {
  createContext,
  useEffect,
  useMemo,
  useState,
  useContext,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/auth-Service";

type AuthContextValue = {
  isAuthenticated: boolean;
  login: (accessToken: string, refreshToken?: string) => void;
  logout: () => void;
};

type AuthProvidersProps = {
  children: ReactNode;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider = ({ children }: AuthProvidersProps) => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    () => !!authService.getAccessToken(),
  );

  useEffect(() => {
    const unsubscribe = authService.onLogout(() => {
      setIsAuthenticated(false);
      navigate("/login");
    });
    return unsubscribe;
  }, [navigate]);
  
  const value = useMemo(
    () => ({
      isAuthenticated,
      login: (accessToken: string, refreshToken?: string) => {
        authService.setAccessToken(accessToken);

        if (refreshToken) {
          authService.setRefreshToken(refreshToken);
        }

        setIsAuthenticated(true);
      },
    }),
    [isAuthenticated],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};




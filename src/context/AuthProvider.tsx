import { createContext, useEffect, useMemo, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/auth-Service";
import toast from "react-hot-toast";

//Default value undefined
const AuthContext = createContext<any>(undefined);

export const AuthProvider = ({ children }: any) => {
  const navigate = useNavigate();

  //Checks if the user is already logged in when the app loads
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!authService.getAccessToken(),
  );

  //It listens for logout and redirects the user to the login page when it happens
  useEffect(() => {
    const unSub = authService.onLogout(() => {
      setIsAuthenticated(false);
      navigate("/login");
    });

    return unSub;
  }, [navigate]);

  //useMemo caches computed values to avoid unnecessary recalculation
  const value = useMemo(
    () => ({
      isAuthenticated,

      //Saves the token and logs the user in
      login: (accessToken: string) => {
        authService.setAccessToken(accessToken);
        setIsAuthenticated(true);
      },

      //Removes the token
      logout: () => {
        authService.triggerLogout();
        // window.location.reload();
      },
    }),
    [isAuthenticated],
  );

  //It provides the context value to all children components
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

//A custom hook to easily access AuthContext values
//Custom Hook To reuse code and make it cleaner and easier to use
export const useAuth = () => useContext(AuthContext);

import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "../Pages/Login";
import Mantra from "../Pages/Mantra/Mantra";
import ProtectedRoute from "./Protected-Routes";
import RootLayout from "../Layouts/RootLayout";
import Stories from "../Pages/Stories";
import Profile from "../Pages/Profile/Profile";
import ProtectedLayout from "./Protected-Routes";
import CreateMantra from "../Pages/Mantra/Create-Mantra";

const routes = [
  {
    element: <RootLayout />,
    children: [
      {
        path: "/",
        element: <Navigate to="/login" />,
      },
      {
        path: "/login",
        element: <Login />,
      },

      {
        path: "/create-mantra",
        element: <CreateMantra />,
      },
      {
        element: <ProtectedLayout />,
        children: [
          {
            path: "/mantra",
            element: <Mantra />,
          },
          {
            path: "/stories",
            element: <Stories />,
          },
          {
            path: "/profile",
            element: <Profile />,
          },
        ],
      },
    ],
  },
];
export const router = createBrowserRouter(routes);

import { createBrowserRouter, Navigate } from "react-router-dom";
import Login from "../Pages/Login";
import Mantra from "../Pages/Mantra/Mantra";
// import ProtectedRoute from "./Protected-Routes";
import RootLayout from "../Layouts/RootLayout";
import Stories from "../Pages/Stories/Stories";
import Profile from "../Pages/Profile/Profile";
import ProtectedLayout from "./Protected-Routes";
import CreateMantra from "../Pages/Mantra/Create-Mantra";
import CreateStory from "../Pages/Stories/Create-Story";

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
        element: <ProtectedLayout />,
        children: [
          {
            path: "/mantra",
            element: <Mantra />,
          },
          {
            path: "/create-mantra",
            element: <CreateMantra />,
          },

          {
            path:'/create-Story',
            element:<CreateStory/>
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

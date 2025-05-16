import { createBrowserRouter } from "react-router";
import AuthLayout from "./layouts/AuthLayout";
// import MainLayout from "./layouts/MainLayout";
import { Login } from "./pages/auth/Login";
import { PublicRoute } from "@/lib/utils/routeGuards";

export const router = createBrowserRouter([
  {
    element: <PublicRoute />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          {
            path: "/login",
            element: <Login />,
          },
        ],
      },
    ],
  },
]);

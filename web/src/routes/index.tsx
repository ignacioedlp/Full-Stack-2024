import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ProtectedRoute } from "./protected-route";
import { PublicRoute } from "./public-route";

// Auth pages
import Login from "../pages/auth/login";
import SignUp from "../pages/auth/sign-up";
import ForgotPassword from "../pages/auth/forgot-password";
import ResetPassword from "../pages/auth/reset-password";

// Admin pages
import AdminDashboard from "../pages/admin";
import Users from "../pages/admin/users";
import User from "../pages/admin/users/user";
import Roles from "../pages/admin/roles";
import Role from "../pages/admin/roles/role";
import Audits from "../pages/admin/audit-trails";
import BlockedIps from "../pages/admin/blocked-ips";
import BlockedIp from "../pages/admin/blocked-ips/blocked-ip";
import Notifications from "../pages/admin/notifications";

// Public pages
import Welcome from "../pages/welcome";
import About from "../pages/about";

// User pages
import Home from "../pages/home";
import Profile from "../pages/profile";


const Routes = () => {

  const routesForAuthenticatedOnly = [
    {
      path: "/",
      element: <ProtectedRoute />,
      children: [
        {
          path: "/home",
          element: <Home />,
        },
        {
          path: "/profile",
          element: <Profile />,
        },
      ],
    },
  ];

  const adminRoutes = [
    {
      path: "/",
      element: <ProtectedRoute roles={["Admin"]} />,
      children: [
        {
          path: "/admin",
          element: <AdminDashboard />,
        },
        {
          path: "/admin/users",
          element: <Users />,
        },
        {
          path: "/admin/users/:id",
          element: <User />,
        },

        {
          path: "/admin/roles",
          element: <Roles />,
        },
        {
          path: "/admin/roles/:id",
          element: <Role />,
        },
        {
          path: "/admin/audits",
          element: <Audits />,
        },
        {
          path: "/admin/blockedIps",
          element: <BlockedIps />,
        },
        {
          path: "/admin/blockedIps/:id",
          element: <BlockedIp />,
        },
        {
          path: "/admin/notifications",
          element: <Notifications />,
        }
      ],
    },
  ];

  const publicRoutes = [
    {
      path: "/",
      element: <PublicRoute />,
      children: [
        {
          path: "/login",
          element: <Login />,
        },
        {
          path: "/signup",
          element: <SignUp />,
        },
        {
          path: "/forgot-password",
          element: <ForgotPassword />,
        },
        {
          path: "/reset-password",
          element: <ResetPassword />,
        },
      ]
    }
  ];

  const allPublicRoutes = [
    {
      path: "/",
      children: [
        {
          path: "/",
          element: <Welcome />,
        },
        {
          path: "/about",
          element: <About />,
        }
      ]
    }
  ];



  const router = createBrowserRouter([
    ...allPublicRoutes,
    ...publicRoutes,
    ...adminRoutes,
    ...routesForAuthenticatedOnly,
  ]);

  return <RouterProvider router={router} />;
};

export default Routes;

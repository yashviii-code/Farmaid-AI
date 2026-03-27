import { createBrowserRouter, Navigate } from "react-router";
import { LandingPage } from "./pages/LandingPage";
import { AboutUs } from "./pages/AboutUs";
import { Login } from "./pages/Login";
import { Dashboard } from "./pages/Dashboard";
import { Profile } from "./pages/Profile";
import { Settings } from "./pages/Settings";
import { FarmerCropRecommendation } from "./pages/FarmerCropRecommendation";
import { AdminLayout } from "./components/AdminLayout";
import { AdminDashboard } from "./pages/AdminDashboard";
import { DiseaseDetection } from "./pages/DiseaseDetection";
import { FarmerManagement } from "./pages/FarmerManagement";
import { Logs } from "./pages/Logs";
import { AdminProfile } from "./pages/AdminProfile";
import { AdminSettings } from "./pages/AdminSettings";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage,
  },
  {
    path: "/about",
    Component: AboutUs,
  },
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/dashboard",
    Component: Dashboard,
  },
  {
    path: "/crop-recommendation",
    Component: FarmerCropRecommendation,
  },
  {
    path: "/disease-detection",
    Component: DiseaseDetection,
  },
  {
    path: "/profile",
    Component: Profile,
  },
  {
    path: "/settings",
    Component: Settings,
  },
  {
    path: "/admin-dashboard",
    Component: AdminLayout,
    children: [
      {
        index: true,
        Component: AdminDashboard,
      },
      {
        path: "crop-recommendation",
        element: <Navigate to="/admin-dashboard" replace />,
      },
      {
        path: "disease-detection",
        element: <Navigate to="/admin-dashboard" replace />,
      },
      {
        path: "farmers",
        Component: FarmerManagement,
      },
      {
        path: "logs",
        Component: Logs,
      },
      {
        path: "profile",
        Component: AdminProfile,
      },
      {
        path: "settings",
        Component: AdminSettings,
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

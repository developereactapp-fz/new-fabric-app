import { Routes, Route } from "react-router-dom";
import StyleModalPage from "../pages/StyleModal/StyleModalPage";
import CustomizePage from "../pages/Customize/CustomizePage";
import CustomSuitSummary from "../pages/Summary/CustomSuitSummary";
import Dashboard from "../pages/Dashboard/Dashboard";
import NotificationCenter from "../pages/Notifications/NotificationCenter";
import ProfileDashboard from "../pages/Profile/ProfileDashboard";
import EditProfile from "../pages/Profile/EditProfile";
import Login from "../pages/Auth/Login";
import ResetPassword from "../pages/Auth/ResetPassword";
import Signup from "../pages/Auth/Signup";

export default function AppRoutes() {
  return (
    <Routes>
      {/* Dashboard & Main */}
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/customsuitsummary" element={<CustomSuitSummary />} />
      <Route path="/notifications" element={<NotificationCenter />} />

      {/* Auth */}
      <Route path="/login" element={<Login />} />
      <Route path="/resetpassword" element={<ResetPassword />} />
      <Route path="/signup" element={<Signup />} />

      {/* Profile */}
      <Route path="/profiledashboard" element={<ProfileDashboard />} />
      <Route path="/editprofile" element={<EditProfile />} />

      {/* Add your existing routes below */}
      {/* <Route path="/" element={<StyleModalPage />} />
      <Route path="/customize/shirt" element={<CustomizePage />} />
      <Route path="/customize/tuxedo" element={<CustomizePage />} /> */}
    </Routes>
  );
}

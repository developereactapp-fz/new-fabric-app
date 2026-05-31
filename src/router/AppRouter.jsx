import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Header from "../components/layout/Header";
import Login from "../features/auth/Login";
import Signup from "../features/auth/Signup";
import ResetPassword from "../features/auth/ResetPassword";
import StyleSelectPage from "../features/styleSelect/StyleSelectPage";
import PantSelectPage from "../features/styleSelect/PantSelectPage";
import JacketSelectPage from "../features/styleSelect/JacketSelectPage";
import CoatSelectPage from "../features/styleSelect/CoatSelectPage";
import ShirtCustomizePage from "../features/customize/ShirtCustomizePage";
import TuxedoCustomizePage from "../features/customize/TuxedoCustomizePage";
import PantCustomizePage from "../features/customize/PantCustomizePage";
import TuxedoPantCustomizePage from "../features/customize/TuxedoPantCustomizePage";
import JacketCustomizePage from "../features/customize/JacketCustomizePage";
import TuxedoJacketCustomizePage from "../features/customize/TuxedoJacketCustomizePage";
import WaistcoatCustomizePage from "../features/customize/WaistcoatCustomizePage";
import CoatCustomizePage from "../features/customize/CoatCustomizePage";
import FinishPage from "../features/finish/FinishPage";
import VerificationSuccess from "../features/verification/VerificationSuccess";
import SavedDesigns from "../features/save/SavedDesigns";
import SavedDesignDetails from "../features/save/SavedDesignDetails";
import UserEnquiryPage from "../features/userEnquiry/UserEnquiryPage";
import Dashboard from "../pages/Dashboard/Dashboard";
import CustomSuitSummary from "../pages/Summary/CustomSuitSummary";
import NotificationCenter from "../pages/Notifications/NotificationCenter";
import ProfileDashboard from "../pages/Profile/ProfileDashboard";
import EditProfile from "../pages/Profile/EditProfile";

// Admin imports (Lazy Loaded)
const AdminLayout = lazy(() => import("../admin/AdminLayout"));
const AdminDashboard = lazy(() => import("../admin/pages/AdminDashboard"));
const PlaceholderPage = lazy(() => import("../admin/pages/PlaceholderPage"));
const FabricConfiguratorPage = lazy(() => import("../admin/pages/FabricConfigurator/FabricConfiguratorPage"));
const CategoryConfiguratorPage = lazy(() => import("../admin/pages/CategoryConfigurator/CategoryConfiguratorPage"));
const FabricOnboardingPage = lazy(() => import("../admin/pages/FabricOnboarding/FabricOnboardingPage"));
const MaterialsPanelPage = lazy(() => import("../admin/pages/MaterialsPanel/MaterialsPanelPage"));
const ComponentsPanelPage = lazy(() => import("../admin/pages/ComponentsPanel/ComponentsPanelPage"));
const CustomShirtPage = lazy(() => import("../admin/pages/CustomShirt/CustomShirtPage"));
const FabricDetailPage = lazy(() => import("../admin/pages/FabricDetail/FabricDetailPage"));
const GroupBuilderPage = lazy(() => import("../admin/pages/GroupBuilder/GroupBuilderPage"));
const ContrastMapperPage = lazy(() => import("../admin/pages/ContrastMapper/ContrastMapperPage"));
const AdvancedEnquiryDashboard = lazy(() => import("./AdvancedEnquiryDashboard"));
const CommunityPanelPage = lazy(() => import("./CommunityPanelPage"));
const AdvancedNotificationPage = lazy(() => import("./AdvancedNotificationPage"));



// Loading fallback for Suspense
const AdminLoader = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f8fafc' }}>
    <p style={{ fontSize: '18px', color: '#64748b' }}>Loading Admin Portal...</p>
  </div>
);

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Suspense fallback={<AdminLoader />}>
        <Routes>
          {/* ═══════ Admin Routes ═══════ */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="fabric-configurator" element={<FabricConfiguratorPage />} />
            <Route path="category-configurator" element={<CategoryConfiguratorPage />} />
            <Route path="fabric-onboarding" element={<FabricOnboardingPage />} />
            <Route path="materials-panel" element={<MaterialsPanelPage />} />
            <Route path="components-panel" element={<ComponentsPanelPage />} />
            <Route path="custom-shirt" element={<CustomShirtPage />} />

            <Route path="fabric-detail" element={<FabricDetailPage />} />
            <Route path="group-builder" element={<GroupBuilderPage />} />
            <Route path="contrast-mapper" element={<ContrastMapperPage />} />


            <Route path="advanced-enquiry" element={<AdvancedEnquiryDashboard />} />
            <Route path="community-panel" element={<CommunityPanelPage />} />
            <Route path="notifications-panel" element={<AdvancedNotificationPage />} />
          </Route>

          {/* ═══════ Customer Routes ═══════ */}
          <Route path="/*" element={<CustomerApp />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

function CustomerApp() {
  return (
    <>
      <Header />
      <main className="app-content">
        <Routes>

          <Route path="/style/:category" element={<StyleSelectPage />} />
          <Route path="/shirt" element={<StyleSelectPage type="shirt" />} />
          <Route path="/shirt/:category" element={<StyleSelectPage type="shirt" />} />
          <Route path="/tuxedo-shirt" element={<StyleSelectPage type="tuxedo" />} />
          <Route path="/tuxedo-shirt/:category" element={<StyleSelectPage type="tuxedo" />} />
          <Route path="/pant" element={<PantSelectPage />} />
          <Route path="/pant/:category" element={<PantSelectPage />} />
          <Route path="/tuxedo-pant" element={<PantSelectPage type="tuxedo-pant" />} />
          <Route path="/tuxedo-pant/:category" element={<PantSelectPage type="tuxedo-pant" />} />
          <Route path="/jacket" element={<JacketSelectPage />} />
          <Route path="/jacket/:category" element={<JacketSelectPage />} />
          <Route path="/tuxedo-jacket" element={<JacketSelectPage type="tuxedo-jacket" />} />
          <Route path="/tuxedo-jacket/:category" element={<JacketSelectPage type="tuxedo-jacket" />} />
          <Route path="/coat" element={<CoatSelectPage />} />
          <Route path="/coat/:category" element={<CoatSelectPage />} />
          <Route path="/waistcoat" element={<CoatSelectPage type="waistcoat" />} />
          <Route path="/waistcoat/:category" element={<CoatSelectPage type="waistcoat" />} />
          <Route path="/" element={<StyleSelectPage />} />

          <Route path="/customize/shirt" element={<ShirtCustomizePage />} />
          <Route path="/customize/tuxedo" element={<TuxedoCustomizePage />} />
          <Route path="/customize/pant" element={<PantCustomizePage />} />
          <Route path="/customize/tuxedo-pant" element={<TuxedoPantCustomizePage />} />
          <Route path="/customize/jacket" element={<JacketCustomizePage />} />
          <Route path="/customize/tuxedo-jacket" element={<TuxedoJacketCustomizePage />} />
          <Route path="/customize/waistcoat" element={<WaistcoatCustomizePage />} />
          <Route path="/customize/coat" element={<CoatCustomizePage />} />
          <Route path="/finish" element={<FinishPage />} />
          <Route path="/verified" element={<VerificationSuccess />} />
          <Route path="/saved-designs" element={<SavedDesigns />} />
          <Route path="/saved-customization" element={<SavedDesignDetails />} />
          <Route path="/saved-designs/:id" element={<SavedDesignDetails />} />
          <Route path="/enquiry" element={<UserEnquiryPage />} />

          {/* Dashboard & Main */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/customsuitsummary" element={<CustomSuitSummary />} />
          <Route path="/notifications" element={<NotificationCenter />} />

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/resetpassword" element={<ResetPassword />} />

          {/* Profile */}
          <Route path="/profiledashboard" element={<ProfileDashboard />} />
          <Route path="/editprofile" element={<EditProfile />} />

          <Route path="*" element={<h2>Page Not Found</h2>} />

        </Routes>
      </main>
    </>
  );
}
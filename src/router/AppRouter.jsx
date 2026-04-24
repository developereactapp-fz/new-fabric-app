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

export default function AppRouter() {
  return (
    <BrowserRouter>
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

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/resetpassword" element={<ResetPassword />} />

          <Route path="*" element={<h2>Page Not Found</h2>} />

        </Routes>
      </main>
    </BrowserRouter>
  );
}
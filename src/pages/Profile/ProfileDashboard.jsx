import { Box } from "@mui/material";
import { useState, useEffect } from "react";

import ProfileHeader from "./components/ProfileHeader";
import InfoCard from "./components/InfoCard";
import InfoRow from "./components/InfoRow";
import PreferenceRow from "./components/PreferenceRow";
import RecentOrdersCard from "./components/RecentOrdersCard";
import ServiceCard from "./components/ServiceCard";
import AccountActions from "./components/AccountActions";

import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import PublicOutlinedIcon from "@mui/icons-material/PublicOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import CurrencyRupeeOutlinedIcon from "@mui/icons-material/CurrencyRupeeOutlined";
import PaletteOutlinedIcon from "@mui/icons-material/PaletteOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import ContentCutRoundedIcon from "@mui/icons-material/ContentCutRounded";
import ReplayRoundedIcon from "@mui/icons-material/ReplayRounded";
import PublicRoundedIcon from "@mui/icons-material/PublicRounded";

export default function ProfileDashboard() {
  const [userProfile, setUserProfile] = useState({
    address: localStorage.getItem("userAddress") || "Not specified",
    country: "India",
    accountCreated: localStorage.getItem("accountCreated") || "January 2025",
    totalDesigns: localStorage.getItem("totalDesigns") || "0 custom pieces",
    language: "English (US)",
    currency: "INR (₹)",
  });

  useEffect(() => {
    // Load user profile from localStorage or API
    const storedProfile = localStorage.getItem("userProfile");
    if (storedProfile) {
      try {
        const parsed = JSON.parse(storedProfile);
        setUserProfile(prev => ({ ...prev, ...parsed }));
      } catch (e) {
        console.error("Error parsing profile:", e);
      }
    }
  }, []);

  return (
    <Box sx={{ px: { xs: 2, sm: 3, md: 4 }, pb: 6 }}>
      <ProfileHeader />

      {/* MAIN GRID */}
      <Box
        sx={{
          mt: 4,
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr", lg: "2fr 2fr 1.4fr" },
          gap: { xs: 2, sm: 3, md: 4 },
        }}
      >
        {/* Account Details */}
        <InfoCard title="Account Details" color="#7a3f43">
          <InfoRow icon={<LocationOnOutlinedIcon />} label="ADDRESS" value={userProfile.address} />
          <InfoRow icon={<PublicOutlinedIcon />} label="COUNTRY" value={userProfile.country} />
          <InfoRow icon={<CalendarTodayOutlinedIcon />} label="ACCOUNT CREATED" value={userProfile.accountCreated} />
          <InfoRow icon={<Inventory2OutlinedIcon />} label="TOTAL DESIGNS" value={userProfile.totalDesigns} />
        </InfoCard>

        {/* Preferences */}
        <InfoCard title="Preferences" color="#e8ded6" textColor="#5b4636">
          <PreferenceRow icon={<LanguageOutlinedIcon />} label="Language" value={userProfile.language} />
          <PreferenceRow icon={<CurrencyRupeeOutlinedIcon />} label="Currency" value={userProfile.currency} />
          <PreferenceRow icon={<PaletteOutlinedIcon />} label="Theme" value="Light Mode" pill />
          <PreferenceRow icon={<NotificationsOutlinedIcon />} label="Notifications" toggle />
        </InfoCard>

        {/* Recent Orders */}
        <RecentOrdersCard />
      </Box>

      {/* SERVICES */}
      <Box
        sx={{
          mt: { xs: 3, md: 5 },
          display: "grid",
          gridTemplateColumns: { xs: "1fr", sm: "repeat(2,1fr)", md: "repeat(3,1fr)" },
          gap: { xs: 2, sm: 3, md: 4 },
        }}
      >
        <ServiceCard
          icon={<ContentCutRoundedIcon />}
          title="Master Tailoring"
          desc="Handcrafted by expert artisans with 40+ years experience"
        />
        <ServiceCard
          icon={<ReplayRoundedIcon />}
          title="Free Alterations"
          desc="Complimentary adjustments within 30 days of delivery"
        />
        <ServiceCard
          icon={<PublicRoundedIcon />}
          title="Worldwide Delivery"
          desc="Premium packaging with tracking and insurance included"
        />
      </Box>

      {/* ACCOUNT ACTIONS */}
      <Box sx={{ mt: { xs: 3, md: 5 } }}>
        <AccountActions />
      </Box>
    </Box>
  );
}

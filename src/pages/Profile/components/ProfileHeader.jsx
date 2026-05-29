import { Box, Typography, Button, Chip } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import MailOutlineRoundedIcon from "@mui/icons-material/MailOutlineRounded";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";

import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import CurrencyRupeeOutlinedIcon from "@mui/icons-material/CurrencyRupeeOutlined";
import PaletteOutlinedIcon from "@mui/icons-material/PaletteOutlined";

import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import StraightenOutlinedIcon from "@mui/icons-material/StraightenOutlined";

import StatCard from "./StatCard";
import HeaderActionCard from "./HeaderActionCard";

export default function ProfileHeader() {
  return (
    <Box
      sx={{
        background: "linear-gradient(135deg,#7a3f43,#8b5558)",
        borderRadius: 3,
        p: { xs: 3, md: 4 },
        color: "#fff",
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "1.2fr 1fr 1fr" },
        gap: 4,
        mb: 5,
      }}
    >
      {/* Profile Info */}
      <Box sx={{ display: "flex", gap: 2 }}>
        <Box
          sx={{
            width: 72,
            height: 72,
            borderRadius: 2,
            background: "rgba(255,255,255,0.25)",
            display: "grid",
            placeItems: "center",
          }}
        >
          <PersonOutlineRoundedIcon fontSize="large" />
        </Box>

        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography fontSize={20} fontWeight={600}>
              Manju
            </Typography>
            <Chip
              label="Premium"
              size="small"
              sx={{ bgcolor: "rgba(255,255,255,0.25)", color: "#fff" }}
            />
          </Box>

          <InfoLine icon={<MailOutlineRoundedIcon />} text="manju@email.com" />
          <InfoLine icon={<PhoneOutlinedIcon />} text="+1 (555) 123-4567" />
          <InfoLine
            icon={<CalendarMonthOutlinedIcon />}
            text="Member since January 2025"
          />

          <Button
            component={RouterLink}
            to="/editprofile"
            startIcon={<EditOutlinedIcon />}
            size="small"
            sx={{
              mt: 2,
              color: "#fff",
              border: "1px solid rgba(255,255,255,0.4)",
            }}
          >
            Edit Profile
          </Button>
        </Box>
      </Box>

      {/* Stats */}
      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
        <StatCard icon={<ShoppingBagOutlinedIcon />} label="Total Orders" value="12" />
        <StatCard icon={<PaletteOutlinedIcon />} label="Saved Designs" value="8" />
        <StatCard icon={<FavoriteBorderOutlinedIcon />} label="Wishlist" value="24" />
        <StatCard icon={<CurrencyRupeeOutlinedIcon />} label="Lifetime Spent" value="₹1.2L" />
      </Box>

      {/* Actions */}
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <HeaderActionCard
          icon={<DownloadOutlinedIcon />}
          title="Download Invoices"
          sub="Get all order receipts"
        />
        <HeaderActionCard
          icon={<ShareOutlinedIcon />}
          title="Share Profile"
          sub="Send to tailor or designer"
        />
        <HeaderActionCard
          icon={<StraightenOutlinedIcon />}
          title="View Size Passport"
          sub="Complete measurements"
        />
      </Box>
    </Box>
  );
}

function InfoLine({ icon, text }) {
  return (
    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
      {icon}
      <Typography fontSize={13}>{text}</Typography>
    </Box>
  );
}

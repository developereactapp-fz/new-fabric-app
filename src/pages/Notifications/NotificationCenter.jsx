import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Chip,
} from "@mui/material";

import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import StarRoundedIcon from "@mui/icons-material/StarRounded";
import StraightenRoundedIcon from "@mui/icons-material/StraightenRounded";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import ArrowForwardIosRoundedIcon from "@mui/icons-material/ArrowForwardIosRounded";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import DoneAllRoundedIcon from "@mui/icons-material/DoneAllRounded";
import ArchiveRoundedIcon from "@mui/icons-material/ArchiveRounded";
import CheckRoundedIcon from "@mui/icons-material/CheckRounded";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";
import TrendingUpRoundedIcon from "@mui/icons-material/TrendingUpRounded";

import MainLayout from "../../layouts/MainLayout";

export default function NotificationCenter() {
  const navigate = useNavigate();

  return (
    <MainLayout>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "280px 1fr", lg: "300px 1fr 320px" },
          gap: { xs: 2, md: 4 },
        }}
      >

        {/* ================= LEFT COLUMN ================= */}
        <Box>
          {/* Header Card */}
          <Box
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 1,
              background: "#7a3f43",
              color: "#fff",
              textAlign: "center",
              boxShadow: "0 18px 40px rgba(0,0,0,0.2)",
            }}
          >
            <Box
              sx={{
                width: 56,
                height: 56,
                mx: "auto",
                mb: 1.5,
                borderRadius: 1,
                background: "rgba(255,255,255,0.25)",
                display: "grid",
                placeItems: "center",
                position: "relative",
              }}
            >
              <NotificationsNoneIcon />
              <Box
                sx={{
                  position: "absolute",
                  top: -6,
                  right: -6,
                  width: 20,
                  height: 20,
                  borderRadius: "50%",
                  bgcolor: "#ef4444",
                  fontSize: 11,
                  display: "grid",
                  placeItems: "center",
                }}
              >
                2
              </Box>
            </Box>

            <Typography fontSize={20} fontWeight={500}>
              Notifications
            </Typography>
            <Typography fontSize={13} sx={{ opacity: 0.85 }}>
              8 Total
            </Typography>
          </Box>

          {/* Stats */}
          {[
            {
              label: "Active Designs",
              value: 12,
              icon: <StarRoundedIcon />,
              bg: "#f3e8e9",
              color: "#7a3f43",
            },
            {
              label: "Pending Orders",
              value: 3,
              icon: <Inventory2RoundedIcon />,
              bg: "#ede9fe",
              color: "#7c3aed",
            },
            {
              label: "This Week",
              value: 8,
              icon: <TrendingUpRoundedIcon />,
              bg: "#dcfce7",
              color: "#16a34a",
            },
          ].map((item) => (
            <Box
              key={item.label}
              sx={{
                mb: 2,
                p: 2.5,
                background: "#fff",
                borderRadius: 1,
                boxShadow: "0 8px 24px rgba(15,23,42,0.08)",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 1,
                  background: item.bg,
                  color: item.color,
                  display: "grid",
                  placeItems: "center",
                  mr: 2,
                }}
              >
                {item.icon}
              </Box>

              <Box>
                <Typography fontSize={12} color="#64748b">
                  {item.label}
                </Typography>
                <Typography fontSize={18} fontWeight={600}>
                  {item.value}
                </Typography>
              </Box>
            </Box>
          ))}

          {/* Filter By */}
          <Box
            sx={{
              mt: 3,
              p: 3,
              background: "#fff",
              borderRadius: 1,
              boxShadow: "0 12px 30px rgba(15,23,42,0.08)",
            }}
          >
            <Typography fontSize={12} fontWeight={600} mb={2}>
              FILTER BY
            </Typography>

            {[
              { label: "All", count: 8, active: true },
              { label: "System", count: 3 },
              { label: "Design", count: 3 },
              { label: "Profile", count: 2 },
            ].map((item) => (
              <Box
                key={item.label}
                sx={{
                  px: 2,
                  py: 1.5,
                  mb: 1,
                  borderRadius: 1,
                  display: "flex",
                  justifyContent: "space-between",
                  background: item.active ? "#7a3f43" : "#f8fafc",
                  color: item.active ? "#fff" : "#0f172a",
                  cursor: "pointer",
                transition: "all 0.2s ease",
                "&:hover": { opacity: 0.9 }
                }}
              >
                <Typography fontSize={13}>{item.label}</Typography>
                <Chip
                  size="small"
                  label={item.count}
                  sx={{
                    height: 18,
                    fontSize: 11,
                    bgcolor: item.active
                      ? "rgba(255,255,255,0.25)"
                      : "#e5e7eb",
                    color: item.active ? "#fff" : "#0f172a",
                  }}
                />
              </Box>
            ))}
          </Box>

          {/* Quick Actions */}
          <Box
            sx={{
              mt: 3,
              p: 3,
              background: "#fff",
              borderRadius: 1,
              boxShadow: "0 12px 30px rgba(15,23,42,0.08)",
            }}
          >
            <Typography fontSize={12} fontWeight={600} mb={2}>
              QUICK ACTIONS
            </Typography>

            {[
              { label: "Archive All", icon: <ArchiveRoundedIcon /> },
              { label: "Clear Read", icon: <DoneAllRoundedIcon /> },
              { label: "Preferences", icon: <TuneRoundedIcon /> },
            ].map((item) => (
              <Box
                key={item.label}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  px: 2,
                  py: 1.5,
                  mb: 1,
                  borderRadius: 1,
                  cursor: "pointer",
                fontSize: "13px",
                  "&:hover": { background: "#f8fafc" },
                }}
              >
                {item.icon}
                {item.label}
              </Box>
            ))}
          </Box>
        </Box>

        {/* ================= CENTER COLUMN ================= */}
        <Box sx={{ gridColumn: { md: "span 1", lg: "span 1" } }}>
          <TextField
            fullWidth
            placeholder="Search notifications..."
            sx={{
              mb: 3,
              "& .MuiOutlinedInput-root": {
                borderRadius: 1,
                background: "#fff",
              },
            }}
          />

          {[
            {
              title: "Design Saved Successfully",
              desc: "Your 'Navy Business Shirt' has been saved to your designs.",
              time: "5 min ago",
              icon: <CheckRoundedIcon />,
              color: "#16a34a",
            },
            {
              title: "Welcome to The Lux Label",
              desc: "Start creating your first custom garment today.",
              time: "2 hours ago",
              icon: <AutoAwesomeRoundedIcon />,
              color: "#7a3f43",
            },
            {
              title: "Measurements Updated",
              desc: "Profile measurements updated successfully.",
              time: "1 day ago",
              icon: <StraightenRoundedIcon />,
              color: "#2563eb",
            },
            {
              title: "Order Shipped",
              desc: "Your order #12345 is on the way.",
              time: "1 week ago",
              icon: <LocalShippingRoundedIcon />,
              color: "#9333ea",
            },
            {
              title: "Profile Completed",
              desc: "Your profile is now 100% complete.",
              time: "1 week ago",
              icon: <PersonRoundedIcon />,
              color: "#f97316",
            },
          ].map((item, i) => (
            <Box
              key={i}
              sx={{
                mb: 2,
                p: 2.5,
                background: "#fff",
                borderRadius: 1,
                boxShadow: "0 12px 30px rgba(15,23,42,0.08)",
                display: "flex",
                gap: 2,
              }}
            >
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: 1,
                  background: item.color,
                  color: "#fff",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                {item.icon}
              </Box>

              <Box sx={{ flex: 1 }}>
                <Typography fontSize={14} fontWeight={500}>
                  {item.title}
                  <Chip label="New" size="small" sx={{ ml: 1 }} />
                </Typography>
                <Typography fontSize={12} color="#64748b">
                  {item.desc}
                </Typography>
                <Typography fontSize={11} color="#94a3b8">
                  {item.time}
                </Typography>
              </Box>

              <ArrowForwardIosRoundedIcon fontSize="small" />
            </Box>
          ))}
        </Box>

        {/* ================= RIGHT COLUMN (UPDATED) ================= */}
        <Box sx={{ gridColumn: { md: "span 2", lg: "span 1" } }}>

          {/* Activity Summary */}
          <Box
            sx={{
              mb: 3,
              p: 3,
              background: "#fff",
              borderRadius: 1,
              boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
            }}
          >
            <Typography fontSize={12} fontWeight={600} mb={2}>
              ACTIVITY SUMMARY
            </Typography>

            {[
              { label: "Today", value: 2 },
              { label: "This Week", value: 8 },
              { label: "Unread", value: 2, color: "#ef4444" },
            ].map((item) => (
              <Box
                key={item.label}
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  px: 2,
                  py: 1.5,
                  mb: 1.5,
                  borderRadius: 1,
                  background: "#f8fafc",
                }}
              >
                <Typography fontSize={13}>{item.label}</Typography>
                <Typography fontSize={13} color={item.color || "#0f172a"}>
                  {item.value}
                </Typography>
              </Box>
            ))}
          </Box>

          {/* Recent Activity */}
          <Box
            sx={{
              mb: 3,
              p: 3,
              background: "#fff",
              borderRadius: 1,
              boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
            }}
          >
            <Typography fontSize={12} fontWeight={600} mb={2}>
              RECENT ACTIVITY
            </Typography>

            {[
              {
                label: "Design saved",
                time: "5 min ago",
                icon: <CheckRoundedIcon />,
                bg: "#dcfce7",
                color: "#16a34a",
              },
              {
                label: "Measurements updated",
                time: "1 day ago",
                icon: <StraightenRoundedIcon />,
                bg: "#dbeafe",
                color: "#2563eb",
              },
              {
                label: "Order shipped",
                time: "1 week ago",
                icon: <LocalShippingRoundedIcon />,
                bg: "#ede9fe",
                color: "#9333ea",
              },
            ].map((item) => (
              <Box
                key={item.label}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  mb: 1.5,
                }}
              >
                <Box
                  sx={{
                    width: 28,
                    height: 28,
                    borderRadius: 1,
                    background: item.bg,
                    color: item.color,
                    display: "grid",
                    placeItems: "center",
                  }}
                >
                  {item.icon}
                </Box>

                <Box>
                  <Typography fontSize={13}>{item.label}</Typography>
                  <Typography fontSize={11} color="#94a3b8">
                    {item.time}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>

          {/* Notification Settings */}
          <Box
            sx={{
              p: 3,
              mb: 3,
              borderRadius: 1,
              background: "linear-gradient(135deg,#f5eeee,#e8ded6)",
              textAlign: "center",
              boxShadow: "0 12px 30px rgba(15,23,42,0.08)",
            }}
          >
            <Box
              sx={{
                width: 44,
                height: 44,
                mx: "auto",
                mb: 1,
                borderRadius: 1,
                background: "#7a3f43",
                color: "#fff",
                display: "grid",
                placeItems: "center",
              }}
            >
              <SettingsOutlinedIcon />
            </Box>

            <Typography fontWeight={500}>Notification Settings</Typography>
            <Typography fontSize={12} color="#64748b" mb={2}>
              Manage your notification preferences
            </Typography>

            <Button
              fullWidth
              variant="contained"
              onClick={() => navigate("/editprofile")}
              sx={{
                borderRadius: 1,
                background: "#7a3f43",
                textTransform: "none",
                "&:hover": { background: "#5e3034" }
              }}
            >
              Configure
            </Button>
          </Box>

          {/* Quick Links */}
          {[
            { label: "View Profile", icon: <PersonRoundedIcon />, path: "/profiledashboard" },
            { label: "Design Studio", icon: <AutoAwesomeRoundedIcon />, path: "/style/shirt" },
          ].map((item) => (
            <Box
              key={item.label}
              onClick={() => navigate(item.path)}
              sx={{
                p: 2.5,
                mb: 2,
                background: "#fff",
                borderRadius: 1,
                boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                cursor: "pointer",
                transition: "transform 0.2s ease",
                "&:hover": { transform: "translateY(-2px)" }
              }}
            >
              <Box sx={{ display: "flex", gap: 1 }}>
                {item.icon}
                {item.label}
              </Box>
              <ArrowForwardIosRoundedIcon fontSize="small" />
            </Box>
          ))}
        </Box>
      </Box>
    </MainLayout>
  );
}

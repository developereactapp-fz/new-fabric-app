import {
  Box,
  Typography,
  Button,
  Avatar,
  Chip,
  Divider,
} from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

import AddIcon from "@mui/icons-material/Add";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import BrushOutlinedIcon from "@mui/icons-material/BrushOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import ContentCopyOutlinedIcon from "@mui/icons-material/ContentCopyOutlined";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";

import MainLayout from "../../layouts/MainLayout";
import { useState, useEffect } from "react";

export default function Dashboard() {
  const [userName, setUserName] = useState("Guest");

  useEffect(() => {
    // Get user name from localStorage or API
    const storedUser = localStorage.getItem("userName");
    if (storedUser) {
      setUserName(storedUser);
    }
  }, []);

  return (
    <MainLayout>

      {/* ================= WELCOME BANNER ================= */}
      <Box
        sx={{
          p: { xs: 2, sm: 3, md: 5 },
          mb: 4,
          borderRadius: 1,
          background: "linear-gradient(135deg,#7a3f43,#8c5156)",
          color: "#fff",
          boxShadow: "0 20px 40px rgba(0,0,0,0.18)",
        }}
      >
        <Typography fontSize={{ xs: 20, sm: 24, md: 26 }} fontWeight={500} mb={1}>
          👋 Welcome back, {userName}
        </Typography>

        <Typography fontSize={14} sx={{ opacity: 0.9 }}>
          Ready to create your next custom design? Continue where you left off or
          start something new.
        </Typography>

        {/* Profile Strip */}
        <Box
          sx={{
            mt: 3,
            p: { xs: 1.5, sm: 2 },
            borderRadius: 1,
            background: "rgba(255,255,255,0.12)",
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: "center",
            justifyContent: "space-between",
            gap: { xs: 1.5, sm: 2 },
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: { xs: 1, sm: 2 }, width: { xs: "100%", sm: "auto" } }}>
            <Avatar
              sx={{
                bgcolor: "#d6c6bd",
                color: "#5b3a3d",
                boxShadow: "0 8px 18px rgba(0,0,0,0.25)",
                fontSize: { xs: "0.875rem", sm: "1rem" }
              }}
            >
              {userName.split(" ").map(n => n[0]).join("").substring(0, 2)}
            </Avatar>

            <Box>
              <Typography fontSize={{ xs: 12, sm: 15 }} fontWeight={500}>
                {userName}{" "}
                <Chip
                  label="Premium Member"
                  size="small"
                  sx={{
                    ml: 1,
                    height: { xs: 16, sm: 18 },
                    fontSize: { xs: 9, sm: 11 },
                    bgcolor: "rgba(255,255,255,0.25)",
                    color: "#fff",
                  }}
                />
              </Typography>

              <Typography fontSize={{ xs: 10, sm: 12 }} sx={{ opacity: 0.9 }}>
                ⭐ Measurements Saved • 🎨 Designs
              </Typography>
            </Box>
          </Box>

          <Button
            component={RouterLink}
            to="/profiledashboard"
            size="small"
            variant="outlined"
            sx={{
              color: "#fff",
              borderColor: "rgba(255,255,255,0.4)",
              textTransform: "none",
              borderRadius: 1,
              px: { xs: 1.5, sm: 2 },
              fontSize: { xs: 12, sm: 14 },
              width: { xs: "100%", sm: "auto" },
              cursor: "pointer",
            }}
          >
            View Profile
          </Button>
        </Box>
      </Box>

      {/* ================= STATS ================= */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",
          gap: 3,
          mb: 4,
        }}
      >
        {[
          { label: "ACTIVE ORDERS", value: "3", icon: "📦" },
          { label: "COMPLETED", value: "12", icon: "📈" },
          { label: "IN PROGRESS", value: "2", icon: "⏱" },
        ].map((item) => (
          <Box
            key={item.label}
            sx={{
              p: 3,
              borderRadius: 1,
              background: "#fff",
              boxShadow: "0 12px 30px rgba(15,23,42,0.08)",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box>
              <Typography fontSize={11} color="#64748b">
                {item.label}
              </Typography>
              <Typography fontSize={26} fontWeight={600}>
                {item.value}
              </Typography>
            </Box>

            <Box
              sx={{
                width: 42,
                height: 42,
                borderRadius: 1,
                background: "#f1f5f9",
                display: "grid",
                placeItems: "center",
                fontSize: 18,
              }}
            >
              {item.icon}
            </Box>
          </Box>
        ))}
      </Box>

      {/* ================= START DESIGN ================= */}
      <Box
        sx={{
          mb: 4,
          p: 3,
          borderRadius: 1,
          background: "linear-gradient(135deg,#7a3f43,#8c5156)",
          color: "#fff",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          cursor: "pointer",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box
            sx={{
              width: 36,
              height: 36,
              borderRadius: 1,
              background: "rgba(255,255,255,0.25)",
              display: "grid",
              placeItems: "center",
            }}
          >
            <AddIcon />
          </Box>

          <Box>
            <Typography fontWeight={500}>Start New Design</Typography>
            <Typography fontSize={13} sx={{ opacity: 0.85 }}>
              Create your perfect custom shirt from scratch
            </Typography>
          </Box>
        </Box>

        <ArrowForwardIosIcon fontSize="small" />
      </Box>

      {/* ================= RECENT + NOTIFICATIONS ================= */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "2fr 1fr" },
          gap: 4,
          mb: 6,
        }}
      >
        {/* ================= RECENT DESIGNS ================= */}
        <Box
          sx={{
            background: "#fff",
            borderRadius: 1,
            boxShadow: "0 18px 40px rgba(15,23,42,0.08)",
          }}
        >
          {/* Header */}
          <Box
            sx={{
              px: 3,
              py: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box
                sx={{
                  width: 26,
                  height: 26,
                  borderRadius: 1,
                  background: "#f3e8e9",
                  display: "grid",
                  placeItems: "center",
                  color: "#7a3f43",
                }}
              >
                <BrushOutlinedIcon fontSize="small" />
              </Box>
              <Typography fontWeight={600}>Recent Designs</Typography>
            </Box>

            <Box
              sx={{
                fontSize: 13,
                color: "#7a3f43",
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                cursor: "pointer",
              }}
            >
              View All <VisibilityOutlinedIcon fontSize="small" />
            </Box>
          </Box>

          {/* Design Rows */}
          {[
            {
              name: "Navy Business Shirt",
              fabric: "Premium Italian Cotton",
              status: "Ready",
              bg: "#dcfce7",
              color: "#166534",
            },
            {
              name: "Weekend Casual",
              fabric: "Linen Blend",
              status: "In Progress",
              bg: "#fef3c7",
              color: "#92400e",
            },
            {
              name: "Summer Light Blue",
              fabric: "Egyptian Cotton",
              status: "Completed",
              bg: "#dbeafe",
              color: "#1e40af",
            },
          ].map((item, i) => (
            <Box
              key={i}
              sx={{
                mx: 3,
                mb: 2,
                p: 2,
                borderRadius: 1,
                background: "#efefef",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                cursor: "pointer",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Box
                  sx={{
                    width: 44,
                    height: 44,
                    borderRadius: 1,
                    background: "#f8fafc",
                  }}
                />
                <Box>
                  <Typography fontSize={14} fontWeight={500}>
                    {item.name}
                  </Typography>
                  <Typography fontSize={12} color="#64748b">
                    {item.fabric}
                  </Typography>
                </Box>
              </Box>

              <Chip
                label={item.status}
                size="small"
                sx={{
                  height: 22,
                  fontSize: 11,
                  bgcolor: item.bg,
                  color: item.color,
                }}
              />
            </Box>
          ))}

          {/* Actions */}
          <Box
            sx={{
              px: 3,
              py: 2,
              display: "grid",
              gridTemplateColumns: "repeat(3,1fr)",
              gap: 2,
            }}
          >
            {[
              { label: "View", icon: <VisibilityOutlinedIcon fontSize="small" /> },
              { label: "Edit", icon: <EditOutlinedIcon fontSize="small" /> },
              {
                label: "Duplicate",
                icon: <ContentCopyOutlinedIcon fontSize="small" />,
              },
            ].map((item) => (
              <Box
                key={item.label}
                sx={{
                  py: 1,
                  borderRadius: 1,
                  border: "1px solid #e5e7eb",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 0.5,
                  fontSize: 13,
                  cursor: "pointer",
                }}
              >
                {item.icon}
                {item.label}
              </Box>
            ))}
          </Box>
        </Box>

        {/* ================= NOTIFICATIONS ================= */}
        <Box
          sx={{
            background: "#e8ded6",
            borderRadius: 1,
            boxShadow: "0 18px 40px rgba(15,23,42,0.08)",
            p: 3,
          }}
        >
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Box  component={RouterLink}
  to="/notifications"
                sx={{
                  width: 26,
                  height: 26,
                                  textDecoration: "none",
                  borderRadius: 1,
                  background: "#f3e8e9",
                  display: "grid",
                  placeItems: "center",
                  color: "#7a3f43",
                }}
              >
                <NotificationsNoneIcon fontSize="small" />
              </Box>
              <Typography fontWeight={600}>Notifications</Typography>
            </Box>

            {/* UPDATED: View All + icon */}
            <Box  component={RouterLink}
  to="/notifications"
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 0.5,
                textDecoration: "none",
                cursor: "pointer",
              }}
            >
              <Typography fontSize={12}>View All</Typography>
              <VisibilityOutlinedIcon fontSize="small" />
            </Box>
          </Box>

          {[
            {
              text: `Your design "Navy Business Shirt" is ready`,
              time: "2 hours ago",
            },
            {
              text: "New fabric collection available",
              time: "1 day ago",
            },
          ].map((item, i) => (
            <Box
              key={i}
              sx={{
                mb: 2,
                p: 2,
                borderRadius: 1,
                background: "#efefef",
                display: "flex",
                alignItems: "center",
                gap: 2,
              }}
            >
              <Box
                sx={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#7a3f43",
                }}
              />
              <Box>
                <Typography fontSize={13}>{item.text}</Typography>
                <Typography fontSize={11} color="#64748b">
                  {item.time}
                </Typography>
              </Box>
            </Box>
          ))}

          <Box
            sx={{
              mt: 2,
              p: 2,
              borderRadius: 1,
              background: "#f0ffff",
              textAlign: "center",
            }}
          >
            <Typography fontSize={12} color="#0369a1">
              Profile updated successfully
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* ================= FOOTER ACTIONS ================= */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
          gap: 3,
        }}
      >
        {[
          {
            title: "Track Your Orders",
            desc: "View status and delivery updates",
            icon: <LocalShippingOutlinedIcon />,
          },
          {
            title: "Browse Collection",
            desc: "Explore premium fabrics and styles",
            icon: <FavoriteBorderOutlinedIcon />,
          },
        ].map((item) => (
          <Box
            key={item.title}
            sx={{
              p: 3,
              background: "#fff",
              borderRadius: 1,
              boxShadow: "0 12px 30px rgba(15,23,42,0.08)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  width: 42,
                  height: 42,
                  borderRadius: 1,
                  background: "#f1f5f9",
                  display: "grid",
                  placeItems: "center",
                }}
              >
                {item.icon}
              </Box>

              <Box>
                <Typography fontWeight={500}>{item.title}</Typography>
                <Typography fontSize={13} color="#64748b">
                  {item.desc}
                </Typography>
              </Box>
            </Box>

            <ArrowForwardIosIcon fontSize="small" />
          </Box>
        ))}
      </Box>

    </MainLayout>
  );
}

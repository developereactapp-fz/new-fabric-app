import { Box, Typography, Button } from "@mui/material";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";

export default function AccountActions() {
  return (
    <Box sx={{ background: "#fff", borderRadius: 3, border: "1px solid #fecaca", boxShadow: "0 18px 40px rgba(15,23,42,0.08)" }}>
      <Box sx={{ px: 3, py: 2, background: "#fde8e8", color: "#b91c1c", display: "flex", gap: 1 }}>
        <SettingsOutlinedIcon />
        <Typography fontWeight={600}>Account Actions</Typography>
      </Box>

      <Box sx={{ p: 3 }}>
        <Button fullWidth startIcon={<LogoutOutlinedIcon />} sx={{ mb: 2 }}>
          Log Out
        </Button>
        <Button fullWidth color="error" variant="outlined" startIcon={<DeleteOutlineRoundedIcon />}>
          Delete Account
        </Button>
      </Box>
    </Box>
  );
}

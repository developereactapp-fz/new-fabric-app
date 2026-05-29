import { Box, Typography, Switch, Chip } from "@mui/material";

export default function PreferenceRow({ icon, label, value, pill, toggle }) {
  return (
    <Box sx={{ p: 2, mb: 2, borderRadius: 2, background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
      <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
        {icon}
        <Box>
          <Typography fontSize={13}>{label}</Typography>
          {value && <Typography fontSize={11} color="#64748b">{value}</Typography>}
        </Box>
      </Box>
      {pill && <Chip label={value} size="small" />}
      {toggle && <Switch defaultChecked />}
    </Box>
  );
}

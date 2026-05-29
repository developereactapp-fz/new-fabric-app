import { Box } from "@mui/material";
import Header from "../components/layout/Header";

export default function MainLayout({ children }) {
  return (
    <Box sx={{ minHeight: "100vh", background: "#f8fafc" }}>
      <Header />
      <Box sx={{ px: { xs: 2, md: 4 }, py: 4 }}>
        {children}
      </Box>
    </Box>
  );
}

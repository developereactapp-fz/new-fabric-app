import { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Card,
  InputAdornment,
  Divider,
} from "@mui/material";

import EditRoundedIcon from "@mui/icons-material/EditRounded";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import StraightenOutlinedIcon from "@mui/icons-material/StraightenOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import AutorenewRoundedIcon from "@mui/icons-material/AutorenewRounded";
import FlashOnRoundedIcon from "@mui/icons-material/FlashOnRounded";

export default function EditProfile() {
  const [values, setValues] = useState({
    firstName: "Manju",
    lastName: "Sheriff",
    email: "manju.morgan@email.com",
    phone: "+1 (555) 123-4567",
    address: "123 Fashion Street",
    area: "New Royapuram",
    city: "Chennai",
    zip: "10001",
    country: "India",
  });

  const handleChange = (e) =>
    setValues({ ...values, [e.target.name]: e.target.value });

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "#fafafa",
        py: 6,
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 720 }}>
        {/* PAGE HEADER */}
        <Box sx={{ textAlign: "center", mb: 4 }}>
          <Box
            sx={{
              width: 56,
              height: 56,
              mx: "auto",
              mb: 1.5,
              borderRadius: 2,
              background: "#e8ded6",
              display: "grid",
              placeItems: "center",
            }}
          >
            <EditRoundedIcon sx={{ color: "#7a3f43" }} />
          </Box>

          <Typography fontSize={28} fontWeight={600}>
            Edit Profile
          </Typography>
          <Typography fontSize={13} color="#64748b">
            Update your personal information and preferences
          </Typography>
        </Box>

        {/* MAIN CARD */}
        <Card
          sx={{
            borderRadius: 4,
            boxShadow: "0 20px 50px rgba(15,23,42,0.12)",
            overflow: "hidden",
          }}
        >
          {/* PROFILE HEADER */}
          <Box sx={{ p: 3, display: "flex", gap: 2 }}>
            <Box
              sx={{
                width: 56,
                height: 56,
                borderRadius: 2,
                background: "#7a3f43",
                color: "#fff",
                display: "grid",
                placeItems: "center",
                fontWeight: 600,
              }}
            >
              MS
            </Box>
            <Box>
              <Typography fontWeight={500}>Profile Picture</Typography>
              <Typography fontSize={12} color="#64748b">
                Your avatar is generated from your initials
              </Typography>
            </Box>
          </Box>

          <Divider />

          {/* FORM */}
          <Box sx={{ p: 3 }}>
            {/* FULL NAME */}
            <Typography fontSize={11} color="#64748b" mb={1}>
              FULL NAME
            </Typography>

            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
              <TextField
                fullWidth
                name="firstName"
                value={values.firstName}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <PersonOutlineRoundedIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                fullWidth
                name="lastName"
                value={values.lastName}
                onChange={handleChange}
                required
              />
            </Box>

            {/* EMAIL */}
            <Typography fontSize={11} color="#64748b" mt={3} mb={1}>
              EMAIL ADDRESS
            </Typography>
            <TextField
              fullWidth
              type="email"
              name="email"
              value={values.email}
              onChange={handleChange}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <EmailOutlinedIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />

            {/* PHONE */}
            <Typography fontSize={11} color="#64748b" mt={3} mb={1}>
              PHONE NUMBER
            </Typography>
            <TextField
              fullWidth
              name="phone"
              value={values.phone}
              onChange={handleChange}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PhoneOutlinedIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />

            {/* ADDRESS */}
            <Typography fontSize={11} color="#64748b" mt={3} mb={1}>
              ADDRESS
            </Typography>
            <TextField
              fullWidth
              name="address"
              value={values.address}
              onChange={handleChange}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOnOutlinedIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />

            <Box
              sx={{
                mt: 2,
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 2,
              }}
            >
              <TextField
                fullWidth
                name="area"
                value={values.area}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                name="city"
                value={values.city}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                name="zip"
                value={values.zip}
                onChange={handleChange}
              />
              <TextField
                fullWidth
                name="country"
                value={values.country}
                onChange={handleChange}
              />
            </Box>
          </Box>
        </Card>

        {/* MEASUREMENTS */}
        <Card
          sx={{
            mt: 3,
            p: 3,
            borderRadius: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            boxShadow: "0 14px 35px rgba(15,23,42,0.1)",
          }}
        >
          <Box sx={{ display: "flex", gap: 1.5 }}>
            <StraightenOutlinedIcon sx={{ color: "#7a3f43" }} />
            <Box>
              <Typography fontWeight={500}>Edit Measurements</Typography>
              <Typography fontSize={12} color="#64748b">
                Neck: 15.5" • Chest: 40" • Waist: 34"
              </Typography>
            </Box>
          </Box>
        </Card>

        {/* ACTIONS */}
        <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
          <Button fullWidth variant="outlined">
            Cancel
          </Button>
          <Button
            fullWidth
            variant="contained"
            sx={{ background: "#7a3f43" }}
          >
            Save Changes
          </Button>
        </Box>

        <Typography
          fontSize={11}
          color="#64748b"
          textAlign="center"
          mt={2}
        >
          Your changes will be saved securely. Email changes may require
          verification.
        </Typography>

        {/* FOOTER INFO */}
        <Box
          sx={{
            mt: 4,
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: 2,
          }}
        >
          <InfoBox
            icon={<LockOutlinedIcon />}
            title="Secure & Private"
            desc="Your data is encrypted and protected"
          />
          <InfoBox
            icon={<AutorenewRoundedIcon />}
            title="Auto-Save"
            desc="Changes are automatically backed up"
          />
          <InfoBox
            icon={<FlashOnRoundedIcon />}
            title="Instant Sync"
            desc="Updates reflect across all devices"
          />
        </Box>
      </Box>
    </Box>
  );
}

/* FOOTER CARD */
function InfoBox({ icon, title, desc }) {
  return (
    <Card
      sx={{
        p: 3,
        textAlign: "center",
        borderRadius: 3,
        boxShadow: "0 10px 25px rgba(15,23,42,0.08)",
      }}
    >
      <Box
        sx={{
          width: 40,
          height: 40,
          mx: "auto",
          mb: 1.5,
          borderRadius: "50%",
          background: "#f3f4f6",
          display: "grid",
          placeItems: "center",
        }}
      >
        {icon}
      </Box>
      <Typography fontWeight={500}>{title}</Typography>
      <Typography fontSize={12} color="#64748b">
        {desc}
      </Typography>
    </Card>
  );
}

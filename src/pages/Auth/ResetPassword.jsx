import {
  Box,
  Typography,
  TextField,
  Button,
  Link,
  InputAdornment,
} from "@mui/material";

import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import SendOutlinedIcon from "@mui/icons-material/SendOutlined";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";
import axios from "axios"; // ✅ ADD THIS

/* ---------------- VALIDATION ---------------- */
const schema = yup.object({
  email: yup
    .string()
    .email("Enter a valid email address")
    .required("Email is required"),
});

import { API_ENDPOINTS } from "../../config/api";

export default function ResetPassword() {
    const navigate = useNavigate();

const [loading, setLoading] = useState(false);
const [message, setMessage] = useState("");
const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

const onSubmit = async (data) => {
  try {
    await axios.post(`${API}/api/auth/forgot-password`, {
      email: data.email,
      tenantSlug: "test-tenant" // 🔥 replace later
    });

    console.log("Reset link sent successfully");

  } catch (err) {
    console.log(err.response?.data || err.message);
  }
};

  return (
    <AuthLayout
      borderGradient="linear-gradient(90deg,#10b981,#06b6d4)"
      bgGradient="linear-gradient(135deg,#f0fdf4 0%,#ecfeff 100%)"
      leftContent={
        <Box sx={{ maxWidth: 520 }}>
          {/* Badge */}
          <Typography
            sx={{
              display: "inline-flex",
              alignItems: "center",
              px: 2,
              py: "6px",
              mb: 3,
              borderRadius: 1,
              background: "rgba(16,185,129,0.12)",
              color: "#059669",
              fontSize: 16,
              fontFamily: "Inter, serif",
              fontWeight: 500,
            }}
          >
            ✨ Account Recovery
          </Typography>

          {/* Heading */}
          <Typography
            sx={{
              fontFamily: "Inter, serif",
              fontSize: 48,
              lineHeight: 1.15,
              fontWeight: 500,
              mb: 1,
            }}
          >
            Need Help
          </Typography>

          <Typography
            sx={{
              fontFamily: "Inter, serif",
              fontSize: 48,
              lineHeight: 1.15,
              fontWeight: 500,
              color: "#10b981",
              mb: 2,
            }}
          >
            Getting Back In?
          </Typography>

          {/* Description */}
          <Typography
            sx={{
              color: "#64748b",
              fontSize: 16,
              lineHeight: 1.6,
              maxWidth: 460,
            }}
          >
            Don't worry! It happens to the best of us. We'll help you reset your
            password and get you back to designing your perfect suit in no time.
          </Typography>

          {/* Steps */}
          <Box sx={{ mt: 4, borderRadius: 1, display: "grid", gap: 2 }}>
            {[ 
              {
                step: "1",
                title: "Enter your email",
                desc: "We'll send you a secure reset link",
              },
              {
                step: "2",
                title: "Check your inbox",
                desc: "Click the link in your email",
              },
              {
                step: "3",
                title: "Create new password",
                desc: "Set a strong, memorable password",
              },
            ].map((item) => (
              <Box key={item.step} sx={{ display: "flex", gap: 2 }}>
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: 2,
                    background: "rgba(16,185,129,0.15)",
                    color: "#059669",
                    display: "grid",
                    placeItems: "center",
                    fontWeight: 600,
                  }}
                >
                  {item.step}
                </Box>
                <Box>
                  <Typography fontWeight={600} fontSize={15}>
                    {item.title}
                  </Typography>
                  <Typography fontSize={13} color="#64748b">
                    {item.desc}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>
        </Box>
      }
    >
      {/* Back link */}
      <Link
        component={RouterLink}
        to="/login"
        sx={{
          fontSize: 13,
          color: "#64748b",
          mb: 2,
          display: "inline-block",
          textDecoration: "none",
          "&:hover": { color: "#10b981" },
        }}
      >
        ← Back to Sign in
      </Link>

      {/* Icon */}
      <Box
        sx={{
          width: 75,
          height: 75,
          borderRadius: "10%",
          background: "rgba(16,185,129,0.12)",
          boxShadow: "0 8px 20px rgba(16,185,129,0.25)",
          display: "grid",
          placeItems: "center",
          mx: "auto",
          mb: "44px",
        }}
      >
        <SendOutlinedIcon sx={{ color: "#10b981" }} />
      </Box>

      {/* Title */}
      <Typography
        sx={{
          fontFamily: "Inter, serif",
          fontSize: 22,
          fontWeight: 600,
          mb: "24px",
          textAlign: "center",
        }}
      >
        Reset Password
      </Typography>

      {/* Subtitle */}
      <Typography
        sx={{
          fontFamily: "Inter, serif",
          fontSize: 14,
          color: "#64748b",
          mb: "64px",
          textAlign: "center",
        }}
      >
        Enter your email and we'll send you a recovery link
      </Typography>

      {/* Form */}
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <TextField
          label="Email Address"
          fullWidth
          {...register("email")}
          error={!!errors.email}
          helperText={errors.email?.message}
          sx={inputStyle}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailOutlinedIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />

        <Button
          type="submit"
          fullWidth
          sx={primaryButtonStyle}
          variant="contained"
          disabled={loading}
        >
        {loading ? "Please wait..." : " Send Reset Link"}

        </Button>


        {/* ✅ Error / Success Message */}

        {error && (
          <Typography color="error" sx={{ mt: 2, textAlign: "center" }}>
            {error}
          </Typography>
        )}

        {message && (
          <Typography sx={{ mt: 2, textAlign: "center", color: "green" }}>
            {message}
          </Typography>
        )}

        <Typography align="center" sx={{ mt: 2, mb:"60px", fontSize: 14 }}>
          Remember your password?{" "}
          <Link
            component={RouterLink}
            to="/"
            sx={{
              color: "#10b981",
              fontWeight: 500,
              
              textDecoration: "none",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            Sign in
          </Link>
        </Typography>

        {/* ✅ SUPPORT CONTENT — RESTORED */}
        <Box
          sx={{
            mt: 4,
            p: 2,
            borderRadius: "10px",
            background: "rgba(16,185,129,0.08)",
            border: "1px solid rgba(16,185,129,0.2)", 
            fontSize: 13,
          }}
        >
          <strong>Need help?</strong> Contact our support team at{" "}
          <Link href="mailto:support@suitsupply.com" sx={{ color: "#059669" }}>
            support@suitsupply.com
          </Link>
        </Box>
      </Box>
    </AuthLayout>
  );
}

/* ---------------- SAME INPUT LOGIC AS LOGIN ---------------- */

const inputStyle = {
  mb: "10px",
  "& .MuiOutlinedInput-root": {
    background: "#fff",
    borderRadius: "10px",
    boxShadow: "0 8px 20px rgba(15,23,42,0.08)",
    "& fieldset": { border: "none" },
  },
  "& .MuiInputLabel-root": {
    transform: "translate(48px, 16px) scale(1)",
  },
  "& .MuiInputLabel-root.Mui-focused, & .MuiInputLabel-root.MuiFormLabel-filled":
    {
      transform: "translate(48px, -6px) scale(0.85)",
    },
};

const primaryButtonStyle = {
  mt: "24px",
  py: "10px",
  borderRadius: "10px",
  background: "linear-gradient(90deg,#10b981,#06b6d4)",
  boxShadow: "0 12px 28px rgba(16,185,129,0.35)",
  fontWeight: 500,
};

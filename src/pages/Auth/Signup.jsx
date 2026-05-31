import {
  Box,
  Typography,
  TextField,
  Button,
  Checkbox,
  FormControlLabel,
  Link,
  Divider,
  InputAdornment,
} from "@mui/material";

import PersonAddOutlinedIcon from "@mui/icons-material/PersonAddOutlined";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";
import axios from "axios"; // ✅ ADD THIS LINE

/* ---------------- VALIDATION ---------------- */
const schema = yup.object({
  firstName: yup.string().required("First name is required"),
  lastName: yup.string().required("Last name is required"),
  email: yup.string().email("Enter a valid email").required("Email is required"),
  password: yup.string().min(8, "Minimum 8 characters").required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords must match")
    .required("Confirm your password"),
  terms: yup.boolean().oneOf([true], "You must accept the terms"),
});

import { API_ENDPOINTS } from "../../config/api";

export default function Signup() {
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
    await axios.post(`${API}/api/auth/register`, {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      tenantSlug: "test-tenant" // 🔥 replace later
    });

    navigate("/login"); // go to login

  } catch (err) {
    console.log(err.response?.data || err.message);
  }
};
  return (
    <AuthLayout
      borderGradient="linear-gradient(90deg,#9333ea,#ec4899)"
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
              background: "rgba(147,51,234,0.1)",
              color: "#9333ea",
              fontSize: 16,
              fontFamily: "Inter, serif",
              fontWeight: 500,
            }}
          >
            ✨ Join Our Community
          </Typography>

          {/* Heading */}
          <Typography
            sx={{
              fontFamily: "Inter, serif",
              fontSize: 48,
              lineHeight: 1.15,
              fontWeight: 500,
              mb: 2,
            }}
          >
            Start Your Journey to{" "}
            <Box component="span" sx={{ color: "#7c3aed" }}>
              Perfect Style
            </Box>
          </Typography>

          {/* Description */}
          <Typography
            sx={{
              color: "#64748b",
              fontSize: 16,
              lineHeight: 1.6,
              maxWidth: 440,
            }}
          >
            Create your account and unlock access to premium suit customization,
            expert tailoring, and exclusive designs.
          </Typography>

          {/* Feature Cards */}
          <Box sx={{ mt: 4, display: "grid", gap: 2, maxWidth: 460 }}>
            {[
              {
                title: "Personalized Experience",
                desc: "Save measurements and preferences",
                icon: "🎯",
              },
              {
                title: "Exclusive Access",
                desc: "Premium fabrics and early releases",
                icon: "🏆",
              },
            ].map((item) => (
              <Box
                key={item.title}
                sx={{
                  p: "16px",
                  borderRadius: "14px",
                  background: "#ffffff",
                  boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
                  display: "flex",
                  gap: 2,
                  alignItems: "center",
                }}
              >
                <Typography fontSize={26}>{item.icon}</Typography>
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
      {/* Back */}
      <Link
        component={RouterLink}
        to="/login"
        sx={{
          fontSize: 13,
          color: "#64748b",
          mb: 2,
          display: "inline-block",
          textDecoration: "none",
          "&:hover": { color: "#9333ea" },
        }}
      >
        ← Back to Home
      </Link>

      {/* Icon */}
      <Box
        sx={{
          width: 75,
          height: 75,
          borderRadius: "20%",
          background: "rgba(147,51,234,0.12)",
          boxShadow: "0 8px 20px rgba(147,51,234,0.25)",
          display: "grid",
          placeItems: "center",
          mx: "auto",
          mb: "44px",
        }}
      >
        <PersonAddOutlinedIcon sx={{ color: "#9333ea" }} />
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
        Create Account
      </Typography>

      <Typography
        sx={{
          fontFamily: "Inter, serif",
          fontSize: 14,
          color: "#64748b",
          mb: "24px",
          textAlign: "center",
        }}
      >
        Fill in your details to get started
      </Typography>

      {/* Form */}
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        {/* Name Row */}
        <Box sx={{ display: "flex", gap: 2 }}>
          <TextField
            fullWidth
            label="First Name"
            {...register("firstName")}
            error={!!errors.firstName}
            helperText={errors.firstName?.message}
            InputLabelProps={{ shrink: false }}
            sx={inputStyle}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonOutlineIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            fullWidth
            label="Last Name"
            {...register("lastName")}
            error={!!errors.lastName}
            helperText={errors.lastName?.message}
            InputLabelProps={{ shrink: false }}
            sx={inputStyle}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <PersonOutlineIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
        </Box>

        {/* Email */}
        <TextField
          fullWidth
          label="Email Address"
          {...register("email")}
          error={!!errors.email}
          helperText={errors.email?.message}
          InputLabelProps={{ shrink: false }}
          sx={inputStyle}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EmailOutlinedIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />

        {/* Password */}
        <TextField
          fullWidth
          type="password"
          label="Password"
          {...register("password")}
          error={!!errors.password}
          helperText={errors.password?.message}
          InputLabelProps={{ shrink: false }}
          sx={inputStyle}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockOutlinedIcon fontSize="small" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <VisibilityOutlinedIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />

        {/* Confirm */}
        <TextField
          fullWidth
          type="password"
          label="Confirm Password"
          {...register("confirmPassword")}
          error={!!errors.confirmPassword}
          helperText={errors.confirmPassword?.message}
          InputLabelProps={{ shrink: false }}
          sx={inputStyle}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <LockOutlinedIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />

        {/* Terms */}
        <FormControlLabel
          sx={{ mt: 1 }}
          control={<Checkbox {...register("terms")} />}
          label={
            <Typography fontSize={13}>
              I agree to the{" "}
              <Link sx={{ color: "#9333ea" }}>Terms & Conditions</Link> and{" "}
              <Link sx={{ color: "#9333ea" }}>Privacy Policy</Link>
            </Typography>
          }
        />

        {errors.terms && (
          <Typography fontSize={12} color="error">
            {errors.terms.message}
          </Typography>
        )}

        <Button
          type="submit"
          fullWidth
          sx={{
            mt: "24px",
            py: "10px",
            borderRadius: "10px",
            background: "linear-gradient(90deg,#0f172a,#1e293b)",
            boxShadow: "0 12px 28px rgba(15,23,42,0.25)",
            fontWeight: 500,
          }}
          variant="contained"
          disabled={loading}
        >
          {loading ? "Please wait..." : "Create Account"}

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

        <Typography align="center" sx={{ mt: 2, fontSize: 14 }}>
          Already have an account?{" "}
          <Link component={RouterLink} to="/login" sx={{ color: "#9333ea" }}>
            Sign in
          </Link>
        </Typography>

        <Divider sx={{ my: 3, fontSize: 13 }}>OR SIGN UP WITH</Divider>

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button fullWidth variant="outlined" sx={{ borderRadius: "10px" }} startIcon={<GoogleIcon sx={{ color: "#DB4437" }} />}>
            Google
          </Button>
          <Button fullWidth variant="outlined" sx={{ borderRadius: "10px" }} startIcon={<FacebookIcon sx={{ color: "#1877F2" }} />}>
            Facebook
          </Button>
        </Box>
      </Box>
    </AuthLayout>
  );
}

/* -------- INPUT STYLE (SHARED WITH LOGIN) -------- */
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
  "& .MuiInputLabel-root.Mui-focused, & .MuiInputLabel-root.MuiFormLabel-filled": {
    transform: "translate(48px, -6px) scale(0.85)",
  },
};

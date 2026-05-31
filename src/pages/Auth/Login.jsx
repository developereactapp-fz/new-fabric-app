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
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import GoogleIcon from "@mui/icons-material/Google";
import FacebookIcon from "@mui/icons-material/Facebook";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import AuthLayout from "../../layouts/AuthLayout";
import { API_ENDPOINTS } from "../../config/api";
import axios from "axios"; // ✅ ADD THIS LINE

/* ---------------- VALIDATION ---------------- */
const schema = yup.object({
  email: yup.string().email("Enter a valid email").required("Email is required"),
  password: yup.string().min(8, "Minimum 8 characters").required("Password is required"),
});

export default function Login() {
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
  setLoading(true);
  setError("");
  setMessage("");

  try {
    const res = await axios.post(API_ENDPOINTS.LOGIN, {
      email: data.email,
      password: data.password,
      tenantSlug: "test-tenant"
    });

    console.log("SUCCESS:", res.data);

    const token = res.data.token || res.data.data?.token;

    if (token) {
      localStorage.setItem("token", token);
    }

    setMessage("Login successful");

    setTimeout(() => {
      navigate("/");
    }, 1000);

  } catch (err) {
    console.log("ERROR:", err.response?.data);

    setError(err.response?.data?.message || "Something went wrong");
  } finally {
    setLoading(false);
  }
};

  return (
    <AuthLayout
      borderGradient="linear-gradient(90deg,#2563eb,#9333ea,#ec4899)"
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
              background: "rgba(37,99,235,0.1)",
              color: "#2563eb",
              fontSize: 16,
              fontFamily: "Inter, serif",
              fontWeight: 500,
            }}
          >
            ✨ Premium Suit Customization
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
            Welcome Back to Your{" "}
            <Box component="span" sx={{ color: "#7c3aed" }}>
              Custom Wardrobe
            </Box>
          </Typography>

          {/* Description */}
          <Typography
            sx={{
              color: "#64748b",
              fontSize: 16,
              lineHeight: 1.6,
              maxWidth: 520,
            }}
          >
            Sign in to continue creating your perfect suit.
            Access your saved designs, measurements, and preferences.
          </Typography>

          {/* Feature Grid (UNCHANGED) */}
          <Box
            sx={{
              mt: 4,
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 14 / 8,
              maxWidth: 520,
            }}
          >
            {[
              { title: "Custom Suits", icon: "🧥" },
              { title: "Tailored Fit", icon: "✂️" },
              { title: "Premium Fabrics", icon: "🎨" },
            ].map((item) => (
              <Box
                key={item.title}
                sx={{
                  p: "16px",
                  borderRadius: "10px",
                  background: "#ffffff",
                  boxShadow: "0 10px 30px rgba(15,23,42,0.08)",
                  textAlign: "left",
                }}
              >
                <Typography sx={{ fontSize: 30, mb: 1 }}>
                  {item.icon}
                </Typography>
                <Typography
                  sx={{
                    fontSize: 15,
                    fontWeight: 500,
                    color: "#475569",
                  }}
                >
                  {item.title}
                </Typography>
              </Box>
            ))}
          </Box>
        </Box>
      }
    >
      {/* Back to Home */}
      <Link
        component={RouterLink}
        to="/"
        sx={{
          fontSize: 13,
          color: "#64748b",
          mb: 2,
          display: "inline-block",
          textDecoration: "none",
          "&:hover": { color: "#2563eb" },
        }}
      >
        ← Back to Home
      </Link>

      {/* Sign-in Icon */}
      <Box
        sx={{
          width: 75,
          height: 75,
          borderRadius: "20%",
          background: "rgba(37,99,235,0.12)",
          boxShadow: "0 8px 20px rgba(37,99,235,0.25)",
          display: "grid",
          placeItems: "center",
          mx: "auto",
          mb: "44px",
        }}
      >
        <LockOutlinedIcon sx={{ color: "#2563eb" }} />
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
        Sign In
      </Typography>

      {/* Subtitle */}
      <Typography
        sx={{
          fontFamily: "Inter, serif",
          fontSize: 14,
          color: "#64748b",
          mb: "24px",
          textAlign: "center",
        }}
      >
        Enter your credentials to access your account
      </Typography>

      {/* Form */}
      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        {/* Email */}
        <TextField
          fullWidth
          label="Email Address"
          {...register("email")}
          error={!!errors.email}
          helperText={errors.email?.message}
          InputLabelProps={{ shrink: false }}
          sx={{
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
          }}
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
          sx={{
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
          }}
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

        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <FormControlLabel
            control={<Checkbox />}
            label={<Typography fontSize={13}>Remember me</Typography>}
          />

          <Link
            component={RouterLink}
            to="/resetpassword"
            sx={{
              fontSize: 13,
              color: "#2563eb",
              fontWeight: 500,
              textDecoration: "none",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            Forgot Password?
          </Link>
        </Box>

        {/* Submit */}
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
        {loading ? "Please wait..." : "Sign In"}
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

        {/* ✅ MISSING CONTENT — ADDED BACK */}
        <Typography
          align="center"
          sx={{ mt: 2, fontSize: 14 }}
        >
          Don't have an account?{" "}
          <Link
            component={RouterLink}
            to="/signup"
            sx={{
              color: "#2563eb",
              fontWeight: 500,
              textDecoration: "none",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            Create an account
          </Link>
        </Typography>

        <Divider sx={{ my: 3, fontSize: 13 }}>
          OR CONTINUE WITH
        </Divider>

        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            fullWidth
            variant="outlined"
            sx={{ borderRadius: "10px" }}
            startIcon={<GoogleIcon sx={{ color: "#DB4437" }} />}
          >
            Google
          </Button>
          <Button
            fullWidth
            variant="outlined"
            sx={{ borderRadius: "10px" }}
            startIcon={<FacebookIcon sx={{ color: "#1877F2" }}/>}
          >
            Facebook
          </Button>
        </Box>
      </Box>
    </AuthLayout>
  );
}

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import axios from "axios";
import AuthLayout from "../../layouts/AuthLayout";
import "./Auth.css";

/* ---------------- VALIDATION ---------------- */
const schema = yup.object({
  email: yup.string().email("Enter a valid email").required("Email is required"),
  password: yup.string().min(8, "Minimum 8 characters").required("Password is required"),
});

// const API = "https://apperal-clothing-app.onrender.com";
   const API = "https://apperal-clothing-app-production.up.railway.app";


export default function Login() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

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
      const res = await axios.post(`${API}/api/auth/login`, {
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
        <div className="left-panel-content">
          <div className="badge-wrapper">
            <span className="premium-badge">✨ Premium Suit Customization</span>
          </div>

          <h1 className="auth-heading">
            Welcome Back to Your <span className="highlight-text">Custom Wardrobe</span>
          </h1>

          <p className="auth-description">
            Sign in to continue creating your perfect suit.
            Access your saved designs, measurements, and preferences.
          </p>

          <div className="feature-grid">
            {[
              { title: "Custom Suits", icon: "🧥" },
              { title: "Tailored Fit", icon: "✂️" },
              { title: "Premium Fabrics", icon: "🎨" },
            ].map((item) => (
              <div key={item.title} className="feature-card">
                <div className="feature-icon">{item.icon}</div>
                <div className="feature-title">{item.title}</div>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <div className="auth-form-container">
        <RouterLink to="/" className="back-link">
          ← Back to Home
        </RouterLink>

        <div className="auth-icon-circle blue">
          <svg className="auth-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
          </svg>
        </div>

        <h2 className="auth-title">Sign In</h2>
        <p className="auth-subtitle">Enter your credentials to access your account</p>

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          <div className="input-group">
            <div className="input-wrapper">
              <span className="input-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              </span>
              <input
                type="email"
                placeholder="Email Address"
                className={`auth-input ${errors.email ? 'input-error' : ''}`}
                {...register("email")}
              />
            </div>
            {errors.email && <span className="error-text">{errors.email.message}</span>}
          </div>

          <div className="input-group">
            <div className="input-wrapper">
              <span className="input-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              </span>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className={`auth-input ${errors.password ? 'input-error' : ''}`}
                {...register("password")}
              />
              <button 
                type="button" 
                className="password-toggle" 
                onClick={() => setShowPassword(!showPassword)}
              >
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
              </button>
            </div>
            {errors.password && <span className="error-text">{errors.password.message}</span>}
          </div>

          <div className="form-options">
            <label className="checkbox-label">
              <input type="checkbox" />
              <span>Remember me</span>
            </label>
            <RouterLink to="/resetpassword" className="forgot-password">
              Forgot Password?
            </RouterLink>
          </div>

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? "Please wait..." : "Sign In"}
          </button>

          {error && <p className="form-error">{error}</p>}
          {message && <p className="form-success">{message}</p>}

          <p className="auth-footer">
            Don’t have an account?{" "}
            <RouterLink to="/signup" className="footer-link">
              Create an account
            </RouterLink>
          </p>

          <div className="divider">
            <span>OR CONTINUE WITH</span>
          </div>

          <div className="social-buttons">
            <button type="button" className="social-button google">
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="Google" />
              Google
            </button>
            <button type="button" className="social-button facebook">
              <svg className="facebook-icon" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"></path>
              </svg>
              Facebook
            </button>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
}

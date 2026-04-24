import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import axios from "axios";
import AuthLayout from "../../layouts/AuthLayout";
import "./Auth.css";

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

// const API = "https://apperal-clothing-app.onrender.com";
   const API = "https://apperal-clothing-app-production.up.railway.app";


export default function Signup() {
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
      await axios.post(`${API}/api/auth/register`, {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        tenantSlug: "test-tenant"
      });

      setMessage("Registration successful! Redirecting...");
      setTimeout(() => {
        navigate("/login");
      }, 1500);

    } catch (err) {
      console.log(err.response?.data || err.message);
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      borderGradient="linear-gradient(90deg,#9333ea,#ec4899)"
      leftContent={
        <div className="left-panel-content">
          <div className="badge-wrapper">
            <span className="premium-badge purple">✨ Join Our Community</span>
          </div>

          <h1 className="auth-heading">
            Start Your Journey to <span className="highlight-text purple">Perfect Style</span>
          </h1>

          <p className="auth-description">
            Create your account and unlock access to premium suit customization,
            expert tailoring, and exclusive designs.
          </p>

          <div className="feature-cards-stacked">
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
              <div key={item.title} className="stacked-feature-card">
                <div className="feature-icon-large">{item.icon}</div>
                <div className="feature-details">
                  <div className="feature-card-title">{item.title}</div>
                  <div className="feature-card-desc">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <div className="auth-form-container">
        <RouterLink to="/login" className="back-link">
          ← Back to Login
        </RouterLink>

        <div className="auth-icon-circle purple">
          <svg className="auth-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"></path>
          </svg>
        </div>

        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Fill in your details to get started</p>

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          <div className="name-row">
            <div className="input-group">
              <div className="input-wrapper">
                <span className="input-icon">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                </span>
                <input
                  type="text"
                  placeholder="First Name"
                  className={`auth-input ${errors.firstName ? 'input-error' : ''}`}
                  {...register("firstName")}
                />
              </div>
              {errors.firstName && <span className="error-text">{errors.firstName.message}</span>}
            </div>

            <div className="input-group">
              <div className="input-wrapper">
                <span className="input-icon">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                </span>
                <input
                  type="text"
                  placeholder="Last Name"
                  className={`auth-input ${errors.lastName ? 'input-error' : ''}`}
                  {...register("lastName")}
                />
              </div>
              {errors.lastName && <span className="error-text">{errors.lastName.message}</span>}
            </div>
          </div>

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

          <div className="input-group">
            <div className="input-wrapper">
              <span className="input-icon">
                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              </span>
              <input
                type="password"
                placeholder="Confirm Password"
                className={`auth-input ${errors.confirmPassword ? 'input-error' : ''}`}
                {...register("confirmPassword")}
              />
            </div>
            {errors.confirmPassword && <span className="error-text">{errors.confirmPassword.message}</span>}
          </div>

          <div className="form-options">
            <label className="checkbox-label">
              <input type="checkbox" {...register("terms")} />
              <span className="terms-text">
                I agree to the <RouterLink to="#" className="terms-link">Terms & Conditions</RouterLink> and <RouterLink to="#" className="terms-link">Privacy Policy</RouterLink>
              </span>
            </label>
          </div>
          {errors.terms && <span className="error-text block">{errors.terms.message}</span>}

          <button type="submit" className="submit-button dark" disabled={loading}>
            {loading ? "Please wait..." : "Create Account"}
          </button>

          {error && <p className="form-error">{error}</p>}
          {message && <p className="form-success">{message}</p>}

          <p className="auth-footer">
            Already have an account?{" "}
            <RouterLink to="/login" className="footer-link purple">
              Sign in
            </RouterLink>
          </p>

          <div className="divider">
            <span>OR SIGN UP WITH</span>
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

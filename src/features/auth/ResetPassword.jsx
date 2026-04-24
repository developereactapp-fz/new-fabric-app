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
  email: yup
    .string()
    .email("Enter a valid email address")
    .required("Email is required"),
});

// const API = "https://apperal-clothing-app.onrender.com";
   const API = "https://apperal-clothing-app-production.up.railway.app";


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
    setLoading(true);
    setError("");
    setMessage("");

    try {
      await axios.post(`${API}/api/auth/forgot-password`, {
        email: data.email,
        tenantSlug: "test-tenant"
      });

      setMessage("Reset link sent successfully to your email!");

    } catch (err) {
      console.log(err.response?.data || err.message);
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      borderGradient="linear-gradient(90deg,#10b981,#06b6d4)"
      bgGradient="linear-gradient(135deg,#f0fdf4 0%,#ecfeff 100%)"
      leftContent={
        <div className="left-panel-content">
          <div className="badge-wrapper">
            <span className="premium-badge green">✨ Account Recovery</span>
          </div>

          <h1 className="auth-heading">
            Need Help <br />
            <span className="highlight-text green">Getting Back In?</span>
          </h1>

          <p className="auth-description">
            Don’t worry! It happens to the best of us. We’ll help you reset your
            password and get you back to designing your perfect suit in no time.
          </p>

          <div className="steps-container">
            {[ 
              {
                step: "1",
                title: "Enter your email",
                desc: "We’ll send you a secure reset link",
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
              <div key={item.step} className="step-item">
                <div className="step-number">{item.step}</div>
                <div className="step-info">
                  <div className="step-title">{item.title}</div>
                  <div className="step-desc">{item.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <div className="auth-form-container">
        <RouterLink to="/login" className="back-link">
          ← Back to Sign in
        </RouterLink>

        <div className="auth-icon-circle green">
          <svg className="auth-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
          </svg>
        </div>

        <h2 className="auth-title">Reset Password</h2>
        <p className="auth-subtitle">Enter your email and we’ll send you a recovery link</p>

        <form onSubmit={handleSubmit(onSubmit)} className="auth-form">
          <div className="input-group large-margin">
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

          <button type="submit" className="submit-button green" disabled={loading}>
            {loading ? "Please wait..." : "Send Reset Link"}
          </button>

          {error && <p className="form-error">{error}</p>}
          {message && <p className="form-success">{message}</p>}

          <p className="auth-footer extra-margin">
            Remember your password?{" "}
            <RouterLink to="/login" className="footer-link green">
              Sign in
            </RouterLink>
          </p>

          <div className="support-box">
            <strong>Need help?</strong> Contact our support team at{" "}
            <a href="mailto:support@suitsupply.com" className="support-link">
              support@suitsupply.com
            </a>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
}

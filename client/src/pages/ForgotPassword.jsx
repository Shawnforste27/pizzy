import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  // Theme configuration
  const theme = {
    primaryColor: "#ff4d2d", // rich orange
    hoverColor: "#e64323", // darker orange
    bgColor: "#fff9f6", // light off-white background
    borderColor: "#ddd",
    inputFocusRing: "#ff4d2d33",
    buttonShadow: "0 4px 6px rgba(0,0,0,0.1)",
  };

  const handleSendOtp = async () => {
    try {
      await axios.post(`${serverUrl}/api/auth/sendotp`, { email }, { withCredentials: true });
      setStep(2);
    } catch (error) {
      console.log(error);
    }
  };

  const handleVerifyOtp = async () => {
    try {
      await axios.post(`${serverUrl}/api/auth/verifyotp`, { email, otp }, { withCredentials: true });
      setStep(3);
    } catch (error) {
      console.log(error);
    }
  };

  const handleResetPassword = async () => {
    if (newPassword === confirmPassword) {
      try {
        await axios.post(`${serverUrl}/api/auth/resetpassword`, { email, password: newPassword }, { withCredentials: true });
        navigate("/signin");
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("Both passwords do not match.");
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen p-4"
      style={{ backgroundColor: theme.bgColor }}
    >
      <div
        className="bg-white rounded-xl shadow-lg w-full max-w-md p-8"
        style={{ border: `1px solid ${theme.borderColor}`, boxShadow: theme.buttonShadow }}
      >
        {/* Heading */}
        <h1
          className="text-3xl font-bold mb-2 text-center"
          style={{ color: theme.primaryColor }}
        >
          Forgot Password
        </h1>
        <p className="text-gray-600 text-center mb-8">
          Follow the steps to reset your password
        </p>

        {/* Step 1: Email */}
        {step === 1 && (
          <>
            <label className="block text-gray-700 font-medium mb-1">Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full border rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-[#ff4d2d33] focus:border-[#ff4d2d]"
              style={{ borderColor: theme.borderColor }}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <button
              className="w-full font-semibold py-2 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
              style={{ backgroundColor: theme.primaryColor, color: "white" }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = theme.hoverColor)}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = theme.primaryColor)}
              onClick={handleSendOtp}
            >
              Send OTP
            </button>
          </>
        )}

        {/* Step 2: OTP */}
        {step === 2 && (
          <>
            <label className="block text-gray-700 font-medium mb-1">Enter OTP</label>
            <input
              type="text"
              placeholder="Enter the OTP sent to your email"
              className="w-full border rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-[#ff4d2d33] focus:border-[#ff4d2d]"
              style={{ borderColor: theme.borderColor }}
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            <button
              className="w-full font-semibold py-2 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
              style={{ backgroundColor: theme.primaryColor, color: "white" }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = theme.hoverColor)}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = theme.primaryColor)}
              onClick={handleVerifyOtp}
            >
              Verify OTP
            </button>
          </>
        )}

        {/* Step 3: New Password */}
        {step === 3 && (
          <>
            <label className="block text-gray-700 font-medium mb-1">New Password</label>
            <input
              type="password"
              placeholder="Enter new password"
              className="w-full border rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-[#ff4d2d33] focus:border-[#ff4d2d]"
              style={{ borderColor: theme.borderColor }}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <label className="block text-gray-700 font-medium mb-1">Confirm New Password</label>
            <input
              type="password"
              placeholder="Confirm new password"
              className="w-full border rounded-lg px-3 py-2 mb-4 focus:outline-none focus:ring-2 focus:ring-[#ff4d2d33] focus:border-[#ff4d2d]"
              style={{ borderColor: theme.borderColor }}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <button
              className="w-full font-semibold py-2 rounded-lg transition duration-200 shadow-md hover:shadow-lg"
              style={{ backgroundColor: theme.primaryColor, color: "white" }}
              onMouseOver={(e) => (e.currentTarget.style.backgroundColor = theme.hoverColor)}
              onMouseOut={(e) => (e.currentTarget.style.backgroundColor = theme.primaryColor)}
              onClick={handleResetPassword}
            >
              Reset Password
            </button>
          </>
        )}

        {/* Back to Login */}
        <p className="mt-6 text-center text-gray-600">
          Remember your password?{" "}
          <Link to="/signin" className="font-semibold" style={{ color: theme.primaryColor }}>
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}

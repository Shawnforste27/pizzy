import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { Link } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import { signInWithPopup } from "firebase/auth";
import { auth, provider } from "../../utils/firebase";
import { useDispatch } from "react-redux";
import { setUserData } from "../redux/userSlice";

export default function SignIn() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // 🍕 Pizza Striker Theme
  const primaryColor = "#347928"; // deep green
  const hoverColor = "#556B2F"; // olive green
  const bgColor = "#F4E7E1"; // warm beige
  const borderColor = "#347928"; // same as primary
  const textColor = "#333"; // dark gray

  const dispatch = useDispatch();

  const handleSignIn = async () => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signin`,
        { email, password },
        { withCredentials: true }
      );
      dispatch(setUserData(result.data));
    } catch (error) {
      console.log(error);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      if (result) {
        const { data } = await axios.post(
          `${serverUrl}/api/auth/googleauth`,
          { email: result.user.email },
          { withCredentials: true }
        );
        dispatch(setUserData(data));
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: bgColor }}
    >
      <div
        className="bg-white rounded-xl shadow-lg w-full max-w-md p-8"
        style={{ border: `1px solid ${borderColor}` }}
      >
        {/* Brand Heading */}
        <h1 className="text-3xl font-bold mb-2" style={{ color: primaryColor }}>
          Pizza Striker
        </h1>
        <p className="text-gray-700 mb-8" style={{ color: textColor }}>
          Welcome back! Please sign in to continue enjoying delicious pizzas.
        </p>

        {/* Email */}
        <div className="mb-4">
          <label className="block font-medium mb-1" style={{ color: textColor }}>Email</label>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none"
            style={{ borderColor: borderColor, color: textColor }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password */}
        <div className="mb-2">
          <label className="block font-medium mb-1" style={{ color: textColor }}>
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="w-full border rounded-lg px-3 py-2 pr-10 focus:outline-none"
              style={{ borderColor: borderColor, color: textColor }}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-2.5 text-gray-500"
            >
              {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
            </button>
          </div>
        </div>

        {/* Forgot Password */}
        <div className="text-right mb-4">
          <Link
            to="/forgot-password"
            className="text-sm font-medium hover:underline"
            style={{ color: primaryColor }}
          >
            Forgot Password?
          </Link>
        </div>

        {/* Sign In Button */}
        <button
          className="w-full font-semibold py-2 rounded-lg transition duration-200"
          style={{ backgroundColor: primaryColor, color: "white" }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = hoverColor)}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = primaryColor)}
          onClick={handleSignIn}
        >
          Sign In
        </button>

        {/* Google Auth */}
        <button
          className="w-full mt-4 flex items-center justify-center gap-2 border rounded-lg px-4 py-2 transition duration-200"
          style={{ borderColor, color: textColor }}
          onClick={handleGoogleAuth}
        >
          <FcGoogle size={20} />
          <span className="font-medium">{`Sign in with Google`}</span>
        </button>

        {/* Sign Up Link */}
        <p className="mt-6 text-center" style={{ color: textColor }}>
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="font-semibold"
            style={{ color: primaryColor }}
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}

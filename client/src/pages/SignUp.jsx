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

export default function SignUp() {
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState("user");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");

  // 🍕 Pizza Striker Theme
  const primaryColor = "#347928"; // deep green
  const hoverColor = "#556B2F"; // olive green
  const bgColor = "#F4E7E1"; // warm beige
  const borderColor = "#347928";
  const textColor = "#333"; // dark gray

  const dispatch = useDispatch();

  const handleSignUp = async () => {
    try {
      const result = await axios.post(
        `${serverUrl}/api/auth/signup`,
        { fullName, email, mobile, password, role },
        { withCredentials: true }
      );
      dispatch(setUserData(result.data));
    } catch (error) {
      console.log(error);
    }
  };

  const handleGoogleAuth = async () => {
    try {
      let mobileNumber = mobile;
      if (!mobileNumber) {
        mobileNumber = prompt("Please enter your mobile number:");
        setMobile(mobileNumber);
      }
      const result = await signInWithPopup(auth, provider);
      if (result) {
        const { data } = await axios.post(
          `${serverUrl}/api/auth/googleauth`,
          {
            fullName: result.user.displayName,
            email: result.user.email,
            mobile: mobileNumber,
            role,
          },
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
        <h1 className="text-3xl font-bold mb-2" style={{ color: primaryColor }}>
          Pizza Striker
        </h1>
        <p className="text-gray-700 mb-8" style={{ color: textColor }}>
          Create your account to get started with delicious pizzas
        </p>

        {/* Full Name */}
        <div className="mb-4">
          <label className="block font-medium mb-1" style={{ color: textColor }}>
            Full Name
          </label>
          <input
            type="text"
            placeholder="Enter your full name"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none"
            style={{ borderColor, color: textColor }}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block font-medium mb-1" style={{ color: textColor }}>
            Email
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none"
            style={{ borderColor, color: textColor }}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Mobile */}
        <div className="mb-4">
          <label className="block font-medium mb-1" style={{ color: textColor }}>
            Mobile Number
          </label>
          <input
            type="tel"
            placeholder="Enter your mobile number"
            className="w-full border rounded-lg px-3 py-2 focus:outline-none"
            style={{ borderColor, color: textColor }}
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block font-medium mb-1" style={{ color: textColor }}>
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              className="w-full border rounded-lg px-3 py-2 pr-10 focus:outline-none"
              style={{ borderColor, color: textColor }}
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

        {/* Role */}
        <div className="mb-4">
          <label className="block font-medium mb-1" style={{ color: textColor }}>
            Role
          </label>
          <div className="flex gap-2">
            {["user", "owner", "deliveryBoy"].map((r) => (
              <button
                key={r}
                type="button"
                onClick={() => setRole(r)}
                className="flex-1 rounded-lg px-3 py-2 font-medium transition-colors duration-200"
                style={
                  role === r
                    ? { backgroundColor: primaryColor, color: "white" }
                    : { border: `1px solid ${borderColor}`, color: textColor }
                }
              >
                {r}
              </button>
            ))}
          </div>
        </div>

        {/* Sign Up Button */}
        <button
          className="w-full font-semibold py-2 rounded-lg transition duration-200"
          style={{ backgroundColor: primaryColor, color: "white" }}
          onMouseOver={(e) => (e.currentTarget.style.backgroundColor = hoverColor)}
          onMouseOut={(e) => (e.currentTarget.style.backgroundColor = primaryColor)}
          onClick={handleSignUp}
        >
          Sign Up
        </button>

        {/* Google Auth */}
        <button
          className="w-full mt-4 flex items-center justify-center gap-2 border rounded-lg px-4 py-2 transition duration-200"
          style={{ borderColor, color: textColor }}
          onClick={handleGoogleAuth}
        >
          <FcGoogle size={20} />
          <span className="font-medium">Sign up with Google</span>
        </button>

        {/* Already have account */}
        <p className="mt-6 text-center" style={{ color: textColor }}>
          Already have an account?{" "}
          <Link to="/signin" className="font-semibold" style={{ color: primaryColor }}>
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

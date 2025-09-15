import React from "react";
import { useNavigate } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";

export default function OrderPlaced() {
  const navigate = useNavigate();

  const theme = {
    primary: "#ff4d2d",
    primaryHover: "#e64526",
    bg: "#fff9f6",
    success: "#22c55e",
    textPrimary: "text-gray-800",
    textSecondary: "text-gray-600",
  };

  return (
    <div
      className={`min-h-screen ${theme.bg} flex flex-col justify-center items-center px-4 text-center relative overflow-hidden`}
    >
      <FaCheckCircle className={`text-[${theme.success}] text-6xl mb-4`} />
      <h1 className={`text-3xl font-bold ${theme.textPrimary} mb-2`}>
        Order Placed!
      </h1>
      <p className={`max-w-md ${theme.textSecondary} mb-6`}>
        Thank you for your purchase. Your order is being prepared.
        You can track your order status in the "My Orders" section.
      </p>
      <button
        onClick={() => navigate("/my-orders")}
        className={`bg-[${theme.primary}] hover:bg-[${theme.primaryHover}] text-white px-6 py-3 rounded-lg text-lg font-medium transition`}
      >
        Back to My Orders
      </button>
    </div>
  );
}

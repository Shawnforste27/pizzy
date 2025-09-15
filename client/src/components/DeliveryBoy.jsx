import React, { useEffect, useState } from "react";
import axios from "axios";
import { MdLocationOn, MdOutlineCheckCircle } from "react-icons/md";
import { useSelector } from "react-redux";
import Nav from "./Nav";
import { serverUrl } from "../App";
import DeliveryBoyTracking from "../pages/DeliveryBoyTracking";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const PRIMARY = "#347928";      // Deep green
const SECONDARY = "#556B2F";    // Olive green
const CARD_BG = "#F4E7E1";      // Warm beige
const PAGE_BG = "#FAF7F3";      // Light cream

export default function DeliveryBoy() {
  const [location, setLocation] = useState({ lat: null, lng: null });
  const [assignments, setAssignments] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [todayStats, setTodayStats] = useState([]);
  const { userData } = useSelector((state) => state.user);
  const [showOtpBox, setShowOtpBox] = useState(false);
  const [otp, setOtp] = useState("");

  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        async (pos) => {
          const newLoc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setLocation(newLoc);

          try {
            await axios.post(
              `${serverUrl}/api/order/update-location`,
              {
                latitude: newLoc.lat,
                longitude: newLoc.lng,
                orderId: currentOrder?._id,
                shopOrderId: currentOrder?.shopOrder?._id,
              },
              { withCredentials: true }
            );
          } catch (err) {
            console.error("Location update failed", err);
          }
        },
        (err) => console.error(err),
        { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    }
  }, [currentOrder]);

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/order/getassignments`, {
          withCredentials: true,
        });
        if (res.data.success) setAssignments(res.data.assignments);
      } catch (err) {
        console.error(err);
      }
    };

    fetchAssignments();
    const interval = setInterval(fetchAssignments, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchCurrent = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/order/current-order`, {
          withCredentials: true,
        });
        if (res.data.success) setCurrentOrder(res.data.order);
      } catch (err) {
        console.error(err);
      }
    };

    fetchCurrent();
    const interval = setInterval(fetchCurrent, 2000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/order/stats/today`, {
          withCredentials: true,
        });
        if (res.data.success) setTodayStats(res.data.stats);
      } catch (err) {
        console.error("Failed to fetch today stats", err);
      }
    };

    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  const acceptOrder = async (id) => {
    try {
      const res = await axios.get(
        `${serverUrl}/api/order/accept-assignment/${id}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        setAssignments(assignments.filter((a) => a.assignmentId !== id));
        setCurrentOrder(res.data.order);
        alert("Order accepted successfully!");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const sendOtp = async () => {
    try {
      const res = await axios.post(
        `${serverUrl}/api/order/send-otp`,
        {
          orderId: currentOrder._id,
          shopOrderId: currentOrder.shopOrder._id,
        },
        { withCredentials: true }
      );

      if (res.data.success) {
        setShowOtpBox(true);
        alert(res.data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Failed to send OTP");
    }
  };

  const verifyOtp = async () => {
    try {
      const res = await axios.post(
        `${serverUrl}/api/order/verify-otp`,
        {
          orderId: currentOrder._id,
          shopOrderId: currentOrder.shopOrder._id,
          otp,
        },
        { withCredentials: true }
      );

      if (res.data.success) {
        alert("Order delivered successfully!");
        setCurrentOrder(null);
        setShowOtpBox(false);
        setOtp("");
      } else {
        alert(res.data.message || "Invalid OTP");
      }
    } catch (err) {
      console.error(err);
      alert("OTP verification failed");
    }
  };

  return (
    <div className={`w-screen min-h-screen flex flex-col items-center pb-10 overflow-y-auto`} style={{ backgroundColor: PAGE_BG }}>
      <Nav />

      <div className="w-full max-w-[800px] flex flex-col gap-5 items-center">
        {/* Header */}
        <div className="rounded-2xl shadow-md p-5 flex justify-between items-center w-[90%]" style={{ backgroundColor: CARD_BG, border: `1px solid ${SECONDARY}` }}>
          <div>
            <h1 className="text-xl font-bold" style={{ color: PRIMARY }}>
              Welcome, {userData.fullName}
            </h1>
            {location.lat && (
              <p className="text-gray-700 text-sm flex items-center gap-1">
                <MdLocationOn size={16} color={PRIMARY} />
                Live Location: {location.lat.toFixed(4)}, {location.lng.toFixed(4)}
              </p>
            )}
          </div>
        </div>

        {/* Today's Delivery Chart */}
        <div className="rounded-2xl shadow-md p-5 w-[90%]" style={{ backgroundColor: CARD_BG, border: `1px solid ${SECONDARY}` }}>
          <h2 className="text-lg font-bold mb-3" style={{ color: PRIMARY }}>
            📊 Today's Deliveries
          </h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={todayStats}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hour" tickFormatter={(h) => `${h}:00`} />
              <YAxis allowDecimals={false} />
              <Tooltip formatter={(value) => [value, "Orders"]} labelFormatter={(label) => `${label}:00`} />
              <Bar dataKey="count" fill={PRIMARY} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Current Order */}
        {currentOrder && !currentOrder.shopOrder.deliveredAt && (
          <div className="rounded-2xl p-5 shadow-md w-[90%]" style={{ backgroundColor: CARD_BG, border: `1px solid ${SECONDARY}` }}>
            <h2 className="text-lg font-bold mb-3">🚴 Current Order</h2>
            <div className="border rounded-lg p-4 mb-3" style={{ borderColor: SECONDARY }}>
              <p className="font-semibold text-sm">{currentOrder.shopOrder.shop?.name || "Shop"}</p>
              <p className="text-sm text-gray-700">{currentOrder.address?.text}</p>
              <p className="text-xs text-gray-500">{currentOrder.shopOrder.items.length} items | ₹{currentOrder.shopOrder.subtotal}</p>
            </div>

            <DeliveryBoyTracking currentOrder={currentOrder} />

            {!showOtpBox ? (
              <button
                className="mt-4 w-full text-white font-semibold py-2 px-4 rounded-xl shadow-md transition-all duration-200"
                style={{ backgroundColor: PRIMARY }}
                onClick={sendOtp}
              >
                ✅ Mark As Delivered
              </button>
            ) : (
              <div className="mt-4 p-4 rounded-xl" style={{ backgroundColor: "#FFF" }}>
                <p className="text-sm font-semibold mb-2">
                  Enter OTP sent to <span style={{ color: PRIMARY }}>{currentOrder.user?.fullName}</span>
                </p>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  className="w-full border px-3 py-2 rounded-lg mb-3 focus:outline-none focus:ring-2"
                  style={{ borderColor: SECONDARY }}
                />
                <button
                  className="w-full text-white py-2 rounded-lg font-semibold transition-all"
                  style={{ backgroundColor: PRIMARY }}
                  onClick={verifyOtp}
                >
                  Submit OTP
                </button>
              </div>
            )}
          </div>
        )}

        {/* Available Orders */}
        {!currentOrder && (
          <div className="rounded-2xl p-5 shadow-md w-[90%]" style={{ backgroundColor: CARD_BG, border: `1px solid ${SECONDARY}` }}>
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
              <MdOutlineCheckCircle color={PRIMARY} /> Available Orders Nearby
            </h2>
            <div className="space-y-3">
              {assignments.length > 0 ? (
                assignments.map((order) => (
                  <div
                    key={order.assignmentId}
                    className="border rounded-lg p-4 flex justify-between items-center"
                    style={{ borderColor: SECONDARY }}
                  >
                    <div>
                      <p className="text-sm font-semibold">{order.shopName}</p>
                      <p className="text-sm text-gray-700">{order.address?.street}</p>
                      <p className="text-xs text-gray-500">{order.items.length} items | ₹{order.subtotal}</p>
                    </div>
                    <button
                      className="px-4 py-1 rounded-lg text-sm text-white transition-all"
                      style={{ backgroundColor: PRIMARY }}
                      onClick={() => acceptOrder(order.assignmentId)}
                    >
                      Accept
                    </button>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-sm">No new assignments</p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

import React, { useEffect, useState } from "react";
import axios from "axios";
import { serverUrl } from "../App";
import { MdKeyboardBackspace } from "react-icons/md";
import { useNavigate } from "react-router-dom";

export default function MyDeliveredOrders() {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  // Theme
  const theme = {
    primaryColor: "#ff4d2d",
    deliveredBadgeBg: "#dcfce7",
    deliveredBadgeText: "#16a34a",
    cardShadow: "0 4px 6px rgba(0,0,0,0.1)",
    cardHoverShadow: "0 8px 16px rgba(0,0,0,0.15)",
  };

  useEffect(() => {
    const fetchDeliveredOrders = async () => {
      try {
        const res = await axios.get(
          `${serverUrl}/api/order/my-delivered-orders`,
          { withCredentials: true }
        );
        if (res.data.success) {
          setOrders(res.data.orders);
        }
      } catch (err) {
        console.error("Error fetching delivered orders:", err);
      }
    };
    fetchDeliveredOrders();
  }, []);

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[70vh] text-gray-500">
        <img
          src="https://cdn-icons-png.flaticon.com/512/2038/2038854.png"
          alt="No orders"
          className="w-28 mb-4 opacity-70"
        />
        <p className="text-lg font-medium">No delivered orders yet.</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
        <div onClick={() => navigate("/")} className="cursor-pointer mr-3">
          <MdKeyboardBackspace className="w-[25px] h-[25px]" style={{ color: theme.primaryColor }} />
        </div>
        <span className="mr-2">📦</span>
        <span style={{ color: theme.primaryColor }}>My Delivered Orders</span>
      </h2>

      <div className="grid gap-6">
        {orders.map((order) => (
          <div
            key={order._id}
            className="bg-white rounded-2xl border p-5 transition-transform duration-200"
            style={{ boxShadow: theme.cardShadow }}
            onMouseEnter={(e) => (e.currentTarget.style.boxShadow = theme.cardHoverShadow)}
            onMouseLeave={(e) => (e.currentTarget.style.boxShadow = theme.cardShadow)}
          >
            <div className="flex justify-between items-center border-b pb-3 mb-3">
              <p className="text-sm text-gray-500">
                Order ID: <span className="font-mono">{order._id}</span>
              </p>
              <span
                className="text-xs px-3 py-1 rounded-full font-medium"
                style={{
                  backgroundColor: theme.deliveredBadgeBg,
                  color: theme.deliveredBadgeText,
                }}
              >
                Delivered
              </span>
            </div>

            {order.shopOrders
              .filter((so) => so.status === "delivered")
              .map((so) => (
                <div key={so._id} className="bg-gray-50 rounded-xl p-4 mb-3 border">
                  <p className="font-semibold text-lg" style={{ color: theme.primaryColor }}>
                    🏪 {so.shop?.name}
                  </p>
                  <ul className="mt-2 space-y-1 text-sm text-gray-600">
                    {so.items.map((it) => (
                      <li
                        key={it._id}
                        className="flex justify-between border-b last:border-0 pb-1"
                      >
                        <span>
                          {it.name} × {it.quantity}
                        </span>
                        <span className="font-semibold" style={{ color: theme.primaryColor }}>
                          ₹{it.price}
                        </span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex justify-between items-center mt-3 text-sm">
                    <span className="text-gray-500">Total Items: {so.items.length}</span>
                    <span className="font-bold text-lg" style={{ color: theme.primaryColor }}>
                      Subtotal: ₹{so.subtotal}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}

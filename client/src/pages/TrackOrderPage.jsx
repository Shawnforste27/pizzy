import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { serverUrl } from "../App";
import UserDeliveryTracking from "../components/userDeliveryTracking";
import { MdKeyboardBackspace } from "react-icons/md";

const PRIMARY = "#347928"; // deep green
const BG_COLOR = "#F4E7E1"; // warm beige
const BORDER_COLOR = "#347928";
const TEXT_COLOR = "#333";

export default function TrackOrderPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const navigate = useNavigate();

  const fetchOrder = async () => {
    try {
      const res = await axios.get(`${serverUrl}/api/order/${orderId}`, { withCredentials: true });
      if (res.data.success) setOrder(res.data.order);
    } catch (err) {
      console.error("Error fetching order:", err);
    }
  };

  useEffect(() => {
    fetchOrder();
    const interval = setInterval(fetchOrder, 5000);
    return () => clearInterval(interval);
  }, []);

  if (!order) return <p className="text-center mt-10" style={{ color: TEXT_COLOR }}>Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-4 flex flex-col gap-6" style={{ backgroundColor: BG_COLOR }}>
      <div className="flex gap-5 items-center mb-6 md:justify-center">
        <div onClick={() => navigate("/")} className="cursor-pointer">
          <MdKeyboardBackspace className="w-6 h-6" style={{ color: PRIMARY }} />
        </div>
        <h1 className="text-2xl font-bold md:text-center" style={{ color: PRIMARY }}>Track Order</h1>
      </div>

      {order.shopOrders.map((shopOrder) => (
        <div
          key={shopOrder._id}
          className="bg-white p-4 rounded-2xl shadow-md border space-y-4"
          style={{ borderColor: BORDER_COLOR }}
        >
          {/* Shop & Order Info */}
          <div>
            <h2 className="text-lg font-bold mb-2" style={{ color: PRIMARY }}>
              {shopOrder.shop?.name || "Shop"}
            </h2>
            <p style={{ color: TEXT_COLOR }}>
              <span className="font-semibold">Items:</span>{" "}
              {shopOrder.items.map((i) => i.name).join(", ")}
            </p>
            <p style={{ color: TEXT_COLOR }}>
              <span className="font-semibold">Subtotal:</span> ₹{shopOrder.subtotal}
            </p>
            <p className="mt-2" style={{ color: TEXT_COLOR }}>
              <span className="font-semibold">Customer Address:</span>{" "}
              {order.address.text}
            </p>
          </div>

          {/* Delivery Info */}
          {shopOrder.status === "delivered" ? (
            <p className="font-semibold text-lg" style={{ color: "#2E7D32" }}>Delivered ✅</p>
          ) : (
            <>
              {/* Delivery Boy Info */}
              <div>
                <h2 className="text-lg font-bold mb-2" style={{ color: PRIMARY }}>Delivery Boy</h2>
                {shopOrder.assignedDeliveryBoy ? (
                  <div style={{ color: TEXT_COLOR, fontSize: "0.875rem" }}>
                    <p>
                      <span className="font-semibold">Name:</span>{" "}
                      {shopOrder.assignedDeliveryBoy.fullName}
                    </p>
                    <p>
                      <span className="font-semibold">Phone:</span>{" "}
                      {shopOrder.assignedDeliveryBoy.mobile}
                    </p>
                  </div>
                ) : (
                  <p className="italic" style={{ color: "#555" }}>Delivery boy not assigned yet</p>
                )}
              </div>

              {/* Tracking Map */}
              {shopOrder.assignedDeliveryBoy && (
                <div className="h-[400px] w-full rounded-2xl overflow-hidden shadow-md">
                  <UserDeliveryTracking
                    orderId={order._id}
                    shopOrderId={shopOrder._id}
                    userLocation={{
                      lat: order.address.latitude,
                      lng: order.address.longitude,
                    }}
                  />
                </div>
              )}
            </>
          )}
        </div>
      ))}
    </div>
  );
}

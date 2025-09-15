import React from "react";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { serverUrl } from "../App";
import { MdKeyboardBackspace } from "react-icons/md";
import {
  MdLocationOn,
  MdPhone,
  MdOutlineShoppingBag,
} from "react-icons/md";
import {
  setOwnerPendingOrders,
  setDeliveryBoys,
} from "../redux/userSlice";
import { useEffect } from "react";
import getOwnerPendingOrders from "../hooks/getOwnerPendingOrders";
import { useNavigate } from "react-router-dom";

const PRIMARY = "#347928";
const STATUS_OPTIONS = ["pending", "preparing", "out of delivery"];
const BG_COLOR = "#fff9f6";
const BORDER_COLOR = "#ddd";

export default function PendingOrders() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { ownerPendingOrders, deliveryBoys, socket } = useSelector(
    (state) => state.user
  );

  const updateLocalShopOrder = (orderId, shopId, updatedShopOrder) => {
    if (!ownerPendingOrders) return;
    const updated = ownerPendingOrders.map((order) => {
      if (order._id === orderId && order.shopOrder?.shop?._id === shopId) {
        return {
          ...order,
          shopOrder: updatedShopOrder,
        };
      }
      return order;
    });
    dispatch(setOwnerPendingOrders(updated));
  };

  const updateStatus = async (orderId, shopId, status) => {
    try {
      const res = await axios.post(
        `${serverUrl}/api/order/update-order-status/${orderId}/${shopId}`,
        { status },
        { withCredentials: true }
      );

      if (!res?.data?.success) return;

      if (res.data.shopOrder) {
        updateLocalShopOrder(orderId, shopId, res.data.shopOrder);
      }

      if (res.data.deliveryBoys) {
        dispatch(setDeliveryBoys(res.data.deliveryBoys));
      }
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Failed to update status. Check server logs.");
    }
  };

  if (!ownerPendingOrders || ownerPendingOrders.length === 0) {
    return (
      <div
        className="min-h-[60vh] flex items-center justify-center text-center"
        style={{ backgroundColor: BG_COLOR }}
      >
        <div>
          <div
            className="mx-auto mb-4 h-16 w-16 flex items-center justify-center rounded-full"
            style={{
              backgroundColor: "rgba(255,77,45,0.08)",
              color: PRIMARY,
            }}
          >
            <MdOutlineShoppingBag size={26} />
          </div>
          <h2 className="text-lg font-semibold text-gray-800">No Pending Orders</h2>
          <p className="text-gray-500 text-sm">You're all caught up for now.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-4" style={{ backgroundColor: BG_COLOR }}>
      <div className="flex gap-[20px] items-center mb-6 md:justify-center">
        <div onClick={() => navigate("/")} className="cursor-pointer">
          <MdKeyboardBackspace className="w-[25px] h-[25px]" style={{ color: PRIMARY }} />
        </div>
        <h1 className="text-2xl font-bold md:text-center" style={{ color: PRIMARY }}>My Orders</h1>
      </div>

      <div className="flex flex-col items-center gap-6">
        {ownerPendingOrders?.map((order) => {
          const orderId = order._id;
          const shopId = order.shopOrder?.shop?._id;

          return (
            <div
              key={orderId}
              className="w-full max-w-[800px] bg-white rounded-2xl border shadow-sm hover:shadow-md transition-all p-5 flex flex-col gap-4"
              style={{ borderColor: BORDER_COLOR }}
            >
              <div>
                <h2 className="text-lg font-semibold text-gray-800">
                  {order.user?.fullName || order.user?.name || "Customer"}
                </h2>
                <p className="text-sm text-gray-500">{order.user?.email}</p>
                <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
                  <MdPhone size={14} /> {order?.user?.mobile || "N/A"}
                </div>
              </div>

              {order.address && (
                <div className="flex items-start gap-2 text-gray-600 text-sm">
                  <MdLocationOn size={16} className="mt-[2px]" />
                  <div>
                    {order.address?.text}
                    {order.address?.latitude && order.address?.longitude && (
                      <p className="text-xs text-gray-500">
                        Lat: {order.address.latitude}, Lng: {order.address.longitude}
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div>
                <p className="text-sm font-medium mb-2">Items:</p>
                <div className="space-y-2">
                  {order.shopOrder?.items?.map((item) => (
                    <div
                      key={item.item?._id || item.name}
                      className="flex justify-between text-sm text-gray-700"
                    >
                      <div>
                        <span className="font-medium">{item.name}</span>
                        <span className="text-xs text-gray-500"> × {item.quantity}</span>
                      </div>
                      <div>₹{item.quantity * item.price}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center mt-auto pt-3 border-t border-gray-100">
                <span className="text-sm">
                  Status:{" "}
                  <span className="font-semibold capitalize" style={{ color: PRIMARY }}>
                    {order.shopOrder?.status}
                  </span>
                </span>

                {order.shopOrder?.status !== "delivered" && (
                  <select
                    className="rounded-md border px-3 py-1 text-sm focus:outline-none focus:ring-2"
                    style={{ borderColor: PRIMARY, color: PRIMARY }}
                    onChange={(e) => updateStatus(orderId, shopId, e.target.value)}
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Change
                    </option>
                    {STATUS_OPTIONS.map((st) => (
                      <option key={st} value={st} className="text-gray-700">
                        {st}
                      </option>
                    ))}
                  </select>
                )}
              </div>

              {order.shopOrder?.status === "out of delivery" && (
                <div className="mt-3 p-2 border rounded-lg text-sm bg-orange-50">
                  {order.shopOrder?.assignedDeliveryBoy ? (
                    <p className="font-medium text-gray-700">
                      Assigned To:{" "}
                      {order.shopOrder.assignedDeliveryBoy.fullName ||
                        order.shopOrder.assignedDeliveryBoy.name}{" "}
                      ({order.shopOrder.assignedDeliveryBoy.mobile})
                    </p>
                  ) : (
                    <>
                      <p className="font-medium text-gray-700 mb-2">
                        Available Delivery Boys:
                      </p>
                      {deliveryBoys?.length > 0 ? (
                        <ul className="list-disc list-inside text-gray-600">
                          {deliveryBoys.map((boy) => (
                            <li key={boy._id || boy.id}>
                              {boy.fullName || boy.name} ({boy.mobile})
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-500 italic">
                          Waiting for delivery boy to accept...
                        </p>
                      )}
                    </>
                  )}
                </div>
              )}

              <div className="text-right font-bold text-gray-800 text-sm">
                Total: ₹{order.shopOrder?.subtotal}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaMinus, FaPlus, FaTrash } from "react-icons/fa";
import { updateQuantity, removeFromCart } from "../redux/userSlice";
import { MdKeyboardBackspace } from "react-icons/md";
import { useNavigate } from "react-router-dom";

const PRIMARY = "#347928";
const SECONDARY = "#556B2F";
const CARD_BG = "#F4E7E1";
const PAGE_BG = "#FAF7F3";

function CartPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { cartItems, totalAmount } = useSelector((state) => state.user);

  const handleIncrease = (id, currentQty) => {
    dispatch(updateQuantity({ id, quantity: currentQty + 1 }));
  };

  const handleDecrease = (id, currentQty) => {
    if (currentQty > 1) {
      dispatch(updateQuantity({ id, quantity: currentQty - 1 }));
    }
  };

  const handleRemove = (id) => {
    dispatch(removeFromCart(id));
  };

  return (
    <div className="min-h-screen flex justify-center p-6" style={{ backgroundColor: PAGE_BG }}>
      <div className="w-full max-w-[800px]">
        {/* Header */}
        <div className="flex items-center gap-[20px] mb-6">
          <div onClick={() => navigate("/")}>
            <MdKeyboardBackspace className="w-[25px] h-[25px]" style={{ color: PRIMARY }} />
          </div>
          <h1 className="text-2xl font-bold text-start" style={{ color: SECONDARY }}>
            Your Cart
          </h1>
        </div>

        {/* Empty cart */}
        {cartItems.length === 0 ? (
          <p className="text-gray-500 text-lg text-center">Your cart is empty.</p>
        ) : (
          <>
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between p-4 rounded-xl shadow border"
                  style={{ backgroundColor: CARD_BG, borderColor: `${SECONDARY}33` }}
                >
                  {/* Left: Image & Info */}
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-20 h-20 object-cover rounded-lg border"
                      style={{ borderColor: `${SECONDARY}33` }}
                    />
                    <div>
                      <h3 className="font-medium" style={{ color: SECONDARY }}>{item.name}</h3>
                      <p className="text-sm text-gray-500">
                        ₹{item.price} × {item.quantity}
                      </p>
                      <p className="font-bold text-gray-900">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>

                  {/* Right: Qty & Remove */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleDecrease(item.id, item.quantity)}
                      className="p-2 rounded-full"
                      style={{ backgroundColor: `${SECONDARY}22` }}
                    >
                      <FaMinus size={12} />
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => handleIncrease(item.id, item.quantity)}
                      className="p-2 rounded-full"
                      style={{ backgroundColor: `${SECONDARY}22` }}
                    >
                      <FaPlus size={12} />
                    </button>
                    <button
                      onClick={() => handleRemove(item.id)}
                      className="p-2 rounded-full"
                      style={{ backgroundColor: `${PRIMARY}22`, color: PRIMARY }}
                    >
                      <FaTrash size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div
              className="mt-6 p-4 rounded-xl shadow flex justify-between items-center border"
              style={{ backgroundColor: CARD_BG, borderColor: `${SECONDARY}33` }}
            >
              <h3 className="text-lg font-semibold" style={{ color: SECONDARY }}>Total Amount</h3>
              <span className="text-xl font-bold" style={{ color: PRIMARY }}>
                ₹{totalAmount.toFixed(2)}
              </span>
            </div>

            {/* Checkout button */}
            <div className="mt-4 flex justify-end">
              <button
                className="px-6 py-3 rounded-lg text-lg font-medium transition"
                style={{ backgroundColor: PRIMARY, color: "white" }}
                onClick={() => navigate("/checkout")}
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default CartPage;

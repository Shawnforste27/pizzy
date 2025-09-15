import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { serverUrl } from "../App";
import FoodCard from "../components/FoodCard";
import { FaMapMarkerAlt, FaUtensils, FaStoreAlt, FaArrowLeft } from "react-icons/fa";

const PRIMARY = "#347928"; // deep green
const HOVER_COLOR = "#556B2F"; // olive green
const BG_COLOR = "#F4E7E1"; // warm beige
const TEXT_COLOR = "#333";
const HERO_OVERLAY = "from-black/60 to-black/20";

function ShopItems() {
  const { shopId } = useParams();
  const [items, setItems] = useState([]);
  const [shop, setShop] = useState(null);
  const navigate = useNavigate();

  const handleGetShopItems = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/item/getitemsbyshop/${shopId}`,
        { withCredentials: true }
      );
      setItems(result.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  const handleGetShop = async () => {
    try {
      const result = await axios.get(
        `${serverUrl}/api/shop/getshopbyid/${shopId}`,
        { withCredentials: true }
      );
      setShop(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    handleGetShopItems();
    handleGetShop();
  }, [shopId]);

  return (
    <div className="min-h-screen" style={{ backgroundColor: BG_COLOR }}>
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 z-20 flex items-center gap-2 px-3 py-2 rounded-full shadow-md transition"
        style={{ backgroundColor: PRIMARY, color: "white" }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = HOVER_COLOR)}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = PRIMARY)}
      >
        <FaArrowLeft className="text-lg" />
        <span className="hidden md:inline">Back</span>
      </button>

      {/* Shop Hero Section */}
      {shop && (
        <div className="relative w-full h-64 md:h-80 lg:h-96">
          <img
            src={shop.image || "https://via.placeholder.com/1200x400"}
            alt={shop.name}
            className="w-full h-full object-cover"
          />
          <div
            className={`absolute inset-0 bg-gradient-to-b ${HERO_OVERLAY} flex flex-col justify-center items-center text-center px-4`}
          >
            <FaStoreAlt className="text-white text-4xl mb-3 drop-shadow-md" />
            <h1 className="text-3xl md:text-5xl font-extrabold text-white drop-shadow-lg">
              {shop.name}
            </h1>
            {shop.description && (
              <p className="text-gray-200 text-sm md:text-lg mt-3 max-w-2xl">
                {shop.description}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Shop Info */}
      {shop && (
        <div className="max-w-4xl mx-auto px-6 py-6 text-center">
          <div className="flex items-center justify-center gap-2" style={{ color: TEXT_COLOR }}>
            <FaMapMarkerAlt className="w-5 h-5" style={{ color: PRIMARY }} />
            <p className="text-lg font-medium">
              {shop.address || "Address not available"}
            </p>
          </div>
        </div>
      )}

      {/* Items Section */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <h2 className="flex items-center justify-center gap-3 text-3xl font-bold mb-10" style={{ color: TEXT_COLOR }}>
          <FaUtensils className="text-PRIMARY" style={{ color: PRIMARY }} />
          Our Menu
        </h2>

        {items.length > 0 ? (
          <div className="flex flex-wrap justify-center gap-8">
            {items.map((item, index) => (
              <div
                key={index}
                className="transform transition duration-300 hover:scale-105"
              >
                <FoodCard data={item} primaryColor={PRIMARY} />
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center" style={{ color: TEXT_COLOR, fontSize: "1.1rem" }}>
            No items available
          </p>
        )}
      </div>
    </div>
  );
}

export default ShopItems;

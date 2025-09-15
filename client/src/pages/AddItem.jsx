import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { MdKeyboardBackspace } from "react-icons/md";
import axios from "axios";
import { serverUrl } from "../App";
import { useDispatch } from "react-redux";
import { setShop } from "../redux/userSlice";

const PRIMARY = "#347928";   // deep green
const SECONDARY = "#556B2F"; // olive
const CARD_BG = "#F4E7E1";   // card background
const PAGE_BG = "#FAF7F3";   // page background

export default function AddItem() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [category, setCategory] = useState("");
  const [type, setType] = useState("veg");
  const [frontendImage, setFrontendImage] = useState(null);
  const [backendImage, setBackendImage] = useState(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const categories = [
    "Snacks", "Main Course", "Desserts", "Pizza", "Burgers", "Sandwiches",
    "South Indian", "North Indian", "Chinese", "Fast Food", "Others",
  ];

  const handleImage = (e) => {
    const file = e.target.files[0];
    setBackendImage(file);
    setFrontendImage(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("type", type);
      formData.append("category", category);
      formData.append("image", backendImage);

      const result = await axios.post(`${serverUrl}/api/item/additem`, formData, { withCredentials: true });
      dispatch(setShop(result.data.shop));
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-6" style={{ backgroundColor: PAGE_BG }}>
      <div className='absolute top-[20px] left-[20px] z-[10] mb-[10px]' onClick={() => navigate("/")}>
        <MdKeyboardBackspace className='w-[25px] h-[25px]' style={{ color: PRIMARY }} />
      </div>
      <form
        onSubmit={handleSubmit}
        className="shadow-lg rounded-xl p-8 max-w-lg w-full space-y-6"
        style={{ backgroundColor: CARD_BG, border: `1px solid ${SECONDARY}33` }}
      >
        <h2 className="text-2xl font-bold text-gray-800 text-center mb-4">
          Add New Food Item
        </h2>

        {/* Name */}
        <div>
          <label className="block font-medium mb-1" style={{ color: SECONDARY }}>Name</label>
          <input
            type="text"
            name="name"
            value={name}
            placeholder="Enter Food Name"
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full rounded-lg p-3 focus:outline-none"
            style={{ border: `1px solid ${SECONDARY}`, focusRing: `2px solid ${PRIMARY}` }}
          />
        </div>

        {/* Price */}
        <div>
          <label className="block font-medium mb-1" style={{ color: SECONDARY }}>Price</label>
          <input
            type="number"
            name="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            required
            min="0"
            className="w-full rounded-lg p-3 focus:outline-none"
            style={{ border: `1px solid ${SECONDARY}`, focusRing: `2px solid ${PRIMARY}` }}
          />
        </div>

        {/* Category */}
        <div>
          <label className="block font-medium mb-1" style={{ color: SECONDARY }}>Category</label>
          <select
            name="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            required
            className="w-full rounded-lg p-3 focus:outline-none"
            style={{ border: `1px solid ${SECONDARY}`, focusRing: `2px solid ${PRIMARY}` }}
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        {/* Image */}
        <div>
          <label className="block font-medium mb-1" style={{ color: SECONDARY }}>Image</label>
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleImage}
            className="w-full rounded-lg p-3 focus:outline-none"
            style={{ border: `1px solid ${SECONDARY}`, focusRing: `2px solid ${PRIMARY}` }}
          />
          {frontendImage && (
            <img
              src={frontendImage}
              alt="Preview"
              className="mt-3 w-full h-48 object-cover rounded-lg border border-gray-200"
            />
          )}
        </div>

        {/* Type */}
        <div>
          <label className="block font-medium mb-1" style={{ color: SECONDARY }}>Type</label>
          <select
            name="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
            className="w-full rounded-lg p-3 focus:outline-none"
            style={{ border: `1px solid ${SECONDARY}`, focusRing: `2px solid ${PRIMARY}` }}
          >
            <option value="veg">veg</option>
            <option value="non veg">non veg</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full flex items-center justify-center gap-2 rounded-full font-semibold shadow-md transition-colors"
          style={{ backgroundColor: PRIMARY, color: "white" }}
        >
          <FaPlus /> Add Item
        </button>
      </form>
    </div>
  );
}

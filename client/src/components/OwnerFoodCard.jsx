import axios from 'axios';
import React from 'react';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { serverUrl } from '../App';
import { useDispatch } from 'react-redux';
import { setShop } from '../redux/userSlice';

const PRIMARY = "#347928";   
const SECONDARY = "#556B2F"; 
const CARD_BG = "#F4E7E1";   

export default function OwnerFoodCard({ item }) {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleDelete = async () => {
    try {
      const result = await axios.get(`${serverUrl}/api/item/delete/${item._id}`, { withCredentials: true });
      dispatch(setShop(result.data.shop));
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="flex rounded-lg shadow-md overflow-hidden w-full max-w-2xl"
      style={{ backgroundColor: CARD_BG, border: `1px solid ${SECONDARY}` }}>
      <div className="w-36 h-full flex-shrink-0 bg-gray-50">
        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
      </div>
      <div className="flex flex-col justify-between p-3 flex-1">
        <div>
          <h3 className="text-base font-semibold" style={{ color: PRIMARY }}>{item.name}</h3>
          <p className="text-gray-600 text-sm mt-1 line-clamp-2">{item.description}</p>
          <div className="mt-2 text-xs text-gray-500 space-y-1">
            <p><span className="font-medium text-gray-700">Category:</span> {item.category || 'N/A'}</p>
            <p><span className="font-medium text-gray-700">Type:</span> {item.type || 'N/A'}</p>
            <p>
              <span className="font-medium text-gray-700">Availability:</span> {item.availability ? (
                <span className="font-semibold" style={{ color: PRIMARY }}>Available</span>
              ) : (
                <span className="font-semibold text-red-600">Not Available</span>
              )}
            </p>
          </div>
        </div>
        <div className="flex items-center justify-between mt-2">
          <span className="font-bold" style={{ color: PRIMARY }}>₹{item.price}</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(`/editItem/${item._id}`)}
              className="p-2 rounded-full hover:bg-[#347928]/10"
              style={{ color: PRIMARY }}
            >
              <FiEdit size={16} />
            </button>
            <button
              onClick={handleDelete}
              className="p-2 rounded-full hover:bg-[#347928]/10"
              style={{ color: PRIMARY }}
            >
              <FiTrash2 size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

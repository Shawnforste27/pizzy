import React from 'react';

function CategoryCard({ image, name, onClick }) {
  return (
    <div
      className="w-[120px] h-[120px] md:w-[180px] md:h-[180px] rounded-2xl border-2 border-[#347928] shrink-0 overflow-hidden bg-white shadow-xl shadow-gray-200 hover:shadow-lg transition-shadow cursor-pointer"
      onClick={() => onClick()}
    >
      <div className="relative w-full h-full">
        <img
          src={image}
          alt={name || 'Category'}
          className="absolute inset-0 w-full h-full object-cover transform hover:scale-110 transition-transform duration-300"
        />

        {/* small label box over image (bottom centered) */}
        <div className="absolute bottom-0 w-full left-0 bg-[#F4E7E1] px-3 py-1 rounded-t-xl text-center shadow text-sm font-medium text-gray-800 backdrop-blur">
          {name}
        </div>
      </div>
    </div>
  );
}

export default CategoryCard;

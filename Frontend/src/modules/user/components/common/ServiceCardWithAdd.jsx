import React, { memo } from 'react';
import { AiFillStar } from 'react-icons/ai';
import { themeColors } from '../../../../theme';

const ServiceCardWithAdd = memo(({ image, title, rating, reviews, price, onAddClick, onClick }) => {
  return (
    <div
      className="min-w-[200px] bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 active:scale-95 flex flex-col group"
      style={{
        boxShadow: themeColors.cardShadow,
        border: themeColors.cardBorder
      }}
      onClick={onClick}
    >
      {image ? (
        <div className="w-full h-40 overflow-hidden relative">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            decoding="async"
          />
        </div>
      ) : (
        <div className="w-full h-40 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
          <svg
            className="w-12 h-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      )}
      <div className="p-3 flex flex-col flex-1">
        <div className="flex items-start justify-between gap-2 mb-1.5 min-h-[40px]">
          <h3 className="text-[13px] font-bold text-gray-900 leading-snug line-clamp-2 pr-1 flex-1">
            {title}
          </h3>
          {rating && (
            <div className="flex items-center gap-0.5 shrink-0 bg-yellow-50/90 px-1.5 py-0.5 rounded-lg border border-yellow-100 shadow-sm mt-0.5">
              <AiFillStar className="w-3 h-3 text-yellow-500" />
              <span className="text-[10px] text-gray-950 font-black leading-none">{rating}</span>
            </div>
          )}
        </div>
        <div className="flex items-center justify-between">
          <span
            className="text-base font-bold text-black"
          >
            ₹{price}
          </span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddClick?.();
            }}
            className="text-xs font-semibold px-4 py-1.5 rounded-full active:scale-95 transition-all shadow-sm"
            style={{
              backgroundColor: themeColors.button,
              color: 'white',
              border: 'none',
              boxShadow: '0 2px 4px rgba(0, 166, 166, 0.3)'
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = themeColors.button;
              e.target.style.transform = 'scale(1.05)';
              e.target.style.boxShadow = '0 4px 8px rgba(0, 166, 166, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = themeColors.button;
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = '0 2px 4px rgba(0, 166, 166, 0.3)';
            }}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
});

ServiceCardWithAdd.displayName = 'ServiceCardWithAdd';

export default ServiceCardWithAdd;


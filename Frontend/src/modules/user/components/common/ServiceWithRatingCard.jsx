import React, { memo } from 'react';
import { AiFillStar } from 'react-icons/ai';
import { themeColors } from '../../../../theme';

const ServiceWithRatingCard = memo(({ image, title, rating, reviews, price, originalPrice, discount, onClick, onAddClick }) => {
  return (
    <div
      className="min-w-[180px] w-[180px] bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 active:scale-95 group flex flex-col"
      style={{
        boxShadow: themeColors.cardShadow,
        border: themeColors.cardBorder
      }}
      onClick={onClick}
    >
      <div className="relative">
        {discount && (
          <div
            className="absolute top-3 left-3 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-md z-10"
            style={{ backgroundColor: themeColors.button }}
          >
            {discount} OFF
          </div>
        )}
        {image ? (
          <img
            src={image}
            alt={title}
            className="w-full h-36 object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
            decoding="async"
          />
        ) : (
          <div className="w-full h-36 flex items-center justify-center bg-gray-50 border-b border-gray-100">
            <img
              src="/logo.jpeg"
              alt="Placeholder"
              className="w-12 h-12 object-contain opacity-40 grayscale"
            />
          </div>
        )}
      </div>
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
        <div className="flex items-center justify-between mt-auto pt-2">
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-[15px] font-bold text-gray-900">
                {price && !isNaN(price.toString().replace(/[,]/g, '')) ? `₹${price}` : (price || 'Contact for price')}
              </span>
              {originalPrice && (
                <span className="text-[11px] text-gray-400 line-through decoration-gray-400/60">₹{originalPrice}</span>
              )}
            </div>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onAddClick?.();
            }}
            className="px-5 py-1.5 h-8 rounded-lg text-xs font-bold transition-all active:scale-95 border"
            style={{
              backgroundColor: `${themeColors.brand.teal}0D`,
              color: themeColors.button,
              borderColor: `${themeColors.brand.teal}1A`
            }}
            onMouseEnter={(e) => {
              e.target.style.backgroundColor = themeColors.button;
              e.target.style.color = '#FFFFFF';
            }}
            onMouseLeave={(e) => {
              e.target.style.backgroundColor = `${themeColors.brand.teal}0D`;
              e.target.style.color = themeColors.button;
            }}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
});

ServiceWithRatingCard.displayName = 'ServiceWithRatingCard';

export default ServiceWithRatingCard;


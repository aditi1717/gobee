import React, { memo } from 'react';
import { themeColors } from '../../../../theme';
import { optimizeCloudinaryUrl } from '../../../../utils/cloudinaryOptimize';

const SimpleServiceCard = memo(({ image, title, onClick }) => {
  return (
    <div
      className="group min-w-[150px] sm:min-w-[160px] bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-[0_12px_30px_-5px_rgba(0,0,0,0.08)] hover:-translate-y-1 active:scale-95 border border-gray-100"
      style={{
        boxShadow: '0 4px 20px -4px rgba(0,0,0,0.05)',
      }}
      onClick={onClick}
    >
      {image ? (
        <div className="w-full h-28 overflow-hidden relative">
          <img
            src={optimizeCloudinaryUrl(image, { width: 320, quality: 'auto' })}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            loading="lazy"
            decoding="async"
          />
        </div>
      ) : (
        <div className="w-full h-28 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center">
          <svg
            className="w-10 h-10 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      )}
      <div className="p-3">
        <h3 className="text-xs font-bold text-slate-800 leading-snug group-hover:text-black transition-colors line-clamp-2">
          {title}
        </h3>
      </div>
    </div>
  );
});

SimpleServiceCard.displayName = 'SimpleServiceCard';

export default SimpleServiceCard;


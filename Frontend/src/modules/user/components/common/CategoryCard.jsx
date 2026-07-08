import React, { useState, useRef, memo, useEffect } from 'react';
import { gsap } from 'gsap';
import { createRipple } from '../../../../utils/gsapAnimations';

import { themeColors } from '../../../../theme';

const CategoryCard = memo(({ icon, title, onClick, hasSaleBadge = false, index = 0 }) => {
  const cardRef = useRef(null);

  // Simple entrance animation
  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(
        cardRef.current,
        { y: 15, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.4,
          delay: index * 0.05,
          ease: 'power2.out',
        }
      );
    }
  }, [index]);

  return (
    <div
      ref={cardRef}
      className="flex flex-col items-center justify-center p-0.5 cursor-pointer relative category-card-container group transition-transform duration-300 ease-out active:scale-95 w-full"
      onClick={onClick}
      style={{
        opacity: 0, // Start hidden for GSAP
      }}
    >
      <div className="relative flex items-center justify-center mb-1.5 transition-all duration-300 group-hover:-translate-y-1 flex-shrink-0">
        {icon}
        {hasSaleBadge && (
          <div
            className="absolute -top-2 -right-2 text-white text-[8px] font-black px-1.5 py-0.5 rounded-full shadow-md z-10 border border-white"
            style={{
              background: themeColors.gradient,
              boxShadow: `0 3px 8px ${themeColors.brand.teal}3D`
            }}
          >
            SALE
          </div>
        )}
      </div>
      <span
        className="text-[11px] text-center text-slate-700 font-semibold leading-tight tracking-tight mt-0.5 transition-colors duration-300 w-full line-clamp-2 px-1"
        style={{
          wordWrap: 'break-word',
          color: 'inherit'
        }}
        onMouseEnter={(e) => e.currentTarget.style.color = themeColors.brand?.teal || '#347989'}
        onMouseLeave={(e) => e.currentTarget.style.color = 'inherit'}
      >
        {title}
      </span>
    </div>
  );
});

CategoryCard.displayName = 'CategoryCard';

export default CategoryCard;


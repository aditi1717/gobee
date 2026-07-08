import React, { useState, useRef } from 'react';
import homepageBanner from '../../../../../assets/images/pages/Home/Banner/homepage-banner.png';
import { optimizeCloudinaryUrl } from '../../../../../utils/cloudinaryOptimize';
import { themeColors } from '../../../../../theme';

const Banner = React.memo(({ imageUrl, banners, onClick, onBannerClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef(null);

  // If a list of banners is passed, we show them as a swipeable carousel
  if (Array.isArray(banners) && banners.length > 0) {
    const handleScroll = () => {
      if (scrollContainerRef.current) {
        const container = scrollContainerRef.current;
        const scrollLeft = container.scrollLeft;
        const width = container.offsetWidth;
        const index = Math.round(scrollLeft / width);
        if (index !== currentIndex && index >= 0 && index < banners.length) {
          setCurrentIndex(index);
        }
      }
    };

    return (
      <div className="my-5 w-full relative">
        <div
          ref={scrollContainerRef}
          onScroll={handleScroll}
          className="flex gap-4 overflow-x-auto px-3 pb-3 scrollbar-hide snap-x snap-mandatory"
          style={{ scrollBehavior: 'smooth', scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {banners.map((banner, index) => {
            const url = banner.imageUrl || banner.image;
            const optimizedUrl = url ? optimizeCloudinaryUrl(url, { quality: 'auto' }) : homepageBanner;
            return (
              <div
                key={banner.id || banner._id || index}
                className="flex-shrink-0 w-[calc(100vw-24px)] max-w-lg lg:max-w-2xl snap-center cursor-pointer group"
                onClick={() => {
                  if (onBannerClick) {
                    onBannerClick(banner);
                  } else if (onClick) {
                    onClick();
                  }
                }}
              >
                <div
                  className="relative overflow-hidden rounded-[20px] transition-all duration-500 group-hover:shadow-2xl group-hover:scale-[1.01] bg-white border border-gray-100/50"
                  style={{
                    boxShadow: '0 15px 35px -5px rgba(0, 0, 0, 0.08), 0 5px 15px -3px rgba(0, 0, 0, 0.04)'
                  }}
                >
                  <img
                    src={optimizedUrl}
                    alt={banner.title || "Banner"}
                    className="w-full h-auto object-cover min-h-[140px] max-h-[220px] aspect-[21/9] sm:aspect-[21/8] rounded-[20px]"
                    loading="lazy"
                    decoding="async"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
                </div>
              </div>
            );
          })}
        </div>
        {/* Dot Indicators */}
        {banners.length > 1 && (
          <div className="flex justify-center gap-1.5 mt-2">
            {banners.map((_, index) => (
              <div
                key={index}
                className={`rounded-full transition-all duration-300 ${index === currentIndex ? 'w-5 h-1.5' : 'w-1.5 h-1.5'}`}
                style={{
                  backgroundColor: index === currentIndex ? themeColors.brand.yellow : `${themeColors.brand.yellow}66`,
                  boxShadow: index === currentIndex ? `0 2px 6px ${themeColors.brand.yellow}80` : '0 1px 2px rgba(0, 0, 0, 0.1)'
                }}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // Fallback to legacy single banner view
  const optimizedUrl = imageUrl ? optimizeCloudinaryUrl(imageUrl, { quality: 'auto' }) : homepageBanner;
  return (
    <div className="my-5 px-3 cursor-pointer group" onClick={onClick}>
      <div
        className="relative overflow-hidden rounded-[20px] transition-all duration-500 group-hover:shadow-2xl group-hover:scale-[1.01] bg-white border border-gray-100/50"
        style={{
          boxShadow: '0 15px 35px -5px rgba(0, 0, 0, 0.08), 0 5px 15px -3px rgba(0, 0, 0, 0.04)'
        }}
      >
        <img
          src={optimizedUrl}
          alt="Banner"
          className="w-full h-auto object-cover min-h-[140px] max-h-[220px] aspect-[21/9] sm:aspect-[21/8] rounded-[20px]"
          loading="lazy"
          decoding="async"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-20 transition-opacity duration-300" />
      </div>
    </div>
  );
});

Banner.displayName = 'Banner';

export default Banner;

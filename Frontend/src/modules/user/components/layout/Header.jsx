import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { HiLocationMarker } from 'react-icons/hi';
import { gsap } from 'gsap';
import LocationSelector from '../common/LocationSelector';
import { animateLogo } from '../../../../utils/gsapAnimations';
import Logo from '../../../../components/common/Logo';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { themeColors } from '../../../../theme';

import CitySelectorModal from '../common/CitySelectorModal';
import { useCity } from '../../../../context/CityContext';
import { HiChevronDown } from 'react-icons/hi';
import NotificationBell from '../common/NotificationBell';

const Header = ({ location, onLocationClick }) => {
  const logoRef = useRef(null);
  const { currentCity } = useCity();
  const [isCityModalOpen, setIsCityModalOpen] = React.useState(false);

  useEffect(() => {
    if (logoRef.current) {
      animateLogo(logoRef.current);
    }
  }, []);

  return (
    <header className="relative overflow-hidden">
      {/* Content wrapper with relative positioning */}
      <div className="relative z-10">
        <div className="w-full">
          {/* Top Row: Logo (Left), Location (Center), Notification (Right) */}
          <div className="px-4 py-3 flex items-center justify-between gap-3">
            {/* Left: Logo & Desktop Navigation */}
            <div className="flex-1 flex items-center justify-start min-w-0">
              <Link
                to="/user"
                className="cursor-pointer shrink-0"
                onMouseEnter={() => {
                  if (logoRef.current) {
                    gsap.to(logoRef.current, {
                      scale: 1.1,
                      filter: `drop-shadow(0 0 16px ${themeColors.brand.teal}40)`,
                      duration: 0.3,
                      ease: 'power2.out',
                    });
                  }
                }}
                onMouseLeave={() => {
                  if (logoRef.current) {
                    gsap.to(logoRef.current, {
                      scale: 1,
                      filter: '',
                      duration: 0.3,
                      ease: 'power2.out',
                    });
                  }
                }}
              >
                <Logo
                  ref={logoRef}
                  className="h-9 sm:h-12 w-auto"
                />
              </Link>

              {/* Desktop Navigation - Hidden on Mobile */}
              <nav className="hidden lg:flex items-center gap-8 ml-10">
                <Link to="/user" className="text-gray-700 font-semibold hover:text-[#347989] transition-colors">Home</Link>
                <Link to="/user/my-bookings" className="text-gray-700 font-semibold hover:text-[#347989] transition-colors">Bookings</Link>
                <Link to="/user/scrap" className="text-gray-700 font-semibold hover:text-[#347989] transition-colors">Scrap</Link>
                <Link to="/user/cart" className="text-gray-700 font-semibold hover:text-[#347989] transition-colors">Cart</Link>
                <Link to="/user/account" className="text-gray-700 font-semibold hover:text-[#347989] transition-colors">Account</Link>
              </nav>
            </div>

            {/* Center: City & Location */}
            <div className="flex-none flex flex-col items-center justify-center cursor-pointer min-w-0 px-2" onClick={onLocationClick}>
              <div className="flex items-center gap-1 mb-0.5 justify-center">
                {/* Gradient Definition for Icons */}
                <svg width="0" height="0" className="absolute">
                  <linearGradient id="gobee-location-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor={themeColors.brand.teal} />
                    <stop offset="50%" stopColor={themeColors.brand.yellow} />
                    <stop offset="100%" stopColor={themeColors.brand.orange} />
                  </linearGradient>
                </svg>
                <HiLocationMarker
                  className="w-4 h-4 shrink-0"
                  style={{ fill: 'url(#gobee-location-gradient)' }}
                />
                <span className="text-sm font-bold truncate max-w-[140px] sm:max-w-[200px]" style={{
                  background: themeColors.gradient,
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}>
                  {location && location !== '...' ? location.split('-')[0].trim() : 'Select Location'}
                </span>
              </div>
              <LocationSelector
                location={location}
                onLocationClick={onLocationClick}
              />
            </div>

            {/* Right: Notification Bell */}
            <div className="flex-1 flex items-center justify-end">
              <NotificationBell />
            </div>
          </div>
        </div>
      </div>

      <CitySelectorModal
        isOpen={isCityModalOpen}
        onClose={() => setIsCityModalOpen(false)}
      />
    </header>
  );
};

export default Header;

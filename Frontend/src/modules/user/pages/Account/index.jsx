import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { themeColors } from '../../../../theme';
import { userAuthService } from '../../../../services/authService';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { motion } from 'framer-motion';
import {
  FiArrowLeft,
  FiUser,
  FiEdit3,
  FiClipboard,
  FiHeadphones,
  FiFileText,
  FiStar,
  FiMapPin,
  FiCreditCard,
  FiSettings,
  FiChevronRight,
  FiBell,
  FiShoppingBag,
  FiLogOut,
  FiGift,
  FiShield,
  FiZap,
  FiCheckCircle
} from 'react-icons/fi';
import { MdAccountBalanceWallet } from 'react-icons/md';
import NotificationBell from '../../components/common/NotificationBell';
import Logo from '../../../../components/common/Logo';

const Account = () => {
  const navigate = useNavigate();
  const [userProfile, setUserProfile] = useState({
    name: 'Verified Customer',
    phone: '',
    email: '',
    isPhoneVerified: false,
    isEmailVerified: false,
    walletBalance: 0,
    plans: null
  });
  const [isLoading, setIsLoading] = useState(true);

  // Fetch user profile from database
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // First check localStorage
        const storedUserData = localStorage.getItem('userData');
        if (storedUserData) {
          const userData = JSON.parse(storedUserData);
          setUserProfile({
            name: userData.name || 'Verified Customer',
            phone: userData.phone || '',
            email: userData.email || '',
            isPhoneVerified: userData.isPhoneVerified || false,
            isEmailVerified: userData.isEmailVerified || false,
            profilePhoto: userData.profilePhoto || '',
            walletBalance: userData.wallet?.balance ?? 0
          });
        }

        // Fetch fresh data from API
        const response = await userAuthService.getProfile();
        if (response.success && response.user) {
          setUserProfile({
            name: response.user.name || 'Verified Customer',
            phone: response.user.phone || '',
            email: response.user.email || '',
            isPhoneVerified: response.user.isPhoneVerified || false,
            isEmailVerified: response.user.isEmailVerified || false,
            profilePhoto: response.user.profilePhoto || '',
            walletBalance: response.user.wallet?.balance ?? 0,
            plans: response.user.plans
          });
        }
      } catch (error) {
        // Use localStorage data if API fails
        const storedUserData = localStorage.getItem('userData');
        if (storedUserData) {
          const userData = JSON.parse(storedUserData);
          setUserProfile({
            name: userData.name || 'Verified Customer',
            phone: userData.phone || '',
            email: userData.email || '',
            isPhoneVerified: userData.isPhoneVerified || false,
            isEmailVerified: userData.isEmailVerified || false
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Format phone number for display
  const formatPhoneNumber = (phone) => {
    if (!phone) return '';
    if (phone.startsWith('+91')) return phone;
    if (phone.length === 10) return `+91 ${phone}`;
    return phone;
  };

  // Get initials for avatar
  const getInitials = () => {
    if (userProfile.name && userProfile.name !== 'Verified Customer') {
      const names = userProfile.name.split(' ');
      if (names.length >= 2) {
        return (names[0][0] + names[1][0]).toUpperCase();
      }
      return names[0][0].toUpperCase();
    }
    if (userProfile.phone) {
      return userProfile.phone.slice(-2);
    }
    return 'VC';
  };

  const handleLogout = async () => {
    try {
      await userAuthService.logout();
      toast.success('Logged out successfully');
      navigate('/user/login');
    } catch (error) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('userData');
      toast.success('Logged out successfully');
      navigate('/user/login');
    }
  };

  const MenuItem = ({ icon: Icon, label, onClick, color = "text-slate-900", badge }) => (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between py-3.5 px-3 bg-white hover:bg-slate-55 transition-colors duration-150 group"
    >
      <div className="flex items-center gap-3.5">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 bg-slate-50 text-slate-700`}
          style={{
            color: color === 'text-red-500' ? '#EF4444' : '#334155'
          }}
        >
          <Icon className="w-4.5 h-4.5" />
        </div>
        <span className="text-sm font-semibold text-slate-800 group-hover:text-black transition-colors">{label}</span>
      </div>
      <div className="flex items-center gap-2">
        {badge && (
          <span className="px-2 py-0.5 bg-red-100 text-red-600 text-[9px] font-bold rounded-full">
            {badge}
          </span>
        )}
        <FiChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
      </div>
    </button>
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.05 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-20 relative bg-[#F8FAFC]">
      <div className="relative z-10">
        <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/40 border-b border-black/[0.03] px-5 py-5 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate(-1)}
              className="w-10 h-10 bg-white rounded-xl flex items-center justify-center shadow-sm border border-black/[0.02]"
            >
              <FiArrowLeft className="w-5 h-5 text-black" />
            </motion.button>
            <h1 className="text-xl font-extrabold text-black tracking-tight">Account</h1>
          </div>
        </header>

        <motion.main
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="px-4 pt-4 max-w-lg mx-auto"
        >
          {/* Centered Profile Details (No Card shape, Flat) */}
          <motion.div
            variants={itemVariants}
            className="py-4 mb-4 flex flex-col items-center text-center bg-white rounded-3xl border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.01)]"
          >
            {/* Centered Photo with Edit Icon on Top-Right */}
            <div className="relative mb-2.5">
              <div className="w-20 h-20 rounded-full p-1 bg-white shadow-sm border border-slate-100 flex items-center justify-center">
                {userProfile.profilePhoto ? (
                  <img
                    src={userProfile.profilePhoto}
                    alt={userProfile.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-full flex items-center justify-center text-white font-black text-xl"
                    style={{ background: 'linear-gradient(135deg, #347989 0%, #BB5F36 100%)' }}>
                    {getInitials()}
                  </div>
                )}
              </div>
              <button
                onClick={() => navigate('/user/update-profile')}
                className="absolute top-0 right-0 p-1 bg-slate-900 text-white rounded-full border-2 border-white shadow-sm hover:bg-[#BB5F36] active:scale-90 transition-all duration-200"
              >
                <FiEdit3 className="w-3 h-3" />
              </button>
            </div>

            {/* Profile Info */}
            <div className="w-full px-4">
              <h2 className="text-base font-extrabold text-slate-900 mb-0.5">
                {userProfile.name}
              </h2>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                {userProfile.phone ? formatPhoneNumber(userProfile.phone) : 'No phone linked'}
              </p>
            </div>
          </motion.div>

          {/* Active membership plan (Clean, Flat card) */}
          {userProfile.plans && userProfile.plans.isActive && (
            <motion.div
              variants={itemVariants}
              onClick={() => navigate('/user/my-plan')}
              className="relative overflow-hidden mb-4 rounded-xl p-4 text-white cursor-pointer group transition-all"
              style={{
                background: `linear-gradient(135deg, ${themeColors.brand.teal} -10%, ${themeColors.brand.orange} 120%)`,
              }}
            >
              <div className="relative z-10 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-1.5 mb-0.5">
                    <FiShield className="w-3.5 h-3.5 text-white/80" />
                    <span className="text-[9px] font-bold uppercase tracking-wider text-white/70">Membership Status</span>
                  </div>
                  <h3 className="text-base font-black mb-0.5">{userProfile.plans.name}</h3>
                  <span className="text-[9px] font-semibold opacity-85 uppercase tracking-wide">Expires: {new Date(userProfile.plans.expiry).toLocaleDateString()}</span>
                </div>
                <FiChevronRight className="w-4 h-4 opacity-75 group-hover:translate-x-1 transition-transform" />
              </div>
            </motion.div>
          )}

          {/* Separate White Balance & Rewards Cards */}
          <motion.div variants={itemVariants} className="grid grid-cols-2 gap-3 mb-5">
            <button
              onClick={() => navigate('/user/wallet')}
              className="bg-white p-3 rounded-2xl border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:shadow-md transition-all text-left group flex items-center gap-2.5"
            >
              <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform"
                style={{ backgroundColor: `${themeColors.brand.teal}15`, color: themeColors.brand.teal }}
              >
                <MdAccountBalanceWallet className="w-4.5 h-4.5" />
              </div>
              <div className="min-w-0">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block leading-none">Balance</span>
                <span className="text-xs font-black text-slate-900 mt-1 block leading-none">
                  ₹{Math.abs(userProfile.walletBalance || 0).toLocaleString('en-IN')}
                </span>
              </div>
            </button>

            <button
              onClick={() => navigate('/user/rewards')}
              className="bg-white p-3 rounded-2xl border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.01)] hover:shadow-md transition-all text-left group flex items-center gap-2.5"
            >
              <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform"
                style={{ backgroundColor: `${themeColors.brand.orange}15`, color: themeColors.brand.orange }}
              >
                <FiGift className="w-4.5 h-4.5" />
              </div>
              <div className="min-w-0">
                <span className="text-[9px] text-slate-400 font-bold uppercase tracking-wider block leading-none">Rewards</span>
                <span className="text-xs font-black text-slate-900 mt-1 block leading-none">Refer & Earn</span>
              </div>
            </button>
          </motion.div>

          {/* Shopping Menu List Card */}
          <motion.div variants={itemVariants} className="mb-4">
            <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-1.5 pl-1.5">Shopping</h3>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-100 overflow-hidden">
              <MenuItem
                icon={FiShoppingBag}
                label="Scrap Deals"
                onClick={() => navigate('/user/scrap')}
              />
              <MenuItem
                icon={FiFileText}
                label="My Plans"
                onClick={() => navigate('/user/my-plan')}
              />
            </div>
          </motion.div>

          {/* Activity Menu List Card */}
          <motion.div variants={itemVariants} className="mb-4">
            <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-1.5 pl-1.5">Activity</h3>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-100 overflow-hidden">
              <MenuItem
                icon={FiClipboard}
                label="My Bookings"
                onClick={() => navigate('/user/my-bookings')}
              />
              <MenuItem
                icon={FiStar}
                label="My Ratings"
                onClick={() => navigate('/user/my-rating')}
              />
            </div>
          </motion.div>

          {/* Preferences Menu List Card */}
          <motion.div variants={itemVariants} className="mb-4">
            <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-1.5 pl-1.5">Preferences</h3>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-100 overflow-hidden">
              <MenuItem
                icon={FiMapPin}
                label="Manage Addresses"
                onClick={() => navigate('/user/manage-addresses')}
              />
              <MenuItem
                icon={FiSettings}
                label="Settings"
                onClick={() => navigate('/user/settings')}
              />
            </div>
          </motion.div>

          {/* Support & More Menu List Card */}
          <motion.div variants={itemVariants} className="mb-6">
            <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-widest mb-1.5 pl-1.5">Support & More</h3>
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm divide-y divide-slate-100 overflow-hidden mb-4">
              <MenuItem
                icon={FiHeadphones}
                label="Help & Support"
                onClick={() => navigate('/user/help-support')}
              />
              <MenuItem
                icon={Logo}
                label="About Cleaning Expert Services"
                onClick={() => navigate('/user/about-gobee')}
              />
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-1.5 py-3 bg-red-600 hover:bg-red-700 text-white font-bold uppercase tracking-wider text-xs rounded-xl shadow-sm hover:shadow transition-all duration-150 active:scale-95 mt-2"
            >
              <FiLogOut className="w-3.5 h-3.5" />
              <span>Log out</span>
            </button>
          </motion.div>

          <motion.div variants={itemVariants} className="text-center pb-6">
            <p className="text-[9px] font-semibold text-slate-400">Version 7.6.27 R547</p>
          </motion.div>
        </motion.main>
      </div>
    </div>
  );
};

export default Account;

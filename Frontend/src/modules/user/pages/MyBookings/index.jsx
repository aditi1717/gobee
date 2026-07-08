import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiClock, FiMapPin, FiCheckCircle, FiXCircle, FiLoader, FiCalendar, FiChevronRight } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { themeColors } from '../../../../theme';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import NotificationBell from '../../components/common/NotificationBell';
import { motion } from 'framer-motion';
import { bookingService } from '../../../../services/bookingService';

const MyBookings = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, confirmed, in-progress, completed, cancelled

  useEffect(() => {
    const loadBookings = async () => {
      try {
        setLoading(true);
        const params = {};
        if (filter !== 'all') {
          params.status = filter;
        }
        const response = await bookingService.getUserBookings(params);
        if (response.success) {
          setBookings(response.data || []);
        } else {
          toast.error(response.message || 'Failed to load bookings');
          setBookings([]);
        }
      } catch (error) {
        toast.error('Failed to load bookings. Please try again.');
        setBookings([]);
      } finally {
        setLoading(false);
      }
    };

    loadBookings();

    // Listen for real-time updates
    window.addEventListener('userBookingsUpdated', loadBookings);

    return () => {
      window.removeEventListener('userBookingsUpdated', loadBookings);
    };
  }, [filter]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'confirmed':
        return <FiCheckCircle className="w-3.5 h-3.5" />;
      case 'in_progress':
      case 'in-progress':
        return <FiLoader className="w-3.5 h-3.5 animate-spin" />;
      case 'journey_started':
      case 'visited':
        return <FiMapPin className="w-3.5 h-3.5 text-slate-800" />;
      case 'completed':
        return <FiCheckCircle className="w-3.5 h-3.5" />;
      case 'cancelled':
      case 'rejected':
        return <FiXCircle className="w-3.5 h-3.5" />;
      case 'awaiting_payment':
      default:
        return <FiClock className="w-3.5 h-3.5" />;
    }
  };

  const getStatusBorderColor = (status) => {
    return '!border-l-[#BB5F36]';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'confirmed':
      case 'in_progress':
      case 'in-progress':
      case 'journey_started':
      case 'visited':
        return 'bg-orange-50/80 text-[#BB5F36] border-orange-100 ring-orange-50';
      case 'completed':
        return 'bg-slate-100 text-slate-800 border-slate-200 ring-slate-100';
      case 'cancelled':
      case 'rejected':
        return 'bg-slate-50 text-slate-400 border-slate-200 ring-slate-100';
      case 'awaiting_payment':
        return 'bg-slate-800 text-white border-slate-900 ring-slate-800';
      default:
        return 'bg-slate-500 text-white border-gray-600 ring-gray-500';
    }
  };

  const getStatusLabel = (status) => {
    if (!status) return 'Unknown';
    switch (status) {
      case 'in_progress':
      case 'in-progress':
        return 'In Progress';
      case 'journey_started': return 'On The Way';
      case 'visited': return 'Arrived';
      case 'awaiting_payment': return 'Request Accepted';
      case 'work_done': return 'Work Completed';
      default: return status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ');
    }
  };

  const handleBookingClick = (booking) => {
    navigate(`/user/booking/${booking._id || booking.id}`);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const formatTime = (timeString) => {
    if (!timeString) return 'N/A';
    return timeString;
  };

  const getAddressString = (address) => {
    if (typeof address === 'string') return address;
    if (address && typeof address === 'object') {
      const parts = [
        address.addressLine1,
        address.addressLine2,
        address.city
      ].filter(Boolean);
      return parts.join(', ');
    }
    return 'Detailed Address';
  };

  return (
    <div className="min-h-screen pb-24 relative bg-gray-50/30">
      <div className="relative z-10">
        {/* Modern Grayscale Header */}
        <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/70 border-b border-slate-100 px-4 py-3 flex items-center gap-3 shadow-sm">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100 hover:bg-slate-50 transition-colors"
          >
            <FiArrowLeft className="w-4 h-4 text-slate-800" />
          </button>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">My Bookings</h1>
        </header>

        {/* Grayscale Filter Tabs with Orange Accent */}
        <div className="bg-white border-b border-slate-100 sticky top-[53px] z-20 shadow-sm">
          <div className="flex overflow-x-auto px-4 py-2.5 gap-2 no-scrollbar scroll-smooth">
            {[
              { id: 'all', label: 'All Bookings' },
              { id: 'confirmed', label: 'Confirmed' },
              { id: 'in-progress', label: 'In Progress' },
              { id: 'completed', label: 'Completed' },
              { id: 'cancelled', label: 'Cancelled' },
            ].map((tab) => {
              const isActive = filter === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setFilter(tab.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all duration-200 border ${
                    isActive
                      ? 'text-white shadow-sm active:scale-95 border-transparent'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100 hover:border-slate-300'
                  }`}
                  style={isActive ? {
                    backgroundColor: themeColors.brand?.orange || '#BB5F36',
                  } : {}}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Bookings List */}
        <main className="px-4 py-4 max-w-lg mx-auto w-full">
          {loading ? (
            <div className="space-y-3.5">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm animate-pulse">
                  <div className="flex justify-between mb-3 border-b border-slate-100 pb-3">
                    <div className="space-y-2">
                      <div className="h-3 w-20 bg-slate-200 rounded"></div>
                      <div className="h-5 w-48 bg-slate-200 rounded"></div>
                    </div>
                    <div className="h-6 w-24 bg-slate-200 rounded-full"></div>
                  </div>
                  <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-3 mb-4 p-2.5 rounded-lg bg-slate-50 border border-slate-200">
                    <div className="w-6 h-6 rounded-full bg-slate-200"></div>
                    <div className="space-y-1.5 py-1">
                      <div className="h-2 w-16 bg-slate-200 rounded"></div>
                      <div className="h-3 w-32 bg-slate-200 rounded"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : bookings.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-24 text-center px-6"
            >
              <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-5 border border-slate-100 shadow-sm">
                <FiClock className="w-6 h-6 text-slate-400" />
              </div>
              <h3 className="text-slate-900 text-base font-bold mb-1.5">No Bookings Found</h3>
              <p className="text-slate-500 text-xs max-w-xs leading-relaxed">
                {filter === 'all'
                  ? "Looks like you haven't booked any services yet. Explore our services to get started!"
                  : `You don't have any ${filter.replace('-', ' ')} bookings at the moment.`}
              </p>
            </motion.div>
          ) : (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: { staggerChildren: 0.08 }
                }
              }}
              className="space-y-3.5"
            >
              {bookings.map((booking) => (
                <motion.div
                  key={booking._id || booking.id}
                  variants={{
                    hidden: { opacity: 0, y: 15 },
                    visible: {
                      opacity: 1,
                      y: 0,
                      transition: { type: "spring", stiffness: 120, damping: 16 }
                    }
                  }}
                  onClick={() => handleBookingClick(booking)}
                  className={`group relative bg-white rounded-2xl p-4 border border-slate-100 border-l-4 shadow-[0_4px_15px_-4px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.06)] hover:border-slate-200 active:scale-[0.995] transition-all duration-200 cursor-pointer overflow-hidden ${getStatusBorderColor(booking.status)}`}
                >
                  {/* Card Header Section */}
                  <div className="relative z-10 flex items-start justify-between mb-3.5 pb-3 border-b border-slate-100">
                    <div className="flex-1 pr-4">
                      {/* Booking ID & Category Badge */}
                      <div className="flex items-center gap-2 flex-wrap mb-1.5">
                        <span className="text-[10px] font-bold text-slate-400 font-mono">
                          #{booking.bookingNumber || (booking._id || booking.id).substring(0, 8)}
                        </span>
                        {booking.serviceCategory && (
                          <span className="text-[9px] font-extrabold text-[#BB5F36] bg-orange-50/60 px-2 py-0.5 rounded uppercase tracking-wider">
                            {booking.serviceCategory}
                          </span>
                        )}
                      </div>
                      
                      {/* Service Title */}
                      <h3 className="text-[15px] font-extrabold text-slate-900 leading-snug">
                        {booking.serviceName || 'Service Request'}
                      </h3>
                      
                      {/* Booked Items (Only show if it's different from the title to prevent redundancy) */}
                      {booking.bookedItems && booking.bookedItems.length > 0 && 
                       booking.bookedItems[0].title !== booking.serviceName && (
                        <p className="text-xs text-slate-500 font-medium mt-0.5 line-clamp-1">
                          {booking.bookedItems.map(item => item.card?.title || item.title).join(', ')}
                        </p>
                      )}
                    </div>

                    {/* Status Badge */}
                    <div className={`shrink-0 px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 shadow-sm ${getStatusColor(booking.status)}`}>
                      {getStatusIcon(booking.status)}
                      <span>{getStatusLabel(booking.status)}</span>
                    </div>
                  </div>

                  {/* Soft Compact Details Container */}
                  <div className="relative z-10 bg-slate-50/70 rounded-xl p-3 space-y-3 mb-3.5 border border-slate-100/50">
                    {/* Date/Slot Row */}
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-white border border-slate-100 flex items-center justify-center shrink-0 shadow-sm">
                        <FiCalendar className="w-3.5 h-3.5 text-slate-600" />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-1">Scheduled Slot</span>
                        <span className="text-xs font-bold text-slate-800 leading-none">
                          {formatDate(booking.scheduledDate)} <span className="text-slate-300 mx-1">•</span> {booking.scheduledTime || booking.timeSlot?.start || 'N/A'}
                        </span>
                      </div>
                    </div>

                    {/* Location Row */}
                    <div className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-white border border-slate-100 flex items-center justify-center shrink-0 shadow-sm">
                        <FiMapPin className="w-3.5 h-3.5 text-slate-600" />
                      </div>
                      <div className="flex flex-col min-w-0 flex-1">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider leading-none mb-1">Service Location</span>
                        <p className="text-xs font-semibold text-slate-800 truncate w-full leading-normal">
                          {getAddressString(booking.address)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Card Footer Section */}
                  <div className="relative z-10 flex items-center justify-between pt-3 border-t border-slate-100">
                    <div>
                      <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">Total Amount</p>
                      <p className="text-base font-black text-slate-900 flex items-baseline gap-0.5">
                        <span className="text-xs font-bold text-slate-500">₹</span>
                        {(booking.finalAmount || booking.totalAmount || 0).toLocaleString('en-IN')}
                      </p>
                    </div>

                    <button
                      className="flex items-center gap-1 pl-3.5 pr-2.5 py-1.5 rounded-xl bg-slate-900 border border-slate-950 text-white font-extrabold text-xs transition-all shadow-sm active:scale-95"
                      style={{ transition: 'all 0.2s ease-out' }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = themeColors.brand?.orange || '#BB5F36';
                        e.currentTarget.style.borderColor = themeColors.brand?.orange || '#BB5F36';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '';
                        e.currentTarget.style.borderColor = '';
                      }}
                    >
                      View Details
                      <FiChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </main>
      </div>
    </div>
  );
};

export default MyBookings;


import React, { useState, useEffect, useLayoutEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiBell, FiCheck, FiArrowLeft, FiTrash2, FiX } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { themeColors } from '../../../../theme';
import BottomNav from '../../components/layout/BottomNav';
import {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteAllNotifications
} from '../../services/notificationService';

const Notifications = () => {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [filter, setFilter] = useState('all'); // all, alerts, jobs, payments

  useLayoutEffect(() => {
    // Optional: Set background color if needed, similar to Vendor
    const html = document.documentElement;
    const body = document.body;
    const root = document.getElementById('root');
    const bgStyle = themeColors.backgroundGradient || '#f9fafb';

    if (html) html.style.background = bgStyle;
    if (body) body.style.background = bgStyle;
    if (root) root.style.background = bgStyle;

    return () => {
      if (html) html.style.background = '';
      if (body) body.style.background = '';
      if (root) root.style.background = '';
    };
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const data = await getNotifications();
      setNotifications(data || []);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Listen for real-time updates (if implemented via window event or socket)
    const handleUpdate = () => fetchNotifications();
    window.addEventListener('userNotificationsUpdated', handleUpdate);

    return () => {
      window.removeEventListener('userNotificationsUpdated', handleUpdate);
    };
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await markAsRead(id);
      // Update local state to reflect change immediately
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
    } catch (error) {
      console.error('Failed to mark as read', error);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await markAllAsRead();
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
      toast.success('All marked as read');
    } catch (error) {
      console.error('Failed to mark all as read', error);
      toast.error('Failed to mark all as read');
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    try {
      // Professional confirmation could be a custom modal, but native confirm is robust for now
      // Or just delete with undo toast.
      // User asked for "professionally". Often direct delete is preferred for single items, confirmation for "Clear All".
      // But let's add no confirm for single item for speed, or a simple one.
      await deleteNotification(id);
      setNotifications(prev => prev.filter(n => n.id !== id));
      toast.success('Notification removed');
    } catch (error) {
      console.error('Failed to delete notification', error);
      toast.error('Failed to delete');
    }
  };

  const handleClearAll = () => {
    setShowClearConfirm(true);
  };

  const confirmClearAll = async () => {
    try {
      await deleteAllNotifications();
      setNotifications([]);
      toast.success('All notifications cleared');
      setShowClearConfirm(false);
    } catch (error) {
      console.error('Failed to clear notifications', error);
      toast.error('Failed to clear');
      setShowClearConfirm(false);
    }
  };

  const filteredNotifications = notifications.filter(notif => {
    if (filter === 'all') return true;

    const type = (notif.type || '').toLowerCase();

    if (filter === 'payments') {
      return ['payment_', 'refund_', 'wallet_'].some(prefix => type.includes(prefix));
    }

    if (filter === 'jobs') { // Mapped to 'Bookings' in UI
      return ['booking_', 'job_', 'worker_', 'visit_', 'work_', 'journey_', 'vendor_'].some(prefix => type.includes(prefix));
    }

    if (filter === 'alerts') {
      return ['alert', 'general', 'security', 'account'].some(prefix => type.includes(prefix));
    }

    return type === filter;
  });

  const getNotificationIcon = (originalType) => {
    const type = (originalType || '').toLowerCase();

    if (['payment', 'refund', 'wallet'].some(t => type.includes(t))) return '💰';
    if (['booking', 'job', 'work', 'visit', 'journey', 'vendor', 'scrap'].some(t => type.includes(t))) return '📋';
    if (['alert', 'general'].some(t => type.includes(t))) return '🔔';

    return '📢';
  };

  const getNotificationColor = (originalType) => {
    const type = (originalType || '').toLowerCase();

    if (['payment', 'refund', 'wallet'].some(t => type.includes(t))) return '#10B981'; // Green
    if (['booking', 'job', 'work', 'visit', 'journey', 'vendor', 'scrap'].some(t => type.includes(t))) return '#3B82F6'; // Blue
    if (['alert', 'general'].some(t => type.includes(t))) return themeColors.button;

    return '#6B7280'; // Gray
  };

  return (
    <div className="min-h-screen pb-20 relative bg-white overflow-hidden">
      {/* Brand Mesh Gradient Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute inset-0"
          style={{
            background: `
              radial-gradient(at 0% 0%, ${themeColors?.brand?.teal || '#347989'}20 0%, transparent 70%),
              radial-gradient(at 100% 0%, ${themeColors?.brand?.yellow || '#D68F35'}15 0%, transparent 70%),
              radial-gradient(at 100% 100%, ${themeColors?.brand?.orange || '#BB5F36'}10 0%, transparent 75%),
              radial-gradient(at 0% 100%, ${themeColors?.brand?.teal || '#347989'}08 0%, transparent 70%),
              #FFFFFF
            `
          }}
        />
        {/* Elegant Dot Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(${themeColors?.brand?.teal || '#347989'} 0.8px, transparent 0.8px)`,
            backgroundSize: '32px 32px'
          }}
        />
      </div>

      {/* Header */}
      <div 
        className="backdrop-blur-xl bg-white/60 sticky top-0 z-50 border-b border-black/[0.03] rounded-b-[24px] shadow-[0_4px_30px_rgba(0,0,0,0.03)] transition-all duration-300"
      >
        <div className="px-4 py-4 flex items-center justify-between max-w-lg mx-auto w-full">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-black/5 rounded-full transition-colors shrink-0"
          >
            <FiArrowLeft className="w-5 h-5 text-gray-800" />
          </button>
          <h1 className="text-lg font-black text-gray-900 flex-1 text-center pr-8">
            Notifications
          </h1>
        </div>
      </div>

      <main className="relative z-10 px-4 py-6 max-w-lg mx-auto w-full">
        {/* Action Buttons: Mark All Read and Clear All (Shown on top right after heading) */}
        {notifications.length > 0 && (
          <div className="flex items-center justify-between mb-5 px-1">
            <button
              onClick={handleMarkAllRead}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-teal-50 hover:bg-teal-100 text-teal-700 text-xs font-bold transition-all shadow-sm border border-teal-100/50 active:scale-95"
            >
              <FiCheck className="w-3.5 h-3.5" />
              Mark all read
            </button>
            <button
              onClick={handleClearAll}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 text-xs font-bold transition-all shadow-sm border border-red-100/50 active:scale-95"
            >
              <FiTrash2 className="w-3.5 h-3.5" />
              Clear all
            </button>
          </div>
        )}

        {/* Filter Buttons */}
        <div 
          className="flex gap-2.5 mb-6 overflow-x-auto pb-2 scrollbar-none"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {[
            { id: 'all', label: 'All', count: notifications.length },
            { id: 'jobs', label: 'Booking', count: notifications.filter(n => ['booking_', 'job_', 'worker_', 'visit_', 'work_', 'journey_', 'vendor_'].some(p => (n.type || '').toLowerCase().includes(p))).length },
            { id: 'payments', label: 'Payment', count: notifications.filter(n => ['payment_', 'refund_', 'wallet_'].some(p => (n.type || '').toLowerCase().includes(p))).length },
          ].map((filterOption) => {
            const isActive = filter === filterOption.id;
            return (
              <button
                key={filterOption.id}
                onClick={() => setFilter(filterOption.id)}
                className={`px-4 py-2 rounded-2xl font-bold text-xs whitespace-nowrap transition-all duration-300 flex items-center gap-1.5 ${
                  isActive
                    ? 'text-white'
                    : 'bg-white/80 hover:bg-white text-gray-700 border border-gray-100/50 backdrop-blur-sm'
                }`}
                style={
                  isActive
                    ? {
                        background: themeColors.brand.gradient || `linear-gradient(135deg, ${themeColors.brand.teal}, ${themeColors.brand.orange})`,
                        boxShadow: `0 6px 15px -4px ${themeColors.brand.teal}80`,
                      }
                    : {
                        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.03)',
                      }
                }
              >
                <span>{filterOption.label}</span>
                {filterOption.count > 0 && (
                  <span
                    className={`text-[9px] px-1.5 py-0.5 rounded-lg font-black ${
                      isActive ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'
                    }`}
                  >
                    {filterOption.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Notifications List */}
        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white/60 backdrop-blur-md rounded-2xl p-4 shadow-sm border border-white/60 animate-pulse">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-gray-100 shrink-0"></div>
                  <div className="flex-1 space-y-3 py-1">
                    <div className="flex justify-between items-start">
                      <div className="h-4 w-32 bg-gray-100 rounded"></div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 w-full bg-gray-100 rounded"></div>
                      <div className="h-3 w-2/3 bg-gray-100 rounded"></div>
                    </div>
                    <div className="h-2 w-16 bg-gray-50 rounded"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredNotifications.length === 0 ? (
          <div
            className="bg-white/80 backdrop-blur-md rounded-3xl p-10 text-center border border-white/60 shadow-[0_8px_30px_rgba(0,0,0,0.03)]"
          >
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
              <FiBell className="w-8 h-8 text-gray-300" />
            </div>
            <p className="text-gray-800 font-bold mb-1">No notifications found</p>
            <p className="text-xs text-gray-400">You are all caught up!</p>
          </div>
        ) : (
          <div className="space-y-3.5">
            {filteredNotifications.map((notif) => (
              <div
                key={notif.id}
                className={`bg-white/80 backdrop-blur-md rounded-2xl p-4 shadow-[0_8px_30px_rgba(0,0,0,0.02)] border border-white/60 hover:border-gray-200/50 hover:bg-white hover:shadow-[0_12px_40px_rgba(0,0,0,0.06)] transition-all duration-300 relative overflow-hidden group ${
                  !notif.read ? 'border-l-4' : ''
                }`}
                style={{
                  borderLeftColor: !notif.read ? getNotificationColor(notif.type) : undefined,
                }}
              >
                <div className="flex items-start gap-4">
                  <div
                    className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl flex-shrink-0 shadow-inner"
                    style={{
                      background: `linear-gradient(135deg, ${getNotificationColor(notif.type)}1F, ${getNotificationColor(notif.type)}0A)`,
                      border: `1px solid ${getNotificationColor(notif.type)}25`
                    }}
                  >
                    {getNotificationIcon(notif.type)}
                  </div>
                  <div className="flex-1 pr-8">
                    <div className="flex items-center gap-2">
                      <p className={`text-sm text-gray-800 leading-tight ${!notif.read ? 'font-black text-gray-900' : 'font-semibold'}`}>
                        {notif.title}
                      </p>
                      {!notif.read && (
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">
                      {notif.message}
                    </p>
                    <p className="text-[10px] text-gray-400 mt-2.5 font-bold">
                      {notif.time}
                    </p>
                    {notif.action && (
                      <button
                        onClick={() => {
                          if (notif.action === 'view_booking') {
                            navigate(`/user/booking/${notif.bookingId}`);
                          } else if (notif.action === 'view_wallet') {
                            navigate('/user/wallet');
                          }
                        }}
                        className="mt-3 text-xs font-black flex items-center gap-1 hover:underline"
                        style={{ color: themeColors.brand.teal }}
                      >
                        View Details
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>

                {/* Actions: Mark Read & Delete */}
                <div className="absolute top-4 right-4 flex gap-1.5 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-200">
                  {!notif.read && (
                    <button
                      onClick={() => handleMarkAsRead(notif.id)}
                      className="p-1.5 rounded-xl bg-white hover:bg-green-50 text-green-600 transition-colors shadow-sm border border-gray-100 active:scale-95"
                      title="Mark as read"
                    >
                      <FiCheck className="w-3.5 h-3.5" />
                    </button>
                  )}
                  <button
                    onClick={(e) => handleDelete(e, notif.id)}
                    className="p-1.5 rounded-xl bg-white hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors shadow-sm border border-gray-100 active:scale-95"
                    title="Delete"
                  >
                    <FiX className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      <BottomNav />

      {/* Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white w-full max-w-sm rounded-3xl p-6 shadow-2xl animate-scale-in border border-gray-100">
            <div className="flex flex-col items-center text-center mb-6">
              <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mb-4">
                <FiTrash2 className="w-6 h-6 text-red-500" />
              </div>
              <h3 className="text-lg font-black text-gray-900">Clear All Notifications?</h3>
              <p className="text-xs text-gray-500 mt-2">This action cannot be undone and will delete all notifications.</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="py-3 rounded-2xl font-bold text-sm text-gray-500 hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmClearAll}
                className="py-3 rounded-2xl font-bold text-sm text-white bg-red-500 shadow-lg shadow-red-500/20 active:scale-95 transition-all"
              >
                Yes, Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;

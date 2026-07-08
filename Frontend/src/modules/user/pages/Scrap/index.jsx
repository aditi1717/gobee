import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiPlus, FiMapPin, FiClock, FiCheckCircle, FiBell, FiArrowLeft, FiTrash2, FiCamera, FiX, FiLoader, FiImage } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import api from '../../../../services/api';
import { AnimatePresence, motion } from 'framer-motion';
import BottomNav from '../../components/layout/BottomNav';
import AddressSelectionModal from '../Checkout/components/AddressSelectionModal';
import { themeColors } from '../../../../theme';
import NotificationBell from '../../components/common/NotificationBell';
import { uploadToCloudinary } from '../../../../utils/cloudinaryUpload';
import flutterBridge from '../../../../utils/flutterBridge';


const UserScrapPage = () => {
  // ... imports and basic state ...
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('active'); // 'active' | 'history'
  const [scraps, setScraps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedScrap, setSelectedScrap] = useState(null);

  useEffect(() => {
    fetchMyScrap();
  }, []);

  const fetchMyScrap = async () => {
    try {
      setLoading(true);
      const res = await api.get('/scrap/my');
      if (res.data.success) {
        setScraps(res.data.data);
      }
    } catch (err) {
      console.error(err);
      toast.error('Failed to load scrap items');
    } finally {
      setLoading(false);
    }
  };



  const handleDelete = async (e, id) => {
    e.stopPropagation(); // Prevent opening modal
    if (!window.confirm('Are you sure you want to delete this listing?')) return;

    try {
      toast.loading('Deleting listing...', { id: 'delete-scrap' });
      const res = await api.delete(`/scrap/${id}`);
      if (res.data.success) {
        toast.success('Listing deleted successfully', { id: 'delete-scrap' });
        setSelectedScrap(null);
        fetchMyScrap();
      }
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || 'Failed to delete listing', { id: 'delete-scrap' });
    }
  };


  const activeScraps = scraps.filter(s => s.status === 'pending' || s.status === 'accepted');
  const historyScraps = scraps.filter(s => s.status === 'completed' || s.status === 'cancelled');

  // Inside return:
  return (
    <div className="min-h-screen pb-24 relative bg-[#F8FAFC]">
      <div className="relative z-10">
        {/* Modern Grayscale Header */}
        <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/70 border-b border-slate-100 px-4 py-3 flex items-center gap-3 shadow-sm">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100 hover:bg-slate-50 transition-colors"
          >
            <FiArrowLeft className="w-4 h-4 text-slate-800" />
          </button>
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">Sell Scrap</h1>
        </header>

        {/* Brand Orange Pill-Style Tabs */}
        <div className="bg-white border-b border-slate-100 sticky top-[53px] z-20 shadow-sm">
          <div className="flex overflow-x-auto px-4 py-2.5 gap-2 no-scrollbar scroll-smooth">
            {[
              { id: 'active', label: 'Active Listings' },
              { id: 'history', label: 'History' },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
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

        {/* Content List */}
        <div className="p-4 space-y-3.5 max-w-lg mx-auto">
          {loading ? (
            <div className="space-y-3.5">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white rounded-2xl p-4 border border-slate-150 animate-pulse">
                  <div className="flex gap-3 mb-3 pb-3 border-b border-slate-100">
                    <div className="w-16 h-16 bg-slate-200 rounded-xl"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-4 w-28 bg-slate-200 rounded"></div>
                      <div className="h-3 w-40 bg-slate-200 rounded"></div>
                    </div>
                  </div>
                  <div className="h-3.5 w-32 bg-slate-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : (activeTab === 'active' ? activeScraps : historyScraps).length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
              <div className="bg-slate-50 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-4 border border-slate-100">
                <FiTrash2 className="w-6 h-6 text-slate-300" />
              </div>
              <p className="text-slate-900 font-bold text-sm">No listings found</p>
              <p className="text-xs text-slate-400 mt-1">Add items to start selling scrap</p>
            </div>
          ) : (
            (activeTab === 'active' ? activeScraps : historyScraps).map(item => {
              const isPending = item.status === 'pending';
              const isAccepted = item.status === 'accepted';
              const isCompleted = item.status === 'completed';
              const isCancelled = item.status === 'cancelled';

              return (
                <div
                  key={item._id}
                  className="bg-white rounded-2xl p-4 border border-slate-100 border-l-4 !border-l-[#BB5F36] shadow-[0_4px_15px_-4px_rgba(0,0,0,0.02)] hover:shadow-[0_8px_24px_-8px_rgba(0,0,0,0.06)] hover:border-slate-200 active:scale-[0.995] transition-all duration-200 cursor-pointer overflow-hidden relative"
                  onClick={() => setSelectedScrap(item)}
                >
                  <div className="flex gap-3.5 relative z-10">
                    {item.images && item.images.length > 0 ? (
                      <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-slate-100 bg-slate-50">
                        <img src={item.images[0]} alt={item.title} className="w-full h-full object-cover" />
                      </div>
                    ) : (
                      <div className="w-16 h-16 rounded-xl shrink-0 border border-slate-100 bg-slate-50 flex items-center justify-center text-slate-400">
                        <FiImage className="w-6 h-6" />
                      </div>
                    )}
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start gap-2">
                        <div className="min-w-0 flex-1">
                          <h3 className="text-sm font-extrabold text-slate-900 leading-snug truncate">{item.title}</h3>
                          <p className="text-xs text-slate-500 font-medium mt-1 truncate">{item.description || 'No description provided'}</p>
                        </div>
                        
                        <div className={`shrink-0 px-2 py-0.5 rounded-full border text-[9px] font-extrabold uppercase tracking-wider
                          ${isPending ? 'bg-orange-50/80 text-[#BB5F36] border-orange-100' : ''}
                          ${isAccepted ? 'bg-teal-50 text-[#347989] border-teal-100' : ''}
                          ${isCompleted ? 'bg-slate-100 text-slate-800 border-slate-200' : ''}
                          ${isCancelled ? 'bg-slate-50 text-slate-400 border-slate-200' : ''}
                        `}>
                          {item.status}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Details block */}
                  <div className="mt-3.5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-[10px] font-bold text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <FiClock className="w-3.5 h-3.5 text-slate-650" />
                      <span>Listed {new Date(item.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      {isAccepted && (
                        <div className="flex items-center gap-1 text-[#347989]">
                          <FiCheckCircle className="w-3 h-3" />
                          <span>Pickup Confirmed</span>
                        </div>
                      )}
                      {(isPending || isCancelled) && (
                        <button
                          onClick={(e) => handleDelete(e, item._id)}
                          className="w-7 h-7 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg flex items-center justify-center shrink-0 transition-colors"
                          title="Delete Listing"
                        >
                          <FiTrash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Floating Action Button (FAB) */}
        <button
          onClick={() => navigate('/user/scrap/add')}
          className="fixed bottom-24 right-4 w-12 h-12 rounded-full shadow-lg flex items-center justify-center text-white transition-transform active:scale-95 z-40"
          style={{
            backgroundColor: themeColors.brand?.orange || '#BB5F36',
            boxShadow: '0 4px 14px rgba(187, 95, 54, 0.4)'
          }}
        >
          <FiPlus className="w-6 h-6" />
        </button>

        {/* Add Modal */}


        {/* User Scrap Details Modal */}
        <AnimatePresence>
          {selectedScrap && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedScrap(null)}
                className="fixed inset-0 bg-black/60 z-[60] backdrop-blur-[2px]"
              />
              <motion.div
                initial={{ y: "100%", opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: "100%", opacity: 0 }}
                transition={{ type: "spring", damping: 28, stiffness: 300 }}
                className="fixed bottom-24 left-4 right-4 bg-white rounded-2xl z-[70] max-h-[75vh] overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-w-md mx-auto"
                onClick={e => e.stopPropagation()}
              >
                {/* Modal Header */}
                <div className="p-3.5 px-4 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white/90 backdrop-blur-md z-10">
                  <h2 className="text-sm font-extrabold text-slate-900 leading-tight">{selectedScrap.title}</h2>
                  <button
                    onClick={() => setSelectedScrap(null)}
                    className="w-8 h-8 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-lg flex items-center justify-center transition-colors"
                  >
                    <FiX className="w-4.5 h-4.5" />
                  </button>
                </div>

                <div className="p-4 space-y-3.5 overflow-y-auto max-h-[calc(75vh-110px)]">
                  {/* Images */}
                  {selectedScrap.images && selectedScrap.images.length > 0 && (
                    <div className="grid grid-cols-2 gap-2">
                      {selectedScrap.images.map((img, i) => (
                        <div key={i} className={`rounded-xl overflow-hidden border border-slate-100 bg-slate-50 ${i === 0 && selectedScrap.images.length % 2 !== 0 ? 'col-span-2 aspect-video' : 'aspect-square'}`}>
                          <img src={img} alt="Scrap" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Status row */}
                  <div className="flex items-center justify-between border-b border-slate-50 pb-2.5">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Listing Status</span>
                    <span className={`px-2 py-0.5 rounded-full border text-[9px] font-extrabold uppercase tracking-wider
                      ${selectedScrap.status === 'pending' ? 'bg-orange-50/80 text-[#BB5F36] border-orange-100' : ''}
                      ${selectedScrap.status === 'accepted' ? 'bg-teal-50 text-[#347989] border-teal-100' : ''}
                      ${selectedScrap.status === 'completed' ? 'bg-slate-100 text-slate-800 border-slate-200' : ''}
                      ${selectedScrap.status === 'cancelled' ? 'bg-slate-50 text-slate-400 border-slate-200' : ''}
                    `}>
                      {selectedScrap.status}
                    </span>
                  </div>

                  {/* Description Box */}
                  {selectedScrap.description && (
                    <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                      <span className="text-[9px] font-black text-slate-450 uppercase tracking-wider block mb-1">Description</span>
                      <p className="text-xs font-semibold text-slate-700 leading-relaxed italic">
                        "{selectedScrap.description}"
                      </p>
                    </div>
                  )}

                  {/* Location Box */}
                  <div className="space-y-1">
                    <span className="text-[9px] font-black text-slate-450 uppercase tracking-wider block pl-1">Pickup Address</span>
                    <div className="bg-slate-50/50 p-3 rounded-xl border border-slate-100 flex items-start gap-2 text-xs font-semibold text-slate-800">
                      <FiMapPin className="text-[#BB5F36] w-3.5 h-3.5 mt-0.5 shrink-0" />
                      <div className="min-w-0">
                        <p className="font-extrabold text-slate-900 leading-snug">{selectedScrap.address?.addressLine1}</p>
                        <p className="text-[10px] text-slate-400 uppercase font-bold mt-0.5">{selectedScrap.address?.city}, {selectedScrap.address?.state}</p>
                      </div>
                    </div>
                  </div>

                  {/* Timeline */}
                  <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[9px] font-bold text-slate-400">
                    <span className="flex items-center gap-1"><FiClock className="w-3 h-3" /> Listed {new Date(selectedScrap.createdAt).toLocaleDateString()}</span>
                    {selectedScrap.status === 'accepted' && <span className="text-[#347989] font-black">Vendor Assigned</span>}
                  </div>
                </div>

                {/* Footer buttons */}
                <div className="p-3 bg-slate-50 border-t border-slate-150 flex gap-2">
                  <button
                    onClick={() => setSelectedScrap(null)}
                    className="flex-1 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold uppercase tracking-wider text-xs active:scale-95 transition-all"
                  >
                    Close
                  </button>
                  {(selectedScrap.status === 'pending' || selectedScrap.status === 'cancelled') && (
                    <button
                      onClick={(e) => handleDelete(e, selectedScrap._id)}
                      className="px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 rounded-xl font-bold uppercase tracking-wider text-xs active:scale-95 transition-all flex items-center gap-1"
                    >
                      <FiTrash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  )}
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* Hide bottom nav when modal is open to prevent z-index issues / clutter */}
      </div>


    </div >
  );
};

export default UserScrapPage;

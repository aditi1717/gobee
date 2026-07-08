import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiStar, FiUser, FiBriefcase, FiCalendar, FiMessageSquare, FiLoader } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import bookingService from '../../../../services/bookingService';

const MyRating = () => {
  const navigate = useNavigate();
  const [ratings, setRatings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });

  const fetchRatings = async (page = 1) => {
    try {
      setIsLoading(true);
      const response = await bookingService.getRatings({ page, limit: 10 });
      if (response.success) {
        setRatings(page === 1 ? response.data : [...ratings, ...response.data]);
        setPagination(response.pagination);
      } else {
        toast.error(response.message || 'Failed to fetch ratings');
      }
    } catch (error) {
      console.error('Error fetching ratings:', error);
      toast.error('Failed to load ratings');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchRatings();
  }, []);

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      {/* Premium Standard Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/70 border-b border-slate-100 px-4 py-3 flex items-center gap-3 shadow-sm">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100 hover:bg-slate-50 transition-colors"
        >
          <FiArrowLeft className="w-4 h-4 text-slate-800" />
        </button>
        <h1 className="text-lg font-bold text-slate-900 tracking-tight">My Reviews</h1>
      </header>

      <main className="px-4 py-6 max-w-lg mx-auto">
        {isLoading && pagination.page === 1 ? (
          <div className="flex flex-col items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-400 border-t-transparent mb-4"></div>
            <p className="text-slate-500 font-bold text-xs">Fetching your reviews...</p>
          </div>
        ) : ratings.length > 0 ? (
          <div className="space-y-4">
            {ratings.map((rating, idx) => (
              <div
                key={rating._id || idx}
                className="bg-white rounded-2xl p-5 border border-slate-100 space-y-4 hover:shadow-[0_4px_12px_rgba(0,0,0,0.03)] transition-all duration-300"
              >
                <div className="flex justify-between items-start">
                  <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-150 flex items-center justify-center overflow-hidden shrink-0">
                      {rating.vendorId?.profilePhoto ? (
                        <img src={rating.vendorId.profilePhoto} alt={rating.vendorId.name} className="w-full h-full object-cover" />
                      ) : (
                        <FiUser className="w-5 h-5 text-slate-400" />
                      )}
                    </div>
                    <div>
                      <h4 className="font-extrabold text-sm text-slate-900">{rating.vendorId?.businessName || rating.vendorId?.name || 'Service Provider'}</h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <FiStar
                              key={s}
                              className={`w-3 h-3 ${s <= rating.rating ? 'text-amber-500 fill-amber-500' : 'text-slate-200'}`}
                            />
                          ))}
                        </div>
                        <span className="text-[9px] font-black text-slate-400 uppercase tracking-wider">{formatDate(rating.reviewedAt)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="bg-orange-50 border border-orange-100/50 px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider text-[#BB5F36]">
                    <span>{rating.serviceName || rating.serviceId?.title}</span>
                  </div>
                </div>

                {rating.review && (
                  <p className="text-slate-600 text-xs leading-relaxed font-semibold pl-3 border-l-4 !border-l-[#BB5F36] italic">
                    "{rating.review}"
                  </p>
                )}

                {rating.reviewImages && rating.reviewImages.length > 0 && (
                  <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
                    {rating.reviewImages.map((img, i) => (
                      <img key={i} src={img} className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-150" alt="Review" />
                    ))}
                  </div>
                )}

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <FiBriefcase className="w-3.5 h-3.5 text-slate-400" />
                    <span className="text-[10px] font-bold text-slate-550 uppercase tracking-wider">Booking #{rating.bookingNumber}</span>
                  </div>
                  <button
                    onClick={() => navigate(`/user/booking/${rating._id}`)}
                    className="text-[10px] font-black text-[#BB5F36] hover:underline uppercase tracking-wider"
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}

            {/* Load More */}
            {pagination.total > ratings.length && (
              <button
                onClick={() => fetchRatings(pagination.page + 1)}
                className="w-full py-3 bg-white rounded-xl border border-slate-150 text-slate-600 font-extrabold text-xs flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors shadow-sm"
              >
                {isLoading ? <div className="animate-spin rounded-full h-4 w-4 border-2 border-slate-400 border-t-transparent"></div> : 'Load More Reviews'}
              </button>
            )}
          </div>
        ) : (
          <div className="bg-white rounded-2xl p-6 text-center border border-dashed border-slate-200 py-12">
            <div className="w-16 h-16 rounded-full bg-slate-50 flex items-center justify-center mb-4 mx-auto border border-slate-100">
              <FiStar className="w-8 h-8 text-slate-300" />
            </div>
            <h3 className="text-base font-extrabold text-slate-900 mb-1">No Reviews Yet</h3>
            <p className="text-slate-500 text-xs font-semibold max-w-xs mx-auto leading-relaxed">
              You haven't reviewed any services yet. After completing a booking, you can rate your experience!
            </p>
            <button
              onClick={() => navigate('/user/my-bookings')}
              className="mt-5 px-6 py-2.5 bg-[#BB5F36] text-white rounded-xl font-black text-[10px] uppercase tracking-wider shadow-md hover:bg-[#a04e29] active:scale-95 transition-all"
            >
              Go to My Bookings
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default MyRating;

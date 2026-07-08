import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPortal } from 'react-dom';
import { FiX, FiLayers, FiArrowLeft, FiPlus, FiCheck } from 'react-icons/fi';
import { AnimatePresence, motion } from 'framer-motion';
import { themeColors } from '../../../../../theme';
import { publicCatalogService } from '../../../../../services/catalogService';
import { useCart } from '../../../../../context/CartContext';
import { toast } from 'react-hot-toast';

const toAssetUrl = (url) => {
  if (!url) return '';
  const clean = url.replace('/api/upload', '/upload');
  if (clean.startsWith('http')) return clean;
  const base = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000').replace(/\/api$/, '');
  return `${base}${clean.startsWith('/') ? '' : '/'}${clean}`;
};

const CategoryModal = React.memo(({ isOpen, onClose, category, location, cartCount, currentCity }) => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [isClosing, setIsClosing] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const [view, setView] = useState('brands'); // 'brands' | 'services'
  const [brands, setBrands] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [services, setServices] = useState([]); // Sub-services
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);

  const cityId = currentCity?._id || currentCity?.id;

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setIsClosing(false);
      // Reset state on close
      setTimeout(() => {
        setView('brands');
        setSelectedBrand(null);
        setBrands([]);
        setServices([]);
        setIsRedirecting(false);
      }, 300);
    } else if (category?.id) {
      if (category.initialBrand) {
        // Direct to brand services if initialBrand is provided (from search)
        const brand = category.initialBrand;
        setSelectedBrand(brand);
        setView('services');
        fetchServices(brand.id || brand._id);
      }
      // Always fetch brands for this category to populate the background/back-navigation
      fetchBrands();
    }
  }, [isOpen, category?.id, cityId]);

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const response = await publicCatalogService.getBrands({
        categoryId: category.id,
        cityId: cityId
      });
      if (response.success) {
        setBrands(response.brands || []);
      }
    } catch (error) {
      console.error("Failed to load brands:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchServices = async (brandId) => {
    try {
      setLoading(true);
      const response = await publicCatalogService.getServices({
        brandId: brandId,
        cityId: cityId,
        categoryId: category?.id
      });
      if (response.success) {
        setServices(response.services || []);
      }
    } catch (error) {
      console.error("Failed to load services:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBrandClick = (brand) => {
    setSelectedBrand(brand);
    setView('services');
    fetchServices(brand.id || brand._id);
  };

  const handleBackToBrands = () => {
    setView('brands');
    setSelectedBrand(null);
    setServices([]);
  };

  const handleServiceClick = async (service) => {
    // Add to cart logic
    try {
      const cartItemData = {
        serviceId: service.id || service._id,
        categoryId: category?.id,
        title: service.title,
        description: service.description || '',
        icon: toAssetUrl(service.icon || ''),
        category: category?.title,
        categoryTitle: category?.title || '', // Explicit field
        categoryIcon: toAssetUrl(category?.homeIconUrl || category?.iconUrl || ''), // Explicit field
        // Brand info — stored as sectionTitle/sectionIcon for booking flow
        sectionId: selectedBrand?.id || selectedBrand?._id || null, // VITAL: Added for plan benefits
        sectionTitle: selectedBrand?.title || '',
        sectionIcon: toAssetUrl(selectedBrand?.iconUrl || selectedBrand?.icon || ''),
        price: service.discountPrice || service.basePrice,
        originalPrice: service.discountPrice ? service.basePrice : null,
        unitPrice: service.discountPrice || service.basePrice,
        serviceCount: 1,
        rating: "4.8",
        reviews: "1k+",
        vendorId: service.vendorId || selectedBrand?.vendorId || null,
        card: {
          title: service.title,
          subtitle: service.description || '',
          price: service.discountPrice || service.basePrice,
          originalPrice: service.discountPrice ? service.basePrice : null,
          duration: service.duration || '',
          description: service.description || '',
          imageUrl: toAssetUrl(service.icon || ''),
          features: service.features || []
        }
      };

      const response = await addToCart(cartItemData);
      if (response.success) {
        setIsRedirecting(true);
        setTimeout(() => {
          navigate('/user/cart');
        }, 1200);
      } else {
        toast.error(response.message || 'Failed to add to cart');
      }
    } catch (error) {
      toast.error('Failed to add to cart');
    }
  };

  if (!isOpen && !isClosing) return null;
  if (!mounted) return null;

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9998]"
            onClick={onClose}
            style={{
              position: 'fixed',
              willChange: 'opacity',
              transform: 'translateZ(0)',
              backfaceVisibility: 'hidden',
              WebkitBackfaceVisibility: 'hidden',
            }}
          />

            {/* Modal Container */}
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-[9999] max-w-lg mx-auto"
              style={{
                position: 'fixed',
                willChange: 'transform',
                backfaceVisibility: 'hidden',
                WebkitBackfaceVisibility: 'hidden',
              }}
            >
              <div className="bg-white rounded-t-2xl max-h-[85vh] overflow-y-auto min-h-[40vh] border border-slate-100 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] flex flex-col">
                {isRedirecting ? (
                  <div className="flex flex-col items-center justify-center min-h-[35vh] py-10">
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center mb-4"
                    >
                      <FiCheck className="w-8 h-8 text-[#BB5F36]" />
                    </motion.div>
                    <h3 className="text-base font-extrabold text-slate-900 mb-1">Service Added!</h3>
                    <p className="text-slate-555 text-xs font-semibold">Proceeding to checkout...</p>
                  </div>
                ) : (
                  <div>
                    {/* Compact Sticky Header */}
                    <div className="p-3.5 px-4 border-b border-slate-100 flex justify-between items-center sticky top-0 bg-white/95 backdrop-blur-md z-10">
                      <div className="flex items-center gap-2.5 min-w-0">
                        {view === 'services' && (
                          <button
                            onClick={handleBackToBrands}
                            className="w-7.5 h-7.5 bg-slate-50 hover:bg-slate-100 text-slate-600 rounded-lg flex items-center justify-center transition-colors"
                          >
                            <FiArrowLeft className="w-4 h-4" />
                          </button>
                        )}
                        <div className="min-w-0">
                          <h2 className="text-sm font-extrabold text-slate-900 truncate leading-snug">
                            {view === 'brands' ? (category?.title || 'Brands') : (selectedBrand?.title || 'Services')}
                          </h2>
                          {view === 'services' && <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">Select a service to add</p>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {loading && <div className="w-4 h-4 border-2 border-[#BB5F36] border-t-transparent rounded-full animate-spin"></div>}
                        <button
                          onClick={onClose}
                          className="w-8 h-8 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-lg flex items-center justify-center transition-colors"
                        >
                          <FiX className="w-4.5 h-4.5" />
                        </button>
                      </div>
                    </div>

                    {/* Content Body */}
                    <div className="p-4">
                      {loading && (view === 'brands' ? brands.length === 0 : services.length === 0) ? (
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4 animate-pulse">
                          {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="flex flex-col items-center">
                              <div className="w-18 h-18 bg-slate-200 rounded-2xl mb-2"></div>
                              <div className="h-3 w-14 bg-slate-200 rounded"></div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <>
                          {view === 'brands' ? (
                            // Brands Grid
                            brands.length > 0 ? (
                              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3.5">
                                {brands.map((brand) => (
                                  <div
                                    key={brand.id || brand._id}
                                    onClick={() => handleBrandClick(brand)}
                                    className="flex flex-col items-center cursor-pointer group active:scale-95 transition-all"
                                  >
                                    <div className="w-18 h-18 bg-slate-50 rounded-2xl flex items-center justify-center mb-1.5 group-hover:bg-slate-100 transition-colors border border-slate-100 relative overflow-hidden">
                                      {brand.icon ? (
                                        <img
                                          src={toAssetUrl(brand.icon)}
                                          alt={brand.title}
                                          className="w-12 h-12 object-contain group-hover:scale-105 transition-transform"
                                          loading="lazy"
                                        />
                                      ) : (
                                        <FiLayers className="w-6 h-6 text-slate-300" />
                                      )}
                                      {brand.badge && (
                                        <span className="absolute top-0 right-0 bg-purple-50 text-purple-700 text-[8px] font-black px-1.5 py-0.5 rounded-bl-lg">
                                          {brand.badge}
                                        </span>
                                      )}
                                    </div>
                                    <p className="text-[10px] font-bold text-slate-800 text-center leading-tight line-clamp-2 px-0.5">
                                      {brand.title}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-center py-12 text-slate-500">
                                <p className="text-sm font-medium">No brands found in this category.</p>
                              </div>
                            )
                          ) : (
                            // Services List
                            services.length > 0 ? (
                              <div className="space-y-2.5">
                                {services.map((svc) => (
                                  <div key={svc.id || svc._id} className="flex justify-between items-center p-3 border border-slate-150 bg-white rounded-xl hover:shadow-[0_4px_12px_rgba(0,0,0,0.02)] transition-shadow">
                                    <div className="flex-1 pr-4 min-w-0">
                                      <h3 className="font-extrabold text-slate-900 text-xs leading-snug mb-1 truncate">{svc.title}</h3>
                                      <div className="flex items-baseline gap-1.5">
                                        <span className="text-sm font-black text-slate-900">₹{svc.discountPrice || svc.basePrice}</span>
                                        {svc.discountPrice && svc.discountPrice < svc.basePrice && (
                                          <span className="text-[10px] text-slate-400 line-through font-bold">₹{svc.basePrice}</span>
                                        )}
                                      </div>
                                    </div>
                                    <button
                                      onClick={() => handleServiceClick(svc)}
                                      className="px-3 py-1.5 bg-orange-50 hover:bg-orange-100 text-[#BB5F36] border border-orange-150/50 rounded-lg text-xs font-bold flex items-center gap-0.5 shrink-0 transition-colors"
                                    >
                                      <FiPlus className="w-3.5 h-3.5" />
                                      <span>Add</span>
                                    </button>
                                  </div>
                                ))}
                                
                                {/* Bottom Disclaimer */}
                                <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-start gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-100">
                                  <svg className="w-3.5 h-3.5 text-slate-450 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <p className="text-[10px] text-slate-500 font-semibold italic leading-snug">
                                    * It is a base price only, additional charges may be applicable after service
                                  </p>
                                </div>
                              </div>
                            ) : (
                              <div className="text-center py-12 text-slate-500">
                                <p className="text-sm font-medium">No services available for this brand yet.</p>
                              </div>
                            )
                          )}
                        </>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );

  return createPortal(modalContent, document.body);
});

CategoryModal.displayName = 'CategoryModal';
export default CategoryModal;

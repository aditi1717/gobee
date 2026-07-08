import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiShoppingCart, FiTrash2, FiPlus, FiMinus, FiLoader, FiBell } from 'react-icons/fi';
import { toast } from 'react-hot-toast';
import { themeColors } from '../../../../theme';
import BottomNav from '../../components/layout/BottomNav';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import { useCart } from '../../../../context/CartContext';
import electricianIcon from '../../../../assets/images/icons/services/electrician.png';
import womensSalonIcon from '../../../../assets/images/icons/services/womens-salon-spa-icon.png';
import massageMenIcon from '../../../../assets/images/icons/services/massage-men-icon.png';
import cleaningIcon from '../../../../assets/images/icons/services/cleaning-icon.png';
import acApplianceRepairIcon from '../../../../assets/images/icons/services/ac-appliance-repair-icon.png';
import NotificationBell from '../../components/common/NotificationBell';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, isLoading: loading, removeItem, removeCategoryItems, updateItem } = useCart();

  // Category icon mapping
  const getCategoryIcon = (category) => {
    const iconMap = {
      'Electrician': electricianIcon,
      'Electricity': electricianIcon,
      "Women's Salon & Spa": womensSalonIcon,
      'Salon for Women': womensSalonIcon,
      'Salon Prime': womensSalonIcon,
      'Massage for Men': massageMenIcon,
      'Cleaning': cleaningIcon,
      'Bathroom & Kitchen Cleaning': cleaningIcon,
      'Sofa & Carpet Cleaning': cleaningIcon,
      'AC Service and Repair': acApplianceRepairIcon,
      'AC & Appliance Repair': acApplianceRepairIcon,
    };
    return iconMap[category] || electricianIcon; // Default icon
  };

  // Group items by category
  const groupedItems = useMemo(() => {
    const groups = {};
    cartItems.forEach(item => {
      const category = item.category || 'Other';
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(item);
    });
    return groups;
  }, [cartItems]);

  const cartCount = cartItems.length;

  const handleBack = () => {
    navigate(-1);
  };

  const handleDeleteCategory = async (category) => {
    try {
      const response = await removeCategoryItems(category);
      if (response.success) {
        toast.success('Category items removed');
      } else {
        toast.error(response.message || 'Failed to remove category items');
      }
    } catch (error) {
      toast.error('Failed to remove category items');
    }
  };

  const handleDelete = async (itemId) => {
    try {
      const response = await removeItem(itemId);
      if (response.success) {
        toast.success('Item removed from cart');
      } else {
        toast.error(response.message || 'Failed to remove item');
      }
    } catch (error) {
      toast.error('Failed to remove item');
    }
  };

  const handleQuantityChange = async (itemId, change) => {
    try {
      const item = cartItems.find(i => (i._id || i.id) === itemId);
      if (!item) return;

      const newCount = Math.max(1, (item.serviceCount || 1) + change);
      const response = await updateItem(itemId, newCount);

      if (!response.success) {
        toast.error(response.message || 'Failed to update quantity');
      }
    } catch (error) {
      toast.error('Failed to update quantity');
    }
  };

  const handleAddServices = (category) => {
    // Navigate back to home with instructions to open the category modal
    const itemsInCategory = groupedItems[category];
    const categoryId = itemsInCategory?.[0]?.categoryId;

    navigate('/user', {
      state: {
        openCategoryId: categoryId,
        openCategoryName: category
      }
    });
  };

  const handleCategoryCheckout = (category) => {
    navigate('/user/checkout', { state: { category: category } });
  };

  const handleCartClick = () => {
    // Already on cart page
  };

  // Calculate totals for all items
  const totalPrice = cartItems.reduce((sum, item) => sum + (item.price || 0), 0);
  const totalOriginalPrice = cartItems.reduce((sum, item) => {
    const unitOriginalPrice = item.originalPrice || (item.unitPrice || (item.price / (item.serviceCount || 1)));
    return sum + (unitOriginalPrice * (item.serviceCount || 1));
  }, 0);
  return (
    <div className="min-h-screen pb-32 relative bg-[#F8FAFC]">
      <div className="relative z-10">
        {/* Modern Grayscale Header */}
        <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/70 border-b border-slate-100 px-4 py-3 flex items-center gap-3 shadow-sm">
          <button
            onClick={handleBack}
            className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100 hover:bg-slate-50 transition-colors"
          >
            <FiArrowLeft className="w-4 h-4 text-slate-800" />
          </button>
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-bold text-slate-900 tracking-tight">Your Cart</h1>
            {cartCount > 0 && (
              <span className="bg-slate-100 text-slate-600 text-[10px] font-black px-2 py-0.5 rounded-full shrink-0">
                {cartCount}
              </span>
            )}
          </div>
        </header>

        {/* Cart Items - Grouped by Category */}
        <main className="px-4 py-4 max-w-lg mx-auto" style={{ paddingBottom: cartItems.length > 0 ? '70px' : '100px' }}>
          {loading ? (
            <div className="space-y-4">
              {[1, 2].map(i => (
                <div key={i} className="bg-white rounded-2xl border border-slate-150 p-4 animate-pulse">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 bg-slate-200 rounded-xl"></div>
                    <div className="space-y-2 flex-1">
                      <div className="h-4 w-32 bg-slate-200 rounded"></div>
                      <div className="h-3 w-20 bg-slate-200 rounded"></div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="h-8 w-full bg-slate-100 rounded"></div>
                    <div className="h-8 w-full bg-slate-100 rounded"></div>
                  </div>
                </div>
              ))}
            </div>
          ) : cartItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
              <div className="bg-slate-50 rounded-full w-14 h-14 flex items-center justify-center mx-auto mb-4 border border-slate-100">
                <FiShoppingCart className="w-6 h-6 text-slate-300" />
              </div>
              <p className="text-slate-900 font-bold text-sm">Your cart is empty</p>
              <p className="text-xs text-slate-400 mt-1">Add services to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {Object.entries(groupedItems).map(([category, items]) => {
                const categoryTotal = items.reduce((sum, item) => sum + (item.price || 0), 0);
                const categoryIcon = getCategoryIcon(category);
                const serviceCount = items.reduce((sum, item) => sum + (item.serviceCount || 1), 0);

                return (
                  <div
                    key={category}
                    className="bg-white rounded-2xl border border-slate-100 border-l-4 !border-l-[#BB5F36] shadow-[0_4px_15px_-4px_rgba(0,0,0,0.02)] p-4"
                  >
                    {/* Category Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        {/* Category Icon */}
                        <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center shrink-0 overflow-hidden">
                          <img
                            src={categoryIcon}
                            alt={category}
                            className="w-8 h-8 object-contain"
                            onError={(e) => {
                              e.target.style.display = 'none';
                              if (e.target.nextSibling) {
                                e.target.nextSibling.style.display = 'flex';
                              }
                            }}
                          />
                          <div className="hidden items-center justify-center w-8 h-8 shrink-0">
                            <FiShoppingCart className="w-5 h-5 text-[#347989]" />
                          </div>
                        </div>

                        {/* Category Info */}
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-extrabold text-slate-900 truncate leading-snug">{category}</h3>
                          <p className="text-xs text-slate-550 font-semibold mt-0.5">
                            {serviceCount} {serviceCount === 1 ? 'service' : 'services'} • ₹{categoryTotal.toLocaleString('en-IN')}
                          </p>
                        </div>
                      </div>

                      {/* Delete Category Button */}
                      <button
                        onClick={() => handleDeleteCategory(category)}
                        className="w-7 h-7 bg-red-50 hover:bg-red-100 text-red-650 rounded-lg flex items-center justify-center shrink-0 transition-colors"
                        title="Remove Category Items"
                      >
                        <FiTrash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* Services List */}
                    <div className="mb-4 divide-y divide-slate-100 border-y border-slate-100/60 py-1">
                      {items.map((item) => (
                        <div key={item._id || item.id} className="flex items-center justify-between py-3 gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-extrabold text-slate-800 leading-snug truncate">
                              {item.title}
                            </p>
                            {item.description && (
                              <p className="text-[10px] text-slate-500 font-medium mt-0.5 truncate">{item.description}</p>
                            )}
                          </div>

                          <div className="flex items-center gap-3 shrink-0">
                            {/* Quantity Controls */}
                            <div className="flex items-center bg-slate-50 border border-slate-200 rounded-lg p-1 gap-1.5 shadow-sm">
                              <button
                                onClick={() => handleQuantityChange(item._id || item.id, -1)}
                                className="w-5 h-5 bg-white hover:bg-slate-100 text-slate-500 rounded flex items-center justify-center transition-colors border border-slate-200/50"
                              >
                                <FiMinus className="w-2.5 h-2.5" />
                              </button>
                              <span className="text-[11px] font-black text-slate-900 min-w-[14px] text-center">
                                {item.serviceCount || 1}
                              </span>
                              <button
                                onClick={() => handleQuantityChange(item._id || item.id, 1)}
                                className="w-5 h-5 bg-white hover:bg-slate-100 text-slate-500 rounded flex items-center justify-center transition-colors border border-slate-200/50"
                              >
                                <FiPlus className="w-2.5 h-2.5" />
                              </button>
                            </div>

                            <span className="text-xs font-extrabold text-slate-900 min-w-[50px] text-right">
                              ₹{(item.price || 0).toLocaleString('en-IN')}
                            </span>

                            <button
                              onClick={() => handleDelete(item._id || item.id)}
                              className="w-6 h-6 bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-red-650 rounded flex items-center justify-center transition-colors border border-slate-150"
                              title="Delete Item"
                            >
                              <FiTrash2 className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAddServices(category)}
                        className="flex-1 py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 rounded-xl text-xs font-bold uppercase tracking-wider transition-colors active:scale-[0.98]"
                      >
                        Add Services
                      </button>
                      <button
                        onClick={() => handleCategoryCheckout(category)}
                        className="flex-1 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider text-white shadow-sm hover:shadow transition-all active:scale-[0.98]"
                        style={{
                          backgroundColor: '#BB5F36',
                          boxShadow: '0 2px 8px rgba(187, 95, 54, 0.2)'
                        }}
                      >
                        Book
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>

      </div>
    </div>
  );
};

export default Cart;

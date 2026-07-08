import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiCheck, FiCalendar, FiClock, FiCreditCard, FiInfo, FiShield, FiStar, FiZap, FiCheckCircle, FiGift } from 'react-icons/fi';
import { getPlans } from '../../services/planService';
import { userAuthService } from '../../../../services/authService';
import { toast } from 'react-hot-toast';
import LogoLoader from '../../../../components/common/LogoLoader';

const PlanDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [plan, setPlan] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [id]);

  const fetchData = async () => {
    try {
      const [plansRes, userRes] = await Promise.all([
        getPlans(),
        userAuthService.getProfile()
      ]);

      if (plansRes.success) {
        const found = plansRes.data.find(p => p._id === id);
        if (found) {
          setPlan(found);
        } else {
          toast.error('Plan not found');
          navigate('/user/my-plan');
        }
      }
      if (userRes.success) setUser(userRes.user);

    } catch (error) {
      console.error(error);
      toast.error('Could not load data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <LogoLoader />;
  if (!plan) return null;

  const currentPlan = user?.plans;
  const isCurrent = currentPlan?.isActive && currentPlan?.name === plan.name;
  const isUpgrade = currentPlan?.isActive && plan.price > (currentPlan?.price || 0);
  const isDowngradeOrSame = currentPlan?.isActive && plan.price <= (currentPlan?.price || 0) && !isCurrent;

  // Formatting date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  // Helper for card style icons/colors
  const getTheme = (name) => {
    const lower = name.toLowerCase();
    if (lower.includes('platinum')) return { color: 'text-slate-900', bg: 'bg-slate-900', light: 'bg-slate-50', gradient: 'from-slate-800 to-slate-900' };
    if (lower.includes('diamond')) return { color: 'text-indigo-600', bg: 'bg-indigo-600', light: 'bg-indigo-50', gradient: 'from-indigo-500 via-purple-500 to-pink-500' };
    if (lower.includes('gold')) return { color: 'text-amber-600', bg: 'bg-amber-600', light: 'bg-amber-50', gradient: 'from-amber-400 to-yellow-500' };
    if (lower.includes('silver')) return { color: 'text-gray-600', bg: 'bg-gray-600', light: 'bg-gray-50', gradient: 'from-gray-400 to-slate-500' };
    return { color: 'text-primary-600', bg: 'bg-primary-600', light: 'bg-primary-50', gradient: 'from-primary-500 to-primary-600' };
  };

  const theme = getTheme(plan.name);

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24">
      {/* Dynamic Header Background */}
      <div className={`h-56 w-full bg-gradient-to-br ${theme.gradient} relative overflow-hidden`}>
        <div className="absolute top-0 left-0 w-full h-full opacity-10">
          <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <path d="M0 0 L100 0 L100 100 Z" fill="white" />
          </svg>
        </div>

        {/* Back Button */}
        <div className="absolute top-4 left-4 z-20">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 bg-white/20 backdrop-blur-md rounded-xl flex items-center justify-center text-white border border-white/10 hover:bg-white/30 transition-all"
          >
            <FiArrowLeft className="w-4 h-4" />
          </button>
        </div>

        {/* Plan Title in Header */}
        <div className="absolute bottom-8 left-5 text-white animate-slide-in-bottom">
          <div className="flex items-center gap-1.5 mb-1">
            <FiStar className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span className="text-[9px] font-black uppercase tracking-wider opacity-90">Subscription Plan</span>
          </div>
          <h1 className="text-2xl font-black">{plan.name}</h1>
          {plan.tagline && (
             <div className="mt-1.5 flex items-center">
               <span className="bg-white/10 border border-white/20 text-white px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider shadow-sm">
                 {plan.tagline}
               </span>
             </div>
          )}
        </div>
      </div>

      <div className="px-4 -mt-6 relative z-10 max-w-lg mx-auto">
        {/* Main Info Card */}
        <div className="bg-white rounded-2xl border border-slate-100 p-5 mb-4 shadow-[0_4px_15px_-4px_rgba(0,0,0,0.02)]">
          {plan.description && (
             <div className="mb-5 p-4 bg-slate-50 border-l-4 border-slate-900 rounded-xl">
                <p className="text-[11px] font-semibold text-slate-500 leading-relaxed italic">
                  "{plan.description}"
                </p>
             </div>
          )}
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-wider mb-0.5">Total Pricing</p>
              <div className="flex items-baseline">
                <span className={`text-2xl font-black ${theme.color}`}>₹{plan.price}</span>
                <span className="text-slate-400 text-xs font-bold ml-1">/ {plan.duration || '1'} Months</span>
              </div>
            </div>
            {isCurrent && (
              <span className="bg-teal-50 text-teal-650 px-2.5 py-1 rounded-lg text-[9px] font-black flex items-center gap-1 border border-teal-100 shadow-sm">
                <div className="w-1.5 h-1.5 bg-teal-500 rounded-full animate-ping"></div>
                ACTIVE NOW
              </span>
            )}
          </div>
        </div>

        {/* Complimentary Benefits from Previous Plan Section */}
        {(() => {
          const planOrder = ['Silver', 'Gold', 'Platinum', 'Diamond'];
          const currentPlanName = plan.name || '';
          const currentBaseName = planOrder.find(p => currentPlanName.toLowerCase().includes(p.toLowerCase()));
          const currentIndex = currentBaseName ? planOrder.indexOf(currentBaseName) : -1;
          const previousPlan = currentIndex > 0 ? planOrder[currentIndex - 1] : null;

          if (!previousPlan) return null;

          return (
            <div className="bg-gradient-to-br from-[#BB5F36] to-[#a04e29] rounded-2xl p-5 mb-4 text-white shadow-md relative overflow-hidden group">
              <div className="absolute right-0 top-0 w-24 h-24 bg-white/10 rounded-full -mr-12 -mt-12 blur-xl group-hover:bg-white/20 transition-all duration-700"></div>
              
              <div className="flex items-center gap-3 mb-3 relative z-10">
                <div className="p-2 bg-white/25 backdrop-blur-md rounded-xl border border-white/25">
                  <FiGift className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-sm font-black leading-tight uppercase tracking-wider">Extra Perks Included</h3>
                  <p className="text-[8px] text-amber-50 font-black uppercase tracking-widest opacity-80 mt-0.5">Tier Booster Active</p>
                </div>
              </div>

              <div className="relative z-10 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/15">
                <p className="text-xs font-semibold leading-relaxed">
                  As a <span className="font-extrabold underline decoration-1 underline-offset-2">{plan.name} Member</span>, you automatically enjoy 
                  <span className="font-extrabold"> extra benefits</span> from the <span className="bg-white text-[#BB5F36] px-1.5 py-0.5 rounded font-black mx-1 inline-block leading-none">{previousPlan}</span> 
                  tier in addition to your premium services.
                </p>
                <div className="mt-3.5 pt-3 border-t border-white/10 flex items-center justify-between">
                  <span className="text-[9px] font-black uppercase tracking-wider opacity-70">Legacy Support Included</span>
                  <div className="flex -space-x-1.5">
                    {[1,2,3].map(i => (
                      <div key={i} className="w-5 h-5 rounded-full border border-orange-500 bg-white/20 flex items-center justify-center text-[10px]">
                        <FiCheck className="w-2.5 h-2.5" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Unlimited Categories Section */}
        {plan.freeCategories && plan.freeCategories.length > 0 && (
          <div className="bg-white rounded-2xl p-5 mb-4 border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-orange-50 text-[#BB5F36] rounded-xl flex items-center justify-center">
                <FiZap className="w-4 h-4 fill-[#BB5F36]" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 leading-none">Unlimited Service Categories</h3>
                <p className="text-[9px] text-[#BB5F36] font-black uppercase tracking-wider mt-1">Full coverage on all services in these categories</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {plan.freeCategories.map((cat, idx) => (
                  <span key={idx} className="bg-slate-50 border border-slate-100 text-slate-800 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-[#BB5F36] rounded-full"></div>
                    {cat.title}
                  </span>
                ))}
              </div>
            </div>

            <div className="mt-4 p-3 bg-slate-50 rounded-xl border border-dashed border-slate-200">
              <p className="text-[9px] text-slate-400 leading-relaxed font-semibold">
                * All service types (Installation, Repair, Service) are 100% free for the categories listed above.
              </p>
            </div>
          </div>
        )}

        {/* 1. Plan Inclusive Benefits (Rose Section) */}
        {plan.freeServices && plan.freeServices.length > 0 && (
          <div className="bg-white rounded-2xl p-5 mb-4 border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-orange-50 text-[#BB5F36] rounded-xl flex items-center justify-center">
                <FiCheckCircle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 leading-none">{plan.name} Inclusive Benefits</h3>
                <p className="text-[9px] text-[#BB5F36] font-black uppercase tracking-wider mt-1">Special benefits included with your tier</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {(() => {
                const groups = new Map();
                (plan.freeServices || []).forEach(svc => {
                  const cid = String(svc.categoryId?._id || svc.categoryId || 'unknown');
                  const tkey = (svc.title || '').trim().toLowerCase();
                  const key = `${cid}_${tkey}`;
                  if (!groups.has(key)) groups.set(key, svc);
                });
                return Array.from(groups.values()).map((svc, idx) => (
                  <div key={`free-${idx}`} className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-100 rounded-xl hover:shadow-[0_2px_8px_rgba(0,0,0,0.01)] transition-all">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 bg-white text-slate-700 border border-slate-200/60 rounded-lg flex items-center justify-center shrink-0">
                        <FiCheck className="w-4.5 h-4.5" />
                      </div>
                      <div className="flex flex-col min-w-0 leading-tight">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[8px] font-black text-[#BB5F36] bg-orange-50 border border-orange-100/50 px-1.5 py-0.5 rounded leading-none shrink-0">{svc.categoryId?.title || 'Service'}</span>
                        </div>
                        <span className="text-slate-900 font-extrabold text-xs truncate mt-1">{svc.title}</span>
                      </div>
                    </div>
                    <span className="text-[8px] font-black text-rose-500 uppercase tracking-wider bg-rose-50 px-2 py-0.5 rounded border border-rose-100 shrink-0">Free Benefit</span>
                  </div>
                ));
              })()}
            </div>
          </div>
        )}

        {/* 2. Complimentary Membership Perks (Emerald Section) */}
        {plan.bonusServices && plan.bonusServices.length > 0 && (
          <div className="bg-white rounded-2xl p-5 mb-4 border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-9 h-9 bg-slate-50 text-slate-700 rounded-xl flex items-center justify-center border border-slate-150">
                <FiStar className="w-4 h-4 fill-slate-700" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-slate-900 leading-none">Complimentary Perks</h3>
                <p className="text-[9px] text-slate-500 font-black uppercase tracking-wider mt-1">Automatic benefits from previous tier inheritance</p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              {(() => {
                const groups = new Map();
                (plan.bonusServices || []).forEach(bs => {
                  const svc = bs.serviceId;
                  if (!svc) return;
                  const cid = String(bs.categoryId?._id || bs.categoryId || svc.categoryId?._id || svc.categoryId || 'unknown');
                  const tkey = (svc.title || '').trim().toLowerCase();
                  const key = `${cid}_${tkey}`;
                  if (!groups.has(key)) groups.set(key, bs);
                });
                
                return Array.from(groups.values()).map((bs, idx) => {
                  const svc = bs.serviceId;
                  const catTitle = bs.categoryId?.title || svc?.categoryId?.title || 'Service';
                  return (
                    <div key={`bonus-${idx}`} className="flex items-center justify-between p-3.5 bg-slate-50 border border-slate-100 rounded-xl hover:shadow-[0_2px_8px_rgba(0,0,0,0.01)] transition-all">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-9 h-9 bg-white text-slate-700 border border-slate-200/60 rounded-lg flex items-center justify-center shrink-0">
                          <FiStar className="w-4.5 h-4.5 fill-slate-500 text-slate-500" />
                        </div>
                        <div className="flex flex-col min-w-0 leading-tight">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[8px] font-black text-slate-500 bg-slate-100 border border-slate-200 px-1.5 py-0.5 rounded leading-none shrink-0">{catTitle}</span>
                          </div>
                          <span className="text-slate-900 font-extrabold text-xs truncate mt-1">{svc.title}</span>
                        </div>
                      </div>
                      <span className="text-[8px] font-black text-slate-500 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded border border-slate-150 shrink-0">Free Access</span>
                    </div>
                  );
                });
              })()}
            </div>
          </div>
        )}

        {/* Status Card (Only if Current Plan) */}
        {isCurrent && (
          <div className="bg-slate-950 rounded-2xl p-5 mb-4 text-white shadow-xl relative overflow-hidden group">
            <div className="absolute -right-6 -bottom-6 opacity-5 group-hover:scale-110 transition-transform duration-700">
              <FiZap className="w-32 h-32" />
            </div>

            <h3 className="text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2 text-slate-300">
              <FiShield className="text-teal-400" />
              Active Subscription details
            </h3>

            <div className="grid grid-cols-2 gap-4 relative z-10">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 bg-white/10 rounded-xl flex items-center justify-center border border-white/10 shrink-0">
                  <FiCalendar className="w-4 h-4 text-teal-400" />
                </div>
                <div className="min-w-0 leading-tight">
                  <p className="text-slate-400 text-[8px] font-black uppercase tracking-wider">Expires On</p>
                  <p className="text-xs font-bold text-white truncate">{formatDate(currentPlan.expiry)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 bg-white/10 rounded-xl flex items-center justify-center border border-white/10 shrink-0">
                  <FiCreditCard className="w-4 h-4 text-teal-400" />
                </div>
                <div className="min-w-0 leading-tight">
                  <p className="text-slate-400 text-[8px] font-black uppercase tracking-wider">Amount Paid</p>
                  <p className="text-xs font-bold text-white truncate">₹{currentPlan.price}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 bg-white/10 rounded-xl flex items-center justify-center border border-white/10 shrink-0">
                  <FiClock className="w-4 h-4 text-teal-400" />
                </div>
                <div className="min-w-0 leading-tight">
                  <p className="text-slate-400 text-[8px] font-black uppercase tracking-wider">Renewal</p>
                  <p className="text-xs font-bold text-white truncate">OFF</p>
                </div>
              </div>

              <div className="flex items-center gap-3 min-w-0">
                <div className="w-8 h-8 bg-white/10 rounded-xl flex items-center justify-center border border-white/10 shrink-0">
                  <FiInfo className="w-4 h-4 text-teal-400" />
                </div>
                <div className="min-w-0 leading-tight">
                  <p className="text-slate-400 text-[8px] font-black uppercase tracking-wider">Status</p>
                  <p className="text-[10px] font-black text-teal-400 uppercase tracking-widest">Active Member</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Action Button */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-150 z-45 max-w-lg mx-auto shadow-[0_-4px_25px_rgba(0,0,0,0.03)] sm:relative sm:border-0 sm:p-0 sm:bg-transparent sm:bottom-0">
          {!isCurrent && !isDowngradeOrSame ? (
            <button
              onClick={() => {
                navigate('/user/checkout', {
                  state: {
                    plan: {
                      id: plan._id,
                      name: plan.name,
                      price: plan.price,
                      description: plan.description || `${plan.duration || 'Monthly'} Plan`
                    },
                    isUpgrade
                  }
                });
              }}
              className="w-full py-3.5 rounded-xl text-white font-extrabold text-xs uppercase tracking-widest shadow-md flex items-center justify-center gap-1.5 transition-all active:scale-[0.985]"
              style={{
                backgroundColor: '#BB5F36',
                boxShadow: '0 4px 14px rgba(187, 95, 54, 0.3)'
              }}
            >
              <FiZap className="w-3.5 h-3.5 fill-white" />
              <span>{isUpgrade ? 'Upgrade My Membership' : 'Subscribe Now'}</span>
            </button>
          ) : isCurrent ? (
            <div className="bg-teal-50 text-[#347989] p-3.5 rounded-xl border border-teal-100 flex items-center justify-center gap-2 text-xs font-bold shadow-inner">
              <FiCheckCircle className="w-5 h-5 shrink-0" />
              <span>You are currently enjoying this plan</span>
            </div>
          ) : (
            <div className="bg-slate-100 text-slate-500 p-3.5 rounded-xl border border-slate-200 flex items-center justify-center gap-2 text-xs font-bold italic">
              <FiInfo className="shrink-0" />
              <span>Select a higher plan to upgrade</span>
            </div>
          )}
        </div>

        {/* Extra Info */}
        <div className="mt-8 space-y-4">
          <div className="flex items-start gap-2.5 p-3.5 bg-slate-50 rounded-xl border border-slate-150 select-none">
            <FiShield className="text-[#BB5F36] w-4 h-4 mt-0.5 shrink-0" />
            <p className="text-[10px] text-slate-550 leading-relaxed font-semibold">
              Payment is 100% secure. You can cancel your subscription at any time from your settings. Benefits are applied instantly after payment completion.
            </p>
          </div>
          <p className="text-center text-slate-400 text-[9px] uppercase font-black tracking-widest pb-8">
            Go Bee Subscription • Secure & Trusted
          </p>
        </div>
      </div>
    </div>
  );
};

export default PlanDetails;

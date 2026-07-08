import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiCheck, FiStar, FiCheckCircle, FiShield, FiZap, FiGift } from 'react-icons/fi';
import { getPlans } from '../../services/planService';
import { userAuthService } from '../../../../services/authService';
import { toast } from 'react-hot-toast';

const MyPlan = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Helper to determine card styling based on plan name
  const getCardStyle = (name) => {
    const lower = name.toLowerCase();

    if (lower.includes('platinum')) {
      return {
        container: 'bg-slate-900 border-slate-700 text-white',
        badge: 'bg-emerald-500 text-white',
        includes: 'text-slate-400',
        check: 'text-emerald-400',
        price: 'text-white',
        button: 'bg-white text-slate-900 hover:bg-slate-100'
      };
    }
    if (lower.includes('diamond')) {
      return {
        container: 'bg-indigo-50 border-indigo-100 text-indigo-900',
        badge: 'bg-emerald-500 text-white',
        includes: 'text-indigo-600',
        check: 'text-indigo-500',
        price: 'text-indigo-900',
        button: 'bg-indigo-600 text-white hover:bg-indigo-700'
      }
    }
    if (lower.includes('gold')) {
      return {
        container: 'bg-[#FEF9C3] border-yellow-200 text-[#854D0E]',
        badge: 'bg-[#22C55E] text-white',
        includes: 'text-[#854D0E] opacity-70',
        check: 'text-[#854D0E]',
        price: 'text-[#854D0E]',
        button: 'bg-[#854D0E] text-white hover:bg-amber-900'
      };
    }
    if (lower.includes('silver')) {
      return {
        container: 'bg-[#F1F5F9] border-slate-200 text-slate-800',
        badge: 'bg-[#22C55E] text-white',
        includes: 'text-slate-500',
        check: 'text-slate-400',
        price: 'text-slate-900',
        button: 'bg-slate-800 text-white hover:bg-slate-900'
      };
    }

    // Default
    return {
      container: 'bg-white border-gray-200 text-gray-800',
      badge: 'bg-emerald-500 text-white',
      includes: 'text-gray-500',
      check: 'text-primary-500',
      price: 'text-gray-900',
      button: 'bg-primary-600 text-white hover:bg-primary-700'
    };
  };

  const getPreviousPlanNote = (name) => {
    const lower = name.toLowerCase();
    if (lower.includes('platinum')) return 'Everything in Diamond & More';
    if (lower.includes('diamond')) return 'Everything in Gold & More';
    if (lower.includes('gold')) return 'Everything in Silver & More';
    return null;
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [plansRes, userRes] = await Promise.all([
        getPlans(),
        userAuthService.getProfile()
      ]);

      if (plansRes.success) setPlans(plansRes.data);
      if (userRes.success) setUser(userRes.user);

    } catch (error) {
      console.error(error);
      toast.error('Could not load data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-16">
      {/* Premium Standard Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/70 border-b border-slate-100 px-4 py-3 flex items-center gap-3 shadow-sm">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100 hover:bg-slate-50 transition-colors"
        >
          <FiArrowLeft className="w-4 h-4 text-slate-800" />
        </button>
        <h1 className="text-lg font-bold text-slate-900 tracking-tight">Subscription Plans</h1>
      </header>

      <main className="px-4 py-6 max-w-lg mx-auto">
        {/* Compact Hero Banner */}
        <div className="mb-6 bg-white border border-slate-100 p-5 rounded-2xl shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
          <h2 className="text-base font-extrabold text-slate-900 mb-1 tracking-tight">Pick Your Membership</h2>
          <p className="text-slate-500 font-bold text-[11px] leading-relaxed">
            Choose a plan that fits your home. Higher plans automatically include benefits from the tiers below them.
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-slate-400 border-t-transparent"></div>
          </div>
        ) : (
          <div className="space-y-5">
            {plans.map((plan) => {
              const style = getCardStyle(plan.name || '');
              const currentPlan = user?.plans;
              const isCurrent = currentPlan?.isActive && currentPlan?.name === plan.name;

              const userPlanPrice = currentPlan?.price || 0;
              const isUpgrade = currentPlan?.isActive && plan.price > userPlanPrice;
              const isDowngradeOrSame = currentPlan?.isActive && plan.price <= userPlanPrice && !isCurrent;
              const isDisabled = isCurrent || isDowngradeOrSame;

              let buttonText = `Select ${plan.name}`;
              if (isCurrent) buttonText = 'Current Plan';
              else if (isUpgrade) buttonText = 'Upgrade';

              return (
                <div
                  key={plan._id}
                  onClick={() => navigate(`/user/my-plan/${plan._id}`)}
                  className={`relative cursor-pointer rounded-2xl border transition-all flex flex-col overflow-hidden ${style.container}`}
                >
                  <div className="p-5 flex-1 relative">
                    {/* Top Row: Name and Status */}
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex flex-col">
                        <h3 className="text-lg font-extrabold tracking-tight">{plan.name}</h3>
                        {plan.tagline && (
                          <div className="mt-1 flex items-center">
                            <span className={`inline-block px-2 py-0.5 rounded text-[8px] font-black uppercase tracking-wider shadow-sm border ${
                              plan.name.toLowerCase().includes('platinum') 
                                ? 'bg-white/10 border-white/20 text-white' 
                                : 'bg-orange-50 border-orange-100 text-[#BB5F36]'
                            }`}>
                              {plan.tagline}
                            </span>
                          </div>
                        )}
                      </div>
                      {isCurrent && (
                        <span className={`px-2.5 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest ${style.badge}`}>
                          Active
                        </span>
                      )}
                    </div>

                    {/* Price and Duration */}
                    <div className="flex items-baseline mb-4">
                      <span className="text-xl font-black">₹{plan.price}</span>
                      <span className="text-[10px] font-bold opacity-50 ml-1.5">/ {plan.duration || '1'} Months</span>
                    </div>

                    {/* Benefits Section */}
                    <div className="space-y-4">
                      <ul className="space-y-2.5">
                        {(plan.freeCategories || []).map((cat, idx) => (
                          <li key={`cat-${idx}`} className="flex items-center gap-2">
                            <FiZap className="w-3.5 h-3.5 shrink-0 text-amber-500 fill-amber-500" />
                            <span className="text-xs font-bold text-slate-800">Free {cat.title || cat.name}</span>
                          </li>
                        ))}
                        {((() => {
                          const groups = new Map();
                          (plan.freeServices || []).forEach(svc => {
                            const cid = String(svc.categoryId?._id || svc.categoryId || 'unknown');
                            const tkey = (svc.title || '').trim().toLowerCase();
                            const key = `${cid}_${tkey}`;
                            if (!groups.has(key)) groups.set(key, svc);
                          });
                          
                          return Array.from(groups.values()).map((svc, idx) => {
                            const catTitle = svc.categoryId?.title || 'Service';
                            return (
                              <li key={`svc-${idx}`} className="flex items-center gap-2">
                                <FiZap className="w-3.5 h-3.5 shrink-0 text-amber-500 fill-amber-500" />
                                <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                                  <span className="text-[8px] font-black uppercase text-rose-500 bg-rose-50 px-1 py-0.5 rounded border border-rose-100 leading-none shrink-0">{catTitle}</span>
                                  <span className="text-xs font-extrabold text-slate-800 truncate">Free {svc.title || svc.name}</span>
                                </div>
                              </li>
                            );
                          });
                        })())}
                        
                        {(() => {
                          const planOrder = ['Silver', 'Gold', 'Platinum', 'Diamond'];
                          const currentName = plan.name || '';
                          const baseName = planOrder.find(p => currentName.toLowerCase().includes(p.toLowerCase()));
                          const currentIndex = baseName ? planOrder.indexOf(baseName) : -1;
                          const prevName = currentIndex > 0 ? planOrder[currentIndex - 1] : null;

                          if (!prevName) return null;

                          return (
                            <div className="mt-4 p-2 bg-slate-50 rounded-xl border border-dashed border-slate-200 flex items-center gap-1.5 text-slate-500">
                              <FiGift className="w-3.5 h-3.5 shrink-0" />
                              <p className="text-[9px] font-bold uppercase tracking-wider">
                                Benefits from <span className="underline decoration-1">{prevName}</span> Tier Included
                              </p>
                            </div>
                          );
                        })()}

                        {/* Inherited Tier Benefits */}
                        {(() => {
                          const groups = new Map();
                          (plan.bonusServices || []).forEach(bs => {
                            const svc = bs.serviceId;
                            if (!svc) return;
                            const cid = String(bs.categoryId?._id || bs.categoryId || svc.categoryId?._id || svc.categoryId || 'unknown');
                            const tkey = (svc.title || '').trim().toLowerCase();
                            const key = `${cid}_${tkey}`;
                            if (!groups.has(key)) {
                              groups.set(key, bs);
                            }
                          });
                          
                          return Array.from(groups.values()).map((bs, idx) => {
                            const svc = bs.serviceId;
                            if (!svc) return null;
                            const catTitle = bs.categoryId?.title || svc.categoryId?.title || 'Service';
                            
                            return (
                              <li key={idx} className="flex items-start gap-2.5 p-2 bg-amber-50/50 rounded-lg border border-amber-100 shadow-[0_1px_3px_rgba(0,0,0,0.01)]">
                                <div className="mt-0.5 w-4 h-4 bg-amber-100 text-amber-600 rounded flex items-center justify-center shrink-0">
                                  <FiStar className="w-2.5 h-2.5 fill-amber-600" />
                                </div>
                                <div className="flex flex-col gap-0.5 min-w-0">
                                  <div className="flex items-center gap-1.5 flex-wrap min-w-0">
                                    <span className="text-[8px] font-black uppercase text-amber-500 bg-amber-50 px-1 py-0.5 rounded border border-amber-100 leading-none shrink-0">{catTitle}</span>
                                    <span className="text-xs font-extrabold text-slate-800 truncate">Free {svc.title}</span>
                                  </div>
                                  <span className="text-[8px] font-black uppercase tracking-wider text-[#854D0E] opacity-40">Inherited benefit</span>
                                </div>
                              </li>
                            );
                          });
                        })()}
                      </ul>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="px-5 pb-5 mt-auto">
                    {plan.description && (
                      <div className={`mb-4 p-3 rounded-xl border-l-[3px] shadow-[0_1px_3px_rgba(0,0,0,0.01)] flex items-start gap-3 transition-all duration-300 ${
                        plan.name.toLowerCase().includes('platinum') 
                          ? 'bg-white/5 border-emerald-400' 
                          : 'bg-slate-50 border-slate-300'
                      }`}>
                         <p className={`text-[10px] font-semibold leading-relaxed ${
                            plan.name.toLowerCase().includes('platinum') 
                              ? 'text-slate-300' 
                              : 'text-slate-500'
                         }`}>
                           {plan.description}
                         </p>
                      </div>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/user/my-plan/${plan._id}`);
                      }}
                      className={`w-full py-2.5 px-4 rounded-xl font-black text-[10px] uppercase tracking-wider shadow-sm transition-all active:scale-95 ${style.button} ${isDisabled && !isCurrent ? 'opacity-50 grayscale cursor-not-allowed' : ''}`}
                    >
                      {buttonText}
                    </button>
                    {isCurrent && (
                       <p className="text-center text-[8px] font-black uppercase tracking-widest opacity-35 mt-2">Membership In Good Standing</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {plans.length === 0 && !loading && (
          <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-200 shadow-[inset_0_2px_8px_rgba(0,0,0,0.01)] p-6">
            <FiStar className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-400 font-bold text-xs">No subscription plans found at this time.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default MyPlan;

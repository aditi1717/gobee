import React, { useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiCheckCircle, FiUsers, FiShield, FiClock, FiAward, FiHeart, FiGlobe, FiSmile, FiSmartphone } from 'react-icons/fi';
import { gsap } from 'gsap';
import Logo from '../../../../components/common/Logo';

const AboutGoBee = () => {
  const navigate = useNavigate();
  const containerRef = useRef(null);

  useEffect(() => {
    // Simple entrance animation
    const ctx = gsap.context(() => {
      gsap.from('.animate-item', {
        y: 20,
        opacity: 0,
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out'
      });
    }, containerRef);

    return () => ctx.revert();
  }, []);

  // Gradient Definition for re-use in inline styles
  const gobeeGradient = 'linear-gradient(135deg, #347989 0%, #BB5F36 100%)';
  const gobeeTextGradient = {
    background: gobeeGradient,
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  };

  const features = [
    {
      icon: FiUsers,
      title: 'Expert Providers',
      description: 'Verified professionals for all your needs'
    },
    {
      icon: FiShield,
      title: 'Safe & Secure',
      description: 'Your safety is our top priority'
    },
    {
      icon: FiClock,
      title: 'On-Time Service',
      description: 'Punctual delivery at your convenience'
    },
    {
      icon: FiAward,
      title: 'Quality Assured',
      description: 'Service with 100% satisfaction guarantee'
    }
  ];

  const stats = [
    { number: '10K+', label: 'Happy Customers' },
    { number: '500+', label: 'Service Partners' },
    { number: '4.8', label: 'App Rating' },
  ];

  return (
    <div ref={containerRef} className="min-h-screen bg-[#F8FAFC] pb-16">
      {/* SVG Gradient Definition */}
      <svg width="0" height="0" className="absolute">
        <linearGradient id="gobee-about-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#347989" />
          <stop offset="50%" stopColor="#D68F35" />
          <stop offset="100%" stopColor="#BB5F36" />
        </linearGradient>
      </svg>

      {/* Premium Standard Header */}
      <header className="sticky top-0 z-40 backdrop-blur-xl bg-white/70 border-b border-slate-100 px-4 py-3 flex items-center gap-3 shadow-sm">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 bg-white rounded-xl flex items-center justify-center shadow-sm border border-slate-100 hover:bg-slate-50 transition-colors"
        >
          <FiArrowLeft className="w-4 h-4 text-slate-800" />
        </button>
        <h1 className="text-lg font-bold text-slate-900 tracking-tight">About Go Bee</h1>
      </header>

      <main className="px-4 py-6 space-y-6 max-w-lg mx-auto">
        {/* Hero Section */}
        <div className="animate-item text-center">
          <div className="relative w-24 h-24 mx-auto mb-4">
            {/* Spinning Border */}
            <div
              className="absolute inset-[-2px] rounded-full opacity-70"
              style={{
                background: 'conic-gradient(from 0deg, #347989, #D68F35, #BB5F36, #347989)',
                animation: 'spin 4s linear infinite',
              }}
            />
            {/* White Background */}
            <div className="absolute inset-0 bg-white rounded-full shadow-sm flex items-center justify-center">
              <Logo className="w-14 h-14 object-contain" />
            </div>
          </div>

          <h2 className="text-xl font-extrabold text-slate-900 mb-1">
            Welcome to <span style={gobeeTextGradient}>Go Bee</span>
          </h2>
          <p className="text-slate-500 font-bold text-xs max-w-xs mx-auto leading-relaxed">
            Your trusted partner for premium home and personal care services.
          </p>
        </div>

        {/* Stats Row */}
        <div className="animate-item flex justify-between bg-white rounded-2xl p-4 border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.01)] divide-x divide-slate-100">
          {stats.map((stat, idx) => (
            <div key={idx} className="flex-1 text-center px-1">
              <div className="text-lg font-black bg-clip-text text-transparent bg-gradient-to-r from-[#347989] to-[#BB5F36]">
                {stat.number}
              </div>
              <div className="text-[8px] uppercase tracking-wider text-slate-450 font-extrabold mt-0.5">
                {stat.label}
              </div>
            </div>
          ))}
        </div>

        {/* Mission Statement */}
        <div className="animate-item">
          <div className="bg-white rounded-2xl p-5 border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.01)] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
              <FiGlobe className="w-20 h-20" />
            </div>
            <h3 className="text-sm font-extrabold text-slate-900 mb-2">Our Mission</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-semibold relative z-10">
              Go Bee is dedicated to revolutionizing how you experience home services. We connect you with top-tier professionals to deliver safe, reliable, and high-quality services right at your doorstep. We believe in making life simpler, one service at a time.
            </p>
          </div>
        </div>

        {/* Why Choose Us Grid */}
        <div className="animate-item">
          <h3 className="text-sm font-extrabold text-slate-900 mb-3 px-1">Why Choose Go Bee?</h3>
          <div className="grid grid-cols-2 gap-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl p-4 border border-slate-100 hover:shadow-[0_4px_12px_rgba(0,0,0,0.02)] shadow-[0_2px_8px_rgba(0,0,0,0.01)] transition-all duration-300 group"
              >
                <div className="w-9 h-9 rounded-xl flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-300"
                  style={{ background: 'linear-gradient(135deg, rgba(52, 121, 137, 0.08), rgba(187, 95, 54, 0.08))' }}>
                  <feature.icon className="w-4.5 h-4.5" style={{ stroke: 'url(#gobee-about-gradient)' }} />
                </div>
                <h4 className="text-xs font-extrabold text-slate-900 mb-1">{feature.title}</h4>
                <p className="text-[10px] text-slate-500 font-semibold leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="animate-item">
          <h3 className="text-sm font-extrabold text-slate-900 mb-3 px-1">How We Work</h3>
          <div className="bg-white rounded-2xl p-1 border border-slate-100 shadow-[0_2px_8px_rgba(0,0,0,0.01)]">
            {[
              { title: 'Book Details', desc: 'Select service & schedule time', icon: FiSmartphone },
              { title: 'Get Matched', desc: 'We assign a top-rated pro', icon: FiUsers },
              { title: 'Relax', desc: 'Enjoy high-quality service', icon: FiSmile },
            ].map((step, i) => (
              <div key={i} className="flex items-center p-3.5 border-b last:border-0 border-slate-50 relative">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mr-3 shadow-sm text-white font-bold text-xs relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#347989] to-[#BB5F36]" />
                  <span className="relative z-10">{i + 1}</span>
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-slate-900">{step.title}</h4>
                  <p className="text-[10px] text-slate-400 font-bold">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer Info */}
        <div className="animate-item text-center pt-5 border-t border-slate-200">
          <p className="text-[10px] text-slate-400 mb-0.5 font-bold uppercase tracking-wider">Designed & Developed by</p>
          <span className="text-xs font-extrabold tracking-wide" style={gobeeTextGradient}>Go Bee Team</span>
          <p className="text-[8px] text-slate-400 uppercase tracking-widest font-black mt-4">v7.6.27 • Made with ❤️ in India</p>
        </div>
      </main>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AboutGoBee;

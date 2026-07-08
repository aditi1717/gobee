import React from 'react';
import CategoryCard from '../../../components/common/CategoryCard';
import electricianIcon from '../../../../../assets/images/icons/services/electrician.png';
import womensSalonIcon from '../../../../../assets/images/icons/services/womens-salon-spa-icon.png';
import massageMenIcon from '../../../../../assets/images/icons/services/massage-men-icon.png';
import cleaningIcon from '../../../../../assets/images/icons/services/cleaning-icon.png';
import electricianPlumberIcon from '../../../../../assets/images/icons/services/electrician-plumber-carpenter-icon.png';
import acApplianceRepairIcon from '../../../../../assets/images/icons/services/ac-appliance-repair-icon.png';
import { themeColors } from '../../../../../theme';

const toAssetUrl = (url) => {
  if (!url) return '';
  const clean = url.replace('/api/upload', '/upload');
  if (clean.startsWith('http')) return clean;
  const base = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000').replace(/\/api$/, '');
  return `${base}${clean.startsWith('/') ? '' : '/'}${clean}`;
};

const ServiceCategories = React.memo(({ categories, onCategoryClick, onSeeAllClick }) => {


  if (!Array.isArray(categories) || categories.length === 0) {
    return null;
  }

  const serviceCategories = categories.map((cat) => ({
    ...cat,
    icon: toAssetUrl(cat.icon || cat.image),
  }));

  return (
    <div className="px-5">
      {/* Section Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex flex-col">
          <h2 className="text-[20px] font-extrabold text-gray-900 tracking-tight">
            Service Categories
          </h2>
          <p className="text-[9px] text-slate-400 font-extrabold uppercase tracking-[0.2em] mt-0.5">
            Premium Home Services
          </p>
        </div>
      </div>

      {/* Professional Grid Layout */}
      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-y-4.5 gap-x-1.5">
        {serviceCategories.map((category, index) => {
          const iconSrc = toAssetUrl(category.icon || category.image);
          return (
            <div key={category.id || index} className="flex justify-center h-full">
              <CategoryCard
                title={category.title}
                icon={
                  <img
                    src={iconSrc}
                    alt={category.title}
                    className="w-10 h-10 object-contain transition-transform duration-300 ease-out group-hover:scale-110 will-change-transform"
                    loading="lazy"
                    decoding="async"
                  />
                }
                onClick={() => onCategoryClick?.(category)}
                hasSaleBadge={category.hasSaleBadge}
                index={index}
              />
            </div>
          );
        })}
      </div>

      {/* Subtle Bottom Separator */}
      <div className="mt-10 h-[1px] w-full bg-gradient-to-r from-transparent via-gray-100 to-transparent"></div>
    </div>
  );
});

ServiceCategories.displayName = 'ServiceCategories';

export default ServiceCategories;


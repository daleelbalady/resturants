import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin, Phone, Globe, Star, CheckCircle, Image as ImageIcon, X, ChevronRight, ChevronLeft } from 'lucide-react';
import { Shop } from '../types';
import { useConfig } from '../contexts/ConfigContext';

interface ShopHeaderProps {
  shop: Shop;
}

const MotionDiv = motion.div as any;
const MotionP = motion.p as any;
const MotionImg = motion.img as any;

export const ShopHeader: React.FC<ShopHeaderProps> = ({ shop }) => {
  const { translations, language, theme } = useConfig();
  const t = translations;
  const [showMap, setShowMap] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  return (
    <div className="relative bg-white dark:bg-zinc-950 rounded-b-[2rem] shadow-xl overflow-hidden mb-8">
      {/* Cover Image Parallax */}
      <MotionDiv
        initial={{ scale: 1.1 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.8 }}
        className="h-64 sm:h-80 w-full relative overflow-hidden"
      >
        <img
          src={shop.coverImage}
          alt="Cover"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
      </MotionDiv>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 -mt-16 sm:-mt-20 pb-8">
        <div className="flex flex-col sm:flex-row items-start gap-4 sm:gap-6">
          {/* Logo */}
          <MotionDiv
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-white dark:border-zinc-900 shadow-xl overflow-hidden bg-white flex-shrink-0"
          >
            <img src={shop.logoImage} alt="Logo" className="w-full h-full object-cover" />
          </MotionDiv>

          {/* Text Content */}
          <div className="flex-1 sm:pt-10">
            <MotionDiv
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="flex items-center gap-2 mb-1"
            >
              {/* Using mix-blend-difference to ensure visibility on both dark cover and white background */}
              <h1 className="text-3xl sm:text-4xl font-black text-white mix-blend-difference drop-shadow-sm">
                {language === 'ar' && shop.name_ar ? shop.name_ar : shop.name}
              </h1>
              {shop.isVerified && (
                <div className="text-blue-500 bg-white dark:bg-zinc-800 rounded-full p-0.5" title={t.verified[language]}>
                  <CheckCircle className="w-5 h-5 fill-current" />
                </div>
              )}
            </MotionDiv>

            <MotionP
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-gray-600 dark:text-gray-400 text-sm sm:text-base leading-relaxed max-w-2xl mb-4"
            >
              {language === 'ar' && shop.description_ar ? shop.description_ar : shop.description}
            </MotionP>

            {/* Stats & Actions */}
            <MotionDiv
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="flex flex-wrap items-center gap-4 text-sm"
            >
              <div className="flex items-center gap-1 bg-gray-100 dark:bg-zinc-800 px-3 py-1.5 rounded-full">
                <Star className="w-4 h-4 text-gold-500 fill-current" />
                <span className="font-bold text-gray-900 dark:text-white">{shop.rating}</span>
                <span className="text-gray-500">({shop.reviewCount})</span>
              </div>

              <a href={`tel:${shop.phone}`} className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gold-500 transition-colors">
                <Phone className="w-4 h-4" />
                <span className="hidden sm:inline">{shop.phone}</span>
              </a>

              <a href={`https://${shop.website}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gold-500 transition-colors">
                <Globe className="w-4 h-4" />
                <span className="hidden sm:inline">{shop.website}</span>
              </a>

              <button
                onClick={() => setShowMap(!showMap)}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full transition-all ${showMap ? 'bg-gold-500 text-white' : 'bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-zinc-700'}`}
              >
                <MapPin className="w-4 h-4" />
                {t.viewMap[language]}
              </button>
            </MotionDiv>
          </div>
        </div>

        {/* Gallery Preview */}
        {shop.galleryImages && shop.galleryImages.length > 0 && (
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-8 overflow-hidden"
          >
            <div className="flex items-center gap-2 mb-3">
              <ImageIcon className="w-4 h-4 text-gold-500" />
              <h3 className="text-sm font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">{t.gallery[language]}</h3>
            </div>
            <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2 snap-x">
              {shop.galleryImages.map((img, idx) => (
                <MotionDiv
                  key={idx}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setSelectedImage(img)}
                  className="flex-shrink-0 w-32 h-24 sm:w-48 sm:h-32 rounded-xl overflow-hidden cursor-pointer shadow-md snap-start"
                >
                  <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
                </MotionDiv>
              ))}
            </div>
          </MotionDiv>
        )}

        {/* Map View */}
        <AnimatePresence>
          {showMap && (
            <MotionDiv
              initial={{ height: 0, opacity: 0, marginTop: 0 }}
              animate={{ height: 'auto', opacity: 1, marginTop: 24 }}
              exit={{ height: 0, opacity: 0, marginTop: 0 }}
              className="overflow-hidden rounded-2xl border border-gray-200 dark:border-zinc-800 shadow-inner"
            >
              <div className="w-full h-64 sm:h-80 relative bg-gray-100 dark:bg-zinc-800">
                <iframe
                  width="100%"
                  height="100%"
                  frameBorder="0"
                  scrolling="no"
                  marginHeight={0}
                  marginWidth={0}
                  src={`https://maps.google.com/maps?q=${shop.locationLat},${shop.locationLon}&z=15&output=embed`}
                  className={`w-full h-full ${theme === 'dark' ? 'invert-[.90] hue-rotate-180 contrast-[.9] grayscale-[.2]' : ''}`}
                  style={{ border: 0 }}
                ></iframe>
                <div className="absolute bottom-4 right-4 bg-white dark:bg-zinc-900 px-4 py-2 rounded-lg shadow-lg text-xs font-bold text-gray-900 dark:text-white z-10 pointer-events-none">
                  {shop.city}
                </div>
              </div>
            </MotionDiv>
          )}
        </AnimatePresence>
      </div>

      {/* Lightbox for Gallery */}
      <AnimatePresence>
        {selectedImage && (
          <MotionDiv
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 backdrop-blur-sm"
            onClick={() => setSelectedImage(null)}
          >
            <button className="absolute top-4 right-4 text-white p-2 bg-white/10 rounded-full hover:bg-white/20">
              <X className="w-6 h-6" />
            </button>
            <MotionImg
              layoutId={`gallery-image-${selectedImage}`}
              src={selectedImage}
              alt="Gallery Fullscreen"
              className="max-w-full max-h-[90vh] rounded-lg shadow-2xl"
              onClick={(e: React.MouseEvent<HTMLImageElement, MouseEvent>) => e.stopPropagation()}
            />
          </MotionDiv>
        )}
      </AnimatePresence>
    </div>
  );
};
import React from 'react';
import { motion } from 'framer-motion';
import { Star, Plus } from 'lucide-react';
import { MenuItem } from '../types';
import { useConfig } from '../contexts/ConfigContext';

interface ProductCardProps {
  product: MenuItem;
  onSelect: (product: MenuItem) => void;
}

const MotionDiv = motion.div as any;
const MotionImg = motion.img as any;
const MotionH3 = motion.h3 as any;
const MotionP = motion.p as any;
const MotionButton = motion.button as any;

export const ProductCard: React.FC<ProductCardProps> = ({ product, onSelect }) => {
  const { translations, language } = useConfig();
  const t = translations;

  return (
    <MotionDiv
      layoutId={`card-container-${product.id}`}
      onClick={() => onSelect(product)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      whileHover={{ y: -5, transition: { duration: 0.2 } }}
      className="group cursor-pointer relative bg-white dark:bg-zinc-900 rounded-3xl overflow-hidden shadow-lg border border-gray-100 dark:border-zinc-800"
    >
      {/* Image Container */}
      <MotionDiv 
        layoutId={`image-container-${product.id}`}
        className="relative h-56 w-full overflow-hidden"
      >
        <MotionImg
          layoutId={`image-${product.id}`}
          src={product.image}
          alt={product.name[language]}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        {product.isPopular && (
            <div className="absolute top-3 right-3 bg-gold-500 text-white text-[10px] font-bold px-2 py-1 rounded-full shadow-lg">
                POPULAR
            </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60" />
      </MotionDiv>

      {/* Content */}
      <MotionDiv 
        layoutId={`content-container-${product.id}`}
        className="p-5"
      >
        <div className="flex justify-between items-start mb-1">
            <MotionH3 
                layoutId={`title-${product.id}`}
                className="text-lg font-bold text-gray-900 dark:text-white line-clamp-1"
            >
                {product.name[language]}
            </MotionH3>
        </div>
        
        <MotionP 
            layoutId={`description-${product.id}`}
            className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2 mb-4 h-10 leading-relaxed"
        >
            {product.description[language]}
        </MotionP>

        <div className="flex items-center justify-between mt-auto">
            <MotionDiv 
                layoutId={`price-${product.id}`}
                className="flex flex-col"
            >   
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{t.from[language]}</span>
                <div className="flex items-baseline gap-1">
                    <span className="text-xl font-bold text-gold-600 dark:text-gold-500">{product.basePrice}</span>
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">{t.currency[language]}</span>
                </div>
            </MotionDiv>

            <MotionButton
                whileTap={{ scale: 0.9 }}
                className="bg-gray-100 dark:bg-zinc-800 hover:bg-gray-200 dark:hover:bg-zinc-700 text-gray-900 dark:text-white p-2.5 rounded-full shadow-sm transition-colors"
            >
                <Plus className="w-5 h-5" />
            </MotionButton>
        </div>
      </MotionDiv>
    </MotionDiv>
  );
};
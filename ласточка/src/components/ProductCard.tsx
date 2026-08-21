import React, { useState } from 'react';
import { Heart, ShoppingBag, Eye, HelpCircle, Package, ArrowLeft, ArrowRight } from 'lucide-react';
import { Product } from '../types';
import { getCleanImage } from '../data';
import { motion, AnimatePresence } from 'motion/react';
import { maybeTranslate } from '../lib/translator';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
  onAddToCart: (product: Product, size: string, color: string) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
  lang: 'ru' | 'ua';
  showPriceMargin?: boolean; // Manager profits preview!
}

export default function ProductCard({
  product,
  onViewDetails,
  onAddToCart,
  isFavorite,
  onToggleFavorite,
  lang,
  showPriceMargin = false
}: ProductCardProps) {
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const t = {
    ru: {
      stock: 'В наличии',
      outOfStock: 'Под заказ',
      quickAdd: 'В корзину',
      vendor: 'Артикул',
      code: 'Код',
      profit: 'Прибыль',
      sizes: 'Размеры'
    },
    ua: {
      stock: 'В наявності',
      outOfStock: 'Під замовлення',
      quickAdd: 'У кошик',
      vendor: 'Артикул',
      code: 'Код',
      profit: 'Прибуток',
      sizes: 'Розміри'
    }
  }[lang];

  // Colors list extraction
  const colorsList = product.color ? product.color.split(',').map(s => s.trim()) : [];
  // Sizes list extraction
  const sizesList = product.sizes ? product.sizes.split(',').map(s => s.trim()) : [];

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.photo && product.photo.length > 1) {
      setCurrentImageIdx((prev) => (prev + 1) % product.photo.length);
    }
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.photo && product.photo.length > 1) {
      setCurrentImageIdx((prev) => (prev - 1 + product.photo.length) % product.photo.length);
    }
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Use first available size and color
    const defaultSize = sizesList[0] || 'Unisex';
    const defaultColor = colorsList[0] || product.color || 'Default';
    onAddToCart(product, defaultSize, defaultColor);
  };

  // Calc profit margin for Store Manager Mode
  const profit = product.price - product.purchase_price;
  const marginPercent = Math.round((profit / product.price) * 100) || 0;

  const currentImgUrl = getCleanImage(product, currentImageIdx);

  return (
    <motion.div
      id={`product-card-${product.id}`}
      layout
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setCurrentImageIdx(0);
      }}
      className="group bg-white rounded-xl border border-gray-200/80 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full relative"
    >
      {/* Code Badge */}
      <div className="absolute top-2 left-2 z-20 flex flex-col gap-1">
        <span className="px-2 py-0.5 bg-black/70 text-[9px] font-mono tracking-wider uppercase text-white rounded">
          {product.product_code}
        </span>
        
        {product.cup_type && (
          <span className="px-2 py-0.5 bg-[#e02484] text-[9px] font-bold text-white rounded">
            {product.cup_type}
          </span>
        )}
      </div>

      {/* Image Gallery Stage */}
      <div 
        className="relative aspect-[4/5] sm:aspect-[3/4] bg-neutral-50 overflow-hidden cursor-pointer border-b border-gray-100"
        onClick={() => onViewDetails(product)}
      >
        {/* Main Image */}
        <div className="w-full h-full relative">
          <img
            src={currentImgUrl}
            alt={product.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              const categoryFallback = getCleanImage({ ...product, photo: [] }, currentImageIdx);
              if (target.src !== categoryFallback) {
                target.src = categoryFallback;
              } else {
                target.src = 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=600&auto=format&fit=crop';
              }
            }}
          />
        </div>

        {/* Carousel arrows */}
        {product.photo && product.photo.length > 1 && isHovered && (
          <div className="absolute inset-x-2 top-1/2 -translate-y-1/2 flex justify-between items-center z-10 pointer-events-none">
            <button
              onClick={handlePrevImage}
              className="p-1 bg-[#e02484] hover:bg-[#c0146f] text-white rounded-full shadow-md transition-all pointer-events-auto"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleNextImage}
              className="p-1 bg-[#e02484] hover:bg-[#c0146f] text-white rounded-full shadow-md transition-all pointer-events-auto"
            >
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Carousel indicators */}
        {product.photo && product.photo.length > 1 && (
          <div className="absolute bottom-2 inset-x-0 flex justify-center gap-1 z-10 pointer-events-none">
            {product.photo.map((_, idx) => (
              <span
                key={idx}
                className={`w-1.5 h-1.5 rounded-full transition-all duration-350 ${
                  idx === currentImageIdx ? 'bg-[#e02484] w-3' : 'bg-black/20'
                }`}
              />
            ))}
          </div>
        )}
      </div>

      {/* Info Container */}
      <div className="p-2.5 sm:p-4 flex flex-col flex-1 bg-white">
        {/* Code & Availability bar */}
        <div className="flex items-center justify-between text-[9px] sm:text-[10px] text-gray-400 mb-1 font-mono">
          <span>{showPriceMargin && product.vendor_code && product.vendor_code !== '---' ? `${t.vendor}: ${product.vendor_code}` : ''}</span>
          <span className="flex items-center gap-1 font-semibold text-emerald-600">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            {t.stock}
          </span>
        </div>

        {/* Name in Elegant Hot Pink color! */}
        <h3 
          onClick={() => onViewDetails(product)}
          className="font-sans font-semibold text-xs sm:text-sm text-[#e02484] hover:text-[#c0146f] line-clamp-2 transition-colors cursor-pointer mb-1 sm:mb-2 min-h-[32px] sm:min-h-[40px] leading-snug"
        >
          {maybeTranslate(product.name, lang)}
        </h3>

        {/* Small parameter specifications text from product info */}
        <p className="text-[10px] sm:text-[11px] text-gray-500 line-clamp-2 mb-2 sm:mb-3 leading-tight sm:leading-relaxed">
          {product.color ? `${lang === 'ru' ? 'Цвет' : 'Колір'}: ${maybeTranslate(product.color, lang)}. ` : ''}
          {product.sizes ? `${lang === 'ru' ? 'Размеры' : 'Розміри'}: ${product.sizes}. ` : ''}
          {product.name.includes('Код') ? maybeTranslate(product.name.split('.').slice(1).join('.'), lang) : ''}
        </p>

        {/* Margin Profits / Manager mode info */}
        {showPriceMargin && (
          <div className="p-2 mb-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg text-[10px] sm:text-[11px] font-mono flex items-center justify-between">
            <span>{t.profit}: <strong>{profit.toFixed(0)} ₴</strong></span>
            <span className="bg-emerald-600 text-white px-1.5 py-0.5 rounded text-[8px] sm:text-[9px] font-bold">
              +{marginPercent}%
            </span>
          </div>
        )}

        {/* Price display in elegant black bold text */}
        <div className="mt-auto pt-2 sm:pt-3 border-t border-gray-100 flex flex-col gap-2 sm:gap-3">
          <div className="text-sm sm:text-base font-extrabold text-gray-900 font-sans">
            {product.price.toLocaleString('uk-UA')} грн
          </div>
          
          {/* Action buttons divided precisely as in screenshot: [Купить (wide)] [Heart] [Details] in hot pink */}
          <div className="grid grid-cols-4 gap-1 sm:gap-1.5">
            {/* Main Purchase Button */}
            <button
              onClick={handleQuickAdd}
              className="col-span-2 py-1.5 sm:py-2 bg-[#e02484] hover:bg-[#c0146f] text-white rounded font-bold text-[9px] sm:text-xs flex items-center justify-center gap-1 sm:gap-1.5 transition-all shadow-sm active:scale-95 cursor-pointer uppercase tracking-wider"
            >
              <ShoppingBag className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
              <span>{lang === 'ru' ? 'Купить' : 'Купити'}</span>
            </button>

            {/* Favorite toggle Button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite(product.id);
              }}
              className={`py-1.5 sm:py-2 rounded flex items-center justify-center transition-all shadow-sm active:scale-95 cursor-pointer border ${
                isFavorite 
                  ? 'bg-[#e02484] border-[#e02484] text-white' 
                  : 'bg-[#fdf2f8] border-pink-100 text-[#e02484] hover:bg-[#e02484] hover:text-white'
              }`}
              title={lang === 'ru' ? 'В избранное' : 'До обраного'}
            >
              <Heart className={`w-3 sm:w-3.5 h-3 sm:h-3.5 ${isFavorite ? 'fill-white' : ''}`} />
            </button>

            {/* View Details Button */}
            <button
              onClick={() => onViewDetails(product)}
              className="py-1.5 sm:py-2 bg-[#fdf2f8] border border-pink-100 text-[#e02484] hover:bg-[#e02484] hover:text-white rounded flex items-center justify-center transition-all shadow-sm active:scale-95 cursor-pointer"
              title={lang === 'ru' ? 'Подробнее' : 'Детальніше'}
            >
              <Eye className="w-3 sm:w-3.5 h-3 sm:h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

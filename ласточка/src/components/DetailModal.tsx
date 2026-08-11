import React, { useState, useEffect } from 'react';
import { X, Heart, ShoppingBag, ArrowLeft, ArrowRight, Truck, ShieldCheck, RefreshCcw } from 'lucide-react';
import { Product } from '../types';
import { getCleanImage } from '../data';
import { motion, AnimatePresence } from 'motion/react';
import { maybeTranslate } from '../lib/translator';

interface DetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, size: string, color: string, qty: number) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: number) => void;
  lang: 'ru' | 'ua';
  showPriceMargin?: boolean;
}

export default function DetailModal({
  product,
  isOpen,
  onClose,
  onAddToCart,
  isFavorite,
  onToggleFavorite,
  lang,
  showPriceMargin = false
}: DetailModalProps) {
  const [currentImgIdx, setCurrentImgIdx] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [addedMessage, setAddedMessage] = useState(false);

  // Initialize selections when product opens
  useEffect(() => {
    if (product) {
      setCurrentImgIdx(0);
      setQuantity(1);
      setAddedMessage(false);
      
      const sizesList = product.sizes ? product.sizes.split(',').map(s => s.trim()) : [];
      setSelectedSize(sizesList[0] || 'Unisex');
      
      const colorsList = product.color ? product.color.split(',').map(s => s.trim()) : [];
      setSelectedColor(colorsList[0] || product.color || 'Default');
    }
  }, [product, isOpen]);

  if (!isOpen || !product) return null;

  const t = {
    ru: {
      code: 'Код товара',
      vendor: 'Артикул',
      colorLabel: 'Цвет',
      sizesLabel: 'Выберите размер',
      colorsLabel: 'Выберите цвет',
      stock: 'В наличии',
      qty: 'Количество',
      addBtn: 'Добавить в корзину',
      added: 'Добавлено!',
      features: {
        delivery: 'Быстрая доставка по всей Украине (Новая Почта / Укрпочта)',
        secure: '100% безопасная оплата или наложенный платеж',
        exchange: 'Обмен и возврат в течение 14 дней'
      },
      specs: 'Характеристики',
      costPrice: 'Себестоимость',
      retailPrice: 'Розничная цена',
      margin: 'Прибыль'
    },
    ua: {
      code: 'Код товару',
      vendor: 'Артикул',
      colorLabel: 'Колір',
      sizesLabel: 'Оберіть розмір',
      colorsLabel: 'Оберіть колір',
      stock: 'В наявності',
      qty: 'Кількість',
      addBtn: 'Додати до кошика',
      added: 'Додано!',
      features: {
        delivery: 'Швидка доставка по всій Україні (Нова Пошта / Укрпошта)',
        secure: '100% безпечна оплата або післяплата',
        exchange: 'Обмін та повернення протягом 14 днів'
      },
      specs: 'Характеристики',
      costPrice: 'Собівартість',
      retailPrice: 'Роздрібна ціна',
      margin: 'Прибуток'
    }
  }[lang];

  const colorsList = product.color ? product.color.split(',').map(s => s.trim()) : [];
  const sizesList = product.sizes ? product.sizes.split(',').map(s => s.trim()) : [];

  const handleNextImg = () => {
    if (product.photo && product.photo.length > 1) {
      setCurrentImgIdx((prev) => (prev + 1) % product.photo.length);
    }
  };

  const handlePrevImg = () => {
    if (product.photo && product.photo.length > 1) {
      setCurrentImgIdx((prev) => (prev - 1 + product.photo.length) % product.photo.length);
    }
  };

  const handleAddToCart = () => {
    onAddToCart(product, selectedSize, selectedColor, quantity);
    setAddedMessage(true);
    setTimeout(() => {
      setAddedMessage(false);
    }, 2000);
  };

  const profit = product.price - product.purchase_price;
  const profitMargin = Math.round((profit / product.price) * 100) || 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="w-full max-w-4xl bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[95vh]"
      >
        
        {/* Close button - absolute position for better accessibility on mobile */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 p-2 bg-white/80 hover:bg-white text-gray-800 rounded-full shadow-lg border border-gray-200 transition-all cursor-pointer backdrop-blur-sm"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Column: Interactive Image Carousel */}
        <div className="w-full md:w-1/2 bg-gray-50 relative flex flex-col justify-between min-h-[220px] md:min-h-0 border-r border-gray-100">
          
          {/* Main Image View */}
          <div className="relative w-full md:aspect-auto md:flex-1 flex items-center justify-center bg-gray-50 h-[320px] sm:h-[400px] md:h-full overflow-hidden">
            <img
              src={getCleanImage(product, currentImgIdx)}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-contain"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                const categoryFallback = getCleanImage({ ...product, photo: [] }, currentImgIdx);
                if (target.src !== categoryFallback) {
                  target.src = categoryFallback;
                } else {
                  target.src = 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=600&auto=format&fit=crop';
                }
              }}
            />

            {/* Left/Right controls */}
            {product.photo && product.photo.length > 1 && (
              <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between z-10">
                <button
                  onClick={handlePrevImg}
                  className="p-2 bg-[#e02484]/90 hover:bg-[#e02484] text-white rounded-full shadow-md transition-all cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNextImg}
                  className="p-2 bg-[#e02484]/90 hover:bg-[#e02484] text-white rounded-full shadow-md transition-all cursor-pointer"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}
            
            {/* Carousel Index Badge */}
            {product.photo && product.photo.length > 1 && (
              <div className="absolute bottom-4 right-4 px-2.5 py-1 bg-black/70 text-[11px] font-mono font-bold text-white rounded-md">
                {currentImgIdx + 1} / {product.photo.length}
              </div>
            )}
          </div>

          {/* Thumbnail Strip */}
          {product.photo && product.photo.length > 1 && (
            <div className="p-2 bg-white border-t border-gray-200 flex gap-2 overflow-x-auto justify-start shrink-0">
              {product.photo.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImgIdx(idx)}
                  className={`w-9 h-9 shrink-0 rounded overflow-hidden border-2 transition-all cursor-pointer ${
                    idx === currentImgIdx ? 'border-[#e02484] scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img
                    src={getCleanImage(product, idx)}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Information & Add to Cart Forms */}
        <div className="w-full md:w-1/2 p-4 md:p-8 flex flex-col overflow-y-auto font-sans bg-white text-gray-800">
          
          {/* Top Row: Close and Favorite toggler */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-md">
              {t.stock} ({product.stock} {lang === 'ru' ? 'шт' : 'шт'})
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onToggleFavorite(product.id)}
                className={`p-2 rounded-full border transition-all cursor-pointer ${
                  isFavorite 
                    ? 'bg-pink-50 border-pink-200 text-[#e02484]' 
                    : 'bg-white border-gray-200 text-gray-400 hover:text-[#e02484] hover:bg-pink-50'
                }`}
                title={lang === 'ru' ? 'В избранное' : 'У вибране'}
              >
                <Heart className={`w-4 h-4 ${isFavorite ? 'fill-[#e02484]' : ''}`} />
              </button>
              <button
                onClick={onClose}
                className="p-2 bg-white hover:bg-gray-100 text-gray-400 hover:text-gray-700 rounded-full transition-colors border border-gray-200 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Name & Product codes */}
          <h2 className="font-sans font-bold text-xl md:text-2xl text-gray-900 leading-tight mb-2">
            {maybeTranslate(product.name.includes('.') ? product.name.split('.')[0] : product.name, lang)}
          </h2>

          {/* Description */}
          {product.description ? (
            <p className="text-xs text-gray-600 mb-4 leading-relaxed whitespace-pre-line">
              {maybeTranslate(product.description, lang)}
            </p>
          ) : (
            product.name.includes('.') && (
              <p className="text-xs text-gray-600 mb-4 leading-relaxed">
                {maybeTranslate(product.name.split('.').slice(1).join('.'), lang)}
              </p>
            )
          )}

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-gray-500 font-mono mb-6">
            <span>{t.code}: <strong className="text-gray-800">{product.product_code}</strong></span>
            {product.vendor_code && product.vendor_code !== '---' && (
              <>
                <span className="text-gray-300">|</span>
                <span>{t.vendor}: <strong className="text-gray-800">{product.vendor_code}</strong></span>
              </>
            )}
          </div>

          {/* Pricing display */}
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 mb-6 flex items-baseline justify-between">
            <div>
              <span className="text-2xl md:text-3xl font-bold text-gray-900">
                {product.price.toLocaleString('uk-UA')} грн
              </span>
            </div>
            {product.cup_type && (
              <span className="text-xs font-semibold px-2.5 py-1 bg-pink-50 text-[#e02484] border border-pink-200 rounded-md">
                {product.cup_type}
              </span>
            )}
          </div>

          {/* Store Manager Profit Matrix */}
          {showPriceMargin && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl mb-6 space-y-2 text-xs font-mono text-emerald-800">
              <h4 className="font-bold text-emerald-900 text-xs uppercase tracking-wider mb-2">Бизнес-метрики (Менеджер)</h4>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div className="bg-white p-2.5 rounded-lg border border-gray-200">
                  <p className="text-[10px] text-gray-500 uppercase">{t.costPrice}</p>
                  <p className="text-gray-900 font-bold mt-1">{product.purchase_price.toFixed(0)} ₴</p>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-gray-200">
                  <p className="text-[10px] text-gray-500 uppercase">{t.retailPrice}</p>
                  <p className="text-gray-900 font-bold mt-1">{product.price.toFixed(0)} ₴</p>
                </div>
                <div className="bg-white p-2.5 rounded-lg border border-gray-200">
                  <p className="text-[10px] text-emerald-600 uppercase">{t.margin}</p>
                  <p className="text-[#e02484] font-extrabold mt-1">+{profit.toFixed(0)} ₴ ({profitMargin}%)</p>
                </div>
              </div>
            </div>
          )}

          {/* Sizes picker */}
          {sizesList.length > 0 && sizesList[0] !== '' && (
            <div className="mb-4">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">{t.sizesLabel}</label>
              <div className="flex flex-wrap gap-2">
                {sizesList.map((sz) => (
                  <button
                    key={sz}
                    onClick={() => setSelectedSize(sz)}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all border cursor-pointer ${
                      selectedSize === sz
                        ? 'bg-[#e02484] border-[#e02484] text-white font-bold'
                        : 'bg-white border-gray-200 text-gray-600 hover:border-[#e02484]'
                    }`}
                  >
                    {sz}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Colors picker */}
          {colorsList.length > 0 && colorsList[0] !== '' && (
            <div className="mb-6">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">{t.colorsLabel}</label>
              <div className="flex flex-wrap gap-2">
                {colorsList.map((col) => (
                  <button
                    key={col}
                    onClick={() => setSelectedColor(col)}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all border cursor-pointer ${
                      selectedColor === col
                        ? 'bg-pink-50 border-[#e02484] text-[#e02484] font-bold'
                        : 'bg-white border-gray-200 text-gray-600 hover:border-[#e02484]'
                    }`}
                  >
                    {maybeTranslate(col, lang)}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity Controls & Add to Cart Action */}
          <div className="flex items-center gap-4 mb-8 pt-4 border-t border-gray-200">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold uppercase text-gray-500 tracking-wider">{t.qty}</span>
              <div className="flex items-center border border-gray-200 rounded-lg bg-gray-50 p-1">
                <button
                  type="button"
                  onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                  className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-800 rounded hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  -
                </button>
                <span className="w-10 text-center font-bold text-gray-900 text-sm">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(prev => Math.min(product.stock + 10, prev + 1))}
                  className="w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-800 rounded hover:bg-gray-200 transition-colors cursor-pointer"
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className={`flex-1 mt-5 py-3 px-6 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all active:scale-98 shadow-md cursor-pointer ${
                addedMessage 
                  ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                  : 'bg-[#e02484] hover:bg-[#c0146f] text-white'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{addedMessage ? t.added : t.addBtn}</span>
            </button>
          </div>

          {/* Secure Features Badge List */}
          <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 space-y-3.5 text-xs text-gray-600">
            <div className="flex items-start gap-2.5">
              <Truck className="w-4 h-4 text-[#e02484] shrink-0 mt-0.5" />
              <span>{t.features.delivery}</span>
            </div>
            <div className="flex items-start gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#e02484] shrink-0 mt-0.5" />
              <span>{t.features.secure}</span>
            </div>
            <div className="flex items-start gap-2.5">
              <RefreshCcw className="w-4 h-4 text-[#e02484] shrink-0 mt-0.5" />
              <span>{t.features.exchange}</span>
            </div>
          </div>

        </div>

      </motion.div>
    </div>
  );
}

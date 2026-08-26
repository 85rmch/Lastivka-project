import React, { useState, useEffect } from 'react';
import { Banner } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface BannerCarouselProps {
  banners: Banner[];
  lang?: 'ru' | 'ua';
  onCategorySelect?: (categoryKey: string) => void;
}

export default function BannerCarousel({ banners, lang = 'ua', onCategorySelect }: BannerCarouselProps) {
  const [currentSlide, setCurrentSlide] = useState<number>(0);

  // Autoplay timer
  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length, currentSlide]);

  if (!banners || banners.length === 0) return null;

  // Ensure currentSlide is within bounds
  const activeSlideIndex = currentSlide % banners.length;
  const slide = banners[activeSlideIndex];

  const handleButtonClick = () => {
    if (slide.linkCategory && onCategorySelect) {
      onCategorySelect(slide.linkCategory);
    }
    const catalogEl = document.getElementById('catalog-section');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <section className="w-full bg-white border-t border-b border-gray-200 overflow-hidden relative h-[320px] sm:h-[380px] md:h-[420px] my-10 shadow-inner">
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id || activeSlideIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full h-full relative"
        >
          <img
            src={slide.image}
            alt={lang === 'ru' ? slide.titleRu : slide.titleUa}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-top brightness-[0.75]"
          />

          {/* Elegant dark gradient overlay to ensure perfect text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent pointer-events-none" />

          {/* Overlay Content */}
          <div className="absolute inset-0 flex flex-col justify-center items-start p-6 sm:p-10 md:p-16 max-w-7xl mx-auto w-full text-white pointer-events-none select-none">
            {slide.accentText && (
              <span className="px-3 py-1 bg-[#e02484] text-[10px] font-extrabold uppercase tracking-widest rounded-md mb-3 shadow-md">
                {slide.accentText}
              </span>
            )}
            
            <h2 className="text-xl sm:text-3xl md:text-4xl lg:text-5xl font-sans font-extrabold tracking-tight mb-2 drop-shadow-md">
              {lang === 'ru' ? (slide.titleRu || slide.titleUa) : (slide.titleUa || slide.titleRu)}
            </h2>

            {(slide.subtitleRu || slide.subtitleUa) && (
              <p className="text-xs md:text-sm text-gray-200 max-w-md font-sans drop-shadow-sm leading-relaxed mb-6">
                {lang === 'ru' ? (slide.subtitleRu || slide.subtitleUa) : (slide.subtitleUa || slide.subtitleRu)}
              </p>
            )}

            <button
              onClick={handleButtonClick}
              className="pointer-events-auto px-5 py-2.5 bg-white hover:bg-[#e02484] text-gray-900 hover:text-white font-extrabold text-xs tracking-wider rounded shadow-lg transition-all active:scale-95 cursor-pointer uppercase"
            >
              {lang === 'ru' ? 'Смотреть каталог' : 'Дивитись каталог'}
            </button>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Carousel Navigation Arrows */}
      {banners.length > 1 && (
        <>
          <button
            onClick={() => setCurrentSlide(prev => (prev - 1 + banners.length) % banners.length)}
            className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 p-2 bg-black/40 hover:bg-[#e02484] text-white rounded-full transition-all cursor-pointer z-10 shadow-lg"
            title={lang === 'ru' ? 'Предыдущий баннер' : 'Попередній банер'}
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => setCurrentSlide(prev => (prev + 1) % banners.length)}
            className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 p-2 bg-black/40 hover:bg-[#e02484] text-white rounded-full transition-all cursor-pointer z-10 shadow-lg"
            title={lang === 'ru' ? 'Следующий баннер' : 'Наступний банер'}
          >
            <ChevronRight className="w-5 h-5" />
          </button>

          {/* Carousel Indicators Dots */}
          <div className="absolute bottom-4 inset-x-0 flex justify-center gap-1.5 z-10">
            {banners.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`w-2 h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === activeSlideIndex ? 'bg-[#e02484] w-5' : 'bg-white/50 hover:bg-white/90'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </section>
  );
}

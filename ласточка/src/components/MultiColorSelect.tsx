import React, { useState, useRef, useEffect } from 'react';
import { COLOR_OPTIONS } from '../data';
import { Check, ChevronDown, X, Search } from 'lucide-react';

interface MultiColorSelectProps {
  value: string; // Comma-separated colors string e.g. "Чорний, Пудра"
  onChange: (newValue: string) => void;
  lang?: 'ru' | 'ua';
  label?: string;
}

export default function MultiColorSelect({ value = '', onChange, lang = 'ua', label }: MultiColorSelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse comma-separated string into array of trimmed strings
  const selectedColors = value
    ? value.split(',').map(s => s.trim()).filter(Boolean)
    : [];

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleColor = (colorName: string) => {
    let next: string[];
    if (selectedColors.includes(colorName)) {
      next = selectedColors.filter(c => c !== colorName);
    } else {
      next = [...selectedColors, colorName];
    }
    onChange(next.join(', '));
  };

  const removeColor = (colorName: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const next = selectedColors.filter(c => c !== colorName);
    onChange(next.join(', '));
  };

  const clearAll = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
  };

  // Combine COLOR_OPTIONS with any extra custom colors present in value
  const customColors = selectedColors.filter(c => !COLOR_OPTIONS.includes(c));
  const allAvailableColors = [...COLOR_OPTIONS, ...customColors];

  const filteredColors = allAvailableColors.filter(c =>
    c.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative w-full" ref={containerRef}>
      {label && (
        <label className="block text-[#a19992] text-[10px] mb-1 font-semibold">
          {label}
        </label>
      )}

      {/* Main Trigger Button */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-2.5 bg-[#161616] border border-white/10 text-white rounded-lg text-xs cursor-pointer flex items-center justify-between min-h-[40px] hover:border-white/20 transition-colors"
      >
        <div className="flex flex-wrap gap-1 items-center max-w-[90%] overflow-hidden">
          {selectedColors.length === 0 ? (
            <span className="text-gray-400">
              {lang === 'ru' ? 'Выберите цвета (множественный выбор)...' : 'Оберіть кольори (множинний вибір)...'}
            </span>
          ) : (
            selectedColors.map(color => (
              <span
                key={color}
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-[#d4af37]/20 border border-[#d4af37]/40 text-[#d4af37] text-[11px] font-medium"
              >
                {color}
                <button
                  type="button"
                  onClick={e => removeColor(color, e)}
                  className="hover:text-white transition-colors cursor-pointer"
                  title={lang === 'ru' ? 'Удалить' : 'Видалити'}
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            ))
          )}
        </div>

        <div className="flex items-center gap-1 text-gray-400 shrink-0 ml-1">
          {selectedColors.length > 0 && (
            <button
              type="button"
              onClick={clearAll}
              className="p-1 hover:text-white transition-colors cursor-pointer mr-0.5"
              title={lang === 'ru' ? 'Очистить всё' : 'Очистити все'}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute z-50 left-0 right-0 mt-1 bg-[#1a1a1a] border border-white/15 rounded-xl shadow-2xl p-2.5 max-h-64 flex flex-col">
          {/* Search bar inside dropdown */}
          <div className="relative mb-2 shrink-0">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder={lang === 'ru' ? 'Поиск цвета...' : 'Пошук кольору...'}
              className="w-full pl-8 pr-3 py-1.5 bg-[#111] border border-white/10 text-white rounded-lg text-xs focus:outline-none focus:border-[#d4af37]"
              onClick={e => e.stopPropagation()}
            />
          </div>

          {/* Color items list */}
          <div className="overflow-y-auto flex-1 space-y-0.5 pr-1">
            {filteredColors.length === 0 ? (
              <div className="p-3 text-center text-gray-400 text-xs">
                {lang === 'ru' ? 'Ничего не найдено' : 'Нічого не знайдено'}
              </div>
            ) : (
              filteredColors.map(color => {
                const isSelected = selectedColors.includes(color);
                return (
                  <div
                    key={color}
                    onClick={() => toggleColor(color)}
                    className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-[#d4af37]/20 text-[#d4af37] font-semibold'
                        : 'text-gray-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <span>{color}</span>
                    <div
                      className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${
                        isSelected
                          ? 'bg-[#d4af37] border-[#d4af37] text-black'
                          : 'border-white/20 bg-black/30'
                      }`}
                    >
                      {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Bottom helper info */}
          <div className="mt-2 pt-2 border-t border-white/10 flex items-center justify-between text-[10px] text-gray-400 shrink-0 px-1">
            <span>
              {lang === 'ru'
                ? `Выбрано: ${selectedColors.length}`
                : `Обрано: ${selectedColors.length}`}
            </span>
            {selectedColors.length > 0 && (
              <button
                type="button"
                onClick={clearAll}
                className="text-red-400 hover:text-red-300 font-semibold cursor-pointer"
              >
                {lang === 'ru' ? 'Сбросить все' : 'Скинути все'}
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

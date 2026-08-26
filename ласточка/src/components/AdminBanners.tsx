import React, { useState, useEffect } from 'react';
import { Banner } from '../types';
import { fetchBanners, saveAllBanners } from '../lib/supabase';
import { CATEGORIES, compressImageFile } from '../data';
import { Plus, Trash2, Edit2, ArrowUp, ArrowDown, Image as ImageIcon, RotateCcw, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

interface AdminBannersProps {
  lang?: 'ru' | 'ua';
  onBannersUpdated?: () => void;
}

export default function AdminBanners({ lang = 'ua', onBannersUpdated }: AdminBannersProps) {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [editingBannerId, setEditingBannerId] = useState<string | null>(null);
  
  // Form state
  const [image, setImage] = useState<string>('');
  const [titleRu, setTitleRu] = useState<string>('');
  const [titleUa, setTitleUa] = useState<string>('');
  const [subtitleRu, setSubtitleRu] = useState<string>('');
  const [subtitleUa, setSubtitleUa] = useState<string>('');
  const [accentText, setAccentText] = useState<string>('');
  const [linkCategory, setLinkCategory] = useState<string>('all');
  const [uploading, setUploading] = useState<boolean>(false);
  const [statusMsg, setStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    loadBannersList();
  }, []);

  const loadBannersList = async () => {
    const list = await fetchBanners();
    setBanners(list);
  };

  const resetForm = () => {
    setEditingBannerId(null);
    setImage('');
    setTitleRu('');
    setTitleUa('');
    setSubtitleRu('');
    setSubtitleUa('');
    setAccentText('');
    setLinkCategory('all');
    setStatusMsg(null);
  };

  const handleStartEdit = (b: Banner) => {
    setEditingBannerId(b.id);
    setImage(b.image);
    setTitleRu(b.titleRu || '');
    setTitleUa(b.titleUa || '');
    setSubtitleRu(b.subtitleRu || '');
    setSubtitleUa(b.subtitleUa || '');
    setAccentText(b.accentText || '');
    setLinkCategory(b.linkCategory || 'all');
    setStatusMsg(null);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];
    try {
      setUploading(true);
      const base64 = await compressImageFile(file, 1600, 900, 0.85);
      setImage(base64);
    } catch (err) {
      console.error('Image upload failed:', err);
      setStatusMsg({
        type: 'error',
        text: lang === 'ru' ? 'Ошибка загрузки изображения' : 'Помилка завантаження зображення'
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSaveBanner = (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) {
      setStatusMsg({
        type: 'error',
        text: lang === 'ru' ? 'Пожалуйста, добавьте изображение для баннера' : 'Будь ласка, додайте зображення для банера'
      });
      return;
    }
    if (!titleRu && !titleUa) {
      setStatusMsg({
        type: 'error',
        text: lang === 'ru' ? 'Введите заголовок баннера' : 'Введіть заголовок банера'
      });
      return;
    }

    let nextBanners: Banner[];
    if (editingBannerId) {
      nextBanners = banners.map(b => b.id === editingBannerId ? {
        id: editingBannerId,
        image,
        titleRu: titleRu || titleUa,
        titleUa: titleUa || titleRu,
        subtitleRu,
        subtitleUa,
        accentText,
        linkCategory
      } : b);
    } else {
      const newBanner: Banner = {
        id: 'banner_' + Date.now(),
        image,
        titleRu: titleRu || titleUa,
        titleUa: titleUa || titleRu,
        subtitleRu,
        subtitleUa,
        accentText,
        linkCategory
      };
      nextBanners = [...banners, newBanner];
    }

    saveAllBanners(nextBanners);
    setBanners(nextBanners);
    resetForm();
    setStatusMsg({
      type: 'success',
      text: editingBannerId 
        ? (lang === 'ru' ? 'Баннер успешно обновлен!' : 'Банер успішно оновлено!')
        : (lang === 'ru' ? 'Новый баннер успешно добавлен!' : 'Новий банер успішно додано!')
    });
    if (onBannersUpdated) onBannersUpdated();
  };

  const handleDeleteBanner = (id: string) => {
    if (window.confirm(lang === 'ru' ? 'Удалить этот баннер?' : 'Видалити цей банер?')) {
      const next = banners.filter(b => b.id !== id);
      saveAllBanners(next);
      setBanners(next);
      if (editingBannerId === id) resetForm();
      if (onBannersUpdated) onBannersUpdated();
    }
  };

  const handleMove = (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= banners.length) return;
    const next = [...banners];
    const temp = next[index];
    next[index] = next[targetIdx];
    next[targetIdx] = temp;
    saveAllBanners(next);
    setBanners(next);
    if (onBannersUpdated) onBannersUpdated();
  };

  const handleRestoreDefaults = () => {
    if (window.confirm(lang === 'ru' ? 'Восстановить стандартные баннеры?' : 'Відновити стандартні банери?')) {
      localStorage.removeItem('lastochka_banners');
      loadBannersList();
      if (onBannersUpdated) onBannersUpdated();
    }
  };

  return (
    <div className="space-y-6 text-white font-sans">
      
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 bg-[#161616] border border-white/10 rounded-xl">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#d4af37]" />
            {lang === 'ru' ? 'Управление баннерами карусели' : 'Керування банерами каруселі'}
          </h3>
          <p className="text-xs text-gray-400 mt-1">
            {lang === 'ru'
              ? 'Добавляйте, редактируйте или удаляйте рекламные баннеры в нижней части сайта'
              : 'Додавайте, редагуйте або видаляйте рекламні банери в нижній частині сайту'}
          </p>
        </div>

        <button
          type="button"
          onClick={handleRestoreDefaults}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white rounded-lg text-xs transition-colors cursor-pointer shrink-0 border border-white/10"
        >
          <RotateCcw className="w-3.5 h-3.5 text-gray-400" />
          {lang === 'ru' ? 'Сбросить к исходным' : 'Скинути до початкових'}
        </button>
      </div>

      {statusMsg && (
        <div className={`p-3 rounded-xl border flex items-center gap-2 text-xs font-semibold ${
          statusMsg.type === 'success' 
            ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300' 
            : 'bg-red-950/40 border-red-500/30 text-red-300'
        }`}>
          {statusMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertCircle className="w-4 h-4 shrink-0" />}
          <span>{statusMsg.text}</span>
        </div>
      )}

      {/* Grid Layout: Active Banners List + Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">

        {/* List of active banners */}
        <div className="lg:col-span-7 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
            {lang === 'ru' ? `Активные баннеры (${banners.length})` : `Активні банери (${banners.length})`}
          </h4>

          {banners.length === 0 ? (
            <div className="p-8 text-center bg-[#161616] border border-white/10 rounded-xl text-gray-400 text-xs">
              {lang === 'ru' ? 'Нет активных баннеров. Добавьте первый баннер справа.' : 'Немає активних банерів. Додайте перший банер праворуч.'}
            </div>
          ) : (
            banners.map((b, idx) => (
              <div 
                key={b.id} 
                className={`p-3 bg-[#161616] border rounded-xl flex flex-col sm:flex-row items-center gap-3 transition-all ${
                  editingBannerId === b.id ? 'border-[#d4af37] bg-[#1a1813]' : 'border-white/10 hover:border-white/20'
                }`}
              >
                {/* Thumbnail */}
                <div className="relative w-full sm:w-32 h-20 rounded-lg overflow-hidden shrink-0 bg-black/50 border border-white/10">
                  <img src={b.image} alt={b.titleRu} className="w-full h-full object-cover" />
                  {b.accentText && (
                    <span className="absolute top-1 left-1 px-1.5 py-0.5 bg-[#e02484] text-white text-[9px] font-extrabold rounded uppercase shadow">
                      {b.accentText}
                    </span>
                  )}
                </div>

                {/* Banner Info */}
                <div className="flex-1 min-w-0 text-left w-full">
                  <h5 className="font-bold text-xs text-white truncate">
                    {lang === 'ru' ? b.titleRu : b.titleUa}
                  </h5>
                  <p className="text-[11px] text-gray-400 truncate mt-0.5">
                    {lang === 'ru' ? b.subtitleRu : b.subtitleUa}
                  </p>
                  {b.linkCategory && b.linkCategory !== 'all' && (
                    <span className="inline-block mt-1.5 text-[10px] text-[#d4af37] bg-[#d4af37]/10 px-2 py-0.5 rounded font-mono">
                      Категория: {b.linkCategory}
                    </span>
                  )}
                </div>

                {/* Action Controls */}
                <div className="flex items-center gap-1 shrink-0 self-end sm:self-center">
                  <button
                    type="button"
                    onClick={() => handleMove(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1.5 text-gray-400 hover:text-white disabled:opacity-30 rounded hover:bg-white/5 transition-colors cursor-pointer"
                    title={lang === 'ru' ? 'Вверх' : 'Вгору'}
                  >
                    <ArrowUp className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleMove(idx, 'down')}
                    disabled={idx === banners.length - 1}
                    className="p-1.5 text-gray-400 hover:text-white disabled:opacity-30 rounded hover:bg-white/5 transition-colors cursor-pointer"
                    title={lang === 'ru' ? 'Вниз' : 'Вниз'}
                  >
                    <ArrowDown className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleStartEdit(b)}
                    className="p-1.5 text-[#d4af37] hover:text-amber-200 rounded hover:bg-[#d4af37]/10 transition-colors cursor-pointer"
                    title={lang === 'ru' ? 'Редактировать' : 'Редагувати'}
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteBanner(b.id)}
                    className="p-1.5 text-red-400 hover:text-red-300 rounded hover:bg-red-500/10 transition-colors cursor-pointer"
                    title={lang === 'ru' ? 'Удалить' : 'Видалити'}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Add / Edit Form */}
        <div className="lg:col-span-5 bg-[#161616] border border-white/10 rounded-xl p-4 space-y-4">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#d4af37] flex items-center gap-1.5">
              {editingBannerId ? <Edit2 className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
              {editingBannerId 
                ? (lang === 'ru' ? 'Редактировать баннер' : 'Редагувати банер') 
                : (lang === 'ru' ? 'Добавить баннер' : 'Додати банер')}
            </h4>

            {editingBannerId && (
              <button
                type="button"
                onClick={resetForm}
                className="text-[11px] text-gray-400 hover:text-white underline cursor-pointer"
              >
                {lang === 'ru' ? 'Отмена' : 'Скасувати'}
              </button>
            )}
          </div>

          <form onSubmit={handleSaveBanner} className="space-y-3.5">
            
            {/* Banner Image Preview / Upload */}
            <div>
              <label className="block text-[10px] font-semibold text-gray-400 mb-1">
                {lang === 'ru' ? 'Картинка баннера (16:9 или около того)' : 'Картинка банера (16:9 або подібна)'}
              </label>

              {image ? (
                <div className="relative w-full h-32 rounded-lg overflow-hidden border border-white/10 group mb-2 bg-black/60">
                  <img src={image} alt="Preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setImage('')}
                    className="absolute top-2 right-2 p-1.5 bg-black/70 hover:bg-red-600 text-white rounded-full transition-colors cursor-pointer"
                    title={lang === 'ru' ? 'Удалить изображение' : 'Видалити зображення'}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : null}

              <div className="flex flex-col gap-2">
                <label className="flex items-center justify-center gap-2 p-2.5 bg-[#111] border border-dashed border-white/20 hover:border-[#d4af37] text-gray-300 hover:text-white rounded-lg text-xs cursor-pointer transition-colors">
                  <ImageIcon className="w-4 h-4 text-[#d4af37]" />
                  <span>{uploading ? (lang === 'ru' ? 'Загрузка...' : 'Завантаження...') : (lang === 'ru' ? 'Выбрать фото с устройства' : 'Обрати фото з пристрою')}</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" disabled={uploading} />
                </label>

                <div className="text-[10px] text-gray-500 text-center">или вставьте прямой URL ссылки:</div>

                <input
                  type="text"
                  placeholder="https://.../banner.jpg"
                  value={image}
                  onChange={e => setImage(e.target.value)}
                  className="w-full p-2 bg-[#111] border border-white/10 text-white rounded-lg text-xs focus:border-[#d4af37] focus:outline-none"
                />
              </div>
            </div>

            {/* Accent Badge Text */}
            <div>
              <label className="block text-[10px] font-semibold text-gray-400 mb-1">
                {lang === 'ru' ? 'Бейдж / Акцентный текст (напр. WEIYESI PREMIUM, АКЦИЯ)' : 'Бейдж / Акцентний текст (напр. WEIYESI PREMIUM, АКЦІЯ)'}
              </label>
              <input
                type="text"
                placeholder="WeiyeSi Premium"
                value={accentText}
                onChange={e => setAccentText(e.target.value)}
                className="w-full p-2 bg-[#111] border border-white/10 text-white rounded-lg text-xs focus:border-[#d4af37] focus:outline-none"
              />
            </div>

            {/* Title RU / UA */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-semibold text-gray-400 mb-1">Заголовок (RU)</label>
                <input
                  type="text"
                  placeholder="Новая Коллекция Белья"
                  value={titleRu}
                  onChange={e => setTitleRu(e.target.value)}
                  className="w-full p-2 bg-[#111] border border-white/10 text-white rounded-lg text-xs focus:border-[#d4af37] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-gray-400 mb-1">Заголовок (UA)</label>
                <input
                  type="text"
                  placeholder="Нова Колекція Білизни"
                  value={titleUa}
                  onChange={e => setTitleUa(e.target.value)}
                  className="w-full p-2 bg-[#111] border border-white/10 text-white rounded-lg text-xs focus:border-[#d4af37] focus:outline-none"
                />
              </div>
            </div>

            {/* Subtitle RU / UA */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] font-semibold text-gray-400 mb-1">Подзаголовок (RU)</label>
                <input
                  type="text"
                  placeholder="Изысканное кружево..."
                  value={subtitleRu}
                  onChange={e => setSubtitleRu(e.target.value)}
                  className="w-full p-2 bg-[#111] border border-white/10 text-white rounded-lg text-xs focus:border-[#d4af37] focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-[10px] font-semibold text-gray-400 mb-1">Подзаголовок (UA)</label>
                <input
                  type="text"
                  placeholder="Вишукане мереживо..."
                  value={subtitleUa}
                  onChange={e => setSubtitleUa(e.target.value)}
                  className="w-full p-2 bg-[#111] border border-white/10 text-white rounded-lg text-xs focus:border-[#d4af37] focus:outline-none"
                />
              </div>
            </div>

            {/* Category Link */}
            <div>
              <label className="block text-[10px] font-semibold text-gray-400 mb-1">
                {lang === 'ru' ? 'Категория для переходной кнопки' : 'Категорія для перехідної кнопки'}
              </label>
              <select
                value={linkCategory}
                onChange={e => setLinkCategory(e.target.value)}
                className="w-full p-2 bg-[#111] border border-white/10 text-white rounded-lg text-xs cursor-pointer focus:border-[#d4af37] focus:outline-none"
              >
                {CATEGORIES.map(cat => (
                  <option key={cat.key} value={cat.key}>
                    {lang === 'ru' ? cat.labelRu : cat.labelUa}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-[#d4af37] hover:bg-[#c49f27] text-black font-extrabold text-xs rounded-lg transition-colors cursor-pointer uppercase shadow-md mt-2"
            >
              {editingBannerId
                ? (lang === 'ru' ? 'Сохранить изменения' : 'Зберегти зміни')
                : (lang === 'ru' ? 'Добавить баннер' : 'Додати банер')}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}

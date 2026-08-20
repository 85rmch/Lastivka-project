import React, { useState } from 'react';
import { Product } from '../types';
import { updateProduct, deleteProduct } from '../lib/supabase';
import { Loader2, X, Trash2, CheckCircle2, AlertCircle } from 'lucide-react';
import { CATEGORIES, cleanImageUrl, compressImageFile } from '../data';

export default function AdminProductEdit({ product, onClose, onUpdate, lang = 'ua' }: { product: Product; onClose: () => void; onUpdate: () => void; lang?: 'ru' | 'ua' }) {
  const [formData, setFormData] = useState<Product>({ ...product, photo: Array.isArray(product.photo) ? product.photo : [] });
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [localPreviews, setLocalPreviews] = useState<Record<string, string>>({});
  const [statusModal, setStatusModal] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const t = {
    ru: {
      editTitle: 'Редактирование:',
      nameLabel: 'Название',
      productCodeLabel: 'Код товара',
      vendorCodeLabel: 'Артикул',
      selectCategory: 'Выберите категорию...',
      descLabel: 'Описание',
      priceLabel: 'Цена',
      stockLabel: 'Остаток',
      addPhoto: 'Добавить фото (до 8 шт.)',
      maxPhotoAlert: 'Максимальное количество фото - 8.',
      uploadError: 'Ошибка при загрузке фото: ',
      uploadNetworkError: 'Ошибка сети при загрузке фото',
      deleteConfirmTitle: 'Подтверждение удаления',
      deleteConfirmDesc: 'Вы действительно хотите удалить товар "{name}"? Это действие нельзя отменить.',
      cancel: 'Отмена',
      delete: 'Удалить',
      saveChanges: 'Сохранить изменения',
      deleteBtnTitle: 'Удалить товар',
      saveError: 'Ошибка при сохранении: ',
      deleteError: 'Ошибка при удалении: ',
      saveSuccess: 'Изменения товара успешно сохранены!',
      deleteSuccess: 'Товар успешно удален!',
      ok: 'ОК'
    },
    ua: {
      editTitle: 'Редагування:',
      nameLabel: 'Назва',
      productCodeLabel: 'Код товару',
      vendorCodeLabel: 'Артикул',
      selectCategory: 'Оберіть категорію...',
      descLabel: 'Опис',
      priceLabel: 'Ціна',
      stockLabel: 'Залишок',
      addPhoto: 'Додати фото (до 8 шт.)',
      maxPhotoAlert: 'Максимальна кількість фото - 8.',
      uploadError: 'Помилка при завантаженні фото: ',
      uploadNetworkError: 'Помилка мережі при завантаженні фото',
      deleteConfirmTitle: 'Підтвердження видалення',
      deleteConfirmDesc: 'Ви дійсно хочете видалити товар "{name}"? Цю дію не можна скасувати.',
      cancel: 'Скасувати',
      delete: 'Видалити',
      saveChanges: 'Зберегти зміни',
      deleteBtnTitle: 'Видалити товар',
      saveError: 'Помилка при збереженні: ',
      deleteError: 'Помилка при видаленні: ',
      saveSuccess: 'Зміни товару успішно збережені!',
      deleteSuccess: 'Товар успішно видалено!',
      ok: 'ОК'
    }
  }[lang];

  const handleSave = async () => {
    setSaving(true);
    const { success, error } = await updateProduct(formData);
    setSaving(false);
    if (success) {
      setStatusModal({ type: 'success', message: t.saveSuccess });
    } else {
      setStatusModal({ type: 'error', message: t.saveError + (error || '') });
    }
  };

  const executeDelete = async () => {
    setDeleting(true);
    const { success, error } = await deleteProduct(product);
    setDeleting(false);
    
    if (success) {
      setShowConfirmDelete(false);
      setStatusModal({ type: 'success', message: t.deleteSuccess });
    } else {
      setShowConfirmDelete(false);
      setStatusModal({ type: 'error', message: t.deleteError + (error || '') });
    }
  };

  const handleDelete = () => {
    setShowConfirmDelete(true);
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/85 backdrop-blur-sm p-4">
      <div className="w-full max-w-lg bg-[#0d0d0d] border border-white/10 rounded-2xl shadow-2xl p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-white font-semibold">{t.editTitle} {product.name}</h3>
          <button onClick={onClose} className="text-[#a19992] hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
        </div>
        
        <input type="text" placeholder={t.nameLabel} value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full p-2 bg-[#161616] border border-white/10 text-white rounded-lg text-xs" />
        
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-[#a19992] text-[10px] mb-1 font-semibold">{t.productCodeLabel}</label>
            <input 
              type="text" 
              placeholder={t.productCodeLabel} 
              value={formData.product_code || ''} 
              onChange={e => setFormData({...formData, product_code: e.target.value})} 
              className="w-full p-2 bg-[#161616] border border-white/10 text-white rounded-lg text-xs" 
            />
          </div>
          <div>
            <label className="block text-[#a19992] text-[10px] mb-1 font-semibold">{t.vendorCodeLabel}</label>
            <input 
              type="text" 
              placeholder={t.vendorCodeLabel} 
              value={formData.vendor_code || ''} 
              onChange={e => setFormData({...formData, vendor_code: e.target.value})} 
              className="w-full p-2 bg-[#161616] border border-white/10 text-white rounded-lg text-xs" 
            />
          </div>
        </div>

        <select className="w-full p-2 bg-[#161616] border border-white/10 text-white rounded-lg text-xs" 
          value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}>
          <option value="" disabled>{t.selectCategory}</option>
          {CATEGORIES.filter(c => c.key !== 'all').map(cat => (
            <option key={cat.key} value={cat.key}>{lang === 'ru' ? cat.labelRu : cat.labelUa}</option>
          ))}
        </select>
        <textarea placeholder={t.descLabel} value={formData.description || ''} onChange={e => setFormData({...formData, description: e.target.value})} className="w-full p-2 bg-[#161616] border border-white/10 text-white rounded-lg text-xs" />
        <div className="grid grid-cols-2 gap-3">
          <input type="number" placeholder={t.priceLabel} value={formData.price || ''} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="w-full p-2 bg-[#161616] border border-white/10 text-white rounded-lg text-xs" />
          <input type="number" placeholder={t.stockLabel} value={formData.stock || ''} onChange={e => setFormData({...formData, stock: Number(e.target.value)})} className="w-full p-2 bg-[#161616] border border-white/10 text-white rounded-lg text-xs" />
        </div>
        
        <div className="flex flex-col gap-2">
            <label className="cursor-pointer bg-[#222] hover:bg-[#333] transition-colors border border-dashed border-white/20 p-4 rounded-lg flex flex-col items-center justify-center text-gray-400 text-xs">
               <span>{t.addPhoto} {uploading && <Loader2 className="inline w-3 h-3 ml-2 animate-spin" />}</span>
               <input type="file" multiple className="hidden" disabled={uploading} onChange={async (e) => {
                if (!e.target.files) return;
                const files = Array.from(e.target.files) as File[];
                const currentPhotos = Array.isArray(formData.photo) ? formData.photo : [];
                if (files.length + currentPhotos.length > 8) {
                    alert(t.maxPhotoAlert);
                    return;
                }
                
                setUploading(true);
                
                const newPreviews: { file: File, content: string, tempId: string }[] = [];
                for (const file of files) {
                  const content = await compressImageFile(file);
                  if (content) {
                    newPreviews.push({ file, content, tempId: 'temp_' + Date.now() + '_' + Math.random().toString(36).substring(7) });
                  }
                }
                
                setLocalPreviews(prev => {
                   const next = { ...prev };
                   newPreviews.forEach(p => next[p.tempId] = p.content);
                   return next;
                });
                
                setFormData(prev => ({
                    ...prev, 
                    photo: [...(Array.isArray(prev.photo) ? prev.photo : []), ...newPreviews.map(p => p.tempId)].slice(0, 8)
                }));
                
                for (const preview of newPreviews) {
                  try {
                      const res = await fetch('/api/github/upload', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ filename: preview.file.name, content: preview.content })
                      });
                      const data = await res.json();
                      if (!res.ok) {
                        // Fallback to data URL
                        setLocalPreviews(prev => ({ ...prev, [preview.content]: preview.content }));
                        setFormData(prev => ({
                            ...prev,
                            photo: (prev.photo as string[]).map(u => u === preview.tempId ? preview.content : u)
                        }));
                        continue;
                      }
                      setLocalPreviews(prev => ({...prev, [data.url]: preview.content}));
                      setFormData(prev => ({
                          ...prev,
                          photo: (prev.photo as string[]).map(u => u === preview.tempId ? data.url : u)
                      }));
                  } catch (err) {
                      // Fallback to data URL
                      setLocalPreviews(prev => ({ ...prev, [preview.content]: preview.content }));
                      setFormData(prev => ({
                          ...prev,
                          photo: (prev.photo as string[]).map(u => u === preview.tempId ? preview.content : u)
                      }));
                  }
                }
                setUploading(false);
                e.target.value = '';
              }} />
            </label>
            {Array.isArray(formData.photo) && formData.photo.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                    {formData.photo.map((url, idx) => (
                        <div key={idx} className="relative group">
                            <img 
                                src={localPreviews[url] || cleanImageUrl(url)} 
                                alt="preview" 
                                referrerPolicy="no-referrer"
                                onError={(e) => {
                                    const target = e.target as HTMLImageElement;
                                    if (target.src !== 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=200&auto=format&fit=crop') {
                                        target.src = 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=200&auto=format&fit=crop';
                                    }
                                }}
                                className="w-16 h-16 object-cover rounded-md border border-white/10 bg-[#111]" 
                            />
                            <button type="button" onClick={() => setFormData(prev => ({...prev, photo: (prev.photo as string[]).filter((_, i) => i !== idx)}))} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                        </div>
                    ))}
                </div>
            )}
        </div>
        
        <div className="flex gap-2">
          <button 
             onClick={handleDelete} 
             disabled={saving || uploading || deleting}
            className="p-3 bg-red-500/10 hover:bg-red-500/20 text-red-500 font-bold rounded-lg text-sm cursor-pointer transition-colors flex items-center justify-center"
            title={t.deleteBtnTitle}
          >
            {deleting ? <Loader2 className="w-5 h-5 animate-spin" /> : <Trash2 className="w-5 h-5" />}
          </button>
          <button 
             onClick={handleSave} 
             disabled={saving || uploading || deleting}
            className="flex-1 p-3 bg-[#d4af37] text-black font-bold rounded-lg text-sm cursor-pointer flex items-center justify-center"
          >
            {saving ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : t.saveChanges}
          </button>
        </div>
      </div>

      {showConfirmDelete && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-sm bg-[#1a1a1a] border border-red-500/30 rounded-xl p-5 space-y-4 shadow-2xl">
            <h4 className="text-white font-bold text-lg text-center">{t.deleteConfirmTitle}</h4>
            <p className="text-gray-400 text-sm text-center">
              {t.deleteConfirmDesc.replace('{name}', product.name)}
            </p>
            <div className="flex gap-3 pt-2">
              <button onClick={() => setShowConfirmDelete(false)} className="flex-1 p-2.5 bg-white/5 hover:bg-white/10 text-white rounded-lg text-sm font-medium transition-colors">{t.cancel}</button>
              <button onClick={executeDelete} className="flex-1 p-2.5 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-bold transition-colors shadow-[0_0_15px_rgba(239,68,68,0.3)]">{t.delete}</button>
            </div>
          </div>
        </div>
      )}

      {statusModal && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className={`w-full max-w-sm bg-[#141414] border ${statusModal.type === 'success' ? 'border-emerald-500/50 shadow-[0_0_30px_rgba(16,185,129,0.2)]' : 'border-red-500/50 shadow-[0_0_30px_rgba(239,68,68,0.2)]'} rounded-2xl p-6 text-center space-y-4`}>
            <div className={`w-14 h-14 ${statusModal.type === 'success' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'} rounded-full flex items-center justify-center mx-auto mb-1 border`}>
              {statusModal.type === 'success' ? <CheckCircle2 className="w-8 h-8" /> : <AlertCircle className="w-8 h-8" />}
            </div>
            <h4 className="text-white font-bold text-base leading-snug">{statusModal.message}</h4>
            <div className="pt-2">
              {statusModal.type === 'success' ? (
                <button
                  onClick={() => {
                    setStatusModal(null);
                    onUpdate();
                    onClose();
                  }}
                  className="w-full py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-sm transition-all shadow-[0_0_15px_rgba(16,185,129,0.3)] cursor-pointer"
                >
                  {t.ok}
                </button>
              ) : (
                <button 
                  onClick={() => setStatusModal(null)} 
                  className="w-full py-2.5 bg-white/10 hover:bg-white/20 text-white rounded-xl text-sm font-medium cursor-pointer transition-colors"
                >
                  {t.ok}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

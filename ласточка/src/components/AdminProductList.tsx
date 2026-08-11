import React, { useState, useEffect, useMemo } from 'react';
import { Product } from '../types';
import { fetchSupabaseProducts } from '../lib/supabase';
import { Loader2, Edit, Search, X } from 'lucide-react';
import AdminProductEdit from './AdminProductEdit';
import { getCleanImage, CATEGORIES } from '../data';

export default function AdminProductList({ isOpen, onConfigChange, selectedCategory, lang = 'ua' }: { isOpen: boolean; onConfigChange: () => void; selectedCategory?: string; lang?: 'ru' | 'ua' }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [adminSearch, setAdminSearch] = useState('');

  const loadProducts = async () => {
    setLoading(true);
    const { products } = await fetchSupabaseProducts();
    setProducts(products);
    setLoading(false);
  };

  useEffect(() => {
    if (isOpen) loadProducts();
  }, [isOpen]);

  const filteredProducts = useMemo(() => {
    if (!adminSearch.trim()) return products;
    const query = adminSearch.toLowerCase().trim();
    return products.filter(product => {
      const nameMatch = product.name?.toLowerCase().includes(query);
      const codeMatch = product.product_code?.toLowerCase().includes(query);
      const vendorMatch = product.vendor_code?.toLowerCase().includes(query);
      const descMatch = product.description?.toLowerCase().includes(query);
      const colorMatch = product.color?.toLowerCase().includes(query);
      const categoryMatch = product.category?.toLowerCase().includes(query);
      return nameMatch || codeMatch || vendorMatch || descMatch || colorMatch || categoryMatch;
    });
  }, [products, adminSearch]);

  const groupedProducts = useMemo(() => {
    return filteredProducts.reduce((acc, product) => {
      if (selectedCategory && product.category !== selectedCategory) return acc;
      const category = product.category || 'none';
      if (!acc[category]) acc[category] = [];
      acc[category].push(product);
      return acc;
    }, {} as Record<string, Product[]>);
  }, [filteredProducts, selectedCategory]);

  const getCategoryLabel = (categoryKey: string) => {
    if (categoryKey === 'none') {
      return lang === 'ru' ? 'Без категории' : 'Без категорії';
    }
    const cat = CATEGORIES.find(c => c.key === categoryKey);
    if (cat) return lang === 'ru' ? cat.labelRu : cat.labelUa;
    return categoryKey;
  };

  if (loading) return <div className="p-4 text-center"><Loader2 className="w-6 h-6 animate-spin mx-auto text-[#d4af37]" /></div>;

  const totalFilteredCount = Object.values(groupedProducts).reduce((sum: number, list) => sum + (list as Product[]).length, 0);

  return (
    <div className="space-y-6">
      {editingProduct && (
        <AdminProductEdit 
          product={editingProduct} 
          onClose={() => setEditingProduct(null)} 
          onUpdate={() => { loadProducts(); onConfigChange(); }}
          lang={lang}
        />
      )}

      {/* Admin Search Box */}
      <div className="relative">
        <input
          type="text"
          value={adminSearch}
          onChange={e => setAdminSearch(e.target.value)}
          placeholder={lang === 'ru' ? 'Поиск по названию, коду, артикулу, цвету...' : 'Пошук за назвою, кодом, артикулом, кольором...'}
          className="w-full pl-10 pr-10 py-3 bg-[#1a1a1a] border border-white/10 text-white placeholder-gray-500 focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37] rounded-xl text-xs focus:outline-none transition-all font-sans"
        />
        <Search className="w-4 h-4 text-gray-500 absolute left-3.5 top-3.5" />
        {adminSearch && (
          <button 
            onClick={() => setAdminSearch('')}
            className="absolute right-3.5 top-3.5 text-gray-500 hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {totalFilteredCount === 0 && (
        <div className="text-center py-8 text-gray-500 text-xs">
          {lang === 'ru' ? 'Ничего не найдено по вашему запросу' : 'Нічого не знайдено за вашим запитом'}
        </div>
      )}
      
      {Object.entries(groupedProducts).map(([category, items]) => (
        <div key={category} className="space-y-3">
          <h3 className="text-[#d4af37] text-xs font-bold uppercase tracking-wider">{getCategoryLabel(category)}</h3>
           <div className="grid grid-cols-1 gap-4">
            {(items as Product[]).map(product => (
              <div key={product.id} className="p-5 bg-[#161616] hover:bg-[#1a1a1a] border border-white/10 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 transition-all shadow-sm">
                <div className="flex items-start sm:items-center gap-5 w-full">
                  <img 
                    src={getCleanImage(product, 0)} 
                    alt={product.name} 
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      if (target.src !== 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=200&auto=format&fit=crop') {
                        target.src = 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=200&auto=format&fit=crop';
                      }
                    }}
                    className="w-24 h-24 sm:w-28 sm:h-28 rounded-xl object-cover bg-[#121212] border border-white/5 shrink-0" 
                  />
                  <div className="flex-1 space-y-1.5">
                    <h4 className="text-white text-base font-bold">{product.name}</h4>
                    <p className="text-[#a19992] text-sm">{lang === 'ru' ? 'Код:' : 'Код:'} {product.product_code}</p>
                    {product.vendor_code && <p className="text-[#6b645d] text-xs">{lang === 'ru' ? 'Артикул:' : 'Артикул:'} {product.vendor_code}</p>}
                    <div className="flex flex-wrap items-center gap-4 mt-2 pt-2 border-t border-white/5">
                        <span className="text-[#d4af37] font-semibold text-sm">{product.price} ₴</span>
                        <span className="text-[#a19992] text-xs bg-[#222] px-2 py-1 rounded-md">{lang === 'ru' ? 'Остаток:' : 'Залишок:'} {product.stock} {lang === 'ru' ? 'шт' : 'шт'}</span>
                        {product.sizes && <span className="text-[#a19992] text-xs bg-[#222] px-2 py-1 rounded-md">{lang === 'ru' ? 'Размеры:' : 'Розміри:'} {product.sizes}</span>}
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => setEditingProduct(product)}
                  className="p-3 w-full sm:w-auto bg-white/5 hover:bg-[#d4af37] text-white hover:text-black rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-2"
                >
                  <Edit className="w-4 h-4" />
                  <span className="text-xs font-bold sm:hidden">{lang === 'ru' ? 'Редактировать' : 'Редагувати'}</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

import React, { useState, useEffect } from 'react';
import { 
  Database, 
  CheckCircle2, 
  XCircle, 
  Play, 
  Copy, 
  RotateCcw, 
  HelpCircle, 
  Loader2, 
  ToggleLeft, 
  ToggleRight,
  Sparkles,
  RefreshCw,
  Eye,
  EyeOff,
  Upload,
  Trash2,
  FileSpreadsheet,
  AlertCircle,
  Settings2,
  X,
  UploadCloud,
  FileText
} from 'lucide-react';
import { 
  getStoredConfig, 
  saveStoredConfig, 
  testSupabaseConnection, 
  seedSupabaseProducts,
  getDemoProducts,
  getAuthClient
} from '../lib/supabase';
import { CATEGORIES, compressImageFile } from '../data';
import { getDefaultBlogPosts } from '../defaultBlogPosts';
import { parseCSVProducts } from '../lib/csvHelper';
import { BlogPost } from '../types';
import AdminProductList from './AdminProductList';
import AdminOrders from './AdminOrders';
import BlogView from './BlogView';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onConfigChange: () => void;
  currentMode: 'demo' | 'supabase';
  lang: 'ru' | 'ua';
  adminPassword: string;
  blogPosts?: BlogPost[];
  onAddBlogPost?: (post: BlogPost) => void;
  onDeleteBlogPost?: (id: string) => void;
}

export default function AdminPanel({ 
  isOpen, 
  onClose, 
  onConfigChange, 
  currentMode, 
  lang, 
  adminPassword,
  blogPosts = [],
  onAddBlogPost = () => {},
  onDeleteBlogPost = () => {}
}: AdminPanelProps) {
  if (!isOpen) return null;
  const [mode, setMode] = useState<'demo' | 'supabase'>('demo');
  const [url, setUrl] = useState('');
  const [anonKey, setAnonKey] = useState('');
  const [secretKey, setSecretKey] = useState('');
  const [tableName, setTableName] = useState('products');
  
  const [activeTab, setActiveTab] = useState<'products' | 'orders' | 'add' | 'blog' | 'settings'>('products');
  const [selectedCategory, setSelectedCategory] = useState<string | 'all'>('all');
  
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<{
    success: boolean;
    hasTable: boolean;
    rowCount: number;
    error?: string;
  } | null>(null);

  const [seeding, setSeeding] = useState(false);
  const [seedingProgress, setSeedingProgress] = useState({ current: 0, total: 100 });
  const [seedingResult, setSeedingResult] = useState<{ success: boolean; count: number; error?: string } | null>(null);
  const [copiedSql, setCopiedSql] = useState(false);
  const [showKeys, setShowKeys] = useState(false);

  // Add Product State
  const [newProduct, setNewProduct] = useState({
    product_code: '',
    vendor_code: '',
    name: '',
    category: '',
    description: '',
    color: '',
    purchase_price: 0,
    price: 0,
    cup_type: '',
    sizes: '',
    stock: 0,
    photo: [] as string[]
  });
  const [uploading, setUploading] = useState(false);
  const [addStatus, setAddStatus] = useState<{type: 'success'|'error', msg: string} | null>(null);
  const [localPreviews, setLocalPreviews] = useState<Record<string, string>>({});

  // Client-side CSV Importer state
  const [csvText, setCsvText] = useState('');
  const [localProductsCount, setLocalProductsCount] = useState(0);
  const [csvError, setCsvError] = useState('');
  const [csvSuccessCount, setCsvSuccessCount] = useState<number | null>(null);

  // Load configuration on open
  useEffect(() => {
    if (isOpen) {
      const config = getStoredConfig();
      setMode(config.mode);
      setUrl(config.url);
      setAnonKey(config.anonKey);
      setSecretKey(config.secretKey || '');
      setTableName(config.tableName);
      setTestResult(null);
      setSeedingResult(null);
      setCsvError('');
      setCsvSuccessCount(null);
      
      const stored = localStorage.getItem('lastochka_imported_products');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) {
            setLocalProductsCount(parsed.length);
          }
        } catch (e) {}
      } else {
        setLocalProductsCount(0);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const t = {
    ru: {
      title: 'Панель управления',
      subtitle: 'Загружайте ваши каталоги товаров и управляйте базой данных',
      modeLabel: 'Режим работы магазина',
      demoMode: 'Локальный каталог (быстрый)',
      demoDesc: 'Использует встроенные товары или ваши импортированные CSV-файлы напрямую в памяти браузера.',
      supabaseMode: 'База данных Supabase',
      supabaseDesc: 'Интегрирует реальную SQL базу данных для синхронизации товаров и цен в реальном времени.',
      urlLabel: 'Адрес проекта (Project URL)',
      keyLabel: 'Публичный ключ (Anon API Key)',
      secretLabel: 'Секретный ключ (Service Role / Secret Key)',
      tableLabel: 'Имя таблицы (Table Name)',
      testBtn: 'Проверить соединение',
      testingState: 'Проверка...',
      saveBtn: 'Сохранить настройки',
      loadDefaults: 'Восстановить демо-ключи',
      sqlTitle: '1. Структура SQL таблицы',
      sqlDesc: 'Выполните этот SQL-запрос в редакторе (SQL Editor) панели Supabase:',
      copyBtn: 'Копировать SQL',
      copied: 'Скопировано!',
      seedTitle: 'База данных: Синхронизация каталога',
      seedDesc: 'Загрузите все текущие активные товары (включая ваши импортированные CSV-товары) прямо в таблицу Supabase.',
      seedBtn: 'Синхронизировать каталог с Supabase',
      seedingState: 'Синхронизация...',
      seedSuccess: 'Успешно отправлено {count} товаров в вашу таблицу Supabase!',
      connSuccess: 'Соединение успешно установлено!',
      tableExists: 'Таблица "{name}" найдена в базе данных.',
      tableEmpty: 'Таблица "{name}" пуста. Вы можете заполнить её через кнопку синхронизации ниже.',
      tableCount: 'В таблице "{name}" обнаружено {count} товаров.',
      connError: 'Ошибка подключения:',
      close: 'Закрыть',
      
      // CSV section
      csvTitle: 'Импорт базы товаров (CSV)',
      csvDesc: 'Вставьте содержимое вашей CSV-таблицы или выберите файл. Поддерживаются фото, размеры, цены и автоматическая каталогизация.',
      csvPlaceholder: 'Вставьте CSV-строки сюда...\nНапример:\nproduct_code,name,vendor_code,color,purchase_price,cup_type,price,photo,sizes,stock,id\nД99,"Пижама",#2165,розовый,550,,1100,"[""https://.../photo.jpg""]",44-46,1,1',
      csvImportBtn: 'Импортировать в память магазина',
      csvFileSelect: 'Выбрать файл таблицы (.csv)',
      csvSuccessMsg: 'Успешно импортировано {count} товаров в ваш каталог!',
      csvResetBtn: 'Сбросить каталог до стандартного',
      csvActiveCount: 'Активных товаров в вашем локальном каталоге: {count}',
      csvUploadLabel: 'Загрузить файл таблицы',
      csvFormatHelp: 'Ожидаемый формат заголовков: product_code, name, vendor_code, color, purchase_price, cup_type, price, photo, sizes, stock, id',

      // Add Product section
      addTitle: 'Добавить товар',
      codePlaceholder: 'Код товара (product_code)',
      vendorPlaceholder: 'Артикул (vendor_code)',
      namePlaceholder: 'Название',
      selectCategory: 'Выберите категорию...',
      colorPlaceholder: 'Цвет (color)',
      descPlaceholder: 'Описание',
      purchasePricePlaceholder: 'Закупочная цена (purchase_price)',
      pricePlaceholder: 'Цена',
      stockPlaceholder: 'Количество',
      cupTypePlaceholder: 'Тип чашки (cup_type)',
      sizesPlaceholder: 'Размеры (через запятую)',
      addPhoto: 'Добавить фото (до 8 шт.)',
      maxPhotoAlert: 'Максимальное количество фото - 8.',
      uploadError: 'Ошибка при загрузке фото: ',
      uploadNetworkError: 'Ошибка сети при загрузке фото',
      statusSelectCat: 'Пожалуйста, выберите категорию товара.',
      statusNameCodeRequired: 'Название и Код товара обязательны.',
      statusSuccess: 'Товар добавлен!',
      statusAddError: 'Ошибка при добавлении товара: ',
      statusNetworkError: 'Сетевая ошибка: ',
      loadingState: 'Загрузка...',
      addBtn: 'Добавить товар'
    },
    ua: {
      title: 'Панель керування',
      subtitle: 'Завантажуйте ваші каталоги товарів та керуйте базою даних',
      modeLabel: 'Режим роботи магазину',
      demoMode: 'Локальний каталог (швидкий)',
      demoDesc: 'Використовує вбудовані товари або ваші імпортовані CSV-файли безпосередньо у пам\'яті браузера.',
      supabaseMode: 'База даних Supabase',
      supabaseDesc: 'Інтегрує реальну SQL базу даних для синхронізації товарів та цін в реальному часі.',
      urlLabel: 'Адреса проекту (Project URL)',
      keyLabel: 'Публичний ключ (Anon API Key)',
      secretLabel: 'Секретний ключ (Service Role / Secret Key)',
      tableLabel: 'Ім\'я таблиці (Table Name)',
      testBtn: 'Перевірити з\'єднання',
      testingState: 'Перевірка...',
      saveBtn: 'Зберегти налаштування',
      loadDefaults: 'Відновити демо-ключі',
      sqlTitle: '1. Структура SQL таблиці',
      sqlDesc: 'Виконайте цей SQL-запит у редакторі (SQL Editor) панелі Supabase:',
      copyBtn: 'Копіювати SQL',
      copied: 'Скопійовано!',
      seedTitle: 'База даних: Синхронізація каталогу',
      seedDesc: 'Завантажте всі поточні активні товари (включаючи ваші імпортовані CSV-товари) прямо в таблицю Supabase.',
      seedBtn: 'Синхронізувати каталог із Supabase',
      seedingState: 'Синхронізація...',
      seedSuccess: 'Успішно відправлено {count} товарів у вашу таблицю Supabase!',
      connSuccess: 'З\'єднання успішно встановлено!',
      tableExists: 'Таблиця "{name}" знайдена в базі даних.',
      tableEmpty: 'Таблиця "{name}" порожня. Ви можете заповнити її через кнопку синхронізації нижче.',
      tableCount: 'В таблиці "{name}" знайдено {count} товарів.',
      connError: 'Помилка підключення:',
      close: 'Закрити',
      
      // CSV section
      csvTitle: 'Імпорт бази товарів (CSV)',
      csvDesc: 'Вставте вміст вашої CSV-таблиці або оберіть файл. Підтримуються фото, розміри, ціни та автоматична каталогізація.',
      csvPlaceholder: 'Вставте CSV-рядки сюди...\nНаприклад:\nproduct_code,name,vendor_code,color,purchase_price,cup_type,price,photo,sizes,stock,id\nД99,"Піжама",#2165,рожевий,550,,1100,"[""https://.../photo.jpg""]",44-46,1,1',
      csvImportBtn: 'Імпортувати в пам\'ять магазину',
      csvFileSelect: 'Обрати файл таблиці (.csv)',
      csvSuccessMsg: 'Успішно імпортовано {count} товарів у ваш каталог!',
      csvResetBtn: 'Скинути каталог до стандартного',
      csvActiveCount: 'Активних товарів у вашому локальному каталозі: {count}',
      csvUploadLabel: 'Завантажити файл таблиці',
      csvFormatHelp: 'Очікуваний формат заголовків: product_code, name, vendor_code, color, purchase_price, cup_type, price, photo, sizes, stock, id',

      // Add Product section
      addTitle: 'Додати товар',
      codePlaceholder: 'Код товару (product_code)',
      vendorPlaceholder: 'Артикул (vendor_code)',
      namePlaceholder: 'Назва',
      selectCategory: 'Оберіть категорію...',
      colorPlaceholder: 'Колір (color)',
      descPlaceholder: 'Опис',
      purchasePricePlaceholder: 'Закупівельна ціна (purchase_price)',
      pricePlaceholder: 'Ціна',
      stockPlaceholder: 'Кількість',
      cupTypePlaceholder: 'Тип чашки (cup_type)',
      sizesPlaceholder: 'Розміри (через кому)',
      addPhoto: 'Додати фото (до 8 шт.)',
      maxPhotoAlert: 'Максимальна кількість фото - 8.',
      uploadError: 'Помилка при завантаженні фото: ',
      uploadNetworkError: 'Помилка мережі при завантаженні фото',
      statusSelectCat: 'Будь ласка, оберіть категорію товару.',
      statusNameCodeRequired: 'Назва та Код товару є обов\'язковими.',
      statusSuccess: 'Товар додано!',
      statusAddError: 'Помилка при додаванні товару: ',
      statusNetworkError: 'Помилка мережі: ',
      loadingState: 'Завантаження...',
      addBtn: 'Додати товар'
    }
  }[lang];

  const handleTestConnection = async () => {
    setTesting(true);
    setTestResult(null);
    try {
      const result = await testSupabaseConnection(url, anonKey, tableName);
      setTestResult(result);
    } catch (e: any) {
      setTestResult({ success: false, hasTable: false, rowCount: 0, error: e.message });
    } finally {
      setTesting(false);
    }
  };

  const handleSeedDatabase = async () => {
    setSeeding(true);
    setSeedingResult(null);
    try {
      // Seed with custom list containing our active imported list
      const listToSeed = getDemoProducts();
      const result = await seedSupabaseProducts(listToSeed, (curr, tot) => {
        setSeedingProgress({ current: curr, total: tot });
      });
      setSeedingResult({ success: result.success, count: result.insertedCount, error: result.error });
      if (result.success) {
        // Automatically re-test to update row counter
        const updatedStatus = await testSupabaseConnection(url, anonKey, tableName);
        setTestResult(updatedStatus);
      }
    } catch (e: any) {
      setSeedingResult({ success: false, count: 0, error: e.message });
    } finally {
      setSeeding(false);
    }
  };

  // CSV paste importer
  const handleCSVImportText = () => {
    setCsvError('');
    setCsvSuccessCount(null);
    try {
      if (!csvText.trim()) {
        setCsvError(lang === 'ru' ? 'Пожалуйста, введите текст таблицы.' : 'Будь ласка, введіть текст таблиці.');
        return;
      }
      
      const parsed = parseCSVProducts(csvText);
      if (parsed.length === 0) {
        setCsvError(lang === 'ru' ? 'Не удалось распознать товары. Проверьте правильность заголовков.' : 'Не вдалося розпізнати товари. Перевірте правильність заголовків.');
        return;
      }
      
      localStorage.setItem('lastochka_imported_products', JSON.stringify(parsed));
      setLocalProductsCount(parsed.length);
      setCsvSuccessCount(parsed.length);
      setCsvText('');
      
      // Instantly update catalog in parent
      onConfigChange();
    } catch (e: any) {
      setCsvError(e.message || 'Error parsing CSV');
    }
  };

  // CSV file uploader
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setCsvError('');
    setCsvSuccessCount(null);
    
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        const parsed = parseCSVProducts(text);
        if (parsed.length === 0) {
          setCsvError(lang === 'ru' ? 'Не удалось найти товары в файле.' : 'Не вдалося знайти товари у файлі.');
          return;
        }
        
        localStorage.setItem('lastochka_imported_products', JSON.stringify(parsed));
        setLocalProductsCount(parsed.length);
        setCsvSuccessCount(parsed.length);
        
        // Instantly update catalog in parent
        onConfigChange();
      } catch (err: any) {
        setCsvError(err.message || 'Error reading file');
      }
    };
    reader.readAsText(file);
  };

  // Clear imported products and restore 100 default products
  const handleResetLocalProducts = () => {
    localStorage.removeItem('lastochka_imported_products');
    setLocalProductsCount(0);
    setCsvSuccessCount(null);
    setCsvError('');
    onConfigChange();
  };

  const handleSave = async () => {
    const configData = {
      mode,
      url,
      anonKey,
      secretKey,
      tableName
    };

    saveStoredConfig(configData);

    try {
      const auth = getAuthClient();
      let token = '';
      if (auth) {
        const sessionRes = await auth.auth.getSession();
        token = sessionRes.data.session?.access_token || '';
      }
      await fetch('/api/config/save', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          config: configData,
          adminPassword,
          token
        })
      });
    } catch (e) {
      console.error('Failed to sync config to server:', e);
    }

    onConfigChange();
    onClose();
  };

  const loadDefaults = () => {
    setUrl('');
    setAnonKey('');
    setSecretKey('');
    setTableName('products');
    setTestResult(null);
    setSeedingResult(null);
  };

  const copySqlToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(sqlSchema);
      setCopiedSql(true);
      setTimeout(() => setCopiedSql(false), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const sqlSchema = `-- Если таблица уже была создана ранее, просто выполните эти строки чтобы добавить новые колонки:
-- alter table products add column if not exists category text;
-- alter table products add column if not exists description text;
-- alter table products add column if not exists product_code text;
-- alter table products add column if not exists vendor_code text;
-- alter table products add column if not exists color text;
-- alter table products add column if not exists purchase_price numeric;
-- alter table products add column if not exists cup_type text;

create table if not exists products (
  id bigint primary key generated always as identity,
  product_code text,
  name text,
  category text,
  description text,
  vendor_code text,
  color text,
  purchase_price numeric,
  cup_type text,
  price numeric,
  photo jsonb,
  sizes text,
  stock integer
);

-- Enable select permissions for public access
alter table products enable row level security;
create policy "Allow public read access" on products for select using (true);
create policy "Allow service uploads" on products for insert with check (true);

-- 2. Структура SQL таблицы для блога
create table if not exists blog_posts (
  id text primary key,
  title text not null,
  content text,
  images jsonb,
  blocks jsonb,
  date text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table blog_posts enable row level security;
create policy "Allow public read access on blog_posts" on blog_posts for select using (true);
create policy "Allow service uploads on blog_posts" on blog_posts for insert with check (true);
create policy "Allow service updates on blog_posts" on blog_posts for update using (true);
create policy "Allow service deletes on blog_posts" on blog_posts for delete using (true);

-- 3. Структура SQL таблицы для заказов (orders)
create table if not exists orders (
  id text primary key,
  customer_name text,
  customer_phone text,
  delivery_info text,
  total numeric,
  status text default 'pending',
  items jsonb,
  items_text text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table orders enable row level security;
create policy "Allow public insert access on orders" on orders for insert with check (true);
create policy "Allow public read access on orders" on orders for select using (true);
create policy "Allow public update access on orders" on orders for update using (true);`;

  
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#0a0a0a] z-50 flex flex-col overflow-hidden">
      <div className="w-full h-full flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-[#121212]">
          <h2 className="text-white font-serif text-lg flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-[#d4af37]" />
            {t.title}
          </h2>
          <button onClick={onClose} className="p-2 text-white/50 hover:text-white hover:bg-white/5 rounded-full transition-colors cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex px-4 pt-4 gap-2 overflow-x-auto border-b border-white/10 bg-[#121212]">
            <button 
                onClick={() => setActiveTab('settings')}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === 'settings' ? 'border-[#d4af37] text-[#d4af37]' : 'border-transparent text-[#6b645d] hover:text-white'}`}
            >{lang === 'ru' ? 'Настройки БД' : 'Налаштування БД'}</button>
            <button 
                onClick={() => setActiveTab('products')}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === 'products' ? 'border-[#d4af37] text-[#d4af37]' : 'border-transparent text-[#6b645d] hover:text-white'}`}
            >{lang === 'ru' ? 'Товары' : 'Товари'}</button>
            <button 
                onClick={() => setActiveTab('orders')}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === 'orders' ? 'border-[#d4af37] text-[#d4af37]' : 'border-transparent text-[#6b645d] hover:text-white'}`}
            >{lang === 'ru' ? 'Заказы' : 'Замовлення'}</button>
            <button 
                onClick={() => setActiveTab('add')}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === 'add' ? 'border-[#d4af37] text-[#d4af37]' : 'border-transparent text-[#6b645d] hover:text-white'}`}
            >{lang === 'ru' ? 'Добавить товар' : 'Додати товар'}</button>
            <button 
                onClick={() => setActiveTab('blog')}
                className={`px-4 py-2 text-xs font-bold uppercase tracking-wider border-b-2 transition-colors ${activeTab === 'blog' ? 'border-[#d4af37] text-[#d4af37]' : 'border-transparent text-[#6b645d] hover:text-white'}`}
            >{lang === 'ru' ? 'Блог' : 'Блог'}</button>
        </div>

        {/* Content Body */}
        <div className={`overflow-y-auto flex-1 ${activeTab === 'orders' || activeTab === 'blog' ? 'p-0' : 'p-5 space-y-6'}`}>

          {activeTab === 'products' && (
              <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    <button 
                        onClick={() => setSelectedCategory('all')}
                        className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase ${selectedCategory === 'all' ? 'bg-[#d4af37] text-black' : 'bg-[#161616] text-[#a19992]'}`}
                    >{lang === 'ru' ? 'Все' : 'Всі'}</button>
                    {CATEGORIES.filter(c => c.key !== 'all').map(cat => (
                        <button 
                            key={cat.key}
                            onClick={() => setSelectedCategory(cat.key)}
                            className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase ${selectedCategory === cat.key ? 'bg-[#d4af37] text-black' : 'bg-[#161616] text-[#a19992]'}`}
                        >{lang === 'ru' ? cat.labelRu : cat.labelUa}</button>
                    ))}
                  </div>
                  <div className="p-2 bg-[#121212] border border-white/10 rounded-xl">
                    <AdminProductList isOpen={isOpen} onConfigChange={onConfigChange} selectedCategory={selectedCategory === 'all' ? undefined : selectedCategory} lang={lang} />
                  </div>
              </div>
          )}

          {activeTab === 'orders' && (
            <div className="w-full">
                <AdminOrders adminPassword={adminPassword} lang={lang} />
            </div>
          )}
          
          {activeTab === 'add' && (
            <div className="p-5 bg-[#121212] border border-white/10 rounded-xl space-y-4">
            <h3 className="font-serif text-white text-base flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#d4af37]" />
              {t.addTitle}
            </h3>
            
            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input type="text" placeholder={t.codePlaceholder} className="w-full p-2.5 bg-[#161616] border border-white/10 text-white rounded-lg text-xs" 
                    value={newProduct.product_code} onChange={e => setNewProduct({...newProduct, product_code: e.target.value})} />
                <input type="text" placeholder={t.vendorPlaceholder} className="w-full p-2.5 bg-[#161616] border border-white/10 text-white rounded-lg text-xs" 
                    value={newProduct.vendor_code} onChange={e => setNewProduct({...newProduct, vendor_code: e.target.value})} />
              </div>
              <input type="text" placeholder={t.namePlaceholder} className="w-full p-2.5 bg-[#161616] border border-white/10 text-white rounded-lg text-xs" 
                value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} />
              <div className="grid grid-cols-2 gap-3">
                <select className="w-full p-2.5 bg-[#161616] border border-white/10 text-white rounded-lg text-xs" 
                  value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})}>
                  <option value="" disabled>{t.selectCategory}</option>
                  {CATEGORIES.filter(c => c.key !== 'all').map(cat => (
                    <option key={cat.key} value={cat.key}>{lang === 'ru' ? cat.labelRu : cat.labelUa}</option>
                  ))}
                </select>
                <input type="text" placeholder={t.colorPlaceholder} className="w-full p-2.5 bg-[#161616] border border-white/10 text-white rounded-lg text-xs" 
                  value={newProduct.color} onChange={e => setNewProduct({...newProduct, color: e.target.value})} />
              </div>
              <textarea placeholder={t.descPlaceholder} className="w-full p-2.5 bg-[#161616] border border-white/10 text-white rounded-lg text-xs" 
                value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} />
              <div className="grid grid-cols-2 gap-3">
                <input type="number" placeholder={t.purchasePricePlaceholder} className="w-full p-2.5 bg-[#161616] border border-white/10 text-white rounded-lg text-xs" 
                    value={newProduct.purchase_price || ''} onChange={e => setNewProduct({...newProduct, purchase_price: Number(e.target.value)})} />
                <input type="number" placeholder={t.pricePlaceholder} className="w-full p-2.5 bg-[#161616] border border-white/10 text-white rounded-lg text-xs" 
                    value={newProduct.price || ''} onChange={e => setNewProduct({...newProduct, price: Number(e.target.value)})} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <input type="number" placeholder={t.stockPlaceholder} className="w-full p-2.5 bg-[#161616] border border-white/10 text-white rounded-lg text-xs" 
                    value={newProduct.stock || ''} onChange={e => setNewProduct({...newProduct, stock: Number(e.target.value)})} />
                <input type="text" placeholder={t.cupTypePlaceholder} className="w-full p-2.5 bg-[#161616] border border-white/10 text-white rounded-lg text-xs" 
                  value={newProduct.cup_type} onChange={e => setNewProduct({...newProduct, cup_type: e.target.value})} />
              </div>
              <input type="text" placeholder={t.sizesPlaceholder} className="w-full p-2.5 bg-[#161616] border border-white/10 text-white rounded-lg text-xs" 
                value={newProduct.sizes} onChange={e => setNewProduct({...newProduct, sizes: e.target.value})} />
              <div className="flex flex-col gap-2">
                <label className="cursor-pointer bg-[#222] hover:bg-[#333] transition-colors border border-dashed border-white/20 p-4 rounded-lg flex flex-col items-center justify-center text-gray-400 text-xs">
                   <span>{t.addPhoto} {uploading && <Loader2 className="inline w-3 h-3 ml-2 animate-spin" />}</span>
                   <input type="file" multiple className="hidden" disabled={uploading} onChange={async (e) => {
                    if (!e.target.files) return;
                    const files = Array.from(e.target.files) as File[];
                    if (files.length + newProduct.photo.length > 8) {
                        alert(t.maxPhotoAlert);
                        return;
                    }
                    
                    setUploading(true);
                    
                    const newPreviews = [];
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
                    
                    setNewProduct(prev => ({
                        ...prev, 
                        photo: [...prev.photo, ...newPreviews.map(p => p.tempId)].slice(0, 8)
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
                            setNewProduct(prev => ({
                                ...prev,
                                photo: prev.photo.map(u => u === preview.tempId ? preview.content : u)
                            }));
                            continue;
                          }
                          setLocalPreviews(prev => ({...prev, [data.url]: preview.content}));
                          setNewProduct(prev => ({
                              ...prev,
                              photo: prev.photo.map(u => u === preview.tempId ? data.url : u)
                          }));
                      } catch (err) {
                          // Fallback to data URL
                          setLocalPreviews(prev => ({ ...prev, [preview.content]: preview.content }));
                          setNewProduct(prev => ({
                              ...prev,
                              photo: prev.photo.map(u => u === preview.tempId ? preview.content : u)
                          }));
                      }
                    }
                    setUploading(false);
                    e.target.value = '';
                  }} />
                </label>
                {newProduct.photo.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                        {newProduct.photo.map((url, idx) => (
                            <div key={idx} className="relative group">
                                <img src={localPreviews[url] || url} alt="preview" className="w-16 h-16 object-cover rounded-md border border-white/10 bg-[#111]" />
                                <button type="button" onClick={() => setNewProduct(prev => ({...prev, photo: prev.photo.filter((_, i) => i !== idx)}))} className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity">×</button>
                            </div>
                        ))}
                    </div>
                )}
              </div>
              {addStatus && (
                <div className={`p-3 rounded-lg text-xs font-bold ${addStatus.type === 'success' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-red-500/10 text-red-400 border border-red-500/20'}`}>
                  {addStatus.msg}
                </div>
              )}
              <button 
                disabled={uploading}
                onClick={async () => {
                    if (!newProduct.category) {
                        setAddStatus({ type: 'error', msg: t.statusSelectCat });
                        return;
                    }
                    if (!newProduct.name || !newProduct.product_code) {
                        setAddStatus({ type: 'error', msg: t.statusNameCodeRequired });
                        return;
                    }
                    setUploading(true);
                    setAddStatus(null);
                    try {
                        let token = '';
                        try {
                            
                            const authClient = getAuthClient();
                            if (authClient) {
                                const { data: { session } } = await authClient.auth.getSession();
                                if (session) token = session.access_token;
                            }
                        } catch(e) {}

                        const res = await fetch('/api/products/add', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ 
                            product: newProduct, 
                            sheetId: '1T6fOVgUyrUxNZKwEI5_nKk1UQWf8f_AZc-FeB0UNQAM',
                            tableName: tableName,
                            supabaseUrl: url,
                            supabaseSecretKey: secretKey || anonKey,
                            adminPassword: adminPassword,
                            token: token
                        })
                    });
                    const data = await res.json();
                    setUploading(false);
                    if (res.ok) {
                        setAddStatus({ type: 'success', msg: t.statusSuccess });
                        setNewProduct({ 
                          product_code: '', 
                          vendor_code: '', 
                          name: '', 
                          category: '', 
                          description: '', 
                          color: '', 
                          purchase_price: 0, 
                          price: 0, 
                          cup_type: '', 
                          sizes: '', 
                          stock: 0, 
                          photo: [] 
                        });
                        setLocalPreviews({});
                        setTimeout(() => setAddStatus(null), 3000);
                    } else {
                        setAddStatus({ type: 'error', msg: t.statusAddError + (data.error || 'Unknown error') });
                    }
                } catch (err: any) {
                    setUploading(false);
                    setAddStatus({ type: 'error', msg: t.statusNetworkError + err.message });
                }
                }}
                className="w-full p-2.5 bg-[#d4af37] text-black font-bold rounded-lg text-xs"
              >
                {uploading ? t.loadingState : t.addBtn}
              </button>
            </div>
            </div>
          )}

          {activeTab === 'blog' && (
            <div className="p-4 md:p-6 bg-[#121212] min-h-full">
              <div className="bg-white rounded-2xl p-4 md:p-8 text-gray-900 shadow-xl border border-gray-200/20">
                <BlogView
                  lang={lang}
                  managerMode={true}
                  posts={blogPosts.length === 0 ? getDefaultBlogPosts(lang) : blogPosts}
                  onAddPost={onAddBlogPost}
                  onDeletePost={onDeleteBlogPost}
                />
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
              <div className="space-y-6">
                {/* Mode Switcher */}
                <div className="p-4 bg-[#121212] rounded-xl border border-white/10">
                    <label className="block text-[10px] font-bold uppercase tracking-wider text-[#6b645d] mb-3">{t.modeLabel}</label>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <button
                        type="button"
                        onClick={() => setMode('demo')}
                        className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                        mode === 'demo' 
                            ? 'border-[#d4af37] bg-[#d4af37]/5 shadow-sm' 
                            : 'border-white/10 hover:border-white/25 bg-[#161616]'
                        }`}
                    >
                        <div className="flex items-center gap-2 font-semibold text-white">
                        <Sparkles className={`w-4 h-4 ${mode === 'demo' ? 'text-[#d4af37]' : 'text-[#6b645d]'}`} />
                        {t.demoMode}
                        </div>
                        <p className="text-xs text-[#a19992] mt-2 leading-relaxed">{t.demoDesc}</p>
                    </button>

                    <button
                        type="button"
                        onClick={() => setMode('supabase')}
                        className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                        mode === 'supabase' 
                            ? 'border-[#d4af37] bg-[#d4af37]/5 shadow-sm' 
                            : 'border-white/10 hover:border-white/25 bg-[#161616]'
                        }`}
                    >
                        <div className="flex items-center gap-2 font-semibold text-white">
                        <Database className={`w-4 h-4 ${mode === 'supabase' ? 'text-[#d4af37]' : 'text-[#6b645d]'}`} />
                        {t.supabaseMode}
                        </div>
                        <p className="text-xs text-[#a19992] mt-2 leading-relaxed">{t.supabaseDesc}</p>
                    </button>
                    </div>
                </div>

                {/* Form Fields (Supabase settings) */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                    <h3 className="font-serif text-white text-base">
                      {lang === 'ru' ? 'Параметры подключения к Supabase' : 'Параметри підключення до Supabase'}
                    </h3>
                    <button 
                        type="button"
                        onClick={loadDefaults}
                        className="text-xs text-[#d4af37] hover:text-white font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                    >
                        <RotateCcw className="w-3 h-3" />
                        {t.loadDefaults}
                    </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-xs font-semibold text-[#a19992] mb-1">{t.urlLabel}</label>
                        <input
                        type="text"
                        value={url}
                        onChange={e => setUrl(e.target.value)}
                        placeholder="https://your-project.supabase.co"
                        className="w-full p-2.5 bg-[#161616] border border-white/10 text-white rounded-lg text-xs focus:outline-none focus:border-[#d4af37] transition-all font-mono"
                        />
                    </div>

                    <div>
                        <label className="block text-xs font-semibold text-[#a19992] mb-1">{t.tableLabel}</label>
                        <input
                        type="text"
                        value={tableName}
                        onChange={e => setTableName(e.target.value)}
                        placeholder="products"
                        className="w-full p-2.5 bg-[#161616] border border-white/10 text-white rounded-lg text-xs focus:outline-none focus:border-[#d4af37] transition-all font-mono"
                        />
                    </div>
                    </div>

                    <div className="relative">
                    <div className="flex items-center justify-between mb-1">
                        <label className="block text-xs font-semibold text-[#a19992]">{t.keyLabel}</label>
                        <button
                        type="button"
                        onClick={() => setShowKeys(!showKeys)}
                        className="text-xs text-[#d4af37] hover:text-white flex items-center gap-1 cursor-pointer"
                        >
                        {showKeys ? (lang === 'ru' ? 'Скрыть' : 'Приховати') : (lang === 'ru' ? 'Показать' : 'Показати')}
                        </button>
                    </div>
                    <input
                        type={showKeys ? "text" : "password"}
                        value={anonKey}
                        onChange={e => setAnonKey(e.target.value)}
                        placeholder="eyJhbGciOiJIUzI1NiIsIn..."
                        className="w-full p-2.5 bg-[#161616] border border-white/10 text-white rounded-lg text-xs focus:outline-none focus:border-[#d4af37] transition-all font-mono"
                    />
                    </div>

                    {showKeys && (
                    <div className="p-3 bg-[#121212] rounded-lg border border-white/10 text-xs text-[#a19992] font-mono flex flex-col gap-1">
                        <span className="font-semibold text-white">
                          {lang === 'ru' ? 'Секретный ключ (sb_secret):' : 'Секретний ключ (sb_secret):'}
                        </span>
                        <span className="break-all">{secretKey}</span>
                        <span className="text-[10px] text-[#6b645d] mt-1">
                        {lang === 'ru' 
                          ? '* Данный ключ используется во внутренних API запросах и не передается сторонним сервисам.' 
                          : '* Даний ключ використовується у внутрішніх API запитах і не передається стороннім сервісам.'}
                        </span>
                    </div>
                    )}
                </div>

                {/* SQL Creator */}
                <div className="p-4 bg-[#121212] border border-white/10 rounded-xl space-y-3">
                    <div className="flex items-center justify-between">
                    <h4 className="font-bold text-xs tracking-wider uppercase text-[#d4af37] flex items-center gap-1.5">
                        <span>{t.sqlTitle}</span>
                    </h4>
                    <button
                        type="button"
                        onClick={copySqlToClipboard}
                        className="p-1.5 px-3 bg-[#161616] text-xs text-white border border-white/10 rounded hover:bg-white/5 transition-colors flex items-center gap-1 font-bold cursor-pointer"
                    >
                        <Copy className="w-3.5 h-3.5" />
                        {copiedSql ? t.copied : t.copyBtn}
                    </button>
                    </div>
                    <p className="text-xs text-[#a19992] font-sans leading-relaxed">
                    {t.sqlDesc}
                    </p>
                    <pre className="p-3 bg-black/40 text-[11px] font-mono text-emerald-400 rounded-lg overflow-x-auto max-h-[140px] select-all border border-white/5">
                    {sqlSchema}
                    </pre>
                </div>

                {/* Test & Connection Results */}
                <div className="flex flex-col md:flex-row gap-3">
                    <button
                    type="button"
                    onClick={handleTestConnection}
                    disabled={testing}
                    className="flex-1 py-3 px-4 bg-white hover:bg-[#d4af37] disabled:bg-neutral-800 text-black font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                    {testing ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                        <RefreshCw className="w-4 h-4" />
                    )}
                    {testing ? t.testingState : t.testBtn}
                    </button>
                </div>

                {testResult && (
                    <div className={`p-4 rounded-xl border flex items-start gap-3 ${
                    testResult.success 
                        ? 'bg-emerald-950/20 border-emerald-900/50 text-emerald-300' 
                        : 'bg-rose-950/20 border-rose-900/50 text-rose-300'
                    }`}>
                    {testResult.success ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                        <XCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                    )}
                    <div className="text-xs space-y-1">
                        <p className="font-bold">{testResult.success ? t.connSuccess : t.connError}</p>
                        {testResult.success ? (
                        <>
                            <p>{testResult.hasTable ? t.tableExists.replace('{name}', tableName) : testResult.error}</p>
                            {testResult.hasTable && (
                            <p className="font-semibold text-emerald-400">
                                {testResult.rowCount === 0 
                                ? t.tableEmpty.replace('{name}', tableName) 
                                : t.tableCount.replace('{name}', tableName).replace('{count}', String(testResult.rowCount))
                                }
                            </p>
                            )}
                        </>
                        ) : (
                        <p className="font-mono break-all leading-normal text-rose-400">{testResult.error}</p>
                        )}
                    </div>
                    </div>
                )}

                {/* Database Seeder */}
                {testResult?.success && testResult.hasTable && (
                    <div className="p-4 bg-amber-950/20 border border-amber-900/30 rounded-xl space-y-3">
                    <h4 className="font-bold text-[#d4af37] flex items-center gap-1.5 text-xs uppercase tracking-wider">
                        <Sparkles className="w-4 h-4" />
                        {t.seedTitle}
                    </h4>
                    <p className="text-xs text-[#a19992] leading-relaxed">
                        {t.seedDesc}
                    </p>
                    
                    <button
                        type="button"
                        onClick={handleSeedDatabase}
                        disabled={seeding}
                        className="w-full py-2.5 px-4 bg-[#d4af37] hover:bg-white disabled:bg-neutral-800 text-black text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-all cursor-pointer"
                    >
                        {seeding ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                        <Play className="w-3.5 h-3.5 fill-current" />
                        )}
                        {seeding ? `${t.seedingState} (${seedingProgress.current}/${seedingProgress.total})` : t.seedBtn}
                    </button>

                    {seedingResult && (
                        <div className={`p-3 rounded-lg border text-xs ${
                        seedingResult.success ? 'bg-emerald-950/20 border-emerald-900/35 text-emerald-300' : 'bg-rose-950/20 border-rose-900/35 text-rose-300'
                        }`}>
                        {seedingResult.success ? (
                            <p className="font-semibold">{t.seedSuccess.replace('{count}', String(seedingResult.count))}</p>
                        ) : (
                            <p className="font-mono text-rose-400">Ошибка: {seedingResult.error}</p>
                        )}
                        </div>
                    )}
                    </div>
                )}

                {/* -------------------- CSV IMPORTER SECTION -------------------- */}
                <div className="p-5 bg-[#121212] border border-white/10 rounded-xl space-y-4">
                    <div className="flex items-center justify-between">
                    <h3 className="font-serif text-white text-base flex items-center gap-2">
                        <FileSpreadsheet className="w-5 h-5 text-[#d4af37]" />
                        {t.csvTitle}
                    </h3>
                    {localProductsCount > 0 && (
                        <button
                        type="button"
                        onClick={handleResetLocalProducts}
                        className="text-xs text-rose-400 hover:text-rose-300 font-bold flex items-center gap-1 transition-colors cursor-pointer"
                        >
                        <Trash2 className="w-3.5 h-3.5" />
                        {t.csvResetBtn}
                        </button>
                    )}
                    </div>
                    
                    <p className="text-xs text-[#a19992] leading-relaxed">
                    {t.csvDesc}
                    </p>

                    <div className="text-xs text-[#d4af37] bg-[#d4af37]/5 border border-[#d4af37]/20 p-2.5 rounded-lg flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{t.csvFormatHelp}</span>
                    </div>

                    <div className="flex flex-col gap-3">
                    <textarea 
                        value={csvText}
                        onChange={e => setCsvText(e.target.value)}
                        placeholder={t.csvPlaceholder}
                        className="w-full h-32 p-3 bg-[#161616] border border-white/10 text-white rounded-lg text-xs font-mono resize-none focus:outline-none focus:border-[#d4af37] transition-all"
                    />
                    <button
                        type="button"
                        onClick={handleCSVImportText}
                        className="w-full py-2.5 px-4 bg-[#161616] hover:bg-[#1a1a1a] border border-white/10 hover:border-white/20 text-white text-xs font-bold rounded-lg transition-all cursor-pointer flex items-center justify-center gap-2"
                    >
                        <FileText className="w-3.5 h-3.5" />
                        {lang === 'ru' ? 'Вставить как текст' : 'Вставити як текст'}
                    </button>
                    </div>

                    <div className="relative border-t border-white/5 pt-4">
                        <label className="cursor-pointer group flex flex-col items-center justify-center p-6 border border-dashed border-white/10 hover:border-[#d4af37] rounded-xl bg-[#161616] hover:bg-[#d4af37]/5 transition-all">
                        <UploadCloud className="w-6 h-6 text-[#6b645d] group-hover:text-[#d4af37] mb-2 transition-colors" />
                        <span className="text-xs font-semibold text-[#a19992] group-hover:text-white transition-colors">{t.csvUploadLabel}</span>
                        <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" />
                        </label>
                    </div>

                    {csvError && (
                    <div className="p-3 bg-rose-950/20 border border-rose-900/30 rounded-lg flex items-start gap-2 text-rose-400">
                        <XCircle className="w-4 h-4 shrink-0 mt-0.5" />
                        <p className="text-xs font-mono">{csvError}</p>
                    </div>
                    )}
                    
                    {csvSuccessCount !== null && (
                    <div className="p-3 bg-emerald-950/20 border border-emerald-900/30 rounded-lg flex items-start gap-2 text-emerald-400">
                        <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
                        <p className="text-xs font-semibold">{t.csvSuccessMsg.replace('{count}', String(csvSuccessCount))}</p>
                    </div>
                    )}
                </div>
                {/* -------------------- END OF CSV IMPORTER -------------------- */}

              </div>
          )}

        </div>

{/* Footer actions */}
        <div className="p-4 bg-[#0a0a0a] border-t border-white/10 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-[#a19992] hover:text-white transition-colors cursor-pointer"
          >
            {t.close}
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 bg-[#d4af37] hover:bg-white text-black text-xs font-bold rounded-xl transition-all shadow-sm cursor-pointer"
          >
            {t.saveBtn}
          </button>
        </div>

      </div>
    </div>
  );
}

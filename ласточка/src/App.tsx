import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Search, 
  SlidersHorizontal, 
  Heart, 
  ShoppingBag, 
  Database, 
  Flame, 
  Shirt, 
  Footprints, 
  Layers, 
  Gamepad2, 
  ArrowUpDown,
  BookOpen,
  Filter,
  Check,
  AlertTriangle,
  RotateCcw,
  Sparkle,
  Star,
  X,
  Info,
  BadgeAlert,
  Sliders,
  ChevronLeft,
  ChevronRight,
  Phone,
  ChevronDown,
  Sun,
  Moon,
  Globe,
  Mail, Home, Clock, CornerUpRight, Share, Eye, EyeOff, Instagram, ArrowRight, Send} from 'lucide-react';
import { Product, CategoryKey, CartItem, Order, BlogPost, Banner } from './types';
import { CATEGORIES, PRODUCTS, getCleanImage, cleanImageUrl, OFFICIAL_COLORS, matchProductColor, isProductInCategory } from './data';
import { fetchSupabaseProducts, getStoredConfig, getDemoProducts, getAuthClient, fetchSupabaseBlogPosts, saveSupabaseBlogPost, deleteSupabaseBlogPost, fetchBanners } from './lib/supabase';
import ProductCard from './components/ProductCard';
import DetailModal from './components/DetailModal';
import CartDrawer from './components/CartDrawer';
import AdminPanel from './components/AdminPanel';
import BlogView from './components/BlogView';
import BannerCarousel from './components/BannerCarousel';
import { motion, AnimatePresence } from 'motion/react';
import { getDefaultBlogPosts } from './defaultBlogPosts';
import { maybeTranslate } from './lib/translator';
import { BRAND_LOGO_BASE64 } from './assets/logo_base64';


const BRA_SUBTYPES = [
  { id: 0, ru: "Все типы", ua: "Всі типи", match: [] },
  { id: 1, ru: "Тонкий поролон", ua: "Тонкий поролон", match: ["тонкий", "thin"] },
  { id: 2, ru: "Гладкие", ua: "Гладкі", match: ["гладк", "smooth"] },
  { id: 3, ru: "На поролоне", ua: "На поролоні", match: ["поролон", "foam"] },
  { id: 4, ru: "Анжелика", ua: "Анжеліка", match: ["анжелік", "angelic"] },
  { id: 5, ru: "Кружевные", ua: "Мереживні", match: ["мережив", "кружев", "lace"] },
  { id: 6, ru: "Бесшовные", ua: "Безшовні", match: ["безшов", "бесшов", "seamless"] },
  { id: 7, ru: "Пуш-ап/корректор", ua: "Пуш-ап/коректор", match: ["пуш", "push", "корект", "коррект"] },
  { id: 8, ru: "Без поролона на косточках", ua: "Без поролону на кісточках", match: ["кісточ", "косточ", "без поролон"] },
  { id: 9, ru: "Без поролона и без косточек", ua: "Без поролону і без кісточок", match: ["м'який", "мягк", "без кісточ", "без косточ"] },
  { id: 10, ru: "На поролоне без косточек", ua: "На поролоні без кісточок", match: ["поролон", "без кісточ", "без косточ"] },
  { id: 11, ru: "Корсеты", ua: "Корсети", match: ["корсет", "corset"] },
  { id: 12, ru: "Для кормящих", ua: "Для годуючих", match: ["году", "корм"] },
  { id: 13, ru: "Силиконовые бра", ua: "Силіконові бра", match: ["силікон", "силикон", "silicon"] },
  { id: 14, ru: "Топы", ua: "Топи", match: ["top", "топ"] },
];

const PANTIES_SUBTYPES = [
  { id: 0, ru: "Все типы", ua: "Всі типи", match: [] },
  { id: 1, ru: "Стринги", ua: "Стрінги", match: ["стрінг", "стринг", "string", "thong"] },
  { id: 2, ru: "Бразилианы", ua: "Бразиліани", match: ["бразил", "brazil"] },
  { id: 3, ru: "Слипы", ua: "Сліпи", match: ["сліп", "слип", "slip"] },
  { id: 4, ru: "Шорты", ua: "Шорти", match: ["шорт", "short"] },
  { id: 5, ru: "Баталы", ua: "Батали", match: ["батал", "великих", "больших"] },
  { id: 6, ru: "Бесшовные", ua: "Безшовні", match: ["безшов", "бесшов", "seamless", "лазер"] },
  { id: 7, ru: "Корректирующие", ua: "Корегуючі", match: ["корегу", "коррект", "утяж", "моделю"] },
  { id: 8, ru: "Панталоны", ua: "Панталони", match: ["панталон"] },
  { id: 9, ru: "Мужские плавки", ua: "Чоловічі плавки", match: ["плавки", "мужс", "чоловіч"] },
  { id: 10, ru: "Мужские семейные", ua: "Чоловічі сімейні", match: ["сімейн", "семейн", "сімейки", "семейки"] },
  { id: 11, ru: "Мужские боксеры", ua: "Чоловічі боксери", match: ["боксер"] },
  { id: 12, ru: "Наборы трусиков", ua: "Набори трусиків", match: ["набір", "набор", "комплект трус"] },
];

const PAJAMA_SUBTYPES = [
  { id: 0, ru: "Все типы", ua: "Всі типи", match: [] },
  { id: 1, ru: "Халаты", ua: "Халати", match: ["халат"] },
  { id: 2, ru: "Пижама с шортами", ua: "Піжама з шортами", match: ["шорт"] },
  { id: 3, ru: "Пижама со штанами", ua: "Піжама зі штанами", match: ["штан", "брюк"] },
  { id: 4, ru: "Ночные сорочки", ua: "Нічні сорочки", match: ["сороч", "ночн", "ніч"] },
  { id: 5, ru: "Теплые пижамы", ua: "Теплі піжами", match: ["тепл", "махр", "фліс", "флис"] },
  { id: 6, ru: "Велосипедки", ua: "Велосипедки", match: ["велосипед"] },
  { id: 7, ru: "Лосины", ua: "Лосини", match: ["лосин", "леггинс"] },
  { id: 8, ru: "Одежда для дома", ua: "Одяг для дому", match: ["дому", "одяг"] },
];

const SWIMWEAR_SUBTYPES = [
  { id: 0, ru: "Все типы", ua: "Всі типи", match: [] },
  { id: 1, ru: "Женские открытые", ua: "Жіночі відкриті", match: ["відкрит", "открыт", "роздільн", "раздельный", "бікіні", "bikini"] },
  { id: 2, ru: "Женские закрытые", ua: "Жіночі закриті", match: ["закрит", "закрыт", "суцільн", "сплошной", "монокіні", "monokini"] },
  { id: 3, ru: "Женские плавки", ua: "Жіночі плавки", match: ["плавки", "жіноч"] },
  { id: 4, ru: "Мужские плавки", ua: "Чоловічі плавки", match: ["плавки", "чоловіч"] },
  { id: 5, ru: "Детские купальники", ua: "Дитячі купальники", match: ["дит", "детс"] },
  { id: 6, ru: "Чашка поролон", ua: "Чашка поролон", match: ["поролон"] },
  { id: 7, ru: "Мягкая чашка", ua: "М'яка чашка", match: ["м'яка", "мягк"] },
];

const SET_SUBTYPES = [
  { id: 0, ru: "Все типы", ua: "Всі типи", match: [] },
  { id: 1, ru: "Кружевные", ua: "Мережевні", match: ["мереж", "кружев"] },
  { id: 2, ru: "На поролоне", ua: "На поролоні", match: ["поролон"] },
  { id: 3, ru: "Пуш-ап/корректор", ua: "Пуш-ап/коректор", match: ["пуш", "корект", "коррект"] },
  { id: 4, ru: "Бралетт-комплект", ua: "Бралет-комплект", match: ["bra", "бралет"] },
  { id: 5, ru: "Боди", ua: "Боді", match: ["боді", "боди"] },
  { id: 6, ru: "Комплекты с топами", ua: "Комплекти з топами", match: ["комплект", "топ"] },
  { id: 7, ru: "Без поролона", ua: "Без поролону", match: ["без поролон"] },
  { id: 8, ru: "С тонким поролоном", ua: "З тонким поролоном", match: ["тонким", "поролон"] },
  { id: 9, ru: "Бесшовные", ua: "Безшовні", match: ["безшов", "бесшов"] },
  { id: 10, ru: "Спортивные", ua: "Спортивні", match: ["спорт"] },
  { id: 11, ru: "Эротические", ua: "Еротичні", match: ["еротич", "эротич"] },
];

const THERMAL_SUBTYPES = [
  { id: 0, ru: "Все типы", ua: "Всі типи", match: [] },
  { id: 1, ru: "Женская", ua: "Жіноча", match: ["жіноч", "женс"] },
  { id: 2, ru: "Мужская", ua: "Чоловіча", match: ["чоловіч", "мужс"] },
  { id: 3, ru: "Детская", ua: "Дитяча", match: ["дит", "детс"] },
];

const EROTIC_SUBTYPES = [
  { id: 0, ru: "Все типы", ua: "Всі типи", match: [] },
  { id: 1, ru: "Чулки", ua: "Панчохи", match: ["панчох", "чулк"] },
  { id: 2, ru: "Трусики", ua: "Трусики", match: ["труси", "стрінг", "стринг"] },
  { id: 3, ru: "Комплекты", ua: "Комплекти", match: ["комплект"] },
  { id: 4, ru: "Пеньюары", ua: "Пеньюари", match: ["пеньюар"] },
  { id: 5, ru: "Боди", ua: "Боді", match: ["боді", "боди"] },
  { id: 6, ru: "Пояса для чулок", ua: "Пояси для панчох", match: ["пояс"] },
  { id: 7, ru: "Халаты", ua: "Халати", match: ["халат"] },
  { id: 8, ru: "Мужчинам", ua: "Чоловікам", match: ["чоловіч", "мужчин"] },
];

const TOYS_SUBTYPES = [
  { id: 0, ru: "Все типы", ua: "Всі типи", match: [] },
  { id: 1, ru: "Маски", ua: "Маски", match: ["маск"] },
  { id: 2, ru: "Стрепы", ua: "Стреп", match: ["стреп"] },
  { id: 3, ru: "Бретельки", ua: "Бретельки", match: ["бретел"] },
  { id: 4, ru: "Удлинители", ua: "Подовжувачі", match: ["подовжувач", "удлините"] },
  { id: 5, ru: "Контейнеры для стирки", ua: "Контейнери для прання", match: ["контейнер", "прання", "стирк"] },
  { id: 6, ru: "Пояса для чулок", ua: "Пояси для панчох", match: ["пояс"] },
  { id: 7, ru: "Вибраторы и дилдо", ua: "Вібратори і ділдо", match: ["вібратор", "вибратор", "ділдо", "дилдо"] },
  { id: 8, ru: "Мастурбаторы", ua: "Мастурбатори", match: ["мастурбат"] },
  { id: 9, ru: "Эрекционные кольца и насадки", ua: "Ерекційні кільця і насадки", match: ["кільця", "кольца", "насадк", "ерекційн"] },
  { id: 10, ru: "Вагинальные шарики", ua: "Вагінальні кульки", match: ["кульк", "шарик", "вагінальн", "вагинальн"] },
  { id: 11, ru: "Анальные пробки", ua: "Анальні пробки", match: ["анальн", "пробк", "втулк"] },
  { id: 12, ru: "Игры", ua: "Ігри", match: ["ігр", "игр"] },
  { id: 13, ru: "BDSM фетиш", ua: "BDSM фетиш", match: ["bdsm", "бдсм", "фетиш", "пліть", "плеть", "наручник", "кляп"] },
  { id: 14, ru: "Лубриканты", ua: "Лубриканти", match: ["лубрикант", "смазк"] },
];

const MENU_TRANSLATIONS: Record<string, { ru: string; ua: string }> = {
  'БЮСТГАЛЬТЕРИ': { ru: 'БЮСТГАЛЬТЕРЫ', ua: 'БЮСТГАЛЬТЕРИ' },
  'ТРУСИКИ': { ru: 'ТРУСИКИ', ua: 'ТРУСИКИ' },
  'ОДЯГ ДЛЯ ДОМУ': { ru: 'ОДЕЖДА ДЛЯ ДОМА', ua: 'ОДЯГ ДЛЯ ДОМУ' },
  'КУПАЛЬНИКИ': { ru: 'КУПАЛЬНИКИ', ua: 'КУПАЛЬНИКИ' },
  'КОМПЛЕКТИ БІЛИЗНИ': { ru: 'КОМПЛЕКТЫ БЕЛЬЯ', ua: 'КОМПЛЕКТИ БІЛИЗНИ' },
  'ТЕРМОБІЛИЗНА': { ru: 'ТЕРМОБЕЛЬЕ', ua: 'ТЕРМОБІЛИЗНА' },
  'ЕРОТИЧНА БІЛИЗНА': { ru: 'ЭРОТИЧЕСКОЕ БЕЛЬЕ', ua: 'ЕРОТИЧНА БІЛИЗНА' },
  'ІГРАШКИ ТА АКСЕСУАРИ': { ru: 'ИГРУШКИ И АКСЕССУАРЫ', ua: 'ІГРАШКИ ТА АКСЕСУАРИ' },
  'ШКАРПЕТКИ': { ru: 'НОСКИ', ua: 'ШКАРПЕТКИ' },
  'НОВИНКИ': { ru: 'НОВИНКИ', ua: 'НОВИНКИ' },
  'БЛОГ': { ru: 'БЛОГ', ua: 'БЛОГ' },
};

export default function App() {
  // Localization & Theme Mode
  const [lang, setLang] = useState<'ru' | 'ua'>('ua'); // Default to Ukrainian as catalog matches UA, but easily swap to RU
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('lastochka_theme');
      return (saved as 'light' | 'dark') || 'light';
    } catch {
      return 'light';
    }
  });

  useEffect(() => {
    try {
      const root = window.document.documentElement;
      if (theme === 'dark') {
        root.classList.add('dark');
      } else {
        root.classList.remove('dark');
      }
      localStorage.setItem('lastochka_theme', theme);
    } catch (err) {
      console.error('Error applying theme:', err);
    }
  }, [theme]);

  const [managerMode, setManagerMode] = useState<boolean>(false); // Secret shopowner mode to display margins!
  const [banners, setBanners] = useState<Banner[]>([]);

  const loadBanners = async () => {
    const list = await fetchBanners();
    setBanners(list);
  };

  useEffect(() => {
    loadBanners();
  }, []);

  
  const handleCategorySelect = (categoryKey: string) => {
    if (categoryKey && categoryKey !== 'all') {
      setSelectedCategory(categoryKey as CategoryKey);
      setActiveView('catalog');
    } else {
      setSelectedCategory('all');
      setActiveView('catalog');
    }
  };

  // Products Lists
  const [allProducts, setAllProducts] = useState<Product[]>(getStoredConfig().mode === 'supabase' ? [] : getDemoProducts());
  const [loading, setLoading] = useState<boolean>(true);
  const [dbStatus, setDbStatus] = useState<{ mode: 'demo' | 'supabase'; connected: boolean; error?: string }>({
    mode: 'demo',
    connected: false
  });

  // Filters & Searching
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<CategoryKey>('all');
  const [selectedPantiesType, setSelectedPantiesType] = useState<number>(0);
  const [selectedBraType, setSelectedBraType] = useState<number>(0);
  const [selectedPajamaType, setSelectedPajamaType] = useState<number>(0);
  const [selectedSwimwearType, setSelectedSwimwearType] = useState<number>(0);
  const [selectedSetType, setSelectedSetType] = useState<number>(0);
  const [selectedThermalType, setSelectedThermalType] = useState<number>(0);
  const [selectedEroticType, setSelectedEroticType] = useState<number>(0);
  const [selectedToysType, setSelectedToysType] = useState<number>(0);
  const [selectedMenu, setSelectedMenu] = useState<string>('all');
  const [hoveredMenu, setHoveredMenu] = useState<string | null>(null);
  const [maxPrice, setMaxPrice] = useState<number>(1200);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColor, setSelectedColor] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('default'); // 'default', 'priceAsc', 'priceDesc', 'stock'
  const [showFilters, setShowFilters] = useState<boolean>(false);
  const [isCategoriesExpanded, setIsCategoriesExpanded] = useState<boolean>(true);
  const [expandedCategoryKeys, setExpandedCategoryKeys] = useState<Set<string>>(new Set(['bras', 'panties']));
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Reset page when search or filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedCategory, selectedMenu, maxPrice, selectedSizes, selectedColor, sortBy]);

  // Modals & Panels toggles
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAdminOpen, setIsAdminOpen] = useState<boolean>(false);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  
  const [isAdminAuthModalOpen, setIsAdminAuthModalOpen] = useState<boolean>(false);
  const [adminPasswordInput, setAdminPasswordInput] = useState<string>('');
  const [adminEmailInput, setAdminEmailInput] = useState<string>('');
  const [authMode, setAuthMode] = useState<'login' | 'reset'>('login');
  const [authMethod, setAuthMethod] = useState<'password' | 'supabase_email'>('password');
  const [authLoading, setAuthLoading] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [adminClicks, setAdminClicks] = useState<number>(0);
  
  // Views
  const [activeView, setActiveView] = useState<'catalog' | 'blog'>('catalog');
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);

  // Client states: Cart, Favorites, Simulated orders
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  // Toast Notification system
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'info' } | null>(null);

  // Floating Cart Pop-up block
  const [lastAddedItem, setLastAddedItem] = useState<{ product: Product; size: string; color: string } | null>(null);
  const [isPopupMinimized, setIsPopupMinimized] = useState<boolean>(false);

  useEffect(() => {
    if (lastAddedItem && !isPopupMinimized) {
      const timer = setTimeout(() => {
        setIsPopupMinimized(true);
      }, 10000); // 10 seconds display to make it very eye-catching and readable
      return () => clearTimeout(timer);
    }
  }, [lastAddedItem, isPopupMinimized]);

  useEffect(() => {
    if (!isAdminAuthModalOpen) {
      setShowPassword(false);
    }
  }, [isAdminAuthModalOpen]);

  const triggerToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const loadBlogPosts = async () => {
    try {
      const { posts, error } = await fetchSupabaseBlogPosts();
      if (posts && posts.length > 0) {
        setBlogPosts(posts);
      } else {
        const defaults = getDefaultBlogPosts(lang);
        setBlogPosts(defaults);
      }
    } catch (e) {
      console.error('Failed to load blog posts:', e);
      setBlogPosts(getDefaultBlogPosts(lang));
    }
  };

  // Sync products on config save
  const loadProducts = async (forceSpinner: boolean = false) => {
    try {
      const res = await fetch('/api/config');
      if (res.ok) {
        const serverConfig = await res.json();
        if (serverConfig && serverConfig.url) {
          const currentUrl = localStorage.getItem('supabase_url');
          if (currentUrl !== serverConfig.url) {
            localStorage.removeItem('lastochka_cached_products');
          }
          localStorage.setItem('supabase_mode', serverConfig.mode || 'supabase');
          localStorage.setItem('supabase_url', serverConfig.url);
          localStorage.setItem('supabase_anon_key', serverConfig.anonKey);
          localStorage.setItem('supabase_secret_key', serverConfig.secretKey || '');
          localStorage.setItem('supabase_table_name', serverConfig.tableName || 'products');
        }
      }
    } catch (e) {
      console.error('Failed to sync config from server:', e);
    }

    const cached = localStorage.getItem('lastochka_cached_products');
    let hasCache = false;
    
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const reCleaned = parsed.map((item: Product) => {
            let photos = Array.isArray(item.photo) ? item.photo.map((p: string) => cleanImageUrl(p)).filter(Boolean) : [];
            if (photos.length === 0 && (item.product_code || item.id)) {
              const localMatch = PRODUCTS.find(p => (item.product_code && p.product_code === item.product_code) || String(p.id) === String(item.id));
              if (localMatch && Array.isArray(localMatch.photo) && localMatch.photo.length > 0) {
                photos = localMatch.photo.map(p => cleanImageUrl(p)).filter(Boolean);
              }
            }
            return {
              ...item,
              photo: photos
            };
          });
          setAllProducts(reCleaned);
          hasCache = true;
          // Set loading to false early so user sees products instantly
          setLoading(false);
        }
      } catch (e) {
        console.error('Failed to parse cached products:', e);
      }
    }

    if (!hasCache || forceSpinner) {
      setLoading(true);
    }

    const config = getStoredConfig();
    try {
      const { products, source, error } = await fetchSupabaseProducts();
      setAllProducts(products);
      
      // Save successfully fetched products to cache for instant load next time
      if (products && products.length > 0) {
        localStorage.setItem('lastochka_cached_products', JSON.stringify(products));
      }

      setDbStatus({
        mode: source,
        connected: source === 'supabase' && !error,
        error
      });
      if (source === 'supabase' && !error && (!hasCache || forceSpinner)) {
        triggerToast(lang === 'ru' ? 'Товары загружены из Supabase!' : 'Товари завантажені з Supabase!', 'success');
      }
    } catch (e) {
      const fallback = getDemoProducts();
      setAllProducts(fallback);
      setDbStatus({ mode: 'demo', connected: false, error: 'Failed to fetch' });
    } finally {
      setLoading(false);
    }

    loadBlogPosts();
  };

  // On mount: Load configuration, favorites, cart items, simulated orders
  useEffect(() => {
    loadProducts();

    const storedFavs = localStorage.getItem('lastochka_favorites');
    if (storedFavs) setFavorites(JSON.parse(storedFavs));

    const storedCart = localStorage.getItem('lastochka_cart');
    if (storedCart) setCartItems(JSON.parse(storedCart));

    const storedOrders = localStorage.getItem('lastochka_orders');
    if (storedOrders) setOrders(JSON.parse(storedOrders));
  }, []);

  const handleAddPost = async (post: BlogPost) => {
    const currentPosts = blogPosts.length === 0 ? getDefaultBlogPosts(lang) : blogPosts;
    const updatedPosts = [post, ...currentPosts];
    setBlogPosts(updatedPosts);
    localStorage.setItem('lastochka_blog', JSON.stringify(updatedPosts));
    triggerToast(lang === 'ru' ? 'Статья опубликована' : 'Статтю опубліковано');
    
    const { success, error } = await saveSupabaseBlogPost(post);
    if (!success) {
      console.warn('Supabase post save failed, but saved locally:', error);
    }
  };

  const handleDeletePost = async (id: string) => {
    const currentPosts = blogPosts.length === 0 ? getDefaultBlogPosts(lang) : blogPosts;
    const updatedPosts = currentPosts.filter(p => p.id !== id);
    setBlogPosts(updatedPosts);
    localStorage.setItem('lastochka_blog', JSON.stringify(updatedPosts));
    triggerToast(lang === 'ru' ? 'Статья удалена' : 'Статтю видалено', 'info');

    const { success, error } = await deleteSupabaseBlogPost(id);
    if (!success) {
      console.warn('Supabase post delete failed, but deleted locally:', error);
    }
  };

  // Sync cart & favorites to localStorage
  const saveCart = (items: CartItem[]) => {
    setCartItems(items);
    localStorage.setItem('lastochka_cart', JSON.stringify(items));
    if (items.length === 0) {
      setLastAddedItem(null);
    }
  };

  const handleToggleFavorite = (id: number) => {
    let next: number[];
    if (favorites.includes(id)) {
      next = favorites.filter(favId => favId !== id);
      triggerToast(lang === 'ru' ? 'Удалено из избранного' : 'Вилучено з обраного', 'info');
    } else {
      next = [...favorites, id];
      triggerToast(lang === 'ru' ? 'Добавлено в избранное!' : 'Додано до обраного!', 'success');
    }
    setFavorites(next);
    localStorage.setItem('lastochka_favorites', JSON.stringify(next));
  };

  const handleAddToCart = (product: Product, size: string, color: string, qty = 1) => {
    const existingIdx = cartItems.findIndex(
      item => item.product.id === product.id && item.selectedSize === size && item.selectedColor === color
    );

    let next = [...cartItems];
    if (existingIdx > -1) {
      next[existingIdx].quantity += qty;
    } else {
      next.push({ product, selectedSize: size, selectedColor: color, quantity: qty });
    }
    saveCart(next);
    triggerToast(lang === 'ru' ? 'Товар добавлен в корзину!' : 'Товар додано до кошика!', 'success');
    setLastAddedItem({ product, size, color });
    setIsPopupMinimized(false);
  };

  const handleUpdateCartQty = (idx: number, qty: number) => {
    if (qty <= 0) {
      handleRemoveCartItem(idx);
      return;
    }
    const next = [...cartItems];
    next[idx].quantity = qty;
    saveCart(next);
  };

  const handleRemoveCartItem = (idx: number) => {
    const next = cartItems.filter((_, i) => i !== idx);
    saveCart(next);
    triggerToast(lang === 'ru' ? 'Удалено из корзины' : 'Вилучено з кошика', 'info');
  };

  const handlePlaceOrder = async (orderData: Omit<Order, 'date' | 'status'>) => {
    const newOrder: Order = {
      ...orderData,
      date: new Date().toLocaleDateString(lang === 'ru' ? 'ru-RU' : 'uk-UA', {
        day: 'numeric',
        month: 'short',
        hour: '2-digit',
        minute: '2-digit'
      }),
      status: 'pending'
    };

    const nextOrders = [newOrder, ...orders];
    setOrders(nextOrders);
    localStorage.setItem('lastochka_orders', JSON.stringify(nextOrders));
    
    // Calculate total for telegram notification
    const total = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

    const config = getStoredConfig();

    try {
      const res = await fetch('/api/telegram/order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          order: newOrder,
          cartItems: cartItems,
          total: total,
          supabaseConfig: {
            url: config.url,
            anonKey: config.anonKey,
            secretKey: config.secretKey,
            tableName: config.tableName
          }
        })
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        console.error('Failed to notify telegram:', errData);
        triggerToast(lang === 'ru' ? 'Ошибка отправки в Telegram: ' + (errData.error || 'Сбой') : 'Помилка відправки в Telegram: ' + (errData.error || 'Збій'), 'error');
      } else {
        const resData = await res.json().catch(() => ({}));
        if (resData.supabaseSaved === false) {
          console.error('Failed to save order in Supabase:', resData.supabaseError);
          triggerToast(
            lang === 'ru' 
              ? `Заказ отправлен в Telegram, но не сохранен в БД: ${resData.supabaseError || 'ошибка'}` 
              : `Замовлення надіслано в Telegram, але не збережено в БД: ${resData.supabaseError || 'помилка'}`, 
            'error'
          );
        } else {
          triggerToast(lang === 'ru' ? 'Заказ оформлен и отправлен в Telegram!' : 'Замовлення оформлено та відправлено в Telegram!', 'success');
        }
      }
    } catch (e) {
      console.error('Failed to notify telegram or save order:', e);
    }
    
    // Clear cart
    saveCart([]);
  };

  // Compute colors, sizes and prices dynamically from products to feed filter options
  const allUniqueSizes = Array.from(
    new Set(allProducts.flatMap(p => p.sizes ? p.sizes.split(',').map(s => s.trim()) : []))
  ).filter(s => s !== '' && s !== '1' && s !== '---') as string[];

  const maxProductPrice = allProducts.length > 0 ? Math.max(...allProducts.map(p => p.price)) : 1200;

  // Helper to map menu items to CategoryKeys
  const getCategoryKeyFromMenu = (menuName: string): CategoryKey | null => {
    switch (menuName) {
      case 'БЮСТГАЛЬТЕРИ':
      case 'БЮСТГАЛЬТЕРЫ':
        return 'bras';
      case 'ТРУСИКИ':
        return 'panties';
      case 'ОДЯГ ДЛЯ ДОМУ':
      case 'ДЛЯ ДОМА':
        return 'home';
      case 'КУПАЛЬНИКИ':
        return 'swimwear';
      case 'КОМПЛЕКТИ БІЛИЗНИ':
      case 'КОМПЛЕКТЫ':
        return 'sets';
      case 'ТЕРМОБІЛИЗНА':
        return 'thermals';
      case 'ЕРОТИЧНА БІЛИЗНА':
      case 'ЭРОТИЧЕСКОЕ':
        return 'erotic';
      case 'ІГРАШКИ ТА АКСЕСУАРИ':
        return 'toys_accessories';
      case 'ШКАРПЕТКИ':
      case 'НОСКИ':
        return 'socks';
      case 'НОВИНКИ':
        return 'new';
      default:
        return null;
    }
  };

  // Ensure current category is expanded in sidebar accordion
  useEffect(() => {
    if (selectedCategory && selectedCategory !== 'all') {
      setExpandedCategoryKeys(prev => {
        if (prev.has(selectedCategory)) return prev;
        const next = new Set(prev);
        next.add(selectedCategory);
        return next;
      });
    }
  }, [selectedCategory]);

  // Helper to get subtypes configuration for a category key
  const getCategorySubtypes = (catKey: CategoryKey) => {
    switch (catKey) {
      case 'bras':
        return { subtypes: BRA_SUBTYPES, current: selectedBraType, set: setSelectedBraType, menu: 'БЮСТГАЛЬТЕРИ' };
      case 'panties':
        return { subtypes: PANTIES_SUBTYPES, current: selectedPantiesType, set: setSelectedPantiesType, menu: 'ТРУСИКИ' };
      case 'home':
        return { subtypes: PAJAMA_SUBTYPES, current: selectedPajamaType, set: setSelectedPajamaType, menu: 'ОДЯГ ДЛЯ ДОМУ' };
      case 'swimwear':
        return { subtypes: SWIMWEAR_SUBTYPES, current: selectedSwimwearType, set: setSelectedSwimwearType, menu: 'КУПАЛЬНИКИ' };
      case 'sets':
        return { subtypes: SET_SUBTYPES, current: selectedSetType, set: setSelectedSetType, menu: 'КОМПЛЕКТИ БІЛИЗНИ' };
      case 'thermals':
        return { subtypes: THERMAL_SUBTYPES, current: selectedThermalType, set: setSelectedThermalType, menu: 'ТЕРМОБІЛИЗНА' };
      case 'erotic':
        return { subtypes: EROTIC_SUBTYPES, current: selectedEroticType, set: setSelectedEroticType, menu: 'ЕРОТИЧНА БІЛИЗНА' };
      case 'toys_accessories':
        return { subtypes: TOYS_SUBTYPES, current: selectedToysType, set: setSelectedToysType, menu: 'ІГРАШКИ ТА АКСЕСУАРИ' };
      default:
        return null;
    }
  };

  // Calculate count of products matching a category subtype
  const getSubtypeCount = (catKey: CategoryKey, subType: { id: number; match: string[] }) => {
    if (subType.id === 0) {
      return allProducts.filter(p => isProductInCategory(p, catKey)).length;
    }
    return allProducts.filter(p => {
      if (!isProductInCategory(p, catKey)) return false;
      const nameLower = p.name.toLowerCase();
      const codeLower = p.product_code.toLowerCase();
      const catLower = (p.category || '').toLowerCase();
      const vendorLower = (p.vendor_code || '').toLowerCase();
      const descLower = (p.description || '').toLowerCase();
      return subType.match.some(m => 
        nameLower.includes(m) || 
        codeLower.includes(m) || 
        catLower.includes(m) || 
        vendorLower.includes(m) || 
        descLower.includes(m)
      );
    }).length;
  };

  // Select a category subtype filter
  const handleSubtypeSelect = (catKey: CategoryKey, subTypeId: number, menuName: string, setter: (id: number) => void) => {
    setSelectedPantiesType(0);
    setSelectedBraType(0);
    setSelectedPajamaType(0);
    setSelectedSwimwearType(0);
    setSelectedSetType(0);
    setSelectedThermalType(0);
    setSelectedEroticType(0);
    setSelectedToysType(0);

    setSelectedCategory(catKey);
    setSelectedMenu(menuName);
    setter(subTypeId);
    setCurrentPage(1);
  };

  // Filter & Search computation
  const filteredProducts = allProducts.filter(product => {
    // 1. Text Search query
    const text = searchQuery.toLowerCase();
    const matchesSearch = 
      product.name.toLowerCase().includes(text) ||
      product.product_code.toLowerCase().includes(text) ||
      (product.vendor_code && product.vendor_code.toLowerCase().includes(text)) ||
      (product.color && product.color.toLowerCase().includes(text));

    // 2. Category selection
    const matchesCategory = selectedCategory === 'favorites'
      ? favorites.includes(product.id)
      : isProductInCategory(product, selectedCategory);

    // 3. Price limit
    const matchesPrice = product.price <= maxPrice;

    // 4. Color filter
    const matchesColor = selectedColor === 'all' || matchProductColor(product.color, selectedColor);

    // 5. Sizes filter
    const productSizesList = product.sizes ? product.sizes.split(',').map(s => s.trim()) : [];
    const matchesSizes = selectedSizes.length === 0 || selectedSizes.some(sz => productSizesList.includes(sz));

    // 6. Brand Menu item-specific precise filtering & subcategories
    let matchesMenu = true;
    if (selectedMenu !== 'all') {
      const menuCatKey = getCategoryKeyFromMenu(selectedMenu);
      if (menuCatKey) {
        matchesMenu = isProductInCategory(product, menuCatKey);
      } else {
        matchesMenu = true;
      }

      if (matchesMenu) {
        const nameLower = product.name.toLowerCase();
        const codeLower = product.product_code.toLowerCase();
        const catLower = (product.category || '').toLowerCase();
        const vendorLower = (product.vendor_code || '').toLowerCase();

        if (selectedMenu === 'ТРУСИКИ' && selectedPantiesType !== 0) {
          const subType = PANTIES_SUBTYPES.find(t => t.id === selectedPantiesType);
          if (subType) {
            const matched = subType.match.some(m => 
              nameLower.includes(m) || 
              codeLower.includes(m) || 
              catLower.includes(m) || 
              vendorLower.includes(m) || 
              product.description?.toLowerCase().includes(m)
            );
            if (!matched) matchesMenu = false;
          }
        } else if ((selectedMenu === 'БЮСТГАЛЬТЕРИ' || selectedMenu === 'БЮСТГАЛЬТЕРЫ') && selectedBraType !== 0) {
          const subType = BRA_SUBTYPES.find(t => t.id === selectedBraType);
          if (subType) {
            const matched = subType.match.some(m => 
              nameLower.includes(m) || 
              codeLower.includes(m) || 
              catLower.includes(m) || 
              vendorLower.includes(m) || 
              product.description?.toLowerCase().includes(m)
            );
            if (!matched) matchesMenu = false;
          }
        } else if ((selectedMenu === 'ОДЯГ ДЛЯ ДОМУ' || selectedMenu === 'ДЛЯ ДОМА') && selectedPajamaType !== 0) {
          const subType = PAJAMA_SUBTYPES.find(t => t.id === selectedPajamaType);
          if (subType) {
            const matched = subType.match.some(m => 
              nameLower.includes(m) || 
              codeLower.includes(m) || 
              catLower.includes(m) || 
              vendorLower.includes(m) || 
              product.description?.toLowerCase().includes(m)
            );
            if (!matched) matchesMenu = false;
          }
        } else if (selectedMenu === 'КУПАЛЬНИКИ' && selectedSwimwearType !== 0) {
          const subType = SWIMWEAR_SUBTYPES.find(t => t.id === selectedSwimwearType);
          if (subType) {
            const matched = subType.match.some(m => 
              nameLower.includes(m) || 
              codeLower.includes(m) || 
              catLower.includes(m) || 
              vendorLower.includes(m) || 
              product.description?.toLowerCase().includes(m)
            );
            if (!matched) matchesMenu = false;
          }
        } else if ((selectedMenu === 'КОМПЛЕКТИ БІЛИЗНИ' || selectedMenu === 'КОМПЛЕКТЫ') && selectedSetType !== 0) {
          const subType = SET_SUBTYPES.find(t => t.id === selectedSetType);
          if (subType) {
            const matched = subType.match.some(m => 
              nameLower.includes(m) || 
              codeLower.includes(m) || 
              catLower.includes(m) || 
              vendorLower.includes(m) || 
              product.description?.toLowerCase().includes(m)
            );
            if (!matched) matchesMenu = false;
          }
        } else if (selectedMenu === 'ТЕРМОБІЛИЗНА' && selectedThermalType !== 0) {
          const subType = THERMAL_SUBTYPES.find(t => t.id === selectedThermalType);
          if (subType) {
            const matched = subType.match.some(m => 
              nameLower.includes(m) || 
              codeLower.includes(m) || 
              catLower.includes(m) || 
              vendorLower.includes(m) || 
              product.description?.toLowerCase().includes(m)
            );
            if (!matched) matchesMenu = false;
          }
        } else if ((selectedMenu === 'ЕРОТИЧНА БІЛИЗНА' || selectedMenu === 'ЭРОТИЧЕСКОЕ') && selectedEroticType !== 0) {
          const subType = EROTIC_SUBTYPES.find(t => t.id === selectedEroticType);
          if (subType) {
            const matched = subType.match.some(m => 
              nameLower.includes(m) || 
              codeLower.includes(m) || 
              catLower.includes(m) || 
              vendorLower.includes(m) || 
              product.description?.toLowerCase().includes(m)
            );
            if (!matched) matchesMenu = false;
          }
        } else if (selectedMenu === 'ІГРАШКИ ТА АКСЕСУАРИ' && selectedToysType !== 0) {
          const subType = TOYS_SUBTYPES.find(t => t.id === selectedToysType);
          if (subType) {
            const matched = subType.match.some(m => 
              nameLower.includes(m) || 
              codeLower.includes(m) || 
              catLower.includes(m) || 
              vendorLower.includes(m) || 
              product.description?.toLowerCase().includes(m)
            );
            if (!matched) matchesMenu = false;
          }
        }
      }
    }

    return matchesSearch && matchesCategory && matchesMenu && matchesPrice && matchesColor && matchesSizes;
  });

  // Sort computation
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'priceAsc') return a.price - b.price;
    if (sortBy === 'priceDesc') return b.price - a.price;
    if (sortBy === 'stock') return b.stock - a.stock;
    return 0; // Default / Unsorted
  });

  // Pagination calculations
  const PRODUCTS_PER_PAGE = 50;
  const totalPages = Math.ceil(sortedProducts.length / PRODUCTS_PER_PAGE);
  const activePage = Math.min(currentPage, Math.max(1, totalPages));
  const startIndex = (activePage - 1) * PRODUCTS_PER_PAGE;
  const paginatedProducts = sortedProducts.slice(startIndex, startIndex + PRODUCTS_PER_PAGE);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    const catalogElement = document.getElementById('catalog-section');
    if (catalogElement) {
      catalogElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      window.scrollTo({ top: 350, behavior: 'smooth' });
    }
  };

  // Helper to generate page item list (e.g. [1, "dots", 4, 5, 6, "dots", 10])
  const getPaginationRange = () => {
    const range: (number | string)[] = [];
    const siblingCount = 1; // Number of pages on each side of the active page
    
    // Always show first and last page
    const firstPage = 1;
    const lastPage = totalPages;
    
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        range.push(i);
      }
      return range;
    }
    
    const leftSiblingIndex = Math.max(activePage - siblingCount, 1);
    const rightSiblingIndex = Math.min(activePage + siblingCount, totalPages);
    
    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPages - 1;
    
    if (!shouldShowLeftDots && shouldShowRightDots) {
      const itemCount = 3 + 2 * siblingCount;
      for (let i = 1; i <= itemCount; i++) {
        range.push(i);
      }
      range.push('dots');
      range.push(lastPage);
    } else if (shouldShowLeftDots && !shouldShowRightDots) {
      const itemCount = 3 + 2 * siblingCount;
      range.push(firstPage);
      range.push('dots');
      for (let i = totalPages - itemCount + 1; i <= totalPages; i++) {
        range.push(i);
      }
    } else if (shouldShowLeftDots && shouldShowRightDots) {
      range.push(firstPage);
      range.push('dots');
      for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
        range.push(i);
      }
      range.push('dots');
      range.push(lastPage);
    }
    
    return range;
  };

  // Toggle size filter
  const handleToggleSize = (size: string) => {
    if (selectedSizes.includes(size)) {
      setSelectedSizes(selectedSizes.filter(s => s !== size));
    } else {
      setSelectedSizes([...selectedSizes, size]);
    }
  };

  // Clear filters
  const resetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('all');
    setSelectedMenu('all');
    setMaxPrice(maxProductPrice);
    setSelectedSizes([]);
    setSelectedColor('all');
    setSortBy('default');
  };

  // Category Icon Mapper
  const renderCategoryIcon = (key: CategoryKey, className = "w-4 h-4") => {
    switch (key) {
      case 'new': return <Star className={className} />;
      case 'pajamas':
        return (
          <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="46" fill="currentColor" />
            <path d="M 37 18 Q 38 24.5 39.5 31 L 41 31 Q 39.5 24.5 38.5 18 Z" fill="white" />
            <path d="M 63 18 Q 62 24.5 60.5 31 L 59 31 Q 60.5 24.5 61.5 18 Z" fill="white" />
            <path d="M 31 37.5 Q 35 34 40 31 Q 45 37 50 41 Q 55 37 60 31 Q 65 34 69 37.5 C 67 50, 67 65, 69 78 L 31 78 C 33 65, 33 50, 31 37.5 Z" fill="white" />
          </svg>
        );
      case 'underwear':
        return (
          <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="46" fill="currentColor" />
            <path d="M43.5 76.5 C43 71 40 68 34 66 C28.5 64 26.5 59 26.5 55.5 C26.5 51.5 30.5 47.5 35.5 47.5 C39.5 47.5 42 50 43.5 51.5 C42.5 46.5 39 34 18.5 14 C23 26.5 33 41 41.5 45 C41.5 41 45 31 73.5 16.5 C68.5 27 59.5 38 54.5 46.5 C52.5 50 52.5 54.5 54.5 58 C56.5 61.5 61 65 62.5 70.5 C63.5 74.5 62.5 76 60.5 76.5 C56.5 77.5 50 78.5 43.5 76.5 Z" fill="white" />
            <circle cx="37" cy="57" r="3.5" fill="currentColor" />
            <path d="M41.5 79.5 L32 76.5 L32 84 L41.5 81.5 L51 84 L51 76.5 Z" fill="white" />
            <path d="M43 75.5 L60.5 75.5 L59.5 78 L42.5 78 Z" fill="white" />
          </svg>
        );
      case 'panties':
        return (
          <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="46" fill="currentColor" />
            <path d="M 22 36 C 32 41.5, 68 41.5, 78 36 C 80.5 40, 73.5 49, 56 72 L 44 72 C 26.5 49, 19.5 40, 22 36 Z" fill="white" />
          </svg>
        );
      case 'thermals': return <Flame className={className} />;
      case 'socks':
        return (
          <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="50" cy="50" r="46" fill="currentColor" />
            <path d="M 76 17 C 78 20, 79 26, 78 30 C 72 35, 60 34, 52 30 C 49 28, 48 29, 48 31 C 48 36, 52 47, 49 59 C 46 68, 39 74, 29 79 C 26 80.5, 26 83, 31 83 C 41 83, 47 80, 48 76 C 50 70, 54 59, 58 50 C 62 41, 70 33, 76 29 C 78 26, 78 20, 76 17 Z" fill="white" />
            <path d="M 32 38 L 41 38 L 40 50 C 40 54, 38 56, 31 57 L 22 57 C 19 57, 19 53, 23 50 L 32 48 Z" fill="white" />
          </svg>
        );
      case 'jeggings': return <Layers className={className} />;
      case 'games': return <Gamepad2 className={className} />;
      default: return <Sparkles className={className} />;
    }
  };

  const t = {
    ru: {
      brand: 'Ласточка',
      tagline: 'Премиальное нижнее белье и домашний трикотаж',
      langLabel: 'Язык:',
      managerToggle: 'Кабинет владельца',
      managerDesc: 'Отображает оптовую себестоимость и маржинальную прибыль по товарам.',
      managerActive: 'Режим менеджера',
      searchPlh: 'Поиск модного белья...',
      filtersTitle: 'Фильтры каталога',
      priceLabel: 'Максимальная цена:',
      sizesLabel: 'Размеры:',
      colorsLabel: 'Палитра цветов:',
      sortLabel: 'Сортировка:',
      sortOptions: {
        default: 'По умолчанию',
        priceAsc: 'Сначала дешевые',
        priceDesc: 'Сначала дорогие'
      },
      clearFilters: 'Сбросить фильтры',
      productsCount: 'Найдено {count} товаров',
      showFiltersBtn: 'Показать фильтры',
      hideFiltersBtn: 'Скрыть фильтры',
      dbConnected: 'Админ активен',
      dbDemo: 'Демо-каталог',
      dbSeedingText: 'Создать / синхронизировать таблицу в Supabase',
      checkoutCart: 'Корзина',
      favoritesCount: 'Избранное',
      ordersHistory: 'Ваши заказы',
      orderDate: 'Дата:',
      orderTotal: 'Сумма:',
      orderStatus: 'Статус:',
      orderStatuses: {
        pending: 'В обработке',
        processing: 'Комплектуется',
        shipped: 'Отправлен',
        completed: 'Выполнен'
      }
    },
    ua: {
      brand: 'Ластівка',
      tagline: 'Преміальна нижня білизна та домашній трикотаж',
      langLabel: 'Мова:',
      managerToggle: 'Кабінет власника',
      managerDesc: 'Відображає оптову собівартість та маржинальний прибуток по товарах.',
      managerActive: 'Режим менеджера',
      searchPlh: 'Пошук модної білизни...',
      filtersTitle: 'Фільтри каталогу',
      priceLabel: 'Максимальна ціна:',
      sizesLabel: 'Розміри:',
      colorsLabel: 'Палітра кольорів:',
      sortLabel: 'Сортування:',
      sortOptions: {
        default: 'За замовчуванням',
        priceAsc: 'Спочатку дешевші',
        priceDesc: 'Спочатку дорожчі'
      },
      clearFilters: 'Скинути фільтри',
      productsCount: 'Знайдено {count} товарів',
      showFiltersBtn: 'Показати фільтри',
      hideFiltersBtn: 'Приховати фільтри',
      dbConnected: 'Адмін активний',
      dbDemo: 'Демо-каталог',
      dbSeedingText: 'Створити / синхронізувати таблицю в Supabase',
      checkoutCart: 'Кошик',
      favoritesCount: 'Обране',
      ordersHistory: 'Ваші замовлення',
      orderDate: 'Дата:',
      orderTotal: 'Сума:',
      orderStatus: 'Статус:',
      orderStatuses: {
        pending: 'В обробці',
        processing: 'Комплектується',
        shipped: 'Відправлено',
        completed: 'Виконано'
      }
    }
  }[lang];

  const cartTotal = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);

  const handleNavClick = (menuItem: string, skipReset = false) => {
    if (menuItem === 'БЛОГ') {
      setActiveView('blog');
      setSelectedMenu('БЛОГ');
      return;
    }
    setActiveView('catalog');
    setSelectedMenu(menuItem);
    if (!skipReset) {
      setSelectedPantiesType(0); // Reset subcategory when navigating
      setSelectedBraType(0);
      setSelectedPajamaType(0);
      setSelectedSwimwearType(0);
      setSelectedSetType(0);
      setSelectedThermalType(0);
      setSelectedEroticType(0);
    }

    const navCatKey = getCategoryKeyFromMenu(menuItem);
    if (navCatKey) {
      setSelectedCategory(navCatKey);
      setSearchQuery('');
    } else if (menuItem === 'РАСПРОДАЖА') {
      setSelectedCategory('all');
      setSortBy('priceAsc');
      setSearchQuery('');
    } else if (menuItem === 'НОВИНКИ') {
      setSelectedCategory('new');
      setSortBy('default');
      setSearchQuery('');
    } else {
      setSelectedCategory('all');
      setSelectedMenu('all');
      setSearchQuery('');
    }
  };

  return (
    <div className="min-h-screen bg-[#faf9f8] text-gray-800 flex flex-col font-sans selection:bg-pink-100 selection:text-[#e02484]">
      
      {/* Toast Notification popup banner */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: -40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -40, scale: 0.9 }}
            className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 px-5 py-3 rounded-lg bg-[#e02484] text-white text-xs font-semibold shadow-2xl tracking-wide"
          >
            <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping" />
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Eye-Catching Added-to-Cart Notification */}
      <AnimatePresence>
        {lastAddedItem && !isPopupMinimized && (
          <motion.div
            initial={{ opacity: 0, x: 100, y: 0, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            className="fixed bottom-4 right-4 md:bottom-auto md:top-24 md:right-6 z-[60] w-[calc(100vw-32px)] sm:w-96 bg-white border border-[#e02484]/30 rounded-xl shadow-2xl overflow-hidden font-sans border-t-4 border-t-[#e02484]"
          >
            {/* Header with Close */}
            <div className="p-3 bg-pink-50/50 border-b border-pink-100 flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#e02484]">
                <ShoppingBag className="w-4 h-4 animate-pulse" />
                <span className="text-xs font-bold tracking-tight uppercase">
                  {lang === 'ru' ? 'Товар добавлен в корзину' : 'Товар додано до кошика'}
                </span>
              </div>
              <button
                onClick={() => setIsPopupMinimized(true)}
                className="p-1 hover:bg-gray-100 rounded-full transition-colors cursor-pointer text-gray-400 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Product Details Section */}
            <div className="p-4 flex gap-4">
              <div className="w-20 h-24 bg-gray-50 rounded-lg overflow-hidden border border-gray-100 shrink-0">
                <img
                  src={getCleanImage(lastAddedItem.product, 0)}
                  alt={lastAddedItem.product.name}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
                <div>
                  <h4 className="text-xs font-bold text-gray-900 leading-snug line-clamp-2">
                    {maybeTranslate(lastAddedItem.product.name, lang)}
                  </h4>
                  <p className="text-[10px] text-gray-400 font-mono mt-1">
                    {lang === 'ru' ? 'Код' : 'Код'}: {lastAddedItem.product.product_code}
                  </p>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {lastAddedItem.size && lastAddedItem.size !== 'Unisex' && (
                      <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-[9px] font-semibold border border-gray-200">
                        {lang === 'ru' ? 'Размер' : 'Розмір'}: {lastAddedItem.size}
                      </span>
                    )}
                    {lastAddedItem.color && lastAddedItem.color !== 'Default' && (
                      <span className="px-1.5 py-0.5 bg-gray-100 text-gray-600 rounded text-[9px] font-semibold border border-gray-200">
                        {lang === 'ru' ? 'Цвет' : 'Колір'}: {maybeTranslate(lastAddedItem.color, lang)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="text-xs font-bold text-gray-900 mt-2">
                  {lastAddedItem.product.price} грн
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="px-4 pb-4 pt-1 flex gap-2">
              <button
                onClick={() => {
                  setIsPopupMinimized(true);
                  setIsCartOpen(true);
                }}
                className="flex-1 bg-[#e02484] hover:bg-[#c0146f] text-white py-2 rounded-lg text-xs font-extrabold shadow-sm transition-all text-center cursor-pointer uppercase tracking-wider"
              >
                {lang === 'ru' ? 'Оформить заказ' : 'Оформити замовлення'}
              </button>
              <button
                onClick={() => setIsPopupMinimized(true)}
                className="flex-1 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 py-2 rounded-lg text-xs font-bold transition-all text-center cursor-pointer uppercase tracking-wider"
              >
                {lang === 'ru' ? 'Продолжить' : 'Продовжити'}
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Glowing Cart Circle (Recent Item Reminder) */}
      <AnimatePresence>
        {lastAddedItem && isPopupMinimized && !isCartOpen && cartItems.length > 0 && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: 50 }}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsPopupMinimized(false)}
            className="fixed right-6 bottom-8 md:right-8 md:bottom-10 z-[70] w-14 h-14 bg-[#e02484] text-white rounded-full shadow-[0_0_30px_rgba(224,36,132,0.85)] flex items-center justify-center cursor-pointer group"
            title={lang === 'ru' ? 'Посмотреть последний добавленный товар' : 'Переглянути останній доданий товар'}
          >
            {/* Pulsing Outer Glow */}
            <span className="absolute -inset-2 rounded-full border-2 border-[#e02484] opacity-75 animate-ping" />
            <span className="absolute -inset-1 rounded-full bg-[#e02484] opacity-25 animate-pulse" />
            
            {/* Cart Icon */}
            <ShoppingBag className="w-6 h-6 relative z-10" />

            {/* Total items badge in cart */}
            {cartItems.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-gray-900 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center border border-white z-20">
                {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
              </span>
            )}

            {/* Tooltip on hover */}
            <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 hidden group-hover:flex items-center justify-center bg-gray-900 text-white text-[10px] font-medium py-1 px-2.5 rounded shadow-lg whitespace-nowrap z-30 transition-all">
              {lang === 'ru' ? 'Посмотреть последний товар' : 'Переглянути останній товар'}
            </span>
          </motion.button>
        )}
      </AnimatePresence>



      {/* 1. Top Auxiliary Bar */}
      <div className="bg-[#f3f2f1] border-b border-gray-200 px-4 md:px-8 py-1.5 text-[11px] text-gray-500 flex flex-wrap justify-between items-center gap-2 select-none">
        <div className="flex items-center gap-4">
          {/* UA/RU Language Selector */}
          <div className="flex bg-gray-200/60 rounded p-0.5">
            {(['ua', 'ru'] as const).map(l => (
              <button
                key={l}
                onClick={() => setLang(l)}
                className={`px-2 py-0.5 text-[9px] font-bold rounded transition-colors uppercase cursor-pointer ${
                  lang === l ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          {/* Theme Switcher Toggler */}
          <button
            onClick={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
            className="flex items-center gap-1.5 px-2 py-1 text-[10px] font-bold bg-gray-200/60 hover:bg-gray-200/80 rounded transition-all text-gray-700 hover:text-gray-900 cursor-pointer shadow-sm select-none"
            title={lang === 'ru' ? 'Сменить тему оформления' : 'Змінити тему оформлення'}
          >
            {theme === 'light' ? (
              <>
                <Moon className="w-3 h-3 text-[#e02484]" />
                <span className="text-[9px] tracking-wide uppercase">{lang === 'ru' ? 'Ночь' : 'Ніч'}</span>
              </>
            ) : (
              <>
                <Sun className="w-3 h-3 text-[#d4af37]" />
                <span className="text-[9px] tracking-wide uppercase">{lang === 'ru' ? 'День' : 'День'}</span>
              </>
            )}
          </button>
        </div>
        <div className="flex items-center gap-4">
          {/* New Arrivals Button */}
          <button
            onClick={() => handleNavClick('НОВИНКИ')}
            className={`hover:text-[#e02484] cursor-pointer transition-colors font-semibold flex items-center gap-1 text-[11px] ${
              selectedMenu === 'НОВИНКИ' || (selectedCategory === 'new' && activeView === 'catalog')
                ? 'text-[#e02484] font-bold'
                : 'text-gray-700 hover:text-gray-900'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#e02484]" />
            <span>{lang === 'ru' ? 'Новинки' : 'Новинки'}</span>
          </button>

          {/* Blog Button */}
          <button
            onClick={() => handleNavClick('БЛОГ')}
            className={`hover:text-[#e02484] cursor-pointer transition-colors font-semibold flex items-center gap-1 text-[11px] ${
              activeView === 'blog'
                ? 'text-[#e02484] font-bold'
                : 'text-gray-700 hover:text-gray-900'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5 text-[#e02484]" />
            <span>{lang === 'ru' ? 'Блог' : 'Блог'}</span>
          </button>

          {/* Favorites */}
          <button 
            className="hover:text-[#e02484] cursor-pointer transition-colors font-semibold flex items-center gap-1 text-[11px] text-gray-700 hover:text-gray-900"
            onClick={() => { resetFilters(); setSelectedCategory('favorites' as any); }}
          >
            <Heart className="w-3.5 h-3.5 text-[#e02484] fill-[#e02484]" />
            <span>{lang === 'ru' ? `Избранное (${favorites.length})` : `Вподобання (${favorites.length})`}</span>
          </button>
        </div>
      </div>

      {/* 2. Main Header Row */}
      <header className="bg-white px-4 md:px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-4 border-b border-gray-200">
        
            {/* Brand logo (Official Ukrainian logo image) */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-start">
          <div className="flex items-center gap-3 md:gap-4 shrink-0">
            <div className="flex flex-col cursor-pointer" onClick={() => { setActiveView('catalog'); setSelectedCategory('all'); setSelectedMenu('all'); setSearchQuery(''); }}>
              <img 
                src={BRAND_LOGO_BASE64} 
                alt="Ластівка" 
                className="h-12 md:h-16 w-auto object-contain select-none hover:opacity-90 transition-opacity"
              />
            </div>
          </div>

          {/* Database Setup Status Button & Badge */}
          {managerMode && (
          <button
            onClick={() => {
              if (managerMode) {
                setIsAdminOpen(true);
              } else {
                setAuthMode('login');
                setAuthError('');
                setIsAdminAuthModalOpen(true);
              }
            }}
            className={`p-2 py-1 rounded-full text-[10px] font-semibold flex items-center gap-1.5 transition-all border cursor-pointer ${
              dbStatus.mode === 'supabase' && dbStatus.connected
                ? 'bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100'
                : 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100'
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${
              dbStatus.mode === 'supabase' && dbStatus.connected ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'
            }`} />
            <span>{dbStatus.mode === 'supabase' && dbStatus.connected ? t.dbConnected : t.dbDemo}</span>
            <Database className="w-3 h-3 text-gray-500" />
          </button>
          )}
        </div>

        {/* Central Search bar exactly matching the screenshot */}
        <div className="flex-1 max-w-lg mx-6 relative w-full md:w-auto">
          <input
            type="text"
            placeholder={lang === 'ru' ? 'Поиск модного белья...' : 'Пошук модної білизни...'}
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full border border-gray-300 rounded-md pl-4 pr-10 py-2.5 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-[#e02484] focus:ring-1 focus:ring-[#e02484] bg-white transition-all font-sans"
          />
          <button className="absolute right-3 top-3 text-gray-400 hover:text-[#e02484] cursor-pointer">
            <Search className="w-4 h-4" />
          </button>
        </div>

        {/* Right side controls: Olga Phone & Cart Indicators */}
        <div className="flex flex-wrap items-center gap-4 w-full md:w-auto justify-end">
          
          {/* Contact phone number from the screenshot */}
          <div 
            className="flex items-center gap-2 text-gray-700 select-none cursor-pointer"
            onClick={() => {
              if (adminClicks >= 4) {
                if (!managerMode) {
                  setAuthMode('login');
                  setAuthError('');
                  setIsAdminAuthModalOpen(true);
                }
                setAdminClicks(0);
              } else {
                setAdminClicks(prev => prev + 1);
                setTimeout(() => setAdminClicks(0), 3000);
              }
            }}
          >
            <div className="p-2 bg-pink-50 text-[#e02484] rounded-full">
              <Phone className="w-3.5 h-3.5" />
            </div>
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold text-gray-800 font-sans tracking-wide">096-048-67-14</span>
              <span className="text-[10px] text-gray-400 font-medium">Ольга</span>
            </div>
          </div>

          {/* Secret shopowner manager metrics toggler */}
          {managerMode && (
          <button
            onClick={() => {
              if (!managerMode) {
                if (dbStatus.mode === 'supabase') {
                  const client = getAuthClient();
                  if (client) {
                    client.auth.getSession().then(({ data: { session } }) => {
                      if (session) {
                        setManagerMode(true);
                        triggerToast(lang === 'ru' ? 'Режим менеджера активен' : 'Режим менеджера активний', 'info');
                      } else {
                        setAuthMode('login');
                        setAuthError('');
                        setIsAdminAuthModalOpen(true);
                      }
                    });
                  } else {
                    setAuthMode('login');
                    setAuthError('');
                    setIsAdminAuthModalOpen(true);
                  }
                } else {
                  const savedPwd = localStorage.getItem('lastochka_admin_password');
                  if (savedPwd) {
                    setManagerMode(true);
                    triggerToast(lang === 'ru' ? 'Режим менеджера активен' : 'Режим менеджера активний', 'info');
                  } else {
                    setAuthMode('login');
                    setAuthError('');
                    setIsAdminAuthModalOpen(true);
                  }
                }
              } else {
                setManagerMode(false);
                if (dbStatus.mode === 'supabase') {
                  const client = getAuthClient();
                  if (client) {
                    client.auth.signOut();
                  }
                } else {
                  localStorage.removeItem('lastochka_admin_password');
                }
                triggerToast(lang === 'ru' ? 'Режим менеджера отключен' : 'Режим менеджера вимкнено', 'info');
              }
            }}
            className={`p-2 px-3 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              managerMode 
                ? 'bg-[#e02484] border-[#e02484] text-white shadow-md font-bold' 
                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
            }`}
            title={t.managerDesc}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.managerActive}</span>
          </button>
          )}



          {/* Cart Widget / Pill Indicator precisely styled */}
          <button
            onClick={() => setIsCartOpen(true)}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-200/80 rounded-md text-xs font-bold flex items-center gap-2 transition-all cursor-pointer select-none"
          >
            <ShoppingBag className="w-4 h-4 text-[#e02484]" />
            <span>
              {lang === 'ru' ? 'Товаров' : 'Товарів'}: <strong className="text-[#e02484]">{cartItems.length}</strong> ({cartTotal.toLocaleString('uk-UA')} грн)
            </span>
          </button>
        </div>
      </header>

      {/* 3. Hot Pink Brand Menu Bar */}
      <div 
        onMouseLeave={() => setHoveredMenu(null)}
        className="relative z-40"
      >
        <nav className="bg-[#e02484] shadow-md select-none w-full border-b border-[#c0146f] relative z-20">
          <div className="max-w-7xl mx-auto px-4 overflow-x-auto scrollbar-hide flex items-center justify-between gap-1 py-1">
            {['БЮСТГАЛЬТЕРИ', 'ТРУСИКИ', 'ОДЯГ ДЛЯ ДОМУ', 'КУПАЛЬНИКИ', 'КОМПЛЕКТИ БІЛИЗНИ', 'ТЕРМОБІЛИЗНА', 'ЕРОТИЧНА БІЛИЗНА', 'ІГРАШКИ ТА АКСЕСУАРИ', 'ШКАРПЕТКИ'].map(menu => {
              const isActive = selectedMenu === menu;
              return (
                <button
                  key={menu}
                  onClick={() => handleNavClick(menu)}
                  onMouseEnter={() => setHoveredMenu(menu)}
                  className={`px-3 py-3 text-[11px] font-extrabold text-white tracking-wider uppercase transition-all whitespace-nowrap rounded cursor-pointer animate-none ${
                    isActive ? 'bg-[#980f52]' : 'hover:bg-[#c0146f]'
                  }`}
                >
                  {MENU_TRANSLATIONS[menu] ? MENU_TRANSLATIONS[menu][lang] : menu}
                </button>
              );
            })}
          </div>
        </nav>

        {/* Mega Menu Panels */}
        <AnimatePresence initial={false}>
          {hoveredMenu === 'БЮСТГАЛЬТЕРИ' && activeView === 'catalog' && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="absolute top-full left-0 w-full bg-white border-b border-gray-200 overflow-hidden z-10 shadow-xl origin-top"
            >
              <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-3 gap-x-6">
                {BRA_SUBTYPES.map(type => (
                  <button
                    key={type.id}
                    onClick={() => {
                      setSelectedBraType(type.id);
                      handleNavClick('БЮСТГАЛЬТЕРИ', true);
                      setHoveredMenu(null);
                    }}
                    className={`text-left flex items-center gap-3 px-3 py-2 text-sm font-bold rounded-lg transition-all cursor-pointer ${
                      selectedBraType === type.id && selectedMenu === 'БЮСТГАЛЬТЕРИ'
                        ? 'bg-pink-50 text-[#e02484]'
                        : 'bg-transparent text-gray-700 hover:bg-gray-50 hover:text-[#e02484]'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${selectedBraType === type.id && selectedMenu === 'БЮСТГАЛЬТЕРИ' ? 'bg-[#e02484]' : 'bg-gray-300'}`}></span>
                    {lang === 'ru' ? type.ru : type.ua}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {hoveredMenu === 'ТРУСИКИ' && activeView === 'catalog' && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="absolute top-full left-0 w-full bg-white border-b border-gray-200 overflow-hidden z-10 shadow-xl origin-top"
            >
              <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-3 gap-x-6">
                {PANTIES_SUBTYPES.map(type => (
                  <button
                    key={type.id}
                    onClick={() => {
                      setSelectedPantiesType(type.id);
                      handleNavClick('ТРУСИКИ', true);
                      setHoveredMenu(null);
                    }}
                    className={`text-left flex items-center gap-3 px-3 py-2 text-sm font-bold rounded-lg transition-all cursor-pointer ${
                      selectedPantiesType === type.id && selectedMenu === 'ТРУСИКИ'
                        ? 'bg-pink-50 text-[#e02484]'
                        : 'bg-transparent text-gray-700 hover:bg-gray-50 hover:text-[#e02484]'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${selectedPantiesType === type.id && selectedMenu === 'ТРУСИКИ' ? 'bg-[#e02484]' : 'bg-gray-300'}`}></span>
                    {lang === 'ru' ? type.ru : type.ua}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {hoveredMenu === 'ОДЯГ ДЛЯ ДОМУ' && activeView === 'catalog' && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="absolute top-full left-0 w-full bg-white border-b border-gray-200 overflow-hidden z-10 shadow-xl origin-top"
            >
              <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-3 gap-x-6">
                {PAJAMA_SUBTYPES.map(type => (
                  <button
                    key={type.id}
                    onClick={() => {
                      setSelectedPajamaType(type.id);
                      handleNavClick('ОДЯГ ДЛЯ ДОМУ', true);
                      setHoveredMenu(null);
                    }}
                    className={`text-left flex items-center gap-3 px-3 py-2 text-sm font-bold rounded-lg transition-all cursor-pointer ${
                      selectedPajamaType === type.id && selectedMenu === 'ОДЯГ ДЛЯ ДОМУ'
                        ? 'bg-pink-50 text-[#e02484]'
                        : 'bg-transparent text-gray-700 hover:bg-gray-50 hover:text-[#e02484]'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${selectedPajamaType === type.id && selectedMenu === 'ОДЯГ ДЛЯ ДОМУ' ? 'bg-[#e02484]' : 'bg-gray-300'}`}></span>
                    {lang === 'ru' ? type.ru : type.ua}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {hoveredMenu === 'КУПАЛЬНИКИ' && activeView === 'catalog' && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="absolute top-full left-0 w-full bg-white border-b border-gray-200 overflow-hidden z-10 shadow-xl origin-top"
            >
              <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-3 gap-x-6">
                {SWIMWEAR_SUBTYPES.map(type => (
                  <button
                    key={type.id}
                    onClick={() => {
                      setSelectedSwimwearType(type.id);
                      handleNavClick('КУПАЛЬНИКИ', true);
                      setHoveredMenu(null);
                    }}
                    className={`text-left flex items-center gap-3 px-3 py-2 text-sm font-bold rounded-lg transition-all cursor-pointer ${
                      selectedSwimwearType === type.id && selectedMenu === 'КУПАЛЬНИКИ'
                        ? 'bg-pink-50 text-[#e02484]'
                        : 'bg-transparent text-gray-700 hover:bg-gray-50 hover:text-[#e02484]'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${selectedSwimwearType === type.id && selectedMenu === 'КУПАЛЬНИКИ' ? 'bg-[#e02484]' : 'bg-gray-300'}`}></span>
                    {lang === 'ru' ? type.ru : type.ua}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {hoveredMenu === 'КОМПЛЕКТИ БІЛИЗНИ' && activeView === 'catalog' && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="absolute top-full left-0 w-full bg-white border-b border-gray-200 overflow-hidden z-10 shadow-xl origin-top"
            >
              <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-3 gap-x-6">
                {SET_SUBTYPES.map(type => (
                  <button
                    key={type.id}
                    onClick={() => {
                      setSelectedSetType(type.id);
                      handleNavClick('КОМПЛЕКТИ БІЛИЗНИ', true);
                      setHoveredMenu(null);
                    }}
                    className={`text-left flex items-center gap-3 px-3 py-2 text-sm font-bold rounded-lg transition-all cursor-pointer ${
                      selectedSetType === type.id && selectedMenu === 'КОМПЛЕКТИ БІЛИЗНИ'
                        ? 'bg-pink-50 text-[#e02484]'
                        : 'bg-transparent text-gray-700 hover:bg-gray-50 hover:text-[#e02484]'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${selectedSetType === type.id && selectedMenu === 'КОМПЛЕКТИ БІЛИЗНИ' ? 'bg-[#e02484]' : 'bg-gray-300'}`}></span>
                    {lang === 'ru' ? type.ru : type.ua}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {hoveredMenu === 'ТЕРМОБІЛИЗНА' && activeView === 'catalog' && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="absolute top-full left-0 w-full bg-white border-b border-gray-200 overflow-hidden z-10 shadow-xl origin-top"
            >
              <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-3 gap-x-6">
                {THERMAL_SUBTYPES.map(type => (
                  <button
                    key={type.id}
                    onClick={() => {
                      setSelectedThermalType(type.id);
                      handleNavClick('ТЕРМОБІЛИЗНА', true);
                      setHoveredMenu(null);
                    }}
                    className={`text-left flex items-center gap-3 px-3 py-2 text-sm font-bold rounded-lg transition-all cursor-pointer ${
                      selectedThermalType === type.id && selectedMenu === 'ТЕРМОБІЛИЗНА'
                        ? 'bg-pink-50 text-[#e02484]'
                        : 'bg-transparent text-gray-700 hover:bg-gray-50 hover:text-[#e02484]'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${selectedThermalType === type.id && selectedMenu === 'ТЕРМОБІЛИЗНА' ? 'bg-[#e02484]' : 'bg-gray-300'}`}></span>
                    {lang === 'ru' ? type.ru : type.ua}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {hoveredMenu === 'ЕРОТИЧНА БІЛИЗНА' && activeView === 'catalog' && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="absolute top-full left-0 w-full bg-white border-b border-gray-200 overflow-hidden z-10 shadow-xl origin-top"
            >
              <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-3 gap-x-6">
                {EROTIC_SUBTYPES.map(type => (
                  <button
                    key={type.id}
                    onClick={() => {
                      setSelectedEroticType(type.id);
                      handleNavClick('ЕРОТИЧНА БІЛИЗНА', true);
                      setHoveredMenu(null);
                    }}
                    className={`text-left flex items-center gap-3 px-3 py-2 text-sm font-bold rounded-lg transition-all cursor-pointer ${
                      selectedEroticType === type.id && selectedMenu === 'ЕРОТИЧНА БІЛИЗНА'
                        ? 'bg-pink-50 text-[#e02484]'
                        : 'bg-transparent text-gray-700 hover:bg-gray-50 hover:text-[#e02484]'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${selectedEroticType === type.id && selectedMenu === 'ЕРОТИЧНА БІЛИЗНА' ? 'bg-[#e02484]' : 'bg-gray-300'}`}></span>
                    {lang === 'ru' ? type.ru : type.ua}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {hoveredMenu === 'ІГРАШКИ ТА АКСЕСУАРИ' && activeView === 'catalog' && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="absolute top-full left-0 w-full bg-white border-b border-gray-200 overflow-hidden z-10 shadow-xl origin-top"
            >
              <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-y-3 gap-x-6">
                {TOYS_SUBTYPES.map(type => (
                  <button
                    key={type.id}
                    onClick={() => {
                      setSelectedToysType(type.id);
                      handleNavClick('ІГРАШКИ ТА АКСЕСУАРИ', true);
                      setHoveredMenu(null);
                    }}
                    className={`text-left flex items-center gap-3 px-3 py-2 text-sm font-bold rounded-lg transition-all cursor-pointer ${
                      selectedToysType === type.id && selectedMenu === 'ІГРАШКИ ТА АКСЕСУАРИ'
                        ? 'bg-pink-50 text-[#e02484]'
                        : 'bg-transparent text-gray-700 hover:bg-gray-50 hover:text-[#e02484]'
                    }`}
                  >
                    <span className={`w-1.5 h-1.5 rounded-full ${selectedToysType === type.id && selectedMenu === 'ІГРАШКИ ТА АКСЕСУАРИ' ? 'bg-[#e02484]' : 'bg-gray-300'}`}></span>
                    {lang === 'ru' ? type.ru : type.ua}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {activeView === 'catalog' ? (
        <>
      {/* 5. Main Catalog Layout Area */}
      <main id="catalog-section" className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-4 gap-8">

        
        {/* Left column sidebar for searching, filter specs, pricing bounds */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Dynamic Category Navigation pills */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <button 
              onClick={() => setIsCategoriesExpanded(!isCategoriesExpanded)}
              className="w-full font-sans font-bold text-gray-900 text-sm tracking-tight border-b border-gray-100 pb-2 flex items-center justify-between cursor-pointer focus:outline-none"
            >
              <div className="flex items-center gap-2">
                <span>{lang === 'ru' ? 'Категории товаров' : 'Категорії товарів'}</span>
                <Sparkles className="w-4 h-4 text-[#e02484]" />
              </div>
              <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isCategoriesExpanded ? 'rotate-180' : ''}`} />
            </button>

            <AnimatePresence>
              {isCategoriesExpanded && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="flex flex-col gap-1 overflow-hidden"
                >
                  {CATEGORIES.map(cat => {
                    const isSelected = selectedCategory === cat.key;
                    const count = allProducts.filter(p => isProductInCategory(p, cat.key)).length;
                    const subInfo = getCategorySubtypes(cat.key);
                    const hasSubtypes = subInfo !== null && subInfo.subtypes.length > 0;
                    const isExpanded = expandedCategoryKeys.has(cat.key);

                    return (
                      <div key={cat.key} className="flex flex-col">
                        <div
                          onClick={() => {
                            setExpandedCategoryKeys(prev => {
                              const next = new Set(prev);
                              if (next.has(cat.key)) {
                                next.delete(cat.key);
                              } else {
                                next.add(cat.key);
                              }
                              return next;
                            });

                            setSelectedCategory(cat.key);
                            const matchingMenu = Object.keys(MENU_TRANSLATIONS).find(m => getCategoryKeyFromMenu(m) === cat.key);
                            setSelectedMenu(matchingMenu || 'all');
                            setSelectedPantiesType(0);
                            setSelectedBraType(0);
                            setSelectedPajamaType(0);
                            setSelectedSwimwearType(0);
                            setSelectedSetType(0);
                            setSelectedThermalType(0);
                            setSelectedEroticType(0);
                            setSelectedToysType(0);
                            setCurrentPage(1);
                          }}
                          className={`p-2.5 rounded-lg text-xs font-semibold text-left flex items-center justify-between transition-all cursor-pointer select-none ${
                            isSelected
                              ? 'bg-pink-50 text-[#e02484] shadow-2xs font-bold'
                              : 'bg-transparent hover:bg-gray-50 text-gray-700 hover:text-gray-900'
                          }`}
                        >
                          <div className="flex items-center gap-2.5">
                            {renderCategoryIcon(cat.key, `w-4 h-4 ${isSelected ? 'text-[#e02484]' : 'text-gray-400'}`)}
                            <span>{lang === 'ru' ? cat.labelRu : cat.labelUa}</span>
                          </div>

                          <div className="flex items-center gap-1.5">
                            <span className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                              isSelected ? 'bg-pink-100 text-[#e02484] font-bold' : 'bg-gray-100 text-gray-400 border border-gray-200'
                            }`}>
                              {count}
                            </span>
                            {hasSubtypes && (
                              <ChevronDown 
                                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                                  isExpanded ? 'rotate-180 text-[#e02484]' : 'text-gray-400'
                                }`} 
                              />
                            )}
                          </div>
                        </div>

                        {/* Subcategories Accordion List */}
                        <AnimatePresence initial={false}>
                          {hasSubtypes && isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.2, ease: 'easeInOut' }}
                              className="overflow-hidden pl-3 pr-1 py-1 flex flex-col gap-0.5 border-l-2 border-pink-200 ml-3.5 my-1"
                            >
                              {subInfo.subtypes.map(subType => {
                                const isSubSelected = isSelected && subInfo.current === subType.id;
                                const subCount = getSubtypeCount(cat.key, subType);

                                return (
                                  <button
                                    key={subType.id}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleSubtypeSelect(cat.key, subType.id, subInfo.menu, subInfo.set);
                                    }}
                                    className={`px-2 py-1.5 rounded text-[11px] text-left flex items-center justify-between transition-all cursor-pointer ${
                                      isSubSelected
                                        ? 'bg-pink-100 text-[#e02484] font-extrabold shadow-2xs'
                                        : 'text-gray-600 hover:text-gray-900 hover:bg-pink-50/60 font-medium'
                                    }`}
                                  >
                                    <div className="flex items-center gap-2 truncate pr-1">
                                      <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                        isSubSelected ? 'bg-[#e02484]' : 'bg-gray-300'
                                      }`} />
                                      <span className="truncate">{lang === 'ru' ? subType.ru : subType.ua}</span>
                                    </div>
                                    <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono shrink-0 ${
                                      isSubSelected 
                                        ? 'bg-[#e02484] text-white font-bold' 
                                        : 'bg-gray-100 text-gray-500'
                                    }`}>
                                      {subCount}
                                    </span>
                                  </button>
                                );
                              })}
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Responsive Advanced Filters Section */}
          <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-gray-100 pb-2">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className="font-sans font-bold text-gray-900 text-sm tracking-tight flex items-center gap-1.5 cursor-pointer focus:outline-none flex-1 text-left"
              >
                <SlidersHorizontal className="w-4 h-4 text-[#e02484]" />
                <span>{t.filtersTitle}</span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ml-auto ${showFilters ? 'rotate-180' : ''}`} />
              </button>
              {showFilters && (
                <button
                  onClick={resetFilters}
                  className="text-[10px] font-bold text-[#e02484] hover:text-[#c0146f] transition-colors cursor-pointer ml-3 shrink-0"
                >
                  {t.clearFilters}
                </button>
              )}
            </div>

            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="flex flex-col gap-5 overflow-hidden"
                >
                  {/* Internal Filter Controls Container */}

            {/* Price slider filter */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-gray-500 font-medium">
                <span>{t.priceLabel}</span>
                <span className="font-bold text-gray-800 font-mono">{maxPrice} грн</span>
              </div>
              <input
                type="range"
                min={0}
                max={maxProductPrice || 1200}
                step={10}
                value={maxPrice}
                onChange={e => setMaxPrice(Number(e.target.value))}
                className="w-full accent-[#e02484] bg-gray-200 h-1 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[9px] text-gray-400 font-mono">
                <span>0 грн</span>
                <span>{maxProductPrice} грн</span>
              </div>
            </div>

            {/* Sizes selection dropdown */}
            {allUniqueSizes.length > 0 && (
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">{t.sizesLabel}</label>
                <select
                  className="w-full text-xs p-2 rounded-md border border-gray-200 focus:outline-none focus:border-[#e02484] bg-white cursor-pointer"
                  value={selectedSizes.length === 1 ? selectedSizes[0] : ''}
                  onChange={(e) => {
                    if (e.target.value === '') {
                      setSelectedSizes([]);
                    } else {
                      setSelectedSizes([e.target.value]);
                    }
                  }}
                >
                  <option value="">{lang === 'ru' ? 'Все размеры' : 'Всі розміри'}</option>
                  {allUniqueSizes.map(sz => (
                    <option key={sz} value={sz}>{sz}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Colors picker selection */}
            <div className="space-y-2 pt-2 border-t border-gray-100">
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">{t.colorsLabel}</label>
              <select
                value={selectedColor}
                onChange={e => setSelectedColor(e.target.value)}
                className="w-full p-2 bg-white border border-gray-300 text-gray-800 focus:border-[#e02484] rounded-lg text-xs focus:outline-none transition-all font-sans"
              >
                <option value="all">{lang === 'ru' ? 'Все цвета' : 'Всі кольори'}</option>
                {OFFICIAL_COLORS.map(c => (
                  <option key={c.ua} value={c.ua}>
                    {lang === 'ru' ? c.ru : c.ua}
                  </option>
                ))}
              </select>
            </div>

            {/* Sorting controls */}
            <div className="space-y-2 pt-2 border-t border-gray-100">
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">{t.sortLabel}</label>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value)}
                  className="w-full p-2 bg-white border border-gray-300 text-gray-800 focus:border-[#e02484] rounded-lg text-xs focus:outline-none transition-all font-sans pr-8 appearance-none"
                >
                  <option value="default">{t.sortOptions.default}</option>
                  <option value="priceAsc">{t.sortOptions.priceAsc}</option>
                  <option value="priceDesc">{t.sortOptions.priceDesc}</option>
                </select>
                <ArrowUpDown className="w-3.5 h-3.5 text-gray-400 absolute right-3 top-3 pointer-events-none" />
              </div>
            </div>
            
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Right column representing actual product cards grids with counts */}
        <div id="catalog-section" className="lg:col-span-3 space-y-6">
          
          {/* Active stats, filters or source details */}
          <div className="flex items-center justify-between">
            <p className="text-xs font-bold text-gray-500 tracking-wide">
              {selectedCategory === ('favorites' as any) 
                ? (lang === 'ru' ? 'Избранные товары' : 'Обрані товари')
                : t.productsCount.replace('{count}', String(sortedProducts.length))}
            </p>

            {/* If any filter active, display reset indicator */}
            {(searchQuery || selectedCategory !== 'all' || selectedMenu !== 'all' || maxPrice < maxProductPrice || selectedSizes.length > 0 || selectedColor !== 'all') && (
              <button
                onClick={resetFilters}
                className="text-[11px] font-bold text-[#e02484] hover:text-[#c0146f] transition-all flex items-center gap-1 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                {lang === 'ru' ? 'Сбросить все' : 'Скинути все'}
              </button>
            )}
          </div>

          {/* Loading state indicator spinner */}
          {loading ? (
            <div className="py-24 flex flex-col items-center justify-center space-y-4">
              <div className="w-10 h-10 border-4 border-gray-200 border-t-[#e02484] rounded-full animate-spin" />
              <p className="text-xs text-gray-500 font-semibold uppercase tracking-wider">
                {lang === 'ru' ? 'Загрузка каталога...' : 'Завантаження каталогу...'}
              </p>
            </div>
          ) : sortedProducts.length === 0 ? (
            /* Empty catalogs view fallback */
            <div className="py-24 bg-white rounded-xl border border-gray-200 text-center p-6 space-y-3.5 shadow-sm">
              <div className="w-12 h-12 bg-pink-50 rounded-full flex items-center justify-center mx-auto text-[#e02484]">
                <Search className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="font-bold text-gray-900 text-base">
                  {lang === 'ru' ? 'Товары не найдены' : 'Товари не знайдено'}
                </h4>
                <p className="text-xs text-gray-500 font-sans leading-relaxed">
                  {lang === 'ru' 
                    ? 'Попробуйте изменить параметры фильтрации или поисковый запрос.' 
                    : 'Спробуйте змінити параметри фільтрації або пошуковий запит.'}
                </p>
              </div>
              <button
                type="button"
                onClick={resetFilters}
                className="px-4 py-2 bg-[#e02484] text-white hover:bg-[#c0146f] rounded-lg text-xs font-bold transition-all shadow-md cursor-pointer"
              >
                {t.clearFilters}
              </button>
            </div>
          ) : (
            <>
              {/* Beautiful Product Grid */}
              <motion.div 
                layout
                className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6"
              >
                <AnimatePresence mode="popLayout">
                  {paginatedProducts.map(product => {
                    const isFav = favorites.includes(product.id);
                    return (
                      <motion.div
                        key={product.id}
                        layout
                        initial={{ opacity: 0, scale: 0.92 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.92 }}
                        transition={{ duration: 0.25 }}
                      >
                        <ProductCard
                          product={product}
                          onViewDetails={setSelectedProduct}
                          onAddToCart={(p, sz, col) => handleAddToCart(p, sz, col, 1)}
                          isFavorite={isFav}
                          onToggleFavorite={handleToggleFavorite}
                          lang={lang}
                          showPriceMargin={managerMode}
                        />
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </motion.div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 pb-2 border-t border-gray-150 text-sans">
                  <span className="text-xs font-semibold text-gray-400">
                    {lang === 'ru' 
                      ? `Показано ${startIndex + 1}–${Math.min(startIndex + PRODUCTS_PER_PAGE, sortedProducts.length)} из ${sortedProducts.length} товаров`
                      : `Показано ${startIndex + 1}–${Math.min(startIndex + PRODUCTS_PER_PAGE, sortedProducts.length)} із ${sortedProducts.length} товарів`}
                  </span>
                  
                  <div className="flex items-center gap-1.5">
                    {/* Prev Button */}
                    <button
                      onClick={() => handlePageChange(activePage - 1)}
                      disabled={activePage === 1}
                      className={`flex items-center justify-center p-2 rounded-lg border text-xs font-bold transition-all select-none cursor-pointer ${
                        activePage === 1
                          ? "border-gray-100 bg-gray-50/50 text-gray-300 cursor-not-allowed"
                          : "border-gray-200 text-gray-750 bg-white hover:bg-pink-50/50 hover:text-[#e02484] hover:border-pink-100"
                      }`}
                      title={lang === 'ru' ? 'Предыдущая страница' : 'Попередня сторінка'}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>

                    {/* Page Numbers */}
                    {getPaginationRange().map((p, idx) => {
                      if (p === 'dots') {
                        return (
                          <span key={`dots-${idx}`} className="text-gray-400 px-1 font-bold text-xs select-none">
                            •••
                          </span>
                        );
                      }

                      const pageNum = p as number;
                      const isSelected = pageNum === activePage;

                      return (
                        <button
                          key={`page-${pageNum}`}
                          onClick={() => handlePageChange(pageNum)}
                          className={`min-w-[32px] h-8 rounded-lg text-xs font-bold transition-all select-none cursor-pointer ${
                            isSelected
                              ? "bg-[#e02484] text-white shadow-sm border border-transparent"
                              : "bg-white border border-gray-200 text-gray-700 hover:bg-pink-50/50 hover:text-[#e02484] hover:border-pink-100"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    {/* Next Button */}
                    <button
                      onClick={() => handlePageChange(activePage + 1)}
                      disabled={activePage === totalPages}
                      className={`flex items-center justify-center p-2 rounded-lg border text-xs font-bold transition-all select-none cursor-pointer ${
                        activePage === totalPages
                          ? "border-gray-100 bg-gray-50/50 text-gray-300 cursor-not-allowed"
                          : "border-gray-200 text-gray-750 bg-white hover:bg-pink-50/50 hover:text-[#e02484] hover:border-pink-100"
                      }`}
                      title={lang === 'ru' ? 'Следующая страница' : 'Наступна сторінка'}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Orders History List section - Displayed if orders have been placed inside this local simulation */}
          {managerMode && orders.length > 0 && (
            <div className="mt-16 bg-white p-6 rounded-xl border border-gray-200 shadow-sm space-y-6">
              <h3 className="font-sans font-bold text-gray-900 text-base tracking-tight flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#e02484]" />
                {t.ordersHistory}
              </h3>

              <div className="divide-y divide-gray-100">
                {orders.map(ord => (
                  <div key={ord.id} className="py-4 first:pt-0 last:pb-0 flex flex-col md:flex-row items-baseline md:items-center justify-between gap-3 text-xs font-sans">
                    <div>
                      <p className="font-mono font-bold text-[#e02484] text-sm">{ord.id}</p>
                      <p className="text-[11px] text-gray-500 mt-0.5">{t.orderDate} {ord.date}</p>
                      <p className="text-[11px] text-gray-500 mt-1">
                        <strong>{lang === 'ru' ? 'Получатель:' : 'Отримувач:'}</strong> {ord.customerInfo.name} | {ord.customerInfo.phone}
                      </p>
                    </div>

                    <div className="flex items-center gap-6 self-end md:self-auto font-sans text-xs">
                      <div>
                        <span className="text-gray-400 mr-1">{t.orderTotal}</span>
                        <strong className="text-gray-900 text-sm font-bold">
                          {ord.total.toLocaleString('uk-UA')} грн
                        </strong>
                      </div>
                      <span className="px-2.5 py-1 bg-pink-50 text-[#e02484] border border-pink-200 rounded-lg font-bold font-sans">
                        {t.orderStatuses[ord.status]}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

      </main>
      </>
      ) : (
        <BlogView
          lang={lang}
          managerMode={managerMode}
          posts={blogPosts.length === 0 ? getDefaultBlogPosts(lang) : blogPosts}
          onAddPost={handleAddPost}
          onDeletePost={handleDeletePost}
        />
      )}

      {/* Database/Supabase Administration dialog */}
      <AdminPanel
        isOpen={isAdminOpen && managerMode}
        onClose={() => setIsAdminOpen(false)}
        onConfigChange={() => loadProducts(true)}
        currentMode={dbStatus.mode}
        lang={lang}
        adminPassword={localStorage.getItem('lastochka_admin_password') || ''}
        blogPosts={blogPosts}
        onAddBlogPost={handleAddPost}
        onDeleteBlogPost={handleDeletePost}
        onBannersUpdated={loadBanners}
      />

      {/* Full-width Product Detail information modal overlay */}
      <AnimatePresence>
        {selectedProduct && (
          <DetailModal
            product={selectedProduct}
            isOpen={!!selectedProduct}
            onClose={() => setSelectedProduct(null)}
            onAddToCart={handleAddToCart}
            isFavorite={favorites.includes(selectedProduct.id)}
            onToggleFavorite={handleToggleFavorite}
            lang={lang}
            showPriceMargin={managerMode}
          />
        )}
      </AnimatePresence>

      {/* Cart / Place order slide over sidebar */}
      <AnimatePresence>
        {isCartOpen && (
          <CartDrawer
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            cartItems={cartItems}
            onUpdateQty={handleUpdateCartQty}
            onRemoveItem={handleRemoveCartItem}
            onPlaceOrder={handlePlaceOrder}
            lang={lang}
          />
        )}
      </AnimatePresence>

      {/* Bottom Banner Carousel near Footer */}
      <BannerCarousel 
        banners={banners} 
        lang={lang} 
        onCategorySelect={handleCategorySelect} 
      />

      {/* Footer credits and information */}
      <footer className="mt-12 bg-[#ffd5ea] text-gray-900 py-8 md:py-10 px-4 font-sans">

        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
          
          <div className="flex flex-col items-center md:items-start text-center md:text-left flex-shrink-0">
            {/* Footer Logo */}
            <div 
              className="flex flex-col items-center cursor-pointer group" 
              onClick={() => { 
                window.scrollTo({ top: 0, behavior: 'smooth' });
                setActiveView('catalog');
                setSelectedCategory('all');
                setSelectedMenu('all');
                setSearchQuery('');
              }}
            >
              <div className="flex flex-col items-center group-hover:scale-105 transition-transform mix-blend-multiply">
                <img 
                  src={BRAND_LOGO_BASE64}
                  alt="Ластівка"
                  className="h-10 md:h-12 w-auto object-contain select-none"
                />
              </div>
              <p className="text-[10px] text-gray-800 font-sans uppercase mt-1 font-medium tracking-wide">
                НИЖНЯ БІЛИЗНА КРИВИЙ РІГ
              </p>
            </div>

            {/* Social Icons & Web Version */}
            <div className="flex items-center gap-3 mt-3 flex-wrap justify-center md:justify-start">
              <a 
                href="https://www.instagram.com/lastochka.dp.ua?utm_source=qr&igsh=eGM2b2RqZjNhMzB5" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#e02484] hover:bg-[#e02484] hover:text-white transition-all shadow-sm border border-pink-100 hover:scale-110 cursor-pointer"
                title="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a 
                href="https://tiktok.com/@lastochka.dp.ua" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#e02484] hover:bg-[#e02484] hover:text-white transition-all shadow-sm border border-pink-100 hover:scale-110 cursor-pointer"
                title="TikTok"
              >
                <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
                  <path d="M448,209.91a210.06,210.06,0,0,1-122.77-39.25V349.38A162.55,162.55,0,1,1,185,188.31V278.2a74.62,74.62,0,1,0,52.23,71.18V0l88,0a121.18,121.18,0,0,0,1.86,22.17h0A122.18,122.18,0,0,0,381,102.39a121.43,121.43,0,0,0,67,20.14Z"/>
                </svg>
              </a>

              <a
                href={window.location.origin}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold bg-white hover:bg-pink-50 text-[#e02484] rounded-full border border-pink-200 shadow-sm hover:shadow hover:scale-105 active:scale-95 transition-all cursor-pointer select-none tracking-wide"
                title={lang === 'ru' ? 'Открыть полноценную веб-версию в браузере' : 'Відкрити повноцінну веб-версію в браузері'}
              >
                <Globe className="w-3.5 h-3.5 shrink-0 animate-pulse text-[#e02484]" />
                <span>{lang === 'ru' ? 'Веб-версия' : 'Веб-версія'}</span>
              </a>
            </div>

            <p className="text-[10px] text-gray-500 font-sans mt-3.5 font-normal">
              "ЛАСТІВКА" | модна нижня білизна © 2026
            </p>
          </div>
          
          <div className="flex flex-col flex-grow max-w-xl space-y-3 text-[11px] md:text-[13px] text-gray-800">
            
            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2.5">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <a href="tel:+380960486714" className="hover:text-pink-600 transition-colors font-semibold">
                  +380960486714, Ольга
                </a>
              </div>
              <div className="flex items-center space-x-2.5">
                <Mail className="w-4 h-4 flex-shrink-0" />
                <a href="mailto:lastochka.dp.ua@gmail.com" className="hover:text-pink-600 transition-colors">
                  lastochka.dp.ua@gmail.com
                </a>
              </div>
            </div>

            <hr className="border-white/60" />

            <div className="flex items-start space-x-2.5">
              <Home className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div className="flex flex-col space-y-0.5">
                <span>{lang === 'ru' ? 'Онлайн-магазин модного женского белья – склад в г. Кривой Рог.' : 'Онлайн-магазин модної нижньої білизни – склад в місті Кривий Ріг.'}</span>
              </div>
            </div>

            <hr className="border-white/60" />

            <div className="flex flex-col space-y-2">
              <div className="flex items-center space-x-2.5">
                <Clock className="w-4 h-4 flex-shrink-0" />
                <span className="font-semibold">24/7</span>
              </div>
              <a 
                href="https://t.me/+380960486714" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="flex items-center space-x-2.5 hover:text-pink-600 transition-colors w-fit font-medium text-pink-700"
              >
                <Send className="w-4 h-4 flex-shrink-0 text-sky-500" />
                <span>{lang === 'ru' ? 'Написать в Telegram' : 'Написати в Telegram'}</span>
              </a>
            </div>

          </div>

        </div>
      </footer>

      {/* Admin Auth Modal */}
      <AnimatePresence>
        {isAdminAuthModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 w-full max-w-sm"
            >
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                {dbStatus.mode === 'supabase'
                  ? (authMethod === 'supabase_email'
                      ? (authMode === 'login' ? (lang === 'ru' ? 'Вход в систему' : 'Вхід в систему') : (lang === 'ru' ? 'Восстановление' : 'Відновлення'))
                      : (lang === 'ru' ? 'Доступ администратора' : 'Доступ адміністратора'))
                  : (lang === 'ru' ? 'Доступ администратора' : 'Доступ адміністратора')}
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                {dbStatus.mode === 'supabase'
                  ? (authMethod === 'supabase_email'
                      ? (authMode === 'login' ? (lang === 'ru' ? 'Введите email и пароль.' : 'Введіть email та пароль.') : (lang === 'ru' ? 'Введите email для сброса пароля.' : 'Введіть email для скидання пароля.'))
                      : (lang === 'ru' ? 'Введите пароль администратора.' : 'Введіть пароль адміністратора.'))
                  : (lang === 'ru' ? 'Введите пароль для редактирования товаров.' : 'Введіть пароль для редагування.')}
              </p>
              
              {dbStatus.mode === 'supabase' && (
                <div className="flex bg-gray-100 p-1 rounded-xl mb-4 text-xs font-semibold select-none">
                  <button
                    type="button"
                    onClick={() => { setAuthMethod('password'); setAuthError(''); }}
                    className={`flex-1 py-1.5 rounded-lg transition-colors cursor-pointer text-center ${authMethod === 'password' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
                  >
                    {lang === 'ru' ? 'Пароль' : 'Пароль'}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setAuthMethod('supabase_email'); setAuthError(''); }}
                    className={`flex-1 py-1.5 rounded-lg transition-colors cursor-pointer text-center ${authMethod === 'supabase_email' ? 'bg-white shadow-sm text-gray-900' : 'text-gray-500 hover:text-gray-900'}`}
                  >
                    {lang === 'ru' ? 'Аккаунт Supabase' : 'Акаунт Supabase'}
                  </button>
                </div>
              )}
              
              {authError && (
                <div className="mb-4 p-3 bg-red-50 text-red-600 text-xs rounded-lg border border-red-100">
                  {authError}
                </div>
              )}

              <div className="space-y-4">
                {dbStatus.mode === 'supabase' && authMethod === 'supabase_email' && (
                  <input
                    type="email"
                    value={adminEmailInput}
                    onChange={e => setAdminEmailInput(e.target.value)}
                    placeholder={lang === 'ru' ? 'Email' : 'Email'}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:border-[#e02484] focus:ring-1 focus:ring-[#e02484] outline-none transition-all text-gray-900 text-sm"
                  />
                )}
                
                {(dbStatus.mode !== 'supabase' || authMethod === 'password' || authMode !== 'reset') && (
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={adminPasswordInput}
                      onChange={e => setAdminPasswordInput(e.target.value)}
                      placeholder={lang === 'ru' ? 'Пароль' : 'Пароль'}
                      className="w-full pl-4 pr-11 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:border-[#e02484] focus:ring-1 focus:ring-[#e02484] outline-none transition-all text-gray-900 text-sm"
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          if (!authLoading) {
                            document.getElementById('admin-auth-submit')?.click();
                          }
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none transition-all p-1.5 rounded-full hover:bg-gray-200/50"
                      title={showPassword ? (lang === 'ru' ? 'Скрыть пароль' : 'Приховати пароль') : (lang === 'ru' ? 'Показать пароль' : 'Показати пароль')}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                )}

                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsAdminAuthModalOpen(false);
                      setAdminPasswordInput('');
                      setAdminEmailInput('');
                      setAuthError('');
                    }}
                    className="flex-1 py-3 px-4 rounded-lg border border-gray-200 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors"
                  >
                    {lang === 'ru' ? 'Отмена' : 'Скасувати'}
                  </button>
                  <button
                    id="admin-auth-submit"
                    disabled={authLoading}
                    onClick={async () => {
                      if (dbStatus.mode === 'supabase' && authMethod === 'supabase_email') {
                        const client = getAuthClient();
                        if (!client) {
                          setAuthError('Supabase is not configured properly.');
                          return;
                        }
                        setAuthLoading(true);
                        setAuthError('');
                        
                        try {
                          if (authMode === 'login') {
                            const { data, error } = await client.auth.signInWithPassword({
                              email: adminEmailInput,
                              password: adminPasswordInput
                            });
                            if (error) throw error;
                            if (data.session) {
                              setIsAdminAuthModalOpen(false);
                              setManagerMode(true);
                              triggerToast(lang === 'ru' ? 'Вход выполнен' : 'Вхід виконано', 'success');
                            }
                          } else if (authMode === 'reset') {
                            const { error } = await client.auth.resetPasswordForEmail(adminEmailInput);
                            if (error) throw error;
                            setAuthMode('login');
                            triggerToast(lang === 'ru' ? 'Ссылка отправлена на email' : 'Посилання відправлено', 'success');
                          }
                        } catch (err: any) {
                          setAuthError(err.message || 'Authentication error');
                        } finally {
                          setAuthLoading(false);
                        }
                      } else {
                        // Admin Password mode
                        setAuthLoading(true);
                        setAuthError('');
                        try {
                          const res = await fetch('/api/admin/login', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ adminPassword: adminPasswordInput })
                          });
                          const data = await res.json();
                          if (!res.ok) {
                            setAuthError(data.error || (lang === 'ru' ? 'Неверный пароль' : 'Невірний пароль'));
                            setAuthLoading(false);
                            return;
                          }
                          localStorage.setItem('lastochka_admin_password', adminPasswordInput);
                          setIsAdminAuthModalOpen(false);
                          setManagerMode(true);
                          setAdminPasswordInput('');
                          triggerToast(lang === 'ru' ? 'Режим менеджера активен' : 'Режим менеджера активний', 'info');
                        } catch (err: any) {
                          setAuthError(err.message || 'Login error');
                        } finally {
                          setAuthLoading(false);
                        }
                      }
                    }}
                    className="flex-1 py-3 px-4 rounded-lg bg-[#e02484] hover:bg-[#c0146f] text-white font-semibold text-sm shadow-sm transition-colors disabled:opacity-50"
                  >
                    {authLoading ? '...' : 
                     (dbStatus.mode === 'supabase' && authMethod === 'supabase_email' && authMode === 'reset') 
                        ? (lang === 'ru' ? 'Отправить' : 'Відправити')
                        : (lang === 'ru' ? 'Войти' : 'Увійти')}
                  </button>
                </div>
                
                {dbStatus.mode === 'supabase' && authMethod === 'supabase_email' && (
                  <div className="flex flex-col gap-2 pt-4 text-center border-t border-gray-100 mt-4">
                    {authMode === 'login' ? (
                      <button onClick={() => setAuthMode('reset')} className="text-xs text-gray-500 hover:underline">
                        {lang === 'ru' ? 'Забыли пароль?' : 'Забули пароль?'}
                      </button>
                    ) : (
                      <button onClick={() => setAuthMode('login')} className="text-xs text-[#e02484] hover:underline">
                        {lang === 'ru' ? 'Вспомнили пароль? Войти' : 'Згадали пароль? Увійти'}
                      </button>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

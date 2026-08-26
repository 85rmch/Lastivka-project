export interface Product {
  id: number;
  product_code: string;
  name: string;
  vendor_code: string;
  color: string;
  purchase_price: number;
  cup_type?: string;
  price: number;
  photo: string[]; // Cleaned list of image URLs
  sizes: string;
  stock: number;
  category: string;
  description?: string;
}

export type CategoryKey = 
  | 'all' 
  | 'new'
  | 'favorites'
  | 'bras'
  | 'panties' 
  | 'home'
  | 'pajamas'
  | 'swimwear'
  | 'sets'
  | 'underwear' 
  | 'thermals' 
  | 'erotic'
  | 'toys_accessories'
  | 'socks' 
  | 'jeggings' 
  | 'games' 
  | 'other';

export interface CategoryInfo {
  key: CategoryKey;
  labelRu: string;
  labelUa: string;
  icon: string;
}

export interface CartItem {
  product: Product;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
}

export interface Order {
  id: string;
  date: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'completed';
  customerInfo: {
    name: string;
    phone: string;
    delivery: string;
    telegram?: string;
  };
}

export interface BlogBlock {
  id: string;
  type: 'text' | 'image';
  value: string;
  subtype?: 'paragraph' | 'h1' | 'h2' | 'quote' | 'list';
  textColor?: string;
  isBold?: boolean;
  isItalic?: boolean;
  alignment?: 'left' | 'center' | 'right' | 'justify';
}

export interface BlogPost {
  id: string;
  title: string;
  content: string;
  images: string[];
  blocks?: BlogBlock[];
  date: string;
}

export interface SupabaseConfig {
  url: string;
  anonKey: string;
  secretKey?: string;
  tableName: string;
  mode: 'demo' | 'supabase';
}

export interface Banner {
  id: string;
  image: string;
  titleRu: string;
  titleUa: string;
  subtitleRu: string;
  subtitleUa: string;
  accentText: string;
  linkCategory?: string;
}

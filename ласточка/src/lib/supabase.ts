import { getProductCategory, cleanImageUrl } from '../data';
import { createClient } from '@supabase/supabase-js';
import { Product, BlogPost, Banner } from '../types';
import { PRODUCTS } from '../data';
import { DEFAULT_BANNERS } from '../defaultBanners';

// Helper to get demo products from localStorage if imported/edited, else fallback to standard PRODUCTS
export function getDemoProducts(): Product[] {
  let list = PRODUCTS;
  const stored = localStorage.getItem('lastochka_imported_products');
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        list = parsed;
      }
    } catch (e) {
      console.error('Failed to parse imported products from localStorage:', e);
    }
  }

  // Apply custom added products
  const customStored = localStorage.getItem('lastochka_custom_products');
  if (customStored) {
    try {
      const custom: Product[] = JSON.parse(customStored);
      if (Array.isArray(custom)) {
        list = [...custom, ...list];
      }
    } catch (e) {}
  }

  // Apply edited product overrides
  const editedStored = localStorage.getItem('lastochka_edited_products');
  if (editedStored) {
    try {
      const edited: Product[] = JSON.parse(editedStored);
      if (Array.isArray(edited)) {
        list = list.map(p => {
          const match = edited.find(e => (p.id && e.id === p.id) || (p.product_code && e.product_code === p.product_code));
          return match ? { ...p, ...match } : p;
        });
      }
    } catch (e) {}
  }

  // Filter out deleted products
  const deletedStored = localStorage.getItem('lastochka_deleted_products');
  if (deletedStored) {
    try {
      const deletedIds: (string | number)[] = JSON.parse(deletedStored);
      if (Array.isArray(deletedIds)) {
        list = list.filter(p => !deletedIds.includes(p.id) && !deletedIds.includes(p.product_code));
      }
    } catch (e) {}
  }

  return list;
}

// Read config from localStorage if customized, otherwise use defaults
export function getStoredConfig() {
  const url = localStorage.getItem('supabase_url') || import.meta.env.VITE_SUPABASE_URL || '';
  const anonKey = localStorage.getItem('supabase_anon_key') || import.meta.env.VITE_SUPABASE_ANON_KEY || '';
  const secretKey = localStorage.getItem('supabase_secret_key') || import.meta.env.VITE_SUPABASE_SECRET_KEY || '';
  const tableName = localStorage.getItem('supabase_table_name') || 'products';

  return { mode: 'supabase' as 'demo' | 'supabase', url, anonKey, secretKey, tableName };
}

let authClientInstance: any = null;
let currentAuthUrl: string | null = null;
let currentAuthKey: string | null = null;

export function getAuthClient() {
  const config = getStoredConfig();
  if (config.mode !== 'supabase' || !config.url || !config.anonKey) return null;
  
  if (authClientInstance && currentAuthUrl === config.url && currentAuthKey === config.anonKey) {
    return authClientInstance;
  }
  
  authClientInstance = createClient(config.url, config.anonKey, {
    auth: {
       persistSession: true,
       autoRefreshToken: true,
       storage: localStorage,
    }
  });
  currentAuthUrl = config.url;
  currentAuthKey = config.anonKey;
  return authClientInstance;
}

export function saveStoredConfig(config: {
  mode: 'demo' | 'supabase';
  url: string;
  anonKey: string;
  secretKey: string;
  tableName: string;
}) {
  localStorage.setItem('supabase_mode', config.mode);
  localStorage.setItem('supabase_url', config.url);
  localStorage.setItem('supabase_anon_key', config.anonKey);
  localStorage.setItem('supabase_secret_key', config.secretKey);
  localStorage.setItem('supabase_table_name', config.tableName);
}

// Lazy initialization of Supabase client to prevent startup crash if keys are invalid
let supabaseInstance: any = null;
let currentUrl = '';
let currentKey = '';

export function getSupabaseClient(customUrl?: string, customKey?: string) {
  const config = getStoredConfig();
  const url = customUrl || config.url;
  const key = customKey || config.anonKey;

  if (!url || !key) return null;

  // Recreate client if url or key changed
  if (!supabaseInstance || currentUrl !== url || currentKey !== key) {
    try {
      supabaseInstance = createClient(url, key, {
        auth: { persistSession: false }
      });
      currentUrl = url;
      currentKey = key;
    } catch (e) {
      console.error('Failed to initialize Supabase client:', e);
      return null;
    }
  }
  return supabaseInstance;
}

/**
 * Fetch products from Supabase table or return local fallback
 */
export async function fetchSupabaseProducts(): Promise<{
  products: Product[];
  source: 'supabase' | 'demo';
  error?: string;
}> {
  const config = getStoredConfig();
  const demoProducts = getDemoProducts();
  
  if (config.mode === 'demo') {
    return { products: demoProducts, source: 'demo' };
  }

  const client = getSupabaseClient();
  if (!client) {
    return { 
      products: demoProducts, 
      source: 'demo', 
      error: 'Supabase client could not be initialized. Please check credentials.' 
    };
  }

  try {
    const { data, error } = await client
      .from(config.tableName)
      .select('*')
      .order('id', { ascending: true });

    if (error) {
      throw error;
    }

    if (!data || data.length === 0) {
      return { 
        products: demoProducts, 
        source: 'demo', 
        error: `Connected successfully, but table "${config.tableName}" is empty. You can seed it with products in the Admin settings.` 
      };
    }

    // Process and normalize data from Supabase
    const normalized: Product[] = data.map((item: any) => {
      let photos: string[] = [];
      // Support alternative photo columns such as 'photos', 'image', 'images', 'image_url', or 'photo_url'
      const rawPhoto = item.photo ?? item.photos ?? item.image ?? item.images ?? item.image_url ?? item.photo_url;
      if (rawPhoto) {
        if (Array.isArray(rawPhoto)) {
          photos = rawPhoto;
        } else if (typeof rawPhoto === 'string') {
          try {
            photos = JSON.parse(rawPhoto);
          } catch {
            // Strip any nested escape quotes
            const cleanStr = rawPhoto.replace(/""/g, '"').trim();
            try {
              photos = JSON.parse(cleanStr);
            } catch {
              photos = rawPhoto.split(',').map((s: string) => s.trim().replace(/[\[\]"']/g, ''));
            }
          }
        }
      }

      let cleanedPhotos = (Array.isArray(photos) ? photos : [photos])
        .map(p => typeof p === 'string' ? cleanImageUrl(p) : '')
        .filter(p => p !== '');

      if (cleanedPhotos.length === 0 && (item.product_code || item.id)) {
        const localMatch = PRODUCTS.find(p => (item.product_code && p.product_code === item.product_code) || String(p.id) === String(item.id));
        if (localMatch && Array.isArray(localMatch.photo) && localMatch.photo.length > 0) {
          cleanedPhotos = localMatch.photo.map(p => cleanImageUrl(p)).filter(Boolean);
        }
      }
      
      // Categorize product based on its fields
      const normalizedItem = {
        id: Number(item.id || item.product_code),
        product_code: String(item.product_code || ''),
        name: String(item.name || ''),
        vendor_code: String(item.vendor_code || ''),
        color: String(item.color || ''),
        purchase_price: Number(item.purchase_price || 0),
        cup_type: item.cup_type ? String(item.cup_type) : undefined,
        price: Number(item.price || 0),
        photo: cleanedPhotos,
        sizes: String(item.sizes || ''),
        stock: Number(item.stock ?? 1),
        category: item.category ? String(item.category) : '',
        description: item.description ? String(item.description) : ''
      };

      // Assign category using parser helper only if not present in DB
      if (!normalizedItem.category) {
        normalizedItem.category = getProductCategory({ name: normalizedItem.name || '', product_code: normalizedItem.product_code || '' });
      } else if (normalizedItem.category === 'underwear') {
        const correctCat = getProductCategory({ name: normalizedItem.name || '', product_code: normalizedItem.product_code || '' });
        if (correctCat === 'panties') {
            normalizedItem.category = 'panties';
        }
      }

      return normalizedItem as Product;
    });

    // In supabase mode, do NOT apply local storage overrides to prevent device desynchronization.
    // The database is the single source of truth.
    const mergedProducts = normalized;
    return { products: mergedProducts, source: 'supabase' };
  } catch (err: any) {
    console.error('Supabase fetch error:', err);
    return { 
      products: demoProducts, 
      source: 'demo', 
      error: err.message || 'Failed to connect to Supabase database. Using gorgeous local catalog instead.' 
    };
  }
}

/**
 * Seeding products into Supabase
 */
export async function seedSupabaseProducts(
  customProducts?: Product[],
  onProgress?: (index: number, total: number) => void
): Promise<{
  success: boolean;
  insertedCount: number;
  error?: string;
}> {
  const config = getStoredConfig();
  const client = getSupabaseClient();
  
  if (!client) {
    return { success: false, insertedCount: 0, error: 'Supabase client is not configured' };
  }

  const listToSeed = customProducts || getDemoProducts();

  // Group products by vendor_code (or product_code if no vendor_code) to avoid separate cards
  const groupedProducts = new Map<string, any>();
  
  for (const p of listToSeed) {
    const key = (p.vendor_code && p.vendor_code !== 'N/A') ? p.vendor_code : p.product_code;
    if (groupedProducts.has(key)) {
      const existing = groupedProducts.get(key);
      
      const mergeStrings = (a: string, b: string) => {
          const arrA = (a || '').split(',').map(s => s.trim()).filter(Boolean);
          const arrB = (b || '').split(',').map(s => s.trim()).filter(Boolean);
          return Array.from(new Set([...arrA, ...arrB])).join(', ');
      };
      
      existing.color = mergeStrings(existing.color, p.color);
      existing.sizes = mergeStrings(existing.sizes, p.sizes);
      
      const pPhotos = Array.isArray(p.photo) ? p.photo : (typeof p.photo === 'string' ? [p.photo] : []);
      existing.photo = Array.from(new Set([...existing.photo, ...pPhotos])).slice(0, 8);
      
      existing.stock = (Number(existing.stock) || 0) + (Number(p.stock) || 0);
    } else {
      groupedProducts.set(key, {
        product_code: p.product_code,
        name: p.name,
        category: p.category || '',
        description: p.description || '',
        vendor_code: p.vendor_code,
        color: p.color,
        purchase_price: p.purchase_price,
        cup_type: p.cup_type || null,
        price: p.price,
        photo: Array.isArray(p.photo) ? p.photo : (typeof p.photo === 'string' ? [p.photo] : []),
        sizes: p.sizes,
        stock: p.stock
      });
    }
  }

  const batch = Array.from(groupedProducts.values());

  try {
    // 1. Check if table exists by doing a select limit 1
    const { error: testError } = await client.from(config.tableName).select('*').limit(1);
    if (testError) {
      throw new Error(`Table "${config.tableName}" does not seem to exist or permission denied. Error: ${testError.message}`);
    }

    let insertedCount = 0;
    const total = batch.length;

    // Clear existing products in the table to prevent duplicate key / unique constraint violations (e.g., products_pkey)
    try {
      await client.from(config.tableName).delete().gt('price', -1);
    } catch (deleteErr) {
      console.warn('Could not clear table before seeding:', deleteErr);
    }

    // Batch upload to Supabase in chunks of 50 to avoid any network size constraints
    const chunkSize = 50;
    for (let i = 0; i < batch.length; i += chunkSize) {
      const chunk = batch.slice(i, i + chunkSize);
      const { error } = await client
        .from(config.tableName)
        .insert(chunk);

      if (error) {
        // Fallback to single inserts if batch insert fails
        console.warn(`Batch insert failed for chunk ${i}, trying single inserts:`, error);
        for (let j = 0; j < chunk.length; j++) {
          const { error: singleError } = await client
            .from(config.tableName)
            .insert(chunk[j]);
          
          if (!singleError) {
            insertedCount++;
          }
        }
      } else {
        insertedCount += chunk.length;
      }
      if (onProgress) onProgress(insertedCount, total);
    }

    return { success: true, insertedCount };
  } catch (err: any) {
    console.error('Seeding error:', err);
    return { success: false, insertedCount: 0, error: err.message || 'Seeding failed' };
  }
}

export async function updateProduct(product: Product): Promise<{ success: boolean; error?: string }> {
  const config = getStoredConfig();

  const updateLocalStorage = () => {
    try {
      const editedStored = localStorage.getItem('lastochka_edited_products');
      let editedList: Product[] = editedStored ? JSON.parse(editedStored) : [];
      const idx = editedList.findIndex(p => (product.id && p.id === product.id) || (product.product_code && p.product_code === product.product_code));
      if (idx !== -1) {
        editedList[idx] = product;
      } else {
        editedList.push(product);
      }
      localStorage.setItem('lastochka_edited_products', JSON.stringify(editedList));

      const importedStored = localStorage.getItem('lastochka_imported_products');
      if (importedStored) {
        let imported: Product[] = JSON.parse(importedStored);
        const impIdx = imported.findIndex(p => (product.id && p.id === product.id) || (product.product_code && p.product_code === product.product_code));
        if (impIdx !== -1) {
          imported[impIdx] = product;
          localStorage.setItem('lastochka_imported_products', JSON.stringify(imported));
        }
      }

      const customStored = localStorage.getItem('lastochka_custom_products');
      if (customStored) {
        let custom: Product[] = JSON.parse(customStored);
        const custIdx = custom.findIndex(p => (product.id && p.id === product.id) || (product.product_code && p.product_code === product.product_code));
        if (custIdx !== -1) {
          custom[custIdx] = product;
          localStorage.setItem('lastochka_custom_products', JSON.stringify(custom));
        }
      }
    } catch (e) {
      console.error('Failed to update local product storage:', e);
    }
  };

  if (config.mode === 'demo') {
    updateLocalStorage();
    return { success: true };
  }

  try {
    const adminPassword = localStorage.getItem('lastochka_admin_password') || '';
    let token = undefined;
    const authClient = getAuthClient();
    if (authClient) {
      const { data: { session } } = await authClient.auth.getSession();
      if (session) token = session.access_token;
    }

    const res = await fetch('/api/products/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            product: product,
            isEdit: true,
            tableName: config.tableName,
            supabaseUrl: config.url,
            supabaseSecretKey: config.secretKey || config.anonKey,
            adminPassword,
            token
        })
    });
    const data = await res.json();
    if (!res.ok) {
        console.error('Backend update failed:', data.error);
        return { success: false, error: data.error };
    }
    
    // Update local caches only after successful database write
    updateLocalStorage();
    return { success: true };
  } catch (err: any) {
    console.error('Update product error:', err);
    return { success: false, error: err.message || err };
  }
}

/**
 * Test Supabase connection settings
 */
export async function testSupabaseConnection(url: string, key: string, tableName: string): Promise<{
  success: boolean;
  hasTable: boolean;
  rowCount: number;
  error?: string;
}> {
  try {
    const client = createClient(url, key, { auth: { persistSession: false } });
    
    // Attempt to select from table to check permissions and existence
    const { data, error } = await client
      .from(tableName)
      .select('*', { count: 'exact', head: true });

    if (error) {
      // Check if connection worked but table doesn't exist
      if (error.code === 'P0001' || error.message?.includes('does not exist')) {
        return { success: true, hasTable: false, rowCount: 0, error: `Connection successful, but table "${tableName}" does not exist.` };
      }
      return { success: false, hasTable: false, rowCount: 0, error: error.message };
    }

    // If we reach here, we connected successfully and table exists
    const { count, error: countError } = await client
      .from(tableName)
      .select('id', { count: 'exact', head: false })
      .limit(1);

    return { 
      success: true, 
      hasTable: true, 
      rowCount: data ? data.length : 0 
    };
  } catch (err: any) {
    return { success: false, hasTable: false, rowCount: 0, error: err.message || 'Network error connecting to Supabase.' };
  }
}

export async function deleteProduct(product: Product): Promise<{ success: boolean; error?: string }> {
  const config = getStoredConfig();

  const updateLocalStorage = () => {
    try {
      const deletedStored = localStorage.getItem('lastochka_deleted_products');
      let deletedList: (string | number)[] = deletedStored ? JSON.parse(deletedStored) : [];
      if (product.id && !deletedList.includes(product.id)) deletedList.push(product.id);
      if (product.product_code && !deletedList.includes(product.product_code)) deletedList.push(product.product_code);
      localStorage.setItem('lastochka_deleted_products', JSON.stringify(deletedList));

      const importedStored = localStorage.getItem('lastochka_imported_products');
      if (importedStored) {
        let parsed: Product[] = JSON.parse(importedStored);
        parsed = parsed.filter(p => p.id !== product.id && p.product_code !== product.product_code);
        localStorage.setItem('lastochka_imported_products', JSON.stringify(parsed));
      }

      const customStored = localStorage.getItem('lastochka_custom_products');
      if (customStored) {
        let custom: Product[] = JSON.parse(customStored);
        custom = custom.filter(p => p.id !== product.id && p.product_code !== product.product_code);
        localStorage.setItem('lastochka_custom_products', JSON.stringify(custom));
      }

      const editedStored = localStorage.getItem('lastochka_edited_products');
      if (editedStored) {
        let edited: Product[] = JSON.parse(editedStored);
        edited = edited.filter(p => p.id !== product.id && p.product_code !== product.product_code);
        localStorage.setItem('lastochka_edited_products', JSON.stringify(edited));
      }
    } catch (e) {
      console.error('Local deletion cache error:', e);
    }
  };

  if (config.mode === 'demo') {
    updateLocalStorage();
    return { success: true };
  }

  try {
    const adminPassword = localStorage.getItem('lastochka_admin_password') || '';
    let token = undefined;
    const authClient = getAuthClient();
    if (authClient) {
      const { data: { session } } = await authClient.auth.getSession();
      if (session) token = session.access_token;
    }

    const res = await fetch('/api/products/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            id: product.id,
            product_code: product.product_code,
            tableName: config.tableName,
            supabaseUrl: config.url,
            supabaseSecretKey: config.secretKey || config.anonKey,
            adminPassword,
            token
        })
    });
    const data = await res.json();
    if (!res.ok) {
        console.error('Backend delete failed:', data.error);
        return { success: false, error: data.error };
    }
    
    // Update local caches only after successful database write
    updateLocalStorage();
    return { success: true };
  } catch (err: any) {
    console.error('Delete product error:', err);
    return { success: false, error: err.message || err };
  }
}

export async function fetchSupabaseBlogPosts(): Promise<{
  posts: BlogPost[];
  source: 'supabase' | 'demo';
  error?: string;
}> {
  const config = getStoredConfig();
  
  if (config.mode === 'demo') {
    const localPostsStr = localStorage.getItem('lastochka_blog');
    const localPosts = localPostsStr ? JSON.parse(localPostsStr) : [];
    return { posts: localPosts, source: 'demo' };
  }

  const client = getSupabaseClient();
  if (!client) {
    const localPostsStr = localStorage.getItem('lastochka_blog');
    const localPosts = localPostsStr ? JSON.parse(localPostsStr) : [];
    return { 
      posts: localPosts, 
      source: 'demo', 
      error: 'Supabase client could not be initialized. Using local storage.' 
    };
  }

  try {
    const { data, error } = await client
      .from('blog_posts')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      throw error;
    }

    const posts: BlogPost[] = (data || []).map((item: any) => ({
      id: String(item.id),
      title: String(item.title || ''),
      content: String(item.content || ''),
      images: Array.isArray(item.images) ? item.images : [],
      blocks: Array.isArray(item.blocks) ? item.blocks : undefined,
      date: String(item.date || '')
    }));

    return { posts, source: 'supabase' };
  } catch (err: any) {
    console.warn('Supabase blog fetch failed, falling back to local storage:', err);
    const localPostsStr = localStorage.getItem('lastochka_blog');
    const localPosts = localPostsStr ? JSON.parse(localPostsStr) : [];
    return { 
      posts: localPosts, 
      source: 'demo', 
      error: err.message || 'Failed to fetch blog posts from Supabase.' 
    };
  }
}

export async function saveSupabaseBlogPost(post: BlogPost): Promise<{ success: boolean; error?: string }> {
  const config = getStoredConfig();

  if (config.mode === 'demo') {
    const localPostsStr = localStorage.getItem('lastochka_blog');
    let localPosts: BlogPost[] = localPostsStr ? JSON.parse(localPostsStr) : [];
    const idx = localPosts.findIndex(p => p.id === post.id);
    if (idx !== -1) {
      localPosts[idx] = post;
    } else {
      localPosts.push(post);
    }
    localStorage.setItem('lastochka_blog', JSON.stringify(localPosts));
    return { success: true };
  }

  try {
    const adminPassword = localStorage.getItem('lastochka_admin_password') || '';
    let token = undefined;
    const authClient = getAuthClient();
    if (authClient) {
      const { data: { session } } = await authClient.auth.getSession();
      if (session) token = session.access_token;
    }

    const res = await fetch('/api/blog/save', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        post,
        tableName: 'blog_posts',
        supabaseUrl: config.url,
        supabaseSecretKey: config.secretKey || config.anonKey,
        adminPassword,
        token
      })
    });

    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.error || 'Save failed' };
    }
    return { success: true };
  } catch (err: any) {
    console.error('Save blog post error:', err);
    return { success: false, error: err.message || 'Save failed' };
  }
}

export async function deleteSupabaseBlogPost(id: string): Promise<{ success: boolean; error?: string }> {
  const config = getStoredConfig();

  if (config.mode === 'demo') {
    const localPostsStr = localStorage.getItem('lastochka_blog');
    if (localPostsStr) {
      let localPosts: BlogPost[] = JSON.parse(localPostsStr);
      localPosts = localPosts.filter(p => p.id !== id);
      localStorage.setItem('lastochka_blog', JSON.stringify(localPosts));
    }
    return { success: true };
  }

  try {
    const adminPassword = localStorage.getItem('lastochka_admin_password') || '';
    let token = undefined;
    const authClient = getAuthClient();
    if (authClient) {
      const { data: { session } } = await authClient.auth.getSession();
      if (session) token = session.access_token;
    }

    const res = await fetch('/api/blog/delete', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        id,
        tableName: 'blog_posts',
        supabaseUrl: config.url,
        supabaseSecretKey: config.secretKey || config.anonKey,
        adminPassword,
        token
      })
    });

    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.error || 'Delete failed' };
    }
    return { success: true };
  } catch (err: any) {
    console.error('Delete blog post error:', err);
    return { success: false, error: err.message || 'Delete failed' };
  }
}

// Banners management helpers
export async function fetchBanners(): Promise<Banner[]> {
  const localStr = localStorage.getItem('lastochka_banners');
  if (localStr) {
    try {
      const parsed = JSON.parse(localStr);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    } catch (e) {
      console.error('Failed to parse lastochka_banners:', e);
    }
  }

  // Fallback to DEFAULT_BANNERS and save them initially
  localStorage.setItem('lastochka_banners', JSON.stringify(DEFAULT_BANNERS));
  return DEFAULT_BANNERS;
}

export function saveAllBanners(banners: Banner[]): void {
  localStorage.setItem('lastochka_banners', JSON.stringify(banners));
}


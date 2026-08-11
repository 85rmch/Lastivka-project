import { Product, CategoryKey } from '../types';

/**
 * Normalizes and categorizes a product based on its name and code
 */
export function getProductCategory(name: string, product_code: string): CategoryKey {
  const nameLower = (name || '').toLowerCase();
  const codeLower = (product_code || '').toLowerCase();

  if (nameLower.includes('гра ') || nameLower.includes('настільна')) {
    return 'games';
  }
  if (nameLower.includes('термо') || nameLower.includes('термобілиз') || nameLower.includes('термобілізни') || nameLower.includes('термобілізні')) {
    return 'thermals';
  }
  if (nameLower.includes('піжама') || nameLower.includes('піжамка') || nameLower.includes('дому') || nameLower.includes('халат') || nameLower.includes('костюм') || nameLower.includes('накидка')) {
    return 'pajamas';
  }
  if (
    nameLower.includes('бюстик') || 
    nameLower.includes('ліф') ||
    nameLower.includes('бюстгальтер') || 
    nameLower.includes('труси') || 
    nameLower.includes('трусики') || 
    nameLower.includes('еротичн') || 
    nameLower.includes('сексуальн') || 
    nameLower.includes('купальник') || 
    nameLower.includes('наручники') ||
    nameLower.includes('корсет') ||
    nameLower.includes('корсетний') ||
    nameLower.includes('бралет') ||
    nameLower.includes('боді') ||
    nameLower.includes('стрінги') ||
    nameLower.includes('кляп') ||
    nameLower.includes('маска') ||
    nameLower.includes('пестіси') ||
    nameLower.includes('флогер') ||
    nameLower.includes('затискачі') ||
    nameLower.includes('чокер') ||
    nameLower.includes('батіг') ||
    nameLower.includes('бразилії') ||
    nameLower.includes('боксери') ||
    nameLower.includes('плавки') ||
    nameLower.includes('бретель') ||
    nameLower.includes('кубок') ||
    nameLower.includes('вікторія') ||
    nameLower.includes('victoria') ||
    nameLower.includes('бандаж') ||
    nameLower.includes('пестисы') ||
    nameLower.includes('чулки') ||
    nameLower.includes('панчохи еротичні')
  ) {
    return 'underwear';
  }
  if (nameLower.includes('шкарпетки') || nameLower.includes('гольфи') || nameLower.includes('колготки') || nameLower.includes('панчохи') || nameLower.includes('чулки')) {
    return 'socks';
  }
  if (nameLower.includes('гамаші') || nameLower.includes('джегінси') || nameLower.includes('джеггінси') || nameLower.includes('штани') || nameLower.includes('лосини') || nameLower.includes('легінси') || nameLower.includes('джинси')) {
    return 'jeggings';
  }
  return 'other';
}

/**
 * Custom line parser for RFC 4180 compliant CSV content
 */
function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++; // skip next quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  return result;
}

/**
 * Parses raw CSV content into typed Product objects
 */
export function parseCSVProducts(csvText: string): Product[] {
  if (!csvText || !csvText.trim()) return [];
  
  const lines: string[] = [];
  let currentLine = '';
  let inQuotes = false;
  
  for (let i = 0; i < csvText.length; i++) {
    const char = csvText[i];
    if (char === '"') {
      inQuotes = !inQuotes;
      currentLine += char;
    } else if (char === '\n' && !inQuotes) {
      lines.push(currentLine.trim());
      currentLine = '';
    } else if (char === '\r') {
      // ignore CR
    } else {
      currentLine += char;
    }
  }
  if (currentLine) {
    lines.push(currentLine.trim());
  }
  
  if (lines.length === 0) return [];
  
  // Parse headers
  const headers = parseCSVLine(lines[0]).map(h => h.trim().toLowerCase());
  const results: Product[] = [];
  
  for (let k = 1; k < lines.length; k++) {
    const line = lines[k];
    if (!line) continue;
    const values = parseCSVLine(line);
    if (values.length < headers.length) continue;
    
    const obj: any = {};
    for (let i = 0; i < headers.length; i++) {
      let val: any = values[i] === undefined ? '' : values[i].trim();
      
      const key = headers[i];
      if (key === 'purchase_price' || key === 'price' || key === 'stock' || key === 'id') {
        obj[key] = parseFloat(val) || 0;
      } else if (key === 'photo') {
        try {
          const trimmedVal = val.trim();
          if (trimmedVal.startsWith('[') && trimmedVal.endsWith(']')) {
            const cleanJson = trimmedVal.replace(/""/g, '"');
            const parsed = JSON.parse(cleanJson);
            obj[key] = (Array.isArray(parsed) ? parsed : [parsed]).map((p: any) => 
              String(p).trim().replace(/^["'\\\[\s]+|["'\\\]\s]+$/g, '')
            ).filter(Boolean);
          } else if (trimmedVal.includes(',')) {
            // It contains commas, split by comma and clean each item
            obj[key] = trimmedVal.split(',').map((s: any) => 
              s.trim().replace(/^["'\\\[\s]+|["'\\\]\s]+$/g, '')
            ).filter(Boolean);
          } else if (trimmedVal) {
            obj[key] = [trimmedVal.replace(/^["'\\\[\s]+|["'\\\]\s]+$/g, '')];
          } else {
            obj[key] = [];
          }
        } catch (e) {
          obj[key] = [];
        }
      } else {
        obj[key] = val;
      }
    }
    
    if (obj.name && obj.price) {
      const product_code = obj.product_code || String(obj.id);
      const name = obj.name;
      results.push({
        id: Number(obj.id || Math.floor(Math.random() * 100000)),
        product_code: String(product_code),
        name: String(name),
        vendor_code: String(obj.vendor_code || ''),
        color: String(obj.color || ''),
        purchase_price: Number(obj.purchase_price || 0),
        cup_type: obj.cup_type ? String(obj.cup_type) : undefined,
        price: Number(obj.price || 0),
        photo: Array.isArray(obj.photo) ? obj.photo : [],
        sizes: String(obj.sizes || ''),
        stock: Number(obj.stock || 1),
        category: getProductCategory(name, product_code)
      });
    }
  }
  
  return results;
}


export interface LocalizedString {
  en: string;
  ar: string;
}

export type ProductType = 'food' | 'beverage' | 'dessert' | 'other';

export interface ModifierOption {
  id: string;
  name: LocalizedString;
  priceDelta: number; // Extra cost (e.g., +50 for extra cheese)
  isDefault?: boolean;
}

export interface ModifierGroup {
  id: string;
  name: LocalizedString;
  description?: LocalizedString; // e.g. "Choose 1", "Optional"
  minSelection: number; // 0 for optional, 1 for required
  maxSelection: number; // 1 for radio, >1 for checkbox
  options: ModifierOption[];
}

export interface MenuItem {
  id: string;
  name: LocalizedString;
  description: LocalizedString;
  basePrice: number;
  image: string;
  category: string;
  type: ProductType;
  calories?: number;
  isPopular?: boolean;
  modifierGroups: ModifierGroup[]; // The key to customization
}

export interface CartItem {
  cartId: string; // Unique ID for this specific instance in cart
  menuItem: MenuItem;
  quantity: number;
  selectedModifiers: Record<string, string[]>; // groupId -> array of optionIds
  totalPrice: number;
  notes?: string;
}

export interface Shop {
  id: string;
  name: LocalizedString;
  description: LocalizedString;
  coverImage: string;
  logoImage: string;
  galleryImages: string[];
  locationLat: number;
  locationLon: number;
  city: string;
  phone: string;
  website: string;
  isVerified: boolean;
  rating: number;
  reviewCount: number;
  currency: LocalizedString;
}

export type Language = 'en' | 'ar';
export type Theme = 'light' | 'dark';

export interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  translations: Record<string, Record<Language, string>>;
}

export interface CartContextType {
  cart: CartItem[];
  addToCart: (item: MenuItem, quantity: number, modifiers: Record<string, string[]>, notes: string) => void;
  removeFromCart: (cartId: string) => void;
  updateQuantity: (cartId: string, delta: number) => void;
  cartTotal: number;
  itemCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
}

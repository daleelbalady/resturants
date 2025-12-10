
export interface LocalizedString {
  en: string;
  ar: string;
}

export type ProductType = 'food' | 'beverage' | 'dessert' | 'other';

export interface ModifierOption {
  id: string;
  name: LocalizedString;
  priceDelta: number;
  isDefault?: boolean;
}

export interface ModifierGroup {
  id: string;
  name: LocalizedString;
  description?: LocalizedString;
  minSelection: number;
  maxSelection: number;
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
  modifierGroups: ModifierGroup[];
}

export interface CartItem {
  cartId: string;
  menuItem: MenuItem;
  quantity: number;
  selectedModifiers: Record<string, string[]>;
  totalPrice: number;
  notes?: string;
}

export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';
export type OrderMethod = 'dine_in' | 'delivery';
export type DeliveryProvider = 'restaurant' | 'daleel_balady';

export interface Table {
  id: string;
  shopId?: string;
  label: string; // e.g., "T-1" or "Family Booth"
  capacity: number;
  isOccupied: boolean;
}

export interface Location {
  lat: number;
  lng: number;
}

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;

  // Logic Flow
  method: OrderMethod;

  // If Dine In
  tableId?: string;
  guests?: number;

  // If Delivery
  deliveryProvider?: DeliveryProvider;
  deliveryAddress?: string;
  deliveryLocation?: Location; // Coordinates from map

  items: CartItem[];
  totalAmount: number;
  status: OrderStatus;
  createdAt: string;
}

export interface Shop {
  id: string;
  name: string;
  name_ar?: string;
  description: string;
  description_ar?: string;
  logoImage: string;
  coverImage: string;
  phone: string;
  email?: string;
  website?: string;
  city?: string;
  locationLat?: number;
  locationLon?: number;
  galleryImages?: string[];
  rating: number;
  reviewCount: number;
  isVerified: boolean;
  userId: string; // Owner ID for fetching menu
  ownerId?: string; // Alias
  category?: { id: string; slug: string; name: string };
  subCategory?: { id: string; slug: string; name: string };
}

export type Language = 'en' | 'ar';
export type Theme = 'light' | 'dark';

export interface AppContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: Theme;
  setTheme: (theme: Theme) => void;
  translations: Record<string, Record<Language, string>>;
  // Mock Backend State for Tables
  tables: Table[];
  addTable: (table: Table) => void;
  removeTable: (id: string) => void;
  updateTableStatus: (id: string, isOccupied: boolean) => void;
}

export interface CartContextType {
  cart: CartItem[];
  addToCart: (menuItem: MenuItem, quantity: number, selectedModifiers: Record<string, string[]>, notes: string) => void;
  removeFromCart: (cartId: string) => void;
  updateQuantity: (cartId: string, delta: number) => void;
  clearCart: () => void;
  submitOrder: (
    customerName: string,
    customerPhone: string,
    method: OrderMethod,
    tableId?: string,
    guests?: number,
    deliveryAddress?: string,
    deliveryLocation?: { lat: number; lng: number }
  ) => Promise<any>;
  cartTotal: number;
  itemCount: number;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
}

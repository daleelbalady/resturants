
import { MenuItem, Shop, Order, Table } from './types';

export const TRANSLATIONS = {
  menu: { en: "Menu", ar: "القائمة" },
  search: { en: "Search menu...", ar: "بحث في القائمة..." },
  addToOrder: { en: "Add to Order", ar: "إضافة للطلب" },
  updateOrder: { en: "Update Item", ar: "تحديث العنصر" },
  total: { en: "Total", ar: "الإجمالي" },
  required: { en: "Required", ar: "مطلوب" },
  optional: { en: "Optional", ar: "اختياري" },
  choose: { en: "Choose", ar: "اختر" },
  max: { en: "Max", ar: "حد أقصى" },
  specialInstructions: { en: "Special Instructions", ar: "تعليمات خاصة" },
  specialInstructionsPlaceholder: { en: "e.g. No onions, extra napkins...", ar: "مثال: بدون بصل، مناديل إضافية..." },
  cartEmpty: { en: "Your receipt is empty", ar: "الفاتورة فارغة" },
  cartEmptySub: { en: "Add some delicious items to get started", ar: "أضف بعض الأصناف اللذيذة للبدء" },
  checkout: { en: "Confirm Order", ar: "تأكيد الطلب" },
  itemAdded: { en: "Item added to receipt", ar: "تمت الإضافة للفاتورة" },
  currency: { en: "EGP", ar: "ج.م" },
  food: { en: "Food", ar: "مأكولات" },
  beverages: { en: "Beverages", ar: "مشروبات" },
  dessert: { en: "Dessert", ar: "حلويات" },
  all: { en: "All", ar: "الكل" },
  gallery: { en: "Gallery", ar: "المعرض" },
  viewMap: { en: "View Map", ar: "الخريطة" },
  verified: { en: "Verified", ar: "موثق" },
  items: { en: "Items", ar: "عناصر" },
  customizations: { en: "Customizations", ar: "إضافات وتعديلات" },
  from: { en: "From", ar: "يبدأ من" },
  
  // Checkout Wizard
  selectMethod: { en: "How would you like your order?", ar: "كيف تفضل استلام طلبك؟" },
  dineIn: { en: "Dine In", ar: "تناول في المطعم" },
  delivery: { en: "Delivery", ar: "توصيل للمنزل" },
  selectTable: { en: "Select a Table", ar: "اختر طاولة" },
  capacity: { en: "Seats", ar: "كراسي" },
  occupied: { en: "Occupied", ar: "مشغول" },
  available: { en: "Available", ar: "متاح" },
  guestCount: { en: "Number of Guests", ar: "عدد الضيوف" },
  deliveryInfo: { en: "Delivery Details", ar: "تفاصيل التوصيل" },
  pinLocation: { en: "Pin Location on Map", ar: "حدد موقعك على الخريطة" },
  dragPin: { en: "Drag or click to set delivery point", ar: "اسحب الدبوس لتحديد نقطة التوصيل" },
  contactInfo: { en: "Contact Info", ar: "بيانات التواصل" },
  fullName: { en: "Full Name", ar: "الاسم بالكامل" },
  phoneNumber: { en: "Phone Number", ar: "رقم الهاتف" },
  addressDetails: { en: "Address Details (Building, Floor, Apt)", ar: "العنوان بالتفصيل (مبنى، دور، شقة)" },
  deliveryProvider: { en: "Delivery Method", ar: "طريقة التوصيل" },
  restDelivery: { en: "Restaurant Delivery", ar: "توصيل المطعم" },
  daleelDelivery: { en: "Daleel Balady Delivery", ar: "توصيل دليل بلدي" },
  reviewOrder: { en: "Review Order", ar: "مراجعة الطلب" },
  placeOrder: { en: "Place Order", ar: "إرسال الطلب" },
  back: { en: "Back", ar: "رجوع" },
  next: { en: "Next", ar: "التالي" },
  
  // Dashboard General
  dashboard: { en: "Dashboard", ar: "لوحة التحكم" },
  providerDashboard: { en: "Provider Dashboard", ar: "لوحة التاجر" },
  overview: { en: "Overview", ar: "نظرة عامة" },
  orders: { en: "Orders", ar: "الطلبات" },
  menuBuilder: { en: "Menu Builder", ar: "بناء القائمة" },
  apiDocs: { en: "API & Schema", ar: "الربط البرمجي" },
  settings: { en: "Settings", ar: "الإعدادات" },
  tables: { en: "Table Management", ar: "إدارة الطاولات" },
  addTable: { en: "Add Table", ar: "إضافة طاولة" },
  
  // Stats
  revenue: { en: "Total Revenue", ar: "إجمالي الإيرادات" },
  activeOrders: { en: "Active Orders", ar: "الطلبات النشطة" },
  totalOrders: { en: "Total Orders", ar: "كل الطلبات" },
  recentActivity: { en: "Recent Activity", ar: "النشاط الأخير" },
  
  // Orders
  orderId: { en: "Order #", ar: "طلب رقم " },
  table: { en: "Table", ar: "طاولة" },
  takeaway: { en: "Takeaway", ar: "تيك أواي" },
  cancelOrder: { en: "Cancel", ar: "إلغاء" },
  advanceStatus: { en: "Advance Status", ar: "تغيير الحالة" },
  
  // Product Form
  newProduct: { en: "New Product", ar: "منتج جديد" },
  editProduct: { en: "Edit Product", ar: "تعديل منتج" },
  addProduct: { en: "Add Product", ar: "إضافة منتج" },
  saveProduct: { en: "Save Product", ar: "حفظ المنتج" },
  cancel: { en: "Cancel", ar: "إلغاء" },
  productNameEn: { en: "Name (EN)", ar: "الاسم (EN)" },
  productNameAr: { en: "Name (AR)", ar: "الاسم (AR)" },
  imageURL: { en: "Image URL", ar: "رابط الصورة" },
  price: { en: "Price (EGP)", ar: "السعر (ج.م)" },
  category: { en: "Category", ar: "القسم" },
  
  // Modifiers
  modifiersAddons: { en: "Modifiers & Add-ons", ar: "الإضافات والخيارات" },
  addGroup: { en: "Add Group", ar: "إضافة مجموعة" },
  groupNamePlaceholder: { en: "Group Name (e.g. Size)", ar: "اسم المجموعة (مثال: الحجم)" },
  min: { en: "Min", ar: "أدنى" },
  addOption: { en: "Add Option", ar: "إضافة خيار" },
  optionNameEn: { en: "Option (EN)", ar: "الخيار (EN)" },
  
  // Docs
  devApi: { en: "Developer API & Schema", ar: "واجهة المطورين وقاعدة البيانات" },
  devDesc: { en: "Use the following specifications to build the backend for this dashboard.", ar: "استخدم المواصفات التالية لبناء النظام الخلفي للوحة التحكم." },
  routes: { en: "REST API Routes", ar: "مسارات API" },
  schema: { en: "Database Schema (Recommended)", ar: "مخطط قاعدة البيانات (مقترح)" },
};

export const MOCK_SHOP: Shop = {
  id: "shop-1",
  name: { en: "The Grand Bistro", ar: "جراند بيسترو" },
  description: { en: "A culinary journey featuring artisan coffees and premium grills.", ar: "رحلة طهي مميزة تجمع بين القهوة الحرفية والمشويات الفاخرة." },
  coverImage: "https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=1600&q=80",
  logoImage: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=400&q=80",
  galleryImages: [
    "https://images.unsplash.com/photo-1554679665-f584865ed792?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?auto=format&fit=crop&w=800&q=80",
    "https://images.unsplash.com/photo-1550966871-3ed3c622171d?auto=format&fit=crop&w=800&q=80"
  ],
  locationLat: 30.0444,
  locationLon: 31.2357,
  city: "Cairo",
  phone: "+20 123 456 789",
  website: "grandbistro.com",
  isVerified: true,
  rating: 4.9,
  reviewCount: 1240,
  currency: { en: "EGP", ar: "ج.م" }
};

export const MOCK_TABLES: Table[] = [
    { id: 't1', label: 'T-1', capacity: 2, isOccupied: false },
    { id: 't2', label: 'T-2', capacity: 2, isOccupied: true },
    { id: 't3', label: 'T-3', capacity: 4, isOccupied: false },
    { id: 't4', label: 'T-4', capacity: 4, isOccupied: false },
    { id: 't5', label: 'Family-1', capacity: 6, isOccupied: false },
    { id: 't6', label: 'VIP-1', capacity: 8, isOccupied: true },
];

export const MOCK_MENU: MenuItem[] = [
  // ... (Existing items remain same, just ensuring file structure)
  {
    id: "m1",
    name: { en: "Ribeye Steak", ar: "ستيك ريب آي" },
    description: { en: "Premium grass-fed beef grilled to your liking.", ar: "لحم بقري فاخر مشوي حسب رغبتك." },
    basePrice: 650,
    image: "https://images.unsplash.com/photo-1600891964092-4316c288032e?auto=format&fit=crop&w=800&q=80",
    category: "Grill",
    type: "food",
    calories: 850,
    isPopular: true,
    modifierGroups: [
      {
        id: "g_weight",
        name: { en: "Choose Size", ar: "اختر الحجم" },
        minSelection: 1,
        maxSelection: 1,
        options: [
          { id: "opt_300g", name: { en: "Standard (300g)", ar: "قياسي (٣٠٠ جم)" }, priceDelta: 0, isDefault: true },
          { id: "opt_500g", name: { en: "King Cut (500g)", ar: "كينج (٥٠٠ جم)" }, priceDelta: 250 }
        ]
      },
      {
        id: "g_doneness",
        name: { en: "Cooking Level", ar: "درجة التسوية" },
        minSelection: 1,
        maxSelection: 1,
        options: [
          { id: "opt_rare", name: { en: "Rare", ar: "رير" }, priceDelta: 0 },
          { id: "opt_med", name: { en: "Medium", ar: "ميديم" }, priceDelta: 0, isDefault: true },
          { id: "opt_well", name: { en: "Well Done", ar: "ويل دن" }, priceDelta: 0 }
        ]
      },
      {
        id: "g_sides",
        name: { en: "Choose 2 Sides", ar: "اختر ٢ طبق جانبي" },
        description: { en: "Comes with the meal", ar: "تأتي مع الوجبة" },
        minSelection: 2,
        maxSelection: 2,
        options: [
          { id: "side_fries", name: { en: "French Fries", ar: "بطاطس محمرة" }, priceDelta: 0 },
          { id: "side_mash", name: { en: "Mashed Potatoes", ar: "بطاطس مهروسة" }, priceDelta: 0 },
          { id: "side_rice", name: { en: "Basmati Rice", ar: "أرز بسمتي" }, priceDelta: 0 },
          { id: "side_veg", name: { en: "Grilled Vegetables", ar: "خضار مشوي" }, priceDelta: 0 }
        ]
      },
      {
        id: "g_sauce",
        name: { en: "Add Sauce", ar: "أضف صوص" },
        minSelection: 0,
        maxSelection: 3,
        options: [
          { id: "sc_mushroom", name: { en: "Mushroom Sauce", ar: "صوص المشروم" }, priceDelta: 40 },
          { id: "sc_pepper", name: { en: "Pepper Sauce", ar: "صوص الفلفل" }, priceDelta: 40 }
        ]
      }
    ]
  },
  {
    id: "m2",
    name: { en: "Artisan Latte", ar: "لاتيه محضر يدوياً" },
    description: { en: "Rich espresso with steamed milk and a thin layer of foam.", ar: "إسبريسو غني مع حليب مبخر وطبقة رقيقة من الرغوة." },
    basePrice: 85,
    image: "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=800&q=80",
    category: "Coffee",
    type: "beverage",
    calories: 180,
    modifierGroups: [
      {
        id: "g_milk",
        name: { en: "Milk Choice", ar: "نوع الحليب" },
        minSelection: 1,
        maxSelection: 1,
        options: [
          { id: "milk_full", name: { en: "Full Cream", ar: "كامل الدسم" }, priceDelta: 0, isDefault: true },
          { id: "milk_skim", name: { en: "Skimmed", ar: "خالي الدسم" }, priceDelta: 0 },
          { id: "milk_oat", name: { en: "Oat Milk", ar: "حليب الشوفان" }, priceDelta: 35 },
          { id: "milk_almond", name: { en: "Almond Milk", ar: "حليب اللوز" }, priceDelta: 35 }
        ]
      },
      {
        id: "g_size",
        name: { en: "Size", ar: "الحجم" },
        minSelection: 1,
        maxSelection: 1,
        options: [
          { id: "sz_reg", name: { en: "Regular", ar: "عادي" }, priceDelta: 0, isDefault: true },
          { id: "sz_lrg", name: { en: "Large", ar: "كبير" }, priceDelta: 20 }
        ]
      },
      {
        id: "g_extras",
        name: { en: "Extras", ar: "إضافات" },
        minSelection: 0,
        maxSelection: 5,
        options: [
          { id: "ex_shot", name: { en: "Extra Shot", ar: "شوت إضافي" }, priceDelta: 25 },
          { id: "ex_vanilla", name: { en: "Vanilla Syrup", ar: "سيرب فانيليا" }, priceDelta: 15 },
          { id: "ex_caramel", name: { en: "Caramel Drizzle", ar: "صوص كراميل" }, priceDelta: 10 }
        ]
      }
    ]
  },
  {
    id: "m3",
    name: { en: "Caesar Salad", ar: "سلطة سيزر" },
    description: { en: "Crisp romaine lettuce, parmesan cheese, croutons, and caesar dressing.", ar: "خس روماني مقرمش، جبنة بارميزان، خبز محمص، وصوص سيزر." },
    basePrice: 190,
    image: "https://images.unsplash.com/photo-1550304943-4f24f54ddde9?auto=format&fit=crop&w=800&q=80",
    category: "Starters",
    type: "food",
    modifierGroups: [
        {
        id: "g_protein",
        name: { en: "Add Protein", ar: "أضف بروتين" },
        minSelection: 0,
        maxSelection: 2,
        options: [
          { id: "prot_chicken", name: { en: "Grilled Chicken", ar: "دجاج مشوي" }, priceDelta: 60 },
          { id: "prot_shrimp", name: { en: "Shrimp", ar: "جمبري" }, priceDelta: 90 }
        ]
      }
    ]
  },
  {
    id: "m4",
    name: { en: "Cheesecake", ar: "تشيز كيك" },
    description: { en: "Classic NY style cheesecake.", ar: "تشيز كيك على طريقة نيويورك." },
    basePrice: 120,
    image: "https://images.unsplash.com/photo-1524351199678-941a58a3df50?auto=format&fit=crop&w=800&q=80",
    category: "Dessert",
    type: "dessert",
    modifierGroups: [
        {
            id: "g_topping",
            name: {en: "Topping", ar: "الإضافات"},
            minSelection: 1,
            maxSelection: 1,
            options: [
                { id: "top_berry", name: {en: "Strawberry", ar: "فراولة"}, priceDelta: 0 },
                { id: "top_blue", name: {en: "Blueberry", ar: "توت أزرق"}, priceDelta: 0 },
                { id: "top_choc", name: {en: "Chocolate", ar: "شوكولاتة"}, priceDelta: 0 },
            ]
        }
    ]
  }
];

export const MOCK_ORDERS: Order[] = [
    {
        id: "ORD-1024",
        customerName: "Ahmed Ali",
        customerPhone: "0100000001",
        method: "dine_in",
        tableId: "t1",
        guests: 2,
        items: [
            {
                cartId: "c1",
                menuItem: MOCK_MENU[0],
                quantity: 1,
                selectedModifiers: {"g_weight": ["opt_300g"], "g_doneness": ["opt_med"], "g_sides": ["side_fries", "side_veg"]},
                totalPrice: 650
            }
        ],
        totalAmount: 650,
        status: "pending",
        createdAt: "2024-05-10T14:30:00"
    },
    {
        id: "ORD-1023",
        customerName: "Sarah Smith",
        customerPhone: "0100000002",
        method: "delivery",
        deliveryProvider: "restaurant",
        deliveryAddress: "123 Nile St, Zamalek, Apt 4",
        deliveryLocation: { lat: 30.0444, lng: 31.2357 },
        items: [
            {
                cartId: "c2",
                menuItem: MOCK_MENU[1],
                quantity: 2,
                selectedModifiers: {"g_milk": ["milk_oat"], "g_size": ["sz_lrg"]},
                totalPrice: 280
            }
        ],
        totalAmount: 280,
        status: "preparing",
        createdAt: "2024-05-10T14:25:00"
    },
    {
        id: "ORD-1022",
        customerName: "Mike Johnson",
        customerPhone: "0100000003",
        method: "dine_in",
        items: [
             {
                cartId: "c3",
                menuItem: MOCK_MENU[3],
                quantity: 1,
                selectedModifiers: {"g_topping": ["top_berry"]},
                totalPrice: 120
            }
        ],
        totalAmount: 120,
        status: "ready",
        createdAt: "2024-05-10T14:15:00"
    }
];

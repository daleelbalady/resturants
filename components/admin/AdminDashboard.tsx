import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { QRCodeCanvas } from 'qrcode.react';
import { API_ENDPOINTS, api } from '../../api';
import {
    LayoutDashboard,
    UtensilsCrossed,
    ClipboardList,
    Settings,
    TrendingUp,
    Users,
    DollarSign,
    ShoppingBag,
    Plus,
    Edit2,
    Trash2,
    CheckCircle,
    Clock,
    XCircle,
    Code,
    ArrowRight,
    ChevronDown,
    ChevronUp,
    Save,
    MapPin,
    Truck,
    Upload,
    Image as ImageIcon
} from 'lucide-react';
import { useConfig } from '../../contexts/ConfigContext';
import { useProvider } from '../../contexts/ProviderContext';
import { Layout } from '../Layout';
import { MOCK_MENU, MOCK_ORDERS } from '../../constants';
import { MenuItem, Order, OrderStatus, ModifierGroup, Table } from '../../types';

// --- SUB-COMPONENTS ---

const MotionDiv = motion.div as any;

const StatCard = ({ title, value, icon: Icon, color }: any) => (
    <MotionDiv
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800"
    >
        <div className="flex items-center justify-between">
            <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
                <h3 className="text-2xl font-black text-gray-900 dark:text-white mt-1">{value}</h3>
            </div>
            <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
                <Icon className={`w-6 h-6 ${color.replace('bg-', 'text-')}`} />
            </div>
        </div>
    </MotionDiv>
);

const OrderBadge = ({ status }: { status: OrderStatus }) => {
    const styles = {
        pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400",
        preparing: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400",
        ready: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400",
        delivered: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
        cancelled: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400",
    };
    return (
        <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${styles[status]}`}>
            {status}
        </span>
    );
};

// --- MENU FORM COMPONENT (Complex) ---
const MenuForm = ({ initialData, onSave, onCancel, existingCategories = [] }: { initialData?: MenuItem, onSave: (data: MenuItem) => void, onCancel: () => void, existingCategories?: string[] }) => {
    const { translations, language } = useConfig();
    const t = translations;
    const [uploading, setUploading] = useState(false);

    const [formData, setFormData] = useState<Partial<MenuItem>>(initialData || {
        name: { en: '', ar: '' },
        description: { en: '', ar: '' },
        basePrice: 0,
        category: '',
        modifierGroups: [],
        image: ''
    });

    const addModifierGroup = () => {
        const newGroup: ModifierGroup = {
            id: Date.now().toString(),
            name: { en: 'New Group', ar: 'مجموعة جديدة' },
            minSelection: 0,
            maxSelection: 1,
            options: []
        };
        setFormData(prev => ({ ...prev, modifierGroups: [...(prev.modifierGroups || []), newGroup] }));
    };

    const addOptionToGroup = (groupId: string) => {
        setFormData(prev => ({
            ...prev,
            modifierGroups: prev.modifierGroups?.map(g => {
                if (g.id === groupId) {
                    return {
                        ...g,
                        options: [...g.options, { id: Date.now().toString(), name: { en: 'Option', ar: 'خيار' }, priceDelta: 0 }]
                    }
                }
                return g;
            })
        }));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        try {
            setUploading(true);
            const token = localStorage.getItem('daleel-token');
            const result = await api.upload(API_ENDPOINTS.uploadImage(), file, token || undefined);
            if (result.success) {
                setFormData(prev => ({ ...prev, image: result.data.url }));
            }
        } catch (error) {
            console.error('Upload failed', error);
            alert('Upload failed');
        } finally {
            setUploading(false);
        }
    };

    return (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl shadow-lg border border-gray-100 dark:border-zinc-800 overflow-hidden">
            <div className="p-6 border-b border-gray-100 dark:border-zinc-800 flex justify-between items-center bg-gray-50 dark:bg-zinc-800/50">
                <h3 className="font-bold text-lg">{initialData ? t.editProduct[language] : t.newProduct[language]}</h3>
                <button onClick={onCancel} className="p-2 hover:bg-gray-200 dark:hover:bg-zinc-700 rounded-full"><XCircle className="w-5 h-5" /></button>
            </div>

            <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-gray-500">{t.productNameEn[language]}</label>
                        <input className="w-full p-2 rounded bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700"
                            value={formData.name?.en}
                            onChange={e => setFormData({ ...formData, name: { ...formData.name!, en: e.target.value } })} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-gray-500">{t.productNameAr[language]}</label>
                        <input className="w-full p-2 rounded bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 text-right"
                            value={formData.name?.ar}
                            onChange={e => setFormData({ ...formData, name: { ...formData.name!, ar: e.target.value } })} />
                    </div>

                    <div className="col-span-2 space-y-2">
                        <label className="text-xs font-bold uppercase text-gray-500">{t.imageURL[language]}</label>
                        <div className="flex gap-4 items-start">
                            {formData.image && (
                                <img src={formData.image} alt="Preview" className="w-20 h-20 object-cover rounded-lg border border-gray-200 dark:border-zinc-700" />
                            )}
                            <div className="flex-1">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        className="flex-1 p-2 rounded bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700"
                                        value={formData.image}
                                        onChange={e => setFormData({ ...formData, image: e.target.value })}
                                        placeholder="https://..."
                                    />
                                    <label className="cursor-pointer bg-gray-900 dark:bg-white text-white dark:text-black px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:opacity-90 transition-opacity">
                                        {uploading ? <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current"></div> : <Upload className="w-4 h-4" />}
                                        <span className="hidden sm:inline">Upload</span>
                                        <input type="file" className="hidden" accept="image/*" onChange={handleImageUpload} />
                                    </label>
                                </div>
                                <p className="text-xs text-gray-400 mt-1">Upload an image or paste a URL</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-gray-500">{t.price[language]}</label>
                        <input type="number" className="w-full p-2 rounded bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700"
                            value={formData.basePrice}
                            onChange={e => setFormData({ ...formData, basePrice: parseFloat(e.target.value) })} />
                    </div>
                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase text-gray-500">{t.category[language]}</label>
                        <input
                            list="categories"
                            className="w-full p-2 rounded bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700"
                            value={formData.category}
                            onChange={e => setFormData({ ...formData, category: e.target.value })}
                        />
                        <datalist id="categories">
                            {existingCategories.map(cat => <option key={cat} value={cat} />)}
                        </datalist>
                    </div>
                </div>

                {/* Modifiers Builder */}
                <div className="border-t border-gray-100 dark:border-zinc-800 pt-6">
                    <div className="flex justify-between items-center mb-4">
                        <h4 className="font-bold text-gray-900 dark:text-white flex items-center gap-2">
                            <UtensilsCrossed className="w-4 h-4" /> {t.modifiersAddons[language]}
                        </h4>
                        <button onClick={addModifierGroup} className="text-xs bg-gray-900 dark:bg-white text-white dark:text-black px-3 py-1.5 rounded-lg font-bold">
                            + {t.addGroup[language]}
                        </button>
                    </div>

                    <div className="space-y-4">
                        {formData.modifierGroups?.map((group, idx) => (
                            <div key={group.id} className="bg-gray-50 dark:bg-zinc-800/50 p-4 rounded-xl border border-gray-200 dark:border-zinc-700">
                                <div className="flex gap-4 mb-3">
                                    <input className="flex-1 p-2 bg-white dark:bg-zinc-800 rounded border border-gray-200 dark:border-zinc-700"
                                        placeholder={t.groupNamePlaceholder[language]}
                                        value={group.name.en}
                                        onChange={(e) => {
                                            const newGroups = [...formData.modifierGroups!];
                                            newGroups[idx].name.en = e.target.value;
                                            setFormData({ ...formData, modifierGroups: newGroups });
                                        }}
                                    />
                                    <div className="flex items-center gap-2 text-xs">
                                        <span>{t.min[language]}:</span>
                                        <input type="number" className="w-12 p-1 rounded text-center" value={group.minSelection}
                                            onChange={(e) => {
                                                const newGroups = [...formData.modifierGroups!];
                                                newGroups[idx].minSelection = parseInt(e.target.value);
                                                setFormData({ ...formData, modifierGroups: newGroups });
                                            }}
                                        />
                                        <span>{t.max[language]}:</span>
                                        <input type="number" className="w-12 p-1 rounded text-center" value={group.maxSelection}
                                            onChange={(e) => {
                                                const newGroups = [...formData.modifierGroups!];
                                                newGroups[idx].maxSelection = parseInt(e.target.value);
                                                setFormData({ ...formData, modifierGroups: newGroups });
                                            }}
                                        />
                                    </div>
                                    <button className="text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 p-2 rounded"><Trash2 className="w-4 h-4" /></button>
                                </div>

                                <div className="space-y-2 pl-4 border-l-2 border-gray-200 dark:border-zinc-700">
                                    {group.options.map((opt, oIdx) => (
                                        <div key={opt.id} className="flex gap-2 items-center">
                                            <input className="flex-1 p-1.5 text-sm rounded border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900"
                                                value={opt.name.en}
                                                placeholder={t.optionNameEn[language]}
                                                onChange={(e) => {
                                                    const newGroups = [...formData.modifierGroups!];
                                                    newGroups[idx].options[oIdx].name.en = e.target.value;
                                                    setFormData({ ...formData, modifierGroups: newGroups });
                                                }}
                                            />
                                            <div className="flex items-center gap-1">
                                                <span className="text-xs text-gray-500">+</span>
                                                <input type="number" className="w-16 p-1.5 text-sm rounded border border-gray-200 dark:border-zinc-700 bg-white dark:bg-zinc-900"
                                                    value={opt.priceDelta}
                                                    onChange={(e) => {
                                                        const newGroups = [...formData.modifierGroups!];
                                                        newGroups[idx].options[oIdx].priceDelta = parseFloat(e.target.value);
                                                        setFormData({ ...formData, modifierGroups: newGroups });
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    ))}
                                    <button onClick={() => addOptionToGroup(group.id)} className="text-xs text-gold-600 dark:text-gold-500 font-bold hover:underline mt-2">
                                        + {t.addOption[language]}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="p-6 border-t border-gray-100 dark:border-zinc-800 bg-gray-50 dark:bg-zinc-900 flex justify-end gap-3">
                <button onClick={onCancel} className="px-4 py-2 rounded-lg text-gray-600 dark:text-gray-400 font-medium hover:bg-gray-200 dark:hover:bg-zinc-800 transition-colors">
                    {t.cancel[language]}
                </button>
                <button onClick={() => onSave(formData as MenuItem)} className="px-6 py-2 rounded-lg bg-gold-500 text-white font-bold shadow-lg shadow-gold-500/20 hover:bg-gold-600 transition-colors flex items-center gap-2">
                    <Save className="w-4 h-4" /> {t.saveProduct[language]}
                </button>
            </div>
        </div>
    )
}

// --- SYSTEM DOCS COMPONENT ---
const SystemDocs = () => {
    const { translations, language } = useConfig();
    const t = translations;

    return (
        <div className="space-y-6">
            <div className="bg-blue-50 dark:bg-blue-900/20 p-6 rounded-2xl border border-blue-100 dark:border-blue-900/50">
                <h3 className="text-lg font-bold text-blue-800 dark:text-blue-300 mb-2 flex items-center gap-2">
                    <Code className="w-5 h-5" /> {t.devApi[language]}
                </h3>
                <p className="text-blue-600 dark:text-blue-400 mb-4">
                    {t.devDesc[language]}
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800">
                    <h4 className="font-bold text-gray-900 dark:text-white mb-4">{t.routes[language]}</h4>
                    <div className="space-y-2 font-mono text-sm">
                        <div className="flex gap-4 border-b border-gray-100 dark:border-zinc-800 pb-2">
                            <span className="text-green-600 dark:text-green-400 font-bold w-16">GET</span>
                            <span className="text-gray-600 dark:text-gray-400">/api/shop</span>
                        </div>
                        <div className="flex gap-4 border-b border-gray-100 dark:border-zinc-800 pb-2">
                            <span className="text-orange-600 dark:text-orange-400 font-bold w-16">PUT</span>
                            <span className="text-gray-600 dark:text-gray-400">/api/shop</span>
                        </div>
                        <div className="flex gap-4 border-b border-gray-100 dark:border-zinc-800 pb-2">
                            <span className="text-green-600 dark:text-green-400 font-bold w-16">GET</span>
                            <span className="text-gray-600 dark:text-gray-400">/api/menu</span>
                        </div>
                        <div className="flex gap-4 border-b border-gray-100 dark:border-zinc-800 pb-2">
                            <span className="text-blue-600 dark:text-blue-400 font-bold w-16">POST</span>
                            <span className="text-gray-600 dark:text-gray-400">/api/menu</span>
                        </div>
                        <div className="flex gap-4 border-b border-gray-100 dark:border-zinc-800 pb-2">
                            <span className="text-red-600 dark:text-red-400 font-bold w-16">DELETE</span>
                            <span className="text-gray-600 dark:text-gray-400">/api/menu/:id</span>
                        </div>
                        <div className="flex gap-4 border-b border-gray-100 dark:border-zinc-800 pb-2">
                            <span className="text-green-600 dark:text-green-400 font-bold w-16">GET</span>
                            <span className="text-gray-600 dark:text-gray-400">/api/orders</span>
                        </div>
                        <div className="flex gap-4 border-b border-gray-100 dark:border-zinc-800 pb-2">
                            <span className="text-orange-600 dark:text-orange-400 font-bold w-16">PUT</span>
                            <span className="text-gray-600 dark:text-gray-400">/api/orders/:id/status</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl shadow-sm border border-gray-100 dark:border-zinc-800">
                    <h4 className="font-bold text-gray-900 dark:text-white mb-4">{t.schema[language]}</h4>
                    <pre className="text-xs font-mono bg-gray-50 dark:bg-black p-4 rounded-xl overflow-x-auto text-gray-600 dark:text-gray-400" dir="ltr">
                        {`// Collection: shops
{
  _id: ObjectId,
  name: { en: String, ar: String },
  ownerId: String,
  settings: Object
}

// Collection: menu_items
{
  _id: ObjectId,
  shopId: ObjectId,
  name: { en: String, ar: String },
  basePrice: Number,
  modifiers: Array<ModifierGroup>
}

// Collection: orders
{
  _id: ObjectId,
  shopId: ObjectId,
  method: 'dine_in' | 'delivery',
  tableId?: String,
  deliveryProvider?: 'restaurant' | 'daleel_balady',
  deliveryLocation?: { lat: Number, lng: Number },
  items: Array<CartItem>,
  total: Number,
  status: Enum['pending', 'ready'...]
}`}
                    </pre>
                </div>
            </div>
        </div>
    );
};


// --- SETTINGS TAB ---
const SettingsTab = () => {
    const { translations, language, tables, addTable, removeTable, updateTableStatus } = useConfig();
    const t = translations;
    const [newTableLabel, setNewTableLabel] = useState('');
    const [newTableCap, setNewTableCap] = useState(2);

    const handleAddTable = () => {
        if (!newTableLabel) return;
        addTable({
            id: Date.now().toString(),
            label: newTableLabel,
            capacity: newTableCap,
            isOccupied: false
        });
        setNewTableLabel('');
    };

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800">
                <h3 className="text-xl font-bold mb-4">{t.tables[language]}</h3>

                <div className="flex gap-4 mb-6">
                    <input
                        value={newTableLabel}
                        onChange={e => setNewTableLabel(e.target.value)}
                        placeholder="Table Label (e.g. T-10)"
                        className="p-2 border border-gray-200 dark:border-zinc-700 rounded-lg bg-gray-50 dark:bg-zinc-800"
                    />
                    <input
                        type="number"
                        value={newTableCap}
                        onChange={e => setNewTableCap(parseInt(e.target.value))}
                        className="w-20 p-2 border border-gray-200 dark:border-zinc-700 rounded-lg bg-gray-50 dark:bg-zinc-800"
                    />
                    <button
                        onClick={handleAddTable}
                        className="bg-gold-500 text-white px-4 py-2 rounded-lg font-bold"
                    >
                        {t.addTable[language]}
                    </button>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {tables.map(table => (
                        <div key={table.id} className="p-4 rounded-xl border border-gray-200 dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800/50">
                            <div className="flex justify-between items-start mb-2">
                                <span className="font-bold">{table.label}</span>
                                <button onClick={() => removeTable(table.id)} className="text-red-500 hover:bg-red-100 p-1 rounded">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="text-sm text-gray-500 mb-2">{table.capacity} {t.capacity[language]}</div>
                            <button
                                onClick={() => updateTableStatus(table.id, !table.isOccupied)}
                                className={`w-full text-xs py-1 rounded font-bold ${table.isOccupied ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}
                            >
                                {table.isOccupied ? t.occupied[language] : t.available[language]}
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};


// --- MAIN DASHBOARD LAYOUT ---

import { useOrders, useMenuManagement, useMenu, useTables } from '../../hooks/useApi';
import { ShopManagementTab } from './ShopManagementTab';

export const AdminDashboard = () => {
    const { translations, language } = useConfig();
    const { userId, token, isAuthenticated, user } = useProvider();
    const t = translations;
    const [activeTab, setActiveTab] = useState<'overview' | 'orders' | 'menu' | 'shop' | 'settings' | 'docs'>('overview');

    // API Hooks - use userId from context
    const { orders, loading: ordersLoading, fetchOrders, updateOrderStatus } = useOrders();
    const { menuItems, loading: menuLoading, refetch: refetchMenu } = useMenu(userId || undefined);
    const { tables, loading: tablesLoading, refetch: refetchTables } = useTables(userId || '');
    const { createMenuItem, updateMenuItem, deleteMenuItem } = useMenuManagement();

    const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    // Order Filters
    const [filterStatus, setFilterStatus] = useState<'all' | OrderStatus>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [dateFilter, setDateFilter] = useState('');

    // Fetch orders on mount
    React.useEffect(() => {
        if (token && isAuthenticated) {
            fetchOrders(token);
        }
    }, [token, isAuthenticated]);

    // Show loading or unauthorized state
    if (!isAuthenticated) {
        const debugInfo = {
            hasToken: !!token,
            hasUser: !!user,
            userId: userId,
            userIdFromUser: user?.id,
        };

        const correctUrl = user?.id ? `/provider/${user.id}` : null;
        const isWrongUrl = userId && user?.id && userId !== user.id;

        return (
            <Layout isAdmin={true}>
                <div className="flex items-center justify-center h-screen p-4">
                    <div className="text-center max-w-lg">
                        <h2 className="text-2xl font-bold mb-4">Please Log In</h2>

                        {!token && (
                            <>
                                <p className="text-gray-600 dark:text-gray-400 mb-4">
                                    Authentication token is missing. Please log in using the button in the navbar.
                                </p>

                                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
                                    <p className="text-sm text-blue-800 dark:text-blue-200 font-medium">
                                        💡 Tip: Use the "Login" dropdown in the navbar above to sign in.
                                    </p>
                                </div>
                            </>
                        )}

                        {token && isWrongUrl && correctUrl && (
                            <>
                                <p className="text-gray-600 dark:text-gray-400 mb-4">
                                    You're logged in, but accessing the wrong provider dashboard.
                                </p>

                                <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-lg p-4 mb-4">
                                    <p className="text-sm text-orange-800 dark:text-orange-200 font-medium mb-2">
                                        ⚠️ URL Mismatch
                                    </p>
                                    <p className="text-xs text-orange-700 dark:text-orange-300">
                                        Please use your correct provider URL:
                                    </p>
                                    <a
                                        href={correctUrl}
                                        className="block mt-2 p-2 bg-orange-100 dark:bg-orange-900 rounded text-orange-900 dark:text-orange-100 font-mono text-xs break-all hover:bg-orange-200 dark:hover:bg-orange-800 transition-colors"
                                    >
                                        {window.location.origin}{correctUrl}
                                    </a>
                                </div>
                            </>
                        )}

                        {/* Debug Info */}
                        <details className="mt-6">
                            <summary className="cursor-pointer text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200">
                                Show Debug Info
                            </summary>
                            <div className="mt-2 p-4 bg-gray-100 dark:bg-zinc-800 rounded-lg text-left text-xs">
                                <p className="font-bold mb-2">Debug Info:</p>
                                <pre className="text-gray-700 dark:text-gray-300 overflow-x-auto">
                                    {JSON.stringify(debugInfo, null, 2)}
                                </pre>
                                <p className="mt-2 text-gray-600 dark:text-gray-400">
                                    Check browser console for more details
                                </p>
                            </div>
                        </details>
                    </div>
                </div>
            </Layout>
        );
    }

    const stats = {
        revenue: orders.reduce((acc, curr) => acc + curr.totalAmount, 0),
        activeOrders: orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length,
        totalOrders: orders.length
    };

    // ... (imports)

    // ...

    const navItems = [
        { id: 'overview', icon: LayoutDashboard, label: t.overview[language] },
        { id: 'orders', icon: ClipboardList, label: t.orders[language] },
        { id: 'menu', icon: UtensilsCrossed, label: t.menuBuilder[language] },
        { id: 'tables', icon: Users, label: t.tables[language] },
        { id: 'shop', icon: ShoppingBag, label: 'Shop Profile' },
        { id: 'settings', icon: Settings, label: t.settings[language] },
        { id: 'docs', icon: Code, label: t.apiDocs[language] },
    ];

    const handleSaveProduct = async (product: MenuItem) => {
        if (!token) return;

        try {
            if (editingItem) {
                await updateMenuItem(product.id, product, token);
                setEditingItem(null);
            } else {
                // Remove ID for creation as backend assigns it
                const { id, ...newProduct } = product;
                await createMenuItem(newProduct, token);
                setIsCreating(false);
            }
            refetchMenu();
        } catch (error) {
            console.error("Failed to save product", error);
            alert("Failed to save product");
        }
    };

    const handleDeleteProduct = async (id: string) => {
        if (!token || !window.confirm("Are you sure?")) return;
        try {
            await deleteMenuItem(id, token);
            refetchMenu();
        } catch (error) {
            console.error("Failed to delete product", error);
            alert("Failed to delete product");
        }
    };

    const handleCreateTable = async (data: { label: string, capacity: number }) => {
        if (!token) return;
        try {
            await api.post(API_ENDPOINTS.createTable(), { ...data, shopId: user?.id || '' }, token);
            refetchTables();
        } catch (error) {
            console.error("Failed to create table", error);
            alert("Failed to create table");
        }
    };

    const handleDeleteTable = async (id: string) => {
        if (!token || !window.confirm("Are you sure?")) return;
        try {
            await api.delete(API_ENDPOINTS.deleteTable(id), token);
            refetchTables();
        } catch (error) {
            console.error("Failed to delete table", error);
            alert("Failed to delete table");
        }
    };

    const handleUpdateOrderStatus = async (orderId: string, status: string) => {
        if (!token) return;
        try {
            await updateOrderStatus(orderId, status, token);
        } catch (error) {
            console.error("Failed to update order status", error);
        }
    };

    const getTableLabel = (id: string) => tables.find(t => t.id === id)?.label || 'Unknown';

    return (
        <Layout isAdmin={true}>
            <div className="min-h-screen bg-gray-50 dark:bg-zinc-950 flex font-sans pb-20 lg:pb-0 pt-[72px]">

                {/* Sidebar (Desktop) */}
                <aside className={`w-64 bg-white dark:bg-zinc-900 border-r dark:border-l-0 border-gray-200 dark:border-zinc-800 hidden lg:flex flex-col fixed inset-y-0 top-[72px] ${language === 'ar' ? 'right-0 border-l' : 'left-0 border-r'}`}>
                    <div className="p-6">
                        <div className="flex items-center gap-2 mb-8 px-2">
                            <div className="w-8 h-8 bg-gray-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center text-gray-900 dark:text-white">
                                <ShoppingBag className="w-5 h-5" />
                            </div>
                            <span className="font-bold text-gray-900 dark:text-white">
                                {t.providerDashboard[language]}
                            </span>
                        </div>

                        <nav className="space-y-1">
                            {navItems.map((item) => (
                                <button
                                    key={item.id}
                                    onClick={() => setActiveTab(item.id as any)}
                                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === item.id
                                        ? 'bg-gray-100 dark:bg-zinc-800 text-gray-900 dark:text-white'
                                        : 'text-gray-500 hover:bg-gray-50 dark:hover:bg-zinc-800/50'
                                        }`}
                                >
                                    <item.icon className="w-5 h-5" />
                                    {item.label}
                                </button>
                            ))}
                        </nav>
                    </div>
                </aside>

                {/* Mobile Navigation (Bottom Bar) */}
                <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-800 z-50 flex justify-around items-center px-2 pb-safe">
                    {navItems.map((item) => (
                        <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id as any)}
                            className={`flex flex-col items-center gap-1 p-3 rounded-xl transition-all ${activeTab === item.id
                                ? 'text-gold-500'
                                : 'text-gray-400 dark:text-gray-500'
                                }`}
                        >
                            <item.icon className="w-6 h-6" />
                            <span className="text-[10px] font-medium">{item.label}</span>
                        </button>
                    ))}
                </div>

                {/* Main Content */}
                <main className={`flex-1 p-4 sm:p-8 ${language === 'ar' ? 'lg:mr-64' : 'lg:ml-64'}`}>
                    <header className="flex justify-between items-center mb-8">
                        <h1 className="text-2xl font-black text-gray-900 dark:text-white capitalize">
                            {navItems.find(i => i.id === activeTab)?.label}
                        </h1>
                    </header>

                    {/* --- OVERVIEW TAB --- */}
                    {activeTab === 'overview' && (
                        <div className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <StatCard title={t.revenue[language]} value={`${stats.revenue.toLocaleString()} ${t.currency[language]}`} icon={DollarSign} color="bg-green-500" />
                                <StatCard title={t.activeOrders[language]} value={stats.activeOrders} icon={Clock} color="bg-orange-500" />
                                <StatCard title={t.totalOrders[language]} value={stats.totalOrders} icon={ShoppingBag} color="bg-blue-500" />
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-gray-100 dark:border-zinc-800">
                                    <h3 className="font-bold text-lg mb-4">{t.recentActivity[language]}</h3>
                                    <div className="space-y-4">
                                        {ordersLoading ? <p>Loading...</p> : orders.slice(0, 3).map(order => (
                                            <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-zinc-800/50 rounded-xl">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-10 h-10 rounded-full bg-white dark:bg-zinc-700 flex items-center justify-center font-bold text-gray-500">
                                                        {order.method === 'dine_in' ? 'TB' : 'DL'}
                                                    </div>
                                                    <div>
                                                        <p className="font-bold text-gray-900 dark:text-white">{t.orderId[language]}{order.id.split('-')[1] || order.id.slice(0, 4)}</p>
                                                        <p className="text-sm text-gray-500">{order.customerName} • {order.items.length} {t.items[language]}</p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold">{order.totalAmount} {t.currency[language]}</p>
                                                    <OrderBadge status={order.status} />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-gray-100 dark:border-zinc-800">
                                    <h3 className="font-bold text-lg mb-4 flex items-center gap-2"><TrendingUp className="w-5 h-5 text-gold-500" /> Popular Items</h3>
                                    <div className="space-y-4">
                                        {React.useMemo(() => {
                                            const itemCounts: Record<string, number> = {};
                                            orders.forEach(order => {
                                                order.items.forEach(item => {
                                                    itemCounts[item.menuItem.id] = (itemCounts[item.menuItem.id] || 0) + item.quantity;
                                                });
                                            });
                                            return Object.entries(itemCounts)
                                                .sort(([, a], [, b]) => b - a)
                                                .slice(0, 5)
                                                .map(([id, count]) => {
                                                    const menuItem = menuItems.find(m => m.id === id);
                                                    return menuItem ? { ...menuItem, count } : null;
                                                })
                                                .filter(Boolean);
                                        }, [orders, menuItems]).map((item: any) => (
                                            <div key={item.id} className="flex items-center justify-between p-3 hover:bg-gray-50 dark:hover:bg-zinc-800/50 rounded-xl transition-colors">
                                                <div className="flex items-center gap-3">
                                                    <img src={item.image} className="w-10 h-10 rounded-lg object-cover" alt="" />
                                                    <div>
                                                        <p className="font-bold text-sm text-gray-900 dark:text-white">{item.name[language]}</p>
                                                        <p className="text-xs text-gray-500">{item.count} orders</p>
                                                    </div>
                                                </div>
                                                <span className="font-bold text-sm">{item.basePrice} {t.currency[language]}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* --- ORDERS TAB --- */}
                    {activeTab === 'orders' && (
                        <div className="space-y-6">
                            {/* Filters & Search */}
                            <div className="bg-white dark:bg-zinc-900 p-4 rounded-2xl border border-gray-100 dark:border-zinc-800 flex flex-col md:flex-row gap-4 justify-between items-center">
                                <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
                                    {['all', 'pending', 'preparing', 'ready', 'delivered', 'cancelled'].map(status => (
                                        <button
                                            key={status}
                                            onClick={() => setFilterStatus(status as any)}
                                            className={`px-4 py-2 rounded-xl text-sm font-bold capitalize whitespace-nowrap transition-colors ${filterStatus === status
                                                ? 'bg-gray-900 dark:bg-white text-white dark:text-black'
                                                : 'bg-gray-50 dark:bg-zinc-800 text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-700'
                                                }`}
                                        >
                                            {status}
                                        </button>
                                    ))}
                                </div>
                                <div className="flex gap-2 w-full md:w-auto">
                                    <input
                                        type="text"
                                        placeholder="Search orders..."
                                        value={searchQuery}
                                        onChange={e => setSearchQuery(e.target.value)}
                                        className="flex-1 md:w-64 p-2 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700"
                                    />
                                    <input
                                        type="date"
                                        value={dateFilter}
                                        onChange={e => setDateFilter(e.target.value)}
                                        className="p-2 rounded-xl bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-6">
                                {ordersLoading ? <p>Loading orders...</p> : orders
                                    .filter(order => {
                                        const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
                                        const matchesSearch = order.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
                                            order.id.toLowerCase().includes(searchQuery.toLowerCase());
                                        const matchesDate = !dateFilter || new Date(order.createdAt).toISOString().startsWith(dateFilter);
                                        return matchesStatus && matchesSearch && matchesDate;
                                    })
                                    .map(order => (
                                        <MotionDiv
                                            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                                            key={order.id}
                                            className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-gray-100 dark:border-zinc-800 flex flex-col sm:flex-row gap-6 justify-between"
                                        >
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">#{order.id.split('-')[1] || order.id.slice(0, 4)}</h3>
                                                    <OrderBadge status={order.status} />
                                                    <span className="text-sm text-gray-400">{new Date(order.createdAt).toLocaleTimeString()}</span>
                                                </div>
                                                <div className="flex items-start gap-4 mb-4">
                                                    <div className="p-2 bg-gray-50 dark:bg-zinc-800 rounded-lg">
                                                        {order.method === 'dine_in' ? <Users className="w-5 h-5 text-blue-500" /> : <Truck className="w-5 h-5 text-orange-500" />}
                                                    </div>
                                                    <div>
                                                        <p className="text-gray-900 dark:text-white font-bold">{order.customerName}</p>
                                                        <p className="text-sm text-gray-500">{order.customerPhone}</p>
                                                        {order.method === 'dine_in' ? (
                                                            <p className="text-sm text-blue-500 mt-1 font-medium">
                                                                {t.table[language]}: {getTableLabel(order.tableId || '')} • {order.guests} {t.guestCount[language]}
                                                            </p>
                                                        ) : (
                                                            <div className="text-sm text-orange-500 mt-1">
                                                                <p className="font-medium">{order.deliveryProvider === 'restaurant' ? t.restDelivery[language] : t.daleelDelivery[language]}</p>
                                                                <p className="text-xs text-gray-400 mt-1 truncate max-w-xs">{order.deliveryAddress}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="space-y-2 pl-4 border-l-2 border-gray-100 dark:border-zinc-800">
                                                    {order.items.map((item, idx) => (
                                                        <div key={idx} className="flex items-center gap-2 text-sm">
                                                            <span className="font-bold w-6 h-6 flex items-center justify-center bg-gray-100 dark:bg-zinc-800 rounded text-xs">{item.quantity}x</span>
                                                            <span>{item.menuItem.name[language]}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="flex flex-col justify-between items-end min-w-[200px]">
                                                <p className="text-2xl font-black text-gray-900 dark:text-white">{order.totalAmount} {t.currency[language]}</p>
                                                <div className="flex gap-2 mt-4">
                                                    {order.status !== 'cancelled' && order.status !== 'delivered' && (
                                                        <button
                                                            onClick={() => handleUpdateOrderStatus(order.id, 'cancelled')}
                                                            className="px-4 py-2 bg-gray-100 dark:bg-zinc-800 rounded-lg font-bold text-xs hover:bg-gray-200 dark:hover:bg-zinc-700"
                                                        >
                                                            {t.cancelOrder[language]}
                                                        </button>
                                                    )}
                                                    {order.status === 'pending' && (
                                                        <button
                                                            onClick={() => handleUpdateOrderStatus(order.id, 'preparing')}
                                                            className="px-4 py-2 bg-blue-500 text-white rounded-lg font-bold text-xs hover:bg-blue-600"
                                                        >
                                                            Accept
                                                        </button>
                                                    )}
                                                    {order.status === 'preparing' && (
                                                        <button
                                                            onClick={() => handleUpdateOrderStatus(order.id, 'ready')}
                                                            className="px-4 py-2 bg-orange-500 text-white rounded-lg font-bold text-xs hover:bg-orange-600"
                                                        >
                                                            Ready
                                                        </button>
                                                    )}
                                                    {order.status === 'ready' && (
                                                        <button
                                                            onClick={() => handleUpdateOrderStatus(order.id, 'delivered')}
                                                            className="px-4 py-2 bg-green-500 text-white rounded-lg font-bold text-xs hover:bg-green-600"
                                                        >
                                                            Complete
                                                        </button>
                                                    )}
                                                </div>
                                            </div>
                                        </MotionDiv>
                                    ))}
                            </div>
                        </div>
                    )}

                    {/* --- MENU TAB --- */}
                    {activeTab === 'menu' && (
                        <div className="space-y-6">
                            {!isCreating && !editingItem ? (
                                <>
                                    <div className="flex justify-end">
                                        <button
                                            onClick={() => setIsCreating(true)}
                                            className="bg-gray-900 dark:bg-white text-white dark:text-black px-4 py-2 rounded-xl font-bold flex items-center gap-2 shadow-lg"
                                        >
                                            <Plus className="w-5 h-5" /> {t.addProduct[language]}
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                                        {menuItems.map(item => (
                                            <div key={item.id} className="bg-white dark:bg-zinc-900 rounded-2xl overflow-hidden border border-gray-100 dark:border-zinc-800 shadow-sm group">
                                                <div className="h-48 relative overflow-hidden">
                                                    <img src={item.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="" />
                                                    <div className="absolute top-2 right-2 flex gap-2">
                                                        <button onClick={() => setEditingItem(item)} className="p-2 bg-white/90 dark:bg-black/80 rounded-full hover:scale-110 transition-transform"><Edit2 className="w-4 h-4 text-blue-500" /></button>
                                                        <button onClick={() => handleDeleteProduct(item.id)} className="p-2 bg-white/90 dark:bg-black/80 rounded-full hover:scale-110 transition-transform"><Trash2 className="w-4 h-4 text-red-500" /></button>
                                                    </div>
                                                </div>
                                                <div className="p-4">
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h4 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-1">{item.name[language]}</h4>
                                                        <span className="font-bold text-gold-600 dark:text-gold-500">{item.basePrice}</span>
                                                    </div>
                                                    <p className="text-sm text-gray-500 line-clamp-2">{item.description[language]}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            ) : (
                                <MenuForm
                                    initialData={editingItem || undefined}
                                    onSave={handleSaveProduct}
                                    onCancel={() => { setIsCreating(false); setEditingItem(null); }}
                                    existingCategories={Array.from(new Set(menuItems.map(i => i.category))).filter(Boolean) as string[]}
                                />
                            )}
                        </div>
                    )}

                    {/* --- TABLES TAB --- */}
                    {activeTab === 'tables' && (
                        <div className="space-y-6">
                            <div className="flex justify-between items-center bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{t.tables[language]}</h3>
                                    <p className="text-gray-500 text-sm">Manage your restaurant tables and QR codes</p>
                                </div>
                                <button
                                    onClick={() => {
                                        const label = prompt("Enter table label (e.g., T-1):");
                                        const capacity = prompt("Enter capacity:");
                                        if (label && capacity) {
                                            handleCreateTable({ label, capacity: parseInt(capacity) });
                                        }
                                    }}
                                    className="bg-gray-900 dark:bg-white text-white dark:text-black px-4 py-2 rounded-xl font-bold flex items-center gap-2 shadow-lg"
                                >
                                    <Plus className="w-5 h-5" /> Add Table
                                </button>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {tables.map(table => (
                                    <div key={table.id} className="bg-white dark:bg-zinc-900 rounded-2xl p-6 border border-gray-100 dark:border-zinc-800 flex flex-col items-center text-center relative group">
                                        <button
                                            onClick={() => handleDeleteTable(table.id)}
                                            className="absolute top-2 right-2 p-2 text-red-500 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>

                                        <div className="bg-white p-2 rounded-xl border border-gray-100 shadow-sm mb-4">
                                            <QRCodeCanvas
                                                value={`https://menu.daleelbalady.com/menu/${user?.id}?table=${table.id}`}
                                                size={120}
                                                level={"H"}
                                            />
                                        </div>

                                        <h4 className="font-bold text-xl text-gray-900 dark:text-white mb-1">{table.label}</h4>
                                        <p className="text-sm text-gray-500 mb-4">{t.capacity[language]}: {table.capacity} {t.guestCount[language]}</p>

                                        <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${table.status === 'available' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                                            }`}>
                                            {table.status}
                                        </div>

                                        <button
                                            onClick={() => window.open(`https://menu.daleelbalady.com/menu/${user?.id}?table=${table.id}`, '_blank')}
                                            className="mt-4 text-blue-500 text-xs font-bold hover:underline"
                                        >
                                            Test Link
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* --- SHOP MANAGEMENT TAB --- */}
                    {activeTab === 'shop' && <ShopManagementTab />}

                    {/* --- SETTINGS TAB --- */}
                    {activeTab === 'settings' && <SettingsTab />}

                    {/* --- DOCS TAB --- */}
                    {activeTab === 'docs' && <SystemDocs />}

                </main>
            </div>
        </Layout>
    );
};
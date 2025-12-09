import React, { useState, useEffect } from 'react';
import { Save, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import { useProvider } from '../../contexts/ProviderContext';
import { API_ENDPOINTS, api } from '../../api';

interface ShopData {
    id: string;
    name: { en: string; ar: string };
    description: { en: string; ar: string };
    ownerId: string;
    phone?: string;
    email?: string;
    address?: string;
    operatingHours?: {
        [key: string]: { open: string; close: string; closed: boolean };
    };
    deliveryAvailable?: boolean;
    acceptsPayments?: string[];
}

export const ShopManagementTab: React.FC = () => {
    const { userId, token } = useProvider();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const [shopData, setShopData] = useState<Partial<ShopData>>({
        name: { en: '', ar: '' },
        description: { en: '', ar: '' },
        phone: '',
        email: '',
        address: '',
        deliveryAvailable: false,
        acceptsPayments: ['cash'],
        operatingHours: {
            monday: { open: '09:00', close: '22:00', closed: false },
            tuesday: { open: '09:00', close: '22:00', closed: false },
            wednesday: { open: '09:00', close: '22:00', closed: false },
            thursday: { open: '09:00', close: '22:00', closed: false },
            friday: { open: '09:00', close: '22:00', closed: false },
            saturday: { open: '09:00', close: '22:00', closed: false },
            sunday: { open: '09:00', close: '22:00', closed: true },
        },
    });

    useEffect(() => {
        fetchShopData();
    }, [userId]);

    const fetchShopData = async () => {
        if (!userId) return;

        try {
            setLoading(true);
            setLoading(true);
            // Use token for authenticated /api/shop/my endpoint
            const data = await api.get(API_ENDPOINTS.getShop(userId), token);
            setShopData(data.shop); // Backend returns { shop: ... } wrapper
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to load shop data');
            console.error('Error fetching shop:', err);
        } finally {
            setLoading(false);
        }
    };

    const handleSave = async () => {
        if (!userId || !token) return;

        try {
            setSaving(true);
            setError(null);
            setSuccess(false);

            await api.put(API_ENDPOINTS.updateShop(userId), shopData, token);

            setSuccess(true);
            setTimeout(() => setSuccess(false), 3000);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save shop data');
            console.error('Error saving shop:', err);
        } finally {
            setSaving(false);
        }
    };

    const updateField = (field: string, value: any) => {
        setShopData(prev => ({ ...prev, [field]: value }));
    };

    const updateNestedField = (parent: string, field: string, value: any) => {
        setShopData(prev => ({
            ...prev,
            [parent]: {
                ...(prev[parent as keyof ShopData] as any),
                [field]: value,
            },
        }));
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            </div>
        );
    }

    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

    return (
        <div className="space-y-6">
            {/* Error/Success Messages */}
            {error && (
                <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 p-4 rounded-lg">
                    <AlertCircle className="w-5 h-5" />
                    <span>{error}</span>
                </div>
            )}

            {success && (
                <div className="flex items-center gap-2 bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 p-4 rounded-lg">
                    <CheckCircle className="w-5 h-5" />
                    <span>Shop information saved successfully!</span>
                </div>
            )}

            {/* Basic Information */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800">
                <h3 className="text-xl font-bold mb-4">Basic Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Shop Name (English)
                        </label>
                        <input
                            type="text"
                            value={shopData.name?.en || ''}
                            onChange={(e) => updateNestedField('name', 'en', e.target.value)}
                            className="w-full p-3 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                            placeholder="Enter shop name in English"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Shop Name (Arabic)
                        </label>
                        <input
                            type="text"
                            value={shopData.name?.ar || ''}
                            onChange={(e) => updateNestedField('name', 'ar', e.target.value)}
                            className="w-full p-3 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-right"
                            placeholder="أدخل اسم المتجر بالعربية"
                            dir="rtl"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Description (English)
                        </label>
                        <textarea
                            value={shopData.description?.en || ''}
                            onChange={(e) => updateNestedField('description', 'en', e.target.value)}
                            rows={3}
                            className="w-full p-3 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                            placeholder="Describe your shop..."
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Description (Arabic)
                        </label>
                        <textarea
                            value={shopData.description?.ar || ''}
                            onChange={(e) => updateNestedField('description', 'ar', e.target.value)}
                            rows={3}
                            className="w-full p-3 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none text-right"
                            placeholder="وصف المتجر..."
                            dir="rtl"
                        />
                    </div>
                </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800">
                <h3 className="text-xl font-bold mb-4">Contact Information</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            value={shopData.phone || ''}
                            onChange={(e) => updateField('phone', e.target.value)}
                            className="w-full p-3 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                            placeholder="+20 123 456 7890"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Email
                        </label>
                        <input
                            type="email"
                            value={shopData.email || ''}
                            onChange={(e) => updateField('email', e.target.value)}
                            className="w-full p-3 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                            placeholder="shop@example.com"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                            Address
                        </label>
                        <input
                            type="text"
                            value={shopData.address || ''}
                            onChange={(e) => updateField('address', e.target.value)}
                            className="w-full p-3 bg-gray-50 dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                            placeholder="123 Main Street, Cairo"
                        />
                    </div>
                </div>
            </div>

            {/* Operating Hours */}
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-100 dark:border-zinc-800">
                <h3 className="text-xl font-bold mb-4">Operating Hours</h3>

                <div className="space-y-3">
                    {days.map((day) => (
                        <div key={day} className="flex items-center gap-4 p-3 bg-gray-50 dark:bg-zinc-800/50 rounded-lg">
                            <div className="w-28">
                                <span className="font-medium capitalize">{day}</span>
                            </div>

                            <label className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    checked={!shopData.operatingHours?.[day]?.closed}
                                    onChange={(e) => {
                                        const hours = { ...shopData.operatingHours };
                                        if (!hours[day]) hours[day] = { open: '09:00', close: '22:00', closed: false };
                                        hours[day].closed = !e.target.checked;
                                        updateField('operatingHours', hours);
                                    }}
                                    className="w-4 h-4 text-orange-500 rounded"
                                />
                                <span className="text-sm">Open</span>
                            </label>

                            {!shopData.operatingHours?.[day]?.closed && (
                                <>
                                    <input
                                        type="time"
                                        value={shopData.operatingHours?.[day]?.open || '09:00'}
                                        onChange={(e) => {
                                            const hours = { ...shopData.operatingHours };
                                            if (!hours[day]) hours[day] = { open: '09:00', close: '22:00', closed: false };
                                            hours[day].open = e.target.value;
                                            updateField('operatingHours', hours);
                                        }}
                                        className="p-2 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded"
                                    />
                                    <span>to</span>
                                    <input
                                        type="time"
                                        value={shopData.operatingHours?.[day]?.close || '22:00'}
                                        onChange={(e) => {
                                            const hours = { ...shopData.operatingHours };
                                            if (!hours[day]) hours[day] = { open: '09:00', close: '22:00', closed: false };
                                            hours[day].close = e.target.value;
                                            updateField('operatingHours', hours);
                                        }}
                                        className="p-2 bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 rounded"
                                    />
                                </>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end">
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="px-6 py-3 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                >
                    {saving ? (
                        <>
                            <Loader2 className="w-5 h-5 animate-spin" />
                            Saving...
                        </>
                    ) : (
                        <>
                            <Save className="w-5 h-5" />
                            Save Changes
                        </>
                    )}
                </button>
            </div>
        </div>
    );
};

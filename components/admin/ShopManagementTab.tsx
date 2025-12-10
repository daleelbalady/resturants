import React from 'react';
import { ExternalLink, Store, MapPin, Phone, Mail } from 'lucide-react';
import { useProvider } from '../../contexts/ProviderContext';

export const ShopManagementTab: React.FC = () => {
    const { selectedShop } = useProvider();

    if (!selectedShop) {
        return (
            <div className="flex items-center justify-center p-12 text-gray-500">
                No shop selected.
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Redirect Banner */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-900/50 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                    <h3 className="text-lg font-bold text-blue-800 dark:text-blue-300 mb-2">
                        Manage Shop Details
                    </h3>
                    <p className="text-blue-600 dark:text-blue-400">
                        Shop details editing is managed on the main Daleel Balady dashboard.
                    </p>
                </div>
                <a
                    href="https://www.daleelbalady.com/dashboard/listings"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg transition-colors whitespace-nowrap"
                >
                    Edit on Daleel Balady
                    <ExternalLink className="w-4 h-4" />
                </a>
            </div>

            {/* Shop Overview */}
            <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-gray-100 dark:border-zinc-800 overflow-hidden">
                {/* Cover Image */}
                <div className="h-48 bg-gray-100 dark:bg-zinc-800 relative">
                    {selectedShop.coverImage ? (
                        <img
                            src={selectedShop.coverImage}
                            alt="Cover"
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                            <Store className="w-12 h-12" />
                        </div>
                    )}

                    {/* Logo */}
                    <div className="absolute -bottom-10 left-8">
                        <div className="w-24 h-24 rounded-xl border-4 border-white dark:border-zinc-900 bg-white dark:bg-zinc-800 overflow-hidden shadow-lg">
                            {selectedShop.logoImage ? (
                                <img
                                    src={selectedShop.logoImage}
                                    alt="Logo"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-400">
                                    <Store className="w-8 h-8" />
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="pt-14 p-8">
                    <h2 className="text-2xl font-bold mb-2">{selectedShop.name || 'Unnamed Shop'}</h2>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">{selectedShop.description || 'No description available.'}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Contact Info */}
                        <div className="space-y-4">
                            <h3 className="font-bold text-lg mb-4">Contact Information</h3>

                            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                                <Phone className="w-5 h-5" />
                                <span>{selectedShop.phone || 'No phone number'}</span>
                            </div>

                            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                                <Mail className="w-5 h-5" />
                                <span>{selectedShop.email || 'No email'}</span>
                            </div>

                            <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                                <MapPin className="w-5 h-5" />
                                <span>{selectedShop.city || 'No city'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

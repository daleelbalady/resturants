import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useParams } from 'react-router-dom';
import { Shop } from '../types';
import { useProviderShops } from '../hooks/useApi';

interface User {
    id: string;
    email: string;
    name: string;
    role: string;
    profilePic?: string;
}

interface ProviderContextType {
    user: User | null;
    userId: string | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    logout: () => void;
    shops: Shop[];
    selectedShop: Shop | null;
    setSelectedShop: (shop: Shop) => void;
    refreshShops: () => void;
}

const ProviderContext = createContext<ProviderContextType | undefined>(undefined);

export const ProviderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { userId } = useParams<{ userId: string }>();
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedShop, setSelectedShop] = useState<Shop | null>(null);

    const { shops, fetchShops, loading: shopsLoading } = useProviderShops();

    useEffect(() => {
        // Load user data and token from localStorage
        const storedToken = localStorage.getItem('daleel-token') || localStorage.getItem('authToken');
        const storedUserData = localStorage.getItem('daleel-user') || localStorage.getItem('user_data');

        if (storedToken) {
            setToken(storedToken);
        }

        if (storedUserData) {
            try {
                const userData = JSON.parse(storedUserData);
                setUser(userData);
            } catch (error) {
                console.error('Failed to parse user data:', error);
            }
        }

        setLoading(false);
    }, []);

    useEffect(() => {
        if (token && user) {
            fetchShops(token);
        }
    }, [token, user]);

    useEffect(() => {
        if (shops.length > 0 && !selectedShop) {
            setSelectedShop(shops[0]);
        }
    }, [shops]);

    const logout = () => {
        localStorage.removeItem('authToken');
        localStorage.removeItem('user_data');
        setUser(null);
        setToken(null);
        window.location.href = '/';
    };

    const value: ProviderContextType = {
        user,
        userId: userId || user?.id || null,
        token,
        isAuthenticated: !!token && !!user,
        loading: loading || shopsLoading,
        logout,
        shops,
        selectedShop,
        setSelectedShop,
        refreshShops: () => token && fetchShops(token),
    };

    return <ProviderContext.Provider value={value}>{children}</ProviderContext.Provider>;
};

export const useProvider = () => {
    const context = useContext(ProviderContext);
    if (context === undefined) {
        throw new Error('useProvider must be used within a ProviderProvider');
    }
    return context;
};

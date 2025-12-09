import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useParams } from 'react-router-dom';

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
}

const ProviderContext = createContext<ProviderContextType | undefined>(undefined);

export const ProviderProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { userId } = useParams<{ userId: string }>();
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Load user data and token from localStorage
        // Check both old and new keys for compatibility
        const storedToken = localStorage.getItem('daleel-token') || localStorage.getItem('authToken');
        const storedUserData = localStorage.getItem('daleel-user') || localStorage.getItem('user_data');

        console.log('[ProviderContext] Checking auth:', {
            hasToken: !!storedToken,
            hasUserData: !!storedUserData,
            urlUserId: userId,
        });

        if (storedToken) {
            setToken(storedToken);
        }

        if (storedUserData) {
            try {
                const userData = JSON.parse(storedUserData);
                console.log('[ProviderContext] User data:', userData);
                setUser(userData);

                // Verify that the logged-in user matches the userId in the URL
                if (userId && userData.id !== userId) {
                    console.warn('[ProviderContext] User ID mismatch:', {
                        urlUserId: userId,
                        loggedInUserId: userData.id,
                    });
                    console.warn('User ID mismatch - user is not authorized for this shop');
                } else {
                    console.log('[ProviderContext] User ID matches!');
                }
            } catch (error) {
                console.error('Failed to parse user data:', error);
            }
        }

        setLoading(false);
    }, [userId]);

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
        loading,
        logout,
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

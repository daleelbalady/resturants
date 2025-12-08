import { useState, useEffect } from 'react';
import { API_ENDPOINTS, api } from '../api';
import { MenuItem, Shop, Order, Table } from '../types';

// Shop ID - in a real app, this would come from user context or URL params
// For now, we'll use a default shop ID that can be configured
const DEFAULT_SHOP_ID = 'shop-1';

// Hook to fetch shop data
export const useShop = (shopId: string = DEFAULT_SHOP_ID) => {
    const [shop, setShop] = useState<Shop | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchShop = async () => {
            try {
                setLoading(true);
                const data = await api.get(API_ENDPOINTS.getShop(shopId));
                setShop(data);
                setError(null);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Failed to fetch shop');
                console.error('Error fetching shop:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchShop();
    }, [shopId]);

    return { shop, loading, error, refetch: () => { } };
};

// Hook to fetch menu items
export const useMenu = (shopId: string = DEFAULT_SHOP_ID) => {
    const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchMenu = async () => {
        try {
            setLoading(true);
            const data = await api.get(API_ENDPOINTS.getMenu(shopId));
            setMenuItems(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch menu');
            console.error('Error fetching menu:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMenu();
    }, [shopId]);

    return { menuItems, loading, error, refetch: fetchMenu };
};

// Hook to fetch tables
export const useTables = (shopId: string = DEFAULT_SHOP_ID) => {
    const [tables, setTables] = useState<Table[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTables = async () => {
        try {
            setLoading(true);
            const data = await api.get(API_ENDPOINTS.getTables(shopId));
            setTables(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch tables');
            console.error('Error fetching tables:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTables();
    }, [shopId]);

    const createTable = async (table: Omit<Table, 'id'>) => {
        try {
            const token = localStorage.getItem('authToken'); // Assuming token is stored
            await api.post(API_ENDPOINTS.createTable(), table, token || undefined);
            await fetchTables();
        } catch (err) {
            console.error('Error creating table:', err);
            throw err;
        }
    };

    const updateTableStatus = async (tableId: string, isOccupied: boolean) => {
        try {
            const token = localStorage.getItem('authToken');
            await api.put(API_ENDPOINTS.updateTableStatus(tableId), { isOccupied }, token || undefined);
            await fetchTables();
        } catch (err) {
            console.error('Error updating table status:', err);
            throw err;
        }
    };

    const deleteTable = async (tableId: string) => {
        try {
            const token = localStorage.getItem('authToken');
            await api.delete(API_ENDPOINTS.deleteTable(tableId), token || undefined);
            await fetchTables();
        } catch (err) {
            console.error('Error deleting table:', err);
            throw err;
        }
    };

    return { tables, loading, error, refetch: fetchTables, createTable, updateTableStatus, deleteTable };
};

// Hook to manage orders
export const useOrders = () => {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchOrders = async (token: string) => {
        try {
            setLoading(true);
            const data = await api.get(API_ENDPOINTS.getOrders(), token);
            setOrders(data);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch orders');
            console.error('Error fetching orders:', err);
        } finally {
            setLoading(false);
        }
    };

    const createOrder = async (order: Omit<Order, 'id' | 'createdAt' | 'status'>) => {
        try {
            const data = await api.post(API_ENDPOINTS.createOrder(), order);
            return data;
        } catch (err) {
            console.error('Error creating order:', err);
            throw err;
        }
    };

    const updateOrderStatus = async (orderId: string, status: string, token: string) => {
        try {
            await api.put(API_ENDPOINTS.updateOrderStatus(orderId), { status }, token);
            await fetchOrders(token);
        } catch (err) {
            console.error('Error updating order status:', err);
            throw err;
        }
    };

    const cancelOrder = async (orderId: string, token?: string) => {
        try {
            await api.delete(API_ENDPOINTS.cancelOrder(orderId), token);
            if (token) {
                await fetchOrders(token);
            }
        } catch (err) {
            console.error('Error cancelling order:', err);
            throw err;
        }
    };

    return { orders, loading, error, fetchOrders, createOrder, updateOrderStatus, cancelOrder };
};

// Hook to manage menu items (admin)
export const useMenuManagement = (shopId: string = DEFAULT_SHOP_ID) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const createMenuItem = async (item: Omit<MenuItem, 'id'>, token: string) => {
        try {
            setLoading(true);
            const data = await api.post(API_ENDPOINTS.createMenuItem(), item, token);
            setError(null);
            return data;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create menu item');
            console.error('Error creating menu item:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const updateMenuItem = async (itemId: string, item: Partial<MenuItem>, token: string) => {
        try {
            setLoading(true);
            const data = await api.put(API_ENDPOINTS.updateMenuItem(itemId), item, token);
            setError(null);
            return data;
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update menu item');
            console.error('Error updating menu item:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const deleteMenuItem = async (itemId: string, token: string) => {
        try {
            setLoading(true);
            await api.delete(API_ENDPOINTS.deleteMenuItem(itemId), token);
            setError(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete menu item');
            console.error('Error deleting menu item:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return { loading, error, createMenuItem, updateMenuItem, deleteMenuItem };
};

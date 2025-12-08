// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://menu-api.daleelbalady.com';

export const API_ENDPOINTS = {
    // Shop endpoints
    getShop: (shopId: string) => `${API_BASE_URL}/api/shop/${shopId}`,
    getMyShop: () => `${API_BASE_URL}/api/shop/my`,
    updateShop: () => `${API_BASE_URL}/api/shop`,
    getShopDetails: (identifier: string) => `${API_BASE_URL}/api/shops/public/details/${identifier}`, // Added this line

    // Menu endpoints
    getMenu: (shopId: string) => `${API_BASE_URL}/api/menu/${shopId}`,
    getMenuItem: (itemId: string) => `${API_BASE_URL}/api/menu/item/${itemId}`,
    createMenuItem: () => `${API_BASE_URL}/api/menu`,
    updateMenuItem: (itemId: string) => `${API_BASE_URL}/api/menu/${itemId}`,
    deleteMenuItem: (itemId: string) => `${API_BASE_URL}/api/menu/${itemId}`,

    // Order endpoints
    createOrder: () => `${API_BASE_URL}/api/orders`,
    getOrders: () => `${API_BASE_URL}/api/orders`,
    getOrder: (orderId: string) => `${API_BASE_URL}/api/orders/${orderId}`,
    updateOrderStatus: (orderId: string) => `${API_BASE_URL}/api/orders/${orderId}/status`,
    cancelOrder: (orderId: string) => `${API_BASE_URL}/api/orders/${orderId}`,

    // Table endpoints
    getTables: (shopId: string) => `${API_BASE_URL}/api/tables/${shopId}`,
    createTable: () => `${API_BASE_URL}/api/tables`,
    updateTableStatus: (tableId: string) => `${API_BASE_URL}/api/tables/${tableId}/status`,
    deleteTable: (tableId: string) => `${API_BASE_URL}/api/tables/${tableId}`,

    // Health check
    health: () => `${API_BASE_URL}/health`,
};

// API utility functions
export const api = {
    async get(url: string, token?: string) {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(url, {
            method: 'GET',
            headers,
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        return response.json();
    },

    async post(url: string, data: any, token?: string) {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(url, {
            method: 'POST',
            headers,
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        return response.json();
    },

    async put(url: string, data: any, token?: string) {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(url, {
            method: 'PUT',
            headers,
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        return response.json();
    },

    async delete(url: string, token?: string) {
        const headers: HeadersInit = {
            'Content-Type': 'application/json',
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(url, {
            method: 'DELETE',
            headers,
        });

        if (!response.ok) {
            throw new Error(`API Error: ${response.statusText}`);
        }

        return response.json();
    },
};

export default API_ENDPOINTS;

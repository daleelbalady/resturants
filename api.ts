// API Configuration
const MENU_API_BASE_URL = import.meta.env.VITE_MENU_API_URL || 'https://menu-api.daleelbalady.com';
const MAIN_API_BASE_URL = import.meta.env.VITE_MAIN_API_URL || 'https://api.daleelbalady.com';

export const API_ENDPOINTS = {
    // Shop endpoints (from main backend - Node.js)
    getShopDetails: (identifier: string) => `${MAIN_API_BASE_URL}/api/shops/public/details/${identifier}`,

    // Shop endpoints (Go backend - for provider dashboard)
    getShop: (shopId: string) => `${MENU_API_BASE_URL}/api/shop/my`,
    updateShop: (shopId: string) => `${MENU_API_BASE_URL}/api/shop/${shopId}`,

    // Menu endpoints (Go backend) - FIXED: Use userId not shopId
    getMenu: (userId: string) => `${MENU_API_BASE_URL}/api/menu/${userId}`,
    getMenuItem: (itemId: string) => `${MENU_API_BASE_URL}/api/menu/item/${itemId}`,
    createMenuItem: () => `${MENU_API_BASE_URL}/api/menu`,
    updateMenuItem: (itemId: string) => `${MENU_API_BASE_URL}/api/menu/${itemId}`,
    deleteMenuItem: (itemId: string) => `${MENU_API_BASE_URL}/api/menu/${itemId}`,

    // Order endpoints (Go backend)
    createOrder: () => `${MENU_API_BASE_URL}/api/orders`,
    getOrders: () => `${MENU_API_BASE_URL}/api/orders`,
    getOrder: (orderId: string) => `${MENU_API_BASE_URL}/api/orders/${orderId}`,
    updateOrderStatus: (orderId: string) => `${MENU_API_BASE_URL}/api/orders/${orderId}/status`,
    cancelOrder: (orderId: string) => `${MENU_API_BASE_URL}/api/orders/${orderId}`,

    // Table endpoints (Go backend)
    getTables: (shopId: string) => `${MENU_API_BASE_URL}/api/tables/${shopId}`,
    createTable: () => `${MENU_API_BASE_URL}/api/tables`,
    updateTableStatus: (tableId: string) => `${MENU_API_BASE_URL}/api/tables/${tableId}/status`,
    deleteTable: (tableId: string) => `${MENU_API_BASE_URL}/api/tables/${tableId}`,

    // Health check
    health: () => `${MENU_API_BASE_URL}/health`,

    // Upload endpoint (Node.js backend)
    uploadImage: () => `${MAIN_API_BASE_URL}/api/upload/single`,
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

    async upload(url: string, file: File, token?: string) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('uploadType', 'general');
        formData.append('isPublic', 'true');

        const headers: HeadersInit = {};
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(url, {
            method: 'POST',
            headers,
            body: formData,
        });

        if (!response.ok) {
            throw new Error(`Upload Error: ${response.statusText}`);
        }

        return response.json();
    },
};

export default API_ENDPOINTS;

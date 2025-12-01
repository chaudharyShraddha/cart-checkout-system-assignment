import axios from 'axios';
import { Cart, AddItemDto, CheckoutDto, Order, DiscountCode, StoreStats } from '../types';

const API_BASE_URL = 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Cart API - manages shopping cart operations
export const cartApi = {
  // Get or create cart (creates new cart if cartId not provided)
  getCart: async (cartId?: string): Promise<Cart> => {
    const params = cartId ? { cartId } : {};
    const response = await api.get<Cart>('/cart', { params });
    return response.data;
  },

  // Add product to cart
  addItem: async (cartId: string, item: AddItemDto): Promise<Cart> => {
    const response = await api.post<Cart>(`/cart/items?cartId=${cartId}`, item);
    return response.data;
  },

  // Remove item from cart
  removeItem: async (cartId: string, itemId: string): Promise<Cart> => {
    const response = await api.delete<Cart>(`/cart/items/${itemId}?cartId=${cartId}`);
    return response.data;
  },
};

// Checkout API - processes orders and applies discounts
export const checkoutApi = {
  // Process checkout (discount codes are auto-applied if available)
  checkout: async (checkoutData: CheckoutDto): Promise<Order> => {
    const response = await api.post<Order>('/checkout', checkoutData);
    return response.data;
  },

  // Get order details by ID
  getOrder: async (orderId: string): Promise<Order> => {
    const response = await api.get<Order>(`/checkout/orders/${orderId}`);
    return response.data;
  },
};

// Discount API - validates discount codes
export const discountApi = {
  // Validate discount code before applying
  validateCode: async (code: string): Promise<{ valid: boolean; discountPercent?: number; message: string }> => {
    const response = await api.get(`/discount/validate/${code}`);
    return response.data;
  },
};

// Admin API - store statistics and discount code management
export const adminApi = {
  // Get store statistics (orders, revenue, discount codes)
  getStats: async (): Promise<StoreStats> => {
    const response = await api.get<StoreStats>('/admin/stats');
    return response.data;
  },

  // Generate discount code for nth order (must be multiple of 3)
  generateDiscount: async (orderNumber: number): Promise<{ success: boolean; discountCode?: DiscountCode; message: string }> => {
    const response = await api.post('/admin/discount/generate', { orderNumber });
    return response.data;
  },
};

export default api;


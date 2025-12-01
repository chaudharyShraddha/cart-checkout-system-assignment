/**
 * API Service Module
 * 
 * Centralized API client for all backend operations
 * Uses Axios for HTTP requests
 * 
 * API Base URL: http://localhost:3001
 * 
 * Services:
 * - cartApi: Cart management operations
 * - checkoutApi: Checkout and order processing
 * - discountApi: Discount code validation
 * - adminApi: Admin operations and statistics
 */

import axios from 'axios';
import { Cart, AddItemDto, CheckoutDto, Order, DiscountCode, StoreStats } from '../types';

const API_BASE_URL = 'http://localhost:3001';

/**
 * Axios instance configured for the backend API
 */
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Cart API
 * Manages shopping cart operations
 */
export const cartApi = {
  /**
   * Get or create cart
   * Creates a new cart if cartId is not provided
   * 
   * @param cartId - Optional cart ID. If not provided, creates a new cart
   * @returns Cart object
   */
  getCart: async (cartId?: string): Promise<Cart> => {
    const params = cartId ? { cartId } : {};
    const response = await api.get<Cart>('/cart', { params });
    return response.data;
  },

  /**
   * Add product to cart
   * 
   * @param cartId - Cart ID
   * @param item - Item data to add (productId, name, price, quantity)
   * @returns Updated cart
   */
  addItem: async (cartId: string, item: AddItemDto): Promise<Cart> => {
    const response = await api.post<Cart>(`/cart/items?cartId=${cartId}`, item);
    return response.data;
  },

  /**
   * Remove item from cart
   * 
   * @param cartId - Cart ID
   * @param itemId - Item ID to remove
   * @returns Updated cart
   */
  removeItem: async (cartId: string, itemId: string): Promise<Cart> => {
    const response = await api.delete<Cart>(`/cart/items/${itemId}?cartId=${cartId}`);
    return response.data;
  },
};

/**
 * Checkout API
 * Processes orders and applies discounts
 */
export const checkoutApi = {
  /**
   * Process checkout
   * Creates an order from the cart
   * Discount codes are auto-applied if available (most recent unused code)
   * 
   * @param checkoutData - Checkout data (cartId, optional discountCode)
   * @returns Created order
   */
  checkout: async (checkoutData: CheckoutDto): Promise<Order> => {
    const response = await api.post<Order>('/checkout', checkoutData);
    return response.data;
  },

  /**
   * Get order details by ID
   * 
   * @param orderId - Order ID
   * @returns Order object
   */
  getOrder: async (orderId: string): Promise<Order> => {
    const response = await api.get<Order>(`/checkout/orders/${orderId}`);
    return response.data;
  },
};

/**
 * Discount API
 * Validates discount codes
 */
export const discountApi = {
  /**
   * Validate discount code
   * Checks if code is valid and available for use
   * 
   * @param code - Discount code to validate
   * @returns Validation result with discount percentage and message
   */
  validateCode: async (code: string): Promise<{ valid: boolean; discountPercent?: number; message: string }> => {
    const response = await api.get(`/discount/validate/${code}`);
    return response.data;
  },
};

/**
 * Admin API
 * Store statistics and discount code management
 */
export const adminApi = {
  /**
   * Get store statistics
   * Returns aggregated data: orders, items, revenue, discount codes
   * 
   * @returns Store statistics object
   */
  getStats: async (): Promise<StoreStats> => {
    const response = await api.get<StoreStats>('/admin/stats');
    return response.data;
  },

  /**
   * Generate discount code for nth order
   * Only works for order numbers that are multiples of 3
   * 
   * @param orderNumber - Order number (must be multiple of 3)
   * @returns Generation result with discount code or error message
   */
  generateDiscount: async (orderNumber: number): Promise<{ success: boolean; discountCode?: DiscountCode; message: string }> => {
    const response = await api.post('/admin/discount/generate', { orderNumber });
    return response.data;
  },
};

export default api;


// Type definitions for the e-commerce application

export interface CartItem {
  id: string;
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface Cart {
  id: string;
  items: CartItem[];
  total: number;
}

export interface Order {
  id: string;
  cartId: string;
  items: CartItem[];
  subtotal: number;
  discountCode?: string;
  discountAmount: number;
  total: number;
  orderNumber: number;
  createdAt: string;
}

export interface DiscountCode {
  code: string;
  discountPercent: number;
  isUsed: boolean;
  orderNumber: number;
  createdAt: string;
  usedAt?: string;
}

export interface StoreStats {
  itemsPurchasedCount: number;
  totalPurchaseAmount: number;
  discountCodes: DiscountCode[];
  totalDiscountAmount: number;
  totalOrders: number;
}

export interface AddItemDto {
  productId: string;
  name: string;
  price: number;
  quantity: number;
}

export interface CheckoutDto {
  cartId: string;
  discountCode?: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
}


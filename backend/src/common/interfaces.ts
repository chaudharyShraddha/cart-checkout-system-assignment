/**
 * Common Interfaces and Types
 * 
 * Shared type definitions used across the application
 */

/**
 * Cart Item Interface
 * Represents an item in the shopping cart
 */
export interface CartItem {
  id: string; // Unique item ID in cart
  productId: string; // Product identifier
  name: string; // Product name
  price: number; // Unit price
  quantity: number; // Quantity of items
}

/**
 * Cart Interface
 * Represents the entire shopping cart
 */
export interface Cart {
  id: string; // Cart ID
  items: CartItem[]; // List of items in cart
  total: number; // Total cart value
}

/**
 * Order Interface
 * Represents a completed order
 */
export interface Order {
  id: string; // Order ID
  cartId: string; // Associated cart ID
  items: CartItem[]; // Items in the order
  subtotal: number; // Subtotal before discount
  discountCode?: string; // Applied discount code (if any)
  discountAmount: number; // Discount amount applied
  total: number; // Final total after discount
  orderNumber: number; // Sequential order number
  createdAt: Date; // Order creation timestamp
}

/**
 * Discount Code Interface
 * Represents a discount code
 */
export interface DiscountCode {
  code: string; // Discount code string
  discountPercent: number; // Discount percentage (e.g., 10 for 10%)
  isUsed: boolean; // Whether the code has been used
  orderNumber: number; // Order number that generated this code
  createdAt: Date; // Code creation timestamp
  usedAt?: Date; // When the code was used (if used)
}

/**
 * Store Statistics Interface
 * Represents aggregated store statistics
 */
export interface StoreStats {
  itemsPurchasedCount: number; // Total number of items purchased
  totalPurchaseAmount: number; // Total revenue (before discounts)
  discountCodes: DiscountCode[]; // List of all discount codes
  totalDiscountAmount: number; // Total discount amount given
  totalOrders: number; // Total number of orders
}


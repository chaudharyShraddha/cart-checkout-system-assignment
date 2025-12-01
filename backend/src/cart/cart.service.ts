/**
 * Cart Service
 * 
 * Business logic for cart operations
 * Uses in-memory storage
 */

import { Injectable } from '@nestjs/common';

@Injectable()
export class CartService {
  // In-memory cart storage
  // Will be implemented in Phase 2
  private cart: any[] = [];

  /**
   * Get all items in cart
   */
  getCart() {
    return { message: 'Cart service - getCart endpoint', cart: this.cart };
  }

  /**
   * Add item to cart
   */
  addItem(item: any) {
    return { message: 'Cart service - addItem endpoint', item };
  }

  /**
   * Remove item from cart
   */
  removeItem(itemId: string) {
    return { message: 'Cart service - removeItem endpoint', itemId };
  }
}


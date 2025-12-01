/**
 * Cart Service
 * 
 * Business logic for cart operations
 * Uses in-memory storage for cart management
 */

import { Injectable, NotFoundException } from '@nestjs/common';
import { Cart, CartItem } from '../common/interfaces';
import { AddItemDto } from '../common/dto';

@Injectable()
export class CartService {
  // In-memory cart storage
  // Key: cartId, Value: Cart object
  private carts: Map<string, Cart> = new Map();
  
  // Counter for generating unique cart IDs
  private cartIdCounter = 1;
  
  // Counter for generating unique item IDs within a cart
  private itemIdCounter = 1;

  /**
   * Get or create a cart
   * If no cartId is provided, creates a new cart
   * 
   * @param cartId - Optional cart ID. If not provided, creates a new cart
   * @returns Cart object
   */
  getCart(cartId?: string): Cart {
    // If no cartId provided, create a new cart
    if (!cartId) {
      const newCartId = `cart-${this.cartIdCounter++}`;
      const newCart: Cart = {
        id: newCartId,
        items: [],
        total: 0,
      };
      this.carts.set(newCartId, newCart);
      return newCart;
    }

    // Return existing cart or throw error if not found
    const cart = this.carts.get(cartId);
    if (!cart) {
      throw new NotFoundException(`Cart with ID ${cartId} not found`);
    }

    // Recalculate total before returning
    this.calculateCartTotal(cart);
    return cart;
  }

  /**
   * Add item to cart
   * If item with same productId exists, updates quantity
   * Otherwise, adds new item to cart
   * 
   * @param cartId - Cart ID
   * @param addItemDto - Item data to add
   * @returns Updated cart
   */
  addItem(cartId: string, addItemDto: AddItemDto): Cart {
    const cart = this.getCart(cartId);

    // Validate input
    if (addItemDto.price < 0 || addItemDto.quantity <= 0) {
      throw new Error('Price must be non-negative and quantity must be positive');
    }

    // Check if item with same productId already exists in cart
    const existingItemIndex = cart.items.findIndex(
      (item) => item.productId === addItemDto.productId,
    );

    if (existingItemIndex >= 0) {
      // Update quantity of existing item
      cart.items[existingItemIndex].quantity += addItemDto.quantity;
    } else {
      // Add new item to cart
      const newItem: CartItem = {
        id: `item-${this.itemIdCounter++}`,
        productId: addItemDto.productId,
        name: addItemDto.name,
        price: addItemDto.price,
        quantity: addItemDto.quantity,
      };
      cart.items.push(newItem);
    }

    // Recalculate cart total
    this.calculateCartTotal(cart);
    
    // Update cart in storage
    this.carts.set(cartId, cart);
    
    return cart;
  }

  /**
   * Remove item from cart
   * 
   * @param cartId - Cart ID
   * @param itemId - Item ID to remove
   * @returns Updated cart
   */
  removeItem(cartId: string, itemId: string): Cart {
    const cart = this.getCart(cartId);

    // Find and remove item
    const itemIndex = cart.items.findIndex((item) => item.id === itemId);
    if (itemIndex === -1) {
      throw new NotFoundException(`Item with ID ${itemId} not found in cart`);
    }

    cart.items.splice(itemIndex, 1);

    // Recalculate cart total
    this.calculateCartTotal(cart);
    
    // Update cart in storage
    this.carts.set(cartId, cart);
    
    return cart;
  }

  /**
   * Calculate total for a cart
   * 
   * @param cart - Cart object to calculate total for
   */
  private calculateCartTotal(cart: Cart): void {
    cart.total = cart.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
  }

  /**
   * Clear cart (used after checkout)
   * 
   * @param cartId - Cart ID to clear
   */
  clearCart(cartId: string): void {
    const cart = this.getCart(cartId);
    cart.items = [];
    cart.total = 0;
    this.carts.set(cartId, cart);
  }

  /**
   * Get cart by ID (internal method for other services)
   * 
   * @param cartId - Cart ID
   * @returns Cart object or null if not found
   */
  getCartById(cartId: string): Cart | null {
    return this.carts.get(cartId) || null;
  }
}


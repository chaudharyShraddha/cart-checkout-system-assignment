/**
 * Checkout Service
 * 
 * Business logic for checkout and order processing
 * Uses in-memory storage for orders
 * 
 * Handles:
 * - Order creation from cart
 * - Discount code validation and application
 * - Automatic discount code generation for nth orders
 */

import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { CartService } from '../cart/cart.service';
import { DiscountService } from '../discount/discount.service';
import { Order } from '../common/interfaces';

@Injectable()
export class CheckoutService {
  // In-memory order storage
  // Key: order ID, Value: Order object
  private orders: Map<string, Order> = new Map();
  
  // Sequential order number counter
  private orderNumberCounter = 0;

  constructor(
    private readonly cartService: CartService,
    private readonly discountService: DiscountService,
  ) {}

  /**
   * Process checkout with optional discount code
   * 
   * Steps:
   * 1. Validate cart exists and has items
   * 2. Validate discount code if provided
   * 3. Calculate totals with discount
   * 4. Create order
   * 5. Mark discount code as used if applied
   * 6. Generate new discount code if this is nth order
   * 7. Clear cart
   * 
   * @param cartId - Cart ID to checkout
   * @param discountCode - Optional discount code to apply
   * @returns Created order
   */
  processCheckout(cartId: string, discountCode?: string): Order {
    if (!cartId) {
      throw new BadRequestException('Cart ID is required');
    }

    // Get cart
    const cart = this.cartService.getCartById(cartId);
    if (!cart) {
      throw new NotFoundException(`Cart with ID ${cartId} not found`);
    }

    // Validate cart has items
    if (!cart.items || cart.items.length === 0) {
      throw new BadRequestException('Cart is empty. Cannot checkout.');
    }

    // Calculate subtotal
    const subtotal = cart.total;

    // Validate and apply discount code if provided
    let discountAmount = 0;
    let appliedDiscountCode: string | undefined;

    if (discountCode) {
      const validation = this.discountService.validateCode(discountCode);
      if (!validation.valid) {
        throw new BadRequestException(validation.message);
      }

      // Calculate discount amount (10% of subtotal)
      const discountPercent = validation.discountPercent || 10;
      discountAmount = this.discountService.calculateDiscountAmount(
        subtotal,
        discountPercent,
      );
      appliedDiscountCode = discountCode.toUpperCase();

      // Mark discount code as used
      this.discountService.markAsUsed(appliedDiscountCode);
    }

    // Calculate final total
    const total = Math.round((subtotal - discountAmount) * 100) / 100; // Round to 2 decimal places

    // Increment order number
    this.orderNumberCounter++;
    const orderNumber = this.orderNumberCounter;

    // Create order
    const order: Order = {
      id: `order-${orderNumber}`,
      cartId: cart.id,
      items: [...cart.items], // Copy items array
      subtotal,
      discountCode: appliedDiscountCode,
      discountAmount,
      total,
      orderNumber,
      createdAt: new Date(),
    };

    // Store order
    this.orders.set(order.id, order);

    // Generate discount code if this is nth order
    const generatedCode = this.discountService.generateCode(orderNumber);
    if (generatedCode) {
      // Discount code generated and stored in DiscountService
      // It will be available for the next customer
    }

    // Clear cart after successful checkout
    this.cartService.clearCart(cartId);

    return order;
  }

  /**
   * Get order by ID
   * 
   * @param orderId - Order ID
   * @returns Order object
   */
  getOrder(orderId: string): Order {
    const order = this.orders.get(orderId);
    if (!order) {
      throw new NotFoundException(`Order with ID ${orderId} not found`);
    }
    return order;
  }

  /**
   * Get all orders (for admin statistics)
   * 
   * @returns Array of all orders
   */
  getAllOrders(): Order[] {
    return Array.from(this.orders.values());
  }

  /**
   * Get total number of orders
   * 
   * @returns Total order count
   */
  getOrderCount(): number {
    return this.orders.size;
  }

  /**
   * Get total items purchased across all orders
   * 
   * @returns Total items count
   */
  getTotalItemsPurchased(): number {
    let totalItems = 0;
    this.orders.forEach((order) => {
      order.items.forEach((item) => {
        totalItems += item.quantity;
      });
    });
    return totalItems;
  }

  /**
   * Get total purchase amount (subtotal before discounts)
   * 
   * @returns Total purchase amount
   */
  getTotalPurchaseAmount(): number {
    let total = 0;
    this.orders.forEach((order) => {
      total += order.subtotal;
    });
    return Math.round(total * 100) / 100;
  }

  /**
   * Get total discount amount given
   * 
   * @returns Total discount amount
   */
  getTotalDiscountAmount(): number {
    let totalDiscount = 0;
    this.orders.forEach((order) => {
      totalDiscount += order.discountAmount;
    });
    return Math.round(totalDiscount * 100) / 100;
  }
}


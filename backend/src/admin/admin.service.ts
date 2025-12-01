/**
 * Admin Service
 * 
 * Business logic for admin operations:
 * - Generate discount codes (when nth order condition is satisfied)
 * - Get store statistics (items purchased, total amount, discount codes, etc.)
 */

import { Injectable, BadRequestException } from '@nestjs/common';
import { StoreStats, DiscountCode } from '../common/interfaces';
import { CheckoutService } from '../checkout/checkout.service';
import { DiscountService } from '../discount/discount.service';

@Injectable()
export class AdminService {
  constructor(
    private readonly checkoutService: CheckoutService,
    private readonly discountService: DiscountService,
  ) {}

  /**
   * Get store statistics
   * Returns:
   * - Count of items purchased
   * - Total purchase amount (before discounts)
   * - List of discount codes
   * - Total discount amount given
   * 
   * @returns Store statistics object
   */
  getStats(): StoreStats {
    const itemsPurchasedCount = this.checkoutService.getTotalItemsPurchased();
    const totalPurchaseAmount = this.checkoutService.getTotalPurchaseAmount();
    const discountCodes = this.discountService.getAllDiscountCodes();
    const totalDiscountAmount = this.checkoutService.getTotalDiscountAmount();
    const totalOrders = this.checkoutService.getOrderCount();

    return {
      itemsPurchasedCount,
      totalPurchaseAmount,
      discountCodes,
      totalDiscountAmount,
      totalOrders,
    };
  }

  /**
   * Manually generate discount code for a specific order number
   * Only generates if order number is a multiple of nth order
   * 
   * @param orderNumber - Order number to generate discount code for
   * @returns Generated discount code or error message
   */
  generateDiscount(orderNumber: number): { success: boolean; discountCode?: DiscountCode; message: string } {
    if (!orderNumber || orderNumber <= 0) {
      throw new BadRequestException('Invalid order number');
    }

    const nthOrder = this.discountService.getNthOrder();

    // Check if order number is a multiple of nth order
    if (orderNumber % nthOrder !== 0) {
      return {
        success: false,
        message: `Order number ${orderNumber} is not a multiple of ${nthOrder}. Discount codes are only generated for every ${nthOrder}th order.`,
      };
    }

    // Check if code already exists for this order
    const existingCodes = this.discountService.getAllDiscountCodes();
    const existingCode = existingCodes.find((code) => code.orderNumber === orderNumber);

    if (existingCode) {
      return {
        success: true,
        discountCode: existingCode,
        message: `Discount code already exists for order ${orderNumber}`,
      };
    }

    // Generate new discount code
    const discountCode = this.discountService.generateCode(orderNumber);

    if (!discountCode) {
      return {
        success: false,
        message: `Failed to generate discount code for order ${orderNumber}`,
      };
    }

    return {
      success: true,
      discountCode,
      message: `Discount code generated successfully for order ${orderNumber}`,
    };
  }
}


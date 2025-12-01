/**
 * Discount Service
 * 
 * Business logic for discount code management
 * Uses in-memory storage
 * 
 * Rules:
 * - Every nth order (default: 5) generates a discount code
 * - Discount code can only be used once
 * - Next discount code becomes available after the next nth order
 * - Discount is 10% on entire order
 */

import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { DiscountCode } from '../common/interfaces';

@Injectable()
export class DiscountService {
  // In-memory discount code storage
  // Key: discount code, Value: DiscountCode object
  private discountCodes: Map<string, DiscountCode> = new Map();
  
  // Configuration: every nth order generates a discount code
  private readonly NTH_ORDER = 5;
  
  // Discount percentage (10%)
  private readonly DISCOUNT_PERCENT = 10;

  /**
   * Validate if discount code is valid and available for use
   * 
   * @param code - Discount code to validate
   * @returns Object with validation result and discount info
   */
  validateCode(code: string): { valid: boolean; discountPercent?: number; message: string } {
    if (!code || code.trim() === '') {
      return {
        valid: false,
        message: 'Discount code is required',
      };
    }

    const discountCode = this.discountCodes.get(code.toUpperCase());

    if (!discountCode) {
      return {
        valid: false,
        message: 'Invalid discount code',
      };
    }

    if (discountCode.isUsed) {
      return {
        valid: false,
        message: 'Discount code has already been used',
      };
    }

    return {
      valid: true,
      discountPercent: discountCode.discountPercent,
      message: 'Discount code is valid',
    };
  }

  /**
   * Generate discount code for nth order
   * Only generates if order number is a multiple of NTH_ORDER
   * 
   * @param orderNumber - Order number to check
   * @returns Generated discount code or null if condition not met
   */
  generateCode(orderNumber: number): DiscountCode | null {
    if (!orderNumber || orderNumber <= 0) {
      throw new BadRequestException('Invalid order number');
    }

    // Check if order number is a multiple of NTH_ORDER
    if (orderNumber % this.NTH_ORDER !== 0) {
      return null; // Not an nth order, no discount code generated
    }

    // Check if a code already exists for this order number
    const existingCode = Array.from(this.discountCodes.values()).find(
      (code) => code.orderNumber === orderNumber,
    );

    if (existingCode) {
      return existingCode; // Code already generated for this order
    }

    // Generate new discount code
    const code = this.generateUniqueCode();
    const discountCode: DiscountCode = {
      code,
      discountPercent: this.DISCOUNT_PERCENT,
      isUsed: false,
      orderNumber,
      createdAt: new Date(),
    };

    this.discountCodes.set(code, discountCode);
    return discountCode;
  }

  /**
   * Mark discount code as used
   * Called when a discount code is applied during checkout
   * 
   * @param code - Discount code to mark as used
   */
  markAsUsed(code: string): void {
    const discountCode = this.discountCodes.get(code.toUpperCase());
    if (!discountCode) {
      throw new NotFoundException(`Discount code ${code} not found`);
    }

    if (discountCode.isUsed) {
      throw new BadRequestException(`Discount code ${code} has already been used`);
    }

    discountCode.isUsed = true;
    discountCode.usedAt = new Date();
    this.discountCodes.set(code.toUpperCase(), discountCode);
  }

  /**
   * Get all discount codes (for admin statistics)
   * 
   * @returns Array of all discount codes
   */
  getAllDiscountCodes(): DiscountCode[] {
    return Array.from(this.discountCodes.values());
  }

  /**
   * Get discount percentage for a valid code
   * 
   * @param code - Discount code
   * @returns Discount percentage
   */
  getDiscountPercent(code: string): number {
    const discountCode = this.discountCodes.get(code.toUpperCase());
    if (!discountCode) {
      throw new NotFoundException(`Discount code ${code} not found`);
    }
    return discountCode.discountPercent;
  }

  /**
   * Calculate discount amount for a given total
   * 
   * @param total - Total amount before discount
   * @param discountPercent - Discount percentage
   * @returns Discount amount
   */
  calculateDiscountAmount(total: number, discountPercent: number): number {
    return Math.round((total * discountPercent) / 100 * 100) / 100; // Round to 2 decimal places
  }

  /**
   * Generate a unique discount code
   * Format: DISCOUNT-XXXX (where XXXX is a random 4-digit number)
   * 
   * @returns Unique discount code string
   */
  private generateUniqueCode(): string {
    let code: string;
    let attempts = 0;
    const maxAttempts = 100;

    do {
      const randomNum = Math.floor(1000 + Math.random() * 9000); // 4-digit number
      code = `DISCOUNT-${randomNum}`;
      attempts++;
    } while (this.discountCodes.has(code) && attempts < maxAttempts);

    if (attempts >= maxAttempts) {
      throw new Error('Failed to generate unique discount code');
    }

    return code;
  }

  /**
   * Get the nth order configuration
   * 
   * @returns Nth order value
   */
  getNthOrder(): number {
    return this.NTH_ORDER;
  }
}


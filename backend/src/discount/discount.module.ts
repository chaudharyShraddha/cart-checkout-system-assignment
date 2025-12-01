/**
 * Discount Module
 * 
 * Handles discount code management:
 * - Validate discount codes
 * - Generate discount codes for nth orders
 * - Track discount code usage
 */

import { Module } from '@nestjs/common';
import { DiscountController } from './discount.controller';
import { DiscountService } from './discount.service';

@Module({
  controllers: [DiscountController],
  providers: [DiscountService],
  exports: [DiscountService], // Export for use in checkout and admin modules
})
export class DiscountModule {}


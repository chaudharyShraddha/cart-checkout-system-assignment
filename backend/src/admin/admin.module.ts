/**
 * Admin Module
 * 
 * Handles admin operations:
 * - Generate discount codes (when nth order condition is met)
 * - Get store statistics (items purchased, total amount, discount codes, etc.)
 */

import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';
import { CheckoutModule } from '../checkout/checkout.module';
import { DiscountModule } from '../discount/discount.module';

@Module({
  imports: [CheckoutModule, DiscountModule], // Import to access order and discount data
  controllers: [AdminController],
  providers: [AdminService],
})
export class AdminModule {}


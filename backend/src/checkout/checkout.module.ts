/**
 * Checkout Module
 * 
 * Handles checkout and order processing:
 * - Process checkout with discount validation
 * - Create orders
 * - Track order statistics
 */

import { Module } from '@nestjs/common';
import { CheckoutController } from './checkout.controller';
import { CheckoutService } from './checkout.service';
import { CartModule } from '../cart/cart.module';
import { DiscountModule } from '../discount/discount.module';

@Module({
  imports: [CartModule, DiscountModule], // Import CartModule to access CartService
  controllers: [CheckoutController],
  providers: [CheckoutService],
  exports: [CheckoutService], // Export for use in admin module
})
export class CheckoutModule {}


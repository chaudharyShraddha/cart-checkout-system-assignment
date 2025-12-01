/**
 * App Module - Root Module
 * 
 * Imports all feature modules:
 * - CartModule: Cart management
 * - CheckoutModule: Checkout and order processing
 * - DiscountModule: Discount code management
 * - AdminModule: Admin operations
 */

import { Module } from '@nestjs/common';
import { CartModule } from './cart/cart.module';
import { CheckoutModule } from './checkout/checkout.module';
import { DiscountModule } from './discount/discount.module';
import { AdminModule } from './admin/admin.module';

@Module({
  imports: [
    CartModule,
    CheckoutModule,
    DiscountModule,
    AdminModule,
  ],
})
export class AppModule {}


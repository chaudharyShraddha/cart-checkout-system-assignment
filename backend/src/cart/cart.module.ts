/**
 * Cart Module
 * 
 * Handles cart management operations:
 * - Add items to cart
 * - Get cart contents
 * - Remove items from cart
 */

import { Module } from '@nestjs/common';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';

@Module({
  controllers: [CartController],
  providers: [CartService],
  exports: [CartService], // Export for use in other modules (e.g., checkout)
})
export class CartModule {}


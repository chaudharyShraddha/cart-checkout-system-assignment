/**
 * Checkout Controller
 * 
 * Handles HTTP requests for checkout operations
 */

import { Controller, Post, Body } from '@nestjs/common';
import { CheckoutService } from './checkout.service';

@Controller('checkout')
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  /**
   * Process checkout
   * POST /checkout
   * Body: { cartId, discountCode? }
   */
  @Post()
  checkout(@Body() checkoutData: { cartId?: string; discountCode?: string }) {
    return this.checkoutService.processCheckout(checkoutData);
  }
}


/**
 * Cart Controller
 * 
 * Handles HTTP requests for cart operations
 */

import { Controller, Get, Post, Delete, Body, Param } from '@nestjs/common';
import { CartService } from './cart.service';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  /**
   * Get cart contents
   * GET /cart
   */
  @Get()
  getCart() {
    return this.cartService.getCart();
  }

  /**
   * Add item to cart
   * POST /cart/items
   * Body: { productId, name, price, quantity }
   */
  @Post('items')
  addItem(@Body() item: any) {
    return this.cartService.addItem(item);
  }

  /**
   * Remove item from cart
   * DELETE /cart/items/:itemId
   */
  @Delete('items/:itemId')
  removeItem(@Param('itemId') itemId: string) {
    return this.cartService.removeItem(itemId);
  }
}


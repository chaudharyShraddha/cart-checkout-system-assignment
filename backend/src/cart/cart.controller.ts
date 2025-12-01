/**
 * Cart Controller
 * 
 * Handles HTTP requests for cart operations
 */

import { Controller, Get, Post, Delete, Body, Param, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { AddItemDto } from '../common/dto';
import { Cart } from '../common/interfaces';

@ApiTags('cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  /**
   * Get cart contents
   * GET /cart?cartId=cart-1
   * 
   * @param cartId - Optional cart ID query parameter
   * @returns Cart object with items and total
   */
  @Get()
  @ApiOperation({ summary: 'Get cart contents' })
  @ApiQuery({ name: 'cartId', required: false, description: 'Cart ID. If not provided, creates a new cart.' })
  @ApiResponse({ status: 200, description: 'Cart retrieved successfully', type: Object })
  @ApiResponse({ status: 404, description: 'Cart not found' })
  getCart(@Query('cartId') cartId?: string) {
    return this.cartService.getCart(cartId);
  }

  /**
   * Add item to cart
   * POST /cart/items?cartId=cart-1
   * Body: { productId, name, price, quantity }
   * 
   * @param cartId - Cart ID query parameter (required)
   * @param addItemDto - Item data to add
   * @returns Updated cart
   */
  @Post('items')
  @ApiOperation({ summary: 'Add item to cart' })
  @ApiQuery({ name: 'cartId', required: false, description: 'Cart ID. If not provided, creates a new cart.' })
  @ApiResponse({ status: 201, description: 'Item added to cart successfully', type: Object })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  @ApiResponse({ status: 404, description: 'Cart not found' })
  addItem(
    @Query('cartId') cartId: string,
    @Body() addItemDto: AddItemDto,
  ) {
    if (!cartId) {
      // If no cartId provided, create a new cart first
      const newCart = this.cartService.getCart();
      cartId = newCart.id;
    }
    return this.cartService.addItem(cartId, addItemDto);
  }

  /**
   * Remove item from cart
   * DELETE /cart/items/:itemId?cartId=cart-1
   * 
   * @param cartId - Cart ID query parameter (required)
   * @param itemId - Item ID to remove
   * @returns Updated cart
   */
  @Delete('items/:itemId')
  @ApiOperation({ summary: 'Remove item from cart' })
  @ApiQuery({ name: 'cartId', required: true, description: 'Cart ID' })
  @ApiParam({ name: 'itemId', description: 'Item ID to remove' })
  @ApiResponse({ status: 200, description: 'Item removed successfully', type: Object })
  @ApiResponse({ status: 404, description: 'Cart or item not found' })
  removeItem(
    @Query('cartId') cartId: string,
    @Param('itemId') itemId: string,
  ) {
    if (!cartId) {
      throw new Error('cartId query parameter is required');
    }
    return this.cartService.removeItem(cartId, itemId);
  }
}


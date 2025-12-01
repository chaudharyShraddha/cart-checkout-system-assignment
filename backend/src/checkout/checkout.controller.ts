/**
 * Checkout Controller
 * 
 * Handles HTTP requests for checkout operations
 */

import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { CheckoutService } from './checkout.service';
import { CheckoutDto } from '../common/dto';

@ApiTags('checkout')
@Controller('checkout')
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  /**
   * Process checkout
   * POST /checkout
   * Body: { cartId, discountCode? }
   * 
   * @param checkoutDto - Checkout data including cartId and optional discountCode
   * @returns Created order
   */
  @Post()
  @ApiOperation({ 
    summary: 'Process checkout',
    description: 'Processes checkout for a cart. Validates and applies discount code if provided. Automatically generates discount code for every 5th order.'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Order created successfully',
    schema: {
      example: {
        id: 'order-1',
        cartId: 'cart-1',
        items: [
          {
            id: 'item-1',
            productId: 'prod-123',
            name: 'Laptop',
            price: 999.99,
            quantity: 1
          }
        ],
        subtotal: 999.99,
        discountCode: 'DISCOUNT-1234',
        discountAmount: 99.99,
        total: 900.00,
        orderNumber: 1,
        createdAt: '2024-01-01T00:00:00.000Z'
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Invalid cart or discount code' })
  @ApiResponse({ status: 404, description: 'Cart not found' })
  checkout(@Body() checkoutDto: CheckoutDto) {
    return this.checkoutService.processCheckout(
      checkoutDto.cartId,
      checkoutDto.discountCode,
    );
  }

  /**
   * Get order by ID
   * GET /checkout/orders/:orderId
   * 
   * @param orderId - Order ID
   * @returns Order object
   */
  @Get('orders/:orderId')
  @ApiOperation({ summary: 'Get order by ID' })
  @ApiParam({ name: 'orderId', description: 'Order ID' })
  @ApiResponse({ status: 200, description: 'Order retrieved successfully', type: Object })
  @ApiResponse({ status: 404, description: 'Order not found' })
  getOrder(@Param('orderId') orderId: string) {
    return this.checkoutService.getOrder(orderId);
  }
}


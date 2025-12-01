/**
 * Admin Controller
 * 
 * Handles HTTP requests for admin operations
 */

import { Controller, Get, Post, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AdminService } from './admin.service';
import { GenerateDiscountDto } from '../common/dto';

@ApiTags('admin')
@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  /**
   * Get store statistics
   * GET /admin/stats
   * Returns: items purchased count, total purchase amount, discount codes list, total discount amount
   * 
   * @returns Store statistics object
   */
  @Get('stats')
  @ApiOperation({ 
    summary: 'Get store statistics',
    description: 'Returns aggregated store statistics including items purchased count, total purchase amount, all discount codes, and total discount amount given.'
  })
  @ApiResponse({ 
    status: 200, 
    description: 'Store statistics retrieved successfully',
    schema: {
      example: {
        itemsPurchasedCount: 15,
        totalPurchaseAmount: 4999.95,
        discountCodes: [
          {
            code: 'DISCOUNT-1234',
            discountPercent: 10,
            isUsed: true,
            orderNumber: 3,
            createdAt: '2024-01-01T00:00:00.000Z',
            usedAt: '2024-01-01T01:00:00.000Z'
          }
        ],
        totalDiscountAmount: 99.99,
        totalOrders: 3
      }
    }
  })
  getStats() {
    return this.adminService.getStats();
  }

  /**
   * Manually generate discount code (when nth order condition is satisfied)
   * POST /admin/discount/generate
   * Body: { orderNumber }
   * 
   * @param generateDiscountDto - DTO containing orderNumber
   * @returns Generated discount code or error message
   */
  @Post('discount/generate')
  @ApiOperation({ 
    summary: 'Manually generate discount code',
    description: 'Generates a discount code for a specific order number. Only works if the order number is a multiple of 3 (nth order).'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Discount code generated successfully',
    schema: {
      example: {
        success: true,
        discountCode: {
          code: 'DISCOUNT-1234',
          discountPercent: 10,
          isUsed: false,
          orderNumber: 3,
          createdAt: '2024-01-01T00:00:00.000Z'
        },
        message: 'Discount code generated successfully for order 3'
      }
    }
  })
  @ApiResponse({ 
    status: 400, 
    description: 'Invalid order number or order number is not a multiple of 3',
    schema: {
      example: {
        success: false,
        message: 'Order number 2 is not a multiple of 3. Discount codes are only generated for every 3rd order.'
      }
    }
  })
  generateDiscount(@Body() generateDiscountDto: GenerateDiscountDto) {
    if (!generateDiscountDto.orderNumber) {
      throw new Error('orderNumber is required');
    }
    return this.adminService.generateDiscount(generateDiscountDto.orderNumber);
  }
}


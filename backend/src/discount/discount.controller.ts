/**
 * Discount Controller
 * 
 * Handles HTTP requests for discount operations
 */

import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { DiscountService } from './discount.service';
import { GenerateDiscountDto } from '../common/dto';

@ApiTags('discount')
@Controller('discount')
export class DiscountController {
  constructor(private readonly discountService: DiscountService) {}

  /**
   * Validate discount code
   * GET /discount/validate/:code
   */
  @Get('validate/:code')
  @ApiOperation({ 
    summary: 'Validate discount code',
    description: 'Checks if a discount code is valid and available for use. Returns validation result and discount percentage.'
  })
  @ApiParam({ name: 'code', description: 'Discount code to validate' })
  @ApiResponse({ 
    status: 200, 
    description: 'Validation result',
    schema: {
      example: {
        valid: true,
        discountPercent: 10,
        message: 'Discount code is valid'
      }
    }
  })
  validateCode(@Param('code') code: string) {
    return this.discountService.validateCode(code);
  }

  /**
   * Generate discount code (for nth order)
   * POST /discount/generate
   * Body: { orderNumber }
   * 
   * @param generateDiscountDto - DTO containing orderNumber
   * @returns Generated discount code or null if condition not met
   */
  @Post('generate')
  @ApiOperation({ 
    summary: 'Generate discount code',
    description: 'Generates a discount code for every 5th order. Returns null if order number is not a multiple of 5.'
  })
  @ApiResponse({ 
    status: 201, 
    description: 'Discount code generated successfully',
    schema: {
      example: {
        code: 'DISCOUNT-1234',
        discountPercent: 10,
        isUsed: false,
        orderNumber: 5,
        createdAt: '2024-01-01T00:00:00.000Z'
      }
    }
  })
  @ApiResponse({ status: 400, description: 'Invalid order number' })
  generateCode(@Body() generateDiscountDto: GenerateDiscountDto) {
    if (!generateDiscountDto.orderNumber) {
      throw new Error('orderNumber is required');
    }
    return this.discountService.generateCode(generateDiscountDto.orderNumber);
  }
}


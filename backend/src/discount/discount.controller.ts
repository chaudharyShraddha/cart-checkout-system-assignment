/**
 * Discount Controller
 * 
 * Handles HTTP requests for discount operations
 */

import { Controller, Get, Post, Param, Body } from '@nestjs/common';
import { DiscountService } from './discount.service';

@Controller('discount')
export class DiscountController {
  constructor(private readonly discountService: DiscountService) {}

  /**
   * Validate discount code
   * GET /discount/validate/:code
   */
  @Get('validate/:code')
  validateCode(@Param('code') code: string) {
    return this.discountService.validateCode(code);
  }

  /**
   * Generate discount code (for nth order)
   * POST /discount/generate
   */
  @Post('generate')
  generateCode(@Body() data: { orderNumber?: number }) {
    return this.discountService.generateCode(data);
  }
}


/**
 * Admin Controller
 * 
 * Handles HTTP requests for admin operations
 */

import { Controller, Get, Post, Body } from '@nestjs/common';
import { AdminService } from './admin.service';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  /**
   * Get store statistics
   * GET /admin/stats
   * Returns: items purchased count, total purchase amount, discount codes list, total discount amount
   */
  @Get('stats')
  getStats() {
    return this.adminService.getStats();
  }

  /**
   * Manually generate discount code (when nth order condition is satisfied)
   * POST /admin/discount/generate
   */
  @Post('discount/generate')
  generateDiscount(@Body() data: { orderNumber?: number }) {
    return this.adminService.generateDiscount(data);
  }
}


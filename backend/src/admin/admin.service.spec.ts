import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { AdminService } from './admin.service';
import { CheckoutService } from '../checkout/checkout.service';
import { DiscountService } from '../discount/discount.service';
import { CartService } from '../cart/cart.service';

describe('AdminService', () => {
  let service: AdminService;
  let checkoutService: CheckoutService;
  let discountService: DiscountService;
  let cartService: CartService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AdminService, CheckoutService, DiscountService, CartService],
    }).compile();

    service = module.get<AdminService>(AdminService);
    checkoutService = module.get<CheckoutService>(CheckoutService);
    discountService = module.get<DiscountService>(DiscountService);
    cartService = module.get<CartService>(CartService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getStats', () => {
    it('should return empty stats initially', () => {
      const stats = service.getStats();
      expect(stats.itemsPurchasedCount).toBe(0);
      expect(stats.totalPurchaseAmount).toBe(0);
      expect(stats.discountCodes).toEqual([]);
      expect(stats.totalDiscountAmount).toBe(0);
      expect(stats.totalOrders).toBe(0);
    });

    it('should return correct stats after orders', () => {
      // Create an order
      const cart = cartService.getCart();
      cartService.addItem(cart.id, {
        productId: 'prod-1',
        name: 'Product 1',
        price: 100,
        quantity: 2,
      });
      checkoutService.processCheckout(cart.id);

      const stats = service.getStats();
      expect(stats.itemsPurchasedCount).toBe(2);
      expect(stats.totalPurchaseAmount).toBe(200);
      expect(stats.totalOrders).toBe(1);
    });

    it('should include discount codes in stats', () => {
      // Generate a discount code
      const code = discountService.generateCode(3);
      expect(code).not.toBeNull();

      const stats = service.getStats();
      expect(stats.discountCodes.length).toBeGreaterThan(0);
      expect(stats.discountCodes[0].orderNumber).toBe(3);
    });
  });

  describe('generateDiscount', () => {
    it('should throw error for invalid order number', () => {
      expect(() => service.generateDiscount(0)).toThrow(BadRequestException);
      expect(() => service.generateDiscount(-1)).toThrow(BadRequestException);
    });

    it('should return error for non-nth order', () => {
      const result = service.generateDiscount(2);
      expect(result.success).toBe(false);
      expect(result.message).toContain('not a multiple of 3');
    });

    it('should generate code for nth order', () => {
      const result = service.generateDiscount(3);
      expect(result.success).toBe(true);
      expect(result.discountCode).toBeDefined();
      expect(result.discountCode!.orderNumber).toBe(3);
      expect(result.discountCode!.discountPercent).toBe(10);
      expect(result.message).toContain('successfully');
    });

    it('should return existing code if already generated', () => {
      const result1 = service.generateDiscount(3);
      const result2 = service.generateDiscount(3);

      expect(result1.success).toBe(true);
      expect(result2.success).toBe(true);
      expect(result1.discountCode!.code).toBe(result2.discountCode!.code);
      expect(result2.message).toContain('already exists');
    });

    it('should work for multiple nth orders', () => {
      const result3 = service.generateDiscount(3);
      const result6 = service.generateDiscount(6);
      const result9 = service.generateDiscount(9);

      expect(result3.success).toBe(true);
      expect(result6.success).toBe(true);
      expect(result9.success).toBe(true);
      expect(result3.discountCode!.code).not.toBe(result6.discountCode!.code);
      expect(result6.discountCode!.code).not.toBe(result9.discountCode!.code);
    });
  });
});


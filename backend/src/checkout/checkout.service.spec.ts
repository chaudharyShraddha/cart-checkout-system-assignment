import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { CartService } from '../cart/cart.service';
import { DiscountService } from '../discount/discount.service';

describe('CheckoutService', () => {
  let service: CheckoutService;
  let cartService: CartService;
  let discountService: DiscountService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CheckoutService, CartService, DiscountService],
    }).compile();

    service = module.get<CheckoutService>(CheckoutService);
    cartService = module.get<CartService>(CartService);
    discountService = module.get<DiscountService>(DiscountService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('processCheckout', () => {
    it('should throw error for empty cartId', () => {
      expect(() => service.processCheckout('')).toThrow(BadRequestException);
    });

    it('should throw error for non-existent cart', () => {
      expect(() => service.processCheckout('non-existent')).toThrow(NotFoundException);
    });

    it('should throw error for empty cart', () => {
      const cart = cartService.getCart();
      expect(() => service.processCheckout(cart.id)).toThrow(BadRequestException);
    });

    it('should create order without discount', () => {
      const cart = cartService.getCart();
      cartService.addItem(cart.id, {
        productId: 'prod-1',
        name: 'Product 1',
        price: 100,
        quantity: 2,
      });

      const order = service.processCheckout(cart.id);
      
      expect(order).toBeDefined();
      expect(order.items.length).toBe(1);
      expect(order.subtotal).toBe(200);
      expect(order.discountAmount).toBe(0);
      expect(order.total).toBe(200);
      expect(order.orderNumber).toBe(1);
      expect(order.discountCode).toBeUndefined();
    });

    it('should apply manual discount code', () => {
      const cart = cartService.getCart();
      cartService.addItem(cart.id, {
        productId: 'prod-1',
        name: 'Product 1',
        price: 100,
        quantity: 1,
      });

      // Generate and use discount code
      const discountCode = discountService.generateCode(3);
      expect(discountCode).not.toBeNull();

      const order = service.processCheckout(cart.id, discountCode!.code);
      
      expect(order.discountCode).toBe(discountCode!.code.toUpperCase());
      expect(order.discountAmount).toBe(10); // 10% of 100
      expect(order.total).toBe(90);
    });

    it('should auto-apply most recent unused discount code', () => {
      // Create first order (order 1)
      const cart1 = cartService.getCart();
      cartService.addItem(cart1.id, {
        productId: 'prod-1',
        name: 'Product 1',
        price: 100,
        quantity: 1,
      });
      const order1 = service.processCheckout(cart1.id);
      expect(order1.orderNumber).toBe(1);
      expect(order1.discountCode).toBeUndefined();

      // Create second order (order 2) - should not have discount
      const cart2 = cartService.getCart();
      cartService.addItem(cart2.id, {
        productId: 'prod-1',
        name: 'Product 1',
        price: 100,
        quantity: 1,
      });
      const order2 = service.processCheckout(cart2.id);
      expect(order2.orderNumber).toBe(2);
      expect(order2.discountCode).toBeUndefined();

      // Create third order (order 3) - generates new code
      const cart3 = cartService.getCart();
      cartService.addItem(cart3.id, {
        productId: 'prod-1',
        name: 'Product 1',
        price: 100,
        quantity: 1,
      });
      const order3 = service.processCheckout(cart3.id);
      expect(order3.orderNumber).toBe(3);
      // Order 3 generates code but doesn't use it (code is available for next order)

      // Verify code was generated
      const allCodes = discountService.getAllDiscountCodes();
      const codeForOrder3 = allCodes.find(c => c.orderNumber === 3);
      expect(codeForOrder3).toBeDefined();
      expect(codeForOrder3!.isUsed).toBe(false);

      // Create fourth order (order 4) - should auto-apply code from order 3
      const cart4 = cartService.getCart();
      cartService.addItem(cart4.id, {
        productId: 'prod-1',
        name: 'Product 1',
        price: 100,
        quantity: 1,
      });
      const order4 = service.processCheckout(cart4.id);
      expect(order4.orderNumber).toBe(4);
      expect(order4.discountCode).toBeDefined();
      expect(order4.discountCode).toBe(codeForOrder3!.code);
      expect(order4.discountAmount).toBe(10);
      expect(order4.total).toBe(90);
    });

    it('should generate discount code for nth order', () => {
      // Create orders 1, 2, 3
      for (let i = 1; i <= 3; i++) {
        const cart = cartService.getCart();
        cartService.addItem(cart.id, {
          productId: 'prod-1',
          name: 'Product 1',
          price: 100,
          quantity: 1,
        });
        service.processCheckout(cart.id);
      }

      const allCodes = discountService.getAllDiscountCodes();
      // Order 3 should have generated a code
      const codeForOrder3 = allCodes.find(c => c.orderNumber === 3);
      expect(codeForOrder3).toBeDefined();
    });

    it('should throw error for invalid discount code', () => {
      const cart = cartService.getCart();
      cartService.addItem(cart.id, {
        productId: 'prod-1',
        name: 'Product 1',
        price: 100,
        quantity: 1,
      });

      expect(() => service.processCheckout(cart.id, 'INVALID-CODE')).toThrow(BadRequestException);
    });

    it('should handle empty string discount code as no code', () => {
      const cart = cartService.getCart();
      cartService.addItem(cart.id, {
        productId: 'prod-1',
        name: 'Product 1',
        price: 100,
        quantity: 1,
      });

      const order = service.processCheckout(cart.id, '   ');
      expect(order.discountCode).toBeUndefined();
    });
  });

  describe('getOrderCount', () => {
    it('should return correct order count', () => {
      expect(service.getOrderCount()).toBe(0);

      const cart = cartService.getCart();
      cartService.addItem(cart.id, {
        productId: 'prod-1',
        name: 'Product 1',
        price: 100,
        quantity: 1,
      });
      service.processCheckout(cart.id);

      expect(service.getOrderCount()).toBe(1);
    });
  });

  describe('getTotalItemsPurchased', () => {
    it('should calculate total items correctly', () => {
      const cart = cartService.getCart();
      cartService.addItem(cart.id, {
        productId: 'prod-1',
        name: 'Product 1',
        price: 100,
        quantity: 2,
      });
      service.processCheckout(cart.id);

      expect(service.getTotalItemsPurchased()).toBe(2);
    });
  });

  describe('getTotalPurchaseAmount', () => {
    it('should calculate total purchase amount', () => {
      const cart = cartService.getCart();
      cartService.addItem(cart.id, {
        productId: 'prod-1',
        name: 'Product 1',
        price: 100,
        quantity: 1,
      });
      service.processCheckout(cart.id);

      expect(service.getTotalPurchaseAmount()).toBe(100);
    });
  });

  describe('getTotalDiscountAmount', () => {
    it('should calculate total discount amount', () => {
      const cart = cartService.getCart();
      cartService.addItem(cart.id, {
        productId: 'prod-1',
        name: 'Product 1',
        price: 100,
        quantity: 1,
      });

      const discountCode = discountService.generateCode(3);
      service.processCheckout(cart.id, discountCode!.code);

      expect(service.getTotalDiscountAmount()).toBe(10);
    });
  });
});


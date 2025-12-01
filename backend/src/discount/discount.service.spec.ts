import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException, NotFoundException } from '@nestjs/common';
import { DiscountService } from './discount.service';

describe('DiscountService', () => {
  let service: DiscountService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DiscountService],
    }).compile();

    service = module.get<DiscountService>(DiscountService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateCode', () => {
    it('should return invalid for empty code', () => {
      const result = service.validateCode('');
      expect(result.valid).toBe(false);
      expect(result.message).toBe('Discount code is required');
    });

    it('should return invalid for non-existent code', () => {
      const result = service.validateCode('INVALID-CODE');
      expect(result.valid).toBe(false);
      expect(result.message).toBe('Invalid discount code');
    });

    it('should return invalid for used code', () => {
      // Generate a code
      const code = service.generateCode(3);
      expect(code).not.toBeNull();
      
      // Mark as used
      service.markAsUsed(code!.code);
      
      // Validate should fail
      const result = service.validateCode(code!.code);
      expect(result.valid).toBe(false);
      expect(result.message).toBe('Discount code has already been used');
    });

    it('should return valid for unused code', () => {
      const code = service.generateCode(3);
      expect(code).not.toBeNull();
      
      const result = service.validateCode(code!.code);
      expect(result.valid).toBe(true);
      expect(result.discountPercent).toBe(10);
      expect(result.message).toBe('Discount code is valid');
    });

    it('should be case insensitive', () => {
      const code = service.generateCode(3);
      expect(code).not.toBeNull();
      
      const result = service.validateCode(code!.code.toLowerCase());
      expect(result.valid).toBe(true);
    });
  });

  describe('generateCode', () => {
    it('should throw error for invalid order number', () => {
      expect(() => service.generateCode(0)).toThrow(BadRequestException);
      expect(() => service.generateCode(-1)).toThrow(BadRequestException);
    });

    it('should return null for non-nth order', () => {
      expect(service.generateCode(1)).toBeNull();
      expect(service.generateCode(2)).toBeNull();
      expect(service.generateCode(4)).toBeNull();
      expect(service.generateCode(5)).toBeNull();
    });

    it('should generate code for nth order (3, 6, 9)', () => {
      const code3 = service.generateCode(3);
      expect(code3).not.toBeNull();
      expect(code3!.orderNumber).toBe(3);
      expect(code3!.discountPercent).toBe(10);
      expect(code3!.isUsed).toBe(false);
      expect(code3!.code).toMatch(/^DISCOUNT-\d{4}$/);

      const code6 = service.generateCode(6);
      expect(code6).not.toBeNull();
      expect(code6!.orderNumber).toBe(6);

      const code9 = service.generateCode(9);
      expect(code9).not.toBeNull();
      expect(code9!.orderNumber).toBe(9);
    });

    it('should return existing code if already generated for order', () => {
      const code1 = service.generateCode(3);
      const code2 = service.generateCode(3);
      
      expect(code1).toBe(code2);
      expect(code1!.code).toBe(code2!.code);
    });
  });

  describe('markAsUsed', () => {
    it('should throw error for non-existent code', () => {
      expect(() => service.markAsUsed('INVALID-CODE')).toThrow(NotFoundException);
    });

    it('should mark code as used', () => {
      const code = service.generateCode(3);
      expect(code).not.toBeNull();
      
      service.markAsUsed(code!.code);
      
      const allCodes = service.getAllDiscountCodes();
      const updatedCode = allCodes.find(c => c.code === code!.code);
      expect(updatedCode!.isUsed).toBe(true);
      expect(updatedCode!.usedAt).toBeDefined();
    });

    it('should throw error if code already used', () => {
      const code = service.generateCode(3);
      expect(code).not.toBeNull();
      
      service.markAsUsed(code!.code);
      expect(() => service.markAsUsed(code!.code)).toThrow(BadRequestException);
    });
  });

  describe('getMostRecentUnusedCode', () => {
    it('should return null when no codes exist', () => {
      expect(service.getMostRecentUnusedCode()).toBeNull();
    });

    it('should return most recent unused code', () => {
      const code3 = service.generateCode(3);
      const code6 = service.generateCode(6);
      
      const mostRecent = service.getMostRecentUnusedCode();
      expect(mostRecent).not.toBeNull();
      expect(mostRecent!.orderNumber).toBe(6); // Most recent
    });

    it('should not return used codes', () => {
      const code3 = service.generateCode(3);
      const code6 = service.generateCode(6);
      
      service.markAsUsed(code6!.code);
      
      const mostRecent = service.getMostRecentUnusedCode();
      expect(mostRecent).not.toBeNull();
      expect(mostRecent!.orderNumber).toBe(3); // Only unused code
    });

    it('should return null when all codes are used', () => {
      const code3 = service.generateCode(3);
      service.markAsUsed(code3!.code);
      
      expect(service.getMostRecentUnusedCode()).toBeNull();
    });
  });

  describe('calculateDiscountAmount', () => {
    it('should calculate 10% discount correctly', () => {
      const amount = service.calculateDiscountAmount(1000, 10);
      expect(amount).toBe(100);
    });

    it('should round to 2 decimal places', () => {
      const amount = service.calculateDiscountAmount(99.99, 10);
      expect(amount).toBe(10); // 99.99 * 10 / 100 = 9.999, rounded to 10.00
    });
  });

  describe('getNthOrder', () => {
    it('should return 3', () => {
      expect(service.getNthOrder()).toBe(3);
    });
  });
});


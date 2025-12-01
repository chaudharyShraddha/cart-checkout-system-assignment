import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import { CartService } from './cart.service';
import { AddItemDto } from '../common/dto';

describe('CartService', () => {
  let service: CartService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CartService],
    }).compile();

    service = module.get<CartService>(CartService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getCart', () => {
    it('should create new cart when no cartId provided', () => {
      const cart = service.getCart();
      expect(cart).toBeDefined();
      expect(cart.id).toMatch(/^cart-\d+$/);
      expect(cart.items).toEqual([]);
      expect(cart.total).toBe(0);
    });

    it('should throw error for non-existent cart', () => {
      expect(() => service.getCart('non-existent')).toThrow(NotFoundException);
    });

    it('should return existing cart', () => {
      const newCart = service.getCart();
      const cart = service.getCart(newCart.id);
      expect(cart.id).toBe(newCart.id);
    });
  });

  describe('addItem', () => {
    it('should add new item to cart', () => {
      const cart = service.getCart();
      const addItemDto: AddItemDto = {
        productId: 'prod-1',
        name: 'Test Product',
        price: 100,
        quantity: 1,
      };

      const updatedCart = service.addItem(cart.id, addItemDto);
      expect(updatedCart.items.length).toBe(1);
      expect(updatedCart.items[0].productId).toBe('prod-1');
      expect(updatedCart.items[0].name).toBe('Test Product');
      expect(updatedCart.items[0].price).toBe(100);
      expect(updatedCart.items[0].quantity).toBe(1);
      expect(updatedCart.total).toBe(100);
    });

    it('should update quantity for existing product', () => {
      const cart = service.getCart();
      const addItemDto: AddItemDto = {
        productId: 'prod-1',
        name: 'Test Product',
        price: 100,
        quantity: 1,
      };

      service.addItem(cart.id, addItemDto);
      const updatedCart = service.addItem(cart.id, addItemDto);
      
      expect(updatedCart.items.length).toBe(1);
      expect(updatedCart.items[0].quantity).toBe(2);
      expect(updatedCart.total).toBe(200);
    });

    it('should calculate total correctly for multiple items', () => {
      const cart = service.getCart();
      
      service.addItem(cart.id, {
        productId: 'prod-1',
        name: 'Product 1',
        price: 100,
        quantity: 2,
      });
      
      service.addItem(cart.id, {
        productId: 'prod-2',
        name: 'Product 2',
        price: 50,
        quantity: 3,
      });

      const finalCart = service.getCart(cart.id);
      expect(finalCart.items.length).toBe(2);
      expect(finalCart.total).toBe(350); // (100 * 2) + (50 * 3)
    });

    it('should throw error for negative price', () => {
      const cart = service.getCart();
      const addItemDto: AddItemDto = {
        productId: 'prod-1',
        name: 'Test Product',
        price: -10,
        quantity: 1,
      };

      expect(() => service.addItem(cart.id, addItemDto)).toThrow();
    });

    it('should throw error for zero or negative quantity', () => {
      const cart = service.getCart();
      const addItemDto: AddItemDto = {
        productId: 'prod-1',
        name: 'Test Product',
        price: 100,
        quantity: 0,
      };

      expect(() => service.addItem(cart.id, addItemDto)).toThrow();
    });
  });

  describe('removeItem', () => {
    it('should remove item from cart', () => {
      const cart = service.getCart();
      const addItemDto: AddItemDto = {
        productId: 'prod-1',
        name: 'Test Product',
        price: 100,
        quantity: 1,
      };

      const updatedCart = service.addItem(cart.id, addItemDto);
      const itemId = updatedCart.items[0].id;

      const finalCart = service.removeItem(cart.id, itemId);
      expect(finalCart.items.length).toBe(0);
      expect(finalCart.total).toBe(0);
    });

    it('should throw error for non-existent item', () => {
      const cart = service.getCart();
      expect(() => service.removeItem(cart.id, 'non-existent')).toThrow(NotFoundException);
    });

    it('should recalculate total after removal', () => {
      const cart = service.getCart();
      
      service.addItem(cart.id, {
        productId: 'prod-1',
        name: 'Product 1',
        price: 100,
        quantity: 1,
      });
      
      service.addItem(cart.id, {
        productId: 'prod-2',
        name: 'Product 2',
        price: 50,
        quantity: 1,
      });

      const cartWithItems = service.getCart(cart.id);
      const itemId = cartWithItems.items[0].id;
      
      const finalCart = service.removeItem(cart.id, itemId);
      expect(finalCart.total).toBe(50);
    });
  });

  describe('clearCart', () => {
    it('should clear all items from cart', () => {
      const cart = service.getCart();
      
      service.addItem(cart.id, {
        productId: 'prod-1',
        name: 'Product 1',
        price: 100,
        quantity: 1,
      });

      service.clearCart(cart.id);
      const clearedCart = service.getCart(cart.id);
      
      expect(clearedCart.items.length).toBe(0);
      expect(clearedCart.total).toBe(0);
    });
  });
});


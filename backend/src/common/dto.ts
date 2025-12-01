/**
 * Data Transfer Objects (DTOs)
 * 
 * Request and response DTOs for API validation
 */

import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsPositive, IsNotEmpty, IsOptional, Min } from 'class-validator';

/**
 * Add Item to Cart DTO
 */
export class AddItemDto {
  @ApiProperty({
    description: 'Product identifier',
    example: 'prod-123',
  })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({
    description: 'Product name',
    example: 'Laptop',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Unit price of the product',
    example: 999.99,
    minimum: 0,
  })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    description: 'Quantity of items to add',
    example: 2,
    minimum: 1,
  })
  @IsNumber()
  @IsPositive()
  quantity: number;
}

/**
 * Checkout DTO
 */
export class CheckoutDto {
  @ApiProperty({
    description: 'Cart ID to checkout',
    example: 'cart-1',
  })
  @IsString()
  @IsNotEmpty()
  cartId: string;

  @ApiPropertyOptional({
    description: 'Optional discount code to apply',
    example: 'DISCOUNT-1234',
  })
  @IsString()
  @IsOptional()
  discountCode?: string;
}

/**
 * Generate Discount DTO
 */
export class GenerateDiscountDto {
  @ApiProperty({
    description: 'Order number to generate discount code for (must be a multiple of 3)',
    example: 3,
    minimum: 1,
  })
  @IsNumber()
  @IsPositive()
  @IsNotEmpty()
  orderNumber: number;
}


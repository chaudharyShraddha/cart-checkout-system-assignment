/**
 * ProductList Component
 * 
 * Displays a grid of products with add to cart functionality
 * 
 * Features:
 * - Product cards with image placeholder, name, description, and price
 * - Add to cart button with loading state
 * - Error handling for failed add operations
 * 
 * @param products - Array of products to display
 * @param cartId - Current cart ID
 * @param onCartUpdate - Callback to refresh cart after adding item
 */

import React, { useState } from 'react';
import { Product } from '../types';
import { cartApi } from '../services/api';
import { formatCurrencyWithCommas } from '../utils/currency';

interface ProductListProps {
  products: Product[];
  cartId: string;
  onCartUpdate: () => void;
}

const ProductList: React.FC<ProductListProps> = ({ products, cartId, onCartUpdate }) => {
  const [addingProductId, setAddingProductId] = useState<string | null>(null);

  /**
   * Add product to cart
   * Shows loading state while adding and handles errors
   * 
   * @param product - The product to add to cart
   */
  const handleAddToCart = async (product: Product) => {
    setAddingProductId(product.id);
    try {
      await cartApi.addItem(cartId, {
        productId: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
      });
      onCartUpdate();
    } catch (error: any) {
      console.error('Error adding item to cart:', error);
      alert(error.response?.data?.message || 'Failed to add item to cart');
    } finally {
      setAddingProductId(null);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Products</h2>
        <p className="text-sm text-gray-500">{products.length} items available</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow group"
          >
            <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
              <div className="text-4xl text-gray-300">📦</div>
            </div>
            
            <div className="p-5">
              <h3 className="text-base font-semibold text-gray-900 mb-2">{product.name}</h3>
              {product.description && (
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{product.description}</p>
              )}
              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <span className="text-lg font-semibold text-gray-900">
                  {formatCurrencyWithCommas(product.price)}
                </span>
                <button
                  onClick={() => handleAddToCart(product)}
                  disabled={addingProductId === product.id}
                  className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                >
                  {addingProductId === product.id ? 'Adding...' : 'Add'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductList;


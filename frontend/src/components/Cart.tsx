/**
 * Cart Component
 * 
 * Displays the shopping cart with items and total
 * 
 * Features:
 * - Display cart items with quantity and price
 * - Remove items from cart
 * - Show cart total
 * - Checkout button (if cart has items)
 * 
 * @param cart - The cart object containing items and total
 * @param onCartUpdate - Callback function to refresh cart after changes
 * @param onCheckout - Optional callback function to navigate to checkout
 */

import React from 'react';
import { Cart as CartType, CartItem } from '../types';
import { cartApi } from '../services/api';
import { formatCurrencyWithCommas } from '../utils/currency';

interface CartProps {
  cart: CartType;
  onCartUpdate: () => void;
  onCheckout?: () => void;
}

const Cart: React.FC<CartProps> = ({ cart, onCartUpdate, onCheckout }) => {
  /**
   * Remove item from cart with user confirmation
   * 
   * @param itemId - The ID of the item to remove
   */
  const handleRemoveItem = async (itemId: string) => {
    if (!window.confirm('Are you sure you want to remove this item from cart?')) {
      return;
    }
    try {
      await cartApi.removeItem(cart.id, itemId);
      onCartUpdate();
    } catch (error) {
      console.error('Error removing item from cart:', error);
      alert('Failed to remove item from cart');
    }
  };

  if (cart.items.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg">
        <div className="p-5">
          <div className="text-center py-12">
            <p className="text-sm text-gray-500">Your cart is empty</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg">
      <div className="p-5 max-h-96 overflow-y-auto border-b border-gray-200">
        <div className="space-y-3">
          {cart.items.map((item: CartItem) => (
            <div
              key={item.id}
              className="flex items-start gap-3 pb-3 border-b border-gray-100 last:border-0"
            >
              <div className="w-16 h-16 bg-gray-100 rounded flex-shrink-0 flex items-center justify-center">
                <span className="text-xl text-gray-400">📦</span>
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 truncate">{item.name}</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {formatCurrencyWithCommas(item.price)} × {item.quantity}
                </p>
                <p className="text-sm font-medium text-gray-900 mt-1">
                  {formatCurrencyWithCommas(item.price * item.quantity)}
                </p>
              </div>
              <button
                onClick={() => handleRemoveItem(item.id)}
                className="text-gray-400 hover:text-red-600 transition-colors flex-shrink-0"
                title="Remove item"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="p-5 border-t border-gray-200 bg-gray-50">
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-medium text-gray-700">Total</span>
          <span className="text-lg font-semibold text-gray-900">
            {formatCurrencyWithCommas(cart.total)}
          </span>
        </div>
        {onCheckout && (
          <button
            onClick={onCheckout}
            className="w-full px-4 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 transition-colors"
          >
            Checkout
          </button>
        )}
      </div>
    </div>
  );
};

export default Cart;


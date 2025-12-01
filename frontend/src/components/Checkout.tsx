import React, { useState } from 'react';
import { Cart, Order } from '../types';
import { checkoutApi, discountApi } from '../services/api';
import { formatCurrencyWithCommas } from '../utils/currency';

interface CheckoutProps {
  cart: Cart;
  onCheckoutSuccess: (order: Order) => void;
  onCancel: () => void;
}

const Checkout: React.FC<CheckoutProps> = ({ cart, onCheckoutSuccess, onCancel }) => {
  const [discountCode, setDiscountCode] = useState('');
  const [discountValidation, setDiscountValidation] = useState<{
    valid: boolean;
    message: string;
    discountPercent?: number;
  } | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleValidateDiscount = async () => {
    if (!discountCode.trim()) {
      setDiscountValidation({ valid: false, message: 'Please enter a discount code' });
      return;
    }

    try {
      const result = await discountApi.validateCode(discountCode.trim());
      setDiscountValidation(result);
      setError(null);
    } catch (err: any) {
      setDiscountValidation({
        valid: false,
        message: err.response?.data?.message || 'Failed to validate discount code',
      });
    }
  };

  const handleCheckout = async () => {
    if (cart.items.length === 0) {
      setError('Cart is empty. Cannot checkout.');
      return;
    }

    setIsProcessing(true);
    setError(null);

    try {
      // Note: If no discount code provided, backend auto-applies most recent unused code
      const order = await checkoutApi.checkout({
        cartId: cart.id,
        discountCode: discountCode.trim() || undefined,
      });
      onCheckoutSuccess(order);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Checkout failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  // Calculate discount amount (10% of subtotal if valid code)
  const discountAmount = discountValidation?.valid && discountValidation.discountPercent
    ? (cart.total * discountValidation.discountPercent) / 100
    : 0;

  const finalTotal = cart.total - discountAmount;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Checkout</h2>
        <p className="text-sm text-gray-500">Review your order and complete your purchase</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="mb-6 pb-6 border-b border-gray-200">
              <h3 className="text-sm font-semibold text-gray-900 mb-4">Order Items</h3>
              <div className="space-y-3">
                {cart.items.map((item) => (
                  <div key={item.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">Qty: {item.quantity}</p>
                    </div>
                    <span className="text-sm font-medium text-gray-900">{formatCurrencyWithCommas(item.price * item.quantity)}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold text-gray-900 mb-3">Discount Code</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={discountCode}
                  onChange={(e) => {
                    setDiscountCode(e.target.value);
                    setDiscountValidation(null);
                  }}
                  placeholder="Enter discount code"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-gray-900 focus:border-gray-900 text-sm"
                />
                <button
                  onClick={handleValidateDiscount}
                  disabled={!discountCode.trim()}
                  className="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  Apply
                </button>
              </div>
              {discountValidation && (
                <div
                  className={`mt-2 p-2 rounded text-xs ${
                    discountValidation.valid
                      ? 'bg-green-50 text-green-700'
                      : 'bg-red-50 text-red-700'
                  }`}
                >
                  {discountValidation.message}
                  {discountValidation.valid && discountValidation.discountPercent && (
                    <span className="block mt-1">
                      {discountValidation.discountPercent}% discount will be applied
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
          {error && (
            <div className="bg-white border border-red-200 rounded-lg p-4">
              <div className="text-sm text-red-700">{error}</div>
            </div>
          )}
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex gap-3">
              <button
                onClick={onCancel}
                disabled={isProcessing}
                className="flex-1 px-4 py-2.5 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleCheckout}
                disabled={isProcessing || cart.items.length === 0}
                className="flex-1 px-4 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
              >
                {isProcessing ? 'Processing...' : 'Place Order'}
              </button>
            </div>
          </div>
        </div>
        <div className="lg:col-span-1">
          <div className="bg-white border border-gray-200 rounded-lg p-6 sticky top-24">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Order Summary</h3>
            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Subtotal</span>
                <span className="text-gray-900">{formatCurrencyWithCommas(cart.total)}</span>
              </div>
              {discountValidation?.valid && discountAmount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Discount</span>
                  <span className="text-green-600">-{formatCurrencyWithCommas(discountAmount)}</span>
                </div>
              )}
            </div>
            <div className="pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center">
                <span className="text-base font-semibold text-gray-900">Total</span>
                <span className="text-xl font-semibold text-gray-900">
                  {formatCurrencyWithCommas(discountValidation?.valid && discountAmount > 0 ? finalTotal : cart.total)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;


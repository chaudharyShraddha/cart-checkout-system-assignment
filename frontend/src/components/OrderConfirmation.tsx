import React from 'react';
import { Order } from '../types';
import { formatCurrencyWithCommas } from '../utils/currency';

interface OrderConfirmationProps {
  order: Order;
  onContinueShopping: () => void;
}

const OrderConfirmation: React.FC<OrderConfirmationProps> = ({ order, onContinueShopping }) => {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 max-w-2xl mx-auto">
      <div className="text-center mb-6 pb-6 border-b border-gray-200">
        <div className="inline-flex items-center justify-center w-10 h-10 bg-green-100 rounded-full mb-3">
          <svg
            className="w-5 h-5 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Order Confirmed</h2>
        <p className="text-sm text-gray-500">Thank you for your purchase</p>
      </div>

      <div className="mb-6 pb-6 border-b border-gray-200">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-500">Order Number</span>
            <span className="text-gray-900 font-medium">#{order.orderNumber}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Order ID</span>
            <span className="text-gray-900 font-mono text-xs">{order.id}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500">Order Date</span>
            <span className="text-gray-900">
              {new Date(order.createdAt).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div className="mb-6 pb-6 border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Order Items</h3>
        <div className="space-y-3">
          {order.items.map((item) => (
            <div key={item.id} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
              <div>
                <p className="text-sm font-medium text-gray-900">{item.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">Qty: {item.quantity}</p>
              </div>
              <span className="text-sm font-medium text-gray-900">{formatCurrencyWithCommas(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6 pb-6 border-b border-gray-200">
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">Subtotal</span>
            <span className="text-gray-900">{formatCurrencyWithCommas(order.subtotal)}</span>
          </div>
          {order.discountCode && order.discountAmount > 0 && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Discount ({order.discountCode})</span>
              <span className="text-green-600">-{formatCurrencyWithCommas(order.discountAmount)}</span>
            </div>
          )}
          <div className="flex justify-between items-center pt-2 border-t border-gray-100">
            <span className="text-base font-semibold text-gray-900">Total</span>
            <span className="text-lg font-semibold text-gray-900">{formatCurrencyWithCommas(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Show message for every 3rd order (discount code generated) */}
      {order.orderNumber % 3 === 0 && (
        <div className="mb-6 p-4 bg-primary-50 rounded-md border border-primary-200">
          <p className="text-sm text-primary-800">
            Congratulations! You've received a 10% discount code for being our {order.orderNumber}{order.orderNumber % 10 === 1 ? 'st' : order.orderNumber % 10 === 2 ? 'nd' : order.orderNumber % 10 === 3 ? 'rd' : 'th'} customer. Check the Admin Dashboard to see your discount code.
          </p>
        </div>
      )}

      <button
        onClick={onContinueShopping}
        className="w-full px-4 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-md hover:bg-primary-700 transition-colors"
      >
        Continue Shopping
      </button>
    </div>
  );
};

export default OrderConfirmation;


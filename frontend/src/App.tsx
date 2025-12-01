/**
 * Main App Component
 * 
 * E-commerce cart and checkout system application
 * 
 * Features:
 * - Product browsing and cart management
 * - Checkout with discount code support
 * - Order confirmation
 * - Admin dashboard for statistics
 * 
 * State Management:
 * - view: Current view state (shop, checkout, confirmation, admin)
 * - cart: Current shopping cart
 * - order: Last completed order (for confirmation view)
 * - loading: Loading state for initial cart creation
 */

import React, { useState, useEffect } from 'react';
import { Cart as CartType, Order, Product } from './types';
import { cartApi } from './services/api';
import ProductList from './components/ProductList';
import Cart from './components/Cart';
import Checkout from './components/Checkout';
import OrderConfirmation from './components/OrderConfirmation';
import AdminDashboard from './components/AdminDashboard';

/**
 * Sample products data
 * In a real application, this would be fetched from an API
 */
const SAMPLE_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    name: 'Laptop',
    price: 49999.99,
    description: 'High-performance laptop for work and gaming',
  },
  {
    id: 'prod-2',
    name: 'Smartphone',
    price: 34999.99,
    description: 'Latest model with advanced features',
  },
  {
    id: 'prod-3',
    name: 'Headphones',
    price: 9999.99,
    description: 'Wireless noise-cancelling headphones',
  },
  {
    id: 'prod-4',
    name: 'Tablet',
    price: 24999.99,
    description: '10-inch tablet perfect for reading and browsing',
  },
  {
    id: 'prod-5',
    name: 'Smart Watch',
    price: 14999.99,
    description: 'Fitness tracking and smart notifications',
  },
  {
    id: 'prod-6',
    name: 'Camera',
    price: 64999.99,
    description: 'Professional DSLR camera with lens kit',
  },
];

/**
 * View type definition
 * Represents the different views in the application
 */
type View = 'shop' | 'checkout' | 'confirmation' | 'admin';

/**
 * Main App Component
 * 
 * @returns JSX.Element - The main application component
 */
function App() {
  const [view, setView] = useState<View>('shop');
  const [cart, setCart] = useState<CartType | null>(null);
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  /**
   * Initialize cart on component mount
   * Creates a new cart when the app loads
   */
  useEffect(() => {
    const initializeCart = async () => {
      try {
        const newCart = await cartApi.getCart();
        setCart(newCart);
      } catch (error) {
        console.error('Error initializing cart:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeCart();
  }, []);

  /**
   * Handle cart update after item operations (add/remove)
   * Fetches the latest cart state from the backend
   */
  const handleCartUpdate = async () => {
    if (!cart) return;
    try {
      const updatedCart = await cartApi.getCart(cart.id);
      setCart(updatedCart);
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  /**
   * Handle successful checkout
   * Updates the order state and switches to confirmation view
   * 
   * @param orderData - The completed order data
   */
  const handleCheckoutSuccess = (orderData: Order) => {
    setOrder(orderData);
    setView('confirmation');
    setCart(null); // Clear cart after successful checkout
  };

  /**
   * Handle continue shopping after order confirmation
   * Creates a new cart and returns to the shop view
   */
  const handleContinueShopping = async () => {
    try {
      setLoading(true);
      const newCart = await cartApi.getCart();
      setCart(newCart);
      setOrder(null);
      setView('shop');
    } catch (error) {
      console.error('Error creating new cart:', error);
      alert('Failed to create a new cart. Please refresh the page.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show error only for views that require a cart (admin and confirmation don't need it)
  if (!cart && view !== 'confirmation' && view !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Failed to initialize cart</p>
          <button
            onClick={async () => {
              try {
                const newCart = await cartApi.getCart();
                setCart(newCart);
              } catch (error) {
                console.error('Error creating cart:', error);
                window.location.reload();
              }
            }}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-semibold text-gray-900">Shop</h1>
            </div>
            <nav className="flex items-center gap-1">
              <button
                onClick={() => setView('shop')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  view === 'shop'
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50'
                }`}
              >
                Products
              </button>
              <button
                onClick={() => setView('admin')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  view === 'admin'
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-600 hover:text-primary-600 hover:bg-primary-50'
                }`}
              >
                Admin
              </button>
            </nav>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {view === 'shop' && cart && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <ProductList
                products={SAMPLE_PRODUCTS}
                cartId={cart.id}
                onCartUpdate={handleCartUpdate}
              />
            </div>
            <div className="lg:col-span-1">
              <div className="lg:sticky lg:top-8">
                <div className="mb-8">
                  <h2 className="text-2xl font-semibold text-gray-900 mb-2">Cart</h2>
                  <p className="text-sm text-gray-500">{cart.items.length} {cart.items.length === 1 ? 'item' : 'items'}</p>
                </div>
                <Cart 
                  cart={cart} 
                  onCartUpdate={handleCartUpdate}
                  onCheckout={cart.items.length > 0 ? () => setView('checkout') : undefined} // Only show checkout if cart has items
                />
              </div>
            </div>
          </div>
        )}

        {view === 'checkout' && cart && (
          <Checkout
            cart={cart}
            onCheckoutSuccess={handleCheckoutSuccess}
            onCancel={() => setView('shop')}
          />
        )}

        {view === 'confirmation' && order && (
          <OrderConfirmation
            order={order}
            onContinueShopping={handleContinueShopping}
          />
        )}

        {view === 'admin' && <AdminDashboard />}
      </main>
    </div>
  );
}

export default App;

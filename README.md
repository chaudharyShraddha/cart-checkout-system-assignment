# E-commerce Cart & Checkout System

An e-commerce cart and checkout system built with Nest.js (backend) and React.js (frontend).

## Project Structure

```
cart-checkout-system-assignment/
├── backend/                        # Nest.js monolithic backend application (Port: 3001)
│   ├── src/
│   │   ├── main.ts                # Application entry point with CORS configuration
│   │   ├── app.module.ts          # Root module importing all feature modules
│   │   ├── cart/                  # Cart management module
│   │   │   ├── cart.controller.ts
│   │   │   ├── cart.module.ts
│   │   │   └── cart.service.ts
│   │   ├── checkout/              # Checkout and order processing module
│   │   │   ├── checkout.controller.ts
│   │   │   ├── checkout.module.ts
│   │   │   └── checkout.service.ts
│   │   ├── discount/              # Discount code management module
│   │   │   ├── discount.controller.ts
│   │   │   ├── discount.module.ts
│   │   │   └── discount.service.ts
│   │   └── admin/                 # Admin operations module
│   │       ├── admin.controller.ts
│   │       └── admin.module.ts
│   ├── package.json               # Backend dependencies and scripts
│   ├── tsconfig.json              # TypeScript configuration
│   ├── nest-cli.json              # Nest.js CLI configuration
│   ├── .eslintrc.json             # ESLint configuration
│   └── .prettierrc                # Prettier configuration
├── frontend/                      # React.js frontend application (Port: 3000)
│   ├── src/
│   │   ├── App.tsx
│   │   ├── index.tsx
│   │   └── index.css              # Tailwind CSS imports
│   ├── public/
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.js         # Tailwind CSS configuration
│   └── postcss.config.js          # PostCSS configuration for Tailwind
├── .gitignore
└── README.md
```

## Technology Stack

- **Backend**: Nest.js with TypeScript
- **Frontend**: React.js with Tailwind CSS
- **Architecture**: Monolithic (single Nest.js application with feature modules)
- **Storage**: In-memory (no database required)

## Features

### Customer APIs
- Add items to cart
- Checkout with discount code validation
- Automatic discount code generation for every nth order

### Admin APIs
- Generate discount codes (when nth order condition is satisfied)
- View statistics:
  - Count of items purchased
  - Total purchase amount
  - List of discount codes
  - Total discount amount

## Setup Instructions

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn

### Installation

**Phase 1: Project Setup & Dependencies ✅**

All dependencies have been installed and the project structure is ready for development.

#### What's Included in Phase 1:

1. **Monolithic Backend Architecture Setup**
   - Single Nest.js application with modular structure
   - Feature modules: Cart, Checkout, Discount, Admin
   - Backend runs on port 3001
   - CORS enabled for frontend communication
   - TypeScript configuration
   - ESLint and Prettier configured

2. **Frontend Setup**
   - React.js application with TypeScript
   - Tailwind CSS configured and ready to use
   - PostCSS configuration for Tailwind processing

3. **Dependencies Installed**
   - All Nest.js core dependencies (@nestjs/common, @nestjs/core, etc.)
   - Testing dependencies (Jest, Supertest)
   - React and React DOM
   - Tailwind CSS and PostCSS
   - Axios for HTTP requests

4. **Development Scripts**
   - Backend scripts in `backend/package.json`
   - Frontend scripts in `frontend/package.json`
   - Hot-reload enabled for backend (`start:dev`)

#### Verify Installation:

```bash
# Check if backend and frontend have node_modules (PowerShell)
Test-Path backend/node_modules
Test-Path frontend/node_modules
```

#### Reinstall Dependencies (if needed):

```bash
# Install backend dependencies
cd backend
npm install
cd ..

# Install frontend dependencies
cd frontend
npm install
cd ..
```

### Running the Application

#### Backend

Run the backend in a terminal:

```bash
cd backend
npm run start:dev
```

The backend will run on `http://localhost:3001`

#### Frontend

Run the frontend in a separate terminal:

```bash
cd frontend
npm start
```

The frontend will run on `http://localhost:3000`

## API Endpoints

All endpoints are served from the backend on `http://localhost:3001`

### Swagger Documentation

Interactive API documentation is available at `http://localhost:3001/api` when the backend is running.

### Cart Endpoints

#### Get or Create Cart
```http
GET /cart?cartId=cart-1
```

**Response:**
```json
{
  "id": "cart-1",
  "items": [],
  "total": 0
}
```

#### Add Item to Cart
```http
POST /cart/items?cartId=cart-1
Content-Type: application/json

{
  "productId": "prod-123",
  "name": "Laptop",
  "price": 49999.99,
  "quantity": 1
}
```

**Response:**
```json
{
  "id": "cart-1",
  "items": [
    {
      "id": "item-1",
      "productId": "prod-123",
      "name": "Laptop",
      "price": 49999.99,
      "quantity": 1
    }
  ],
  "total": 49999.99
}
```

#### Remove Item from Cart
```http
DELETE /cart/items/item-1?cartId=cart-1
```

### Checkout Endpoints

#### Process Checkout
```http
POST /checkout
Content-Type: application/json

{
  "cartId": "cart-1",
  "discountCode": "DISCOUNT-1234"  // Optional
}
```

**Response:**
```json
{
  "id": "order-1",
  "cartId": "cart-1",
  "items": [...],
  "subtotal": 49999.99,
  "discountCode": "DISCOUNT-1234",
  "discountAmount": 4999.99,
  "total": 45000.00,
  "orderNumber": 1,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

**Note:** If no discount code is provided, the backend automatically applies the most recent unused discount code (if available).

### Discount Endpoints

#### Validate Discount Code
```http
GET /discount/validate/DISCOUNT-1234
```

**Response:**
```json
{
  "valid": true,
  "discountPercent": 10,
  "message": "Discount code is valid"
}
```

#### Generate Discount Code (for nth order)
```http
POST /discount/generate
Content-Type: application/json

{
  "orderNumber": 3
}
```

**Response:**
```json
{
  "code": "DISCOUNT-1234",
  "discountPercent": 10,
  "isUsed": false,
  "orderNumber": 3,
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### Admin Endpoints

#### Get Store Statistics
```http
GET /admin/stats
```

**Response:**
```json
{
  "itemsPurchasedCount": 15,
  "totalPurchaseAmount": 4999.95,
  "discountCodes": [
    {
      "code": "DISCOUNT-1234",
      "discountPercent": 10,
      "isUsed": true,
      "orderNumber": 3,
      "createdAt": "2024-01-01T00:00:00.000Z",
      "usedAt": "2024-01-01T01:00:00.000Z"
    }
  ],
  "totalDiscountAmount": 99.99,
  "totalOrders": 3
}
```

#### Manually Generate Discount Code
```http
POST /admin/discount/generate
Content-Type: application/json

{
  "orderNumber": 3
}
```

**Response:**
```json
{
  "success": true,
  "discountCode": {
    "code": "DISCOUNT-1234",
    "discountPercent": 10,
    "isUsed": false,
    "orderNumber": 3,
    "createdAt": "2024-01-01T00:00:00.000Z"
  },
  "message": "Discount code generated successfully for order 3"
}
```

**Note:** Only works for order numbers that are multiples of 3 (every 3rd order).

## Usage Examples

### Example 1: Complete Shopping Flow

1. **Create a cart and add items:**
```bash
# Get a new cart
curl http://localhost:3001/cart

# Add items
curl -X POST "http://localhost:3001/cart/items?cartId=cart-1" \
  -H "Content-Type: application/json" \
  -d '{"productId":"prod-1","name":"Laptop","price":49999.99,"quantity":1}'
```

2. **Checkout:**
```bash
curl -X POST http://localhost:3001/checkout \
  -H "Content-Type: application/json" \
  -d '{"cartId":"cart-1"}'
```

3. **View order:**
```bash
curl http://localhost:3001/checkout/orders/order-1
```

### Example 2: Using Discount Codes

1. **Validate a discount code:**
```bash
curl http://localhost:3001/discount/validate/DISCOUNT-1234
```

2. **Checkout with discount code:**
```bash
curl -X POST http://localhost:3001/checkout \
  -H "Content-Type: application/json" \
  -d '{"cartId":"cart-1","discountCode":"DISCOUNT-1234"}'
```

### Example 3: Admin Operations

1. **View store statistics:**
```bash
curl http://localhost:3001/admin/stats
```

2. **Generate discount code for 3rd order:**
```bash
curl -X POST http://localhost:3001/admin/discount/generate \
  -H "Content-Type: application/json" \
  -d '{"orderNumber":3}'
```

## Development Notes

- **Storage**: All services use in-memory storage (data is lost on server restart)
- **Discount Codes**: 
  - Single-use only
  - 10% discount on entire order
  - Automatically generated for every 3rd order (3, 6, 9, 12, etc.)
  - Automatically applied to the next order after generation if no code is manually provided
- **Cart Management**: 
  - Carts are created automatically when needed
  - Items with the same productId update quantity instead of creating duplicates
- **Order Processing**: 
  - Cart is cleared after successful checkout
  - Order number increments sequentially
  - Discount codes are validated before application

## Code Quality

### Code Comments & Documentation

- ✅ **Backend**: All services, controllers, and modules have comprehensive JSDoc comments
- ✅ **Frontend**: All components and services have detailed comments explaining functionality
- ✅ **API Documentation**: Swagger/OpenAPI documentation available at `/api` endpoint
- ✅ **Type Definitions**: All interfaces and types are well-documented

### Code Standards

- **TypeScript**: Strict mode enabled for type safety
- **ESLint**: Configured for code quality and consistency
- **Prettier**: Code formatting standards enforced
- **Error Handling**: Comprehensive error handling throughout the application
- **Validation**: Input validation using class-validator DTOs

### Architecture

- **Modular Design**: Feature-based module structure
- **Separation of Concerns**: Clear separation between controllers, services, and data
- **Dependency Injection**: Nest.js dependency injection for testability
- **In-Memory Storage**: Simple Map-based storage (can be easily replaced with database)

## Project Status

### ✅ Phase 1: Project Setup - COMPLETE
- [x] Monolithic backend structure created
- [x] Nest.js backend application configured with feature modules
- [x] Backend configured to run on port 3001
- [x] CORS enabled for frontend communication
- [x] React.js frontend with Tailwind CSS configured
- [x] TypeScript configuration for backend and frontend
- [x] All dependencies installed
- [x] ESLint and Prettier configured
- [x] Development scripts configured

### ✅ Phase 2: Backend Implementation - COMPLETE
- [x] Cart module with in-memory storage
- [x] Checkout module with order processing
- [x] Discount module with validation and generation
- [x] Admin module with statistics aggregation
- [x] Inter-module communication

### ✅ Phase 3: Frontend Implementation - COMPLETE
- [x] Cart UI components
- [x] Checkout UI components
- [x] Admin dashboard
- [x] Integration with backend APIs
- [x] Product listing
- [x] Order confirmation

### ✅ Phase 4: Testing & Documentation - COMPLETE
- [x] Unit tests for all backend services
- [x] Unit tests for all frontend components
- [x] API documentation (Swagger)
- [x] Comprehensive README with examples
- [x] Code comments and JSDoc documentation

## Testing

The project includes comprehensive unit tests for both backend and frontend.

### Backend Tests

Backend tests use Jest and cover all service modules:

```bash
# Run all backend tests
cd backend
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:cov
```

**Test Coverage:**
- ✅ Cart Service (cart.service.spec.ts)
  - Cart creation and retrieval
  - Adding items to cart
  - Removing items from cart
  - Total calculation
  - Cart clearing

- ✅ Checkout Service (checkout.service.spec.ts)
  - Order processing
  - Discount code application
  - Automatic discount code generation
  - Statistics calculation

- ✅ Discount Service (discount.service.spec.ts)
  - Discount code validation
  - Discount code generation
  - Code usage tracking
  - Most recent unused code retrieval

- ✅ Admin Service (admin.service.spec.ts)
  - Statistics aggregation
  - Manual discount code generation

### Frontend Tests

Frontend tests use Jest and React Testing Library:

```bash
# Run all frontend tests
cd frontend
npm test

# Run tests in watch mode (default)
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

**Test Coverage:**
- ✅ Cart Component (Cart.test.tsx)
  - Empty cart display
  - Cart items display
  - Remove item functionality
  - Checkout button behavior

- ✅ ProductList Component (ProductList.test.tsx)
  - Product display
  - Add to cart functionality
  - Loading states
  - Error handling

- ✅ Checkout Component (Checkout.test.tsx)
  - Order summary display
  - Discount code validation
  - Checkout processing
  - Error handling

- ✅ AdminDashboard Component (AdminDashboard.test.tsx)
  - Statistics display
  - Discount code generation
  - Error handling

- ✅ OrderConfirmation Component (OrderConfirmation.test.tsx)
  - Order details display
  - Discount information
  - Continue shopping functionality

- ✅ Currency Utils (currency.test.ts)
  - Currency formatting with Indian Rupees
  - Number formatting with commas

### Running All Tests

To run all tests for both backend and frontend:

```bash
# Backend tests
cd backend && npm test && cd ..

# Frontend tests
cd frontend && npm test -- --watchAll=false && cd ..
```

### Test Best Practices

- All tests are isolated and don't depend on external services
- Mock data is used for API calls
- Tests cover both success and error scenarios
- Edge cases are tested (empty carts, invalid codes, etc.)

## Troubleshooting

### Common Issues

1. **Port Already in Use**
   - Backend: Change port in `backend/src/main.ts` or set `PORT` environment variable
   - Frontend: Change port in `frontend/package.json` scripts or set `PORT` environment variable

2. **CORS Errors**
   - Ensure backend is running on port 3001
   - Check CORS configuration in `backend/src/main.ts`

3. **Tests Failing**
   - Ensure all dependencies are installed: `npm install` in both directories
   - Clear Jest cache: `npm test -- --clearCache`

4. **TypeScript Errors**
   - Run `npm run build` to check for type errors
   - Ensure all dependencies are properly installed

## Contributing

1. Follow the existing code style and structure
2. Add tests for new features
3. Update documentation (README and code comments)
4. Ensure all tests pass before submitting

## License

ISC


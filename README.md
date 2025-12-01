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

### Cart Endpoints
- `POST /cart/items` - Add item to cart
- `GET /cart` - Get cart contents
- `DELETE /cart/items/:itemId` - Remove item from cart

### Checkout Endpoints
- `POST /checkout` - Process checkout
  - Body: `{ cartId, discountCode? }`

### Discount Endpoints
- `GET /discount/validate/:code` - Validate discount code
- `POST /discount/generate` - Generate discount code (for nth order)

### Admin Endpoints
- `GET /admin/stats` - Get store statistics
- `POST /admin/discount/generate` - Manually generate discount code

## Development Notes

- All services use in-memory storage
- Discount codes are single-use
- Every nth order automatically generates a discount code
- Discount applies to the entire order (10% off)

## Project Status

### Phase 1: Project Setup ✅ COMPLETE
- [x] Monolithic backend structure created
- [x] Nest.js backend application configured with feature modules (cart, checkout, discount, admin)
- [x] Backend configured to run on port 3001
- [x] CORS enabled for frontend communication
- [x] React.js frontend with Tailwind CSS configured
- [x] TypeScript configuration for backend and frontend
- [x] All dependencies installed (backend and frontend)
- [x] ESLint and Prettier configured in backend
- [x] Development scripts configured in backend/package.json
- [x] Basic module skeletons with placeholder endpoints
- [x] .gitignore configured for Node.js projects

### Phase 2: Backend Implementation (Next)
- [ ] Implement cart module with in-memory storage
- [ ] Implement checkout module with order processing
- [ ] Implement discount module with validation and generation
- [ ] Implement admin module with statistics aggregation
- [ ] Add inter-module communication

### Phase 3: Frontend Implementation
- [ ] Create cart UI components
- [ ] Create checkout UI components
- [ ] Create admin dashboard
- [ ] Integrate with backend APIs

### Phase 4: Testing & Documentation
- [ ] Write unit tests for all services
- [ ] Write integration tests
- [ ] Complete API documentation
- [ ] Update README with examples

## Testing

Unit tests will be added for each module. Run tests with:

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## License

ISC


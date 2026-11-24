# Procurement & Inventory Service API

NestJS-based microservice for managing inventory items, stock movements, and purchase orders using MySQL.

**Base URL**: `/api/v1`
**Tech Stack**: NestJS + MySQL

## Getting Started

### Prerequisites
- Node.js 20+
- npm 10+
- MySQL 8+

### Installation

```bash
npm install
```

### Environment Setup

Copy `.env.example` to `.env` and update the database credentials:

```bash
cp .env.example .env
```

### Running the Application

```bash
# Development mode
npm run start:dev

# Production mode
npm run start:prod
```

The service will start on port 3001 (or as specified in `.env`).

### Development Commands

```bash
# Build the application
npm run build

# Format code
npm run format

# Run linter
npm run lint

# Run tests
npm run test

# Watch mode tests
npm run test:watch

# Coverage report
npm run test:cov
```

## API Endpoints

### Inventory Management
- `POST /api/v1/inventory/items` - Create inventory item
- `GET /api/v1/inventory/availability` - Get stock availability
- `POST /api/v1/inventory/movements` - Record stock movement

### Purchase Orders
- `POST /api/v1/purchase-orders` - Create purchase order
- `POST /api/v1/purchase-orders/{id}/receipts` - Receive purchase order
- `GET /api/v1/purchase-orders` - List purchase orders

## Project Structure

```
src/
├── modules/
│   ├── inventory/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── entities/
│   │   └── inventory.module.ts
│   └── purchase-orders/
│       ├── controllers/
│       ├── services/
│       ├── entities/
│       └── purchase-orders.module.ts
├── common/
├── app.module.ts
└── main.ts
```

## Documentation

For detailed API specifications, see [procurement_inventory_api.md](../../procurement_inventory_api.md)

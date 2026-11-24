# Procurement & Inventory Service API

**Platform**: Multi-Tenant B2B SaaS  
**Base URL**: `/api/v1`  
**Tech Stack**: NestJS + MySQL  
**Authentication**: Bearer Token (JWT) + X-Tenant-ID header

---

## Table of Contents

1. [Material & Inventory](#material--inventory)
2. [Purchase Orders](#purchase-orders)
3. [Budget & Costing](#budget--costing)
4. [Common Response Structures](#common-response-structures)

---

## Material & Inventory

### 1. GET /material

Fetch inventory items with filters and pagination.

**Query Parameters:**

- `depot` (optional): "All Depots", "Central Hub Bay A", "North Sub-Depot", "Mobile Fleet Vans"
- `stockLevel` (optional): "All", "In Stock", "Low Stock", "Out of Stock"
- `category` (optional): "All", "Plumbing", "HVAC", "Supplies"
- `search` (optional): search by item name or SKU
- `sortBy` (optional): "Most Critical", "Available", "Value", "SKU"
- `page` (optional, default: 1)
- `limit` (optional, default: 50)

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "items": [
      {
        "id": 1,
        "name": "3/4\" PEX-A Flexible Tubing 100ft",
        "sku": "PLM-PEX-075",
        "category": "Plumbing",
        "onHand": "42 coils",
        "staged": "14 coils",
        "available": "28 coils",
        "location": "Central Hub Bay 22",
        "status": "In Stock",
        "statusTone": "success"
      },
      {
        "id": 2,
        "name": "Honeywell T9 Smart Thermostat",
        "sku": "HVAC-HON-T9",
        "category": "HVAC",
        "onHand": "8 units",
        "staged": "6 units",
        "available": "2 units",
        "location": "Central Hub Bay 15",
        "status": "Low Stock (min: 4)",
        "statusTone": "warning"
      },
      {
        "id": 3,
        "name": "Victaulic Couplings 2\"",
        "sku": "PLM-VIC-200",
        "category": "Plumbing",
        "onHand": "0 units",
        "available": "0 units",
        "status": "Critical • 2 Inbound PO",
        "statusTone": "danger"
      }
    ],
    "stats": {
      "totalInventoryValuation": "$284,650",
      "activeSKUs": 1420,
      "reservedAllocated": "42 items",
      "lowStockReorders": 5,
      "inboundPoPipeline": "$18,200"
    },
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 1420,
      "pages": 29
    }
  }
}
```

### 2. GET /material/{itemId}

Fetch single inventory item with history.

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "3/4\" PEX-A Flexible Tubing 100ft",
    "sku": "PLM-PEX-075",
    "category": "Plumbing",
    "onHand": "42 coils",
    "staged": "14 coils",
    "available": "28 coils",
    "location": "Central Hub Bay 22",
    "status": "In Stock",
    "statusTone": "success",
    "unitCost": "$15.50",
    "totalValue": "$651.00",
    "reorderPoint": 10,
    "reorderQuantity": 50,
    "lastRestockDate": "2024-10-15",
    "supplier": "Ferguson Supply",
    "recentMovements": [
      {
        "date": "2024-10-21",
        "type": "Staged",
        "quantity": "2 coils",
        "project": "PRJ-SK-401"
      },
      {
        "date": "2024-10-20",
        "type": "Received",
        "quantity": "50 coils",
        "poNumber": "PO-2024-142"
      }
    ]
  }
}
```

### 3. POST /material/transfer

Transfer inventory between locations.

**Request Body:**

```json
{
  "itemId": 1,
  "fromLocation": "Central Hub Bay 22",
  "toLocation": "Mobile Fleet Van #04",
  "quantity": "5 coils",
  "reason": "Project staging",
  "projectId": "PRJ-SK-401"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Inventory transferred successfully",
  "data": {
    "itemId": 1,
    "newLocation": "Mobile Fleet Van #04",
    "newOnHand": "37 coils",
    "newStaged": "19 coils",
    "transferId": "TRF-2024-0421"
  }
}
```

---

## Purchase Orders

### 4. POST /purchase-orders

Create a new purchase order.

**Request Body:**

```json
{
  "supplierId": "sup-444",
  "requestedDeliveryDate": "2024-10-25T00:00:00Z",
  "lines": [
    {
      "itemId": 1,
      "quantity": 100,
      "unitPrice": 25.5
    },
    {
      "itemId": 2,
      "quantity": 15,
      "unitPrice": 89.99
    }
  ]
}
```

**Response (201 Created):**

```json
{
  "success": true,
  "message": "Purchase order created successfully",
  "data": {
    "id": "po-2024-001",
    "supplierId": "sup-444",
    "status": "draft",
    "totalAmount": 3819.5,
    "createdAt": "2024-10-21T09:15:00Z"
  }
}
```

### 5. GET /purchase-orders

List all purchase orders with filters and pagination.

**Query Parameters:**

- `status` (optional): "All", "Draft", "Submitted", "Approved", "Received", "Invoiced"
- `supplier` (optional): filter by supplier ID
- `dateRange` (optional): "This Week", "This Month", "All Time"
- `page` (optional, default: 1)
- `limit` (optional, default: 50)

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "purchaseOrders": [
      {
        "id": "po-2024-001",
        "supplierId": "sup-444",
        "supplierName": "Ferguson Supply",
        "status": "draft",
        "totalAmount": 3819.5,
        "lineItems": 2,
        "requestedDeliveryDate": "2024-10-25",
        "createdAt": "2024-10-21T09:15:00Z"
      },
      {
        "id": "po-2024-002",
        "supplierId": "sup-556",
        "supplierName": "Honeywell Distribution",
        "status": "approved",
        "totalAmount": 1250.0,
        "lineItems": 1,
        "requestedDeliveryDate": "2024-10-23",
        "createdAt": "2024-10-20T14:30:00Z"
      }
    ],
    "stats": {
      "totalPendingOrders": 8,
      "totalPoPipeline": "$45,230",
      "averageLeadTime": "5 days"
    },
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 24,
      "pages": 1
    }
  }
}
```

### 6. GET /purchase-orders/{orderId}

Fetch single purchase order with details.

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": "po-2024-001",
    "supplierId": "sup-444",
    "supplierName": "Ferguson Supply",
    "supplierContact": "+1-800-555-0123",
    "status": "draft",
    "totalAmount": 3819.5,
    "createdAt": "2024-10-21T09:15:00Z",
    "requestedDeliveryDate": "2024-10-25T00:00:00Z",
    "lines": [
      {
        "id": 1,
        "itemId": 1,
        "itemName": "3/4\" PEX-A Flexible Tubing 100ft",
        "quantity": 100,
        "unitPrice": 25.5,
        "lineTotal": 2550.0
      },
      {
        "id": 2,
        "itemId": 2,
        "itemName": "Honeywell T9 Smart Thermostat",
        "quantity": 15,
        "unitPrice": 89.99,
        "lineTotal": 1349.85
      }
    ],
    "history": [
      {
        "status": "draft",
        "timestamp": "2024-10-21T09:15:00Z",
        "actor": "Warehouse Manager"
      }
    ]
  }
}
```

### 7. POST /purchase-orders/{orderId}/receipts

Record receipt of purchase order items.

**Request Body:**

```json
{
  "receivedLines": [
    {
      "itemId": 1,
      "quantityReceived": 100,
      "quantityAccepted": 100,
      "notes": "All items in good condition"
    },
    {
      "itemId": 2,
      "quantityReceived": 15,
      "quantityAccepted": 15,
      "notes": "Verified packaging integrity"
    }
  ],
  "receivedAt": "2024-10-24T14:00:00Z",
  "receiverName": "John Warehouse"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Purchase order received successfully",
  "data": {
    "purchaseOrderId": "po-2024-001",
    "status": "received",
    "itemsReceived": 2,
    "movementsGenerated": 2,
    "inventoryUpdated": true,
    "receivedAt": "2024-10-24T14:00:00Z"
  }
}
```

---

## Budget & Costing

### 8. GET /budget

Fetch financial ledger with contracts and cash flow.

**Query Parameters:**

- `filter` (optional): "All", "Direct", "Partner", "Subcontractor"
- `dateRange` (optional): "This Month", "Last 3 Months", "Year to Date", "All Time"
- `page` (optional, default: 1)
- `limit` (optional, default: 50)

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "contracts": [
      {
        "id": "PRJ-SK-401",
        "name": "Skyline Tower",
        "budget": 340000,
        "cost": 214800,
        "billed": 280000,
        "margin": 18,
        "completion": 70,
        "type": "Direct"
      },
      {
        "id": "BK-PR-4019",
        "name": "Metro Plaza Shopping Center",
        "budget": 185000,
        "cost": 78200,
        "billed": 95000,
        "margin": 18.5,
        "completion": 45,
        "type": "Partner"
      },
      {
        "id": "PRJ-GV-209",
        "name": "Greenfield Villa Residences",
        "budget": 95000,
        "cost": 42100,
        "billed": 0,
        "margin": 22,
        "completion": 50,
        "type": "Direct"
      }
    ],
    "cashFlowData": [
      { "month": "Oct", "revenue": 156000, "cost": 89000 },
      { "month": "Nov", "revenue": 182000, "cost": 105000 },
      { "month": "Dec", "revenue": 198000, "cost": 112000 }
    ],
    "approvalsQueue": [
      {
        "title": "CO #04 Skyline",
        "amount": "+$4,850.00",
        "description": "480V Arc Flash Study",
        "status": "pending"
      },
      {
        "title": "EXP #884",
        "amount": "$320",
        "description": "Hydrojet nozzle",
        "status": "pending"
      }
    ],
    "stats": {
      "totalContractWip": "$1,480,250",
      "grossMargin": "52.8%",
      "pendingReceivables": "$94,320",
      "partnerShare": "$384,150",
      "mtdDirectCosts": "$142,680"
    },
    "pagination": {
      "page": 1,
      "limit": 50,
      "total": 18,
      "pages": 1
    }
  }
}
```

### 9. GET /budget/{contractId}

Fetch single contract with detailed financials and line items.

**Response (200 OK):**

```json
{
  "success": true,
  "data": {
    "id": "PRJ-SK-401",
    "name": "Skyline Tower",
    "client": "Skyline Property Group",
    "type": "Direct Commercial",
    "budget": 340000,
    "spent": 214800,
    "billed": 280000,
    "margin": 18,
    "completion": 70,
    "lineItems": [
      {
        "id": "li-001",
        "description": "3-Phase Panel Upgrade",
        "budgeted": 120000,
        "spent": 89500,
        "billed": 120000,
        "margin": 25.6
      },
      {
        "id": "li-002",
        "description": "Chiller Plant Overhaul",
        "budgeted": 220000,
        "spent": 125300,
        "billed": 160000,
        "margin": 21.8
      }
    ],
    "invoices": [
      {
        "id": "INV-2024-0401",
        "amount": 120000,
        "date": "2024-10-15",
        "status": "Paid"
      },
      {
        "id": "INV-2024-0402",
        "amount": 95000,
        "date": "2024-10-20",
        "status": "Pending"
      },
      {
        "id": "INV-2024-0403",
        "amount": 65000,
        "date": "2024-10-21",
        "status": "Draft"
      }
    ],
    "changeOrders": [
      {
        "id": "CO #04",
        "description": "480V Arc Flash Study",
        "amount": 4850,
        "status": "Pending Approval"
      }
    ]
  }
}
```

### 10. POST /budget/approval

Approve or reject financial items (change orders, expenses, invoices).

**Request Body:**

```json
{
  "itemType": "change_order",
  "itemId": "CO #04",
  "action": "approve",
  "approverComments": "Approved by PM - required for safety compliance",
  "approverName": "Project Manager"
}
```

**Response (200 OK):**

```json
{
  "success": true,
  "message": "Item approved successfully",
  "data": {
    "itemId": "CO #04",
    "previousStatus": "Pending Approval",
    "newStatus": "Approved",
    "approvedAt": "2024-10-21T16:30:00Z",
    "approvedBy": "Project Manager"
  }
}
```

---

## Common Response Structures

### Success Response Format

```json
{
  "success": true,
  "data": {
    // Endpoint-specific data
  }
}
```

### Error Response Format

```json
{
  "success": false,
  "error": {
    "code": "INVALID_TENANT",
    "message": "Invalid or missing X-Tenant-ID header",
    "details": {
      "header": "X-Tenant-ID",
      "issue": "Required"
    }
  }
}
```

### Status Codes

| Code | Meaning                  |
| ---- | ------------------------ |
| 200  | Success                  |
| 201  | Created                  |
| 400  | Bad Request              |
| 401  | Unauthorized             |
| 403  | Forbidden (wrong tenant) |
| 404  | Not Found                |
| 422  | Validation Error         |
| 429  | Rate Limited             |
| 500  | Server Error             |

### Authentication Headers (Every Request)

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
X-Tenant-ID: 550e8400-e29b-41d4-a716-446655440000
Content-Type: application/json
```

### Pagination

All list endpoints support pagination:

```
GET /purchase-orders?page=1&limit=50
```

**Response includes:**

```json
{
  "pagination": {
    "page": 1,
    "limit": 50,
    "total": 1420,
    "pages": 29,
    "hasMore": true
  }
}
```

### Multi-Tenant Isolation

- Every request requires `X-Tenant-ID` header
- All data is scoped to tenant
- JWT tokens are tenant-specific
- No cross-tenant data access possible
- All database queries filtered by tenant_id

### Stock Status Indicators

| Status    | Meaning                                  | Color |
| --------- | ---------------------------------------- | ----- |
| In Stock  | Available quantity > reorder point       | Green |
| Low Stock | Available quantity ≤ reorder point       | Amber |
| Critical  | Out of stock or below critical threshold | Red   |
| On Order  | Items on inbound purchase orders         | Blue  |

### Financial Status Indicators

| Status           | Meaning                    |
| ---------------- | -------------------------- |
| Draft            | Not yet submitted          |
| Pending Approval | Awaiting PM/Finance review |
| Approved         | Ready for processing       |
| Rejected         | Denied by approver         |
| Invoiced         | Sent to customer           |
| Paid             | Payment received           |

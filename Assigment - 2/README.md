# MongoDB E-commerce Queries

A collection of MongoDB queries for managing an e-commerce platform with customer and order data.

## Collections Structure

### Customers Collection
```javascript
{
  "_id": ObjectId,
  "name": String,
  "email": String,
  "address": {
    "street": String,
    "city": String,
    "zipcode": String
  },
  "phone": String,
  "registration_date": Date
}
```

### Orders Collection
```javascript
{
  "_id": ObjectId,
  "order_id": String,
  "customer_id": ObjectId,
  "order_date": Date,
  "status": String,
  "items": Array,
  "total_value": Number
}
```

## Features

- Basic CRUD operations
- Aggregation pipelines
- Customer-Order relationship queries
- Advanced analytics queries

## Key Operations

1. **Customer Management**
   - Create new customers
   - Find customer details
   - Update customer information

2. **Order Management**
   - Create new orders
   - Update order status
   - Delete orders
   - Find orders by customer

3. **Analytics**
   - Calculate total order values
   - Find top customers
   - Analyze order patterns
   - Track customer purchasing history

## Usage Examples

```javascript
// Find all orders for a customer
db.orders.find({ customer_id: customer._id })

// Get top 3 customers by order value
db.orders.aggregate([
  {
    $group: {
      _id: "$customer_id",
      totalSpent: { $sum: "$total_value" }
    }
  },
  { $sort: { totalSpent: -1 } },
  { $limit: 3 }
])
```

## Requirements

- MongoDB 4.4+
- Basic understanding of MongoDB aggregation pipeline
- Knowledge of JavaScript/Node.js

## Setup

1. Create the required collections:
```javascript
db.createCollection("customers")
db.createCollection("orders")
```

2. Import the queries file
3. Execute desired operations


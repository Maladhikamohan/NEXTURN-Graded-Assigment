// Part 1: Basic MongoDB Commands and Queries

// 1. Create Collections and Insert Data
// Create customers collection
db.createCollection("customers")
db.createCollection("orders")

// Insert customer documents
db.customers.insertMany([
  {
    _id: ObjectId(),
    name: "John Doe",
    email: "johndoe@example.com",
    address: {
      street: "123 Main St",
      city: "Springfield",
      zipcode: "12345"
    },
    phone: "555-1234",
    registration_date: ISODate("2023-01-01T12:00:00Z")
  },
  {
    _id: ObjectId(),
    name: "Jane Smith",
    email: "janesmith@example.com",
    address: {
      street: "456 Oak Ave",
      city: "Springfield",
      zipcode: "12346"
    },
    phone: "555-5678",
    registration_date: ISODate("2023-02-01T12:00:00Z")
  }
  // ... Add 3 more customers
])

// Insert order documents
db.orders.insertMany([
  {
    _id: ObjectId(),
    order_id: "ORD123456",
    customer_id: ObjectId("customer_id_here"), // Reference to John Doe
    order_date: ISODate("2023-05-15T14:00:00Z"),
    status: "shipped",
    items: [
      {
        product_name: "Laptop",
        quantity: 1,
        price: 1500
      },
      {
        product_name: "Mouse",
        quantity: 2,
        price: 25
      }
    ],
    total_value: 1550
  }
  // ... Add 4 more orders
])

// 2. Find Orders for a Specific Customer
db.customers.findOne(
  { name: "John Doe" },
  { _id: 1 }
).then(customer => {
  db.orders.find({ customer_id: customer._id })
})

// Alternative using aggregation
db.orders.aggregate([
  {
    $lookup: {
      from: "customers",
      localField: "customer_id",
      foreignField: "_id",
      as: "customer"
    }
  },
  {
    $match: {
      "customer.name": "John Doe"
    }
  }
])

// 3. Find Customer for Specific Order
db.orders.aggregate([
  {
    $match: { order_id: "ORD123456" }
  },
  {
    $lookup: {
      from: "customers",
      localField: "customer_id",
      foreignField: "_id",
      as: "customer"
    }
  },
  {
    $unwind: "$customer"
  }
])

// 4. Update Order Status
db.orders.updateOne(
  { order_id: "ORD123456" },
  { $set: { status: "delivered" } }
)

// 5. Delete an Order
db.orders.deleteOne({ order_id: "ORD123456" })

// Part 2: Aggregation Pipeline

// 1. Calculate Total Value of All Orders by Customer
db.orders.aggregate([
  {
    $lookup: {
      from: "customers",
      localField: "customer_id",
      foreignField: "_id",
      as: "customer"
    }
  },
  {
    $unwind: "$customer"
  },
  {
    $group: {
      _id: "$customer_id",
      customerName: { $first: "$customer.name" },
      totalOrderValue: { $sum: "$total_value" }
    }
  }
])

// 2. Group Orders by Status
db.orders.aggregate([
  {
    $group: {
      _id: "$status",
      count: { $sum: 1 }
    }
  }
])

// 3. List Customers with Their Recent Orders
db.customers.aggregate([
  {
    $lookup: {
      from: "orders",
      localField: "_id",
      foreignField: "customer_id",
      as: "orders"
    }
  },
  {
    $addFields: {
      mostRecentOrder: {
        $max: "$orders"
      }
    }
  },
  {
    $project: {
      name: 1,
      email: 1,
      "mostRecentOrder.order_id": 1,
      "mostRecentOrder.total_value": 1,
      "mostRecentOrder.order_date": 1
    }
  }
])

// 4. Find Most Expensive Order by Customer
db.orders.aggregate([
  {
    $lookup: {
      from: "customers",
      localField: "customer_id",
      foreignField: "_id",
      as: "customer"
    }
  },
  {
    $unwind: "$customer"
  },
  {
    $sort: { total_value: -1 }
  },
  {
    $group: {
      _id: "$customer_id",
      customerName: { $first: "$customer.name" },
      order: { 
        $first: {
          order_id: "$order_id",
          total_value: "$total_value"
        }
      }
    }
  }
])

// Part 3: Real-World Scenario

// 1. Find Customers with Orders in Last 30 Days
db.customers.aggregate([
  {
    $lookup: {
      from: "orders",
      localField: "_id",
      foreignField: "customer_id",
      as: "recent_orders"
    }
  },
  {
    $match: {
      "recent_orders.order_date": {
        $gte: new Date(new Date().setDate(new Date().getDate() - 30))
      }
    }
  },
  {
    $project: {
      name: 1,
      email: 1,
      most_recent_order: {
        $max: "$recent_orders.order_date"
      }
    }
  }
])

// 2. Find All Products Ordered by Specific Customer
db.orders.aggregate([
  {
    $lookup: {
      from: "customers",
      localField: "customer_id",
      foreignField: "_id",
      as: "customer"
    }
  },
  {
    $match: {
      "customer.name": "John Doe"
    }
  },
  {
    $unwind: "$items"
  },
  {
    $group: {
      _id: "$items.product_name",
      totalQuantity: { $sum: "$items.quantity" }
    }
  }
])

// 3. Top 3 Customers by Order Value
db.orders.aggregate([
  {
    $lookup: {
      from: "customers",
      localField: "customer_id",
      foreignField: "_id",
      as: "customer"
    }
  },
  {
    $unwind: "$customer"
  },
  {
    $group: {
      _id: "$customer_id",
      customerName: { $first: "$customer.name" },
      totalSpent: { $sum: "$total_value" }
    }
  },
  {
    $sort: { totalSpent: -1 }
  },
  {
    $limit: 3
  }
])

// 4. Add New Order for Existing Customer
db.customers.findOne(
  { name: "Jane Smith" },
  { _id: 1 }
).then(customer => {
  db.orders.insertOne({
    order_id: "ORD" + new Date().getTime(),
    customer_id: customer._id,
    order_date: new Date(),
    status: "pending",
    items: [
      {
        product_name: "Smartphone",
        quantity: 1,
        price: 999
      },
      {
        product_name: "Headphones",
        quantity: 1,
        price: 199
      }
    ],
    total_value: 1198
  })
})

// Part 4: Bonus Challenge

// 1. Find Customers with No Orders
db.customers.aggregate([
  {
    $lookup: {
      from: "orders",
      localField: "_id",
      foreignField: "customer_id",
      as: "orders"
    }
  },
  {
    $match: {
      orders: { $size: 0 }
    }
  },
  {
    $project: {
      name: 1,
      email: 1
    }
  }
])

// 2. Average Items per Order
db.orders.aggregate([
  {
    $project: {
      numberOfItems: { $size: "$items" }
    }
  },
  {
    $group: {
      _id: null,
      averageItems: { $avg: "$numberOfItems" }
    }
  }
])

// 3. Join Customer and Order Data
db.customers.aggregate([
  {
    $lookup: {
      from: "orders",
      localField: "_id",
      foreignField: "customer_id",
      as: "orders"
    }
  },
  {
    $unwind: "$orders"
  },
  {
    $project: {
      name: 1,
      email: 1,
      "orders.order_id": 1,
      "orders.total_value": 1,
      "orders.order_date": 1
    }
  }
])
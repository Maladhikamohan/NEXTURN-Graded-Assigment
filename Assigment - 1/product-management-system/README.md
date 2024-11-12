# Product Management System

A simple JavaScript system for managing product inventory, prices, and categories.

## Features
- Add and manage products
- Update prices
- Filter by availability
- Filter by category
- Simple error handling

## Quick Start
```bash
# Clone repository
git clone https://github.com/yourusername/product-management-system.git

# Install dependencies
npm install
```

## Usage
```javascript
const ProductManager = require('./ProductManager');
const shop = new ProductManager();

// Add product
shop.addProduct("p1", "Laptop", "Electronics", 999.99);

// Update price
shop.updatePrice("p1", 899.99);

// Get available products
shop.getAvailableProducts();

// Get by category
shop.getProductsByCategory("Electronics");
```

## Methods
- `addProduct(id, name, category, price, available)`
- `updatePrice(id, newPrice)`
- `getAvailableProducts()`
- `getProductsByCategory(category)`
- `getAllProducts()`

## Project Structure
```
product-management-system/
├── ProductManager.js    # Main class
├── example.js          # Usage examples
└── README.md           # Documentation

---
Created by  MALADHIKA MOHAN
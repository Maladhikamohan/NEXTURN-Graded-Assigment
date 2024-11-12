// example.js
const ProductManager = require('./ProductManager');

// Create a new product manager
const shop = new ProductManager();

// Add some products
console.log(shop.addProduct('1', 'Laptop', 'Electronics', 999.99));
console.log(shop.addProduct('2', 'Headphones', 'Electronics', 99.99, false));
console.log(shop.addProduct('3', 'Mouse', 'Electronics', 29.99));

// Update a price
console.log(shop.updatePrice('1', 899.99));

// Get available products
console.log('Available Products:', shop.getAvailableProducts());

// Get electronics
console.log('Electronics:', shop.getProductsByCategory('Electronics'));
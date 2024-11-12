// ProductManager.js
class ProductManager {
    constructor() {
        this.products = [];
    }

    // Add a new product
    addProduct(id, name, category, price, available) {
        // Validate inputs
        if (!id || !name || !category || price === undefined) {
            return { success: false, message: 'All fields are required' };
        }

        // Check for duplicate ID
        if (this.products.some(p => p.id === id)) {
            return { success: false, message: 'Product ID already exists' };
        }

        const newProduct = {
            id,
            name,
            category,
            price,
            available: available ?? true // defaults to true if not specified
        };

        this.products.push(newProduct);
        return { success: true, message: 'Product added successfully', data: newProduct };
    }

    // Update product price
    updatePrice(id, newPrice) {
        if (newPrice < 0) {
            return { success: false, message: 'Price cannot be negative' };
        }

        const product = this.products.find(p => p.id === id);
        if (!product) {
            return { success: false, message: 'Product not found' };
        }

        product.price = newPrice;
        return { success: true, message: 'Price updated successfully', data: product };
    }

    // Get available products
    getAvailableProducts() {
        const available = this.products.filter(p => p.available);
        return { success: true, data: available };
    }

    // Get products by category
    getProductsByCategory(category) {
        const products = this.products.filter(p => p.category === category);
        return { success: true, data: products };
    }

    // Get all products
    getAllProducts() {
        return { success: true, data: this.products };
    }
}

module.exports = ProductManager;
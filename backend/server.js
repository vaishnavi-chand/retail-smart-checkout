const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// Sample product data
const products = [
  { id: 1, name: 'Apple', price: 1.50, category: 'Fruits' },
  { id: 2, name: 'Banana', price: 0.75, category: 'Fruits' },
  { id: 3, name: 'Orange', price: 1.25, category: 'Fruits' },
  { id: 4, name: 'Milk', price: 3.99, category: 'Dairy' },
  { id: 5, name: 'Bread', price: 2.49, category: 'Bakery' },
  { id: 6, name: 'Eggs', price: 4.99, category: 'Dairy' },
  { id: 7, name: 'Chicken Breast', price: 8.99, category: 'Meat' },
  { id: 8, name: 'Rice', price: 3.49, category: 'Grains' },
  { id: 9, name: 'Pasta', price: 1.99, category: 'Grains' },
  { id: 10, name: 'Tomato', price: 2.25, category: 'Vegetables' }
];

// In-memory storage for orders (in production, use a database)
const orders = [];

// 1. Product search endpoint
app.get('/api/products/search', (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({ error: 'Search query parameter "q" is required' });
    }

    const searchTerm = q.toLowerCase();
    const filteredProducts = products.filter(product =>
      product.name.toLowerCase().includes(searchTerm) ||
      product.category.toLowerCase().includes(searchTerm)
    );

    res.json({
      success: true,
      query: q,
      results: filteredProducts,
      count: filteredProducts.length
    });
  } catch (error) {
    console.error('Error in product search:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 2. Checkout endpoint that calculates the total of the cart
app.post('/api/checkout', (req, res) => {
  try {
    const { cart } = req.body;

    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({ error: 'Cart must be a non-empty array of items' });
    }

    let total = 0;
    const cartItems = [];

    for (const item of cart) {
      if (!item.id || !item.quantity || item.quantity <= 0) {
        return res.status(400).json({
          error: 'Each cart item must have an id and a positive quantity'
        });
      }

      const product = products.find(p => p.id === item.id);
      if (!product) {
        return res.status(400).json({
          error: `Product with id ${item.id} not found`
        });
      }

      const itemTotal = product.price * item.quantity;
      total += itemTotal;

      cartItems.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        itemTotal: itemTotal
      });
    }

    res.json({
      success: true,
      cart: cartItems,
      subtotal: total,
      tax: total * 0.08, // 8% tax
      total: total * 1.08
    });
  } catch (error) {
    console.error('Error in checkout:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// 3. Place order endpoint that returns orderID and logs the event
app.post('/api/orders', (req, res) => {
  try {
    const { cart, customerInfo } = req.body;

    if (!cart || !Array.isArray(cart) || cart.length === 0) {
      return res.status(400).json({ error: 'Cart must be a non-empty array of items' });
    }

    // Calculate total (similar to checkout endpoint)
    let subtotal = 0;
    const orderItems = [];

    for (const item of cart) {
      if (!item.id || !item.quantity || item.quantity <= 0) {
        return res.status(400).json({
          error: 'Each cart item must have an id and a positive quantity'
        });
      }

      const product = products.find(p => p.id === item.id);
      if (!product) {
        return res.status(400).json({
          error: `Product with id ${item.id} not found`
        });
      }

      const itemTotal = product.price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
        itemTotal: itemTotal
      });
    }

    const tax = subtotal * 0.08;
    const total = subtotal + tax;

    // Create order
    const orderId = uuidv4();
    const order = {
      id: orderId,
      items: orderItems,
      customerInfo: customerInfo || {},
      subtotal: subtotal,
      tax: tax,
      total: total,
      status: 'placed',
      createdAt: new Date().toISOString()
    };

    // Store order (in production, save to database)
    orders.push(order);

    // Log the event
    console.log(`Order placed: ${orderId}`);
    console.log(`Customer: ${customerInfo?.name || 'Anonymous'}`);
    console.log(`Total: $${total.toFixed(2)}`);
    console.log(`Items: ${orderItems.length}`);
    console.log('---');

    res.status(201).json({
      success: true,
      orderId: orderId,
      message: 'Order placed successfully',
      order: {
        id: orderId,
        total: total,
        status: 'placed',
        createdAt: order.createdAt
      }
    });
  } catch (error) {
    console.error('Error placing order:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Start server with error handling for busy ports and fallback support
function startServer(port) {
  const server = app.listen(port, () => {
    console.log(`Grocery store backend server running on port ${server.address().port}`);
  });

  server.on('error', (error) => {
    if (error.code === 'EADDRINUSE' && port !== 0) {
      console.warn(`Port ${port} is already in use. Trying a random available port...`);
      startServer(0);
    } else {
      console.error('Server failed to start:', error);
      process.exit(1);
    }
  });
}

startServer(PORT);

module.exports = app;
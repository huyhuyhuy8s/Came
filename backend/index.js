const express = require('express');
const cors = require('cors');
const { products } = require('./data');
const { ProductFactory, OrderFactory } = require('./factory');
const { ToppingDecorator } = require('./decorator');
const { PromotionNotifier, CustomerNotification } = require('./observer');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

// Observer pattern setup
const promotionNotifier = new PromotionNotifier();

// Example customers subscribed to promotions
const customer1 = new CustomerNotification('Customer1');
const customer2 = new CustomerNotification('Customer2');
promotionNotifier.subscribe(customer1);
promotionNotifier.subscribe(customer2);

// Root route to serve a simple simulated interface
app.get('/', (req, res) => {
  const html = `
    <html>
      <head><title>Menu Simulation</title></head>
      <body>
        <h1>Welcome to the Menu Simulation</h1>
        <p><a href="/menu">View Menu</a></p>
        <p>View Product Details: <a href="/product/1">Product 1</a>, <a href="/product/2">Product 2</a>, <a href="/product/3">Product 3</a></p>
      </body>
    </html>
  `;
  res.send(html);
});

// Endpoint: View Menu - list all products
app.get('/menu', (req, res) => {
  if (!products || products.length === 0) {
    return res.status(200).json({ message: 'No products available' });
  }
  res.json(products);
});

// Endpoint: View Product Details
app.get('/product/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const productData = products.find(p => p.id === id);
  if (!productData) {
    return res.status(404).json({ message: 'Product not found' });
  }

  // Use Factory Method to create product instance
  const product = ProductFactory.createProduct(
    productData.type,
    productData.id,
    productData.name,
    productData.description,
    productData.price
  );

  // If product is a drink and has toppings, decorate it
  if (product.type === 'drink' && productData.toppings && productData.toppings.length > 0) {
    let decoratedDrink = product;
    productData.toppings.forEach(topping => {
      decoratedDrink = new ToppingDecorator(decoratedDrink, topping);
    });
    // Return decorated product details
    return res.json({
      id: decoratedDrink.id,
      name: decoratedDrink.name,
      description: decoratedDrink.getDescription(),
      price: decoratedDrink.getPrice(),
      toppings: decoratedDrink.getToppings()
    });
  }

  // Return product details without decoration
  res.json(product);
});

// Example endpoint to trigger promotion notification
app.post('/promotion', (req, res) => {
  const { message } = req.body;
  if (!message) {
    return res.status(400).json({ message: 'Promotion message is required' });
  }
  promotionNotifier.sendPromotion(message);
  res.json({ message: 'Promotion sent to subscribers' });
});

app.listen(port, () => {
  console.log(`Backend server running at http://localhost:${port}`);
});

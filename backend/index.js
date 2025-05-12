const express = require('express');
const cors = require('cors');
const { products } = require('./data');
const { ProductFactory, CampaignFactory } = require('./factory');
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
        <h3>Campaign Highlights</h3>
        <div style="width: 100%; overflow: hidden; position: relative;">
          <div id="imageContainer" style="display: flex; transition: transform 0.3s ease;"> 
            <a href="/campaign/1" style="flex-shrink: 0; width: 100%;">
              <img src="images/spring_sale.jpg" alt="Spring Sale" class="campaignImage" style="width: 100%; height: auto;">
            </a>
            <a href="/campaign/2" style="flex-shrink: 0; width: 100%;">
              <img src="images/winter_blast.jpg" alt="Winter Blast" class="campaignImage" style="width: 100%; height: auto;">
            </a>
            <a href="/campaign/3" style="flex-shrink: 0; width: 100%;">
              <img src="images/summer_splash.jpg" alt="Summer Splash" class="campaignImage" style="width: 100%; height: auto;">
            </a>
          </div>
        </div>
        <!-- Buttons -->
        <button id="moveLeft">⬅ Move Left</button>
        <button id="moveRight">➡ Move Right</button>
        <script>
          let currentIndex = 0;
          const container = document.getElementById("imageContainer");
          const images = container.getElementsByClassName("campaignImage");
          const imageWidth = images[0].offsetWidth;
          function moveImages() {
            container.style.transform = "translateX(-" + (currentIndex * imageWidth) + "px)";
          }
          document.getElementById("moveLeft").onclick = function() {
            if (currentIndex > 0) {
              currentIndex--;
            } else {
              // Loop back to the last image
              currentIndex = images.length - 1;
            }
            moveImages(); 
          };
          document.getElementById("moveRight").onclick = function() {
            if (currentIndex < images.length - 1) {
              currentIndex++;
            } else {
              currentIndex = 0;
            }
            moveImages();
          };
        </script>
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

// Endpoint: View Campaign
app.get('/campaign/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const campaignData = campaign.find(p => p.id === id);
  if (!campaignData) {
    return res.status(404).json({ message: 'Campaign not found' });
  }
  res.json(campaignData);

  // Use Factory Method to create campaign instance
  const campaign = CampaignFactory.createCampaign(
    campaignData.campaignId,
    campaignData.campaignName,
    campaignData.campaignImage,
    campaignData.campaignContent
  ); 

  // Notify subscribers about the campaign
  promotionNotifier.notify(campaign);
  // Return campaign details
  res.json({
    id: campaign.campaignId,
    name: campaign.campaignName,
    image: campaign.campaignImage,
    content: campaign.campaignContent
  });
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

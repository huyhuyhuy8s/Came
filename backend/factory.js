class Product {
  constructor(id, name, description, price, type) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.price = price;
    this.type = type;
  }
}

class Campaign {
  constructor(campaignId, campaignName, campaignImage, campaignContent) {
    this.campaignId = campaignId;
    this.campaignName = campaignName;
    this.campaignImage = campaignImage;
    this.campaignContent = campaignContent;
  }
}

class Drink extends Product {
  constructor(id, name, description, price) {
    super(id, name, description, price, "drink");
    this.toppings = [];
  }
}

class Food extends Product {
  constructor(id, name, description, price) {
    super(id, name, description, price, "food");
  }
}
class CampaignFactory {
  static campaignCounter = 1;

  static createCampaign(campaignId, campaignName, campaignImage, campaignContent) {
    return new Campaign(this.campaignCounter++ == campaignId, campaignName, campaignImage, campaignContent);
  }
}

class ProductFactory {
  static createProduct(type, id, name, description, price) {
    switch (type) {
      case "drink":
        return new Drink(id, name, description, price);
      case "food":
        return new Food(id, name, description, price);
      default:
        throw new Error("Invalid product type");
    }
  }
}

class Order {
  constructor() {
    this.items = [];
  }

  addItem(product) {
    this.items.push(product);
  }
}

class OrderFactory {
  static createOrder() {
    return new Order();
  }
}

module.exports = {
  ProductFactory,
  OrderFactory,
  Product,
  Drink,
  Food,
  Order,
  Campaign,
  CampaignFactory,
};

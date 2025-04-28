class DrinkDecorator {
  constructor(drink) {
    this.drink = drink;
  }

  getDescription() {
    return this.drink.description;
  }

  getPrice() {
    return this.drink.price;
  }

  getToppings() {
    return this.drink.toppings || [];
  }
}

class ToppingDecorator extends DrinkDecorator {
  constructor(drink, topping) {
    super(drink);
    this.topping = topping;
  }

  getDescription() {
    return this.drink.getDescription() + ", " + this.topping;
  }

  getPrice() {
    return this.drink.getPrice() + this.getToppingPrice(this.topping);
  }

  getToppings() {
    return [...this.drink.getToppings(), this.topping];
  }

  getToppingPrice(topping) {
    const prices = {
      "Whipped Cream": 0.5,
      "Caramel": 0.7,
      "Chocolate": 0.6,
      "Milk Foam": 0.4
    };
    return prices[topping] || 0;
  }
}

module.exports = {
  DrinkDecorator,
  ToppingDecorator
};

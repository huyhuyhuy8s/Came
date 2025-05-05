export interface Product {
  getName(): string
  getDescription(): string
  getPrice(): number
}

// Concrete Component - Base Coffee
export class BaseCoffee implements Product {
  protected name: string
  protected description: string
  protected price: number

  constructor(name: string, description: string, price: number) {
    this.name = name
    this.description = description
    this.price = price
  }

  getName(): string {
    return this.name
  }

  getDescription(): string {
    return this.description
  }

  getPrice(): number {
    return this.price
  }
}

// Base Decorator
export abstract class ProductDecorator implements Product {
  protected product: Product

  constructor(product: Product) {
    this.product = product
  }

  getName(): string {
    return this.product.getName()
  }

  getDescription(): string {
    return this.product.getDescription()
  }

  getPrice(): number {
    return this.product.getPrice()
  }
}

// Concrete Decorators
export class OatMilkDecorator extends ProductDecorator {
  getName(): string {
    return `${this.product.getName()} with Oat Milk`
  }

  getDescription(): string {
    return `${this.product.getDescription()}, oat milk`
  }

  getPrice(): number {
    return this.product.getPrice() + 0.75
  }
}

export class AlmondMilkDecorator extends ProductDecorator {
  getName(): string {
    return `${this.product.getName()} with Almond Milk`
  }

  getDescription(): string {
    return `${this.product.getDescription()}, almond milk`
  }

  getPrice(): number {
    return this.product.getPrice() + 0.75
  }
}

export class VanillaSyrupDecorator extends ProductDecorator {
  getName(): string {
    return `${this.product.getName()} with Vanilla`
  }

  getDescription(): string {
    return `${this.product.getDescription()}, vanilla syrup`
  }

  getPrice(): number {
    return this.product.getPrice() + 0.5
  }
}

export class ExtraShotDecorator extends ProductDecorator {
  getName(): string {
    return `${this.product.getName()} with Extra Shot`
  }

  getDescription(): string {
    return `${this.product.getDescription()}, extra espresso shot`
  }

  getPrice(): number {
    return this.product.getPrice() + 1.0
  }
}

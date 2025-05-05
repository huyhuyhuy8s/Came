import {
  type Product,
  BaseCoffee,
  OatMilkDecorator,
  AlmondMilkDecorator,
  VanillaSyrupDecorator,
  ExtraShotDecorator,
} from "./product-decorator"

export class ProductCustomizer {
  static createBaseProduct(name: string, description: string, price: number): Product {
    return new BaseCoffee(name, description, price)
  }

  static addOatMilk(product: Product): Product {
    return new OatMilkDecorator(product)
  }

  static addAlmondMilk(product: Product): Product {
    return new AlmondMilkDecorator(product)
  }

  static addVanillaSyrup(product: Product): Product {
    return new VanillaSyrupDecorator(product)
  }

  static addExtraShot(product: Product): Product {
    return new ExtraShotDecorator(product)
  }

  static customizeProduct(
    baseProduct: Product,
    options: {
      oatMilk?: boolean
      almondMilk?: boolean
      vanillaSyrup?: boolean
      extraShot?: boolean
    },
  ): Product {
    let customizedProduct = baseProduct

    if (options.oatMilk) {
      customizedProduct = this.addOatMilk(customizedProduct)
    }

    if (options.almondMilk) {
      customizedProduct = this.addAlmondMilk(customizedProduct)
    }

    if (options.vanillaSyrup) {
      customizedProduct = this.addVanillaSyrup(customizedProduct)
    }

    if (options.extraShot) {
      customizedProduct = this.addExtraShot(customizedProduct)
    }

    return customizedProduct
  }
}

export interface MenuItem {
  id: string
  name: string
  description: string
  image: string
  category: string
  priceMin: number
  priceMax: number
  sizes?: { value: string; label: string; price: number }[]
  options?: { value: string; label: string; price?: number }[]
}

// Abstract Creator
export abstract class MenuItemFactory {
  abstract createMenuItem(id: string, name: string, description: string, image: string): MenuItem

  // This is the Factory Method
  createCompleteMenuItem(
    id: string,
    name: string,
    description: string,
    image: string,
    sizes?: { value: string; label: string; price: number }[],
    options?: { value: string; label: string; price?: number }[],
  ): MenuItem {
    const menuItem = this.createMenuItem(id, name, description, image)

    if (sizes) {
      menuItem.sizes = sizes
    }

    if (options) {
      menuItem.options = options
    }

    return menuItem
  }
}

// Concrete Creators
export class CoffeeFactory extends MenuItemFactory {
  createMenuItem(id: string, name: string, description: string, image: string): MenuItem {
    return {
      id,
      name,
      description,
      image,
      category: "Coffee",
      priceMin: 3.5,
      priceMax: 4.5,
      sizes: [
        { value: "small", label: "Small (12oz)", price: 3.5 },
        { value: "medium", label: "Medium (16oz)", price: 4.0 },
        { value: "large", label: "Large (20oz)", price: 4.5 },
      ],
      options: [
        { value: "room", label: "Room For Cream" },
        { value: "no-room", label: "No Room" },
      ],
    }
  }
}

export class LatteFactory extends MenuItemFactory {
  createMenuItem(id: string, name: string, description: string, image: string): MenuItem {
    return {
      id,
      name,
      description,
      image,
      category: "Lattes & Seasonal",
      priceMin: 4.5,
      priceMax: 5.5,
      sizes: [
        { value: "small", label: "Small (12oz)", price: 4.5 },
        { value: "medium", label: "Medium (16oz)", price: 5.0 },
        { value: "large", label: "Large (20oz)", price: 5.5 },
      ],
      options: [
        { value: "oat-milk", label: "Oat Milk (+$0.75)" },
        { value: "almond-milk", label: "Almond Milk (+$0.75)" },
        { value: "whole-milk", label: "Whole Milk" },
      ],
    }
  }
}

export class ColdDrinkFactory extends MenuItemFactory {
  createMenuItem(id: string, name: string, description: string, image: string): MenuItem {
    return {
      id,
      name,
      description,
      image,
      category: "Other Drinks",
      priceMin: 4.0,
      priceMax: 5.0,
      sizes: [
        { value: "small", label: "Small (16oz)", price: 4.0 },
        { value: "large", label: "Large (24oz)", price: 5.0 },
      ],
      options: [
        { value: "extra-shot", label: "Extra Shot (+$1.00)" },
        { value: "vanilla", label: "Vanilla Syrup (+$0.50)" },
      ],
    }
  }
}

// Menu Item Registry - Manages the factories
export class MenuItemRegistry {
  private static factories: Map<string, MenuItemFactory> = new Map([
    ["coffee", new CoffeeFactory()],
    ["latte", new LatteFactory()],
    ["cold-drink", new ColdDrinkFactory()],
  ])

  static getFactory(type: string): MenuItemFactory {
    const factory = this.factories.get(type)
    if (!factory) {
      throw new Error(`No factory found for type: ${type}`)
    }
    return factory
  }

  static registerFactory(type: string, factory: MenuItemFactory): void {
    this.factories.set(type, factory)
  }
}

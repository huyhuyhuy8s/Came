
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility function for combining class names
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Observer Pattern
export interface Observer {
  update(data: any): void;
}

export interface Subject {
  attach(observer: Observer): void;
  detach(observer: Observer): void;
  notify(data: any): void;
}

export class NotificationSubject implements Subject {
  private observers: Observer[] = [];
  
  attach(observer: Observer): void {
    const isExist = this.observers.includes(observer);
    if (isExist) {
      return console.log('Observer has been attached already');
    }
    this.observers.push(observer);
  }
  
  detach(observer: Observer): void {
    const observerIndex = this.observers.indexOf(observer);
    if (observerIndex === -1) {
      return console.log('Nonexistent observer');
    }
    this.observers.splice(observerIndex, 1);
  }
  
  notify(data: any): void {
    for (const observer of this.observers) {
      observer.update(data);
    }
  }
}

// Decorator Pattern
export interface Component {
  operation(): string;
}

export class ConcreteComponent implements Component {
  public operation(): string {
    return 'ConcreteComponent';
  }
}

export class Decorator implements Component {
  protected component: Component;

  constructor(component: Component) {
    this.component = component;
  }

  public operation(): string {
    return this.component.operation();
  }
}

export class ProductDecorator extends Decorator {
  private additionalOperation: () => string;

  constructor(component: Component, additionalOperation: () => string) {
    super(component);
    this.additionalOperation = additionalOperation;
  }

  public operation(): string {
    return `${super.operation()} + ${this.additionalOperation()}`;
  }
}

// Factory Method Pattern
export interface Product {
  id: number;
  name: string;
  price: number;
  description: string;
}

export abstract class ProductFactory {
  abstract createProduct(type: string, data: any): Product;
  
  getProduct(type: string, data: any): Product {
    const product = this.createProduct(type, data);
    return product;
  }
}

export class CoffeeFactory extends ProductFactory {
  createProduct(type: string, data: any): Product {
    switch (type) {
      case 'coffee':
        return {
          id: data.id,
          name: data.name,
          price: data.price,
          description: 'A delicious coffee product'
        };
      case 'tea':
        return {
          id: data.id,
          name: data.name,
          price: data.price,
          description: 'A refreshing tea product'
        };
      default:
        throw new Error('Unknown product type');
    }
  }
}

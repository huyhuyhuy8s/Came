class Subject {
  constructor() {
    this.observers = [];
  }

  subscribe(observer) {
    this.observers.push(observer);
  }

  unsubscribe(observer) {
    this.observers = this.observers.filter(obs => obs !== observer);
  }

  notify(data) {
    this.observers.forEach(observer => observer.update(data));
  }
}

class PromotionNotifier extends Subject {
  sendPromotion(promotion) {
    console.log("Sending promotion:", promotion);
    this.notify(promotion);
  }
}

class Observer {
  update(data) {
    // To be implemented by concrete observers
  }
}

class CustomerNotification extends Observer {
  constructor(customer) {
    super();
    this.customer = customer;
  }

  update(promotion) {
    console.log(`Notify customer ${this.customer}: ${promotion}`);
  }
}

module.exports = {
  PromotionNotifier,
  CustomerNotification
};

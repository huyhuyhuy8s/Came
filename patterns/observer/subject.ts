export interface Observer<T> {
  update(data: T): void
}

export class Subject<T> {
  private observers: Observer<T>[] = []
  private state: T

  constructor(initialState: T) {
    this.state = initialState
  }

  public getState(): T {
    return this.state
  }

  public setState(newState: T): void {
    this.state = newState
    this.notify()
  }

  public attach(observer: Observer<T>): void {
    const isExist = this.observers.includes(observer)
    if (isExist) {
      return
    }
    this.observers.push(observer)
  }

  public detach(observer: Observer<T>): void {
    const observerIndex = this.observers.indexOf(observer)
    if (observerIndex === -1) {
      return
    }
    this.observers.splice(observerIndex, 1)
  }

  public notify(): void {
    for (const observer of this.observers) {
      observer.update(this.state)
    }
  }
}

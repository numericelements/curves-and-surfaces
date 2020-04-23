
export interface IObserver<T> {
    update(message: T): void
}

export interface IObservable<T> {
    registerObserver(observer: IObserver<T>): void
    removeObserver(observer: IObserver<T>): void
    notifyObservers(): void
}


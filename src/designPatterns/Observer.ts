
export interface IObserver<T> {
    update(message: T): void
}

export interface IObservable<T> {
    registerObserver(observer: IObserver<T>): void
    removeObserver(observer: IObserver<T>): void
    notifyObservers(): void
}

/*
export interface IMultiObservable<T, N> {
    registerObserver(observer: IObserver<T>, name: N): void
    removeObserver(observer: IObserver<T>, name: N): void
    notifyObservers(): void
}
*/
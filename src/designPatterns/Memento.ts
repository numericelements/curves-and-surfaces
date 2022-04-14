
export interface Memento {
    getState<T>(): T
}

export interface Originator {
    createMemento(): Memento
    restore(m: Memento): void
}

export class Caretaker {
    mementos: Memento[] = []
    constructor(private originator: Originator) {
    }
    save(): void {
        this.mementos.push(this.originator.createMemento())
    }
    restore(): void {
        const m = this.mementos.pop()
        if (m) {
            this.originator.restore(m)
        }
    }
}
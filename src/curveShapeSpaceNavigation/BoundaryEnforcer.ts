import { NeighboringEvents, NeighboringEventsType } from "../sequenceOfDifferentialEvents/NeighboringEvents";

export class BoudaryEnforcer {

    private _status: boolean;
    private _neighboringEvents: NeighboringEvents;

    constructor() {
        this._status = false;
        this._neighboringEvents = new NeighboringEvents(NeighboringEventsType.none);
    }

    get neighboringEvents(): NeighboringEvents {
        return this._neighboringEvents;
    }

    activate(): void {
        this._status = true;
    }

    deactivate(): void {
        this._status = false;
    }

    isActive(): boolean {
        if(this._status) {
            return true;
        } else {
            return false;
        }
    }

    addTransitionOfEvents(neighborinhEvents: NeighboringEvents): void {
        this._neighboringEvents = neighborinhEvents;
    }

    hasATransitionOfEvents(): boolean {
        if(this._neighboringEvents.type !== NeighboringEventsType.none) {
            return true;
        } else {
            return false;
        }
    }

    resetNeighboringEvents(): void {
        this._neighboringEvents.clear();
    }

    reset(): void {
        this.resetNeighboringEvents();
        this._status = false;
    }
}
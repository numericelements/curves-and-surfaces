export enum NeighboringEventsType {neighboringCurExtremumLeftBoundary, neighboringInflectionLeftBoundary, 
    neighboringCurExtremumRightBoundary, neighboringInflectionRightBoundary,
    neighboringCurvatureExtrema, neighboringInflectionsCurvatureExtremum, none,
    neighboringCurvatureExtremaAppear, neighboringCurvatureExtremaDisappear,
    neighboringInflectionsCurvatureExtremumAppear, neighboringInflectionsCurvatureExtremumDisappear,
    neighboringCurExtremumLeftBoundaryAppear, neighboringCurExtremumLeftBoundaryDisappear,
    neighboringCurExtremumRightBoundaryAppear, neighboringCurExtremumRightBoundaryDisappear}

export class NeighboringEvents {

    public type: NeighboringEventsType;
    public index: number;
    public value1?: number;
    public value2?: number;
    public locEvent1?: number;
    public locEvent2?: number;
    public variation?: number[];
    public span?: number;
    public range?: number;
    public knotIndex?: number;

    constructor(eventType: NeighboringEventsType, indexInSequence: number) {
        this.type = eventType;
        this.index = indexInSequence;
    }

    
}
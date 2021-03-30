export enum NeighboringEventsType {neighboringCurExtremumLeftBoundary, neighboringInflectionLeftBoundary, 
    neighboringCurExtremumRightBoundary, neighboringInflectionRightBoundary,
    neighboringCurvatureExtrema, neighboringInflectionsCurvatureExtremum, none,
    neighboringCurvatureExtremaAppear, neighboringCurvatureExtremaDisappear,
    neighboringInflectionsCurvatureExtremumAppear, neighboringInflectionsCurvatureExtremumDisappear,
    neighboringCurExtremumLeftBoundaryAppear, neighboringCurExtremumLeftBoundaryDisappear,
    neighboringCurExtremumRightBoundaryAppear, neighboringCurExtremumRightBoundaryDisappear}

export const INITIAL_INTERV_INDEX = -1;

export class NeighboringEvents {

    private _type: NeighboringEventsType;
    private _index: number;
    public value1?: number;
    public value2?: number;
    public locEvent1?: number;
    public locEvent2?: number;
    public variation?: number[];
    public span?: number;
    public range?: number;
    public knotIndex?: number;

    /**
     * All configurations of events that can appear or disappear when comparing two consecutive sequences of differential events.
     * The configurations are elementary ones enumerated in NeighboringEventsType.
     * @param eventType Type of differential events enumerated in NeighboringEventsType
     * @param indexInSequence Location of interval where the events appear in the sequence of differential events. 
     * It is defined by the index of the index of an inflection as right bound of the interval betwwen [0,sequence.length] and initialized
     * to INITIAL_INTERV_INDEX, i.e., -1, if not explicitly defined.
     */
    constructor(eventType?: NeighboringEventsType, indexInSequence?: number) {
        if(eventType !== undefined) {
            this._type = eventType;
        } else {
            this._type = NeighboringEventsType.none;
        }
        if(indexInSequence !== undefined) {
            this._index = indexInSequence;
        } else {
            this._index = INITIAL_INTERV_INDEX;
        }
    }

    set type(eventType: NeighboringEventsType) {
        this._type = eventType;
        return;
    }

    set index(indexInSequence: number) {
        this._index = indexInSequence;
        return;
    }

    get type() {
        return this._type;
    }
    get index() {
        return this._index;
    }

    
}
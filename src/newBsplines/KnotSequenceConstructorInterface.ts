
export interface CST_KnotSequence {
    type: 'Max_multiplicity_order';
    maxMultOrder: number;
}

export interface CST_IncOpenKnotSequence {
    type: 'Open_KnotSequence_OpenCurve';
    maxMultOrder: number;
    knot: number[];
}

export interface CST_IncOpenKnotSubSequence {
    type: 'Open_KnotSubSequence_OpenCurve';
    maxMultOrder: number;
    knot: number[];
}

export type CST_KnotSequenceOpenCurve = CST_KnotSequence | CST_IncOpenKnotSequence | CST_IncOpenKnotSubSequence;

export interface CST_IncPeriodicKnotSequence {
    type: 'Periodic_KnotSequence_PeriodicCurve';
    maxMultOrder: number;
    knot: number[];
}

export interface CST_StrictIncPeriodicKnotSequence {
    type: 'Open_KnotSubSequence_PeriodicCurve';
    maxMultOrder: number;
    knot: number[];
}

export type CST_PeriodicKnotSequence = CST_IncPeriodicKnotSequence;
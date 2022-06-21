import { Vector2d } from "../mathVector/Vector2d";

export class CurveDifferentialEventsLocations {

    private _inflectionParametricLocations: number[];
    private _curvatureExtremaParametricLocations: number[];
    private _inflectionLocationsEuclideanSpace: Vector2d[];
    private _curvatureExtremaLocationsEuclideanSpace: Vector2d[];
    private _transientCurvatureExtremaLocationsEuclideanSpace: Vector2d[];

    constructor() {
        this._inflectionParametricLocations = [];
        this._curvatureExtremaParametricLocations = [];
        this._inflectionLocationsEuclideanSpace = [];
        this._curvatureExtremaLocationsEuclideanSpace = [];
        this._transientCurvatureExtremaLocationsEuclideanSpace = [];
    }

    get inflectionParametricLocations() {
        return this._inflectionParametricLocations;
    }

    get curvatureExtremaParametricLocations() {
        return this._curvatureExtremaParametricLocations;
    }

    get inflectionLocationsEuclideanSpace() {
        return this._inflectionLocationsEuclideanSpace;
    }

    get curvatureExtremaLocationsEuclideanSpace() {
        return this._curvatureExtremaLocationsEuclideanSpace;
    }

    get transientCurvatureExtremaLocationsEuclideanSpace() {
        return this._transientCurvatureExtremaLocationsEuclideanSpace;
    }

    set inflectionParametricLocations(parametricLocations: number[]) {
        this._inflectionParametricLocations = parametricLocations;
    }

    set curvatureExtremaParametricLocations(parametricLocations: number[]) {
        this._curvatureExtremaParametricLocations = parametricLocations;
    }

    set inflectionLocationsEuclideanSpace(euclideanLocations: Vector2d[]) {
        this._inflectionLocationsEuclideanSpace = euclideanLocations;
    }

    set curvatureExtremaLocationsEuclideanSpace(euclideanLocations: Vector2d[]) {
        this._curvatureExtremaLocationsEuclideanSpace = euclideanLocations;
    }

    set transientCurvatureExtremaLocationsEuclideanSpace(euclideanLocations: Vector2d[]) {
        this._transientCurvatureExtremaLocationsEuclideanSpace = euclideanLocations;
    }

    /**
     * Return a deep copy of this set of locations
     */
    clone(): CurveDifferentialEventsLocations {
        let crvDiffEventsLocations = new CurveDifferentialEventsLocations();
        crvDiffEventsLocations.inflectionParametricLocations = deepCopyEventsParametricLocations(this._inflectionParametricLocations);
        crvDiffEventsLocations.curvatureExtremaParametricLocations = deepCopyEventsParametricLocations(this._curvatureExtremaParametricLocations);
        crvDiffEventsLocations.inflectionLocationsEuclideanSpace = deepCopyEventsEuclideanLocations(this._inflectionLocationsEuclideanSpace);
        crvDiffEventsLocations.curvatureExtremaLocationsEuclideanSpace = deepCopyEventsEuclideanLocations(this._curvatureExtremaLocationsEuclideanSpace);
        crvDiffEventsLocations.transientCurvatureExtremaLocationsEuclideanSpace = deepCopyEventsEuclideanLocations(this._transientCurvatureExtremaLocationsEuclideanSpace);
        return crvDiffEventsLocations;
    }
}

export function deepCopyEventsParametricLocations(parametericLocations: number[]): number[] {
    let result: number[] = [];
    for (let loc of parametericLocations) {
        const newloc = loc;
        result.push(newloc);
    }
    return result;
}

export function deepCopyEventsEuclideanLocations(euclideanLocations: Vector2d[]): Vector2d[] {
    let result: Vector2d[] = [];
    for (let loc of euclideanLocations) {
        result.push(loc.clone());
    }
    return result;
}
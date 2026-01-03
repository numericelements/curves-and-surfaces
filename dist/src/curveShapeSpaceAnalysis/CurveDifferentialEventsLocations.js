"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deepCopyEventsEuclideanLocations = exports.deepCopyEventsParametricLocations = exports.CurveDifferentialEventsLocations = void 0;
class CurveDifferentialEventsLocations {
    constructor() {
        this._inflectionParametricLocations = [];
        this._curvatureNumeratorExtremaEstimators = [];
        this._curvatureExtremaParametricLocations = [];
        this._curvatureDerivativeNumeratorExtremaEstimators = [];
        this._inflectionLocationsEuclideanSpace = [];
        this._curvatureExtremaLocationsEuclideanSpace = [];
        this._transientCurvatureExtremaLocationsEuclideanSpace = [];
    }
    get inflectionParametricLocations() {
        return this._inflectionParametricLocations;
    }
    get curvatureNumeratorExtremaEstimators() {
        return this._curvatureNumeratorExtremaEstimators;
    }
    get curvatureExtremaParametricLocations() {
        return this._curvatureExtremaParametricLocations;
    }
    get curvatureDerivativeNumeratorExtremaEstimators() {
        return this._curvatureDerivativeNumeratorExtremaEstimators;
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
    set inflectionParametricLocations(parametricLocations) {
        this._inflectionParametricLocations = parametricLocations;
    }
    set curvatureNumeratorExtremaEstimators(parametricLocations) {
        this._curvatureNumeratorExtremaEstimators = parametricLocations;
    }
    set curvatureExtremaParametricLocations(parametricLocations) {
        this._curvatureExtremaParametricLocations = parametricLocations;
    }
    set curvatureDerivativeNumeratorExtremaEstimators(parametricLocations) {
        this._curvatureDerivativeNumeratorExtremaEstimators = parametricLocations;
    }
    set inflectionLocationsEuclideanSpace(euclideanLocations) {
        this._inflectionLocationsEuclideanSpace = euclideanLocations;
    }
    set curvatureExtremaLocationsEuclideanSpace(euclideanLocations) {
        this._curvatureExtremaLocationsEuclideanSpace = euclideanLocations;
    }
    set transientCurvatureExtremaLocationsEuclideanSpace(euclideanLocations) {
        this._transientCurvatureExtremaLocationsEuclideanSpace = euclideanLocations;
    }
    /**
     * Return a deep copy of this set of locations
     */
    clone() {
        let crvDiffEventsLocations = new CurveDifferentialEventsLocations();
        crvDiffEventsLocations.inflectionParametricLocations = deepCopyEventsParametricLocations(this._inflectionParametricLocations);
        crvDiffEventsLocations.curvatureNumeratorExtremaEstimators = deepCopyEventsParametricLocations(this._curvatureNumeratorExtremaEstimators);
        crvDiffEventsLocations.curvatureExtremaParametricLocations = deepCopyEventsParametricLocations(this._curvatureExtremaParametricLocations);
        crvDiffEventsLocations.curvatureDerivativeNumeratorExtremaEstimators = deepCopyEventsParametricLocations(this._curvatureDerivativeNumeratorExtremaEstimators);
        crvDiffEventsLocations.inflectionLocationsEuclideanSpace = deepCopyEventsEuclideanLocations(this._inflectionLocationsEuclideanSpace);
        crvDiffEventsLocations.curvatureExtremaLocationsEuclideanSpace = deepCopyEventsEuclideanLocations(this._curvatureExtremaLocationsEuclideanSpace);
        crvDiffEventsLocations.transientCurvatureExtremaLocationsEuclideanSpace = deepCopyEventsEuclideanLocations(this._transientCurvatureExtremaLocationsEuclideanSpace);
        return crvDiffEventsLocations;
    }
}
exports.CurveDifferentialEventsLocations = CurveDifferentialEventsLocations;
function deepCopyEventsParametricLocations(parametericLocations) {
    let result = [];
    for (let loc of parametericLocations) {
        const newloc = loc;
        result.push(newloc);
    }
    return result;
}
exports.deepCopyEventsParametricLocations = deepCopyEventsParametricLocations;
function deepCopyEventsEuclideanLocations(euclideanLocations) {
    let result = [];
    for (let loc of euclideanLocations) {
        result.push(loc.clone());
    }
    return result;
}
exports.deepCopyEventsEuclideanLocations = deepCopyEventsEuclideanLocations;

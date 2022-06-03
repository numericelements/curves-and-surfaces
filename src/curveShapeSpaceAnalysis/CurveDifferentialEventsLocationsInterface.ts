import { Vector2d } from "../mathVector/Vector2d";

export interface CurveDifferentialEventsLocationInterface {

    inflectionLocationsEuclideanSpace: Vector2d[];

    curvatureExtremaLocationsEuclideanSpace: Vector2d[];

    transientCurvatureExtremaLocationsEuclideanSpace: Vector2d[];

    inflectionParametricLocations: number[];

    curvatureExtremaParametricLocations: number[];


}
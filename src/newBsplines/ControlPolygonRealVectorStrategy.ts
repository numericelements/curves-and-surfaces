import { RealVectorSpace } from "../mathVector/RealVectorSpace";
import { RealVector } from "../mathVector/VectorSpaceConstructorInterface";
import { ControlPolygonFromDescriptors, ControlPolygonStrategy } from "./ControlPolygonFromDescriptors";

export class ControlPolygonRealVectorStrategy implements ControlPolygonStrategy<RealVector> {

    private vectorSpace: RealVectorSpace;
    // private controlPolygon: ControlPolygonFromDescriptors<RealVector>;
    private controlPolygon: RealVector[];

    // constructor(controlPolygon: ControlPolygonFromDescriptors<RealVector> ) {
    constructor(controlPolygon: RealVector[], dimension: number ) {
        this.controlPolygon = controlPolygon;
        // this.vectorSpace = new RealVectorSpace(controlPolygon.spaceDimension);
        this.vectorSpace = new RealVectorSpace(dimension);
    }


    moveControlPoint(index: number, displacement: RealVector): void {
        this.controlPolygon[index] = this.vectorSpace.addDescriptors(this.controlPolygon[index], displacement);
    }
}
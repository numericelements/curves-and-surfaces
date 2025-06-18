import { RealVectorSpace } from "../mathVector/RealVectorSpace";
import { RealVector } from "../mathVector/VectorSpaceConstructorInterface";
import { ControlPolygon, ControlPolygonStrategy } from "./ControlPolygon";

export class ControlPolygonRealVectorStrategy implements ControlPolygonStrategy {

    private vectorSpace: RealVectorSpace;
    private controlPolygon: ControlPolygon;

    constructor(controlPolygon: ControlPolygon ) {
        this.controlPolygon = controlPolygon;
        this.vectorSpace = new RealVectorSpace(controlPolygon.spaceDimension);
    }


    moveControlPoint(index: number, displacement: RealVector): void {
        this.controlPolygon.vectorCollection[index] = this.vectorSpace.add(this.controlPolygon.vectorCollection[index] as RealVector, displacement);
    }
}
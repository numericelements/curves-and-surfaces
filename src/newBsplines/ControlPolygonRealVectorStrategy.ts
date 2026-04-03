import { RealVectorSpace } from "../mathVector/RealVectorSpace";
import { RealVector } from "../mathVector/VectorSpaceConstructorInterface";
import { ControlPolygonFromDescriptors, ControlPolygonStrategy } from "./ControlPolygonFromDescriptors";

export class ControlPolygonRealVectorStrategy implements ControlPolygonStrategy<RealVector> {

    private vectorSpace: RealVectorSpace;
    private controlPolygon: ControlPolygonFromDescriptors;

    constructor(controlPolygon: ControlPolygonFromDescriptors, dimension: number ) {
        this.controlPolygon = controlPolygon;
        this.vectorSpace = new RealVectorSpace(dimension);
    }


    moveControlPoint(index: number, displacement: RealVector): ControlPolygonFromDescriptors<RealVector> {
        const newVectors = [...this.controlPolygon.vectorCollection] as RealVector[];
        newVectors[index] = this.vectorSpace.addDescriptors(newVectors[index], displacement);
        return new ControlPolygonFromDescriptors<RealVector>(newVectors);
    }
}
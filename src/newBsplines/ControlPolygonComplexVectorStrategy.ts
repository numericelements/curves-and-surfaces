import { ComplexVectorSpace } from "../mathVector/ComplexVectorSpace";
import { ComplexVector } from "../mathVector/VectorSpaceConstructorInterface";
import { ControlPolygonFromDescriptors, ControlPolygonStrategy } from "./ControlPolygonFromDescriptors";


export class ControlPolygonComplexVectorStrategy implements ControlPolygonStrategy<ComplexVector> {

    private vectorSpace: ComplexVectorSpace;
    private controlPolygon: ControlPolygonFromDescriptors;

    constructor(controlPolygon: ControlPolygonFromDescriptors ) {
        this.controlPolygon = controlPolygon;
        this.vectorSpace = new ComplexVectorSpace(controlPolygon.spaceDimension);
    }


    moveControlPoint(index: number, displacement: ComplexVector): void {
        this.controlPolygon.vectorCollection[index] = this.vectorSpace.addDescriptors(this.controlPolygon.vectorCollection[index] as ComplexVector, displacement);
    }
}
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


    moveControlPoint(index: number, displacement: ComplexVector): ControlPolygonFromDescriptors<ComplexVector> {
        const newVectors = [...this.controlPolygon.vectorCollection] as ComplexVector[];
        newVectors[index] = this.vectorSpace.addDescriptors(newVectors[index] as ComplexVector, displacement);
        return new ControlPolygonFromDescriptors<ComplexVector>(newVectors);
    }
}
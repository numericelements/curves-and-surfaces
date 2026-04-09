import { ComplexVectorSpace } from "../mathVector/ComplexVectorSpace";
import { ComplexVectorDesc } from "../mathVector/utilityTypes/VectorDescriptorTypes";
import { ControlPolygonFromDescriptors, ControlPolygonStrategy } from "./ControlPolygonFromDescriptors";


export class ControlPolygonComplexVectorStrategy implements ControlPolygonStrategy<ComplexVectorDesc> {

    private vectorSpace: ComplexVectorSpace;
    private controlPolygon: ControlPolygonFromDescriptors;

    constructor(controlPolygon: ControlPolygonFromDescriptors ) {
        this.controlPolygon = controlPolygon;
        this.vectorSpace = new ComplexVectorSpace(controlPolygon.spaceDimension);
    }


    moveControlPoint(index: number, displacement: ComplexVectorDesc): ControlPolygonFromDescriptors<ComplexVectorDesc> {
        const newVectors = [...this.controlPolygon.vectorCollection] as ComplexVectorDesc[];
        newVectors[index] = this.vectorSpace.addDescriptors(newVectors[index] as ComplexVectorDesc, displacement);
        return new ControlPolygonFromDescriptors<ComplexVectorDesc>(newVectors);
    }
}
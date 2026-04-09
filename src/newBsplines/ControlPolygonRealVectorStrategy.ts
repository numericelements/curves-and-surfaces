import { RealVectorSpace } from "../mathVector/RealVectorSpace";
import { RealVectorDesc } from "../mathVector/utilityTypes/VectorDescriptorTypes";
import { ControlPolygonFromDescriptors, ControlPolygonStrategy } from "./ControlPolygonFromDescriptors";

export class ControlPolygonRealVectorStrategy implements ControlPolygonStrategy<RealVectorDesc> {

    private vectorSpace: RealVectorSpace;
    private controlPolygon: ControlPolygonFromDescriptors;

    constructor(controlPolygon: ControlPolygonFromDescriptors, dimension: number ) {
        this.controlPolygon = controlPolygon;
        this.vectorSpace = new RealVectorSpace(dimension);
    }


    moveControlPoint(index: number, displacement: RealVectorDesc): ControlPolygonFromDescriptors<RealVectorDesc> {
        const newVectors = [...this.controlPolygon.vectorCollection] as RealVectorDesc[];
        newVectors[index] = this.vectorSpace.addDescriptors(newVectors[index], displacement);
        return new ControlPolygonFromDescriptors<RealVectorDesc>(newVectors);
    }
}
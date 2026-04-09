import { ProjectiveComplexVectorSpace } from "../mathVector/ProjectiveComplexVectorSpace";
import { ProjectiveComplexVectorDesc } from "../mathVector/utilityTypes/VectorDescriptorTypes";
import { ControlPolygonFromDescriptors, ControlPolygonStrategy } from "./ControlPolygonFromDescriptors";


export class ControlPolygonComplexProjectiveVectorStrategy implements ControlPolygonStrategy<ProjectiveComplexVectorDesc> {

    private vectorSpace: ProjectiveComplexVectorSpace;
    private controlPolygon: ControlPolygonFromDescriptors;

    constructor(controlPolygon: ControlPolygonFromDescriptors ) {
        this.controlPolygon = controlPolygon;
        this.vectorSpace = new ProjectiveComplexVectorSpace(controlPolygon.spaceDimension);
    }


    moveControlPoint(index: number, displacement: ProjectiveComplexVectorDesc): ControlPolygonFromDescriptors<ProjectiveComplexVectorDesc> {
        const newVectors = [...this.controlPolygon.vectorCollection] as ProjectiveComplexVectorDesc[];
        newVectors[index] = this.vectorSpace.addDescriptors(newVectors[index] as ProjectiveComplexVectorDesc, displacement);
        return new ControlPolygonFromDescriptors<ProjectiveComplexVectorDesc>(newVectors);
    }
}
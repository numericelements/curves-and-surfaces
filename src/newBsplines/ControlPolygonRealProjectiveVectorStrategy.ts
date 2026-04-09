import { ProjectiveRealVectorSpace } from "../mathVector/ProjectiveRealVectorSpace";
import { ProjectiveRealVectorDesc } from "../mathVector/utilityTypes/VectorDescriptorTypes";
import { ControlPolygonFromDescriptors, ControlPolygonStrategy } from "./ControlPolygonFromDescriptors";


export class ControlPolygonRealProjectiveVectorStrategy implements ControlPolygonStrategy<ProjectiveRealVectorDesc> {

    private vectorSpace: ProjectiveRealVectorSpace;
    private controlPolygon: ControlPolygonFromDescriptors;

    constructor(controlPolygon: ControlPolygonFromDescriptors ) {
        this.controlPolygon = controlPolygon;
        this.vectorSpace = new ProjectiveRealVectorSpace(controlPolygon.spaceDimension);
    }


    moveControlPoint(index: number, displacement: ProjectiveRealVectorDesc): ControlPolygonFromDescriptors<ProjectiveRealVectorDesc> {
        const newVectors = [...this.controlPolygon.vectorCollection] as ProjectiveRealVectorDesc[];
        newVectors[index] = this.vectorSpace.addDescriptors(newVectors[index] as ProjectiveRealVectorDesc, displacement);
        return new ControlPolygonFromDescriptors<ProjectiveRealVectorDesc>(newVectors);
    }
}
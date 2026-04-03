import { ProjectiveVectorSpace } from "../mathVector/ProjectiveVectorSpace";
import { ProjectiveVector } from "../mathVector/VectorSpaceConstructorInterface";
import { ControlPolygonFromDescriptors, ControlPolygonStrategy } from "./ControlPolygonFromDescriptors";


export class ControlPolygonRealProjectiveVectorStrategy implements ControlPolygonStrategy<ProjectiveVector> {

    private vectorSpace: ProjectiveVectorSpace;
    private controlPolygon: ControlPolygonFromDescriptors;

    constructor(controlPolygon: ControlPolygonFromDescriptors ) {
        this.controlPolygon = controlPolygon;
        this.vectorSpace = new ProjectiveVectorSpace(controlPolygon.spaceDimension);
    }


    moveControlPoint(index: number, displacement: ProjectiveVector): ControlPolygonFromDescriptors<ProjectiveVector> {
        const newVectors = [...this.controlPolygon.vectorCollection] as ProjectiveVector[];
        newVectors[index] = this.vectorSpace.addDescriptors(newVectors[index] as ProjectiveVector, displacement);
        return new ControlPolygonFromDescriptors<ProjectiveVector>(newVectors);
    }
}
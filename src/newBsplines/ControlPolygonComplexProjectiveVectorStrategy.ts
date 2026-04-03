import { ProjectiveComplexVectorSpace } from "../mathVector/ProjectiveComplexVectorSpace";
import { ProjectiveComplexVector } from "../mathVector/VectorSpaceConstructorInterface";
import { ControlPolygonFromDescriptors, ControlPolygonStrategy } from "./ControlPolygonFromDescriptors";


export class ControlPolygonComplexProjectiveVectorStrategy implements ControlPolygonStrategy<ProjectiveComplexVector> {

    private vectorSpace: ProjectiveComplexVectorSpace;
    private controlPolygon: ControlPolygonFromDescriptors;

    constructor(controlPolygon: ControlPolygonFromDescriptors ) {
        this.controlPolygon = controlPolygon;
        this.vectorSpace = new ProjectiveComplexVectorSpace(controlPolygon.spaceDimension);
    }


    moveControlPoint(index: number, displacement: ProjectiveComplexVector): ControlPolygonFromDescriptors<ProjectiveComplexVector> {
        const newVectors = [...this.controlPolygon.vectorCollection] as ProjectiveComplexVector[];
        newVectors[index] = this.vectorSpace.addDescriptors(newVectors[index] as ProjectiveComplexVector, displacement);
        return new ControlPolygonFromDescriptors<ProjectiveComplexVector>(newVectors);
    }
}
import { ProjectiveComplexVectorSpace } from "../mathVector/ProjectiveComplexVectorSpace";
import { ProjectiveComplexVector } from "../mathVector/VectorSpaceConstructorInterface";
import { ControlPolygon, ControlPolygonStrategy } from "./ControlPolygon";


export class ControlPolygonComplexProjectiveVectorStrategy implements ControlPolygonStrategy<ProjectiveComplexVector> {

    private vectorSpace: ProjectiveComplexVectorSpace;
    private controlPolygon: ControlPolygon;

    constructor(controlPolygon: ControlPolygon ) {
        this.controlPolygon = controlPolygon;
        this.vectorSpace = new ProjectiveComplexVectorSpace(controlPolygon.spaceDimension);
    }


    moveControlPoint(index: number, displacement: ProjectiveComplexVector): void {
        this.controlPolygon.vectorCollection[index] = this.vectorSpace.addRaw(this.controlPolygon.vectorCollection[index] as ProjectiveComplexVector, displacement);
    }
}
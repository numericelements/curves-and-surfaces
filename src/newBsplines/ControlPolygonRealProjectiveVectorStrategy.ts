import { ProjectiveVectorSpace } from "../mathVector/ProjectiveVectorSpace";
import { ProjectiveVector } from "../mathVector/VectorSpaceConstructorInterface";
import { ControlPolygon, ControlPolygonStrategy } from "./ControlPolygon";


export class ControlPolygonRealProjectiveVectorStrategy implements ControlPolygonStrategy<ProjectiveVector> {

    private vectorSpace: ProjectiveVectorSpace;
    private controlPolygon: ControlPolygon;

    constructor(controlPolygon: ControlPolygon ) {
        this.controlPolygon = controlPolygon;
        this.vectorSpace = new ProjectiveVectorSpace(controlPolygon.spaceDimension);
    }


    moveControlPoint(index: number, displacement: ProjectiveVector): void {
        this.controlPolygon.vectorCollection[index] = this.vectorSpace.addRaw(this.controlPolygon.vectorCollection[index] as ProjectiveVector, displacement);
    }
}
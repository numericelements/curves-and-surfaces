import {RoundDotSolidShader} from "../2DgraphicsItems/RoundDotSolidShader";
import { BSplineR1toR2Interface } from "../newBsplines/BSplineR1toR2Interface";
import { IObserver } from "../newDesignPatterns/Observer";
import { AbstractPointView } from "./AbstractPointView";


export abstract class SelectedDifferentialEventsView extends AbstractPointView implements IObserver<BSplineR1toR2Interface> {

    protected readonly Z = 0;
    protected DOT_SIZE = 0;
    protected RED_COLOR = 0;
    protected GREEN_COLOR = 0;
    protected BLUE_COLOR = 0;
    protected readonly ALPHA = 1;
    protected readonly roundDotSolidShader: RoundDotSolidShader;
    protected indexBuffer: WebGLBuffer | null = null;
    protected vertices: Float32Array = new Float32Array([]);
    protected indices: Uint8Array = new Uint8Array([]);
    protected pointLoc: number[];

    constructor(gl: WebGLRenderingContext) {
        super(gl);
        this.pointLoc = [];
        this.roundDotSolidShader = new RoundDotSolidShader(this.gl);
    }

    updateVerticesAndIndices() {
        this.vertices = new Float32Array(this.pointSequenceToDisplay.length * 32);
        this.indices = new Uint8Array(this.pointSequenceToDisplay.length * 6);

        for (let i = 0; i < this.pointSequenceToDisplay.length; i += 1) {
            let x = this.pointSequenceToDisplay[i].x;
            let y = this.pointSequenceToDisplay[i].y;
            this.vertices[32 * i] = x - this.DOT_SIZE;
            this.vertices[32 * i + 1] = y - this.DOT_SIZE;
            this.vertices[32 * i + 2] = this.Z;
            this.vertices[32 * i + 3] = -1;
            this.vertices[32 * i + 4] = -1;
            this.vertices[32 * i + 5] = this.RED_COLOR;
            this.vertices[32 * i + 6] = this.GREEN_COLOR;
            this.vertices[32 * i + 7] = this.BLUE_COLOR;

            this.vertices[32 * i + 8] = x + this.DOT_SIZE;
            this.vertices[32 * i + 9] = y - this.DOT_SIZE;
            this.vertices[32 * i + 10] = this.Z;
            this.vertices[32 * i + 11] = 1;
            this.vertices[32 * i + 12] = -1;
            this.vertices[32 * i + 13] = this.RED_COLOR;
            this.vertices[32 * i + 14] = this.GREEN_COLOR;
            this.vertices[32 * i + 15] = this.BLUE_COLOR;

            this.vertices[32 * i + 16] = x + this.DOT_SIZE;
            this.vertices[32 * i + 17] = y + this.DOT_SIZE;
            this.vertices[32 * i + 18] = this.Z;
            this.vertices[32 * i + 19] = 1;
            this.vertices[32 * i + 20] = 1;
            this.vertices[32 * i + 21] = this.RED_COLOR;
            this.vertices[32 * i + 22] = this.GREEN_COLOR;
            this.vertices[32 * i + 23] = this.BLUE_COLOR;

            this.vertices[32 * i + 24] = x - this.DOT_SIZE;
            this.vertices[32 * i + 25] = y + this.DOT_SIZE;
            this.vertices[32 * i + 26] = this.Z;
            this.vertices[32 * i + 27] = -1;
            this.vertices[32 * i + 28] = 1;
            this.vertices[32 * i + 29] = this.RED_COLOR;
            this.vertices[32 * i + 30] = this.GREEN_COLOR;
            this.vertices[32 * i + 31] = this.BLUE_COLOR;

            this.indices[6 * i] = 4 * i;
            this.indices[6 * i + 1] = 4 * i + 1;
            this.indices[6 * i + 2] = 4 * i + 2;
            this.indices[6 * i + 3] = 4 * i;
            this.indices[6 * i + 4] = 4 * i + 2;
            this.indices[6 * i + 5] = 4 * i + 3;
        }
    }

    abstract renderFrame(): void;

    updateBuffers() {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertices, this.gl.DYNAMIC_DRAW);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);

        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, this.indices, this.gl.DYNAMIC_DRAW);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
    }

    abstract update(spline: BSplineR1toR2Interface): void;
    
    updatePoints(pointLoc: number[]): void {
        this.pointLoc = [];
        for(let point of pointLoc) {
            this.pointLoc.push(point);
        }
    }

    clearPoints(): void {
        this.pointLoc = [];
        this.pointSequenceToDisplay = [];
    }

}
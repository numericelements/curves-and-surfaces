import { Vector2d } from "../mathVector/Vector2d";
import { BSplineR1toR2Interface } from "../newBsplines/BSplineR1toR2Interface";
import { SquareDotSolidShader } from "../2DgraphicsItems/SquareDotSolidShader"
import { IObserver } from "../newDesignPatterns/Observer";
import { WarningLog } from "../errorProcessing/ErrorLoging";
import { AbstractPointView } from "./AbstractPointView";


export class CurveKnotsView extends AbstractPointView implements IObserver<BSplineR1toR2Interface> {

    protected readonly Z = 0;
    protected readonly DOT_SIZE = 0.01;
    protected readonly RED_COLOR = 1.0;
    protected readonly GREEN_COLOR = 0.0;
    protected readonly BLUE_COLOR = 0.0;
    protected readonly ALPHA = 1;
    private readonly squareDotSolidShader: SquareDotSolidShader;
    protected pointSequenceToDisplay: Vector2d[];
    private spline: BSplineR1toR2Interface;
    private knotAbscissae: number[] = [];
    private a_Position: number;
    private fColor: WebGLUniformLocation | null;
    private FSIZE: number;

    constructor(gl: WebGLRenderingContext, spline: BSplineR1toR2Interface) {

        super(gl);
        this.spline = spline;
        this.squareDotSolidShader = new SquareDotSolidShader(this.gl);
        this.pointSequenceToDisplay = [];
        this.updatePointAtKnotOnSpline();
        this.a_Position = -1;
        this.fColor = -1;
        this.FSIZE = 0;

        // Write the positions of vertices to a vertex shader
        const check = this.initVertexBuffers();
        if (check < 0) {
            const warning = new WarningLog(this.constructor.name, "constructor", "Failed to set the positions of the vertices.");
            warning.logMessageToConsole();
        }
        this.updateVerticesAndIndices();
        this.updateBuffers();
    }     
    
    
    updatePointAtKnotOnSpline(): void {
        const splineTemp = this.spline.clone();
        this.knotAbscissae = splineTemp.getDistinctKnots();
        this.pointSequenceToDisplay = [];
        for (let kAbsc of this.knotAbscissae) {
            const point = this.spline.evaluate(kAbsc);
            this.pointSequenceToDisplay.push(point);
        }
    }

    initAttribLocation(): void {
        this.a_Position = this.gl.getAttribLocation(<SquareDotSolidShader> this.squareDotSolidShader.program, 'a_Position');
        this.fColor = this.gl.getUniformLocation(<SquareDotSolidShader>this.squareDotSolidShader.program, 'fColor');
        this.FSIZE = this.vertices.BYTES_PER_ELEMENT;

        if (this.a_Position < 0) {
            const warning = new WarningLog(this.constructor.name, "initAttribLocation", 'Failed to get the storage location of a_Position.');
            warning.logMessageToConsole();
        }
    }

    assignVertexAttrib(): void {
        // Assign the buffer object to a_Position variable
        this.gl.vertexAttribPointer(this.a_Position, 3, this.gl.FLOAT, false, this.FSIZE * 8, 0);
        // Enable the assignment to a_Position variable
        this.gl.enableVertexAttribArray(this.a_Position);
    }
    
    initVertexBuffers(): number {

        this.updatePointAtKnotOnSpline();
        this.updateVerticesAndIndices();

        // Create a buffer object
        this.vertexBuffer = this.gl.createBuffer();
        if (!this.vertexBuffer) {
            const warning = new WarningLog(this.constructor.name, "initVertexBuffers", 'Failed to create the vertex buffer object.');
            warning.logMessageToConsole();
            return -1;
        }
        // Bind the buffer objects to targets
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        // Write date into the buffer object
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertices, this.gl.DYNAMIC_DRAW);

        this.initAttribLocation();
        this.assignVertexAttrib();
        // Unbind the buffer object
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);

        this.indexBuffer = this.gl.createBuffer();
        if (!this.indexBuffer) {
            const warning = new WarningLog(this.constructor.name, "initVertexBuffers", 'Failed to create the index buffer object.');
            warning.logMessageToConsole();
            return -1;
        }

        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, this.indices, this.gl.DYNAMIC_DRAW);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);

        return this.indices.length;
    }

    renderFrame(): void {
        this.initAttribLocation();
        this.gl.useProgram(this.squareDotSolidShader.program);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

        this.assignVertexAttrib();
        this.gl.uniform4f(this.fColor, this.RED_COLOR, this.GREEN_COLOR, this.BLUE_COLOR, this.ALPHA);
        this.squareDotSolidShader.renderFrame(this.indices.length);

        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
        this.gl.useProgram(null);
    }

    update(spline: BSplineR1toR2Interface): void {
        this.spline = spline;
        this.updatePointAtKnotOnSpline();
        this.updateVerticesAndIndices();
        this.updateBuffers();
    }

    reset(spline: BSplineR1toR2Interface): void {
    }

}
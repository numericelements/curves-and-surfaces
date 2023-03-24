import { Vector2d } from "../mathVector/Vector2d";
import { BSplineR1toR2Interface } from "../newBsplines/BSplineR1toR2Interface";
import { RoundDotSolidShader } from "../2DgraphicsItems/RoundDotSolidShader";
import { SelectedDifferentialEventsView } from "./SelectedDifferentialEventsView";
import { WarningLog } from "../errorProcessing/ErrorLoging";


export class SelectedEnteringShapeSpaceCurvExtremaView extends SelectedDifferentialEventsView {

    protected readonly DOT_SIZE = 0.025;
    protected readonly RED_COLOR = 0 / 255;
    protected readonly GREEN_COLOR = 0 / 255;
    protected readonly BLUE_COLOR = 200 / 255;
    protected vertexBuffer: WebGLBuffer | null = null;
    protected indexBuffer: WebGLBuffer | null = null;
    protected vertices: Float32Array = new Float32Array([]);
    protected indices: Uint8Array = new Uint8Array([]);
    private a_Position: number;
    private a_Texture: number;
    private a_ColorLocation: WebGLUniformLocation | null;
    private FSIZE: number;

    constructor(gl: WebGLRenderingContext, spline: BSplineR1toR2Interface, pointLoc: number[]) {
        super(gl);
        let points: Array<Vector2d> = [];
        for(let pt of pointLoc) {
            this.pointLoc.push(pt);
            points.push(spline.evaluate(pt));
        }
        this.pointSequenceToDisplay = points.slice();
        this.a_Position = -1;
        this.a_Texture = -1;
        this.a_ColorLocation = -1;
        this.FSIZE = 0;
        
        // Write the positions of vertices to a vertex shader
        const check = this.initVertexBuffers();
        if (check < 0) {
            const warning = new WarningLog(this.constructor.name, "constructor", "Failed to set the positions of the vertices.");
            warning.logMessageToConsole();
        }

        this.update(spline);
    }

    initAttribLocation(): void {
        this.a_Position = this.gl.getAttribLocation(<RoundDotSolidShader>this.roundDotSolidShader.program, 'a_Position');
        this.a_Texture = this.gl.getAttribLocation(<RoundDotSolidShader>this.roundDotSolidShader.program, 'a_Texture');
        //a_Color = gl.getAttribLocation(<CurvatureExtremaShaders>this.curvatureExtremaShaders.program, 'a_Color'),
        this.FSIZE = this.vertices.BYTES_PER_ELEMENT;
        this.a_ColorLocation = this.gl.getUniformLocation(<WebGLProgram>this.roundDotSolidShader.program, "a_Color");
    
        if (this.a_Position < 0) {
            const warning = new WarningLog(this.constructor.name, "initAttribLocation", 'Failed to get the storage location of a_Position.');
            warning.logMessageToConsole();
        }

        if (this.a_Texture < 0) {
            const warning = new WarningLog(this.constructor.name, "initAttribLocation", 'Failed to get the storage location of a_Texture.');
            warning.logMessageToConsole();
        }
    }

    assignVertexAttrib(): void {
        // Assign the buffer object to a_Position variable
        this.gl.vertexAttribPointer(this.a_Position, 3, this.gl.FLOAT, false, this.FSIZE * 8, 0);
        this.gl.vertexAttribPointer(this.a_Texture, 2, this.gl.FLOAT, false, this.FSIZE * 8, this.FSIZE * 3);
        // Enable the assignment to a_Position variable
        this.gl.enableVertexAttribArray(this.a_Position);
        this.gl.enableVertexAttribArray(this.a_Texture);
    }

    initVertexBuffers(): number {
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
        this.gl.useProgram(this.roundDotSolidShader.program);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

        this.assignVertexAttrib();
        this.gl.uniform4f(this.a_ColorLocation, this.RED_COLOR, this.GREEN_COLOR, this.BLUE_COLOR, this.ALPHA);
        this.roundDotSolidShader.renderFrame(this.indices.length);

        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
        this.gl.useProgram(null);
    }


    update(spline: BSplineR1toR2Interface): void {
        let points: Array<Vector2d> = [];
        for(let i = 0; i < this.pointLoc.length; i += 1) {
            points.push(spline.evaluate(this.pointLoc[i]))
        }
        this.pointSequenceToDisplay = points.slice()
        this.updateVerticesAndIndices()
        this.updateBuffers()
    }

    /*reset(message: BSpline_R1_to_R2_interface): void {
    }*/

}
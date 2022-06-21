import { Vector2d } from "../mathVector/Vector2d";
import { DoubleRoundDotSolidShader } from "../2DgraphicsItems/DoubleRoundDotSolidShader"
import { IObserver } from "../newDesignPatterns/Observer";
import { WarningLog } from "../errorProcessing/ErrorLoging";
import { AbstractPointView } from "./AbstractPointView";
import { CurveDifferentialEventsLocations } from "../curveShapeSpaceAnalysis/CurveDifferentialEventsLocations";


export class TransitionCurvatureExtremaView extends AbstractPointView implements IObserver<CurveDifferentialEventsLocations> {

    protected readonly Z = 0;
    protected readonly DOT_SIZE = 0.03;
    protected readonly RED_COLOR = 216 / 255;
    protected readonly GREEN_COLOR = 91 / 255;
    protected readonly BLUE_COLOR = 95 / 255;
    protected readonly ALPHA = 1;
    private readonly doubleRoundDotSolidShader: DoubleRoundDotSolidShader;
    protected pointSequenceToDisplay: Vector2d[];
    private a_Position: number;
    private a_Texture: number;
    private a_ColorLocation: WebGLUniformLocation | null;
    private FSIZE: number;
    private curveModelDifferentialEvents: CurveDifferentialEventsLocations;

    constructor(gl: WebGLRenderingContext, curveModelDifferentialEvents: CurveDifferentialEventsLocations) {
        
        super(gl);
        this.doubleRoundDotSolidShader = new DoubleRoundDotSolidShader(this.gl);
        this.curveModelDifferentialEvents = curveModelDifferentialEvents;
        this.pointSequenceToDisplay = this.curveModelDifferentialEvents.transientCurvatureExtremaLocationsEuclideanSpace;
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
        this.updateVerticesAndIndices();
        this.updateBuffers();
    }

    initAttribLocation(): void {
        this.a_Position = this.gl.getAttribLocation(<DoubleRoundDotSolidShader>this.doubleRoundDotSolidShader.program, 'a_Position');
        this.a_Texture = this.gl.getAttribLocation(<DoubleRoundDotSolidShader>this.doubleRoundDotSolidShader.program, 'a_Texture');
        this.FSIZE = this.vertices.BYTES_PER_ELEMENT;
        this.a_ColorLocation = this.gl.getUniformLocation(<WebGLProgram>this.doubleRoundDotSolidShader.program, "a_Color");
    
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
            const warning = new WarningLog(this.constructor.name, "initVertexBuffers", 'Failed to create the index buffer object');
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
        this.gl.useProgram(this.doubleRoundDotSolidShader.program);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        this.assignVertexAttrib();
        this.gl.uniform4f(this.a_ColorLocation, this.RED_COLOR, this.GREEN_COLOR, this.BLUE_COLOR, this.ALPHA);
        this.doubleRoundDotSolidShader.renderFrame(this.indices.length);

        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
        this.gl.useProgram(null);
    }

    update(diffEventsLocations: CurveDifferentialEventsLocations): void {
        this.pointSequenceToDisplay = diffEventsLocations.transientCurvatureExtremaLocationsEuclideanSpace;
        this.updateVerticesAndIndices();
        this.updateBuffers();
    }

    reset(diffEventsLocations: CurveDifferentialEventsLocations): void {
    }

}
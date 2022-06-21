import { RoundDotTwoLevelsTransparencyShader } from "../2DgraphicsItems/RoundDotTwoLevelsTransparencyShader"
import { IObserver } from "../newDesignPatterns/Observer";
import { BSplineR1toR2Interface } from "../newBsplines/BSplineR1toR2Interface";
import { WarningLog } from "../errorProcessing/ErrorLoging";
import { AbstractMouseSelectablePointView } from "./AbstractMouseSelectablePointView";

export class ClampedControlPointView extends AbstractMouseSelectablePointView implements IObserver<BSplineR1toR2Interface>{

    protected readonly Z = 0;
    protected readonly DOT_SIZE = 0.03;
    protected readonly RED_COLOR = 0.0;
    protected readonly GREEN_COLOR = 0.0;
    protected readonly BLUE_COLOR = 1.0;
    private readonly roundDotTwoLevelsTransparencyShader: RoundDotTwoLevelsTransparencyShader;
    protected selectedPoints: number[];
    private a_Position: number;
    private a_Texture: number;
    private a_Color: number;
    private FSIZE: number;

    constructor(gl: WebGLRenderingContext, spline: BSplineR1toR2Interface, clampedCPindices: number[]) {
        
        super(gl, spline);
        this.roundDotTwoLevelsTransparencyShader = new RoundDotTwoLevelsTransparencyShader(this.gl);
        this.selectedPoints = [];
        this.selectedPoints = clampedCPindices;
        for(let index of this.selectedPoints) {
            this.pointSequenceToDisplay.push(this.controlPoints[index]);
        }
        this.a_Position = -1;
        this.a_Texture = -1;
        this.a_Color = -1;
        this.FSIZE = 0;

        // Write the positions of vertices to a vertex shader
        const check = this.initVertexBuffers();
        if (check < 0) {
            const warning = new WarningLog(this.constructor.name, "constructor", 'Failed to set the positions of the vertices.');
            warning.logMessageToConsole();
        }
    }

    initAttribLocation(): void {
        this.a_Position = this.gl.getAttribLocation(<RoundDotTwoLevelsTransparencyShader> this.roundDotTwoLevelsTransparencyShader.program, 'a_Position');
        this.a_Texture = this.gl.getAttribLocation(<RoundDotTwoLevelsTransparencyShader>this.roundDotTwoLevelsTransparencyShader.program, 'a_Texture');
        this.a_Color = this.gl.getAttribLocation(<RoundDotTwoLevelsTransparencyShader>this.roundDotTwoLevelsTransparencyShader.program, 'a_Color');
        this.FSIZE = this.vertices.BYTES_PER_ELEMENT;

        if (this.a_Position < 0) {
            const warning = new WarningLog(this.constructor.name, "initAttribLocation", 'Failed to get the storage location of a_Position.');
            warning.logMessageToConsole();
        }

        if (this.a_Texture < 0) {
            const warning = new WarningLog(this.constructor.name, "initAttribLocation", 'Failed to get the storage location of a_Texture.');
            warning.logMessageToConsole();
        }

        if (this.a_Color < 0) {
            const warning = new WarningLog(this.constructor.name, "initAttribLocation", 'Failed to get the storage location of a_Color');
            warning.logMessageToConsole();
        }
    }

    assignVertexAttrib(): void {
        // Assign the buffer object to a_Position variable
        this.gl.vertexAttribPointer(this.a_Position, 3, this.gl.FLOAT, false, this.FSIZE * 8, 0);
        this.gl.vertexAttribPointer(this.a_Texture, 2, this.gl.FLOAT, false, this.FSIZE * 8, this.FSIZE * 3);
        this.gl.vertexAttribPointer(this.a_Color, 3, this.gl.FLOAT, false, this.FSIZE * 8, this.FSIZE * 5);
        // Enable the assignment to a_Position variable
        this.gl.enableVertexAttribArray(this.a_Position);
        this.gl.enableVertexAttribArray(this.a_Texture);
        this.gl.enableVertexAttribArray(this.a_Color);
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
        this.gl.useProgram(this.roundDotTwoLevelsTransparencyShader.program);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        this.assignVertexAttrib();
        this.roundDotTwoLevelsTransparencyShader.renderFrame(this.indices.length, this.selectedPointIndex);

        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
        this.gl.useProgram(null);
    }

    update(spline: BSplineR1toR2Interface): void {
        this.controlPoints = spline.controlPoints;
        this.pointSequenceToDisplay = [];
        for(let index of this.selectedPoints) {
            this.pointSequenceToDisplay.push(this.controlPoints[index]);
        }
        this.updateVerticesAndIndices();
        this.updateBuffers();
    }

    reset(spline: BSplineR1toR2Interface): void {
    }

    setSelected(controlPointIndex: number | null): void {
        this.selectedPointIndex = controlPointIndex;
    }

}
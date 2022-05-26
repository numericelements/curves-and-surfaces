import { Vector2d } from "../mathVector/Vector2d";
import { BSplineR1toR2Interface } from "../newBsplines/BSplineR1toR2Interface";
import { RoundDotSolidShader } from "../2DgraphicsItems/RoundDotSolidShader"
import { IObserver } from "../newDesignPatterns/Observer";
import { BSplineR1toR2 } from "../newBsplines/BSplineR1toR2";
import { BSplineR1toR2DifferentialProperties } from "../newBsplines/BSplineR1toR2DifferentialProperties";
import { WarningLog } from "../errorProcessing/ErrorLoging";
import { PeriodicBSplineR1toR2DifferentialProperties } from "../newBsplines/PeriodicBSplineR1toR2DifferentialProperties";
import { PeriodicBSplineR1toR2 } from "../newBsplines/PeriodicBSplineR1toR2";


export class CurvatureExtremaView implements IObserver<BSplineR1toR2Interface> {

    private readonly Z = 0;
    private readonly DOT_SIZE = 0.03;
    private readonly RED_COLOR = 216 / 255;
    private readonly GREEN_COLOR = 91 / 255;
    private readonly BLUE_COLOR = 95 / 255;
    private readonly ALPHA = 1;
    private readonly roundDotSolidShader: RoundDotSolidShader;
    private readonly gl: WebGLRenderingContext;
    private vertexBuffer: WebGLBuffer | null = null;
    private indexBuffer: WebGLBuffer | null = null;
    private vertices: Float32Array = new Float32Array([]);
    private indices: Uint8Array = new Uint8Array([]);
    private controlPoints: Vector2d[];
    private a_Position: number;
    private a_Texture: number;
    private a_ColorLocation: WebGLUniformLocation | null;
    private FSIZE: number;

    constructor(spline: BSplineR1toR2Interface, gl: WebGLRenderingContext) {
        
        this.gl = gl;
        this.roundDotSolidShader = new RoundDotSolidShader(this.gl);
        this.controlPoints = spline.controlPoints;
        // this.controlPoints = spline.visibleControlPoints()
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

    updateVerticesAndIndices(): void {
        this.vertices = new Float32Array(this.controlPoints.length * 32);
        this.indices = new Uint8Array(this.controlPoints.length * 6);

        for (let i = 0; i < this.controlPoints.length; i += 1) {
            const x = this.controlPoints[i].x;
            const y = this.controlPoints[i].y;
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

    initAttribLocation(): void {
        this.a_Position = this.gl.getAttribLocation(<RoundDotSolidShader> this.roundDotSolidShader.program, 'a_Position');
        this.a_Texture = this.gl.getAttribLocation(<RoundDotSolidShader>this.roundDotSolidShader.program, 'a_Texture');
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
        // Write data into the buffer object
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
        if (spline instanceof BSplineR1toR2) {
            const splineDP = new BSplineR1toR2DifferentialProperties(spline);
            this.controlPoints = splineDP.curvatureExtrema();
        } else if(spline instanceof PeriodicBSplineR1toR2) {
            const splineDP = new PeriodicBSplineR1toR2DifferentialProperties(spline);
            this.controlPoints = splineDP.curvatureExtrema();
        }
        this.updateVerticesAndIndices();
        this.updateBuffers();
    }

    reset(message: BSplineR1toR2Interface): void {
    }

    updateBuffers(): void {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertices, this.gl.DYNAMIC_DRAW);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);

        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, this.indices, this.gl.DYNAMIC_DRAW);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
    }

}
import { WarningLog } from "../errorProcessing/ErrorLoging";
import { InsertKnotButtonDialogShader } from "../2DgraphicsItems/InsertKnotButtonDialogShader";


export class ClickButtonView {

    private readonly HEIGHT_SIZE = 0.05;
    private readonly RATIO_WIDTH_HEIGHT = 1.5;
    private readonly RED_COLOR = 0.5;
    private readonly GREEN_COLOR = 0.5;
    private readonly BLUE_COLOR = 0.5;
    private readonly X_LOCATION = -0.8;
    private readonly Y_LOCATION = 0.8;
    private readonly Z = 0;
    private readonly insertKnotButtonDialogShader: InsertKnotButtonDialogShader;
    private readonly gl: WebGLRenderingContext;
    private vertexBuffer: WebGLBuffer | null = null;
    private indexBuffer: WebGLBuffer | null = null;
    private vertices: Float32Array = new Float32Array([]);
    private indices: Uint8Array = new Uint8Array([]);
    private a_Position: number;
    private a_Texture: number;
    private a_Color: number;
    private FSIZE: number;

    constructor(gl: WebGLRenderingContext) {
        this.gl = gl;
        this.insertKnotButtonDialogShader = new InsertKnotButtonDialogShader(this.gl);
        this.a_Position = -1;
        this.a_Texture = -1;
        this.a_Color = -1;
        this.FSIZE = 0;

        const check = this.initVertexBuffers();
        if (check < 0) {
            const warning = new WarningLog(this.constructor.name, "constructor", 'Failed to set the positions of the vertices.');
            warning.logMessageToConsole();
        }
    }


    updateVerticesAndIndices(): void {
        this.vertices = new Float32Array(4 * 8);
        this.indices = new Uint8Array(2 * 3);
        this.vertices[0] = this.X_LOCATION - this.HEIGHT_SIZE * this.RATIO_WIDTH_HEIGHT;
        this.vertices[1] = this.Y_LOCATION - this.HEIGHT_SIZE;
        this.vertices[2] = this.Z;
        this.vertices[3] = -this.RATIO_WIDTH_HEIGHT;
        this.vertices[4] = -1;
        this.vertices[5] = this.RED_COLOR;
        this.vertices[6] = this.GREEN_COLOR;
        this.vertices[7] = this.BLUE_COLOR;

        this.vertices[8] = this.X_LOCATION + this.HEIGHT_SIZE * this.RATIO_WIDTH_HEIGHT;
        this.vertices[9] = this.Y_LOCATION - this.HEIGHT_SIZE;
        this.vertices[10] = this.Z;
        this.vertices[11] = this.RATIO_WIDTH_HEIGHT;
        this.vertices[12] = -1;
        this.vertices[13] = this.RED_COLOR;
        this.vertices[14] = this.GREEN_COLOR;
        this.vertices[15] = this.BLUE_COLOR;

        this.vertices[16] = this.X_LOCATION + this.HEIGHT_SIZE * this.RATIO_WIDTH_HEIGHT;
        this.vertices[17] = this.Y_LOCATION + this.HEIGHT_SIZE;
        this.vertices[18] = this.Z;
        this.vertices[19] = this.RATIO_WIDTH_HEIGHT;
        this.vertices[20] = 1;
        this.vertices[21] = this.RED_COLOR;
        this.vertices[22] = this.GREEN_COLOR;
        this.vertices[23] = this.BLUE_COLOR;

        this.vertices[24] = this.X_LOCATION - this.HEIGHT_SIZE * this.RATIO_WIDTH_HEIGHT;
        this.vertices[25] = this.Y_LOCATION + this.HEIGHT_SIZE;
        this.vertices[26] = this.Z;
        this.vertices[27] = -this.RATIO_WIDTH_HEIGHT;
        this.vertices[28] = 1;
        this.vertices[29] = this.RED_COLOR;
        this.vertices[30] = this.GREEN_COLOR;
        this.vertices[31] = this.BLUE_COLOR;

        this.indices[0] = 0;
        this.indices[1] = 1;
        this.indices[2] = 2;
        this.indices[3] = 0;
        this.indices[4] = 2;
        this.indices[5] = 3;
    }

    initAttribLocation(): void {
        this.a_Position = this.gl.getAttribLocation(<InsertKnotButtonDialogShader> this.insertKnotButtonDialogShader.program, 'a_Position');
        this.a_Texture = this.gl.getAttribLocation(<InsertKnotButtonDialogShader> this.insertKnotButtonDialogShader.program, 'a_Texture'),
        this.a_Color = this.gl.getAttribLocation(<InsertKnotButtonDialogShader> this.insertKnotButtonDialogShader.program, 'a_Color'),
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
        this.gl.useProgram(this.insertKnotButtonDialogShader.program);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        this.assignVertexAttrib();
        this.insertKnotButtonDialogShader.renderFrame(this.indices.length);

        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
        this.gl.useProgram(null);
    }

    selected(x: number, y: number): boolean {
        const deltaSquared = 0.01
        let result = false;

        if (Math.pow(x - this.X_LOCATION, 2) + Math.pow(y - this.Y_LOCATION, 2) < deltaSquared) {
            result = true;
        }
        return result
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

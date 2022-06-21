import { WarningLog } from "../errorProcessing/ErrorLoging";
import { InsertKnotButtonDialogShader } from "../2DgraphicsItems/InsertKnotButtonDialogShader";
import { AbstractMouseSelectableButtonView } from "./AbstractMouseSelectableButtonView";


export class ClickButtonView extends AbstractMouseSelectableButtonView {

    protected readonly HEIGHT_SIZE = 0.05;
    protected readonly RATIO_WIDTH_HEIGHT = 1.5;
    protected readonly RED_COLOR = 0.5;
    protected readonly GREEN_COLOR = 0.5;
    protected readonly BLUE_COLOR = 0.5;
    protected readonly X_LOCATION = -0.8;
    protected readonly Y_LOCATION = 0.8;
    protected readonly Z = 0;
    private readonly insertKnotButtonDialogShader: InsertKnotButtonDialogShader;
    private a_Position: number;
    private a_Texture: number;
    private a_Color: number;
    private FSIZE: number;

    constructor(gl: WebGLRenderingContext) {
        super(gl);
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

}

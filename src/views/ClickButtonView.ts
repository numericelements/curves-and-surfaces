import { InsertKnotButtonShaders } from "./InsertKnotButtonShaders";




export class ClickButtonView {

    readonly red = 0.5
    readonly green = 0.5
    readonly blue = 0.5
    readonly z = 0
    private vertexBuffer: WebGLBuffer | null = null
    private indexBuffer: WebGLBuffer | null = null
    private vertices: Float32Array = new Float32Array([])
    private indices: Uint8Array = new Uint8Array([])

    constructor(private x: number, private y: number, private clickButtonShaders: InsertKnotButtonShaders) {

        const check = this.initVertexBuffers(this.clickButtonShaders.gl);
        if (check < 0) {
            console.log('Failed to set the positions of the vertices');
        }
    }


    updateVerticesAndIndices() {
        const size = 0.05
        const ratio = 1.5


        this.vertices = new Float32Array(4 * 8);
        this.indices = new Uint8Array(2 * 3);
        this.vertices[0] = this.x - size * ratio;
        this.vertices[1] = this.y - size;
        this.vertices[2] = this.z;
        this.vertices[3] = -ratio;
        this.vertices[4] = -1;
        this.vertices[5] = this.red;
        this.vertices[6] = this.green;
        this.vertices[7] = this.blue;

        this.vertices[8] = this.x + size * ratio;
        this.vertices[9] = this.y - size;
        this.vertices[10] = this.z;
        this.vertices[11] = ratio;
        this.vertices[12] = -1;
        this.vertices[13] = this.red;
        this.vertices[14] = this.green;
        this.vertices[15] = this.blue;



        this.vertices[16] = this.x + size * ratio;
        this.vertices[17] = this.y + size;
        this.vertices[18] = this.z;
        this.vertices[19] = ratio;
        this.vertices[20] = 1;
        this.vertices[21] = this.red;
        this.vertices[22] = this.green;
        this.vertices[23] = this.blue;


        this.vertices[24] = this.x - size * ratio;
        this.vertices[25] = this.y + size;
        this.vertices[26] = this.z;
        this.vertices[27] = -ratio;
        this.vertices[28] = 1;
        this.vertices[29] = this.red;
        this.vertices[30] = this.green;
        this.vertices[31] = this.blue;


        this.indices[0] = 0;
        this.indices[1] = 1;
        this.indices[2] = 2;
        this.indices[3] = 0;
        this.indices[4] = 2;
        this.indices[5] = 3;

    }

    initVertexBuffers(gl: WebGLRenderingContext) {
        this.updateVerticesAndIndices();

        // Create a buffer object
        this.vertexBuffer = gl.createBuffer();
        if (!this.vertexBuffer) {
            console.log('Failed to create the vertex buffer object');
            return -1;
        }
        // Bind the buffer objects to targets
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        // Write date into the buffer object
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW);

        var a_Position = gl.getAttribLocation(<InsertKnotButtonShaders> this.clickButtonShaders.program, 'a_Position'),
            a_Texture = gl.getAttribLocation(<InsertKnotButtonShaders> this.clickButtonShaders.program, 'a_Texture'),
            a_Color = gl.getAttribLocation(<InsertKnotButtonShaders> this.clickButtonShaders.program, 'a_Color'),
            FSIZE = this.vertices.BYTES_PER_ELEMENT;


        if (a_Position < 0) {
            console.log('Failed to get the storage location of a_Position');
            return -1;
        }

        if (a_Texture < 0) {
            console.log('Failed to get the storage location of a_Texture');
            return -1;
        }

        if (a_Color < 0) {
            console.log('Failed to get the storage location of a_Color');
            return -1;
        }



        // Assign the buffer object to a_Position variable
        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 8, 0);
        gl.vertexAttribPointer(a_Texture, 2, gl.FLOAT, false, FSIZE * 8, FSIZE * 3);
        gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 8, FSIZE * 5);

        // Enable the assignment to a_Position variable
        gl.enableVertexAttribArray(a_Position);
        gl.enableVertexAttribArray(a_Texture);
        gl.enableVertexAttribArray(a_Color);

        // Unbind the buffer object
        gl.bindBuffer(gl.ARRAY_BUFFER, null);


        this.indexBuffer = gl.createBuffer();
        if (!this.indexBuffer) {
            console.log('Failed to create the index buffer object');
            return -1;
        }

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.DYNAMIC_DRAW);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

        return this.indices.length;
    }

    renderFrame() {
        let gl = this.clickButtonShaders.gl,
            a_Position = gl.getAttribLocation(<InsertKnotButtonShaders>  this.clickButtonShaders.program, 'a_Position'),
            a_Texture = gl.getAttribLocation(<InsertKnotButtonShaders>  this.clickButtonShaders.program, 'a_Texture'),
            a_Color = gl.getAttribLocation(<InsertKnotButtonShaders>  this.clickButtonShaders.program, 'a_Color'),
            FSIZE = this.vertices.BYTES_PER_ELEMENT;

        gl.useProgram(this.clickButtonShaders.program);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        // Assign the buffer object to a_Position variable
        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 8, 0);
        gl.vertexAttribPointer(a_Texture, 2, gl.FLOAT, false, FSIZE * 8, FSIZE * 3);
        gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 8, FSIZE * 5);
        // Enable the assignment to a_Position variable
        gl.enableVertexAttribArray(a_Position);
        gl.enableVertexAttribArray(a_Texture);
        gl.enableVertexAttribArray(a_Color);


        this.clickButtonShaders.renderFrame(this.indices.length);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.useProgram(null);
    }

    selected(x: number, y: number) {
        let deltaSquared = 0.01
        let result = false

        if (Math.pow(x - this.x, 2) + Math.pow(y - this.y, 2) < deltaSquared) {
            result = true
        }

        return result
    }

    updateBuffers() {
        let gl = this.clickButtonShaders.gl;

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }




}

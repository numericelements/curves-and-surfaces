import { Vector2d } from "../mathVector/Vector2d";
import { BSplineR1toR2Interface } from "../newBsplines/BSplineR1toR2Interface";
import {RoundDotSolidShader} from "../2DgraphicsItems/RoundDotSolidShader"
import { BSplineR1toR2 } from "../newBsplines/BSplineR1toR2";


export class SelectedDifferentialEventsView {

    private readonly Z = 0;
    private readonly roundDotSolidShader: RoundDotSolidShader;
    private readonly gl: WebGLRenderingContext;
    private vertexBuffer: WebGLBuffer | null = null;
    private indexBuffer: WebGLBuffer | null = null;
    private vertices: Float32Array = new Float32Array([]);
    private indices: Uint8Array = new Uint8Array([]);
    private curvatureExtremumLocation: Vector2d[];

    constructor(spline: BSplineR1toR2Interface, pointLoc: number[], gl: WebGLRenderingContext, private red: number, private green: number, private blue: number,  private alpha: number) {
        
        this.gl = gl;
        this.roundDotSolidShader = new RoundDotSolidShader(this.gl);
        let points: Array<Vector2d> = []
        for(let pt of pointLoc) {
            points.push(spline.evaluate(pt))
        }
        this.curvatureExtremumLocation = points.slice()
        
        // Write the positions of vertices to a vertex shader
        const check = this.initVertexBuffers(this.gl);
        if (check < 0) {
            console.log('Failed to set the positions of the vertices');
        }

        this.update(spline, pointLoc)
    }

    updateVerticesAndIndices() {
        const size = 0.03
        this.vertices = new Float32Array(this.curvatureExtremumLocation.length * 32);
        this.indices = new Uint8Array(this.curvatureExtremumLocation.length * 6);

        for (let i = 0; i < this.curvatureExtremumLocation.length; i += 1) {
            let x = this.curvatureExtremumLocation[i].x;
            let y = this.curvatureExtremumLocation[i].y;
            this.vertices[32 * i] = x - size;
            this.vertices[32 * i + 1] = y - size;
            this.vertices[32 * i + 2] = this.Z;
            this.vertices[32 * i + 3] = -1;
            this.vertices[32 * i + 4] = -1;
            this.vertices[32 * i + 5] = this.red;
            this.vertices[32 * i + 6] = this.green;
            this.vertices[32 * i + 7] = this.blue;

            this.vertices[32 * i + 8] = x + size;
            this.vertices[32 * i + 9] = y - size;
            this.vertices[32 * i + 10] = this.Z;
            this.vertices[32 * i + 11] = 1;
            this.vertices[32 * i + 12] = -1;
            this.vertices[32 * i + 13] = this.red;
            this.vertices[32 * i + 14] = this.green;
            this.vertices[32 * i + 15] = this.blue;

            this.vertices[32 * i + 16] = x + size;
            this.vertices[32 * i + 17] = y + size;
            this.vertices[32 * i + 18] = this.Z;
            this.vertices[32 * i + 19] = 1;
            this.vertices[32 * i + 20] = 1;
            this.vertices[32 * i + 21] = this.red;
            this.vertices[32 * i + 22] = this.green;
            this.vertices[32 * i + 23] = this.blue;

            this.vertices[32 * i + 24] = x - size;
            this.vertices[32 * i + 25] = y + size;
            this.vertices[32 * i + 26] = this.Z;
            this.vertices[32 * i + 27] = -1;
            this.vertices[32 * i + 28] = 1;
            this.vertices[32 * i + 29] = this.red;
            this.vertices[32 * i + 30] = this.green;
            this.vertices[32 * i + 31] = this.blue;

            this.indices[6 * i] = 4 * i;
            this.indices[6 * i + 1] = 4 * i + 1;
            this.indices[6 * i + 2] = 4 * i + 2;
            this.indices[6 * i + 3] = 4 * i;
            this.indices[6 * i + 4] = 4 * i + 2;
            this.indices[6 * i + 5] = 4 * i + 3;
        }
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

        let a_Position = gl.getAttribLocation(<RoundDotSolidShader> this.roundDotSolidShader.program, 'a_Position'),
            a_Texture = gl.getAttribLocation(<RoundDotSolidShader>this.roundDotSolidShader.program, 'a_Texture'),
            //a_Color = gl.getAttribLocation(<CurvatureExtremaShaders>this.curvatureExtremaShaders.program, 'a_Color'),
            FSIZE = this.vertices.BYTES_PER_ELEMENT;

        if (a_Position < 0) {
            console.log('Failed to get the storage location of a_Position');
            return -1;
        }

        if (a_Texture < 0) {
            console.log('Failed to get the storage location of a_Texture');
            return -1;
        }

        // Assign the buffer object to a_Position variable
        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 8, 0);
        gl.vertexAttribPointer(a_Texture, 2, gl.FLOAT, false, FSIZE * 8, FSIZE * 3);

        // Enable the assignment to a_Position variable
        gl.enableVertexAttribArray(a_Position);
        gl.enableVertexAttribArray(a_Texture);

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
        let gl = this.gl,
            a_Position = gl.getAttribLocation(<RoundDotSolidShader>this.roundDotSolidShader.program, 'a_Position'),
            a_Texture = gl.getAttribLocation(<RoundDotSolidShader>this.roundDotSolidShader.program, 'a_Texture'),
            //a_Color = gl.getAttribLocation(<CurvatureExtremaShaders>this.curvatureExtremaShaders.program, 'a_Color'),
            FSIZE = this.vertices.BYTES_PER_ELEMENT,
            a_ColorLocation = gl.getUniformLocation(<WebGLProgram>this.roundDotSolidShader.program, "a_Color");

        gl.useProgram(this.roundDotSolidShader.program);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        // Assign the buffer object to a_Position variable
        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 8, 0);
        gl.vertexAttribPointer(a_Texture, 2, gl.FLOAT, false, FSIZE * 8, FSIZE * 3);
        // Enable the assignment to a_Position variable
        gl.enableVertexAttribArray(a_Position);
        gl.enableVertexAttribArray(a_Texture);

        gl.uniform4f(a_ColorLocation, this.red, this.green, this.blue, this.alpha);

        this.roundDotSolidShader.renderFrame(this.indices.length);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.useProgram(null);
    }



    update(spline: BSplineR1toR2Interface, pointLoc: number[]) {
        if (spline instanceof BSplineR1toR2) {
            let points: Array<Vector2d> = []
            for(let i = 0; i < this.curvatureExtremumLocation.length; i += 1) {
                points.push(spline.evaluate(pointLoc[i]))
            }
            this.curvatureExtremumLocation = points.slice()
            this.updateVerticesAndIndices()
            this.updateBuffers()
        }
    }

    /*reset(message: BSpline_R1_to_R2_interface): void {
    }*/


    updateBuffers() {
        var gl = this.gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }

}
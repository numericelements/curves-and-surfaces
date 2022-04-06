import { Vector2d } from "../mathVector/Vector2d";
import { BSplineR1toR2Interface } from "../newBsplines/BSplineR1toR2Interface";
import { CurveKnotsShaders } from "../views/CurveKnotsShaders"
import { IObserver } from "../designPatterns/Observer";

import { BSplineR1toR2 } from "../newBsplines/BSplineR1toR2";


export class CurveKnotsView implements IObserver<BSplineR1toR2Interface> {

    private readonly z = 0
    private vertexBuffer: WebGLBuffer | null = null
    private indexBuffer: WebGLBuffer | null = null
    private vertices: Float32Array = new Float32Array([])
    private indices: Uint8Array = new Uint8Array([])

    private knotAbscissae: number[] = []
    private pointSequenceOnSpline: Vector2d[] = []

    constructor(private spline: BSplineR1toR2Interface, private curveKnotsShaders: CurveKnotsShaders, private red: number, private green: number, private blue: number, private alpha: number ) {

        // Write the positions of vertices to a vertex shader
        const check = this.initVertexBuffers(this.curveKnotsShaders.gl);
        if (check < 0) {
            console.log('Failed to set the positions of the vertices');
        }
    }     
    
    
    updatePointAtKnotOnSpline() {
        let splineTemp = new BSplineR1toR2(this.spline.controlPoints, this.spline.knots);
        this.knotAbscissae = splineTemp.getDistinctKnots();
        this.pointSequenceOnSpline = [];
        for (let kAbsc of this.knotAbscissae) {
            let point = this.spline.evaluate(kAbsc);
            this.pointSequenceOnSpline.push(point);
        }
    }

    updateVerticesAndIndices() {
        const size = 0.01

        this.vertices = new Float32Array(this.knotAbscissae.length * 32);
        this.indices = new Uint8Array(this.knotAbscissae.length * 6);

        for (let i = 0; i < this.knotAbscissae.length; i += 1) {
            let x = this.pointSequenceOnSpline[i].x;
            let y = this.pointSequenceOnSpline[i].y;
            this.vertices[32 * i] = x - size;
            this.vertices[32 * i + 1] = y - size;
            this.vertices[32 * i + 2] = this.z;
            this.vertices[32 * i + 3] = -1;
            this.vertices[32 * i + 4] = -1;
            this.vertices[32 * i + 5] = this.red;
            this.vertices[32 * i + 6] = this.green;
            this.vertices[32 * i + 7] = this.blue;

            this.vertices[32 * i + 8] = x + size;
            this.vertices[32 * i + 9] = y - size;
            this.vertices[32 * i + 10] = this.z;
            this.vertices[32 * i + 11] = 1;
            this.vertices[32 * i + 12] = -1;
            this.vertices[32 * i + 13] = this.red;
            this.vertices[32 * i + 14] = this.green;
            this.vertices[32 * i + 15] = this.blue;

            this.vertices[32 * i + 16] = x + size;
            this.vertices[32 * i + 17] = y + size;
            this.vertices[32 * i + 18] = this.z;
            this.vertices[32 * i + 19] = 1;
            this.vertices[32 * i + 20] = 1;
            this.vertices[32 * i + 21] = this.red;
            this.vertices[32 * i + 22] = this.green;
            this.vertices[32 * i + 23] = this.blue;

            this.vertices[32 * i + 24] = x - size;
            this.vertices[32 * i + 25] = y + size;
            this.vertices[32 * i + 26] = this.z;
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

        this.updatePointAtKnotOnSpline();
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

        const a_Position = gl.getAttribLocation(<CurveKnotsShaders> this.curveKnotsShaders.program, 'a_Position');
        const fColor = gl.getUniformLocation(<CurveKnotsShaders>this.curveKnotsShaders.program, 'fColor');
        let FSIZE = this.vertices.BYTES_PER_ELEMENT;

        if (a_Position < 0) {
            console.log('Failed to get the storage location of a_Position');
            return -1;
        }


        // Assign the buffer object to a_Position variable
        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 8, 0);

        // Enable the assignment to a_Position variable
        gl.enableVertexAttribArray(a_Position);

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
        
        let gl = this.curveKnotsShaders.gl,
            a_Position = gl.getAttribLocation(<CurveKnotsShaders>this.curveKnotsShaders.program, 'a_Position'),
            fColor = gl.getUniformLocation(<CurveKnotsShaders>this.curveKnotsShaders.program, 'fColor'),
            FSIZE = this.vertices.BYTES_PER_ELEMENT;

        gl.useProgram(this.curveKnotsShaders.program);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        // Assign the buffer object to a_Position variable
        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, FSIZE * 8, 0);
        // Enable the assignment to a_Position variable
        gl.enableVertexAttribArray(a_Position);
        gl.uniform4f(fColor, this.red, this.green, this.blue, this.alpha);

        this.curveKnotsShaders.renderFrame(this.indices.length);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.useProgram(null);
    }

    update(spline: BSplineR1toR2Interface) {
        this.spline = spline
        this.updatePointAtKnotOnSpline();
        this.updateVerticesAndIndices();
        this.updateBuffers();
    }

    reset(message: BSplineR1toR2Interface): void {
    }

    updateBuffers() {
        var gl = this.curveKnotsShaders.gl;
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
    }

}
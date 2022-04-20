import { Vector2d } from "../mathVector/Vector2d";
import { BSplineR1toR2Interface } from "../newBsplines/BSplineR1toR2Interface";
import {CurveShaders} from "../views/CurveShaders"
import { IObserver } from "../newDesignPatterns/Observer";


export class CurveView implements IObserver<BSplineR1toR2Interface> {

    private readonly POINT_SEQUENCE_SIZE = 1000
    //private readonly z = 0
    private pointSequenceOnSpline: Vector2d[] = []
    //private selectedControlPoint: number | null = null
    private vertexBuffer: WebGLBuffer | null = null
    //private indexBuffer: WebGLBuffer | null = null
    private vertices: Float32Array = new Float32Array(this.POINT_SEQUENCE_SIZE * 6)

    constructor(private spline: BSplineR1toR2Interface, private curveShaders: CurveShaders, private red: number, private green: number, private blue: number, private alpha: number ) {


        // Write the positions of vertices to a vertex shader
        const check = this.initVertexBuffers(this.curveShaders.gl);
        if (check < 0) {
            console.log('Failed to set the positions of the vertices');
        }
    }     
    
    
    updatePointSequenceOnSpline() {
        const start = this.spline.knots[this.spline.degree]
        const end = this.spline.knots[this.spline.knots.length - this.spline.degree - 1]
        this.pointSequenceOnSpline = [];
        for (let i = 0; i < this.POINT_SEQUENCE_SIZE; i += 1) {
            let point = this.spline.evaluate(i / (this.POINT_SEQUENCE_SIZE - 1) * (end - start) + start);
            this.pointSequenceOnSpline.push(point);
        }
    }


    updateVertices() {
        const thickness = 0.005
        //const thickness = 0.004
        //const thickness = 0.008
        const maxLength = thickness * 3
        let tangent = ((this.pointSequenceOnSpline[1]).substract(this.pointSequenceOnSpline[0])).normalize(),
            normal = tangent.rotate90degrees(),
            miter,
            length,
            result = [];

        result.push(this.pointSequenceOnSpline[0].add(normal.multiply(thickness)));
        result.push(this.pointSequenceOnSpline[0].substract(normal.multiply(thickness)));

        for (let i = 1; i < this.pointSequenceOnSpline.length - 1; i += 1) {
            normal = (this.pointSequenceOnSpline[i].substract(this.pointSequenceOnSpline[i - 1])).normalize().rotate90degrees();
            tangent = (this.pointSequenceOnSpline[i + 1].substract(this.pointSequenceOnSpline[i - 1])).normalize();
            miter = tangent.rotate90degrees();
            length = thickness / (miter.dot(normal));
            if (length > maxLength) {length = maxLength; }
            result.push(this.pointSequenceOnSpline[i].add(miter.multiply(length)));
            result.push(this.pointSequenceOnSpline[i].substract(miter.multiply(length)));
        }

        tangent = this.pointSequenceOnSpline[this.pointSequenceOnSpline.length - 1].substract(this.pointSequenceOnSpline[this.pointSequenceOnSpline.length - 2]).normalize();
        normal = tangent.rotate90degrees();
        result.push(this.pointSequenceOnSpline[this.pointSequenceOnSpline.length - 1].add(normal.multiply(thickness)));
        result.push(this.pointSequenceOnSpline[this.pointSequenceOnSpline.length - 1].substract(normal.multiply(thickness)));



        for (let i = 0; i < result.length; i += 1) {
            this.vertices[3 * i] = result[i].x;
            this.vertices[3 * i + 1] = result[i].y;
            this.vertices[3 * i + 2] = 0.0;
        }

    }

    update(spline: BSplineR1toR2Interface) {
        this.spline = spline;
        this.updatePointSequenceOnSpline();
        this.updateVertices();
        this.updateBuffers();
    }

    reset(message: BSplineR1toR2Interface): void {
    }

    updateBuffers() {
        const gl = this.curveShaders.gl;
        // Bind the buffer objects to targets
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        // Write date into the buffer object
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW);

        gl.bindBuffer(gl.ARRAY_BUFFER, null);

    }

    renderFrame() {

        const gl = this.curveShaders.gl
        const a_Position = gl.getAttribLocation(<CurveShaders>this.curveShaders.program, 'a_Position')
        const fColorLocation = gl.getUniformLocation(<CurveShaders>this.curveShaders.program, "fColor")
        gl.useProgram(this.curveShaders.program);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        // Assign the buffer object to a_Position variable
        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
        // Enable the assignment to a_Position variable
        gl.enableVertexAttribArray(a_Position);

        gl.uniform4f(fColorLocation, this.red, this.green, this.blue, this.alpha);

        this.curveShaders.renderFrame(this.vertices.length / 3);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.useProgram(null);
    }

    initVertexBuffers(gl: WebGLRenderingContext) {
        const  a_Position = gl.getAttribLocation(<CurveShaders>this.curveShaders.program, 'a_Position')

        // Create a buffer object
        this.vertexBuffer = gl.createBuffer();
        if (!this.vertexBuffer) {
            console.log('Failed to create the vertex buffer object');
            return -1;
        }

        this.updatePointSequenceOnSpline();
        this.updateVertices();
        // Bind the buffer objects to targets
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        // Write date into the buffer object
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW);


        if (a_Position < 0) {
            console.log('Failed to get the storage location of a_Position');
            return -1;
        }

        // Assign the buffer object to a_Position variable
        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);

        // Enable the assignment to a_Position variable
        gl.enableVertexAttribArray(a_Position);

        // Unbind the buffer object
        gl.bindBuffer(gl.ARRAY_BUFFER, null);

        return 1
    }


}





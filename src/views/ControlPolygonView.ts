import { Vector_2d } from "../mathematics/Vector_2d";
import { BSpline_R1_to_R2_interface } from "../mathematics/BSplineInterfaces";
import {ControlPolygonShaders} from "../views/ControlPolygonShaders"
import { IObserver } from "../designPatterns/Observer";


export class ControlPolygonView implements IObserver<BSpline_R1_to_R2_interface> {

    private readonly z = 0
    private selectedControlPoint: number | null = null
    private vertexBuffer: WebGLBuffer | null = null
    private indexBuffer: WebGLBuffer | null = null
    private vertices: Float32Array = new Float32Array([])
    private indices: Uint8Array = new Uint8Array([])
    private controlPoints: Vector_2d[]

    constructor(private spline: BSpline_R1_to_R2_interface, private controlPolygonShaders: ControlPolygonShaders, private closed: boolean = false,
        private red: number, private green: number, private blue: number, private alpha: number ) {

        this.controlPoints = spline.visibleControlPoints()
        if (this.closed) {
            this.controlPoints.push(this.controlPoints[0]);
        }
        this.controlPolygonShaders = controlPolygonShaders;

        // Write the positions of vertices to a vertex shader
        const check = this.initVertexBuffers(this.controlPolygonShaders.gl);
        if (check < 0) {
            console.log('Failed to set the positions of the vertices');
        }
    }      


    updateVerticesAndIndices() {
        const thickness = 0.003
        //const thickness = 0.0075
        //const thickness = 0.006


        this.vertices = new Float32Array(this.controlPoints.length * 12);
        this.indices = new Uint8Array(this.controlPoints.length * 6);

        for (let i = 0; i < this.controlPoints.length - 1; i += 1) {
            const normal = this.controlPoints[i + 1].substract(this.controlPoints[i]).normalize().rotate90degrees();
            this.vertices[12 * i] = this.controlPoints[i].x - thickness * normal.x;
            this.vertices[12 * i + 1] = this.controlPoints[i].y - thickness * normal.y;
            this.vertices[12 * i + 2] = this.z;
            this.vertices[12 * i + 3] = this.controlPoints[i + 1].x - thickness * normal.x;
            this.vertices[12 * i + 4] = this.controlPoints[i + 1].y - thickness * normal.y;
            this.vertices[12 * i + 5] = this.z;
            this.vertices[12 * i + 6] = this.controlPoints[i + 1].x + thickness * normal.x;
            this.vertices[12 * i + 7] = this.controlPoints[i + 1].y + thickness * normal.y;
            this.vertices[12 * i + 8] = this.z;
            this.vertices[12 * i + 9] = this.controlPoints[i].x + thickness * normal.x;
            this.vertices[12 * i + 10] = this.controlPoints[i].y + thickness * normal.y;
            this.vertices[12 * i + 11] = this.z;

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

        let a_Position = gl.getAttribLocation(<ControlPolygonShaders> this.controlPolygonShaders.program, 'a_Position');

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

        const gl = this.controlPolygonShaders.gl
        const a_Position = gl.getAttribLocation(<ControlPolygonShaders>this.controlPolygonShaders.program, 'a_Position')
        /* JCL 2020/09/28 Add the management of the control polygon color */
        const fColorLocation = gl.getUniformLocation(<ControlPolygonShaders>this.controlPolygonShaders.program, "fColor")

        gl.useProgram(this.controlPolygonShaders.program);
        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.vertexAttribPointer(a_Position, 3, gl.FLOAT, false, 0, 0);
        gl.enableVertexAttribArray(a_Position);

        gl.uniform4f(fColorLocation, this.red, this.green, this.blue, this.alpha);

        this.controlPolygonShaders.renderFrame(this.indices.length);

        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);
        gl.useProgram(null);
    }



    update (message: BSpline_R1_to_R2_interface) {
        this.controlPoints = message.visibleControlPoints();
        if (this.closed) {
            this.controlPoints.push(this.controlPoints[0]);
        }
        this.updateVerticesAndIndices();
        this.updateBuffers();
    }

    reset(message: BSpline_R1_to_R2_interface): void {
    }

    updateBuffers() {
        const gl = this.controlPolygonShaders.gl;

        gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.vertices, gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ARRAY_BUFFER, null);


        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.DYNAMIC_DRAW);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null);

    }



}





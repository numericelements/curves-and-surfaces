import { Vector2d } from "../mathVector/Vector2d";
import { BSplineR1toR2Interface } from "../newBsplines/BSplineR1toR2Interface";
import { PolylineShader } from "../2DgraphicsItems/PolylineShader"
import { IObserver } from "../newDesignPatterns/Observer";
import { ErrorLog, WarningLog } from "../errorProcessing/ErrorLoging";
import { WebGLUtils } from "../webgl/webgl-utils"


export class CurveView implements IObserver<BSplineR1toR2Interface> {

    private readonly POINT_SEQUENCE_SIZE = 1000;
    private readonly THICKNESS = 0.005;
    private readonly RED_COLOR = 216 / 255;
    private readonly GREEN_COLOR = 91 / 255;
    private readonly BLUE_COLOR = 95 / 255;
    private readonly ALPHA = 1;
    private readonly Z = 0;
    private readonly polylineShader: PolylineShader;
    private readonly gl: WebGLRenderingContext;
    private spline: BSplineR1toR2Interface;
    private pointSequenceOnSpline: Vector2d[] = [];
    private vertexBuffer: WebGLBuffer | null = null;
    private vertices: Float32Array = new Float32Array(this.POINT_SEQUENCE_SIZE * 6);
    private a_Position: number;
    private fColorLocation: WebGLUniformLocation | null;

    constructor(gl: WebGLRenderingContext, spline: BSplineR1toR2Interface) {

        this.gl = gl;
        this.polylineShader = new PolylineShader(this.gl);
        this.spline = spline;
        this.a_Position = -1;
        this.fColorLocation = -1;
        // Write the positions of vertices to a vertex shader

        const check = this.initVertexBuffers();
        if (check < 0) {
            const warning = new WarningLog(this.constructor.name, "constructor", 'Failed to set the positions of the vertices.');
            warning.logMessage();
        }
    }     
    
    updatePointSequenceOnSpline(): void {
        const start = this.spline.knots[this.spline.degree];
        const end = this.spline.knots[this.spline.knots.length - this.spline.degree - 1];
        this.pointSequenceOnSpline = [];
        for (let i = 0; i < this.POINT_SEQUENCE_SIZE; i += 1) {
            let point = this.spline.evaluate(i / (this.POINT_SEQUENCE_SIZE - 1) * (end - start) + start);
            this.pointSequenceOnSpline.push(point);
        }
    }

    updateVertices(): void {
        const maxLength = this.THICKNESS * 3;
        let tangent = ((this.pointSequenceOnSpline[1]).substract(this.pointSequenceOnSpline[0])).normalize();
        let normal = tangent.rotate90degrees();
        let miter,length;
        let triangleStripVertices = [];

        triangleStripVertices.push(this.pointSequenceOnSpline[0].add(normal.multiply(this.THICKNESS)));
        triangleStripVertices.push(this.pointSequenceOnSpline[0].substract(normal.multiply(this.THICKNESS)));

        for (let i = 1; i < this.pointSequenceOnSpline.length - 1; i += 1) {
            normal = (this.pointSequenceOnSpline[i].substract(this.pointSequenceOnSpline[i - 1])).normalize().rotate90degrees();
            tangent = (this.pointSequenceOnSpline[i + 1].substract(this.pointSequenceOnSpline[i - 1])).normalize();
            miter = tangent.rotate90degrees();
            length = this.THICKNESS / (miter.dot(normal));
            if (length > maxLength) {length = maxLength; }
            triangleStripVertices.push(this.pointSequenceOnSpline[i].add(miter.multiply(length)));
            triangleStripVertices.push(this.pointSequenceOnSpline[i].substract(miter.multiply(length)));
        }

        tangent = this.pointSequenceOnSpline[this.pointSequenceOnSpline.length - 1].substract(this.pointSequenceOnSpline[this.pointSequenceOnSpline.length - 2]).normalize();
        normal = tangent.rotate90degrees();
        triangleStripVertices.push(this.pointSequenceOnSpline[this.pointSequenceOnSpline.length - 1].add(normal.multiply(this.THICKNESS)));
        triangleStripVertices.push(this.pointSequenceOnSpline[this.pointSequenceOnSpline.length - 1].substract(normal.multiply(this.THICKNESS)));

        for (let i = 0; i < triangleStripVertices.length; i += 1) {
            this.vertices[3 * i] = triangleStripVertices[i].x;
            this.vertices[3 * i + 1] = triangleStripVertices[i].y;
            this.vertices[3 * i + 2] = this.Z;
        }
    }

    update(spline: BSplineR1toR2Interface): void {
        for(let i = 0; i < spline.controlPoints.length; i++) {
            if(isNaN(spline.controlPoints[i].x) || isNaN(spline.controlPoints[i].y)) {
                const error = new ErrorLog(this.constructor.name, "update", "NaN");
                console.log("i = ", i);
                error.logMessage();
            }
        }
        this.spline = spline;
        this.updatePointSequenceOnSpline();
        this.updateVertices();
        this.updateBuffers();
    }

    initAttribLocation(): void {
        this.a_Position = this.gl.getAttribLocation(<PolylineShader>this.polylineShader.program, 'a_Position');
        this.fColorLocation = this.gl.getUniformLocation(<PolylineShader>this.polylineShader.program, "fColor");

        if (this.a_Position < 0) {
            const warning = new WarningLog(this.constructor.name, "initAttribLocation", 'Failed to get the storage location of a_Position.');
            warning.logMessage();
        }
    }

    assignVertexAttrib(): void {
        // Assign the buffer object to a_Position variable
        this.gl.vertexAttribPointer(this.a_Position, 3, this.gl.FLOAT, false, 0, 0);
        // Enable the assignment to a_Position variable
        this.gl.enableVertexAttribArray(this.a_Position);
    }

    reset(spline: BSplineR1toR2Interface): void {
    }

    updateBuffers(): void {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertices, this.gl.DYNAMIC_DRAW);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
    }

    renderFrame(): void {
        this.initAttribLocation();
        this.gl.useProgram(this.polylineShader.program);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);

        this.assignVertexAttrib();
        this.gl.uniform4f(this.fColorLocation, this.RED_COLOR, this.GREEN_COLOR, this.BLUE_COLOR, this.ALPHA);
        this.polylineShader.renderFrame(this.vertices.length / 3);

        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
        this.gl.useProgram(null);
    }

    initVertexBuffers(): number {
        // Create a buffer object
        this.vertexBuffer = this.gl.createBuffer();
        if (!this.vertexBuffer) {
            const warning = new WarningLog(this.constructor.name, "initVertexBuffers", 'Failed to create the vertex buffer object.');
            warning.logMessage();
            return -1;
        }

        this.updatePointSequenceOnSpline();
        this.updateVertices();
        // Bind the buffer objects to targets
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        // Write date into the buffer object
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertices, this.gl.DYNAMIC_DRAW);

        this.initAttribLocation();
        this.assignVertexAttrib();
        // Unbind the buffer object
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
        return 1
    }
}





"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PhantomCurveView = void 0;
const PolylineShader_1 = require("../2DgraphicsItems/PolylineShader");
const ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
class PhantomCurveView {
    constructor(gl, spline) {
        this.POINT_SEQUENCE_SIZE = 1000;
        this.THICKNESS = 0.002;
        this.RED_COLOR = 10 / 255;
        this.GREEN_COLOR = 150 / 255;
        this.BLUE_COLOR = 10 / 255;
        this.ALPHA = 1;
        this.Z = 0;
        this.pointSequenceOnSpline = [];
        this.vertexBuffer = null;
        this.vertices = new Float32Array(this.POINT_SEQUENCE_SIZE * 6);
        this.gl = gl;
        this.polylineShader = new PolylineShader_1.PolylineShader(this.gl);
        this.spline = spline;
        this.a_Position = -1;
        this.fColorLocation = -1;
        // Write the positions of vertices to a vertex shader
        const check = this.initVertexBuffers();
        if (check < 0) {
            const warning = new ErrorLoging_1.WarningLog(this.constructor.name, "constructor", 'Failed to set the positions of the vertices.');
            warning.logMessage();
        }
    }
    updatePointSequenceOnSpline() {
        const start = this.spline.knots[this.spline.degree];
        const end = this.spline.knots[this.spline.knots.length - this.spline.degree - 1];
        this.pointSequenceOnSpline = [];
        for (let i = 0; i < this.POINT_SEQUENCE_SIZE; i += 1) {
            let point = this.spline.evaluate(i / (this.POINT_SEQUENCE_SIZE - 1) * (end - start) + start);
            this.pointSequenceOnSpline.push(point);
        }
    }
    updateVertices() {
        const maxLength = this.THICKNESS * 3;
        let tangent = ((this.pointSequenceOnSpline[1]).substract(this.pointSequenceOnSpline[0])).normalize();
        let normal = tangent.rotate90degrees();
        let miter, length;
        let triangleStripVertices = [];
        triangleStripVertices.push(this.pointSequenceOnSpline[0].add(normal.multiply(this.THICKNESS)));
        triangleStripVertices.push(this.pointSequenceOnSpline[0].substract(normal.multiply(this.THICKNESS)));
        for (let i = 1; i < this.pointSequenceOnSpline.length - 1; i += 1) {
            normal = (this.pointSequenceOnSpline[i].substract(this.pointSequenceOnSpline[i - 1])).normalize().rotate90degrees();
            tangent = (this.pointSequenceOnSpline[i + 1].substract(this.pointSequenceOnSpline[i - 1])).normalize();
            miter = tangent.rotate90degrees();
            length = this.THICKNESS / (miter.dot(normal));
            if (length > maxLength) {
                length = maxLength;
            }
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
    update(spline) {
        this.spline = spline;
        this.updatePointSequenceOnSpline();
        this.updateVertices();
        this.updateBuffers();
    }
    initAttribLocation() {
        this.a_Position = this.gl.getAttribLocation(this.polylineShader.program, 'a_Position');
        this.fColorLocation = this.gl.getUniformLocation(this.polylineShader.program, "fColor");
        if (this.a_Position < 0) {
            const warning = new ErrorLoging_1.WarningLog(this.constructor.name, "initAttribLocation", 'Failed to get the storage location of a_Position.');
            warning.logMessage();
        }
    }
    assignVertexAttrib() {
        // Assign the buffer object to a_Position variable
        this.gl.vertexAttribPointer(this.a_Position, 3, this.gl.FLOAT, false, 0, 0);
        // Enable the assignment to a_Position variable
        this.gl.enableVertexAttribArray(this.a_Position);
    }
    reset(spline) {
    }
    updateBuffers() {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertices, this.gl.DYNAMIC_DRAW);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
    }
    renderFrame() {
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
    initVertexBuffers() {
        // Create a buffer object
        this.vertexBuffer = this.gl.createBuffer();
        if (!this.vertexBuffer) {
            const warning = new ErrorLoging_1.WarningLog(this.constructor.name, "initVertexBuffers", 'Failed to create the vertex buffer object.');
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
        return 1;
    }
}
exports.PhantomCurveView = PhantomCurveView;

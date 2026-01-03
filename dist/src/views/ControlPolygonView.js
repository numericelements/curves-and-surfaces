"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ControlPolygonView = void 0;
const LineSegmentShader_1 = require("../2DgraphicsItems/LineSegmentShader");
const ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
const BSplineR1toR2_1 = require("../newBsplines/BSplineR1toR2");
const PeriodicBSplineR1toR2withOpenKnotSequence_1 = require("../newBsplines/PeriodicBSplineR1toR2withOpenKnotSequence");
class ControlPolygonView {
    constructor(gl, spline) {
        this.Z = 0;
        this.THICKNESS = 0.003;
        this.RED_COLOR = 216 / 255;
        this.GREEN_COLOR = 216 / 255;
        this.BLUE_COLOR = 216 / 255;
        this.ALPHA = 0.05;
        this.vertexBuffer = null;
        this.indexBuffer = null;
        this.vertices = new Float32Array([]);
        this.indices = new Uint8Array([]);
        this.gl = gl;
        this.lineSegmentShader = new LineSegmentShader_1.LineSegmentShader(this.gl);
        // this.controlPoints = spline.visibleControlPoints()
        this.controlPoints = spline.controlPoints;
        if (spline instanceof PeriodicBSplineR1toR2withOpenKnotSequence_1.PeriodicBSplineR1toR2withOpenKnotSequence) {
            this.controlPoints = spline.freeControlPoints;
            this.controlPoints.push(this.controlPoints[0]);
        }
        this.a_Position = -1;
        this.fColorLocation = -1;
        // Write the positions of vertices to a vertex shader
        const check = this.initVertexBuffers();
        if (check < 0) {
            console.log('Failed to set the positions of the vertices');
        }
    }
    updateVerticesAndIndices() {
        this.vertices = new Float32Array(this.controlPoints.length * 12);
        this.indices = new Uint8Array(this.controlPoints.length * 6);
        for (let i = 0; i < this.controlPoints.length - 1; i += 1) {
            const normal = this.controlPoints[i + 1].substract(this.controlPoints[i]).normalize().rotate90degrees();
            this.vertices[12 * i] = this.controlPoints[i].x - this.THICKNESS * normal.x;
            this.vertices[12 * i + 1] = this.controlPoints[i].y - this.THICKNESS * normal.y;
            this.vertices[12 * i + 2] = this.Z;
            this.vertices[12 * i + 3] = this.controlPoints[i + 1].x - this.THICKNESS * normal.x;
            this.vertices[12 * i + 4] = this.controlPoints[i + 1].y - this.THICKNESS * normal.y;
            this.vertices[12 * i + 5] = this.Z;
            this.vertices[12 * i + 6] = this.controlPoints[i + 1].x + this.THICKNESS * normal.x;
            this.vertices[12 * i + 7] = this.controlPoints[i + 1].y + this.THICKNESS * normal.y;
            this.vertices[12 * i + 8] = this.Z;
            this.vertices[12 * i + 9] = this.controlPoints[i].x + this.THICKNESS * normal.x;
            this.vertices[12 * i + 10] = this.controlPoints[i].y + this.THICKNESS * normal.y;
            this.vertices[12 * i + 11] = this.Z;
            this.indices[6 * i] = 4 * i;
            this.indices[6 * i + 1] = 4 * i + 1;
            this.indices[6 * i + 2] = 4 * i + 2;
            this.indices[6 * i + 3] = 4 * i;
            this.indices[6 * i + 4] = 4 * i + 2;
            this.indices[6 * i + 5] = 4 * i + 3;
        }
    }
    initAttribLocation() {
        this.a_Position = this.gl.getAttribLocation(this.lineSegmentShader.program, 'a_Position');
        this.fColorLocation = this.gl.getUniformLocation(this.lineSegmentShader.program, "fColor");
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
    initVertexBuffers() {
        this.updateVerticesAndIndices();
        // Create a buffer object
        this.vertexBuffer = this.gl.createBuffer();
        if (!this.vertexBuffer) {
            const warning = new ErrorLoging_1.WarningLog(this.constructor.name, "initVertexBuffers", 'Failed to create the vertex buffer object.');
            warning.logMessage();
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
            console.log('Failed to create the index buffer object');
            return -1;
        }
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, this.indices, this.gl.DYNAMIC_DRAW);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
        return this.indices.length;
    }
    renderFrame() {
        this.initAttribLocation();
        this.gl.useProgram(this.lineSegmentShader.program);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        this.assignVertexAttrib();
        this.gl.uniform4f(this.fColorLocation, this.RED_COLOR, this.GREEN_COLOR, this.BLUE_COLOR, this.ALPHA);
        this.lineSegmentShader.renderFrame(this.indices.length);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
        this.gl.useProgram(null);
    }
    update(spline) {
        if (spline instanceof BSplineR1toR2_1.BSplineR1toR2) {
            this.controlPoints = spline.controlPoints;
        }
        else if (spline instanceof PeriodicBSplineR1toR2withOpenKnotSequence_1.PeriodicBSplineR1toR2withOpenKnotSequence) {
            this.controlPoints = spline.freeControlPoints;
            this.controlPoints.push(this.controlPoints[0]);
        }
        else {
            const error = new ErrorLoging_1.ErrorLog(this.constructor.name, "update", "unknown type of curve. Unable to assign the controlPoints.");
            error.logMessage();
        }
        this.updateVerticesAndIndices();
        this.updateBuffers();
    }
    reset(spline) {
    }
    updateBuffers() {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertices, this.gl.DYNAMIC_DRAW);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, this.indices, this.gl.DYNAMIC_DRAW);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
    }
}
exports.ControlPolygonView = ControlPolygonView;

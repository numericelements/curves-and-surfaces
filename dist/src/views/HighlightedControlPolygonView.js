"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.HighlightedControlPolygonView = void 0;
var LineSegmentShader_1 = require("../2DgraphicsItems/LineSegmentShader");
var ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
var HighlightedControlPolygonView = /** @class */ (function () {
    function HighlightedControlPolygonView(spline, gl, closed) {
        if (closed === void 0) { closed = false; }
        this.closed = closed;
        this.Z = 0;
        this.THICKNESS = 0.003;
        this.RED_COLOR = 0;
        this.GREEN_COLOR = 0.6;
        this.BLUE_COLOR = 0;
        this.ALPHA = 1;
        this.vertexBuffer = null;
        this.indexBuffer = null;
        this.vertices = new Float32Array([]);
        this.indices = new Uint8Array([]);
        this.gl = gl;
        this.lineSegmentShader = new LineSegmentShader_1.LineSegmentShader(this.gl);
        // this.controlPoints = spline.visibleControlPoints()
        this.controlPoints = spline.controlPoints;
        if (this.closed) {
            this.controlPoints.push(this.controlPoints[0]);
        }
        this.a_Position = -1;
        this.fColorLocation = -1;
        // Write the positions of vertices to a vertex shader
        var check = this.initVertexBuffers();
        if (check < 0) {
            console.log('Failed to set the positions of the vertices');
        }
    }
    HighlightedControlPolygonView.prototype.updateVerticesAndIndices = function () {
        this.vertices = new Float32Array(this.controlPoints.length * 12);
        this.indices = new Uint8Array(this.controlPoints.length * 6);
        for (var i = 0; i < this.controlPoints.length - 1; i += 1) {
            var normal = this.controlPoints[i + 1].substract(this.controlPoints[i]).normalize().rotate90degrees();
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
    };
    HighlightedControlPolygonView.prototype.initAttribLocation = function () {
        this.a_Position = this.gl.getAttribLocation(this.lineSegmentShader.program, 'a_Position');
        this.fColorLocation = this.gl.getUniformLocation(this.lineSegmentShader.program, "fColor");
        if (this.a_Position < 0) {
            var warning = new ErrorLoging_1.WarningLog(this.constructor.name, "initAttribLocation", 'Failed to get the storage location of a_Position.');
            warning.logMessage();
        }
    };
    HighlightedControlPolygonView.prototype.assignVertexAttrib = function () {
        // Assign the buffer object to a_Position variable
        this.gl.vertexAttribPointer(this.a_Position, 3, this.gl.FLOAT, false, 0, 0);
        // Enable the assignment to a_Position variable
        this.gl.enableVertexAttribArray(this.a_Position);
    };
    HighlightedControlPolygonView.prototype.initVertexBuffers = function () {
        this.updateVerticesAndIndices();
        // Create a buffer object
        this.vertexBuffer = this.gl.createBuffer();
        if (!this.vertexBuffer) {
            var warning = new ErrorLoging_1.WarningLog(this.constructor.name, "initVertexBuffers", 'Failed to create the vertex buffer object.');
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
    };
    HighlightedControlPolygonView.prototype.renderFrame = function () {
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
    };
    HighlightedControlPolygonView.prototype.update = function (message) {
        this.controlPoints = message.controlPoints;
        // this.controlPoints = message.visibleControlPoints();
        if (this.closed) {
            this.controlPoints.push(this.controlPoints[0]);
        }
        this.updateVerticesAndIndices();
        this.updateBuffers();
    };
    HighlightedControlPolygonView.prototype.reset = function (message) {
    };
    HighlightedControlPolygonView.prototype.updateBuffers = function () {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertices, this.gl.DYNAMIC_DRAW);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, this.indices, this.gl.DYNAMIC_DRAW);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
    };
    return HighlightedControlPolygonView;
}());
exports.HighlightedControlPolygonView = HighlightedControlPolygonView;

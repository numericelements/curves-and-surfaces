"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurveKnotsView = void 0;
const SquareDotSolidShader_1 = require("../2DgraphicsItems/SquareDotSolidShader");
const ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
const AbstractPointView_1 = require("./AbstractPointView");
class CurveKnotsView extends AbstractPointView_1.AbstractPointView {
    constructor(gl, spline) {
        super(gl);
        this.Z = 0;
        this.DOT_SIZE = 0.01;
        this.RED_COLOR = 1.0;
        this.GREEN_COLOR = 0.0;
        this.BLUE_COLOR = 0.0;
        this.ALPHA = 1;
        this.knotAbscissae = [];
        this.spline = spline;
        this.squareDotSolidShader = new SquareDotSolidShader_1.SquareDotSolidShader(this.gl);
        this.pointSequenceToDisplay = [];
        this.updatePointAtKnotOnSpline();
        this.a_Position = -1;
        this.fColor = -1;
        this.FSIZE = 0;
        // Write the positions of vertices to a vertex shader
        const check = this.initVertexBuffers();
        if (check < 0) {
            const warning = new ErrorLoging_1.WarningLog(this.constructor.name, "constructor", "Failed to set the positions of the vertices.");
            warning.logMessage();
        }
        this.updateVerticesAndIndices();
        this.updateBuffers();
    }
    updatePointAtKnotOnSpline() {
        const splineTemp = this.spline.clone();
        this.knotAbscissae = splineTemp.getDistinctKnots();
        this.pointSequenceToDisplay = [];
        for (let kAbsc of this.knotAbscissae) {
            const point = this.spline.evaluate(kAbsc);
            this.pointSequenceToDisplay.push(point);
        }
    }
    initAttribLocation() {
        this.a_Position = this.gl.getAttribLocation(this.squareDotSolidShader.program, 'a_Position');
        this.fColor = this.gl.getUniformLocation(this.squareDotSolidShader.program, 'fColor');
        this.FSIZE = this.vertices.BYTES_PER_ELEMENT;
        if (this.a_Position < 0) {
            const warning = new ErrorLoging_1.WarningLog(this.constructor.name, "initAttribLocation", 'Failed to get the storage location of a_Position.');
            warning.logMessage();
        }
    }
    assignVertexAttrib() {
        // Assign the buffer object to a_Position variable
        this.gl.vertexAttribPointer(this.a_Position, 3, this.gl.FLOAT, false, this.FSIZE * 8, 0);
        // Enable the assignment to a_Position variable
        this.gl.enableVertexAttribArray(this.a_Position);
    }
    initVertexBuffers() {
        this.updatePointAtKnotOnSpline();
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
            const warning = new ErrorLoging_1.WarningLog(this.constructor.name, "initVertexBuffers", 'Failed to create the index buffer object.');
            warning.logMessage();
            return -1;
        }
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, this.indices, this.gl.DYNAMIC_DRAW);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
        return this.indices.length;
    }
    renderFrame() {
        this.initAttribLocation();
        this.gl.useProgram(this.squareDotSolidShader.program);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        this.assignVertexAttrib();
        this.gl.uniform4f(this.fColor, this.RED_COLOR, this.GREEN_COLOR, this.BLUE_COLOR, this.ALPHA);
        this.squareDotSolidShader.renderFrame(this.indices.length);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
        this.gl.useProgram(null);
    }
    update(spline) {
        this.spline = spline;
        this.updatePointAtKnotOnSpline();
        this.updateVerticesAndIndices();
        this.updateBuffers();
    }
    reset(spline) {
    }
}
exports.CurveKnotsView = CurveKnotsView;

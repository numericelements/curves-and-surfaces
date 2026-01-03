"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectedEnteringShapeSpaceInflectionView = void 0;
const SelectedDifferentialEventsView_1 = require("./SelectedDifferentialEventsView");
const ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
class SelectedEnteringShapeSpaceInflectionView extends SelectedDifferentialEventsView_1.SelectedDifferentialEventsView {
    constructor(gl, spline, pointLoc) {
        super(gl);
        this.DOT_SIZE = 0.02;
        this.RED_COLOR = 0 / 255;
        this.GREEN_COLOR = 0 / 255;
        this.BLUE_COLOR = 120 / 255;
        this.vertexBuffer = null;
        this.indexBuffer = null;
        this.vertices = new Float32Array([]);
        this.indices = new Uint8Array([]);
        let points = [];
        for (let pt of pointLoc) {
            this.pointLoc.push(pt);
            points.push(spline.evaluate(pt));
        }
        this.pointSequenceToDisplay = points.slice();
        this.a_Position = -1;
        this.a_Texture = -1;
        this.a_ColorLocation = -1;
        this.FSIZE = 0;
        // Write the positions of vertices to a vertex shader
        const check = this.initVertexBuffers();
        if (check < 0) {
            const warning = new ErrorLoging_1.WarningLog(this.constructor.name, "constructor", "Failed to set the positions of the vertices.");
            warning.logMessage();
        }
        this.update(spline);
    }
    initAttribLocation() {
        this.a_Position = this.gl.getAttribLocation(this.roundDotSolidShader.program, 'a_Position');
        this.a_Texture = this.gl.getAttribLocation(this.roundDotSolidShader.program, 'a_Texture');
        //a_Color = gl.getAttribLocation(<CurvatureExtremaShaders>this.curvatureExtremaShaders.program, 'a_Color'),
        this.FSIZE = this.vertices.BYTES_PER_ELEMENT;
        this.a_ColorLocation = this.gl.getUniformLocation(this.roundDotSolidShader.program, "a_Color");
        if (this.a_Position < 0) {
            const warning = new ErrorLoging_1.WarningLog(this.constructor.name, "initAttribLocation", 'Failed to get the storage location of a_Position.');
            warning.logMessage();
        }
        if (this.a_Texture < 0) {
            const warning = new ErrorLoging_1.WarningLog(this.constructor.name, "initAttribLocation", 'Failed to get the storage location of a_Texture.');
            warning.logMessage();
        }
    }
    assignVertexAttrib() {
        // Assign the buffer object to a_Position variable
        this.gl.vertexAttribPointer(this.a_Position, 3, this.gl.FLOAT, false, this.FSIZE * 8, 0);
        this.gl.vertexAttribPointer(this.a_Texture, 2, this.gl.FLOAT, false, this.FSIZE * 8, this.FSIZE * 3);
        // Enable the assignment to a_Position variable
        this.gl.enableVertexAttribArray(this.a_Position);
        this.gl.enableVertexAttribArray(this.a_Texture);
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
        this.gl.useProgram(this.roundDotSolidShader.program);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        this.assignVertexAttrib();
        this.gl.uniform4f(this.a_ColorLocation, this.RED_COLOR, this.GREEN_COLOR, this.BLUE_COLOR, this.ALPHA);
        this.roundDotSolidShader.renderFrame(this.indices.length);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
        this.gl.useProgram(null);
    }
    update(spline) {
        let points = [];
        for (let i = 0; i < this.pointLoc.length; i += 1) {
            points.push(spline.evaluate(this.pointLoc[i]));
        }
        this.pointSequenceToDisplay = points.slice();
        this.updateVerticesAndIndices();
        this.updateBuffers();
    }
}
exports.SelectedEnteringShapeSpaceInflectionView = SelectedEnteringShapeSpaceInflectionView;

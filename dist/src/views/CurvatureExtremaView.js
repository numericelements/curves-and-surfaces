"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.CurvatureExtremaView = void 0;
var RoundDotSolidShader_1 = require("../2DgraphicsItems/RoundDotSolidShader");
var ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
var AbstractPointView_1 = require("./AbstractPointView");
var CurvatureExtremaView = /** @class */ (function (_super) {
    __extends(CurvatureExtremaView, _super);
    function CurvatureExtremaView(gl, curveModelDifferentialEvents) {
        var _this = _super.call(this, gl) || this;
        _this.Z = 0;
        _this.DOT_SIZE = 0.03;
        _this.RED_COLOR = 216 / 255;
        _this.GREEN_COLOR = 91 / 255;
        _this.BLUE_COLOR = 95 / 255;
        _this.ALPHA = 1;
        _this.roundDotSolidShader = new RoundDotSolidShader_1.RoundDotSolidShader(_this.gl);
        _this.curveModelDifferentialEvents = curveModelDifferentialEvents;
        _this.pointSequenceToDisplay = _this.curveModelDifferentialEvents.curvatureExtremaLocationsEuclideanSpace;
        _this.a_Position = -1;
        _this.a_Texture = -1;
        _this.a_ColorLocation = -1;
        _this.FSIZE = 0;
        // Write the positions of vertices to a vertex shader
        var check = _this.initVertexBuffers();
        if (check < 0) {
            var warning = new ErrorLoging_1.WarningLog(_this.constructor.name, "constructor", "Failed to set the positions of the vertices.");
            warning.logMessage();
        }
        _this.updateVerticesAndIndices();
        _this.updateBuffers();
        return _this;
    }
    CurvatureExtremaView.prototype.initAttribLocation = function () {
        this.a_Position = this.gl.getAttribLocation(this.roundDotSolidShader.program, 'a_Position');
        this.a_Texture = this.gl.getAttribLocation(this.roundDotSolidShader.program, 'a_Texture');
        this.FSIZE = this.vertices.BYTES_PER_ELEMENT;
        this.a_ColorLocation = this.gl.getUniformLocation(this.roundDotSolidShader.program, "a_Color");
        if (this.a_Position < 0) {
            var warning = new ErrorLoging_1.WarningLog(this.constructor.name, "initAttribLocation", 'Failed to get the storage location of a_Position.');
            warning.logMessage();
        }
        if (this.a_Texture < 0) {
            var warning = new ErrorLoging_1.WarningLog(this.constructor.name, "initAttribLocation", 'Failed to get the storage location of a_Texture.');
            warning.logMessage();
        }
    };
    CurvatureExtremaView.prototype.assignVertexAttrib = function () {
        // Assign the buffer object to a_Position variable
        this.gl.vertexAttribPointer(this.a_Position, 3, this.gl.FLOAT, false, this.FSIZE * 8, 0);
        this.gl.vertexAttribPointer(this.a_Texture, 2, this.gl.FLOAT, false, this.FSIZE * 8, this.FSIZE * 3);
        // Enable the assignment to a_Position variable
        this.gl.enableVertexAttribArray(this.a_Position);
        this.gl.enableVertexAttribArray(this.a_Texture);
    };
    CurvatureExtremaView.prototype.initVertexBuffers = function () {
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
        // Write data into the buffer object
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertices, this.gl.DYNAMIC_DRAW);
        this.initAttribLocation();
        this.assignVertexAttrib();
        // Unbind the buffer object
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
        this.indexBuffer = this.gl.createBuffer();
        if (!this.indexBuffer) {
            var warning = new ErrorLoging_1.WarningLog(this.constructor.name, "initVertexBuffers", 'Failed to create the index buffer object.');
            warning.logMessage();
            return -1;
        }
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, this.indices, this.gl.DYNAMIC_DRAW);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
        return this.indices.length;
    };
    CurvatureExtremaView.prototype.renderFrame = function () {
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
    };
    CurvatureExtremaView.prototype.reset = function (diffEventsLocations) {
    };
    CurvatureExtremaView.prototype.update = function (diffEventsLocations) {
        this.pointSequenceToDisplay = diffEventsLocations.curvatureExtremaLocationsEuclideanSpace;
        this.updateVerticesAndIndices();
        this.updateBuffers();
    };
    return CurvatureExtremaView;
}(AbstractPointView_1.AbstractPointView));
exports.CurvatureExtremaView = CurvatureExtremaView;

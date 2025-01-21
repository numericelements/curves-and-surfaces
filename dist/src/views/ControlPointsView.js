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
exports.ControlPointsView = void 0;
var RoundDotTwoLevelsTransparencyShader_1 = require("../2DgraphicsItems/RoundDotTwoLevelsTransparencyShader");
var ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
var AbstractMouseSelectablePointView_1 = require("./AbstractMouseSelectablePointView");
var PeriodicBSplineR1toR2withOpenKnotSequence_1 = require("../newBsplines/PeriodicBSplineR1toR2withOpenKnotSequence");
var BSplineR1toR2_1 = require("../newBsplines/BSplineR1toR2");
var ControlPointsView = /** @class */ (function (_super) {
    __extends(ControlPointsView, _super);
    function ControlPointsView(gl, spline) {
        var _this = _super.call(this, gl, spline) || this;
        _this.Z = 0;
        _this.DOT_SIZE = 0.03;
        _this.RED_COLOR = 1.0;
        _this.GREEN_COLOR = 1.0;
        _this.BLUE_COLOR = 1.0;
        _this.roundDotTwoLevelsTransparencyShader = new RoundDotTwoLevelsTransparencyShader_1.RoundDotTwoLevelsTransparencyShader(_this.gl);
        _this.pointSequenceToDisplay = spline.controlPoints;
        if (spline instanceof PeriodicBSplineR1toR2withOpenKnotSequence_1.PeriodicBSplineR1toR2withOpenKnotSequence) {
            _this.pointSequenceToDisplay = spline.freeControlPoints;
        }
        _this.a_Position = -1;
        _this.a_Texture = -1;
        _this.a_Color = -1;
        _this.FSIZE = 0;
        // Write the positions of vertices to a vertex shader
        var check = _this.initVertexBuffers();
        if (check < 0) {
            var warning = new ErrorLoging_1.WarningLog(_this.constructor.name, "constructor", 'Failed to set the positions of the vertices');
            warning.logMessage();
        }
        _this.updateVerticesAndIndices();
        _this.updateBuffers();
        return _this;
    }
    ControlPointsView.prototype.initAttribLocation = function () {
        this.a_Position = this.gl.getAttribLocation(this.roundDotTwoLevelsTransparencyShader.program, 'a_Position');
        this.a_Texture = this.gl.getAttribLocation(this.roundDotTwoLevelsTransparencyShader.program, 'a_Texture');
        this.a_Color = this.gl.getAttribLocation(this.roundDotTwoLevelsTransparencyShader.program, 'a_Color');
        this.FSIZE = this.vertices.BYTES_PER_ELEMENT;
        if (this.a_Position < 0) {
            var warning = new ErrorLoging_1.WarningLog(this.constructor.name, "initAttribLocation", 'Failed to get the storage location of a_Position.');
            warning.logMessage();
        }
        if (this.a_Texture < 0) {
            var warning = new ErrorLoging_1.WarningLog(this.constructor.name, "initAttribLocation", 'Failed to get the storage location of a_Texture');
            warning.logMessage();
        }
        if (this.a_Color < 0) {
            var warning = new ErrorLoging_1.WarningLog(this.constructor.name, "initAttribLocation", 'Failed to get the storage location of a_Color');
            warning.logMessage();
        }
    };
    ControlPointsView.prototype.assignVertexAttrib = function () {
        // Assign the buffer object to a_Position variable
        this.gl.vertexAttribPointer(this.a_Position, 3, this.gl.FLOAT, false, this.FSIZE * 8, 0);
        this.gl.vertexAttribPointer(this.a_Texture, 2, this.gl.FLOAT, false, this.FSIZE * 8, this.FSIZE * 3);
        this.gl.vertexAttribPointer(this.a_Color, 3, this.gl.FLOAT, false, this.FSIZE * 8, this.FSIZE * 5);
        // Enable the assignment to a_Position variable
        this.gl.enableVertexAttribArray(this.a_Position);
        this.gl.enableVertexAttribArray(this.a_Texture);
        this.gl.enableVertexAttribArray(this.a_Color);
    };
    ControlPointsView.prototype.initVertexBuffers = function () {
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
            var warning = new ErrorLoging_1.WarningLog(this.constructor.name, "initVertexBuffers", 'Failed to create the index buffer object');
            warning.logMessage();
            return -1;
        }
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, this.indices, this.gl.DYNAMIC_DRAW);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
        return this.indices.length;
    };
    ControlPointsView.prototype.renderFrame = function () {
        this.initAttribLocation();
        this.gl.useProgram(this.roundDotTwoLevelsTransparencyShader.program);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        this.assignVertexAttrib();
        this.roundDotTwoLevelsTransparencyShader.renderFrame(this.indices.length, this.selectedPointIndex);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
        this.gl.useProgram(null);
    };
    ControlPointsView.prototype.reset = function (spline) {
    };
    ControlPointsView.prototype.update = function (spline) {
        this.spline = spline;
        if (spline instanceof BSplineR1toR2_1.BSplineR1toR2) {
            this.pointSequenceToDisplay = spline.controlPoints;
            this.controlPoints = spline.controlPoints;
        }
        else if (spline instanceof PeriodicBSplineR1toR2withOpenKnotSequence_1.PeriodicBSplineR1toR2withOpenKnotSequence) {
            this.pointSequenceToDisplay = spline.freeControlPoints;
            this.controlPoints = spline.freeControlPoints;
        }
        else {
            var error = new ErrorLoging_1.ErrorLog(this.constructor.name, "update", "unknown type of curve. Unable to assign the pointSequenceToDisplay.");
            error.logMessage();
        }
        this.updateVerticesAndIndices();
        this.updateBuffers();
    };
    ControlPointsView.prototype.setSelected = function (controlPointIndex) {
        this.selectedPointIndex = controlPointIndex;
    };
    return ControlPointsView;
}(AbstractMouseSelectablePointView_1.AbstractMouseSelectablePointView));
exports.ControlPointsView = ControlPointsView;

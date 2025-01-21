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
var __values = (this && this.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClampedControlPointView = void 0;
var RoundDotTwoLevelsTransparencyShader_1 = require("../2DgraphicsItems/RoundDotTwoLevelsTransparencyShader");
var ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
var AbstractMouseSelectablePointView_1 = require("./AbstractMouseSelectablePointView");
var ShapeNavigableCurve_1 = require("../shapeNavigableCurve/ShapeNavigableCurve");
var ClampedControlPointView = /** @class */ (function (_super) {
    __extends(ClampedControlPointView, _super);
    function ClampedControlPointView(gl, spline, clampedCPindices) {
        var e_1, _a;
        var _this = _super.call(this, gl, spline) || this;
        _this.Z = 0;
        _this.DOT_SIZE = 0.03;
        _this.RED_COLOR = 0.0;
        _this.GREEN_COLOR = 0.0;
        _this.BLUE_COLOR = 1.0;
        _this.roundDotTwoLevelsTransparencyShader = new RoundDotTwoLevelsTransparencyShader_1.RoundDotTwoLevelsTransparencyShader(_this.gl);
        _this.selectedPoints = [];
        for (var i = 0; i < clampedCPindices.length; i++) {
            if (clampedCPindices[i] !== ShapeNavigableCurve_1.NO_CONSTRAINT)
                _this.selectedPoints.push(clampedCPindices[i]);
        }
        _this.knots = spline.getDistinctKnots();
        try {
            for (var _b = __values(_this.selectedPoints), _c = _b.next(); !_c.done; _c = _b.next()) {
                var index = _c.value;
                _this.pointSequenceToDisplay.push(spline.evaluate(_this.knots[index]));
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
        _this.a_Position = -1;
        _this.a_Texture = -1;
        _this.a_Color = -1;
        _this.FSIZE = 0;
        // Write the positions of vertices to a vertex shader
        var check = _this.initVertexBuffers();
        if (check < 0) {
            var warning = new ErrorLoging_1.WarningLog(_this.constructor.name, "constructor", 'Failed to set the positions of the vertices.');
            warning.logMessage();
        }
        return _this;
    }
    ClampedControlPointView.prototype.initAttribLocation = function () {
        this.a_Position = this.gl.getAttribLocation(this.roundDotTwoLevelsTransparencyShader.program, 'a_Position');
        this.a_Texture = this.gl.getAttribLocation(this.roundDotTwoLevelsTransparencyShader.program, 'a_Texture');
        this.a_Color = this.gl.getAttribLocation(this.roundDotTwoLevelsTransparencyShader.program, 'a_Color');
        this.FSIZE = this.vertices.BYTES_PER_ELEMENT;
        if (this.a_Position < 0) {
            var warning = new ErrorLoging_1.WarningLog(this.constructor.name, "initAttribLocation", 'Failed to get the storage location of a_Position.');
            warning.logMessage();
        }
        if (this.a_Texture < 0) {
            var warning = new ErrorLoging_1.WarningLog(this.constructor.name, "initAttribLocation", 'Failed to get the storage location of a_Texture.');
            warning.logMessage();
        }
        if (this.a_Color < 0) {
            var warning = new ErrorLoging_1.WarningLog(this.constructor.name, "initAttribLocation", 'Failed to get the storage location of a_Color');
            warning.logMessage();
        }
    };
    ClampedControlPointView.prototype.assignVertexAttrib = function () {
        // Assign the buffer object to a_Position variable
        this.gl.vertexAttribPointer(this.a_Position, 3, this.gl.FLOAT, false, this.FSIZE * 8, 0);
        this.gl.vertexAttribPointer(this.a_Texture, 2, this.gl.FLOAT, false, this.FSIZE * 8, this.FSIZE * 3);
        this.gl.vertexAttribPointer(this.a_Color, 3, this.gl.FLOAT, false, this.FSIZE * 8, this.FSIZE * 5);
        // Enable the assignment to a_Position variable
        this.gl.enableVertexAttribArray(this.a_Position);
        this.gl.enableVertexAttribArray(this.a_Texture);
        this.gl.enableVertexAttribArray(this.a_Color);
    };
    ClampedControlPointView.prototype.initVertexBuffers = function () {
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
    ClampedControlPointView.prototype.renderFrame = function () {
        this.initAttribLocation();
        this.gl.useProgram(this.roundDotTwoLevelsTransparencyShader.program);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        this.assignVertexAttrib();
        this.roundDotTwoLevelsTransparencyShader.renderFrame(this.indices.length, this.selectedKnotIndex);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
        this.gl.useProgram(null);
    };
    ClampedControlPointView.prototype.update = function (spline) {
        var e_2, _a;
        this.pointSequenceToDisplay = [];
        this.spline = spline;
        this.controlPoints = spline.controlPoints;
        this.knots = spline.getDistinctKnots();
        try {
            for (var _b = __values(this.selectedPoints), _c = _b.next(); !_c.done; _c = _b.next()) {
                var index = _c.value;
                this.pointSequenceToDisplay.push(spline.evaluate(this.knots[index]));
            }
        }
        catch (e_2_1) { e_2 = { error: e_2_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_2) throw e_2.error; }
        }
        this.updateVerticesAndIndices();
        this.updateBuffers();
    };
    ClampedControlPointView.prototype.reset = function (spline) {
    };
    ClampedControlPointView.prototype.updateSelectedPoints = function (knotIndex) {
        var index = this.selectedPoints.findIndex(function (element) { return element == knotIndex; });
        if (index !== -1) {
            this.selectedPoints.splice(index, 1);
        }
        else if (this.selectedPoints.length < 2) {
            this.selectedPoints.push(knotIndex);
        }
        else {
            var warning = new ErrorLoging_1.WarningLog(this.constructor.name, 'updateSelectedPoints', ' inconsistent number of clamped points !');
            warning.logMessage();
        }
    };
    ClampedControlPointView.prototype.clearSelectedPoints = function () {
        this.selectedPoints = [];
        this.pointSequenceToDisplay = [];
    };
    ClampedControlPointView.prototype.setSelected = function (pointIndex) {
        // this.selectedKnotIndex = knotIndex;
        this.selectedPointIndex = pointIndex;
    };
    ClampedControlPointView.prototype.setSelectedKnot = function (knotIndex) {
        if (this.selectedPoints.length < ShapeNavigableCurve_1.MAX_CLAMPED_POINTS) {
            this.selectedPoints.push(knotIndex);
        }
        else {
            var error = new ErrorLoging_1.ErrorLog(this.constructor.name, 'setSelectedKnot', 'Try to insert a clamped point but maximum number of clamped points exceeded.');
            error.logMessage();
        }
    };
    return ClampedControlPointView;
}(AbstractMouseSelectablePointView_1.AbstractMouseSelectablePointView));
exports.ClampedControlPointView = ClampedControlPointView;

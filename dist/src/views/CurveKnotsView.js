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
exports.CurveKnotsView = void 0;
var SquareDotSolidShader_1 = require("../2DgraphicsItems/SquareDotSolidShader");
var ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
var AbstractPointView_1 = require("./AbstractPointView");
var CurveKnotsView = /** @class */ (function (_super) {
    __extends(CurveKnotsView, _super);
    function CurveKnotsView(gl, spline) {
        var _this = _super.call(this, gl) || this;
        _this.Z = 0;
        _this.DOT_SIZE = 0.01;
        _this.RED_COLOR = 1.0;
        _this.GREEN_COLOR = 0.0;
        _this.BLUE_COLOR = 0.0;
        _this.ALPHA = 1;
        _this.knotAbscissae = [];
        _this.spline = spline;
        _this.squareDotSolidShader = new SquareDotSolidShader_1.SquareDotSolidShader(_this.gl);
        _this.pointSequenceToDisplay = [];
        _this.updatePointAtKnotOnSpline();
        _this.a_Position = -1;
        _this.fColor = -1;
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
    CurveKnotsView.prototype.updatePointAtKnotOnSpline = function () {
        var e_1, _a;
        var splineTemp = this.spline.clone();
        this.knotAbscissae = splineTemp.getDistinctKnots();
        this.pointSequenceToDisplay = [];
        try {
            for (var _b = __values(this.knotAbscissae), _c = _b.next(); !_c.done; _c = _b.next()) {
                var kAbsc = _c.value;
                var point = this.spline.evaluate(kAbsc);
                this.pointSequenceToDisplay.push(point);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (_c && !_c.done && (_a = _b.return)) _a.call(_b);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    CurveKnotsView.prototype.initAttribLocation = function () {
        this.a_Position = this.gl.getAttribLocation(this.squareDotSolidShader.program, 'a_Position');
        this.fColor = this.gl.getUniformLocation(this.squareDotSolidShader.program, 'fColor');
        this.FSIZE = this.vertices.BYTES_PER_ELEMENT;
        if (this.a_Position < 0) {
            var warning = new ErrorLoging_1.WarningLog(this.constructor.name, "initAttribLocation", 'Failed to get the storage location of a_Position.');
            warning.logMessage();
        }
    };
    CurveKnotsView.prototype.assignVertexAttrib = function () {
        // Assign the buffer object to a_Position variable
        this.gl.vertexAttribPointer(this.a_Position, 3, this.gl.FLOAT, false, this.FSIZE * 8, 0);
        // Enable the assignment to a_Position variable
        this.gl.enableVertexAttribArray(this.a_Position);
    };
    CurveKnotsView.prototype.initVertexBuffers = function () {
        this.updatePointAtKnotOnSpline();
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
            var warning = new ErrorLoging_1.WarningLog(this.constructor.name, "initVertexBuffers", 'Failed to create the index buffer object.');
            warning.logMessage();
            return -1;
        }
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, this.indices, this.gl.DYNAMIC_DRAW);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
        return this.indices.length;
    };
    CurveKnotsView.prototype.renderFrame = function () {
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
    };
    CurveKnotsView.prototype.update = function (spline) {
        this.spline = spline;
        this.updatePointAtKnotOnSpline();
        this.updateVerticesAndIndices();
        this.updateBuffers();
    };
    CurveKnotsView.prototype.reset = function (spline) {
    };
    return CurveKnotsView;
}(AbstractPointView_1.AbstractPointView));
exports.CurveKnotsView = CurveKnotsView;

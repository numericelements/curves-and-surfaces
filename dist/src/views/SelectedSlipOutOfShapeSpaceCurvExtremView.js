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
exports.SelectedSlipOutOfShapeSpaceCurvExtremaView = void 0;
var SelectedDifferentialEventsView_1 = require("./SelectedDifferentialEventsView");
var ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
var SelectedSlipOutOfShapeSpaceCurvExtremaView = /** @class */ (function (_super) {
    __extends(SelectedSlipOutOfShapeSpaceCurvExtremaView, _super);
    function SelectedSlipOutOfShapeSpaceCurvExtremaView(gl, spline, pointLoc) {
        var e_1, _a;
        var _this = _super.call(this, gl) || this;
        _this.DOT_SIZE = 0.025;
        _this.RED_COLOR = 0 / 255;
        _this.GREEN_COLOR = 200 / 255;
        _this.BLUE_COLOR = 0 / 255;
        _this.vertexBuffer = null;
        _this.indexBuffer = null;
        _this.vertices = new Float32Array([]);
        _this.indices = new Uint8Array([]);
        var points = [];
        try {
            for (var pointLoc_1 = __values(pointLoc), pointLoc_1_1 = pointLoc_1.next(); !pointLoc_1_1.done; pointLoc_1_1 = pointLoc_1.next()) {
                var pt = pointLoc_1_1.value;
                _this.pointLoc.push(pt);
                points.push(spline.evaluate(pt));
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (pointLoc_1_1 && !pointLoc_1_1.done && (_a = pointLoc_1.return)) _a.call(pointLoc_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        _this.pointSequenceToDisplay = points.slice();
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
        _this.update(spline);
        return _this;
    }
    SelectedSlipOutOfShapeSpaceCurvExtremaView.prototype.initAttribLocation = function () {
        this.a_Position = this.gl.getAttribLocation(this.roundDotSolidShader.program, 'a_Position');
        this.a_Texture = this.gl.getAttribLocation(this.roundDotSolidShader.program, 'a_Texture');
        //a_Color = gl.getAttribLocation(<CurvatureExtremaShaders>this.curvatureExtremaShaders.program, 'a_Color'),
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
    SelectedSlipOutOfShapeSpaceCurvExtremaView.prototype.assignVertexAttrib = function () {
        // Assign the buffer object to a_Position variable
        this.gl.vertexAttribPointer(this.a_Position, 3, this.gl.FLOAT, false, this.FSIZE * 8, 0);
        this.gl.vertexAttribPointer(this.a_Texture, 2, this.gl.FLOAT, false, this.FSIZE * 8, this.FSIZE * 3);
        // Enable the assignment to a_Position variable
        this.gl.enableVertexAttribArray(this.a_Position);
        this.gl.enableVertexAttribArray(this.a_Texture);
    };
    SelectedSlipOutOfShapeSpaceCurvExtremaView.prototype.initVertexBuffers = function () {
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
    SelectedSlipOutOfShapeSpaceCurvExtremaView.prototype.renderFrame = function () {
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
    SelectedSlipOutOfShapeSpaceCurvExtremaView.prototype.update = function (spline) {
        var points = [];
        for (var i = 0; i < this.pointLoc.length; i += 1) {
            points.push(spline.evaluate(this.pointLoc[i]));
        }
        this.pointSequenceToDisplay = points.slice();
        this.updateVerticesAndIndices();
        this.updateBuffers();
    };
    return SelectedSlipOutOfShapeSpaceCurvExtremaView;
}(SelectedDifferentialEventsView_1.SelectedDifferentialEventsView));
exports.SelectedSlipOutOfShapeSpaceCurvExtremaView = SelectedSlipOutOfShapeSpaceCurvExtremaView;

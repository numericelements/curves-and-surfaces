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
exports.ClickButtonView = void 0;
var ErrorLoging_1 = require("../errorProcessing/ErrorLoging");
var InsertKnotButtonDialogShader_1 = require("../2DgraphicsItems/InsertKnotButtonDialogShader");
var AbstractMouseSelectableButtonView_1 = require("./AbstractMouseSelectableButtonView");
var ClickButtonView = /** @class */ (function (_super) {
    __extends(ClickButtonView, _super);
    function ClickButtonView(gl) {
        var _this = _super.call(this, gl) || this;
        _this.HEIGHT_SIZE = 0.05;
        _this.RATIO_WIDTH_HEIGHT = 1.5;
        _this.RED_COLOR = 0.5;
        _this.GREEN_COLOR = 0.5;
        _this.BLUE_COLOR = 0.5;
        _this.X_LOCATION = -0.8;
        _this.Y_LOCATION = 0.8;
        _this.Z = 0;
        _this.insertKnotButtonDialogShader = new InsertKnotButtonDialogShader_1.InsertKnotButtonDialogShader(_this.gl);
        _this.a_Position = -1;
        _this.a_Texture = -1;
        _this.a_Color = -1;
        _this.FSIZE = 0;
        var check = _this.initVertexBuffers();
        if (check < 0) {
            var warning = new ErrorLoging_1.WarningLog(_this.constructor.name, "constructor", 'Failed to set the positions of the vertices.');
            warning.logMessage();
        }
        return _this;
    }
    ClickButtonView.prototype.initAttribLocation = function () {
        this.a_Position = this.gl.getAttribLocation(this.insertKnotButtonDialogShader.program, 'a_Position');
        this.a_Texture = this.gl.getAttribLocation(this.insertKnotButtonDialogShader.program, 'a_Texture'),
            this.a_Color = this.gl.getAttribLocation(this.insertKnotButtonDialogShader.program, 'a_Color'),
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
    ClickButtonView.prototype.assignVertexAttrib = function () {
        // Assign the buffer object to a_Position variable
        this.gl.vertexAttribPointer(this.a_Position, 3, this.gl.FLOAT, false, this.FSIZE * 8, 0);
        this.gl.vertexAttribPointer(this.a_Texture, 2, this.gl.FLOAT, false, this.FSIZE * 8, this.FSIZE * 3);
        this.gl.vertexAttribPointer(this.a_Color, 3, this.gl.FLOAT, false, this.FSIZE * 8, this.FSIZE * 5);
        // Enable the assignment to a_Position variable
        this.gl.enableVertexAttribArray(this.a_Position);
        this.gl.enableVertexAttribArray(this.a_Texture);
        this.gl.enableVertexAttribArray(this.a_Color);
    };
    ClickButtonView.prototype.initVertexBuffers = function () {
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
    ClickButtonView.prototype.renderFrame = function () {
        this.initAttribLocation();
        this.gl.useProgram(this.insertKnotButtonDialogShader.program);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        this.assignVertexAttrib();
        this.insertKnotButtonDialogShader.renderFrame(this.indices.length);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
        this.gl.useProgram(null);
    };
    return ClickButtonView;
}(AbstractMouseSelectableButtonView_1.AbstractMouseSelectableButtonView));
exports.ClickButtonView = ClickButtonView;

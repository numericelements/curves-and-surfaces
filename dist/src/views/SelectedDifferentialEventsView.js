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
exports.SelectedDifferentialEventsView = void 0;
var RoundDotSolidShader_1 = require("../2DgraphicsItems/RoundDotSolidShader");
var AbstractPointView_1 = require("./AbstractPointView");
var SelectedDifferentialEventsView = /** @class */ (function (_super) {
    __extends(SelectedDifferentialEventsView, _super);
    function SelectedDifferentialEventsView(gl) {
        var _this = _super.call(this, gl) || this;
        _this.Z = 0;
        _this.DOT_SIZE = 0;
        _this.RED_COLOR = 0;
        _this.GREEN_COLOR = 0;
        _this.BLUE_COLOR = 0;
        _this.ALPHA = 1;
        _this.indexBuffer = null;
        _this.vertices = new Float32Array([]);
        _this.indices = new Uint8Array([]);
        _this.pointLoc = [];
        _this.roundDotSolidShader = new RoundDotSolidShader_1.RoundDotSolidShader(_this.gl);
        return _this;
    }
    SelectedDifferentialEventsView.prototype.updateVerticesAndIndices = function () {
        this.vertices = new Float32Array(this.pointSequenceToDisplay.length * 32);
        this.indices = new Uint8Array(this.pointSequenceToDisplay.length * 6);
        for (var i = 0; i < this.pointSequenceToDisplay.length; i += 1) {
            var x = this.pointSequenceToDisplay[i].x;
            var y = this.pointSequenceToDisplay[i].y;
            this.vertices[32 * i] = x - this.DOT_SIZE;
            this.vertices[32 * i + 1] = y - this.DOT_SIZE;
            this.vertices[32 * i + 2] = this.Z;
            this.vertices[32 * i + 3] = -1;
            this.vertices[32 * i + 4] = -1;
            this.vertices[32 * i + 5] = this.RED_COLOR;
            this.vertices[32 * i + 6] = this.GREEN_COLOR;
            this.vertices[32 * i + 7] = this.BLUE_COLOR;
            this.vertices[32 * i + 8] = x + this.DOT_SIZE;
            this.vertices[32 * i + 9] = y - this.DOT_SIZE;
            this.vertices[32 * i + 10] = this.Z;
            this.vertices[32 * i + 11] = 1;
            this.vertices[32 * i + 12] = -1;
            this.vertices[32 * i + 13] = this.RED_COLOR;
            this.vertices[32 * i + 14] = this.GREEN_COLOR;
            this.vertices[32 * i + 15] = this.BLUE_COLOR;
            this.vertices[32 * i + 16] = x + this.DOT_SIZE;
            this.vertices[32 * i + 17] = y + this.DOT_SIZE;
            this.vertices[32 * i + 18] = this.Z;
            this.vertices[32 * i + 19] = 1;
            this.vertices[32 * i + 20] = 1;
            this.vertices[32 * i + 21] = this.RED_COLOR;
            this.vertices[32 * i + 22] = this.GREEN_COLOR;
            this.vertices[32 * i + 23] = this.BLUE_COLOR;
            this.vertices[32 * i + 24] = x - this.DOT_SIZE;
            this.vertices[32 * i + 25] = y + this.DOT_SIZE;
            this.vertices[32 * i + 26] = this.Z;
            this.vertices[32 * i + 27] = -1;
            this.vertices[32 * i + 28] = 1;
            this.vertices[32 * i + 29] = this.RED_COLOR;
            this.vertices[32 * i + 30] = this.GREEN_COLOR;
            this.vertices[32 * i + 31] = this.BLUE_COLOR;
            this.indices[6 * i] = 4 * i;
            this.indices[6 * i + 1] = 4 * i + 1;
            this.indices[6 * i + 2] = 4 * i + 2;
            this.indices[6 * i + 3] = 4 * i;
            this.indices[6 * i + 4] = 4 * i + 2;
            this.indices[6 * i + 5] = 4 * i + 3;
        }
    };
    SelectedDifferentialEventsView.prototype.updateBuffers = function () {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertices, this.gl.DYNAMIC_DRAW);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, this.indices, this.gl.DYNAMIC_DRAW);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
    };
    SelectedDifferentialEventsView.prototype.updatePoints = function (pointLoc) {
        var e_1, _a;
        this.pointLoc = [];
        try {
            for (var pointLoc_1 = __values(pointLoc), pointLoc_1_1 = pointLoc_1.next(); !pointLoc_1_1.done; pointLoc_1_1 = pointLoc_1.next()) {
                var point = pointLoc_1_1.value;
                this.pointLoc.push(point);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (pointLoc_1_1 && !pointLoc_1_1.done && (_a = pointLoc_1.return)) _a.call(pointLoc_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
    };
    SelectedDifferentialEventsView.prototype.clearPoints = function () {
        this.pointLoc = [];
        this.pointSequenceToDisplay = [];
    };
    return SelectedDifferentialEventsView;
}(AbstractPointView_1.AbstractPointView));
exports.SelectedDifferentialEventsView = SelectedDifferentialEventsView;

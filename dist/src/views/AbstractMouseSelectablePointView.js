"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractMouseSelectablePointView = void 0;
const PeriodicBSplineR1toR2withOpenKnotSequence_1 = require("../newBsplines/PeriodicBSplineR1toR2withOpenKnotSequence");
const AbstractMouseSelectableGraphicEntityView_1 = require("./AbstractMouseSelectableGraphicEntityView");
class AbstractMouseSelectablePointView extends AbstractMouseSelectableGraphicEntityView_1.AbstractMouseSelectableGraphicEntityView {
    constructor(gl, spline) {
        super(gl);
        this.Z = 0;
        this.DOT_SIZE = 0;
        this.RED_COLOR = 0;
        this.GREEN_COLOR = 0;
        this.BLUE_COLOR = 0;
        this.ALPHA = 1;
        this.vertexBuffer = null;
        this.indexBuffer = null;
        this.vertices = new Float32Array([]);
        this.indices = new Uint8Array([]);
        this.pointSequenceToDisplay = [];
        this.selectedPointIndex = null;
        this.selectedKnotIndex = null;
        this.spline = spline;
        this.controlPoints = spline.controlPoints;
        if (spline instanceof PeriodicBSplineR1toR2withOpenKnotSequence_1.PeriodicBSplineR1toR2withOpenKnotSequence) {
            this.controlPoints = spline.freeControlPoints;
        }
        this.knots = spline.getDistinctKnots();
    }
    pointSelection(x, y, deltaSquared = this.SLCTN_ACCURACY_Squared) {
        this.selectedPointIndex = null;
        for (let i = 0; i < this.controlPoints.length; i += 1) {
            if (Math.pow(x - this.controlPoints[i].x, 2) + Math.pow(y - this.controlPoints[i].y, 2) < deltaSquared) {
                return this.selectedPointIndex = i;
            }
        }
        return this.selectedPointIndex;
    }
    knotSelection(x, y, deltaSquared = this.SLCTN_ACCURACY_Squared) {
        this.selectedKnotIndex = null;
        for (let i = 0; i < this.knots.length; i += 1) {
            const curvePnt = this.spline.evaluate(this.knots[i]);
            if (Math.pow(x - curvePnt.x, 2) + Math.pow(y - curvePnt.y, 2) < deltaSquared) {
                return this.selectedKnotIndex = i;
            }
        }
        return this.selectedKnotIndex;
    }
    getSelectedPoint() {
        return this.selectedPointIndex;
    }
    updateVerticesAndIndices() {
        this.vertices = new Float32Array(this.pointSequenceToDisplay.length * 32);
        this.indices = new Uint8Array(this.pointSequenceToDisplay.length * 6);
        for (let i = 0; i < this.pointSequenceToDisplay.length; i += 1) {
            const x = this.pointSequenceToDisplay[i].x;
            const y = this.pointSequenceToDisplay[i].y;
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
    }
    updateBuffers() {
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.vertexBuffer);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, this.vertices, this.gl.DYNAMIC_DRAW);
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, null);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        this.gl.bufferData(this.gl.ELEMENT_ARRAY_BUFFER, this.indices, this.gl.DYNAMIC_DRAW);
        this.gl.bindBuffer(this.gl.ELEMENT_ARRAY_BUFFER, null);
    }
}
exports.AbstractMouseSelectablePointView = AbstractMouseSelectablePointView;

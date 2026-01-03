"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AbstractMouseSelectableButtonView = void 0;
const AbstractMouseSelectableGraphicEntityView_1 = require("./AbstractMouseSelectableGraphicEntityView");
class AbstractMouseSelectableButtonView extends AbstractMouseSelectableGraphicEntityView_1.AbstractMouseSelectableGraphicEntityView {
    constructor(gl) {
        super(gl);
        this.HEIGHT_SIZE = 0.0;
        this.RATIO_WIDTH_HEIGHT = 0.0;
        this.X_LOCATION = 0.0;
        this.Y_LOCATION = 0.0;
        this.Z = 0;
        this.RED_COLOR = 0.0;
        this.GREEN_COLOR = 0.0;
        this.BLUE_COLOR = 0.0;
        this.indices = new Uint8Array([]);
        this.vertexBuffer = null;
        this.indexBuffer = null;
        this.vertices = new Float32Array([]);
        this.indices = new Uint8Array([]);
    }
    buttonSelection(x, y) {
        let result = false;
        if (Math.pow(x - this.X_LOCATION, 2) + Math.pow(y - this.Y_LOCATION, 2) < this.BTN_SLCTN_ACCURACY_Squared) {
            result = true;
        }
        return result;
    }
    updateVerticesAndIndices() {
        this.vertices = new Float32Array(4 * 8);
        this.indices = new Uint8Array(2 * 3);
        this.vertices[0] = this.X_LOCATION - this.HEIGHT_SIZE * this.RATIO_WIDTH_HEIGHT;
        this.vertices[1] = this.Y_LOCATION - this.HEIGHT_SIZE;
        this.vertices[2] = this.Z;
        this.vertices[3] = -this.RATIO_WIDTH_HEIGHT;
        this.vertices[4] = -1;
        this.vertices[5] = this.RED_COLOR;
        this.vertices[6] = this.GREEN_COLOR;
        this.vertices[7] = this.BLUE_COLOR;
        this.vertices[8] = this.X_LOCATION + this.HEIGHT_SIZE * this.RATIO_WIDTH_HEIGHT;
        this.vertices[9] = this.Y_LOCATION - this.HEIGHT_SIZE;
        this.vertices[10] = this.Z;
        this.vertices[11] = this.RATIO_WIDTH_HEIGHT;
        this.vertices[12] = -1;
        this.vertices[13] = this.RED_COLOR;
        this.vertices[14] = this.GREEN_COLOR;
        this.vertices[15] = this.BLUE_COLOR;
        this.vertices[16] = this.X_LOCATION + this.HEIGHT_SIZE * this.RATIO_WIDTH_HEIGHT;
        this.vertices[17] = this.Y_LOCATION + this.HEIGHT_SIZE;
        this.vertices[18] = this.Z;
        this.vertices[19] = this.RATIO_WIDTH_HEIGHT;
        this.vertices[20] = 1;
        this.vertices[21] = this.RED_COLOR;
        this.vertices[22] = this.GREEN_COLOR;
        this.vertices[23] = this.BLUE_COLOR;
        this.vertices[24] = this.X_LOCATION - this.HEIGHT_SIZE * this.RATIO_WIDTH_HEIGHT;
        this.vertices[25] = this.Y_LOCATION + this.HEIGHT_SIZE;
        this.vertices[26] = this.Z;
        this.vertices[27] = -this.RATIO_WIDTH_HEIGHT;
        this.vertices[28] = 1;
        this.vertices[29] = this.RED_COLOR;
        this.vertices[30] = this.GREEN_COLOR;
        this.vertices[31] = this.BLUE_COLOR;
        this.indices[0] = 0;
        this.indices[1] = 1;
        this.indices[2] = 2;
        this.indices[3] = 0;
        this.indices[4] = 2;
        this.indices[5] = 3;
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
exports.AbstractMouseSelectableButtonView = AbstractMouseSelectableButtonView;

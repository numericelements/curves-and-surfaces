import { AbstractGraphicalEntityView } from "./AbstractGraphicalEntityView";

export const SLCTN_ACCURACY_Squared = 0.005;
export const BTN_SLCTN_ACCURACY_Squared = 0.01;

export abstract class AbstractMouseSelectableGraphicEntityView extends AbstractGraphicalEntityView {

    protected readonly SLCTN_ACCURACY_Squared = SLCTN_ACCURACY_Squared;
    protected readonly BTN_SLCTN_ACCURACY_Squared = BTN_SLCTN_ACCURACY_Squared;
    protected selectedPoints: number[];

    constructor(gl: WebGLRenderingContext) {
        super(gl);
        this.selectedPoints = [];
    }

}
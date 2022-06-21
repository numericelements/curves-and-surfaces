export class AbstractGraphicalEntityView {
    
    protected readonly gl: WebGLRenderingContext;

    constructor(gl: WebGLRenderingContext) {
        this.gl = gl;
    }
}
/**
 * Set of optimizer parameters used to monitor the behavior and type of optimizer used during the shape navigation process
 * @_activeOptimizer : true if an optimizer is effectivzly active during the navigation process
 * @_updateConstraintsBounds : true if the bounds set on inequalities constraints of the optimizer can be modified 
 * to force an optimized to stick to the boundary of a shape space
 * @_reverseConstraints : reverse the inequalities of some constraints when crossing shape space boundaries
 * @_useWeights : true if the optimizer use weights to reduce the rigid body displacements of the curve
*/

export class OptimizationProblemCtrlParameters {

    private _activeOptimizer: boolean;
    private _updateConstraintsBounds: boolean;
    private _reverseConstraints: boolean;
    private _useWeights: boolean;

    constructor(activeOptimizer?: boolean, updateConstraintBounds?:boolean) {
        this._activeOptimizer = false;
        this._updateConstraintsBounds = false;
        this._reverseConstraints = false;
        this._useWeights = false;
        if(activeOptimizer !== undefined) {
            this._activeOptimizer = activeOptimizer;
        }
        if(updateConstraintBounds !== undefined) {
            this._updateConstraintsBounds = updateConstraintBounds;
        }
    }

    get optimizerStatus(): boolean {
        return this._activeOptimizer;
    }

    get updateConstraintBounds(): boolean {
        return this._updateConstraintsBounds;
    }

    set optimizerStatus(activeOptimizer: boolean) {
        this._activeOptimizer = activeOptimizer;
    }

    set updateConstraintBounds(activateUpdate: boolean) {
        this._updateConstraintsBounds = activateUpdate;
    }

}
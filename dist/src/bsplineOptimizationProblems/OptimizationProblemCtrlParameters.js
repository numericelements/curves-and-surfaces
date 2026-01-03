"use strict";
/**
 * Set of optimizer parameters used to monitor the behavior and type of optimizer used during the shape navigation process
 * @_activeOptimizer : true if an optimizer is effectivzly active during the navigation process
 * @_updateConstraintsBounds : true if the bounds set on inequalities constraints of the optimizer can be modified
 * to force an optimized to stick to the boundary of a shape space
 * @_reverseConstraints : reverse the inequalities of some constraints when crossing shape space boundaries
 * @_useWeights : true if the optimizer use weights to reduce the rigid body displacements of the curve
*/
Object.defineProperty(exports, "__esModule", { value: true });
exports.OptimizationProblemCtrlParameters = void 0;
class OptimizationProblemCtrlParameters {
    constructor(activeOptimizer, updateConstraintBounds) {
        this._activeOptimizer = false;
        this._updateConstraintsBounds = false;
        this._reverseConstraints = false;
        this._useWeights = false;
        if (activeOptimizer !== undefined) {
            this._activeOptimizer = activeOptimizer;
        }
        if (updateConstraintBounds !== undefined) {
            this._updateConstraintsBounds = updateConstraintBounds;
        }
    }
    get optimizerStatus() {
        return this._activeOptimizer;
    }
    get updateConstraintBounds() {
        return this._updateConstraintsBounds;
    }
    set optimizerStatus(activeOptimizer) {
        this._activeOptimizer = activeOptimizer;
    }
    set updateConstraintBounds(activateUpdate) {
        this._updateConstraintsBounds = activateUpdate;
    }
}
exports.OptimizationProblemCtrlParameters = OptimizationProblemCtrlParameters;

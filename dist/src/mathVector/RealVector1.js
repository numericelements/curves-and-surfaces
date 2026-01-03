"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adaptParameterRealVector = exports.RealVector1 = void 0;
const RealVectorSpace_1 = require("./RealVectorSpace");
class RealVector1 {
    constructor(vSpace, coordinates) {
        this.dim = vSpace.dimension();
        if (coordinates !== undefined && vSpace.dimension() !== 1 && typeof coordinates === 'number') {
            const error = new Error('Number of coordinates is not is not compatible with the vector space dimension');
            throw error;
        }
        else if (coordinates !== undefined && vSpace.dimension() > 1 && typeof coordinates === 'object' && coordinates.length !== this.dim) {
            const error = new Error('Number of coordinates is not is not compatible with the vector space dimension');
            throw error;
        }
        else if (coordinates !== undefined && vSpace.dimension() === 1 && typeof coordinates === 'number') {
            this._coordinates = [coordinates];
        }
        else if (coordinates !== undefined && vSpace.dimension() > 1 && typeof coordinates === 'object') {
            this._coordinates = [];
            for (let i = 0; i < this.dim; i++) {
                if (coordinates !== undefined) {
                    this._coordinates.push(coordinates[i]);
                }
                else {
                    this._coordinates.push(0);
                }
            }
        }
        else {
            this._coordinates = [];
            for (let i = 0; i < this.dim; i++) {
                this._coordinates.push(0);
            }
        }
    }
    get coordinates() {
        if (this.dim === 1) {
            return this._coordinates[0];
        }
        return this._coordinates;
    }
    clone() {
        const newVector = new RealVector1(new RealVectorSpace_1.RealVectorSpace(this.dim), this.coordinates);
        return newVector;
    }
}
exports.RealVector1 = RealVector1;
function adaptParameterRealVector() {
    return function (target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        descriptor.value = function (coordinates) {
            const input = Array.isArray(coordinates) ? coordinates : [coordinates];
            return originalMethod.call(this, input);
        };
    };
}
exports.adaptParameterRealVector = adaptParameterRealVector;

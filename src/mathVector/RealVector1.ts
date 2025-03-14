import { RealVectorSpace } from "./RealVectorSpace";


export class RealVector1 {

    protected readonly dim: number;
    protected readonly _coordinates: number[];

    constructor(vSpace: RealVectorSpace, coordinates?: number | number[]) {
        this.dim = vSpace.dimension();
        if(coordinates !== undefined && vSpace.dimension() !== 1 && typeof coordinates === 'number') {
            const error = new Error('Number of coordinates is not is not compatible with the vector space dimension');
            throw error;
        } else if(coordinates !== undefined && vSpace.dimension() > 1 && typeof coordinates === 'object' && coordinates.length !== this.dim) {
            const error = new Error('Number of coordinates is not is not compatible with the vector space dimension');
            throw error;
        } else if(coordinates !== undefined && vSpace.dimension() === 1 && typeof coordinates === 'number') {
            this._coordinates = [coordinates];
        } else if(coordinates !== undefined && vSpace.dimension() > 1 && typeof coordinates === 'object') {
            this._coordinates = [];
            for(let i = 0; i < this.dim; i++) {
                if(coordinates !== undefined) {
                    this._coordinates.push(coordinates[i]);
                } else {
                    this._coordinates.push(0);
                }
            }
        } else {
            this._coordinates = [];
            for(let i = 0; i < this.dim; i++) {
                this._coordinates.push(0);
            }
        }
    }

    get coordinates(): number | number[] {
        if(this.dim === 1) {
            return this._coordinates[0];
        }
        return this._coordinates;
    }

    clone(): RealVector1 {
        const newVector = new RealVector1(new RealVectorSpace(this.dim), this.coordinates);
        return newVector;
    }
}

export function adaptParameterRealVector() {
    return function (
      target: any,
      propertyKey: string,
      descriptor: PropertyDescriptor
    ) {
      const originalMethod = descriptor.value;
      descriptor.value = function (coordinates: number | number[]) {
        const input = Array.isArray(coordinates) ? coordinates : [coordinates];
        return originalMethod.call(this, input);
      };
    };
}

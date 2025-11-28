import { VectorSpaceType } from "../namedConstants/BSplineR1toRn";
import { AbstractProjectiveComplexVector } from "./AbstractProjectiveComplexVector";
import { Complex } from "./Complex";
import { getDefaultVectorSpace, resolveDefaultVectorSpace } from "./internal/DefaultSpaceResolvers";
import { ProjectiveComplexVectorSpace } from "./ProjectiveComplexVectorSpace";
import { Vector2DTypeReal } from "./Vector2DTypeReal";
import { IComplex, COMPLEX, IComplexWeight, COMPLEXWEIGHT, ProjectiveComplexVector, PROJECTIVECOMPLEXVECTOR1D } from "./VectorSpaceConstructorInterface";
import { Weight } from "./Weight";

export class ProjectiveVector1DTypeComplex  extends AbstractProjectiveComplexVector {
    private data: ProjectiveComplexVector;
    protected _vectorSpace: ProjectiveComplexVectorSpace<2>;
    
    constructor(real: number = 0, imaginary: number = 0, realWeight: Weight = new Weight(), imaginaryWeight: Weight = new Weight(), vectorSpace?: ProjectiveComplexVectorSpace<2>) {
        super();
        this.data = { 
            type: PROJECTIVECOMPLEXVECTOR1D, 
            coordinates: [{ type: COMPLEX, real: real, imaginary: imaginary },
                        { type: COMPLEXWEIGHT, real: realWeight, imaginary: imaginaryWeight}] 
        };
        if(vectorSpace !== undefined) {
            this._vectorSpace = vectorSpace;
        } else {
            this._vectorSpace = getDefaultVectorSpace(this.spaceType, this.dimension) as ProjectiveComplexVectorSpace<2>;
        }
    }
    
    get dimension(): number { return 2; } // Homogeneous coordinates
    get vectorType(): string { return 'ProjectiveComplexVector'; }
    get spaceType(): VectorSpaceType { return VectorSpaceType.PROJECTIVECOMPLEX; }
    get coordinates(): number[] { return this.homogeneousCoordinates; }
    get descriptor(): ProjectiveComplexVector { return { ...this.data }; }
    
    get weight(): IComplexWeight {
        return this.data.coordinates[1];
    }
    
    get homogeneousCoordinates(): number[] {
        return [this.data.coordinates[0].real, this.data.coordinates[0].imaginary, this.weight.real.value];
    }
    
    getCoordinate(index: number): Complex {
        if (index < 0 || index >= 1) throw new RangeError('Coordinate index out of bounds');
        if (index === 1) {
            const real = this.weight.real.value;
            const imaginary = this.weight.imaginary.value;
            return new Complex(real, imaginary);
        }
        return new Complex(this.data.coordinates[0].real, this.data.coordinates[0].imaginary) as Complex;
    }
    
    // setCoordinate(index: number, value: Complex): void {
    //     if (index < 0 || index >= 1) throw new RangeError('Coordinate index out of bounds');
    //     if (index === 1) {
    //         this.data.coordinates[1].real = new Weight(value.real);
    //         this.data.coordinates[1].imaginary = new Weight(value.imaginary);
    //     } else {
    //         this.data.coordinates[index].real = value.real;
    //         this.data.coordinates[index].imaginary = value.imaginary;
    //     }
    // }
    
    normalize(): ProjectiveVector1DTypeComplex {
        const w = this.weight.real.value;
        if (w === 0) return this.clone() as ProjectiveVector1DTypeComplex;
        
        return new ProjectiveVector1DTypeComplex(
            this.data.coordinates[0].real / w,
            this.data.coordinates[0].imaginary / w,
            new Weight(1)
        );
    }

    // add(other: ProjectiveVector1DTypeComplex): ProjectiveVector1DTypeComplex {
    //     // this.validateCompatibility(other);
    //     const result = this.vectorSpace.add(this.raw, other.raw);
    //     return this.createVectorFromRaw(result);
    // }
    
    toCartesian(): Vector2DTypeReal {
        const normalized = this.normalize();
        return new Vector2DTypeReal(
            normalized.data.coordinates[0].real,
            normalized.data.coordinates[0].imaginary
        );
    }
    
    clone(): ProjectiveVector1DTypeComplex {
        return new ProjectiveVector1DTypeComplex(
            this.data.coordinates[0].real,
            this.data.coordinates[0].imaginary,
            new Weight(this.weight.real.value),
            new Weight(this.weight.imaginary.value),
        );
    }

    static fromRaw(raw: ProjectiveComplexVector): ProjectiveVector1DTypeComplex {
        return new ProjectiveVector1DTypeComplex(raw.coordinates[0].real, raw.coordinates[0].imaginary, raw.coordinates[1].real, raw.coordinates[1].imaginary);
    }
}
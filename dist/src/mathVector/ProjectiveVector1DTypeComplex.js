"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProjectiveVector1DTypeComplex = void 0;
const ComplexWeight_1 = require("../ErrorMessages/ComplexWeight");
const ProjectiveComplexVectors_1 = require("../ErrorMessages/ProjectiveComplexVectors");
const BSplineR1toRn_1 = require("../namedConstants/BSplineR1toRn");
const ComplexTypeTag_1 = require("../namedConstants/ComplexTypeTag");
const ProjectiveVectorSpace_1 = require("../namedConstants/ProjectiveVectorSpace");
const Vectors_1 = require("../namedConstants/Vectors");
const VectorTypeTags_1 = require("../namedConstants/VectorTypeTags");
const Weight_1 = require("../namedConstants/Weight");
const WeightTypeTags_1 = require("../namedConstants/WeightTypeTags");
const AbstractProjectiveComplexVector_1 = require("./AbstractProjectiveComplexVector");
const Complex_1 = require("./Complex");
const ComplexWeight_2 = require("./ComplexWeight");
const DefaultSpaceResolvers_1 = require("./internal/DefaultSpaceResolvers");
const ProjectiveComplexVectorSpace_1 = require("./ProjectiveComplexVectorSpace");
const Vector1DTypeComplex_1 = require("./Vector1DTypeComplex");
const VectorSpaceUtilities_1 = require("./VectorSpaceUtilities");
const Weight_2 = require("./Weight");
const SPACE_DIMENSION = 2;
class ProjectiveVector1DTypeComplex extends AbstractProjectiveComplexVector_1.AbstractProjectiveComplexVector {
    constructor(realOrComplexOrVectorSpace, imaginaryOrComplexWeightOrVectorSpace, realWeightOrVectorSpace, imaginaryWeight, vectorSpace) {
        super();
        this._vectorSpace = vectorSpace !== null && vectorSpace !== void 0 ? vectorSpace : (0, DefaultSpaceResolvers_1.getDefaultVectorSpace)(BSplineR1toRn_1.VectorSpaceType.PROJECTIVECOMPLEX, SPACE_DIMENSION);
        this.data = {
            type: VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D,
            coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: 0, imaginary: 0 },
                { type: WeightTypeTags_1.COMPLEXWEIGHT, real: new Weight_2.Weight(), imaginary: new Weight_2.Weight() }]
        };
        if (realOrComplexOrVectorSpace instanceof ProjectiveComplexVectorSpace_1.ProjectiveComplexVectorSpace) {
            this.initFromVectorSpace(realOrComplexOrVectorSpace);
            return;
        }
        else if (realOrComplexOrVectorSpace instanceof Complex_1.Complex) {
            const complex = realOrComplexOrVectorSpace;
            let realWeight = new Weight_2.Weight();
            let imaginaryWeight = new Weight_2.Weight();
            if (imaginaryOrComplexWeightOrVectorSpace instanceof ComplexWeight_2.ComplexWeight) {
                if (realWeightOrVectorSpace instanceof ProjectiveComplexVectorSpace_1.ProjectiveComplexVectorSpace) {
                    this.initFromComplexParams(realOrComplexOrVectorSpace, imaginaryOrComplexWeightOrVectorSpace, realWeightOrVectorSpace);
                }
                else if (realWeightOrVectorSpace === undefined) {
                    this.initFromComplexParams(realOrComplexOrVectorSpace, imaginaryOrComplexWeightOrVectorSpace);
                }
                return;
            }
            else if (imaginaryOrComplexWeightOrVectorSpace instanceof ProjectiveComplexVectorSpace_1.ProjectiveComplexVectorSpace) {
                this.initFromComplexParams(realOrComplexOrVectorSpace, imaginaryOrComplexWeightOrVectorSpace);
                return;
            }
            if (this._vectorSpace.weightManagement === ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights) {
                realWeight = new Weight_2.Weight(Weight_1.DEFAULT_WEIGHT_VALUE, false);
                imaginaryWeight = new Weight_2.Weight(Weight_1.DEFAULT_WEIGHT_VALUE, false);
            }
            this.data = {
                type: VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D,
                coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: complex.real, imaginary: complex.imaginary },
                    { type: WeightTypeTags_1.COMPLEXWEIGHT, real: realWeight, imaginary: imaginaryWeight }]
            };
            return;
        }
        const real = realOrComplexOrVectorSpace !== null && realOrComplexOrVectorSpace !== void 0 ? realOrComplexOrVectorSpace : 0;
        if (typeof imaginaryOrComplexWeightOrVectorSpace === 'number') {
            const imaginary = imaginaryOrComplexWeightOrVectorSpace;
            if (realWeightOrVectorSpace instanceof ProjectiveComplexVectorSpace_1.ProjectiveComplexVectorSpace) {
                this.initFromRealParams(real, imaginary, realWeightOrVectorSpace);
                return;
            }
            let realWeight = new Weight_2.Weight();
            if (realWeightOrVectorSpace !== undefined) {
                this.checkWeightsConsistency(realWeightOrVectorSpace, imaginaryWeight);
                realWeight = realWeightOrVectorSpace;
            }
            this.initFromRealParams(real, imaginary, realWeight, imaginaryWeight, this._vectorSpace);
            return;
        }
        else if (imaginaryOrComplexWeightOrVectorSpace instanceof ComplexWeight_2.ComplexWeight) {
            if (realWeightOrVectorSpace instanceof ProjectiveComplexVectorSpace_1.ProjectiveComplexVectorSpace) {
                this._vectorSpace = realWeightOrVectorSpace;
            }
            const complexWeight = imaginaryOrComplexWeightOrVectorSpace;
            if (complexWeight.real.strictlyPositive && this._vectorSpace.weightManagement === ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights) {
                const error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'constructor', `inconsistent strictlypositive weight status`);
                throw new RangeError(error.generateMessageString());
            }
            this.data = {
                type: VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D,
                coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: real, imaginary: 0 },
                    { type: WeightTypeTags_1.COMPLEXWEIGHT, real: complexWeight.real, imaginary: complexWeight.imaginary }]
            };
            return;
        }
        else if (imaginaryOrComplexWeightOrVectorSpace instanceof ProjectiveComplexVectorSpace_1.ProjectiveComplexVectorSpace) {
            this.initFromComplexParams(new Complex_1.Complex(real, 0), imaginaryOrComplexWeightOrVectorSpace);
            return;
        }
        this.initFromRealParams(real, 0, realWeightOrVectorSpace, imaginaryWeight, this._vectorSpace);
    }
    get dimension() { return SPACE_DIMENSION; } // Homogeneous coordinates
    get vectorType() { return VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D; }
    get spaceType() { return BSplineR1toRn_1.VectorSpaceType.PROJECTIVECOMPLEX; }
    get coordinates() { return [new Complex_1.Complex(this.data.coordinates[0].real, this.data.coordinates[0].imaginary), new Complex_1.Complex(this.data.coordinates[1].real.value, this.data.coordinates[1].imaginary.value)]; }
    get descriptor() { return Object.assign({}, this.data); }
    get weight() {
        return new ComplexWeight_2.ComplexWeight(this.data.coordinates[1].real, this.data.coordinates[1].imaginary);
    }
    get homogeneousCoordinates() {
        return [this.data.coordinates[0].real, this.data.coordinates[0].imaginary, this.weight.real.value];
    }
    initFromVectorSpace(vectorSpace) {
        this._vectorSpace = vectorSpace;
        const real = 0;
        const imaginary = 0;
        const complexW = this.initializeAndValidateWeights(this._vectorSpace);
        this.data = {
            type: VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D,
            coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: real, imaginary: imaginary },
                { type: WeightTypeTags_1.COMPLEXWEIGHT, real: complexW.real, imaginary: complexW.imaginary }]
        };
    }
    initFromComplexParams(complexCoord, complexWeight, complexProjVS) {
        const complex = complexCoord !== null && complexCoord !== void 0 ? complexCoord : new Complex_1.Complex(0, 0);
        const vectorSpace = complexProjVS !== null && complexProjVS !== void 0 ? complexProjVS : (0, DefaultSpaceResolvers_1.getDefaultVectorSpace)(BSplineR1toRn_1.VectorSpaceType.PROJECTIVECOMPLEX, SPACE_DIMENSION);
        let complexW = new ComplexWeight_2.ComplexWeight();
        if (complexWeight instanceof ProjectiveComplexVectorSpace_1.ProjectiveComplexVectorSpace) {
            this._vectorSpace = complexWeight;
            complexW = this.initializeAndValidateWeights(vectorSpace);
        }
        else {
            this._vectorSpace = vectorSpace;
            complexW = this.initializeAndValidateWeights(vectorSpace, complexWeight === null || complexWeight === void 0 ? void 0 : complexWeight.real, complexWeight === null || complexWeight === void 0 ? void 0 : complexWeight.imaginary);
        }
        this.data = {
            type: VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D,
            coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: complex.real, imaginary: complex.imaginary },
                { type: WeightTypeTags_1.COMPLEXWEIGHT, real: complexW.real, imaginary: complexW.imaginary }]
        };
    }
    checkWeightsConsistency(realWeight, imaginaryWeight) {
        switch (this._vectorSpace.weightManagement) {
            case ProjectiveVectorSpace_1.WeightManagement.AllStrictlyPositiveWeights:
                if (!realWeight.strictlyPositive && (imaginaryWeight !== undefined && !imaginaryWeight.strictlyPositive)) {
                    const error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'constructor', ProjectiveComplexVectors_1.EM_STRICTLYPOS_STATUS_INCOMPATIBLE_WEIGHT_MANAGEMENT);
                    throw new RangeError(error.generateMessageString());
                }
                else if (!realWeight.strictlyPositive || (imaginaryWeight !== undefined && !imaginaryWeight.strictlyPositive)) {
                    const error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'constructor', ComplexWeight_1.EM_INCOMPATIBLE_WEIGHT_POSITIVITY_MANAGEMENT);
                    throw new RangeError(error.generateMessageString());
                }
                break;
            case ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights:
                if (realWeight.strictlyPositive && (imaginaryWeight !== undefined && imaginaryWeight.strictlyPositive)) {
                    const error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'constructor', ProjectiveComplexVectors_1.EM_STRICTLYPOS_STATUS_INCOMPATIBLE_WEIGHT_MANAGEMENT);
                    throw new RangeError(error.generateMessageString());
                }
                else if (realWeight.strictlyPositive || (imaginaryWeight !== undefined && imaginaryWeight.strictlyPositive)) {
                    const error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'constructor', ComplexWeight_1.EM_INCOMPATIBLE_WEIGHT_POSITIVITY_MANAGEMENT);
                    throw new RangeError(error.generateMessageString());
                }
                break;
            default:
                if (imaginaryWeight !== undefined && (realWeight.strictlyPositive !== imaginaryWeight.strictlyPositive)) {
                    const error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'constructor', ComplexWeight_1.EM_INCOMPATIBLE_WEIGHT_POSITIVITY_MANAGEMENT);
                    throw new RangeError(error.generateMessageString());
                }
        }
    }
    initFromRealParams(realCoord, imaginaryCoord, realW, imaginaryW, vectorSp) {
        const real = realCoord !== null && realCoord !== void 0 ? realCoord : 0;
        const imaginary = imaginaryCoord !== null && imaginaryCoord !== void 0 ? imaginaryCoord : 0;
        const vectorSpace = vectorSp !== null && vectorSp !== void 0 ? vectorSp : (0, DefaultSpaceResolvers_1.getDefaultVectorSpace)(BSplineR1toRn_1.VectorSpaceType.PROJECTIVECOMPLEX, SPACE_DIMENSION);
        let complexW = new ComplexWeight_2.ComplexWeight();
        if (realW instanceof ProjectiveComplexVectorSpace_1.ProjectiveComplexVectorSpace) {
            this._vectorSpace = realW;
            complexW = this.initializeAndValidateWeights(vectorSpace);
        }
        else {
            this._vectorSpace = vectorSpace;
            complexW = this.initializeAndValidateWeights(vectorSpace, realW, imaginaryW);
        }
        this.data = {
            type: VectorTypeTags_1.PROJECTIVECOMPLEXVECTOR1D,
            coordinates: [{ type: ComplexTypeTag_1.COMPLEX, real: real, imaginary: imaginary },
                { type: WeightTypeTags_1.COMPLEXWEIGHT, real: complexW.real, imaginary: complexW.imaginary }]
        };
    }
    initializeAndValidateWeights(vectorSpace, realWeight, imaginaryWeight) {
        const weightManagement = vectorSpace.weightManagement;
        let realW = new Weight_2.Weight();
        let imaginaryW = new Weight_2.Weight();
        switch (weightManagement) {
            case ProjectiveVectorSpace_1.WeightManagement.AllStrictlyPositiveWeights:
                if (realWeight !== undefined) {
                    realW = realWeight;
                    if (!realWeight.strictlyPositive) {
                        const error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'constructor', ProjectiveComplexVectors_1.EM_STRICTLYPOS_STATUS_INCOMPATIBLE_WEIGHT_MANAGEMENT);
                        throw new RangeError(error.generateMessageString());
                    }
                }
                if (imaginaryWeight !== undefined) {
                    imaginaryW = imaginaryWeight;
                    if (!imaginaryWeight.strictlyPositive) {
                        const error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'constructor', ProjectiveComplexVectors_1.EM_STRICTLYPOS_STATUS_INCOMPATIBLE_WEIGHT_MANAGEMENT);
                        throw new RangeError(error.generateMessageString());
                    }
                }
                break;
            case ProjectiveVectorSpace_1.WeightManagement.AllPositiveWeights:
                if (realWeight !== undefined) {
                    realW = realWeight;
                    if (realWeight.strictlyPositive) {
                        const error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'constructor', ProjectiveComplexVectors_1.EM_STRICTLYPOS_STATUS_INCOMPATIBLE_WEIGHT_MANAGEMENT);
                        throw new RangeError(error.generateMessageString());
                    }
                }
                else
                    realW = new Weight_2.Weight(Weight_1.DEFAULT_WEIGHT_VALUE, false);
                if (imaginaryWeight !== undefined) {
                    imaginaryW = imaginaryWeight;
                    if (imaginaryWeight.strictlyPositive) {
                        const error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'constructor', ProjectiveComplexVectors_1.EM_STRICTLYPOS_STATUS_INCOMPATIBLE_WEIGHT_MANAGEMENT);
                        throw new RangeError(error.generateMessageString());
                    }
                }
                else
                    imaginaryW = new Weight_2.Weight(Weight_1.DEFAULT_WEIGHT_VALUE, false);
                break;
            case ProjectiveVectorSpace_1.WeightManagement.SomeNullWeights:
                if (realWeight !== undefined) {
                    realW = realWeight;
                    imaginaryW = new Weight_2.Weight(Weight_1.DEFAULT_WEIGHT_VALUE, realWeight.strictlyPositive);
                    if (imaginaryWeight !== undefined && imaginaryWeight.strictlyPositive === realWeight.strictlyPositive) {
                        imaginaryW = imaginaryWeight;
                    }
                    else {
                        const error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'constructor', `inconsistent strictlypositive weight status`);
                        throw new RangeError(error.generateMessageString());
                    }
                }
                if (imaginaryWeight !== undefined) {
                    imaginaryW = imaginaryWeight;
                    realW = new Weight_2.Weight(Weight_1.DEFAULT_WEIGHT_VALUE, imaginaryWeight.strictlyPositive);
                    if (realWeight !== undefined && realWeight.strictlyPositive === imaginaryWeight.strictlyPositive) {
                        realW = realWeight;
                    }
                    else {
                        const error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'constructor', `inconsistent strictlypositive weight status`);
                        throw new RangeError(error.generateMessageString());
                    }
                }
                break;
        }
        return new ComplexWeight_2.ComplexWeight(realW, imaginaryW);
    }
    getCoordinate(index) {
        if (index < 0 || index >= SPACE_DIMENSION) {
            const error = (0, VectorSpaceUtilities_1.sendRangeErrorMessage)(this.constructor.name, 'getCoordinate', Vectors_1.EM_VECTOR_COORDINATE_INDEX_OUT_RANGE);
            throw new RangeError(error.generateMessageString());
        }
        if (index === 1) {
            const real = this.weight.real.value;
            const imaginary = this.weight.imaginary.value;
            return new Complex_1.Complex(real, imaginary);
        }
        return new Complex_1.Complex(this.data.coordinates[0].real, this.data.coordinates[0].imaginary);
    }
    normalize() {
        const w = this.weight.real.value;
        if (w === 0)
            return this.clone();
        const complex = new Complex_1.Complex(this.data.coordinates[0].real / w, this.data.coordinates[0].imaginary / w);
        return new ProjectiveVector1DTypeComplex(complex, new ComplexWeight_2.ComplexWeight());
    }
    add(other) {
        return super.add(other);
    }
    subtract(other) {
        return super.subtract(other);
    }
    equals(other, tolerance) {
        return super.equals(other, tolerance);
    }
    toComplexVector() {
        const normalized = this.normalize();
        const realWeight = this.weight.real.value;
        return new Vector1DTypeComplex_1.Vector1DTypeComplex(normalized.data.coordinates[0].real, normalized.data.coordinates[0].imaginary);
    }
    toString() {
        return this.vectorType + `(${this.getCoordinate(0).toString()}, ${this.weight.toString()})` + ` ` + this._vectorSpace.toString();
    }
    clone() {
        return new ProjectiveVector1DTypeComplex(this.data.coordinates[0].real, this.data.coordinates[0].imaginary, new Weight_2.Weight(this.weight.real.value, this.weight.real.strictlyPositive), new Weight_2.Weight(this.weight.imaginary.value, this.weight.imaginary.strictlyPositive), this._vectorSpace);
    }
    static fromRaw(raw) {
        return new ProjectiveVector1DTypeComplex(raw.coordinates[0].real, raw.coordinates[0].imaginary, raw.coordinates[1].real, raw.coordinates[1].imaginary);
    }
}
exports.ProjectiveVector1DTypeComplex = ProjectiveVector1DTypeComplex;

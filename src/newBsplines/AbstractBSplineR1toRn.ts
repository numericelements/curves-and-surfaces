import { Vector } from "../mathVector/interfaces/VectorInterfaces";
import { createVector } from "../mathVector/VectorFactory";
import { createVector1DComlplexFromDescriptor, createVector2DComplexFromDescriptor, createProjectiveComplexVector1DFromDescriptor, createProjectiveRealVector2DFromDescriptor, createProjectiveRealVector3DFromDescriptor, createVector1DRealFromDescriptor, createVector2DRealFromDescriptor, createVector3DRealFromDescriptor, createVector4DRealFromDescriptor, createRealVectorFromDescriptor } from "../mathVector/VectorFromDescriptorFactory";
import { getVectorSpaceTypeAndDimension } from "../mathVector/VectorSpaceUtilities";
import { VectorSpaceType } from "../namedConstants/BSplineR1toRn";
import { COMPLEX } from "../namedConstants/ComplexTypeTag";
import { COMPLEXVECTOR1D, COMPLEXVECTOR2D, PROJECTIVECOMPLEXVECTOR1D, PROJECTIVEREALVECTOR2D, PROJECTIVEREALVECTOR3D, REALVECTOR2D, REALVECTOR3D, REALVECTOR4D } from "../namedConstants/VectorTypeTags";
import { BSPL_CP_DEG_NONUNIFORM, BSPL_CP_DEG_UNIFORM, BSPL_CP_DEG_UNIFORM_EUCLIDEAN, BSPL_CP_NO_KNOT, BSpline_type, BSplineR1toR1_type, BSPLR1TOR1_CP_OPENKNOTSEQ_ALLKNOTS_C0DISCONTINUITY, ControlPoints } from "./BSplineR1toRnConstructorInterface";
import { ControlPolygon } from "./ControlPolygon";
import { ControlPolygonFromDescriptors } from "./ControlPolygonFromDescriptors";
import { StrictlyIncreasingOpenKnotSequenceOpenCurve } from "./StrictlyIncreasingOpenKnotSequenceOpenCurve";
import { StrictlyIncreasingPeriodicKnotSequenceClosedCurve } from "./StrictlyIncreasingPeriodicKnotSequenceClosedCurve";
import { VectorDesc } from "../mathVector/utilityTypes/VectorDescriptorTypes";

type WrappedDescriptor = { vector: VectorDesc };

function unwrapDescriptor(d: unknown): number | VectorDesc {
    if (typeof d === "object" && d !== null && "vector" in d) {
        return (d as WrappedDescriptor).vector;
    }
    return d as number | VectorDesc;
}

function hasCoordinates(d: unknown): d is { coordinates: readonly number[] } {
    return typeof d === "object" && d !== null && "coordinates" in d;
}

export function hasType<T extends string>(d: unknown, t: T): d is { type: T } {
    return typeof d === "object" && d !== null && "type" in d && (d as { type: unknown }).type === t;
}

// Normalize a ControlPolygonFromDescriptors into a canonical ControlPolygon<IVector<any, Vector>>
export function normalizeDescriptorsToControlPolygon(
    descriptors: ControlPolygonFromDescriptors
): ControlPolygon<Vector<any, VectorDesc>> {
    const vectors: Vector<any, VectorDesc>[] = [];

    for (const item of descriptors) {
        const descriptor = unwrapDescriptor(item);

        if (typeof descriptor === "number") {
            vectors.push(createVector1DRealFromDescriptor(descriptor));
            continue;
        }

        if (hasType(descriptor, REALVECTOR2D) && hasCoordinates(descriptor)) {
            vectors.push(createVector2DRealFromDescriptor(descriptor));
        } else if (hasType(descriptor, REALVECTOR3D) && hasCoordinates(descriptor)) {
            vectors.push(createVector3DRealFromDescriptor(descriptor));
        } else if (hasType(descriptor, REALVECTOR4D) && hasCoordinates(descriptor)) {
            vectors.push(createVector4DRealFromDescriptor(descriptor));
        } else if (hasType(descriptor, COMPLEX) && hasCoordinates(descriptor)) {
            vectors.push(createVector1DComlplexFromDescriptor(descriptor));
        } else if (hasType(descriptor, COMPLEXVECTOR2D) && hasCoordinates(descriptor)) {
            vectors.push(createVector2DComplexFromDescriptor(descriptor));
        } else if (hasType(descriptor, PROJECTIVEREALVECTOR2D) && hasCoordinates(descriptor)) {
            vectors.push(createProjectiveRealVector2DFromDescriptor(descriptor));
        } else if (hasType(descriptor, PROJECTIVEREALVECTOR3D) && hasCoordinates(descriptor)) {
            vectors.push(createProjectiveRealVector3DFromDescriptor(descriptor));
        } else if (hasType(descriptor, PROJECTIVECOMPLEXVECTOR1D) && hasCoordinates(descriptor)) {
            vectors.push(createProjectiveComplexVector1DFromDescriptor(descriptor));
        } else {
            throw new RangeError("Unsupported or invalid vector descriptor");
        }
    }

    if (vectors.length === 0) throw new Error("Control polygon must contain at least one vector");
    return new ControlPolygon<Vector<any, VectorDesc>>(vectors);
}

// Derive degree from knot sequence length and control point count
export function deriveDegree(knotCount: number, controlPointCount: number): number {
    const degree = knotCount - controlPointCount - 1;
    if (degree < 1) throw new RangeError(
        `Inconsistent knot/control-point counts: knotCount=${knotCount}, controlPointCount=${controlPointCount}, derived degree=${degree}`
    );
    return degree;
}

// Derive degree for Bézier (no-knot) case
export function deriveBezierDegree(controlPointCount: number): number {
    if (controlPointCount < 2) throw new RangeError(
        `Control polygon must have at least 2 points for a Bézier curve, got ${controlPointCount}`
    );
    return controlPointCount - 1;
}

// Check control polygon / knot sequence consistency
function isValidVectorSpaceType(value: VectorSpaceType): boolean {
    switch (value) {
        case VectorSpaceType.REAL:
        case VectorSpaceType.COMPLEX:
        case VectorSpaceType.PROJECTIVEREAL:
        case VectorSpaceType.PROJECTIVECOMPLEX:
            return true;
        default:
            return false;
    }
}

export function checkConsistency(
    degree: number,
    knotCount: number,
    controlPointCount: number,
    vectorSpace: VectorSpaceType,
    spaceDimension: number
    ): void {

    const expected = knotCount - controlPointCount - 1;
    if (expected !== degree) {
        throw new RangeError(
            `Inconsistency: degree=${degree}, knotCount=${knotCount}, controlPointCount=${controlPointCount}`
        );
    }
    if (spaceDimension < 1) throw new RangeError(`Invalid space dimension: ${spaceDimension}`);
    if (!isValidVectorSpaceType(vectorSpace)) {
        throw new RangeError(`Invalid vector space type: ${vectorSpace}`);
    }
}


export abstract class AbstractBSplineR1toRn<V extends Vector<any, VectorDesc> = Vector<any, VectorDesc>> {

    protected readonly abstract _curveOrigin: number;

    // canonical internal model: always IVector-based
    protected readonly _controlPolygon: ControlPolygon<V>;
    protected readonly _degree: number;
    protected readonly _vectorSpace: VectorSpaceType;
    protected readonly _spaceDimension: number;
    protected readonly abstract _knotSequence: StrictlyIncreasingOpenKnotSequenceOpenCurve | StrictlyIncreasingPeriodicKnotSequenceClosedCurve;

    protected _isDirty: boolean; // reserved for cache invalidation

    constructor(
        controlPolygon: ControlPolygon<V>,
        knotSequence: StrictlyIncreasingOpenKnotSequenceOpenCurve | StrictlyIncreasingPeriodicKnotSequenceClosedCurve,
        degree: number,
        vectorSpace: VectorSpaceType,
        spaceDimension: number
    ) {
        // checkConsistency(degree, knotSequence.length(), controlPolygon.length, vectorSpace, spaceDimension);

        this._controlPolygon = controlPolygon;
        this._degree = degree;
        this._vectorSpace = vectorSpace;
        this._spaceDimension = spaceDimension;
        this._isDirty = true;
    }

    get degree(): number { return this._degree; }
    get vectorSpace(): VectorSpaceType { return this._vectorSpace; }
    get spaceDimension(): number { return this._spaceDimension; }
    abstract get knotSequence(): StrictlyIncreasingOpenKnotSequenceOpenCurve | StrictlyIncreasingPeriodicKnotSequenceClosedCurve;
    get curveOrigin(): number { return this._curveOrigin; }
    get controlPoints(): ReadonlyArray<V> { return this._controlPolygon.controlPoints; }

    // immutable "update" operations
    abstract withControlPolygon(controlPolygon: ControlPolygon<V>): AbstractBSplineR1toRn<V>;
    abstract withKnots(knots: readonly number[]): AbstractBSplineR1toRn<V>;

    protected invalidate(): void { this._isDirty = true; }
}
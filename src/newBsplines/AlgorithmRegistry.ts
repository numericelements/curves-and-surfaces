import { IVector } from "../mathVector/Vector";
import { Vector } from "../mathVector/VectorSpaceConstructorInterface";
import { VectorSpaceType } from "../namedConstants/BSplineR1toRn";
import { ControlPolygon } from "./ControlPolygon";
import { AlgorithmRegistration, BSplineEvaluator } from "./OpenBSplineR1toRn";
import { StrictlyIncreasingOpenKnotSequenceOpenCurve } from "./StrictlyIncreasingOpenKnotSequenceOpenCurve";
import { StrictlyIncreasingPeriodicKnotSequenceClosedCurve } from "./StrictlyIncreasingPeriodicKnotSequenceClosedCurve";

export class AlgorithmRegistry {
    private static readonly _registry = new Map<string, AlgorithmRegistration>();
    private static readonly _defaults = new Map<VectorSpaceType, string>();

    static register(registration: AlgorithmRegistration): void {
        if (this._registry.has(registration.name)) {
            throw new Error(`Algorithm '${registration.name}' is already registered`);
        }
        this._registry.set(registration.name, registration);
    }

    static isRegistered(algorithmName: string): boolean {
        return this._registry.has(algorithmName);
    }

    static registeredNames(): readonly string[] {
        return [...this._registry.keys()];
    }

    static getAvailableAlgorithms(vectorSpaceType?: VectorSpaceType): string[] {
        const names: string[] = [];
        this._registry.forEach((reg, name) => {
            if (!vectorSpaceType || reg.vectorSpaceTypes.some(v => v === vectorSpaceType)) {
                names.push(name);
            }
        });
        return names;
    }

    static getDefaultAlgorithm(vectorSpaceType: VectorSpaceType): string {
        const explicit = this._defaults.get(vectorSpaceType);
        if (explicit) return explicit;

        const available = this.getAvailableAlgorithms(vectorSpaceType);
        if (available.some(a => a === "coxdeboor")) return "coxdeboor";
        if (available.length > 0) return available[0];
        throw new Error(`No algorithm registered for vector space '${vectorSpaceType}'`);
    }

    static setDefaultAlgorithm(vectorSpaceType: VectorSpaceType, algorithmName: string): void {
        const reg = this._registry.get(algorithmName);
        if (!reg) throw new Error(`Algorithm '${algorithmName}' is not registered`);
        if (!reg.vectorSpaceTypes.some(v => v === vectorSpaceType)) {
            throw new Error(`Algorithm '${algorithmName}' does not support vector space type '${vectorSpaceType}'`);
        }
        this._defaults.set(vectorSpaceType, algorithmName);
    }

    // static getFactory(algorithmName: string, vectorSpaceType: VectorSpaceType): AlgorithmFactory | undefined {
    //     return this.algorithms.get(algorithmName)?.get(vectorSpaceType);
    // }

    static createEvaluator<IV extends IVector<any, Vector>>(
        algorithmName: string,
        controlPolygon: ControlPolygon<IV>,
        knotSequence: StrictlyIncreasingOpenKnotSequenceOpenCurve | StrictlyIncreasingPeriodicKnotSequenceClosedCurve,
        degree: number,
        vectorSpaceType: VectorSpaceType
    ): BSplineEvaluator<IV> {
        const reg = this._registry.get(algorithmName);
        if (!reg) {
            throw new Error(`Algorithm '${algorithmName}' is not registered. Did you call AlgorithmBootstrap.initialize()?`);
        }
        if (!reg.vectorSpaceTypes.some(v => v === vectorSpaceType)) {
            throw new Error(`Algorithm '${algorithmName}' does not support vector space type '${vectorSpaceType}'`);
        }
        return reg.factory.createEvaluator(
            controlPolygon as ControlPolygon<IVector<any, Vector>>,
            knotSequence,
            degree
        ) as BSplineEvaluator<IV>;
    }
}
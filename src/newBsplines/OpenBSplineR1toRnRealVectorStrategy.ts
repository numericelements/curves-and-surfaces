import { RealVectorSpace } from "../mathVector/RealVectorSpace";
import { VectorSpaceType } from "../namedConstants/BSplineR1toRn";
import { AbstractOPenBSplineR1toRnStrategy } from "./AbstractOPenBSplineR1toRnStrategy";
// import { AbstractOPenBSplineR1toRnStrategy } from "./AbstractOPenBSplineR1toRnStrategy";
import { BSpline_type } from "./BSplineR1toRnConstructorInterface";
import { BSplineEvaluator } from "./OpenBSplineR1toRn";
// import { AlgorithmRegistry, BSplineEvaluator, CoxDeBoorEvaluator, OpenBSplineR1toRn, OpenBSplineR1toRnStrategy } from "./OpenBSplineR1toRn";



// export class OpenBSplineR1toRnRealVectorStrategy extends AbstractOPenBSplineR1toRnStrategy<RealVector, number> implements OpenBSplineR1toRnStrategy<RealVector, number> {

//     protected vectorSpace: RealVectorSpace;

//     constructor(curveParameters: BSpline_type, openSBplineR1toRn: OpenBSplineR1toRn<RealVector, number>) {
//         super(curveParameters, openSBplineR1toRn);
//         this.vectorSpace = new RealVectorSpace(openSBplineR1toRn.spaceDimension);
//     }

//     // protected createEvaluator(algorithmName: string): BSplineEvaluator {
//     //     switch (algorithmName) {
//     //         case 'coxdeboor':
//     //             return new CoxDeBoorEvaluator(
//     //                 this.openBSplineR1toRn.controlPolygon);
//     //         case 'boehm':
//     //             // return new BoehmRealEvaluator(/* ... */);
//     //         default:
//     //             return new CoxDeBoorEvaluator(
//     //                 this.openBSplineR1toRn.controlPolygon);
//     //     }
//     // }

//     protected createEvaluator(algorithmName: string): BSplineEvaluator {
//         const factory = AlgorithmRegistry.getFactory(algorithmName, VectorSpaceType.REAL);
        
//         if (!factory) {
//             // Fallback to default algorithm
//             const defaultAlgorithm = AlgorithmRegistry.getDefaultAlgorithm(VectorSpaceType.REAL);
//             const defaultFactory = AlgorithmRegistry.getFactory(defaultAlgorithm, VectorSpaceType.REAL);
            
//             if (!defaultFactory) {
//                 throw new Error(`No algorithm factory found for ${algorithmName} or default algorithm for REAL vector space`);
//             }
            
//             return defaultFactory.createEvaluator(
//                 this.openBSplineR1toRn.controlPolygon,
//                 this.openBSplineR1toRn.knotSequence,
//                 this.openBSplineR1toRn.degree,
//                 this.vectorSpace
//             );
//         }

//         return factory.createEvaluator(
//             this.openBSplineR1toRn.controlPolygon,
//             this.openBSplineR1toRn.knotSequence,
//             this.openBSplineR1toRn.degree,
//             this.vectorSpace
//         );
//     }

//     euclideanDistances(): number[] {
//         const distances: number[] = [];
//         for (let i = 0; i < this.openBSplineR1toRn.controlPolygon.length - 1; i += 1) {
//             // distances.push(this.vectorSpace.normDescriptor(this.vectorSpace.subtractDescriptors(this.openBSplineR1toRn.controlPolygon.getVector(i + 1) as RealVector, this.openBSplineR1toRn.controlPolygon.getVector(i) as RealVector)));
//         }
//         return distances;
//     }

//     evaluate(u: number, ): RealVector {
//         const evaluator = this.getEvaluatorView<CoxDeBoorEvaluator>('coxdeboor');
//         return evaluator.evaluate(u);
//         // const result = this.vectorSpace.createVector([]);
//         // return result;
//     }

//     derivative(): OpenBSplineR1toRn<RealVector, number> {
//         return this.openBSplineR1toRn;
//     }

//     bernsteinDecomposition(): OpenBSplineR1toRn<RealVector, number> {
//         return this.openBSplineR1toRn;
//     }

// }
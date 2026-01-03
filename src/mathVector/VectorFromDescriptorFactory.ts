// import { COMPLEX } from "../namedConstants/ComplexTypeTag";
// import { COMPLEXVECTOR2D, PROJECTIVECOMPLEXVECTOR1D, PROJECTIVEVECTOR2D, PROJECTIVEVECTOR3D, REALVECTOR2D, REALVECTOR3D, REALVECTOR4D } from "../namedConstants/VectorTypeTags";
// import { ComplexVectorSpace } from "./ComplexVectorSpace";
// import { ProjectiveComplexVectorSpace } from "./ProjectiveComplexVectorSpace";
// import { ProjectiveVector1DTypeComplex } from "./ProjectiveVector1DTypeComplex";
// import { ProjectiveVector2DTypeReal } from "./ProjectiveVector2DTypeReal";
// import { ProjectiveVector3DTypeReal } from "./ProjectiveVector3DTypeReal";
// import { ProjectiveVectorSpace } from "./ProjectiveVectorSpace";
// import { RealVectorSpace } from "./RealVectorSpace";
// import { IComplexVector, IProjectiveComplexVector, IProjectiveVector, IRealVector } from "./Vector";
// import { Vector1DTypeComplex } from "./Vector1DTypeComplex";
// import { Vector1DTypeReal } from "./Vector1DTypeReal";
// import { Vector2DTypeComplex } from "./Vector2DTypeComplex";
// import { Vector2DTypeReal } from "./Vector2DTypeReal";
// import { Vector3DTypeReal } from "./Vector3DTypeReal";
// import { Vector4DTypeReal } from "./Vector4DTypeReal";
// import { ComplexVector, ProjectiveComplexVector, ProjectiveVector, RealVector } from "./VectorSpaceConstructorInterface";

/**
 * Enhanced factory that handles vector space assignment
 */
// export class VectorFactory {
//     static createRealVectorFromRaw(raw: RealVector, vectorSpace?: RealVectorSpace<any>): IRealVector {
//         if (typeof raw === 'number') {
//             return new Vector1DTypeReal(raw, vectorSpace as RealVectorSpace<1>);
//         }
        
//         if (typeof raw === 'object' && 'type' in raw) {
//             const string = raw.type;
//             switch (raw.type) {
//                 case REALVECTOR2D:
//                     return new Vector2DTypeReal(
//                         raw.coordinates[0], 
//                         raw.coordinates[1], 
//                         vectorSpace as RealVectorSpace<2>
//                     );
//                 case REALVECTOR3D:
//                     return new Vector3DTypeReal(
//                         raw.coordinates[0], 
//                         raw.coordinates[1], 
//                         raw.coordinates[2], 
//                         vectorSpace as RealVectorSpace<3>
//                     );
//                 case REALVECTOR4D:
//                     return new Vector4DTypeReal(
//                         raw.coordinates[0], 
//                         raw.coordinates[1], 
//                         raw.coordinates[2], 
//                         raw.coordinates[3], 
//                         vectorSpace as RealVectorSpace<4>
//                     );
//                 default:
//                     throw new Error(`Unsupported real vector type: ${string}`);
//             }
//         }
        
//         throw new Error('Cannot create real vector from raw data');
//     }

//     static createComplexVectorFromRaw(raw: ComplexVector, vectorSpace?: ComplexVectorSpace<any>): IComplexVector {
//         if (typeof raw === 'object' && 'type' in raw) {
//             const string = raw.type;
//             switch (raw.type) {
//                 case COMPLEX:
//                     return new Vector1DTypeComplex(
//                         raw.real, 
//                         raw.imaginary, 
//                         vectorSpace as ComplexVectorSpace<1>
//                     );
//                 case COMPLEXVECTOR2D:
//                     return new Vector2DTypeComplex(
//                         raw.coordinates[0].real, 
//                         raw.coordinates[0].imaginary,
//                         raw.coordinates[1].real, 
//                         raw.coordinates[1].imaginary,
//                         vectorSpace as ComplexVectorSpace<2>
//                     );
//                 default:
//                     throw new Error(`Unsupported complex vector type: ${string}`);
//             }
//         }
        
//         throw new Error('Cannot create complex vector from raw data');
//     }

//     static createProjectiveVectorFromRaw(raw: ProjectiveVector, vectorSpace?: ProjectiveVectorSpace<any>): IProjectiveVector {
//         if (typeof raw === 'object' && 'type' in raw) {
//             switch (raw.type) {
//                 case PROJECTIVEVECTOR2D:
//                     return new ProjectiveVector2DTypeReal(
//                         raw.coordinates[0], 
//                         raw.coordinates[1], 
//                         raw.coordinates[2].weight, 
//                         vectorSpace as ProjectiveVectorSpace<3>
//                     );
//                 case PROJECTIVEVECTOR3D:
//                     return new ProjectiveVector3DTypeReal(
//                         raw.coordinates[0], 
//                         raw.coordinates[1], 
//                         raw.coordinates[2], 
//                         raw.coordinates[3].weight, 
//                         vectorSpace as ProjectiveVectorSpace<4>
//                     );
//                 default:
//                     throw new Error(`Unsupported projective real vector type: raw.type`);
//             }
//         }
        
//         throw new Error('Cannot create projective real vector from raw data');
//     }

//     static createProjectiveComplexVectorFromRaw(raw: ProjectiveComplexVector, vectorSpace?: ProjectiveComplexVectorSpace<any>): IProjectiveComplexVector {
//         if (typeof raw === 'object' && 'type' in raw) {
//             switch (raw.type) {
//                 case PROJECTIVECOMPLEXVECTOR1D:
//                     return new ProjectiveVector1DTypeComplex(
//                         raw.coordinates[0].real,
//                         raw.coordinates[0].imaginary, 
//                         raw.coordinates[1].real,
//                         raw.coordinates[1].imaginary, 
//                         vectorSpace as ProjectiveComplexVectorSpace<2>
//                     );
//                 default:
//                     throw new Error(`Unsupported projective complex vector type: ${raw.type}`);
//             }
//         }
        
//         throw new Error('Cannot create projective complex vector from raw data');
//     }
// }
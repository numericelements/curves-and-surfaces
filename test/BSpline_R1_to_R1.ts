// import { expect } from 'chai';
// import { BSpline_R1_to_R1 } from '../src/mathematics/BSpline_R1_to_R1';

// describe('BSpline_R1_to_R1', () => {
    
//     it('can be initialized without an initializer', () => {
//         const s = new BSpline_R1_to_R1();
//         expect(s.controlPoints).to.eql([0])
//         expect(s.knots).to.eql([0, 1])
//     });
    
//     it('can be initialized with an initializer', () => {
//         const s = new BSpline_R1_to_R1([ 1, 2, 3 ], [ 0, 0, 0, 1, 1, 1 ])
//         expect(s.controlPoints).to.eql([ 1, 2, 3])
//         expect(s.knots).to.eql([ 0, 0, 0, 1, 1, 1 ])
//         expect(s.degree).to.equal(2)
//     });
    
//     it('throws an exception at construction if the degree of the b-spline is negative', () => {
//         expect(function() {const s = new BSpline_R1_to_R1([ 1, 2, 3 ], [ 0, 0, 1 ])}).to.throw()
//     });

//     it('can be used to evaluate a Bernstein polynomial', () => {
//         const u = 0.22
//         const a = 1.1
//         const b = 3.2
//         const c = 6.3
//         const b02 = Math.pow(1-u, 2)
//         const b12 = 2*u*(1-u)
//         const b22 = Math.pow(u, 2)
//         const s = new  BSpline_R1_to_R1([ a, b, c ], [ 0, 0, 0, 1, 1, 1 ])
//         expect(a*b02+b*b12+c*b22).to.equal(s.evaluate(u))
//     });

//     it('can evaluate its zeros', () => {
//         const s = new  BSpline_R1_to_R1([ -1, 0, 1 ], [ 0, 0, 0, 1, 1, 1 ])
//         expect(s.zeros().length).to.equal(1)
//         expect(s.zeros()[0]).to.be.closeTo(0.5, 10e-4)
//     });

//     it('can compute the number of sign changes of its control polygon', () => {
//         const s1 = new  BSpline_R1_to_R1([ -1, 0, 1 ], [ 0, 0, 0, 1, 1, 1 ])
//         expect(s1.controlPolygonNumberOfSignChanges()).to.equal(2)

//         const s2 = new  BSpline_R1_to_R1([ -1, 0.1, 1 ], [ 0, 0, 0, 1, 1, 1 ])
//         expect(s2.controlPolygonNumberOfSignChanges()).to.equal(1)

//         const s3 = new  BSpline_R1_to_R1([ -1, 0.1, 1, -2 ], [ 0, 0, 0, 0.5, 1, 1, 1 ])
//         expect(s3.controlPolygonNumberOfSignChanges()).to.equal(2)
//     });

//     it('can compute the zeros of the control polygon', () => {
//         const s1 = new  BSpline_R1_to_R1([ -1, 1, 1 ], [ 0, 0, 0, 1, 1, 1 ])
//         expect(s1.controlPolygonZeros().length).to.equal(1)
//         expect(s1.controlPolygonZeros()[0]).to.be.closeTo(0.25, 10e-8)
//     });

//     it('can produce a curve', () => {
//         const s1 = new  BSpline_R1_to_R1([ -1, 1, 1 ], [ 0, 0, 0, 1, 1, 1 ])
//         const c1 = s1.curve()
//         expect(c1.controlPoints[0].x).to.equal(0)
//         expect(c1.controlPoints[0].y).to.equal(-1)
//         expect(c1.controlPoints[1].x).to.equal(0.5)
//         expect(c1.controlPoints[1].y).to.equal(1)
//         expect(c1.controlPoints[2].x).to.equal(1)
//         expect(c1.controlPoints[2].y).to.equal(1)
//     });



// });
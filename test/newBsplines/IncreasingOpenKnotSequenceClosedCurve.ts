import { expect } from "chai";
import { IncreasingOpenKnotSequenceClosedCurve } from "../../src/newBsplines/IncreasingOpenKnotSequenceClosedCurve";

describe('IncreasingOpenKnotSequenceClosedCurve', () => {
    
    it('can be initialized with a knot sequence conforming to a non-uniform B-spline', () => {
        const knots: number [] = [0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
        // expect(function() {const seq = new IncreasingOpenKnotSequenceClosedCurve(3, knots)}).to.throw()
        const seq = new IncreasingOpenKnotSequenceClosedCurve(3, knots)
        // test sending error message by ErrorLog class replaced by
        expect(seq.distinctAbscissae).to.eql([0, 0.5, 0.6, 0.7, 1])
        expect(seq.multiplicities).to.eql([4, 1, 1, 2, 4])
        expect(seq.freeKnots).to.eql([0.5, 0.6, 0.7, 0.7])
    });

    it('cannot be initialized with a knot sequence containing a knot with more than (degree + 1) multiplicity', () => {
        const knots: number [] = [0, 0, 0, 0, 0, 0.5, 0.6, 0.7, 0.7, 1, 1, 1, 1 ]
        // expect(function() {const seq = new IncreasingOpenKnotSequenceClosedCurve(3, knots)}).to.throw()
        const seq = new IncreasingOpenKnotSequenceClosedCurve(3, knots)
        // test sending error message by ErrorLog class replaced by
        expect(knots[4]).to.eql([0, 0.5, 0.6, 0.7, 1])
    });
});
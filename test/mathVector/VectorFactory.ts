import { expect } from "chai";
import { DefaultVectorSpaces } from "../../src/mathVector/internal/DefaultVectorSpaces";
import { realVector1D } from "../../src/mathVector/VectorFactory";
import { VectorSpaceType } from "../../src/namedConstants/BSplineR1toRn";
import { RealVectorSpace } from "../../src/mathVector/RealVectorSpace";

describe('Vector factory to create real, projective real, complex, and projective complex vectors into corresponding vector spaces that can be either default ones or user-specified ones', () => {

    beforeEach(() => {
        // Reset the default projective space manager singleton before each test
        DefaultVectorSpaces.reset();
    });

    const dimension = 1;

    it('can create a real 1D vector in a default real vector space with default coordinate', () => {
        const vector = realVector1D();
        expect(vector.dimension).to.eql(dimension);
        expect(vector.vectorSpace.dimension()).to.eql(dimension);
        expect(vector.getCoordinate(0)).to.eql(0);
        expect(vector.spaceType).to.eql(VectorSpaceType.REAL);
        expect(vector.vectorSpace.isDefault).to.eql(true);
    });

    it('can create a real 1D vector in a user-defined real vector space with default coordinate', () => {
        const vSpace = new RealVectorSpace(dimension);
        const vector = realVector1D(vSpace);
        expect(vector.dimension).to.eql(dimension);
        expect(vector.vectorSpace.dimension()).to.eql(dimension);
        expect(vector.getCoordinate(0)).to.eql(0);
        expect(vector.spaceType).to.eql(VectorSpaceType.REAL);
        expect(vector.vectorSpace.isDefault).to.eql(false);
    });

    it('can create a real 1D vector in a default real vector space with user-defined coordinate', () => {
        const coordinate = 5;
        const vector = realVector1D(coordinate);
        expect(vector.dimension).to.eql(dimension);
        expect(vector.vectorSpace.dimension()).to.eql(dimension);
        expect(vector.getCoordinate(0)).to.eql(coordinate);
        expect(vector.spaceType).to.eql(VectorSpaceType.REAL);
        expect(vector.vectorSpace.isDefault).to.eql(true);
    });

    it('can create a real 1D vector in a user-defined real vector space with user-defined coordinate', () => {
        const coordinate = 5;
        const vSpace = new RealVectorSpace(dimension);
        const vector = realVector1D(coordinate, vSpace);
        expect(vector.dimension).to.eql(dimension);
        expect(vector.vectorSpace.dimension()).to.eql(dimension);
        expect(vector.getCoordinate(0)).to.eql(coordinate);
        expect(vector.spaceType).to.eql(VectorSpaceType.REAL);
        expect(vector.vectorSpace.isDefault).to.eql(false);
    });


});
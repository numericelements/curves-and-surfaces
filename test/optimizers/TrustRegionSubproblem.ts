import { expect } from 'chai';
import { SymmetricMatrix } from '../../src/linearAlgebra/SymmetricMatrix';
import { TrustRegionSubproblem } from '../../src/optimizers/TrustRegionSubproblem';


describe('TrustRegionSubproblem', () => {


    it('can solve a first given 2 dimensional problem', () => {
        let tr = new TrustRegionSubproblem([53.47436755137444,0.0005438988696183231], new SymmetricMatrix(2, [76.69675864412685, -0.0003705733736658014, 41.23711340593455]))
        //let result = tr.solve(10)
        //let result = tr.solve(0.000274658203125)
        //console.log(result.step)
        //expect(result.step).to.deep.equal([ -0.6972180898374747, -0.000019455031234915807 ])
    });

    it('can solve a second given 2 dimensional problem', () => {
        let tr = new TrustRegionSubproblem([-0.001788062707124795,249.09611050799398], new SymmetricMatrix(2, [68.58710628786633,0.02255475415056002,835.0460305200344]))
        //let result = tr.solve(10)
        //let result = tr.solve(0.0000171661376953125)
        //expect(result.step).to.deep.equal([ 0.00012416614689354585, -0.2983022542522638 ])
    });
    

});


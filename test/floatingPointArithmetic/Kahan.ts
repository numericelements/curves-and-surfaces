import { expect } from 'chai';
import { kahanSum} from '../../src/floatingPointArithmetic/Kahan';


describe('Kahan sum', () => {
    
    it('can compute sum', () => {
        const s = kahanSum([0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7])
        expect(s).equal(15.3)
    });
    


});
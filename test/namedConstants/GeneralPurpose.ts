// When comparing a number (a float): n to a reference value: VAL, eg: n < VAL or n > VAL
// the floating point computations leading to n can alterate the desired value VAL to test the bound VAL.
// This constant accounts for the roundoffs of the floating point computations to set a test:
// n * COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF < VAL is an example of version accounting for these roundoffs
export const COEF_TAKINGINTOACCOUNT_FLOATINGPT_ROUNDOFF = 1.1;
import { expect } from 'chai';
import { ShapeSpaceDiffEventsStructure } from '../../src/curveShapeSpaceNavigation/ShapeSpaceDiffEventsStructure';

describe('ShapeNavigationParameters', () => {

/*     it('can instantiate a ShapeNavigationParameters object', () => {
        const navParam = new ShapeSpaceDiffEventsStructure();
        expect(navParam.curvatureExtremaControl, 'curvatureExtremaControl: ').to.eql(false);
        expect(navParam.inflectionControl, 'inflectionControl: ').to.eql(false);
        expect(navParam.slidingStatus, 'slidingStatus: ').to.eql(false);
        expect(navParam.navigationStatus, 'navigation: ').to.eql(false);
    });

    it('can instantiate a ShapeNavigationParameters object with inflection control', () => {
        const navParam = new ShapeSpaceDiffEventsStructure(true);
        expect(navParam.curvatureExtremaControl, 'curvatureExtremaControl: ').to.eql(false);
        expect(navParam.inflectionControl, 'inflectionControl: ').to.eql(true);
        expect(navParam.slidingStatus, 'slidingStatus: ').to.eql(false);
        expect(navParam.navigationStatus, 'navigation: ').to.eql(true);
    });

    it('can instantiate a ShapeNavigationParameters object with curvature extrema control', () => {
        const navParam = new ShapeSpaceDiffEventsStructure(undefined, true);
        expect(navParam.curvatureExtremaControl, 'curvatureExtremaControl: ').to.eql(true);
        expect(navParam.inflectionControl, 'inflectionControl: ').to.eql(false);
        expect(navParam.slidingStatus, 'slidingStatus: ').to.eql(false);
        expect(navParam.navigationStatus, 'navigation: ').to.eql(true);
    });

    it('can instantiate a ShapeNavigationParameters object with curvature extrema control and sliding', () => {
        const navParam = new ShapeSpaceDiffEventsStructure(undefined, true, true);
        expect(navParam.curvatureExtremaControl, 'curvatureExtremaControl: ').to.eql(true);
        expect(navParam.inflectionControl, 'inflectionControl: ').to.eql(false);
        expect(navParam.slidingStatus, 'slidingStatus: ').to.eql(true);
        expect(navParam.navigationStatus, 'navigation: ').to.eql(true);
    });

    it('can set the control of inflections', () => {
        const navParam = new ShapeSpaceDiffEventsStructure(undefined, true, true);
        expect(navParam.curvatureExtremaControl, 'curvatureExtremaControl: ').to.eql(true);
        expect(navParam.inflectionControl, 'inflectionControl: ').to.eql(false);
        expect(navParam.slidingStatus, 'slidingStatus: ').to.eql(true);
        expect(navParam.navigationStatus, 'navigation: ').to.eql(true);
        navParam.inflectionControl = true;
        expect(navParam.inflectionControl, 'inflectionControl: ').to.eql(true);
    });

    it('can set the control of the sliding process', () => {
        const navParam = new ShapeSpaceDiffEventsStructure(undefined, true, true);
        expect(navParam.curvatureExtremaControl, 'curvatureExtremaControl: ').to.eql(true);
        expect(navParam.inflectionControl, 'inflectionControl: ').to.eql(false);
        expect(navParam.slidingStatus, 'slidingStatus: ').to.eql(true);
        expect(navParam.navigationStatus, 'navigation: ').to.eql(true);
        navParam.differentialEventSliding = false;
        expect(navParam.slidingStatus, 'slidingStatus: ').to.eql(false);
    });

    it('can set the control of the navigation process', () => {
        const navParam = new ShapeSpaceDiffEventsStructure(undefined, true, true);
        expect(navParam.curvatureExtremaControl, 'curvatureExtremaControl: ').to.eql(true);
        expect(navParam.inflectionControl, 'inflectionControl: ').to.eql(false);
        expect(navParam.slidingStatus, 'slidingStatus: ').to.eql(true);
        expect(navParam.navigationStatus, 'navigation: ').to.eql(true);
        navParam.navigation = false;
        expect(navParam.navigationStatus, 'navigation: ').to.eql(false);
        expect(navParam.slidingStatus, 'slidingStatus: ').to.eql(true);
        expect(navParam.inflectionControl, 'inflectionControl: ').to.eql(false);
        expect(navParam.curvatureExtremaControl, 'curvatureExtremaControl: ').to.eql(true);
    });

    it('can reset all the navigation parameters', () => {
        const navParam = new ShapeSpaceDiffEventsStructure(undefined, true, true);
        expect(navParam.curvatureExtremaControl, 'curvatureExtremaControl: ').to.eql(true);
        expect(navParam.inflectionControl, 'inflectionControl: ').to.eql(false);
        expect(navParam.slidingStatus, 'slidingStatus: ').to.eql(true);
        expect(navParam.navigationStatus, 'navigation: ').to.eql(true);
        navParam.reset();
        expect(navParam.navigationStatus, 'navigation: ').to.eql(false);
        expect(navParam.slidingStatus, 'slidingStatus: ').to.eql(false);
        expect(navParam.inflectionControl, 'inflectionControl: ').to.eql(false);
        expect(navParam.curvatureExtremaControl, 'curvatureExtremaControl: ').to.eql(false);
    });

    it('can stop the navigation process while preserving the status of differential events control', () => {
        const navParam = new ShapeSpaceDiffEventsStructure(undefined, true, true);
        navParam.stop();
        expect(navParam.navigationStatus, 'navigation: ').to.eql(false);
        expect(navParam.slidingStatus, 'slidingStatus: ').to.eql(true);
        expect(navParam.inflectionControl, 'inflectionControl: ').to.eql(false);
        expect(navParam.curvatureExtremaControl, 'curvatureExtremaControl: ').to.eql(true);
    });

    it('can restart the navigation process with the pre-existing status of differential events control parameters', () => {
        const navParam = new ShapeSpaceDiffEventsStructure(undefined, true, true);
        navParam.stop();
        expect(navParam.navigationStatus, 'navigation: ').to.eql(false);
        expect(navParam.slidingStatus, 'slidingStatus: ').to.eql(true);
        expect(navParam.inflectionControl, 'inflectionControl: ').to.eql(false);
        expect(navParam.curvatureExtremaControl, 'curvatureExtremaControl: ').to.eql(true);
        navParam.restart();
        expect(navParam.navigationStatus, 'navigation: ').to.eql(true);
        expect(navParam.slidingStatus, 'slidingStatus: ').to.eql(true);
        expect(navParam.inflectionControl, 'inflectionControl: ').to.eql(false);
        expect(navParam.curvatureExtremaControl, 'curvatureExtremaControl: ').to.eql(true);
    }); */
})
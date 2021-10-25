import { SlidingEventsAtExtremities } from "../designPatterns/SlidingEventsAtExtremities";
import { CurveAnalyzer } from "./CurveAnalyzer";


export class CurveAnalyzerEventsSlidingOutOfInterval implements SlidingEventsAtExtremities {

    getCurvatureCrtlPtsClosestToZero(curveAnalyzer: CurveAnalyzer): void {
        for (let i = 0, n = curveAnalyzer.curvatureSignChanges.length; i < n; i += 1) {
            if (Math.pow(curveAnalyzer.curveCurvatureCntrlPolygon[curveAnalyzer.curvatureSignChanges[i]], 2) < Math.pow(curveAnalyzer.curveCurvatureCntrlPolygon[curveAnalyzer.curvatureSignChanges[i] + 1], 2)) {
                if(curveAnalyzer.curvatureCrtlPtsClosestToZero.indexOf(curveAnalyzer.curvatureSignChanges[i]) === -1) curveAnalyzer.curvatureCrtlPtsClosestToZero.push(curveAnalyzer.curvatureSignChanges[i]);
            } else {
                if(curveAnalyzer.curvatureCrtlPtsClosestToZero.indexOf(curveAnalyzer.curvatureSignChanges[i] + 1) === -1) curveAnalyzer.curvatureCrtlPtsClosestToZero.push(curveAnalyzer.curvatureSignChanges[i] + 1);
            }
        }
    }

    getCurvatureDerivCrtlPtsClosestToZero(curveAnalyzer: CurveAnalyzer): void {
        for (let i = 0, n = curveAnalyzer.curvatureDerivativeSignChanges.length; i < n; i += 1) {
            if (Math.pow(curveAnalyzer.curveCurvatureDerivativeCntrlPolygon[curveAnalyzer.curvatureDerivativeSignChanges[i]], 2) < Math.pow(curveAnalyzer.curveCurvatureDerivativeCntrlPolygon[curveAnalyzer.curvatureDerivativeSignChanges[i] + 1], 2)) {
                if(curveAnalyzer.curvatureDerivCrtlPtsClosestToZero.indexOf(curveAnalyzer.curvatureDerivativeSignChanges[i]) === -1) curveAnalyzer.curvatureDerivCrtlPtsClosestToZero.push(curveAnalyzer.curvatureDerivativeSignChanges[i]);
            } else {
                if(curveAnalyzer.curvatureDerivCrtlPtsClosestToZero.indexOf(curveAnalyzer.curvatureDerivativeSignChanges[i] + 1) === -1) curveAnalyzer.curvatureDerivCrtlPtsClosestToZero.push(curveAnalyzer.curvatureDerivativeSignChanges[i] + 1);
            }
        }
    }

}

export class CurveAnalyzerEventsNotSlidingOnTheLeftOfInterval implements SlidingEventsAtExtremities {

    getCurvatureCrtlPtsClosestToZero(curveAnalyzer: CurveAnalyzer): void {
        for (let i = 0, n = curveAnalyzer.curvatureSignChanges.length; i < n; i += 1) {
            if (Math.pow(curveAnalyzer.curveCurvatureCntrlPolygon[curveAnalyzer.curvatureSignChanges[i]], 2) < Math.pow(curveAnalyzer.curveCurvatureCntrlPolygon[curveAnalyzer.curvatureSignChanges[i] + 1], 2)) {
                if(curveAnalyzer.curvatureSignChanges[i] > 0 && curveAnalyzer.curvatureCrtlPtsClosestToZero.indexOf(curveAnalyzer.curvatureSignChanges[i]) === -1) {
                    curveAnalyzer.curvatureCrtlPtsClosestToZero.push(curveAnalyzer.curvatureSignChanges[i]);
                }
            } else {
                if(curveAnalyzer.curvatureSignChanges[i] === 0 && curveAnalyzer.curvatureCrtlPtsClosestToZero.indexOf(curveAnalyzer.curvatureSignChanges[i] + 1) === -1) {
                    curveAnalyzer.curvatureCrtlPtsClosestToZero.push(curveAnalyzer.curvatureSignChanges[i] + 1);
                    curveAnalyzer.shapeSpaceDescriptor.inflectionMonitoringAtCurveExtremities.splice(curveAnalyzer.shapeSpaceDescriptor.inflectionMonitoringAtCurveExtremities.indexOf(0), 1)
                } else if(curveAnalyzer.curvatureCrtlPtsClosestToZero.indexOf(curveAnalyzer.curvatureSignChanges[i] + 1) === -1) curveAnalyzer.curvatureCrtlPtsClosestToZero.push(curveAnalyzer.curvatureSignChanges[i] + 1);
            }
        }
    }

    getCurvatureDerivCrtlPtsClosestToZero(curveAnalyzer: CurveAnalyzer): void {
        for (let i = 0, n = curveAnalyzer.curvatureDerivativeSignChanges.length; i < n; i += 1) {
            if (Math.pow(curveAnalyzer.curveCurvatureDerivativeCntrlPolygon[curveAnalyzer.curvatureDerivativeSignChanges[i]], 2) < Math.pow(curveAnalyzer.curveCurvatureDerivativeCntrlPolygon[curveAnalyzer.curvatureDerivativeSignChanges[i] + 1], 2)) {
                if(curveAnalyzer.curvatureDerivativeSignChanges[i] > 0 && curveAnalyzer.curvatureDerivCrtlPtsClosestToZero.indexOf(curveAnalyzer.curvatureDerivativeSignChanges[i]) === -1) {
                    curveAnalyzer.curvatureDerivCrtlPtsClosestToZero.push(curveAnalyzer.curvatureDerivativeSignChanges[i]);
                }
            } else {
                if(curveAnalyzer.curvatureDerivativeSignChanges[i] === 0 && curveAnalyzer.curvatureDerivCrtlPtsClosestToZero.indexOf(curveAnalyzer.curvatureDerivativeSignChanges[i] + 1) === -1) {
                    curveAnalyzer.curvatureDerivCrtlPtsClosestToZero.push(curveAnalyzer.curvatureDerivativeSignChanges[i] + 1);
                    curveAnalyzer.shapeSpaceDescriptor.curvatureExtremumMonitoringAtCurveExtremities.splice(curveAnalyzer.shapeSpaceDescriptor.curvatureExtremumMonitoringAtCurveExtremities.indexOf(0), 1);
                } else if(curveAnalyzer.curvatureDerivCrtlPtsClosestToZero.indexOf(curveAnalyzer.curvatureDerivativeSignChanges[i] + 1) === -1) curveAnalyzer.curvatureDerivCrtlPtsClosestToZero.push(curveAnalyzer.curvatureDerivativeSignChanges[i] + 1);
            }
        }
    }

}

export class CurveAnalyzerEventsNotSlidingOnTheRightOfInterval implements SlidingEventsAtExtremities {

    getCurvatureCrtlPtsClosestToZero(curveAnalyzer: CurveAnalyzer): void {
        for (let i = 0, n = curveAnalyzer.curvatureSignChanges.length; i < n; i += 1) {
            if (Math.pow(curveAnalyzer.curveCurvatureCntrlPolygon[curveAnalyzer.curvatureSignChanges[i]], 2) < Math.pow(curveAnalyzer.curveCurvatureCntrlPolygon[curveAnalyzer.curvatureSignChanges[i] + 1], 2)) {
                if(curveAnalyzer.curvatureSignChanges[i] === (curveAnalyzer.curveCurvatureCntrlPolygon.length - 2) && curveAnalyzer.curvatureCrtlPtsClosestToZero.indexOf(curveAnalyzer.curvatureSignChanges[i]) === -1) {
                    curveAnalyzer.curvatureCrtlPtsClosestToZero.push(curveAnalyzer.curvatureSignChanges[i]);
                    curveAnalyzer.shapeSpaceDescriptor.inflectionMonitoringAtCurveExtremities.splice(curveAnalyzer.shapeSpaceDescriptor.inflectionMonitoringAtCurveExtremities.indexOf(curveAnalyzer.curveCurvatureCntrlPolygon.length - 1), 1);
                } else if(curveAnalyzer.curvatureCrtlPtsClosestToZero.indexOf(curveAnalyzer.curvatureSignChanges[i]) === -1) curveAnalyzer.curvatureCrtlPtsClosestToZero.push(curveAnalyzer.curvatureSignChanges[i]);
            } else {
                if((curveAnalyzer.curvatureSignChanges[i] + 1) < (curveAnalyzer.curveCurvatureCntrlPolygon.length - 1) && curveAnalyzer.curvatureCrtlPtsClosestToZero.indexOf(curveAnalyzer.curvatureSignChanges[i] + 1) === -1) {
                    curveAnalyzer.curvatureCrtlPtsClosestToZero.push(curveAnalyzer.curvatureSignChanges[i] + 1);
                }
            }
        }
    }

    getCurvatureDerivCrtlPtsClosestToZero(curveAnalyzer: CurveAnalyzer): void {
        for (let i = 0, n = curveAnalyzer.curvatureDerivativeSignChanges.length; i < n; i += 1) {
            if (Math.pow(curveAnalyzer.curveCurvatureDerivativeCntrlPolygon[curveAnalyzer.curvatureDerivativeSignChanges[i]], 2) < Math.pow(curveAnalyzer.curveCurvatureDerivativeCntrlPolygon[curveAnalyzer.curvatureDerivativeSignChanges[i] + 1], 2)) {
                if(curveAnalyzer.curvatureDerivativeSignChanges[i] === (curveAnalyzer.curveCurvatureDerivativeCntrlPolygon.length - 2) && curveAnalyzer.curvatureDerivCrtlPtsClosestToZero.indexOf(curveAnalyzer.curvatureDerivativeSignChanges[i]) === -1) {
                    // Verifier le fonctionnement de curvatureExtremumMonitoringAtCurveExtremities
                    curveAnalyzer.curvatureDerivCrtlPtsClosestToZero.push(curveAnalyzer.curvatureDerivativeSignChanges[i]);
                    curveAnalyzer.shapeSpaceDescriptor.curvatureExtremumMonitoringAtCurveExtremities.splice(curveAnalyzer.shapeSpaceDescriptor.curvatureExtremumMonitoringAtCurveExtremities.indexOf(curveAnalyzer.curveCurvatureDerivativeCntrlPolygon.length - 1), 1);
                } else if(curveAnalyzer.curvatureDerivCrtlPtsClosestToZero.indexOf(curveAnalyzer.curvatureDerivativeSignChanges[i]) === -1) curveAnalyzer.curvatureDerivCrtlPtsClosestToZero.push(curveAnalyzer.curvatureDerivativeSignChanges[i]);
            } else {
                if((curveAnalyzer.curvatureDerivativeSignChanges[i] + 1) < (curveAnalyzer.curveCurvatureDerivativeCntrlPolygon.length - 1) && curveAnalyzer.curvatureDerivCrtlPtsClosestToZero.indexOf(curveAnalyzer.curvatureDerivativeSignChanges[i] + 1) === -1) {
                    curveAnalyzer.curvatureDerivCrtlPtsClosestToZero.push(curveAnalyzer.curvatureDerivativeSignChanges[i] + 1);
                }
            }
        }
    }

}

export class CurveAnalyzerEventsNotSlidingOfInterval implements SlidingEventsAtExtremities {

    getCurvatureCrtlPtsClosestToZero(curveAnalyzer: CurveAnalyzer): void {
        for (let i = 0, n = curveAnalyzer.curvatureSignChanges.length; i < n; i += 1) {
            if (Math.pow(curveAnalyzer.curveCurvatureCntrlPolygon[curveAnalyzer.curvatureSignChanges[i]], 2) < Math.pow(curveAnalyzer.curveCurvatureCntrlPolygon[curveAnalyzer.curvatureSignChanges[i] + 1], 2)) {
                if(curveAnalyzer.curvatureSignChanges[i] > 0 && curveAnalyzer.curvatureCrtlPtsClosestToZero.indexOf(curveAnalyzer.curvatureSignChanges[i]) === -1) {
                    curveAnalyzer.curvatureCrtlPtsClosestToZero.push(curveAnalyzer.curvatureSignChanges[i])
                } else if(curveAnalyzer.curvatureSignChanges[i] === (curveAnalyzer.curveCurvatureCntrlPolygon.length - 2) && curveAnalyzer.curvatureCrtlPtsClosestToZero.indexOf(curveAnalyzer.curvatureSignChanges[i]) === -1) {
                    curveAnalyzer.curvatureCrtlPtsClosestToZero.push(curveAnalyzer.curvatureSignChanges[i]);
                    curveAnalyzer.shapeSpaceDescriptor.inflectionMonitoringAtCurveExtremities.splice(curveAnalyzer.shapeSpaceDescriptor.inflectionMonitoringAtCurveExtremities.indexOf(curveAnalyzer.curveCurvatureCntrlPolygon.length - 1), 1);
                }
            } else {
                if((curveAnalyzer.curvatureSignChanges[i] + 1) < (curveAnalyzer.curveCurvatureCntrlPolygon.length - 1) && curveAnalyzer.curvatureCrtlPtsClosestToZero.indexOf(curveAnalyzer.curvatureSignChanges[i] + 1) === -1){
                    curveAnalyzer.curvatureCrtlPtsClosestToZero.push(curveAnalyzer.curvatureSignChanges[i] + 1);
                } else if(curveAnalyzer.curvatureSignChanges[i] === 0 && curveAnalyzer.curvatureCrtlPtsClosestToZero.indexOf(curveAnalyzer.curvatureSignChanges[i] + 1) === -1) {
                    curveAnalyzer.curvatureCrtlPtsClosestToZero.push(curveAnalyzer.curvatureSignChanges[i] + 1);
                    curveAnalyzer.shapeSpaceDescriptor.inflectionMonitoringAtCurveExtremities.splice(curveAnalyzer.shapeSpaceDescriptor.inflectionMonitoringAtCurveExtremities.indexOf(0), 1)
                }
            }
        }
    }

    getCurvatureDerivCrtlPtsClosestToZero(curveAnalyzer: CurveAnalyzer): void {
        for (let i = 0, n = curveAnalyzer.curvatureDerivativeSignChanges.length; i < n; i += 1) {
            if (Math.pow(curveAnalyzer.curveCurvatureDerivativeCntrlPolygon[curveAnalyzer.curvatureDerivativeSignChanges[i]], 2) < Math.pow(curveAnalyzer.curveCurvatureDerivativeCntrlPolygon[curveAnalyzer.curvatureDerivativeSignChanges[i] + 1], 2)) {
                if(curveAnalyzer.curvatureDerivativeSignChanges[i] > 0 && curveAnalyzer.curvatureDerivCrtlPtsClosestToZero.indexOf(curveAnalyzer.curvatureDerivativeSignChanges[i]) === -1) {
                    curveAnalyzer.curvatureDerivCrtlPtsClosestToZero.push(curveAnalyzer.curvatureDerivativeSignChanges[i]);
                } else if(curveAnalyzer.curvatureDerivativeSignChanges[i] === (curveAnalyzer.curveCurvatureDerivativeCntrlPolygon.length - 2) && curveAnalyzer.curvatureDerivCrtlPtsClosestToZero.indexOf(curveAnalyzer.curvatureDerivativeSignChanges[i]) === -1) {
                    // Verifier le fonctionnement de curvatureExtremumMonitoringAtCurveExtremities
                    curveAnalyzer.curvatureDerivCrtlPtsClosestToZero.push(curveAnalyzer.curvatureDerivativeSignChanges[i]);
                    curveAnalyzer.shapeSpaceDescriptor.curvatureExtremumMonitoringAtCurveExtremities.splice(curveAnalyzer.shapeSpaceDescriptor.curvatureExtremumMonitoringAtCurveExtremities.indexOf(curveAnalyzer.curveCurvatureDerivativeCntrlPolygon.length - 1), 1);
                }
            } else {
                if((curveAnalyzer.curvatureDerivativeSignChanges[i] + 1) < (curveAnalyzer.curveCurvatureDerivativeCntrlPolygon.length - 1) && curveAnalyzer.curvatureDerivCrtlPtsClosestToZero.indexOf(curveAnalyzer.curvatureDerivativeSignChanges[i] + 1) === -1){
                    curveAnalyzer.curvatureDerivCrtlPtsClosestToZero.push(curveAnalyzer.curvatureDerivativeSignChanges[i] + 1);
                } else if(curveAnalyzer.curvatureDerivativeSignChanges[i] === 0 && curveAnalyzer.curvatureDerivCrtlPtsClosestToZero.indexOf(curveAnalyzer.curvatureDerivativeSignChanges[i] + 1) === -1) {
                    curveAnalyzer.curvatureDerivCrtlPtsClosestToZero.push(curveAnalyzer.curvatureDerivativeSignChanges[i] + 1);
                    curveAnalyzer.shapeSpaceDescriptor.curvatureExtremumMonitoringAtCurveExtremities.splice(curveAnalyzer.shapeSpaceDescriptor.curvatureExtremumMonitoringAtCurveExtremities.indexOf(0), 1);
                }
            }
        }
    }
}

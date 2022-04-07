const template = document.createElement('template')
template.innerHTML = `
    <rounded-switch-torsion-zeros></rounded-switch-torsion-zeros>
    <rounded-switch-curvature-extrema-3d></rounded-switch-curvature-extrema-3d>
`

//import { CurveCategory } from "./CurveCategory"
import { RoundedSwitchCurvatureExtrema3d } from "./RoundedSwitchCurvatureExtrema3d"
import { RoundedSwitchTorsionZeros } from "./RoundedSwitchTorsionZeros"

export class AppCurves3d extends HTMLElement {

    constructor() {
        super()
        window.customElements.define('rounded-switch-torsion-zeros', RoundedSwitchTorsionZeros)
        window.customElements.define('rounded-switch-curvature-extrema-3d', RoundedSwitchCurvatureExtrema3d)
        //window.customElements.define('curve-category', CurveCategory)       
        //window.customElements.define('copyright-years', CopyrightYears)
        this.attachShadow({mode: 'open'})
        this.shadowRoot!.appendChild(template.content.cloneNode(true))
    }
}




const template = document.createElement('template')
template.innerHTML = `
    <rounded-switch-inflections></rounded-switch-inflections>
    <rounded-switch-curvature-extrema></rounded-switch-curvature-extrema>
    <curve-category></curve-category>
    <copyright-years></copyright-years>
`

//import { CopyrightYears } from "./CopyrightYears"
import { CurveCategory } from "./CurveCategory"
import { RoundedSwitchCurvatureExtrema } from "./RoundedSwitchCurvatureExtrema"
import { RoundedSwitchInflections } from "./RoundedSwitchInflections"

export class AppCurvesAndSurfaces extends HTMLElement {

    constructor() {
        super()
        window.customElements.define('rounded-switch-inflections', RoundedSwitchInflections)
        window.customElements.define('rounded-switch-curvature-extrema', RoundedSwitchCurvatureExtrema)
        window.customElements.define('curve-category', CurveCategory)       
        //window.customElements.define('copyright-years', CopyrightYears)
        this.attachShadow({mode: 'open'})
        this.shadowRoot!.appendChild(template.content.cloneNode(true))
    }
}




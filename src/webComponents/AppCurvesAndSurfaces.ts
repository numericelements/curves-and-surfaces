const template = document.createElement('template')
template.innerHTML = `
    <curve-category></curve-category>
    <copyright-years></copyright-years>
`

import { CopyrightYears } from "./CopyrightYears"
import { CurveCategory } from "./CurveCategory"

export class AppCurvesAndSurfaces extends HTMLElement {

    constructor() {
        super()        
        window.customElements.define('copyright-years', CopyrightYears)
        window.customElements.define('curve-category', CurveCategory)
        this.attachShadow({mode: 'open'})
        this.shadowRoot!.appendChild(template.content.cloneNode(true))
    }
}





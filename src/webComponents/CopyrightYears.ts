const template = document.createElement('template')
template.innerHTML = `
    <style>
    .text_center {
        text-align: center;
        margin-bottom: 1cm;
        color:rgb(100, 100, 100);
        font-size: 80%;
    }
    </style>
    <div class="text_center" id="copyright"></div>
`

export class CopyrightYears extends HTMLElement {

    constructor() {
        super()
        this.attachShadow({mode: 'open'})
        this.shadowRoot!.appendChild(template.content.cloneNode(true))
        let currentYear =  new Date().getFullYear()
        // \u00A9: copyright symbol
        this.shadowRoot!.getElementById('copyright')!.innerText = "\u00A9"  + " 2018-" + currentYear
    }
}






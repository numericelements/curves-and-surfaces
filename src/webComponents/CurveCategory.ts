const template = document.createElement('template')
template.innerHTML = `
    <style>
    .text_control_button {
        font-size: small;
        font-weight: bold;
        margin-bottom: 0%;
        color:rgb(100, 100, 100);
    }
    #container {
        text-align: center;
        margin-bottom: 1%;
    }
    </style>
    <div id="container">
    <p class="text_control_button"> Curve Category: </p>
        <select id="curve-category-selector">
            <option id= "option1" value="0" selected="selected"> Open planar </option>
            <option id= "option2" value="1" > Closed planar </option>
            <!--
            <option id= "option3" value="2" > Alternative open planar </option>
            <option id= "option4" value="3" > Alternative closed planar </option>
            -->
        </select>
    </div>
`
export class CurveCategory extends HTMLElement {

    constructor() {
        super()
        this.attachShadow({mode: 'open'})
        this.shadowRoot!.appendChild(template.content.cloneNode(true))
    }

    connectedCallback() {
        this.shadowRoot!.getElementById('curve-category-selector')!.
        addEventListener('change', this.categorySelected);
    }

    disconnectedCallback() {
        this.shadowRoot!.getElementById('curve-category-selector')!.
        removeEventListener('change', this.categorySelected)
    }

    categorySelected(event: Event) {
        let category = event.target as HTMLSelectElement
        this.dispatchEvent(new CustomEvent("changeCurveCategory", {
            bubbles: true,
            composed: true,
            detail: {category: category.value}
        }))
    }

}
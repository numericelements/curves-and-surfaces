const template = document.createElement('template')
template.innerHTML = `
    <style>

    body {
        margin: 0;
        padding: 0;
        font-family:  'Open Sans', sans-serif;
        background-color: rgb(230, 230, 230);}


    .switch {
        position: relative;
        display: inline-block;
        width: 60px;
        height: 30px;
      }
    
      .switch input {
        opacity: 0;
        width: 0;
        height: 0;
      }
      
      .slider {
        position: absolute;
        cursor: pointer;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: #ccc;
        -webkit-transition: .4s;
        transition: .4s;
      }
      
      .slider:before {
        position: absolute;
        content: "";
        height: 23px;
        width: 23px;
        left: 4px;
        bottom: 4px;
        background-color: white;
        -webkit-transition: .4s;
        transition: .4s;
      }
      
      input:checked + .slider {
        background-color: rgb(130, 194, 141);
      }
      
      input:focus + .slider {
        box-shadow: 0 0 1px rgb(145, 182, 145);
      }
      
      input:checked + .slider:before {
        -webkit-transform: translateX(26px);
        -ms-transform: translateX(26px);
        transform: translateX(26px);
      }
      
      .slider.round {
        border-radius: 34px;
      }
      
      .slider.round:before {
        border-radius: 50%;
      }

      .text_control_button {
        font-size: small;
        font-weight: bold;
        margin-bottom: 0%;
        color:rgb(100, 100, 100);
        }
    </style>

    <div id="container">
        <center>  <p class="text_control_button"> Torsion Zeros </p>
            <label class="switch">
            <input type="checkbox" checked id="toggleButtonTorsionZeros">
            <span class="slider round"></span>
            </label>
        </center>
    </div>
`
export class RoundedSwitchTorsionZeros extends HTMLElement {

    constructor() {
        super()
        this.attachShadow({mode: 'open'})
        this.shadowRoot!.appendChild(template.content.cloneNode(true))
    }

    connectedCallback() {
      this.shadowRoot!.getElementById('toggleButtonTorsionZeros')!.
      addEventListener('change', this.toogleControlOverTorsionZeros);
  }

  disconnectedCallback() {
      this.shadowRoot!.getElementById('toggleButtonTorsionZeros')!.
      removeEventListener('change', this.toogleControlOverTorsionZeros)
  }

  
  toogleControlOverTorsionZeros(event: Event) {
      let category = event.target as HTMLSelectElement
      this.dispatchEvent(new CustomEvent("toogleControlOverTorsionZeros", {
          bubbles: true,
          composed: true,
          detail: {category: category.value}
      }))
  }

}
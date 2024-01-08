import ColorPicker from "@thednp/color-picker"
import style from "@thednp/color-picker/dist/css/color-picker.css?inline"

export class ColorPickerCustomElement extends HTMLElement {
    constructor() {
        super()
        this.attachShadow({mode: 'open'})
    }

    connectedCallback() {
        if (!this.shadowRoot)
            return

        const styleEl = document.createElement("style")
        styleEl.innerHTML = `
            :host {
                display: inline-block;
                width: 300px;
            }
        ` + style
        this.shadowRoot.appendChild(styleEl)

        const divEl = document.createElement("div")
        divEl.classList.add("color-picker")
        const inputEl = document.createElement("input")
        divEl.appendChild(inputEl)
        this.shadowRoot.appendChild(divEl)
        inputEl.id = "myPicker"
        inputEl.name = "myPicker"
        inputEl.dataset.function="color-picker"
        inputEl.dataset.format="hex"
        inputEl.dataset.colorPresets = "red,green,blue"
        inputEl.classList.add("color-preview")
        inputEl.value = "#069"

        const myPicker = new ColorPicker(inputEl)
    }
}

customElements.define("color-picker", ColorPickerCustomElement)
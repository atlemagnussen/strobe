import ColorPicker from "@thednp/color-picker"
import style from "@thednp/color-picker/dist/css/color-picker.css?inline"
import { config, setLightColor } from "@app/stores/configStore"
import { Subscription } from "rxjs"

export class ColorPickerCustomElement extends HTMLElement {
    sub: Subscription | null = null

    constructor() {
        super()
        this.attachShadow({mode: 'open'})
    }

    myPicker: ColorPicker | null = null
    inputEl: HTMLInputElement | null = null

    connectedCallback() {
        if (!this.shadowRoot)
            return

        const styleEl = document.createElement("style")
        styleEl.innerHTML = `
            :host {
                display: inline-block;
                width: 200px;
            }
            input {
                width: 120px;
                font-size: 1.4rem;
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

        this.myPicker = new ColorPicker(inputEl)

        inputEl.addEventListener("colorpicker.change", () => this.setValue())
        this.inputEl = inputEl

        this.sub = config.subscribe(c => {
            if (this.inputEl)
                this.inputEl.value = c.lightColor
        })
    }

    get value() {
        if (!this.inputEl)
            return ""
        return this.inputEl.value
    }
    setValue() {
        if (!this.inputEl)
            return
        setLightColor(this.inputEl.value)
        this.dispatchEvent(new Event("change"))
    }

    disconnectedCallback() {
        if (this.inputEl)
            this.inputEl.removeEventListener("colorpicker.change", this.setValue)
        if (this.sub)
            this.sub.unsubscribe()
        
        if (this.shadowRoot) {
            let child = this.shadowRoot.lastElementChild
            while (child) {
                this.shadowRoot.removeChild(child)
                child = this.shadowRoot.lastElementChild
            }
        }
        this.myPicker = null
    }
}

customElements.define("color-picker", ColorPickerCustomElement)
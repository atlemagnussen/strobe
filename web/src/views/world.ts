import { LitElement, css, html } from "lit"
import { customElement } from "lit/decorators.js"
import { ref } from "lit/directives/ref.js"


@customElement('strobe-world')
export class StrobeWorld extends LitElement {
    static styles = css`
        :host {
            overflow: hidden;
            height: 100%;
            display: flex;
            flex-direction: column;
            padding: 1rem;
        }
    `

    //canvasRef: Ref<HTMLCanvasElement>
    constructor() {
        super()
        //this.canvasRef = createRef<HTMLCanvasElement>()
    }
    
    setupCanvas(canvasEl: Element | undefined) {
        if (!canvasEl)
            return

    }
    vrButton() {
        VRButton()
    }

    render() {
        return html`
            <canvas ${ref((cel) => this.setupCanvas(cel))}></canvas>
        `
    }
}

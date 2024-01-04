import { LitElement, css, html } from "lit"
import { customElement } from "lit/decorators.js"
import { ref } from "lit/directives/ref.js"
import { ThreeWorldRenderer } from "./world.three"


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
        canvas {
            background-color: #555;
        }
    `

    threeRenderer : ThreeWorldRenderer | null = null
    //canvasRef: Ref<HTMLCanvasElement>
    constructor() {
        super()
        //this.canvasRef = createRef<HTMLCanvasElement>()
    }
    
    setupCanvas(canvasEl: Element | undefined) {
        if (!canvasEl)
            return
        this.threeRenderer = new ThreeWorldRenderer(canvasEl as HTMLCanvasElement, this.clientWidth, this.clientHeight)
        const btn = this.threeRenderer.getVRButton()
        this.shadowRoot?.prepend(btn)
    }
    

    render() {
        return html`
            <canvas ${ref((cel) => this.setupCanvas(cel))}></canvas>
        `
    }
}

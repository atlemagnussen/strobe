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
            background-color: #F00;
        }
    `
    canvasEl: HTMLCanvasElement | undefined
    threeRenderer : ThreeWorldRenderer | null = null
    //canvasRef: Ref<HTMLCanvasElement>
    constructor() {
        super()
        //this.canvasRef = createRef<HTMLCanvasElement>()
    }

    connectedCallback(): void {
        super.connectedCallback()
        window.addEventListener("resize", () => this.resizeCanvas())
    }
    disconnectedCallback(): void {
        super.disconnectedCallback()
        window.removeEventListener("resize", () => this.resizeCanvas())
    }
    
    setupCanvas(canvasEl: Element | undefined) {
        if (!canvasEl)
            return
        this.canvasEl = canvasEl as HTMLCanvasElement
        this.resizeCanvas()
        this.threeRenderer = new ThreeWorldRenderer(canvasEl as HTMLCanvasElement, this.clientWidth, this.clientHeight)
        const btn = this.threeRenderer.getVRButton()
        this.shadowRoot?.prepend(btn)
    }
    
    resizeCanvas() {
        if (this.canvasEl) {
            this.canvasEl.width = this.clientWidth
            this.canvasEl.height = this.clientHeight
        }
        if (this.threeRenderer)
            this.threeRenderer.onWindowResize(this.clientWidth, this.clientHeight)
    }

    render() {
        return html`
            <canvas ${ref((cel) => this.setupCanvas(cel))}></canvas>
        `
    }
}

import { LitElement, css, html } from "lit"
import { customElement, state } from "lit/decorators.js"
import { createRef, ref } from "lit/directives/ref.js"
import { Subscription } from "rxjs"

@customElement('strobe-canvas')
export class CanvasView extends LitElement {
    static styles = css`
        :host {
            overflow: hidden;
            height: 100%;
            display: flex;
            flex-direction: column;
            padding: 0;
            font-size: 1.6rem;
        }
        * {
            box-sizing: border-box;
        }
        header {
            text-align: center;
        }
        canvas {
            background-color: #444;
        }
        div.menu {
            padding: 0 1rem;
            display: flex;
            flex-direction: column;
            gap: 2vw;
        }
        .menu-item {
            display: flex;
            flex-direction: row;
        }
        .menu-item * {
            flex: 50% 0 0;
        }
    `
    canvasRef = createRef<HTMLCanvasElement>()
    
    constructor() {
        super()
    }

    sub: Subscription | undefined
    isEnabled = false
    isSessionStarted = false

    @state()
    selectedHz = 7.83
    
    connectedCallback(): void {
        super.connectedCallback()
        window.addEventListener("resize", () => this.resizeCanvas())
        
    }
    disconnectedCallback(): void {
        super.disconnectedCallback()
        window.removeEventListener("resize", () => this.resizeCanvas())
    }
    
    setupCanvasAndThree() {
        if (!this.canvasRef.value)
            return
        
        this.resizeCanvas()
    }
    
    resizeCanvas() {
        if (this.canvasRef.value) {
            const canvasEl = this.canvasRef.value
            canvasEl.width = this.clientWidth
            canvasEl.height = this.clientHeight
        }
    }

    async vrButtonClicked() {
        if (!this.isEnabled)
            return

        if (this.isSessionStarted) {
        }
        
    }
    firstUpdated() {
        this.setupCanvasAndThree()
    }

    render() {
        return html`
            <header>
                <h2>Canvas version</h2>
            </header>
            <article>
                <div class="menu">
                    <div class="menu-item">
                        <label for="req">Flicker</label>
                        <frequency-selector></frequency-selector>
                    </div>
                    <div class="menu-item">
                        <label for="color">Light color</label>
                        <color-picker></color-picker>
                    </div>
                </div>
                <canvas ${ref(this.canvasRef)}></canvas>
            </article>
        `
    }
}

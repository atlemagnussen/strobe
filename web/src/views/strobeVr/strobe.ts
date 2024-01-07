import { LitElement, css, html } from "lit"
import { customElement, state } from "lit/decorators.js"
import { ref } from "lit/directives/ref.js"
import { ThreeWorldRenderer } from "./strobe.three"
import { Subscription } from "rxjs"
import { isImmersiveVrSupported, startSession, endSession } from "@app/services/webXrService"

@customElement('strobe-vr')
export class StrobeVr extends LitElement {
    static styles = css`
        :host {
            overflow: hidden;
            height: 100%;
            display: flex;
            flex-direction: column;
            padding: 0;
        }
        canvas {
            background-color: #444;
        }
    `
    canvasEl: HTMLCanvasElement | undefined
    threeRenderer : ThreeWorldRenderer | null = null
    
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
        this.sub = isImmersiveVrSupported.subscribe(state => {
            const sessionStarted = state.sessionStarted!!

            if (this.isSessionStarted && !sessionStarted) {
                // session ended
                this.threeRenderer?.endAnimation()
            }

            this.isEnabled = state.enabled
            this.isSessionStarted = sessionStarted
        })
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
        this.threeRenderer = new ThreeWorldRenderer(canvasEl as HTMLCanvasElement, this.clientWidth, this.clientHeight, this.selectedHz)
    }
    
    resizeCanvas() {
        if (this.canvasEl) {
            this.canvasEl.width = this.clientWidth
            this.canvasEl.height = this.clientHeight
        }
        if (this.threeRenderer)
            this.threeRenderer.onWindowResize(this.clientWidth, this.clientHeight)
    }

    async vrButtonClicked() {
        if (!this.isEnabled)
            return

        if (this.isSessionStarted) {
            endSession()
            this.threeRenderer?.endAnimation()
            // if (this.canvasEl)
            //     this.threeRenderer = new ThreeWorldRenderer(this.canvasEl, this.clientWidth, this.clientHeight, this.selectedHz)
        }
        else {
            const session = await startSession("immersive-vr")
            if (session)
                this.threeRenderer?.start(session)
        }
    }

    radioChanged(e: any) {
        
        const target = e.target as HTMLInputElement
        if (target.value) {
            this.selectedHz = parseFloat(target.value)
            console.log(this.selectedHz)
        }
    }

    render() {
        return html`
            <div>
                <input type="radio" id="schuman" value="7.83" .checked=${this.selectedHz == 7.83} @change=${this.radioChanged}>
                <label for="schuman">7.83Hz</label>
                <input type="radio" id="ten" value="10" .checked=${this.selectedHz == 10} @change=${this.radioChanged}>
                <label for="ten">10Hz</label>
            </div>
            <xr-button @click=${this.vrButtonClicked}></xr-button>
            <canvas ${ref((cel) => this.setupCanvas(cel))}></canvas>
        `
    }
}

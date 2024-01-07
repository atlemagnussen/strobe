import { LitElement, css, html } from "lit"
import { customElement, state } from "lit/decorators.js"
import { createRef, ref } from "lit/directives/ref.js"
import { StrobeThree } from "./strobe.three"
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
    canvasRef = createRef<HTMLCanvasElement>()
    threeRenderer : StrobeThree | null = null
    
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
                if (this.canvasRef.value)
                    this.threeRenderer = new StrobeThree(this.canvasRef.value, this.clientWidth, this.clientHeight, this.selectedHz)
            }

            this.isEnabled = state.enabled
            this.isSessionStarted = sessionStarted
        })
    }
    disconnectedCallback(): void {
        super.disconnectedCallback()
        window.removeEventListener("resize", () => this.resizeCanvas())
    }
    
    setupCanvasAndThree() {
        if (!this.canvasRef.value)
            return
        
        this.resizeCanvas()
        this.threeRenderer = new StrobeThree(this.canvasRef.value, this.clientWidth, this.clientHeight, this.selectedHz)
    }
    
    resizeCanvas() {
        if (this.canvasRef.value) {
            const canvasEl = this.canvasRef.value
            canvasEl.width = this.clientWidth
            canvasEl.height = this.clientHeight
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
        }
        else {
            const session = await startSession("immersive-vr")
            if (session)
                this.threeRenderer?.start(session)
        }
    }

    freqChanged(e: any) {
        const target = e.target as HTMLInputElement
        if (target.value) {
            this.selectedHz = parseFloat(target.value)
            this.threeRenderer?.setFlickerHz(this.selectedHz)
        }
    }
    colorChanged(e: any) {
        const target = e.target as HTMLInputElement
        if (target.value) {
            this.threeRenderer?.setLightColor(target.value)
        }
    }
    firstUpdated() {
        this.setupCanvasAndThree()
    }

    frequencies = [6, 7.83, 10, 20, 30, 40]
    render() {
        return html`
            <div>
                <label for="req">Flicker</label>
                <select id="req" @change=${this.freqChanged}>
                    ${this.frequencies.map(f => {
                        return html`<option value="${f}">${f}Hz</option>`
                    })}
                </select>
                <label for="color">Light color</label>
                <input id="color" type="color" value="#aaaaaa" @input=${this.colorChanged}>
            </div>
            <xr-button @click=${this.vrButtonClicked}></xr-button>
            <canvas ${ref(this.canvasRef)}></canvas>
        `
    }
}

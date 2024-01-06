import { LitElement, css, html } from "lit"
import { customElement } from "lit/decorators.js"
import { ref } from "lit/directives/ref.js"
import { ThreeWorldRenderer } from "./world.three"
import { Subscription } from "rxjs"
import { isImmersiveVrSupported, startSession, endSession } from "@app/services/webXrService"

@customElement('strobe-world')
export class StrobeWorld extends LitElement {
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

    connectedCallback(): void {
        super.connectedCallback()
        window.addEventListener("resize", () => this.resizeCanvas())
        this.sub = isImmersiveVrSupported.subscribe(state => {
            this.isEnabled = state.enabled
            this.isSessionStarted = state.sessionStarted!!
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
        this.threeRenderer = new ThreeWorldRenderer(canvasEl as HTMLCanvasElement, this.clientWidth, this.clientHeight)
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

        if (this.isSessionStarted)
            endSession()
        else {
            const session = await startSession()
            if (session)
                this.threeRenderer?.startSession(session)
        }
        
    }
    render() {
        return html`
            <vr-button @click=${this.vrButtonClicked}></vr-button>
            <canvas ${ref((cel) => this.setupCanvas(cel))}></canvas>
        `
    }
}

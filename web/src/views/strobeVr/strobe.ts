import { LitElement, css, html } from "lit"
import { customElement, state } from "lit/decorators.js"
import { createRef, ref } from "lit/directives/ref.js"
import { StrobeThree } from "./strobe.three"
import { Subscription } from "rxjs"
import { isImmersiveVrSupported, startSession, endSession } from "@app/services/webXrService"
import { config } from "@app/stores/configStore"

@customElement('strobe-vr')
export class StrobeVr extends LitElement {
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
            width: 100%;
            max-width: 100%;
            padding: 0 1rem;
            display: flex;
            flex-direction: column;
            gap: 2vw;
        }
        .menu-item {
            display: flex;
            flex-direction: row;
            width: 100%;
            max-width: 100%;
        }
        .menu-item * {
            flex: 50% 0 0;
        }
        
    `
    canvasRef = createRef<HTMLCanvasElement>()
    threeRenderer : StrobeThree | null = null
    
    constructor() {
        super()
    }

    subs: Subscription[] = []
    isEnabled = false
    isSessionStarted = false

    @state()
    selectedHz = 7.83
    
    connectedCallback(): void {
        super.connectedCallback()
        window.addEventListener("resize", () => this.resizeCanvas())
        this.subs.push(isImmersiveVrSupported.subscribe(state => {
            const sessionStarted = state.sessionStarted!!

            if (this.isSessionStarted && !sessionStarted) {
                // session ended
                this.threeRenderer?.endAnimation()
                if (this.canvasRef.value)
                    this.threeRenderer = new StrobeThree(this.canvasRef.value, this.clientWidth, this.clientHeight, this.selectedHz)
            }

            this.isEnabled = state.enabled
            this.isSessionStarted = sessionStarted
        }))

        this.subs.push(config.subscribe(c => {
            this.threeRenderer?.setFlickerHz(c.flickerHz)
            this.threeRenderer?.setLightColor(c.lightColor)
        }))
    }
    disconnectedCallback(): void {
        super.disconnectedCallback()
        window.removeEventListener("resize", () => this.resizeCanvas())
        this.subs.map(s => s.unsubscribe())
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

    firstUpdated() {
        this.setupCanvasAndThree()
    }

    render() {
        return html`
            <header>
                <h2>VR version</h2>
            </header>
            <article>
                <div class="menu">
                    <div class="menu-item">
                        <label for="req">Flicker Hz</label>
                        <frequency-selector></frequency-selector>
                    </div>
                    <div class="menu-item">
                        <label for="color">Light color</label>
                        <color-picker></color-picker>
                    </div>
                </div>
                <xr-button @click=${this.vrButtonClicked}></xr-button>
                <canvas ${ref(this.canvasRef)}></canvas>
            </article>
        `
    }
}

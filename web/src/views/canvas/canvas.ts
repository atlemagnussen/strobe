import { LitElement, css, html } from "lit"
import { customElement, state } from "lit/decorators.js"
import { createRef, ref } from "lit/directives/ref.js"
import { Subscription } from "rxjs"
import { startPresentation } from "@app/services/presentation.js"
import { CanvasRenderer } from "./canvasRenderer.js"
import { config } from "@app/stores/configStore.js"

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
        canvas.fullscreen {
            position: absolute;
            top: 0;
            left: 0;
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
        button {
            z-index: 10;
        }
    `
    canvasRef = createRef<HTMLCanvasElement>()
    renderer: CanvasRenderer | undefined
    
    constructor() {
        super()
    }

    started = false
    sub: Subscription | undefined
    
    isSessionStarted = false

    @state()
    selectedHz = 7.83
    
    connectedCallback() {
        super.connectedCallback()
        this.sub = config.subscribe(c => {
            this.renderer?.setFlickerHz(c.flickerHz)
            this.renderer?.setLightColor(c.lightColor)
        })
    }
    disconnectedCallback(): void {
        super.disconnectedCallback()
        if (this.sub)
            this.sub.unsubscribe()
    }
    setupCanvas() {
        if (!this.canvasRef.value)
            return
        
        this.renderer = new CanvasRenderer(this.canvasRef.value, this.clientWidth, this.clientHeight)

        this.renderer.setSize(this.clientWidth, this.clientHeight)
    }

    btnClicked() {
        if (!this.renderer)
            return
        if (!this.started) {
            this.canvasRef.value?.classList.add("fullscreen")
            this.renderer.setFullScreen()
            this.renderer.start()
            this.started = true
        }
        else {
            this.started = false
            this.canvasRef.value?.classList.remove("fullscreen")
            this.renderer.setSize(this.clientWidth, this.clientHeight)
            this.renderer.stop()
        }
    }
    firstUpdated() {
        this.setupCanvas()
    }

    present() {
        console.log("present")
        startPresentation()
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
                    <div class="menu-item">
                        <strobe-button type="button" 
                            @click=${this.btnClicked}>Toggle</strobe-button>
                    </div>
                    <div>
                        <strobe-button @click=${this.present}>Cast</strobe-button>
                    </div>
                </div>
                <canvas ${ref(this.canvasRef)}></canvas>
            </article>
        `
    }
}

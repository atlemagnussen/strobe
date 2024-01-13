import { LitElement, css, html, nothing } from "lit"
import { customElement, state } from "lit/decorators.js"
import { createRef, ref } from "lit/directives/ref.js"
import { Subscription } from "rxjs"
import { startPresentation, presentationReady } from "@app/services/presentation.js"
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
    subs: Subscription[] = []
    
    isSessionStarted = false

    @state()
    isReadyToCast = false

    @state()
    selectedHz = 7.83

    @state()
    connectionActive = false

    connection: PresentationConnection | undefined

    sendToggle() {
        if (this.connection)
            this.connection.send("toggle")
    }
    
    connectedCallback() {
        super.connectedCallback()
        this.subs.push(config.subscribe(c => {
            if (this.connectionActive && this.connection) {
                this.connection.send(JSON.stringify(c))
            } else {
                this.renderer?.setFlickerHz(c.flickerHz)
                this.renderer?.setLightColor(c.lightColor)
            }
        }))

        this.subs.push(presentationReady.subscribe(isReadyToCast => {
            this.isReadyToCast = isReadyToCast
        }))
    }
    disconnectedCallback(): void {
        super.disconnectedCallback()
        this.subs.map(s => s.unsubscribe())
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

    async present() {
        console.log("isReadyToCast", this.isReadyToCast)

        if (this.connectionActive && this.connection) {
            this.connection.close()
            this.connectionActive = false
        }
        else if (this.isReadyToCast) {
            this.connection = await startPresentation()
            this.connectionActive = true
        }
    }
    render() {

        let castingBtnTxt = "Not ready to cast"
        if (this.connectionActive)
            castingBtnTxt = "Casting"
        else if (this.isReadyToCast)
            castingBtnTxt = "Cast"

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
                        <strobe-button @click=${this.present}>
                            ${castingBtnTxt}
                        </strobe-button>
                        ${this.connectionActive ? html`
                        <strobe-button @click=${this.sendToggle}>
                            Toggle flicker
                        </strobe-button>
                        `: nothing}
                    </div>
                </div>
                <canvas ${ref(this.canvasRef)}></canvas>
            </article>
        `
    }
}

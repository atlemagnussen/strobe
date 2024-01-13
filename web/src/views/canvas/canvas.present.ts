import { LitElement, css, html } from "lit"
import { customElement, state } from "lit/decorators.js"
import { createRef, ref } from "lit/directives/ref.js"
import { CanvasRenderer } from "./canvasRenderer.js"

import { presenterMsg, initiatePresenter } from "@app/services/presenter.js"
import { Subscription } from "rxjs"
import { ConfigStore } from "@app/stores/configStore.js"

@customElement('canvas-present')
export class CanvasPresent extends LitElement {
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
            z-index: 10;
            top: 0;
            left: 0;
        }
        
    `
    canvasRef = createRef<HTMLCanvasElement>()
    renderer: CanvasRenderer | undefined
    
    sub: Subscription | undefined

    constructor() {
        super()
    }

    connectedCallback() {
        super.connectedCallback()
        this.sub = presenterMsg.subscribe(msg => {
            if (msg === "toggle")
                this.toggle()

            try {
                let config = JSON.parse(msg) as ConfigStore
                if (config && this.renderer) {
                    if (config.flickerHz)
                        this.renderer.setFlickerHz(config.flickerHz)
                    
                    if (config.lightColor)
                        this.renderer.setLightColor(config.lightColor)
                }
            }
            catch(e) {
                console.log(e)
            }
        })
        initiatePresenter()
    }
    disconnectedCallback() {
        super.disconnectedCallback()
        if (this.sub)
            this.sub.unsubscribe()
    }

    started = false
    
    isSessionStarted = false

    @state()
    selectedHz = 7.83
    
    setupCanvas() {
        if (!this.canvasRef.value)
            return
        
        this.renderer = new CanvasRenderer(this.canvasRef.value, this.clientWidth, this.clientHeight)
    }

    toggle() {
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

    render() {
        return html`
            <p>Presentation mode</p>
            <canvas ${ref(this.canvasRef)}></canvas>
        `
    }
}

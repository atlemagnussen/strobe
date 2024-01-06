import { LitElement, css, html } from "lit"
import { customElement, state } from "lit/decorators.js"
import { isImmersiveVrSupported } from "@app/services/webXrService"
import { Subscription } from "rxjs"

@customElement('vr-button')
export class VrButton extends LitElement {
    static styles = css`
        :host {
            display: inline-flex;
            position: absolute;
            bottom: 20px;
            z-index: 999;
            cursor: pointer;
            left: calc(50% - 50px);
        }
        button {
            padding: 12px 6px;
            border: 1px solid rgb(255, 255, 255);
            border-radius: 4px;
            background: rgba(0, 0, 0, 0.1);
            color: rgb(255, 255, 255);
            font: 13px sans-serif;
            text-align: center;
            opacity: 0.5;
            outline: none;
            width: 100px;
            cursor: pointer;
        }
        button:hover {
            opacity: 1;
        }
        a {
            left: calc(50% - 90px);
            width: 180px;
        }
    `

    @state()
    isImmersiveVrEnabled = false

    @state()
    isSessionStarted = false

    @state()
    message = ""

    @state()
    httpsLink = ""

    sub: Subscription | undefined

    connectedCallback(): void {
        super.connectedCallback()
        this.sub = isImmersiveVrSupported.subscribe(state => {
            this.isImmersiveVrEnabled = state.enabled
            this.message = state.message
            this.isSessionStarted = state.sessionStarted!!
        })
        // this.addEventListener("click", (e) => this.buttonEventListener(e))
    }
    disconnectedCallback(): void {
        super.disconnectedCallback()
        if (this.sub)
            this.sub.unsubscribe()
    }
    // buttonEventListener(e: MouseEvent) {
    //     console.log(e)
    //     if (!this.isImmersiveVrEnabled) {
    //         e.preventDefault()
    //         e.stopPropagation()
    //     }
    // }
    
    render() {

        const isHttps = window.isSecureContext
        if (!this.isImmersiveVrEnabled || !isHttps) {
            return isHttps ? html`
                <a href="https://immersiveweb.dev/">${this.message}</a>
            ` : html`
                <a href="${document.location.href.replace(/^http:/, "https:")}">WEBXR needs HTTPS</a>
            `
        }
        return this.isSessionStarted ? html`
            <!-- <button id="VRButton">EXIT VR</button> -->
        ` : html`
            <button id="VRButton">ENTER VR</button>
        `
    }
}

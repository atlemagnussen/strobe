import { LitElement, css, html } from "lit"
import { customElement } from "lit/decorators.js"

import "./vars.css"
import "./site.css"

import "./views/strobeVr/strobe"
import "./components/xrButton"

@customElement('strobe-app')
export class StrobeApp extends LitElement {
    static styles = css`
        :host {
            overflow: hidden;
            height: 100%;
            display: flex;
            flex-direction: column;
            padding: 0;
            margin: 0;
        }
        p {
            padding: 0 1rem;
        }
        a {
            color: white;
        }
    `

    render() {
        return html`
            <p>Dreamachine stroboscopic flickering</p>
            <strobe-vr></strobe-vr>
        `
    }
}

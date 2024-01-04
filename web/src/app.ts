import { LitElement, css, html } from "lit"
import { customElement, state } from "lit/decorators.js"

import "./vars.css"
import "./site.css"

import "./views/world"

@customElement('strobe-app')
export class StrobeApp extends LitElement {
    static styles = css`
        :host {
            overflow: hidden;
            height: 100%;
            display: flex;
            flex-direction: column;
            padding: 1rem;
        }
    `

    @state()
    world = "world"

    
    render() {
        return html`
            <p>Hello ${this.world}</p>
            <strobe-world></strobe-world>
        `
    }
}

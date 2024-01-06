import { LitElement, css, html } from "lit"
import { customElement, state } from "lit/decorators.js"

import "./vars.css"
import "./site.css"

import "./views/world"
import "./components/vrButton"

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

    @state()
    world = "world"

    
    render() {
        return html`
            <p><a href="/test.html">Test</a></p>
            <strobe-world></strobe-world>
        `
    }
}

import { LitElement, css, html } from "lit"
import { customElement } from "lit/decorators.js"
@customElement('about-view')
export class AboutView extends LitElement {
    static styles = css`
        :host {
            overflow: hidden;
            height: 100%;
            display: flex;
            flex-direction: column;
            padding: 0;
        }
    `
    
    render() {
        return html`
            <p>About</p>
        `
    }
}

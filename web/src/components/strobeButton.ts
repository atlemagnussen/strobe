import { LitElement, css, html } from "lit"
import { customElement } from "lit/decorators.js"

@customElement('strobe-button')
export class StrobeButton extends LitElement {
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
        
    `
    
    render() {
        return html`
            <button>
                <slot></slot>
            </button>
        `
    }
}

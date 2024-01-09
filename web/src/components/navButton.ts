import { LitElement, css, html } from "lit"
import { customElement, property } from "lit/decorators.js"
import { classMap } from "lit/directives/class-map.js"

@customElement('nav-button')
export class NavBtn extends LitElement {
    static styles = css`
        :host {
            display: block;
            --navbutton-color: var(--cyan);
        }
        button {
            background-color: transparent;
            border: none;
            cursor: pointer;
            display: inline-block;
            padding-right: 0;
            outline: none;
        }
        div {
            background-color: var(--navbutton-color);
            border-radius: 4px;
            height: 5px;
            margin: 6px 0;
            transition: 0.4s;
            width: 35px;
        }
        .change div:nth-child(1) {
            transform: rotate(-45deg) translate(-8px, 6px);
        }
        .change div:nth-child(2) {
            opacity: 0;
        }
        .change div:nth-child(3) {
            transform: rotate(45deg) translate(-9px, -8px);
        }
        .nav--show {
            transform: translateY(152px) !important;
        }
    `

    @property({type: Boolean})
    open = false

    reset() {
        this.open = false
    }

    render() {
        const classes = { change: this.open }
        return html`
            <button aria-label="Menu Button" class=${classMap(classes)}>
                <div></div>
                <div></div>
                <div></div>
            </button>
        `
    }
}
import { LitElement, css, html } from "lit"
import { customElement, property } from "lit/decorators.js"
import { createRef, ref } from "lit/directives/ref.js"

@customElement('navbar-btn')
export class NavbarBtn extends LitElement {
    static styles = css`
        :host {
            display: block;
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
            background-color: #333333;
            border-radius: 4px;
            height: 5px;
            margin: 6px 0;
            transition: 0.4s;
            width: 35px;
        }
        .change div:nth-child(1) {
            -webkit-transform: rotate(-45deg) translate(-8px, 6px);
            transform: rotate(-45deg) translate(-8px, 6px);
        }
        .change div:nth-child(2) {
            opacity: 0;
            }
        .change div:nth-child(3) {
            -webkit-transform: rotate(45deg) translate(-9px, -8px);
            transform: rotate(45deg) translate(-9px, -8px);
        }
        .nav--show {
            transform: translateY(152px) !important;
        }
        @media screen and (min-width: 36rem) {
            button {
                display: none;
            }
        }
    `

    @property({attribute: true, type: Number})
    breakpoint = 10

    btnRef = createRef<HTMLButtonElement>()

    connectedCallback() {
        super.connectedCallback()
        if (!this.shadowRoot)
            return

        window.addEventListener('resize', () => this.reset())
    }

    menuBtnClick() {
        if (this.btnRef.value)
            this.btnRef.value.classList.toggle('change')
    }

    disconnectedCallback() {
        super.disconnectedCallback()
        window.removeEventListener('resize', () => this.reset())
    }

    reset() {
        if (!this.btnRef.value)
            return

        if (window.innerWidth > this.breakpoint && this.btnRef.value.classList.contains('change')) {
            this.btnRef.value.classList.remove('change')
        }
    }

    render() {
        return html`
            <button aria-label="Menu Button" @click=${this.menuBtnClick} ${ref(this.btnRef)}>
                <div></div>
                <div></div>
                <div></div>
            </button>
        `
    }
}
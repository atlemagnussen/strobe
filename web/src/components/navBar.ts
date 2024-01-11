import { LitElement, css, html, unsafeCSS } from "lit"
import { customElement, property, query, queryAll, state } from "lit/decorators.js"
import { classMap } from "lit/directives/class-map.js"
import "./navButton"

@customElement('navigation-bar')
export class Navbar extends LitElement {
    static styles = css`
        :host {
            display: block;
        }
        header {
            display: flex;
            flex-direction: row;
            min-height: 48px;
            max-height: 100px;
            justify-content: space-between;
            width: 100%;
            z-index: 99;
        }
        header div {
            align-items: center;
            background-color: var(--navbar-bg-color);
            display: flex;
            justify-content: space-between;
            padding: 0 1rem;
            width: 100%;
            z-index: 99;
            position: relative;
        }
        header nav-button {
            display: none;
        }
        nav {
            background-color: var(--navbar-menu-color);
            border-bottom: 1px solid rgba(51, 51, 51, 0.1);
            box-shadow: var(--navbar-shadow);
            display: flex;
            flex-direction: row;
            justify-content: end;
            padding: 0.7rem;
            width: 100%;
        }
        ::slotted(a) {
            color: var(--navbar-link-color);
            padding: 0.5rem 0 0.5rem 1rem;
            text-decoration: none;
        }
        ::slotted(a:hover) {
            color: var(--navbar-link-hover-color);
        }
        .logo::slotted(a) {
            color: #333333;
            font-family: 'Dosis', Arial, Helvetica, sans-serif;
            font-size: 2em;
            max-height: 100px;
            padding: 0;
            text-decoration: none;
        }
        .animate {
            transition: all 1s ease-in-out;
        }
        ::slotted(.nav-link--active) {
            color: var(--navbar-link-active-color);
        }
    `

    @property({attribute: true, type: Number})
    breakpoint = 576

    @property({attribute: true})
    active = ""

    @query("header")
    headerEl!: HTMLDivElement

    @query("nav")
    navEl!: HTMLDivElement

    @queryAll("nav a")
    links!: NodeListOf<HTMLAnchorElement>

    distance = 0

    @state()
    menuOpen = false

    connectedCallback() {
        super.connectedCallback()
    }

    firstUpdated() {

        this.distance = this.navEl.offsetHeight - 32

        this.checkIfMobile()

        this.createStyle(this.headerEl.offsetHeight)

        this.setActiveLink(this.links, this.active)
    }

    navBtnClick() {
        this.menuOpen = !this.menuOpen
    }

    closeNav() {
        this.menuOpen = false
    }

    setActiveLink(elements: NodeListOf<HTMLAnchorElement>, attr: string) {
        elements.forEach((link) => {
            if (link.innerHTML.toLowerCase() === attr.toLowerCase()) {
                link.classList.add('nav-link--active')
            }
        })
    }

    createStyle(distance: number) {
        const styles = `.show { transform: translateY(${distance}px); }`;
        const styleEl = this.shadowRoot?.querySelector('style')
        if (styleEl)
            styleEl.append(styles)
    }

    calTransDistance(nav: HTMLDivElement) {
        return nav.offsetHeight
    }

    isMobile = false // not really sure why I needed this
    checkIfMobile() {
        this.isMobile = window.innerWidth < this.breakpoint
    }

    render() {
        const styles = css`
            @media screen and (max-width: ${this.breakpoint}px) {
                header div nav-button {
                    display: block;
                }
                
                header nav {
                    align-items: center;
                    flex-direction: column;
                    justify-content: flex-end;
                    padding: 0 1rem 0 0;
                    position: absolute;
                    top: -200px;
                    right: 0;
                    z-index: 100;
                    width: 150px;
                    background: var(--primary-background);
                    border-radius: 4px;
                }

                header nav ::slotted(a) {
                    padding: 1rem 0;
                }
                header nav.show {
                    top: 0;
                    padding: 0.3rem;
                }
            }
        `

        const classes = { show: this.menuOpen}

        return html`
            <style>
                ${unsafeCSS(styles)}
            </style>

            <header>
                <div>
                    <slot name="brand" class="logo"></slot>
                    <nav-button .open=${this.menuOpen} @click=${this.navBtnClick}></nav-button>
                </div>
                <nav class=${classMap(classes)} @click=${this.closeNav}>
                    <slot></slot>
                </nav>
            </header>
        `
    }
}

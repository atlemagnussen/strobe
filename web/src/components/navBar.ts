import { LitElement, css, html, unsafeCSS } from "lit"
import { customElement, property, state } from "lit/decorators.js"
import { createRef, ref } from "lit/directives/ref.js"
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

    headerRef = createRef<HTMLDivElement>()
    navRef = createRef<HTMLDivElement>()

    distance = 0

    @state()
    menuOpen = false

    connectedCallback() {
        super.connectedCallback()
        
        window.addEventListener('resize', () => { this.checkIfMobile() })
    }

    firstUpdated() {
        const links = document.querySelectorAll('navigation-bar a') as NodeListOf<HTMLAnchorElement>
        
        if (!this.navRef.value)
            return

        const nav = this.navRef.value
        this.distance = nav.offsetHeight - 32

        this.checkIfMobile()

        if (!this.headerRef.value)
            return

        const header = this.headerRef.value
        this.createStyle(header.offsetHeight)

        this.setActiveLink(links, this.active)
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

    isMobile = false
    checkIfMobile() {
        this.isMobile = window.innerWidth < this.breakpoint

        // if (isMobile) {
        //     nav.style.transform = `translateY(-${this.distance}px)`
        //     setTimeout(() => {
        //         nav.classList.add('animate')
        //     }, 1)
        // } else {
        //     nav.classList.remove('animate')
        // }
    }

    render() {
        const styles = css`
            @media screen and (max-width: 640px) {
                header div nav-button {
                    display: block;
                }
                /* header {
                    box-shadow: var(--navbar-shadow);
                    overflow: hidden;
                }
                header div {
                    border-bottom: none;
                } */
                header nav {
                    align-items: center;
                    flex-direction: column;
                    justify-content: flex-end;
                    padding: 0 1rem 0 0;
                    position: absolute;
                    top: -100px;
                    right: 0;
                    z-index: 100;
                    width: 200px;
                    background: var(--primary-background);
                    border-radius: 4px;
                }

                header nav.show {
                    top: 0;
                }
                /* header nav a {
                    padding: 0 1rem;
                } */
            }
        `

        const classes = { show: this.menuOpen}

        return html`
            <style>
                ${unsafeCSS(styles)}
            </style>

            <header ${ref(this.headerRef)}>
                <div>
                    <slot name="brand" class="logo"></slot>
                    <nav-button .open=${this.menuOpen} @click=${this.navBtnClick}></nav-button>
                </div>
                <nav ${ref(this.navRef)} class=${classMap(classes)} @click=${this.closeNav}>
                    <slot></slot>
                </nav>
            </header>
        `
    }
}

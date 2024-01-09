import { LitElement, css, html } from "lit"
import { customElement } from "lit/decorators.js"
@customElement('home-view')
export class HomeView extends LitElement {
    static styles = css`
        :host {
            overflow: hidden;
            height: 100%;
            display: flex;
            flex-direction: column;
            padding: 0;
        }
        article {
            padding: 1rem;
        }
        a {
            color: var(--cyan);
        }
    `
    
    render() {
        return html`
            <article>
                <header>
                    <h1>Stroboscopic Light aka Dreamachine</h1>
                </header>

                <section>
                    <h2>Welcome</h2>

                    <p>
                        <a href="xr">Try the Virtual Reality version for glasses</a>
                    </p>

                    <p>
                        <a href="canvas">Try the Canvas version for screens</a>
                    </p>
                </section>
            </article>
        `
    }
}

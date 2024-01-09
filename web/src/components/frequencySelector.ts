

import { LitElement, css, html } from "lit"
import { customElement, state } from "lit/decorators.js"
import { Subscription } from "rxjs"
import { config, setFlickerHz } from "@app/stores/configStore"

@customElement('frequency-selector')
export class FreqSelector extends LitElement {
    static styles = css`
        :host {
            display: flex;
            flex-direction: row;
            gap: 2%;
            width: 100%;
            max-width: 100%;
        }
        * {
            box-sizing: border-box;
        }
        select {
            flex: 1;
        }
        input {
            width: 0;
            flex: 1;
            font-size: 1.4rem;
            color: var(--ln-blue);
            border: none;
            outline: 1px solid var(--ln-blue);
            border-radius: 1px;
        }
        select {
            font-size: 1.3rem;
        }
    `

    sub: Subscription | undefined

    @state()
    selectedHz = 7.83
    
    connectedCallback(): void {
        super.connectedCallback()
        this.sub = config.subscribe(c => {
            this.selectedHz = c.flickerHz
        })
    }
    disconnectedCallback(): void {
        super.disconnectedCallback()
        if (this.sub)
            this.sub.unsubscribe()
    }
    
    frequencies = [6, 7.83, 10, 20, 30, 40]

    freqChanged(e: any) {
        const target = e.target as HTMLInputElement
        if (target.value) {
            this.selectedHz = parseFloat(target.value)
            setFlickerHz(this.selectedHz)
        }
    }
    render() {
        return html`
            <input type="number" value="${this.selectedHz}" @input=${this.freqChanged}>
            <select id="req" @change=${this.freqChanged}>
                ${this.frequencies.map(f => {
                    return html`<option value="${f}" .selected=${this.selectedHz == f}>${f}Hz</option>`
                })}
            </select>
        `
    }
}
                
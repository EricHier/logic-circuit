import { html } from 'lit';
import Gate from './gate.js';
import { customElement } from 'lit/decorators.js';

/**
 * Input Gate
 * 
 * Represents an input source in a logic circuit that can be toggled by the user.
 * Provides a controllable signal source with true/false states.
 * 
 * @element input-gate
 * @summary User-controllable input source for logic circuits
 * @description Input gates serve as signal sources in logic circuits. Features:
 * - Clickable interface to toggle between true/false states
 * - Visual indication of current state
 * - Single output connector
 * - No input connectors (it's a source)
 * 
 * The input value can be changed by clicking on the gate's display area.
 * The current state is visually represented and propagated to connected gates.
 * 
 * @fires output-changed - When the input value is toggled
 * 
 * @example
 * ```html
 * <input-gate></input-gate>
 * ```
 * 
 * @slot - No slots are used by this component
 * 
 * @csspart gate - The main gate container
 * @csspart gate-text - The "Input" label text
 * @csspart gate-pointer - The clickable state indicator
 * 
 * @cssprop --input-gate-color - Background color of the gate (default: #ffffff)
 * @cssprop --input-gate-text-color - Color of the gate text (default: #000000)
 * @cssprop --input-gate-active-color - Color when input is true (default: #00ff00)
 */
export default class Input extends Gate {
    constructor() {
        super();
        this.gatetype = 'INPUT';
        this.output = false;
    }

    /**
     * Toggle the input state between true and false
     * @public
     */
    changeInput() {
        this.output = !this.output;
    }

    /**
     * Calculate the output based on the input1 property
     * For input gates, the output equals the manually set input value
     * @protected
     */
    calculateOutput() {
        this.output = this.input1;
    }

    render() {
        return html`
            <div class="gate" draggable="true" id="${this.id}" tabindex="-1">
                <p class="gateText">Input</p>
                <svg width="100%" height="100%" viewBox="0 0 500 200" xmlns="http://www.w3.org/2000/svg"></svg>
                <slot name="con3"></slot>
                <div class="gatepointer" @click=${this.changeInput1}>${this.output}</div>
            </div>
            <sl-menu class="contextMenuGates" id="contextMenu" style="display: none;">
                <sl-menu-item @click="${() => this.deleteGate()}">Delete</sl-menu-item>
            </sl-menu>
        `;
    }
}

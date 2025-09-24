import { html } from 'lit';
import Gate from './gate.js';
import { customElement } from 'lit/decorators.js';

/**
 * Output Gate
 * 
 * Represents an output display in a logic circuit that shows the final result.
 * Displays the state of signals reaching the end of the circuit.
 * 
 * @element output-gate
 * @summary Display endpoint for logic circuit results
 * @description Output gates serve as display endpoints in logic circuits. Features:
 * - Single input connector
 * - Visual display of the input signal state (true/false)
 * - No output connectors (it's a sink)
 * - Automatic state updates based on connected signals
 * 
 * The output state automatically reflects the value of the connected input signal.
 * Visual indicators show whether the final result is true or false.
 * 
 * @fires state-changed - When the displayed output value changes
 * 
 * @example
 * ```html
 * <output-gate></output-gate>
 * ```
 * 
 * @slot - No slots are used by this component
 * 
 * @csspart gate - The main gate container
 * @csspart gate-text - The "Output" label text
 * @csspart gate-pointer - The state display indicator
 * 
 * @cssprop --output-gate-color - Background color of the gate (default: #ffffff)
 * @cssprop --output-gate-text-color - Color of the gate text (default: #000000)
 * @cssprop --output-gate-active-color - Color when output is true (default: #ff0000)
 */
export default class Output extends Gate {
    constructor() {
        super();
        this.gatetype = 'OUTPUT';
    }

    /**
     * Calculate the output value based on the input signal
     * For output gates, the output directly equals the input1 value
     * @protected
     */
    calculateOutput() {
        this.output = this.input1;
        this.requestUpdate();
    }

    render() {
        return html`
            <div class="gate" draggable="true" id="${this.id}" tabindex="-1">
                <p class="gateText">Output</p>
                <svg width="100%" height="100%" viewBox="0 0 500 200" xmlns="http://www.w3.org/2000/svg"></svg>
                <slot name="con1"></slot>
                <div class="gatepointer">${this.output}</div>
            </div>
            <sl-menu class="contextMenuGates" id="contextMenu" style="display: none;">
                <sl-menu-item @click="${() => this.deleteGate()}">Delete</sl-menu-item>
            </sl-menu>
        `;
    }
}

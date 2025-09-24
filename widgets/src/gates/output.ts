import { html } from 'lit';
import Gate from './gate.js';
import { customElement } from 'lit/decorators.js';

/**
 * Output component that displays the final results of logic circuit computations.
 * 
 * The Output component acts as a signal sink that shows the current state of signals
 * from connected logic gates. It provides visual feedback about circuit results and
 * is essential for observing circuit behavior during simulation.
 * 
 * ## Features
 * - **Signal Display**: Shows current input signal state (0 or 1)
 * - **Visual Feedback**: Displays the logical state clearly for observation
 * - **Circuit Endpoint**: Represents the final output of a logic circuit
 * - **No Output Terminals**: Only has input terminals (no output connections)
 * 
 * ## Usage
 * Output components are essential for:
 * - Observing circuit computation results
 * - Verifying circuit behavior against expected truth tables
 * - Creating circuit demonstrations and tutorials
 * - Testing and debugging complex logic circuits
 * - Building educational examples with clear result visualization
 * 
 * ## State Management
 * - Reflects input signal state directly
 * - Updates automatically when connected signal changes
 * - Provides immediate visual feedback during simulation
 * 
 * @element output-gate
 * @extends Gate
 * @since 1.0.0
 * @status stable
 */
export default class Output extends Gate {
    constructor() {
        super();
        this.gatetype = 'OUTPUT';
    }

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

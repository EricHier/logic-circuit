import { html } from 'lit';
import Gate from './gate.js';
import { customElement } from 'lit/decorators.js';

/**
 * Input component that provides user-controllable signal sources for logic circuits.
 * 
 * The Input component allows users to manually set signal values that can be fed
 * into other logic gates. It acts as a signal source with a toggleable state.
 * Users can click on the input to toggle between high (1/true) and low (0/false) states.
 * 
 * ## Features
 * - **Interactive Control**: Click to toggle between 0 and 1 states
 * - **Visual Feedback**: Displays current state value on the component
 * - **Signal Source**: Provides output signal to connected gates
 * - **No Input Terminals**: Only has an output terminal (no input connections)
 * 
 * ## Usage
 * Input components are essential for:
 * - Providing test signals to logic circuits
 * - Creating interactive circuit demonstrations
 * - Building circuit truth tables by varying input combinations
 * - Simulating real-world digital inputs like switches or sensors
 * 
 * ## State Management
 * - Default state: false (0/low)
 * - Toggle action: Click on the component to flip state
 * - Output propagation: Changes immediately affect connected gates
 * 
 * @element input-gate
 * @extends Gate
 * @since 1.0.0
 * @status stable
 */
export default class Input extends Gate {
    constructor() {
        super();
        this.gatetype = 'INPUT';
        this.output = false;
    }

    /**
     * Toggles the input state between high (true) and low (false).
     * This method is called when the user clicks on the input component.
     * 
     * @method
     * @public
     */
    changeInput() {
        this.output = !this.output;
    }

    /**
     * Calculates the output based on the current input state.
     * For input gates, the output directly reflects the user-set value.
     * 
     * @method
     * @override
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

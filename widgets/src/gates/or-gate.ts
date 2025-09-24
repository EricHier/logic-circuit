import { html } from 'lit';
import Gate from './gate.js';
import { customElement } from 'lit/decorators.js';

/**
 * OR Gate
 * 
 * Implements the logical OR operation with two inputs and one output.
 * Output is true when at least one input is true.
 * 
 * @element or-gate
 * @summary Two-input OR logic gate
 * @description OR gate with the following behavior:
 * - Two input connectors (input1, input2)
 * - One output connector
 * - Output = input1 OR input2
 * - Truth table: (0,0)→0, (0,1)→1, (1,0)→1, (1,1)→1
 * - Optional truth table display
 * - Context menu with flip functionality
 * 
 * The gate performs logical disjunction: output is true when either or both inputs are true.
 * 
 * @fires output-changed - When the gate's output value changes due to input changes
 * 
 * @example
 * ```html
 * <or-gate></or-gate>
 * ```
 * 
 * @slot con1 - First input connector slot
 * @slot con2 - Second input connector slot  
 * @slot con3 - Output connector slot
 * 
 * @csspart gate - The main gate container
 * @csspart gate-text - The "OR" label text
 * @csspart svg - The gate's SVG representation
 * 
 * @cssprop --or-gate-color - Background color of the gate (default: #ffffff)
 * @cssprop --or-gate-stroke-color - Color of the gate outline (default: #000000)
 */
export default class ORGate extends Gate {
    constructor() {
        super();
        this.gatetype = 'OR';
    }

    /**
     * Calculate the OR operation output
     * Output is true when either input1 or input2 (or both) are true
     * @protected
     */
    calculateOutput() {
        this.output = this.input1 || this.input2;
    }

    render() {
        const content = this.showTruthTable && this.movable ? this.renderTruthTable() : this.renderSVG();

        return html`
            <div class="gate" draggable="true" id="${this.id}" tabindex="-1">
                ${content}
                <p class="gateText">OR</p>

                <slot name="con1"></slot>
                <slot name="con2"></slot>
                <slot name="con3"></slot>
            </div>
            <sl-menu class="contextMenuGates" id="contextMenu" style="display: none;">
                <sl-menu-item id="flipCheckbox" type="checkbox" @click="${() => this.flipGate()}"
                    >Show Truthtable</sl-menu-item
                >
                <sl-menu-item @click="${() => this.deleteGate()}">Delete</sl-menu-item>
            </sl-menu>
        `;
    }

    truthTableHTML() {
        return html`
            <table>
                <tr>
                    <td>0</td>
                    <td>0</td>
                    <td class="vertical-line"></td>
                    <td>0</td>
                </tr>
                <tr>
                    <td>0</td>
                    <td>1</td>
                    <td class="vertical-line"></td>
                    <td>1</td>
                </tr>
                <tr>
                    <td>1</td>
                    <td>0</td>
                    <td class="vertical-line"></td>
                    <td>1</td>
                </tr>
                <tr>
                    <td>1</td>
                    <td>1</td>
                    <td class="vertical-line"></td>
                    <td>1</td>
                </tr>
            </table>
        `;
    }

    renderSVG() {
        const truthTable = this.truthTableHTML();

        return html`
            <sl-tooltip class="tooltip" placement="right" trigger="click">
                <div class="tooltipcontent" slot="content">
                    <table>
                        <tr>
                            <th>Input A</th>
                            <th>Input B</th>
                            <td class="vertical-line"></td>
                            <th>Output</th>
                        </tr>
                    </table>
                    ${truthTable}
                </div>
                ${this.movable
                    ? html``
                    : html`<sl-button class="tooltip-button" variant="text" size="small">i</sl-button>`}
            </sl-tooltip>

            <svg
                position="relative"
                width="100%"
                height="100%"
                viewBox="0 0 500 500"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    fill="#000000"
                    d="M116.6 407c40-45.9 60.4-98.4 60.4-151 0-52.6-20.4-105.1-60.4-151H192c34.1 0 81.9 34 119.3 71.4 18.7 18.6 35.1 37.9 46.6 53.3 5.8 7.6 10.4 14.4 13.4 19.4 1.4 2.5 2.5 4.7 3.2 6.1.1.4.2.5.2.8 0 .3-.1.5-.2.9-.6 1.4-1.7 3.5-3.2 6-3 5.1-7.5 11.8-13.2 19.5-11.3 15.4-27.5 34.6-46.1 53.2C274.8 373 227.1 407 192 407zM16 361v-18h122.2c-3 6.1-6.3 12.1-9.9 18zm374.5-96c.2-.3.4-.7.5-1 1.1-2.4 2-4.4 2-8 0-3.6-1-5.6-2-8-.1-.3-.3-.7-.5-1H496v18zM16 169v-18h112.3c3.6 5.9 6.9 11.9 9.9 18z"
                />
            </svg>
        `;
    }
}

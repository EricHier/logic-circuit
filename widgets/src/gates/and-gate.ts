import { html } from 'lit';
import Gate from './gate.js';
import { customElement } from 'lit/decorators.js';

/**
 * AND Gate
 * 
 * Implements the logical AND operation with two inputs and one output.
 * Output is true only when both inputs are true.
 * 
 * @element and-gate
 * @summary Two-input AND logic gate
 * @description AND gate with the following behavior:
 * - Two input connectors (input1, input2)
 * - One output connector
 * - Output = input1 AND input2
 * - Truth table: (0,0)→0, (0,1)→0, (1,0)→0, (1,1)→1
 * - Optional truth table display
 * - Context menu with flip functionality
 * 
 * The gate performs logical conjunction: output is true only when both inputs are true.
 * 
 * @fires output-changed - When the gate's output value changes due to input changes
 * 
 * @example
 * ```html
 * <and-gate></and-gate>
 * ```
 * 
 * @slot con1 - First input connector slot
 * @slot con2 - Second input connector slot  
 * @slot con3 - Output connector slot
 * 
 * @csspart gate - The main gate container
 * @csspart gate-text - The "AND" label text
 * @csspart svg - The gate's SVG representation
 * 
 * @cssprop --and-gate-color - Background color of the gate (default: #ffffff)
 * @cssprop --and-gate-stroke-color - Color of the gate outline (default: #000000)
 */
export default class ANDGate extends Gate {
    constructor() {
        super();
        this.gatetype = 'AND';
    }

    /**
     * Calculate the AND operation output
     * Output is true only when both input1 and input2 are true
     * @protected
     */
    calculateOutput() {
        this.output = this.input1 && this.input2;
    }

    render() {
        const content = this.showTruthTable && this.movable ? this.renderTruthTable() : this.renderSVG();
        return html`
            <div class="gate" draggable="true" id="${this.id}" tabindex="-1">
                ${content}
                <p class="gateText">AND</p>

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
                    <td>0</td>
                </tr>
                <tr>
                    <td>1</td>
                    <td>0</td>
                    <td class="vertical-line"></td>
                    <td>0</td>
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
                    d="M105 105v302h151c148 0 148-302 0-302H105zm-89 46v18h71v-18H16zm368.8 96c.2 6 .2 12 0 18H496v-18H384.8zM16 343v18h71v-18H16z"
                />
            </svg>
        `;
    }
}

import { html } from 'lit';
import Gate from './gate.js';
import { customElement } from 'lit/decorators.js';

/**
 * NAND Gate
 * 
 * Implements the logical NAND (NOT AND) operation with two inputs and one output.
 * Output is false only when both inputs are true.
 * 
 * @element nand-gate
 * @summary Two-input NAND logic gate (NOT AND)
 * @description NAND gate with the following behavior:
 * - Two input connectors (input1, input2)
 * - One output connector
 * - Output = NOT(input1 AND input2)
 * - Truth table: (0,0)→1, (0,1)→1, (1,0)→1, (1,1)→0
 * - Universal gate (can implement any Boolean function)
 * 
 * @fires output-changed - When the gate's output value changes
 * 
 * @example
 * ```html
 * <nand-gate></nand-gate>
 * ```
 */
export default class NANDGate extends Gate {
    constructor() {
        super();
        this.gatetype = 'NAND';
    }

    /**
     * Calculate the NAND operation output
     * Output is the negation of (input1 AND input2)
     * @protected
     */
    calculateOutput() {
        this.output = !(this.input1 && this.input2);
    }

    render() {
        const content = this.showTruthTable && this.movable ? this.renderTruthTable() : this.renderSVG();

        return html`
            <div class="gate" draggable="true" id="${this.id}" tabindex="-1">
                ${content}
                <p class="gateText">NAND</p>

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
                    <td>1</td>
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
                    <td>0</td>
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
                    d="M105 105v302h151c148 0 148-302 0-302H105zm-89 46v18h71v-18H16zm400 82c-12.8 0-23 10.2-23 23s10.2 23 23 23 23-10.2 23-23-10.2-23-23-23zm40 14c.6 2.9 1 5.9 1 9 0 3.1-.4 6.1-1 9h40v-18h-40zM16 343v18h71v-18H16z"
                />
            </svg>
        `;
    }
}

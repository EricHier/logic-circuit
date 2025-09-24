import { html } from 'lit';
import Gate from './gate.js';
import { customElement } from 'lit/decorators.js';

/**
 * XNOR Gate
 * 
 * Implements the logical XNOR (exclusive NOR) operation with two inputs and one output.
 * Output is true when inputs are the same.
 * 
 * @element xnor-gate
 * @summary Two-input XNOR logic gate (exclusive NOR)
 * @description XNOR gate with the following behavior:
 * - Two input connectors (input1, input2)
 * - One output connector
 * - Output = input1 XNOR input2 (exclusive nor)
 * - Truth table: (0,0)→1, (0,1)→0, (1,0)→0, (1,1)→1
 * - Also known as equivalence gate
 * - Used for equality comparison
 * 
 * @fires output-changed - When the gate's output value changes
 * 
 * @example
 * ```html
 * <xnor-gate></xnor-gate>
 * ```
 */
export default class XNORGate extends Gate {
    constructor() {
        super();
        this.gatetype = 'XNOR';
    }

    /**
     * Calculate the XNOR operation output
     * Output is true when inputs are the same (exclusive nor)
     * @protected
     */
    calculateOutput() {
        this.output = this.input1 === this.input2;
    }

    render() {
        const content = this.showTruthTable && this.movable ? this.renderTruthTable() : this.renderSVG();

        return html`
            <div class="gate" draggable="true" id="${this.id}" tabindex="-1">
                ${content}
                <p class="gateText">XNOR</p>

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
                    d="M53.86 89.17L42.14 102.8c17.99 15.4 32.89 31.6 44.81 48.2H16v18h82.58C114.9 197.3 123 226.7 123 256c0 29.3-8.1 58.7-24.42 87H16v18h70.95c-11.92 16.6-26.82 32.8-44.81 48.2l11.72 13.6c22.59-19.4 40.85-40.1 54.74-61.8h19.7c3.6-5.9 6.9-11.9 9.9-18H119c14.6-28.2 22-57.5 22-87s-7.4-58.8-22-87h19.2c-3-6.1-6.3-12.1-9.9-18h-19.7c-13.88-21.7-32.15-42.5-54.74-61.83zM116.6 105c40 45.9 60.4 98.4 60.4 151 0 52.6-20.4 105.1-60.4 151H192c34.1 0 81.9-34 119.3-71.4 18.7-18.6 35.1-37.9 46.6-53.3 5.8-7.6 10.4-14.4 13.4-19.4 1.4-2.5 2.5-4.7 3.2-6.1.1-.4.2-.5.2-.8 0-.3-.1-.5-.2-.9-.6-1.4-1.7-3.5-3.2-6-3-5.1-7.5-11.8-13.2-19.5-11.3-15.4-27.5-34.6-46.1-53.2C274.8 139 227.1 105 192 105h-75.4zM416 233c-12.8 0-23 10.2-23 23s10.2 23 23 23 23-10.2 23-23-10.2-23-23-23zm40 14c.6 2.9 1 5.9 1 9 0 3.1-.4 6.1-1 9h40v-18h-40z"
                />
            </svg>
        `;
    }
}

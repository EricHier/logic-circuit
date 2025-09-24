import { html } from 'lit';
import Gate from './gate.js';
import { customElement } from 'lit/decorators.js';

/**
 * OR logic gate component that implements logical OR operation.
 * 
 * The OR gate outputs true (high) when at least one of its inputs is true (high).
 * It outputs false (low) only when both inputs are false (low).
 * 
 * ## Truth Table
 * | Input A | Input B | Output |
 * |---------|---------|--------|
 * |    0    |    0    |   0    |
 * |    0    |    1    |   1    |
 * |    1    |    0    |   1    |
 * |    1    |    1    |   1    |
 * 
 * ## Logical Operation
 * Output = Input A OR Input B
 * 
 * ## Usage
 * The OR gate is commonly used for:
 * - Alternative path logic where any condition can trigger an action
 * - Combining multiple enable signals
 * - Building multiplexers and decoders
 * - Error detection systems where any fault condition triggers an alarm
 * 
 * @element or-gate
 * @extends Gate
 * @since 1.0.0
 * @status stable
 */
export default class ORGate extends Gate {
    constructor() {
        super();
        this.gatetype = 'OR';
    }

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

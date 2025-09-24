import { html } from 'lit';
import Gate from './gate.js';
import { customElement } from 'lit/decorators.js';

/**
 * AND logic gate component that implements logical AND operation.
 * 
 * The AND gate outputs true (high) only when both inputs are true (high).
 * This is one of the fundamental logic gates used in digital circuits.
 * 
 * ## Truth Table
 * | Input A | Input B | Output |
 * |---------|---------|--------|
 * |    0    |    0    |   0    |
 * |    0    |    1    |   0    |
 * |    1    |    0    |   0    |
 * |    1    |    1    |   1    |
 * 
 * ## Logical Operation
 * Output = Input A AND Input B
 * 
 * ## Usage
 * The AND gate is commonly used for:
 * - Conditional logic where multiple conditions must be met
 * - Enabling signals only when all requirements are satisfied
 * - Building complex logic circuits like adders and comparators
 * 
 * ## Visual Representation
 * The gate uses the standard IEEE symbol for AND gates with a rounded right edge.
 * It has two input terminals on the left side and one output terminal on the right.
 * 
 * @element and-gate
 * @extends Gate
 * @since 1.0.0
 * @status stable
 */
export default class ANDGate extends Gate {
    constructor() {
        super();
        this.gatetype = 'AND';
    }

    /**
     * Calculates the AND gate output based on current input states.
     * Implements the logical AND operation: output is true only when both inputs are true.
     * 
     * @method
     * @override
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

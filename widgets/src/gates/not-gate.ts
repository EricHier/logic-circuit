import { html } from 'lit';
import Gate from './gate.js';
import { customElement } from 'lit/decorators.js';
import LukaswwLogicgates from '../../webwriter-logic-circuit.js';

/**
 * NOT logic gate component that implements logical negation (inverter).
 * 
 * The NOT gate outputs the inverse of its input signal. When the input is high (true),
 * the output is low (false), and vice versa. This is also known as an inverter gate.
 * 
 * ## Truth Table
 * | Input | Output |
 * |-------|--------|
 * |   0   |   1    |
 * |   1   |   0    |
 * 
 * ## Logical Operation
 * Output = NOT Input (or ¬Input)
 * 
 * ## Usage
 * The NOT gate is commonly used for:
 * - Signal inversion and polarity reversal
 * - Creating complementary signals
 * - Building other logic gates (NAND, NOR) when combined with AND/OR
 * - Implementing active-low logic
 * - Logic simplification in Boolean algebra
 * 
 * ## Visual Representation
 * The gate uses the standard IEEE symbol: a triangle (buffer) with a small circle
 * (inversion bubble) at the output. It has one input terminal and one output terminal.
 * 
 * @element not-gate
 * @extends Gate
 * @since 1.0.0
 * @status stable
 */
export default class NOTGate extends Gate {
    constructor() {
        super();
        this.gatetype = 'NOT';
    }

    /**
     * Calculates the NOT gate output based on current input state.
     * Implements logical negation: output is the inverse of the input.
     * 
     * @method
     * @override
     * @protected
     */
    calculateOutput() {
        this.output = !this.input1;
    }

    handleClick(event) {
        event.preventDefault();
    }

    render() {
        const content = this.showTruthTable && this.movable ? this.renderTruthTable() : this.renderSVG();
        return html`
            <div class="gate" draggable="true" id="${this.id}" tabindex="-1">
                ${content}
                <p class="gateText">NOT</p>

                <slot name="con1"></slot>
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
                    <td class="vertical-line"></td>
                    <td>1</td>
                </tr>
                <tr>
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
                    d="M105,111.3 V 400.7 L 365.5,256 Z M 16,247 v 18 h 71 v -18 z m 400,-14 c -12.8,0 -23,10.2 -23,23 0,12.8 10.2,23 23,23 12.8,0 23,-10.2 23,-23 0,-12.8 -10.2,-23 -23,-23 z m 40,14 c 0.6,2.9 1,5.9 1,9 0,3.1 -0.4,6.1 -1,9 h 40 v -18 z"
                />
            </svg>
        `;
    }

    renderTruthTable() {
        const truthTable = this.truthTableHTML();
        const rows = this.shadowRoot.querySelectorAll('tr');
        rows.forEach((row) => {
            row.querySelectorAll('td').forEach((td) => {
                td.classList.remove('highlight');
            });
        });
        const widget = document.querySelector('lukasww-logicgates') as LukaswwLogicgates;
        const highlightedRow = this.input1 ? 1 : 0;
        if (widget.simulate === true) {
            if (rows[highlightedRow]) {
                const row = rows[highlightedRow] as HTMLTableRowElement;
                row.querySelectorAll('td').forEach((td) => {
                    td.classList.add('highlight');
                });
            }
        }

        return html` <div class="flippedGate">${truthTable}</div> `;
    }
}

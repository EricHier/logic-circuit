import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { createLine } from './helper/line-helper.js';
import { Styles } from './styles.js';
import LogicCircuit from '../webwriter-logic-circuit.js';
import { localized, msg } from "@lit/localize";

/**
 * A connector element that represents input or output terminals on logic gates.
 * These are the connection points where signals flow between gates in the circuit.
 * 
 * Connectors handle the interactive connection creation process - users click on
 * connectors to start and end connections between gates. They also provide visual
 * feedback for signal states during simulation.
 * 
 * ## Connection Rules
 * - Output connectors (marked as 'output') can connect to input connectors ('input')  
 * - Input connectors can only have one incoming connection
 * - Connectors on the same gate cannot be connected to each other
 * - Existing connections must be removed before creating new ones to the same input
 * 
 * ## Visual States
 * - Default: Gray dot indicating no signal or inactive state
 * - Active/High: Green dot when signal is true/high
 * - Error: Red dot when there are connection conflicts or errors
 * 
 * @element connector-element
 * @since 1.0.0
 * @status stable
 */
@localized()
export default class ConnectorElement extends LitElement {
    static styles = Styles;

    /**
     * Reference to the parent LogicCircuit widget component.
     * Used to access global circuit state and manage connections.
     * @type {LogicCircuit}
     */
    widget: LogicCircuit

    /**
     * Unique identifier for this connector element.
     * Format typically includes gate ID and terminal type (e.g., "gate1-In1", "gate2-Out").
     * @type {string}
     * @default ""
     */
    @state() accessor id = '';

    /**
     * Type of connector indicating signal direction.
     * "input" for gate inputs that receive signals, "output" for gate outputs that send signals.
     * @type {string}
     * @default ""
     * @values "input" | "output"
     */
    @state() accessor type = '';

    /**
     * X-coordinate position of the connector relative to its parent gate.
     * Used for calculating connection line endpoints and positioning.
     * @type {number}
     * @default 0
     */
    @state() accessor x = 0;

    /**
     * Y-coordinate position of the connector relative to its parent gate.
     * Used for calculating connection line endpoints and positioning.
     * @type {number}
     * @default 0
     */
    @state() accessor y = 0;

    /**
     * Current signal value/state of the connector.
     * true = high/active signal, false = low/inactive signal, null = no signal/unconnected.
     * @type {boolean|null}
     * @default null
     */
    @state() accessor value = null;

    constructor() {
        super();
        this.addEventListener('mousedown', this.handleMouseDown);
    }

    /**
     * Handles mouse down events on the connector to initiate connection creation.
     * 
     * This method implements the two-click connection system:
     * 1. First click selects the starting connector
     * 2. Second click on a compatible connector creates the connection
     * 
     * Connection validation includes:
     * - Preventing multiple connections to the same input
     * - Ensuring connections are between different connector types (input/output)
     * - Preventing connections within the same gate
     * 
     * @method
     * @param {MouseEvent} event - The mouse down event
     * @throws {Error} When connection rules are violated
     */
    handleMouseDown(event) {
        event.preventDefault();
        const clickedElement = event.target;

        const widget = this.widget

        for (const line of widget.lineElements) {
            if (clickedElement === line.start || clickedElement === line.end) {
                widget.startConnector = null;
                widget.endConnector = null;
                widget.isDrawingLine = false;
                widget.svgPathToMouse.setAttribute('d', '');

                console.error(msg('Only one connection allowed'));

                return;
            }
        }

        if (widget.startConnector === null) {
            widget.startConnector = clickedElement;
            widget.isDrawingLine = true;
        } else if (widget.endConnector === null) {
            widget.endConnector = clickedElement;

            if (
                widget.startConnector.type !== widget.endConnector.type &&
                widget.startConnector.parentNode.parentNode !== widget.endConnector.parentNode.parentNode
            ) {
                createLine(widget, widget.startConnector, widget.endConnector);
            } else {
                console.error(msg('Connectors are from the same type'));
            }
            widget.startConnector = null;
            widget.endConnector = null;
            widget.isDrawingLine = false;
            widget.svgPathToMouse.setAttribute('d', '');
        }
    }

    render() {
        return html` <div class="connector" id="${this.id}">
            <span class="dot"></span>
        </div> `;
    }
}

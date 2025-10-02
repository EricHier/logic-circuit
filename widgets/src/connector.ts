import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { createLine } from './helper/line-helper.js';
import { Styles } from './styles.js';
import LogicCircuit from '../webwriter-logic-circuit.js';
import { localized, msg } from "@lit/localize";

/**
 * @summary Represents a connection point in a logic circuit.
 *
 * @tag connector-element
 *
 * @attr {string} id - Unique identifier for the connector element.
 * @attr {string} type - Connector type (e.g., 'input' or 'output').
 *
 * @property {number} x - The x-coordinate of the connector's position.
 * @property {number} y - The y-coordinate of the connector's position.
 * @property {*} value - Current value of the connector (can be null).
 */
@customElement("connector-element")
@localized()
export default class ConnectorElement extends LitElement {
    static styles = Styles;

    /** Reference to the LogicCircuit widget associated with this connector. */
    widget: LogicCircuit;

    /** Unique identifier for this connector. */
    @state() accessor id = '';

    /** Type of this connector. */
    @state() accessor type = '';

    /** X-coordinate position of this connector. */
    @state() accessor x = 0;

    /** Y-coordinate position of this connector. */
    @state() accessor y = 0;

    /** Current value held by this connector. */
    @state() accessor value = null;

    constructor() {
        super();
        this.addEventListener('mousedown', this.handleMouseDown);
    }

    /**
     * Handles mouse down events on the connector element.
     *
     * This method manages connections between connectors by determining if a valid connection can be made,
     * and creates a line if applicable. It also handles error logging for invalid connection attempts.
     *
     * @param {MouseEvent} event - The mouse event triggered on mousedown.
     */
    handleMouseDown(event) {
        event.preventDefault();
        const clickedElement = event.target;
        
        const widget = this.widget;

        // Check if clicked element is already connected
        for (const line of widget.lineElements) {
            if (clickedElement === line.start || clickedElement === line.end) {
                widget.startConnector = null;
                widget.endConnector = null;
                widget.isDrawingLine = false;
                widget.svgPathToMouse.setAttribute('d', '');

                DEV: console.error(msg('Only one connection allowed'));

                return;
            }
        }

        // Handle starting and ending connections
        if (widget.startConnector === null) {
            widget.startConnector = clickedElement;
            widget.isDrawingLine = true;
        } else if (widget.endConnector === null) {
            widget.endConnector = clickedElement;

            // Validate connection types before creating a line
            if (
                widget.startConnector.type !== widget.endConnector.type &&
                widget.startConnector.parentNode.parentNode !== widget.endConnector.parentNode.parentNode
            ) {
                createLine(widget, widget.startConnector, widget.endConnector);
            } else {
                DEV: console.error(msg('Connectors are from the same type'));
            }
            
            // Reset connectors after processing
            widget.startConnector = null;
            widget.endConnector = null;
            widget.isDrawingLine = false;
            widget.svgPathToMouse.setAttribute('d', '');
        }

        this.widget.simulateCircuit();
    }

    render() {
        return html` <div class="connector" id="${this.id}">
                        <span class="dot"></span>
                    </div> `;
    }
}
import { LitElement, html } from 'lit';
import { customElement, property, state } from 'lit/decorators.js';
import { createLine } from './helper/line-helper.js';
import { Styles } from './styles.js';
import LogicCircuit from '../webwriter-logic-circuit.js';
import { localized, msg } from "@lit/localize";

/**
 * Connector Element
 * 
 * Represents a connection point on logic gates where wires can be attached.
 * Handles mouse interactions for creating connections between gates.
 * 
 * @element connector-element
 * @summary Connection point for linking logic gates
 * @description Connection endpoints that appear on logic gates. Users can click these to:
 * - Start a new connection by clicking on an output connector
 * - Complete a connection by clicking on an input connector
 * - View the current signal state (true/false) through visual indicators
 * 
 * Connectors automatically change appearance based on their signal state:
 * - Inactive: Default appearance
 * - True signal: Highlighted appearance
 * - False signal: Dimmed appearance
 * 
 * @fires connection-started - When user starts drawing a connection from this connector
 * @fires connection-completed - When user completes a connection to this connector
 * 
 * @example
 * Connectors are automatically created by gate components:
 * ```html
 * <!-- Connectors appear automatically on gates -->
 * <and-gate></and-gate>
 * ```
 * 
 * @csspart connector - The main connector container
 * @csspart dot - The visual connection point
 * 
 * @cssprop --connector-color - Default connector color (default: #666666)
 * @cssprop --connector-active-color - Color when signal is active (default: #ff0000)
 * @cssprop --connector-size - Size of the connector dot (default: 10px)
 */
@localized()
export default class ConnectorElement extends LitElement {
    static styles = Styles;

    /**
     * Reference to the parent LogicCircuit widget
     * @type {LogicCircuit}
     * @readonly
     */
    widget: LogicCircuit

    /**
     * Unique identifier for this connector
     * @type {string}
     * @default ''
     */
    @state() accessor id = '';
    
    /**
     * Type of connector ('input' or 'output')
     * @type {string}
     * @default ''
     */
    @state() accessor type = '';
    
    /**
     * X coordinate position of the connector
     * @type {number}
     * @default 0
     */
    @state() accessor x = 0;
    
    /**
     * Y coordinate position of the connector
     * @type {number}
     * @default 0
     */
    @state() accessor y = 0;
    
    /**
     * Current signal value (true/false/null)
     * @type {boolean|null}
     * @default null
     */
    @state() accessor value = null;

    constructor() {
        super();
        this.addEventListener('mousedown', this.handleMouseDown);
    }

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

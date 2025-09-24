import { html, css } from 'lit';
import { LitElementWw } from '@webwriter/lit';
import { customElement, query } from 'lit/decorators.js';
import { property, state } from 'lit/decorators.js';
import ConnectorElement from '../connector';
import LukaswwLogicgates from '../../webwriter-logic-circuit';
import { getMouseCoordinates, updateLineColor } from '../helper/line-helper';
import { transferOutputToNextGate } from '../helper/gate-helper';

import SlTooltip from '@shoelace-style/shoelace/dist/components/tooltip/tooltip.component.js';
import SlButton from '@shoelace-style/shoelace/dist/components/button/button.component.js';
import SlPopup from '@shoelace-style/shoelace/dist/components/popup/popup.component.js';
import SlIcon from '@shoelace-style/shoelace/dist/components/icon/icon.component.js';
import SlMenu from '@shoelace-style/shoelace/dist/components/menu/menu.component.js';
import SlMenuItem from '@shoelace-style/shoelace/dist/components/menu-item/menu-item.component.js';
import '@shoelace-style/shoelace/dist/themes/light.css';
import { Styles } from '../styles';
import LogicCircuit from '../../webwriter-logic-circuit';

/**
 * Base class for all logic gate components in the circuit simulator.
 * 
 * This abstract class provides common functionality for all gate types including:
 * - Input/output signal management
 * - Visual connector creation and positioning
 * - Drag-and-drop behavior for gate placement and movement
 * - Context menu interactions for gate configuration
 * - Truth table display capabilities
 * - Signal propagation and visual feedback
 * 
 * ## Gate Types
 * All gates inherit from this base class and implement specific logic:
 * - INPUT: User-controllable input source
 * - OUTPUT: Circuit output display
 * - NOT: Logical NOT (inverter)
 * - AND: Logical AND (2 inputs)
 * - OR: Logical OR (2 inputs)  
 * - NAND: Logical NAND (2 inputs)
 * - NOR: Logical NOR (2 inputs)
 * - XOR: Logical XOR (2 inputs)
 * - XNOR: Logical XNOR (2 inputs)
 * - SPLITTER: Signal distribution (1 input, 2 outputs)
 * 
 * ## State Management
 * Gates maintain their input and output states, automatically updating
 * connected gates when their outputs change. The simulation system
 * processes gates in dependency order to ensure correct signal propagation.
 * 
 * ## Interactive Features
 * - **Drag & Drop**: Gates can be moved around the workspace when movable=true
 * - **Context Menu**: Right-click provides gate-specific options
 * - **Truth Tables**: Educational overlays showing gate logic tables
 * - **Visual Feedback**: Connectors change color to indicate signal states
 * 
 * @abstract
 * @element gate (base class)
 * @since 1.0.0
 * @status stable
 */
export default class Gate extends LitElementWw {
    static movedGate;
    static x;
    static y;

    /**
     * Reference to the parent LogicCircuit widget component.
     * Provides access to global circuit state and management functions.
     * @type {LogicCircuit}
     */
    widget: LogicCircuit

    public static get scopedElements() {
        return {
            'sl-tooltip': SlTooltip,
            'sl-button': SlButton,
            'sl-popup': SlPopup,
            'sl-icon': SlIcon,
            'sl-menu': SlMenu,
            'sl-menu-item': SlMenuItem,
        };
    }

    static styles = Styles;

    /**
     * Current state of the first input terminal.
     * true = high/active signal, false = low/inactive signal, null = no connection.
     * @type {boolean|null}
     * @default null
     */
    @property({ type: Boolean }) accessor input1: boolean = null;

    /**
     * Current state of the second input terminal (for gates with 2 inputs).
     * true = high/active signal, false = low/inactive signal, null = no connection.
     * @type {boolean|null}
     * @default null
     */
    @property({ type: Boolean }) accessor input2: boolean = null;

    /**
     * Current state of the primary output terminal.
     * Computed based on gate logic and input states.
     * @type {boolean|null}
     * @default null
     */
    @property({ type: Boolean }) accessor output: boolean = null;

    /**
     * Current state of the secondary output terminal (for splitter gates).
     * Usually mirrors the primary output for signal distribution.
     * @type {boolean|null}
     * @default null
     */
    @property({ type: Boolean }) accessor output2: boolean = null;

    /**
     * Type identifier for this gate specifying its logical function.
     * Used for gate-specific behavior and visual representation.
     * @type {string}
     * @default null
     * @values "INPUT" | "OUTPUT" | "NOT" | "AND" | "OR" | "NAND" | "NOR" | "XOR" | "XNOR" | "SPLITTER"
     */
    @property({ type: String }) accessor gatetype: string = null;

    /**
     * Whether this gate can be moved around the workspace.
     * Gates in the sidebar have movable=false, placed gates have movable=true.
     * @type {boolean}
     * @default false
     */
    @property({ type: Boolean }) accessor movable: boolean = false;

    /**
     * Unique identifier for this gate instance.
     * Used for connection management and gate tracking.
     * @type {string}
     * @default null
     */
    @property({ type: String }) accessor id: string = null;

    /**
     * Reference to the first input connector element.
     * Used for managing connections and signal flow.
     * @type {ConnectorElement|null}
     * @default null
     */
    @property({ type: Object }) accessor conIn1: ConnectorElement = null;

    /**
     * Reference to the second input connector element.
     * Used for gates with two inputs (AND, OR, NAND, NOR, XOR, XNOR).
     * @type {ConnectorElement|null}
     * @default null
     */
    @property({ type: Object }) accessor conIn2: ConnectorElement = null;

    /**
     * Reference to the primary output connector element.
     * Used for managing output connections and signal propagation.
     * @type {Object|null}
     * @default null
     */
    @property({ type: Object }) accessor conOut: Object = null;

    /**
     * Reference to the secondary output connector element.
     * Used for splitter gates that have dual outputs.
     * @type {Object|null}
     * @default null
     */
    @property({ type: Object }) accessor conOut2: Object = null;

    /**
     * Whether to display the truth table overlay for this gate.
     * Educational feature that shows the logical behavior of the gate.
     * @type {boolean}
     * @default false
     */
    @property({ type: Boolean }) accessor showTruthTable: boolean = false;

    @query('#contextMenu') accessor contextMenu: SlMenu;

    constructor() {
        super();
        this.addEventListener('dragstart', this.handleDragStart);
        this.addEventListener('dragend', this.handleDragEnd);
        this.addEventListener('contextmenu', this.handleContextMenu);

        this.input1 = null;
        this.input2 = null;
        this.output = false;
        this.output2 = false;
        this.movable = false;
        this.showTruthTable = false;
    }

    firstUpdated(changedProperties) {
        super.firstUpdated(changedProperties);

        let slot;
        if (this.shadowRoot) {
            let slot;
            switch (this.gatetype) {
                case 'INPUT':
                    slot = this.shadowRoot.querySelector('slot[name="con3"]');
                    this.createConnectors(slot, 3);
                    break;
                case 'OUTPUT':
                    slot = this.shadowRoot.querySelector('slot[name="con1"]');
                    this.createConnectors(slot, 0);
                    break;
                case 'NOT':
                    slot = this.shadowRoot.querySelector('slot[name="con1"]');
                    this.createConnectors(slot, 0);
                    slot = this.shadowRoot.querySelector('slot[name="con3"]');
                    this.createConnectors(slot, 3);
                    break;
                case 'SPLITTER':
                    slot = this.shadowRoot.querySelector('slot[name="con1"]');
                    this.createConnectors(slot, 0);
                    slot = this.shadowRoot.querySelector('slot[name="con3"]');
                    this.createConnectors(slot, 4);
                    slot = this.shadowRoot.querySelector('slot[name="con4"]');
                    this.createConnectors(slot, 5);
                    break;
                default:
                    for (let i = 1; i <= 3; i++) {
                        slot = this.shadowRoot.querySelector('slot[name="con' + i + '"]');
                        this.createConnectors(slot, i);
                    }
            }
        }
    }

    updated(changedProperties) {
        super.updated(changedProperties);
        const widget = this.widget
        if (this.movable === true) {
            if (this.gatetype === 'INPUT' && changedProperties.has('input1')) {
                this.calculateOutput();
                this.updateConnectorColor();
                setTimeout(() => {
                    transferOutputToNextGate(this.widget, this);
                }, widget.simulationDelay)
            }

            if (widget.simulate === true) {
                if (this.gatetype === 'OUTPUT' && changedProperties.has('input1')) {
                    this.calculateOutput();
                    this.updateConnectorColor();
                } else if (changedProperties.has('input1') || changedProperties.has('input2')) {
                    this.calculateOutput();
                    setTimeout(() => {
                        transferOutputToNextGate(this.widget, this);
                    }, widget.simulationDelay)
                    this.updateConnectorColor();
                }
            }
            if (changedProperties.has('showTruthTable')) {
                if (this.showTruthTable) {
                    this.renderTruthTable();
                }
            }
            updateLineColor(widget);
        }
    }

    handleDragStart(event) {
        Gate.movedGate = event.target;
        Gate.x = event.clientX;
        Gate.y = event.clientY;
        const tooltip = this.shadowRoot.querySelector('.tooltip') as SlTooltip;
        if (tooltip) {
            if (tooltip.open) {
                event.preventDefault();
                tooltip.hide();
            }
        }
        event.dataTransfer.setData('type', this.gatetype);
        const offsetX = event.clientX - this.getBoundingClientRect().left;
        const offsetY = event.clientY - this.getBoundingClientRect().top;
        event.dataTransfer.setData('offsetX', offsetX);
        event.dataTransfer.setData('offsetY', offsetY);
        event.dataTransfer.setData('movable', this.movable);

        event.dataTransfer.setData('id', this.id);

        this.hideContextMenu();
        if (this.movable) {
            this.style.opacity = '0.001';
        }
    }

    handleDragEnd(event) {
        event.preventDefault();
        if (this.movable) {
            this.style.opacity = '';
        }
    }

    handleContextMenu(event) {
        event.preventDefault();
        if (this.movable) {
            if (this.contextMenu.style.display === 'none') {
                this.showContextMenu(event);
            } else {
                this.hideContextMenu();
            }
        }
    }

    /**
     * Abstract method that calculates the gate's output based on its inputs.
     * Must be implemented by each specific gate type to define its logical behavior.
     * 
     * For example:
     * - AND gate: output = input1 && input2
     * - OR gate: output = input1 || input2  
     * - NOT gate: output = !input1
     * 
     * @method
     * @abstract
     * @protected
     */
    calculateOutput() {}

    /**
     * Toggles the state of the first input.
     * Used primarily for INPUT gates to allow user interaction.
     * @method
     * @public
     */
    changeInput1() {
        this.input1 = !this.input1;
    }

    /**
     * Toggles the state of the second input.
     * Used primarily for INPUT gates with dual outputs.
     * @method
     * @public
     */
    changeInput2() {
        this.input2 = !this.input2;
    }

    showContextMenu(event) {
        const gateElements = this.widget.getGateElements();
        gateElements.forEach((gate) => {
            gate.hideContextMenu();
        });

        if (this.contextMenu) {
            if (this.movable === true) {
                const zoom = this.widget.zoom;

                const gateX = this.getBoundingClientRect().x;
                const gateY = this.getBoundingClientRect().y;

                const svgCanvas = this.widget.wsDrag;

                const offsetX = getMouseCoordinates(svgCanvas, event.clientX, event.clientY, zoom).x;
                const offsetY = getMouseCoordinates(svgCanvas, event.clientX, event.clientY, zoom).y;

                this.style.zIndex = '30';
                this.contextMenu.style.display = 'block';
                this.contextMenu.style.left = `${offsetX}px`;
                this.contextMenu.style.top = `${offsetY}px`;
                this.contextMenu.style.transform = `scale(${1 / zoom})`;
            }
        }
    }

    hideContextMenu() {
        if (this.contextMenu) {
            this.contextMenu.style.display = 'none';
            this.style.zIndex = '10';
        }
    }

    deleteGate() {
        const workspace = document.querySelector('webwriter-logic-circuit') as LukaswwLogicgates;
        const gateElements = workspace.getGateElements();
        const lineElements = workspace.getLineElements();

        if (workspace.isDrawingLine) {
            workspace.isDrawingLine = false;
            workspace.svgPathToMouse.setAttribute('d', '');
            workspace.startConnector = null;
        }

        gateElements.forEach((gate, index) => {
            if (this === gate) {
                // Update inputs of the lines that are connected with the outputs of this gate
                this.output = false;
                this.output2 = false
                transferOutputToNextGate(this.widget, this)
                
                this.remove();
                gateElements.splice(index, 1);
            }
        });

        const pathsToDelete = lineElements?.filter(
            (line) =>
                line.start === this.conIn1 ||
                line.start === this.conIn2 ||
                line.start === this.conOut ||
                line.start === this.conOut2 ||
                line.end === this.conIn1 ||
                line.end === this.conIn2 ||
                line.end === this.conOut ||
                line.end === this.conOut2
        );

        let lineElementsUpdated = [];
        workspace.lineElements.forEach((line) => {
            if (pathsToDelete.includes(line)) {
                line.lineSVG.remove();

                let consArr: string[] = this.widget.reflectCons.split(",")
                let index: number = -1
                for(let i = 0; i<consArr.length; i++){
                    if(consArr[i].includes(line.start.id) && consArr[i].includes(line.end.id)){
                        index = i
                    }
                };
                consArr.splice(index,1)
                this.widget.reflectCons = consArr.toString()
            } else {
                lineElementsUpdated.push(line);
            }

        });
        workspace.lineElements = lineElementsUpdated;

        let consArr: string[] = this.widget.reflectGates.split(",")
        let index: number = -1
        for(let i = 0; i<consArr.length; i++){
            if(Number.parseInt(consArr[i][0]) === Number.parseInt(this.id.match(/^([a-zA-Z]+)(\d+)$/)[2])){
                index = i
            }
        };
        consArr.splice(index,1)
        this.widget.reflectGates = consArr.toString()

        this.hideContextMenu();
    }

    createConnectors(slot, n) {
        if (this.movable) {
            const connector = this.widget.shadowRoot.createElement('connector-element') as ConnectorElement;
            connector.style.position = 'absolute';
            connector.widget = this.widget

            switch (n) {
                case 0:
                    connector.id = this.id + 'In1';
                    connector.type = 'input';
                    connector.style.left = '-7%';
                    connector.style.top = '44%';
                    this.conIn1 = connector;
                    break;
                case 1:
                    connector.id = this.id + 'In1';
                    connector.type = 'input';
                    connector.style.left = '-7%';
                    connector.style.top = '25%';
                    this.conIn1 = connector;
                    break;
                case 2:
                    connector.id = this.id + 'In2';
                    connector.type = 'input';
                    connector.style.left = '-7%';
                    connector.style.top = '63%';
                    this.conIn2 = connector;
                    break;
                case 3:
                    connector.id = this.id + 'Out';
                    connector.type = 'output';
                    connector.style.left = '94%';
                    connector.style.top = '44%';
                    this.conOut = connector;
                    break;
                case 4:
                    connector.id = this.id + 'Out2';
                    connector.type = 'output';
                    connector.style.left = '94%';
                    connector.style.top = '23%';
                    this.conOut = connector;
                    break;
                case 5:
                    connector.id = this.id + 'Out3';
                    connector.type = 'output';
                    connector.style.left = '94%';
                    connector.style.top = '64%';
                    this.conOut2 = connector;
            }
            slot.appendChild(connector);
        }
    }

    updateConnectorColor() {
        let connectorDot;
        let con;
        const slotIn1 = this.shadowRoot.querySelector('.gate').querySelector("slot[name='con1']");
        const slotIn2 = this.shadowRoot.querySelector('.gate').querySelector("slot[name='con2']");
        const slotOut = this.shadowRoot.querySelector('.gate').querySelector("slot[name='con3']");
        const slotOut2 = this.shadowRoot.querySelector('.gate').querySelector("slot[name='con4']");

        if (this.gatetype === 'INPUT') {
            if (this.output === true) {
                this.shadowRoot.querySelector('.gate').classList.add('gateTrue');
            } else {
                this.shadowRoot.querySelector('.gate').classList.remove('gateTrue');
            }
        }
        if (this.widget.simulate === true) {
            if (this.gatetype == 'OUTPUT') {
                if (this.input1 === true) {
                    this.shadowRoot.querySelector('.gate').classList.add('gateTrue');
                    this.requestUpdate();
                } else {
                    this.shadowRoot.querySelector('.gate').classList.remove('gateTrue');
                }
            }
            if (slotOut) {
                connectorDot = slotOut.querySelector('connector-element').shadowRoot.querySelector('.connector').children[0];
                con = slotOut.querySelector('connector-element');
                if (connectorDot && this.output === true) {
                    connectorDot.classList.add('dotTrue');
                    con.value = true;
                } else if (connectorDot) {
                    connectorDot.classList.remove('dotTrue');
                    con.value = false;
                }
            }
            if (slotOut2) {
                connectorDot = slotOut2.querySelector('connector-element').shadowRoot.querySelector('.connector').children[0];
                con = slotOut2.querySelector('connector-element');
                if (connectorDot && this.output === true) {
                    connectorDot.classList.add('dotTrue');
                    con.value = true;
                } else if (connectorDot) {
                    connectorDot.classList.remove('dotTrue');
                    con.value = false;
                }
            }
            if (slotIn1) {
                connectorDot = slotIn1.querySelector('connector-element').shadowRoot.querySelector('.connector').children[0];
                con = slotIn1.querySelector('connector-element');
                if (connectorDot && this.input1 === true) {
                    connectorDot.classList.add('dotTrue');
                    con.value = true;
                } else if (connectorDot) {
                    connectorDot.classList.remove('dotTrue');
                    con.value = false;
                }
            }
            if (slotIn2) {
                connectorDot = slotIn2.querySelector('connector-element').shadowRoot.querySelector('.connector').children[0];
                con = slotIn2.querySelector('connector-element');
                if (connectorDot && this.input2 === true) {
                    connectorDot.classList.add('dotTrue');
                    con.value = true;
                } else if (connectorDot) {
                    connectorDot.classList.remove('dotTrue');
                    con.value = false;
                }
            }
        }
    }
    resetConnectorColor() {
        let connector;
        let con;
        const slotIn1 = this.shadowRoot.querySelector('.gate').querySelector("slot[name='con1']");
        const slotIn2 = this.shadowRoot.querySelector('.gate').querySelector("slot[name='con2']");
        const slotOut = this.shadowRoot.querySelector('.gate').querySelector("slot[name='con3']");
        const slotOut2 = this.shadowRoot.querySelector('.gate').querySelector("slot[name='con4']");

        if (this.gatetype === 'OUTPUT') {
            this.shadowRoot.querySelector('.gate').classList.remove('gateTrue');
        }
        if (slotOut) {
            connector = slotOut.querySelector('connector-element').shadowRoot.querySelector('.connector').children[0];
            con = slotOut.querySelector('connector-element');
            if (connector) {
                connector.classList.remove('dotTrue');
                connector.classList.remove('dotError');
                con.value = false;
            }
        }
        if (slotOut2) {
            connector = slotOut2.querySelector('connector-element').shadowRoot.querySelector('.connector').children[0];
            con = slotOut2.querySelector('connector-element');
            if (connector) {
                connector.classList.remove('dotTrue');
                connector.classList.remove('dotError');
                con.value = false;
            }
        }
        if (slotIn1) {
            connector = slotIn1.querySelector('connector-element').shadowRoot.querySelector('.connector').children[0];
            con = slotIn1.querySelector('connector-element');
            if (connector) {
                connector.classList.remove('dotTrue');
                connector.classList.remove('dotError');
                con.value = false;
            }
        }
        if (slotIn2) {
            connector = slotIn2.querySelector('connector-element').shadowRoot.querySelector('.connector').children[0];
            con = slotIn2.querySelector('connector-element');
            if (connector) {
                connector.classList.remove('dotTrue');
                connector.classList.remove('dotError');
                con.value = false;
            }
        }
    }

    truthTableHTML() {}

    flipGate() {
        if ((this.shadowRoot.getElementById('flipCheckbox') as SlMenuItem).checked) {
            this.showTruthTable = false;
        } else {
            this.showTruthTable = true;
        }
        this.hideContextMenu();
    }

    renderTruthTable() {
        const truthTable = this.truthTableHTML();
        const rows = this.shadowRoot.querySelectorAll('tr');
        rows.forEach((row) => {
            row.querySelectorAll('td').forEach((td) => {
                td.classList.remove('highlight');
            });
        });

        const widget = this.widget
        const highlightedRow = (Number(this.input1) << 1) | Number(this.input2);
        if (widget.simulate === true) {
            if (rows[highlightedRow]) {
                let row = rows[highlightedRow] as HTMLTableRowElement;
                row.querySelectorAll('td').forEach((td) => {
                    td.classList.add('highlight');
                });
                if (this.gatetype === 'SPLITTER') {
                    row = rows[highlightedRow + 1] as HTMLTableRowElement;
                }
                row.querySelectorAll('td').forEach((td) => {
                    td.classList.add('highlight');
                });
            }
        }

        return html` <div class="flippedGate">${truthTable}</div> `;
    }
}

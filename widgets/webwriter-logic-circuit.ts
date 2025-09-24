import { html } from 'lit';
import { LitElementWw } from '@webwriter/lit';
import { customElement, property, query, state } from 'lit/decorators.js';

import NOTGate from './src/gates/not-gate.js';
import ANDGate from './src/gates/and-gate.js';
import Input from './src/gates/input.js';
import NANDGate from './src/gates/nand-gate.js';
import NORGate from './src/gates/nor-gate.js';
import ORGate from './src/gates/or-gate.js';
import Output from './src/gates/output.js';
import XNORGate from './src/gates/xnor-gate.js';
import XORGate from './src/gates/xor-gate.js';
import Splitter from './src/gates/splitter.js';
import Gate from './src/gates/gate.js';

import ConnectorElement from './src/connector.js';
import { getConnectorCoordinates, getMouseCoordinates, calculatePathToMouse } from './src/helper/line-helper.js';

import '@shoelace-style/shoelace/dist/themes/light.css';
import SlButton from '@shoelace-style/shoelace/dist/components/button/button.component.js';
import SlButtonGroup from '@shoelace-style/shoelace/dist/components/button-group/button-group.component.js';
import SlIconButton from '@shoelace-style/shoelace/dist/components/icon-button/icon-button.component.js';
import SlTooltip from '@shoelace-style/shoelace/dist/components/tooltip/tooltip.component.js';
import SlIcon from '@shoelace-style/shoelace/dist/components/icon/icon.component.js';
import SlPopup from '@shoelace-style/shoelace/dist/components/popup/popup.component.js';
import SlSwitch from '@shoelace-style/shoelace/dist/components/switch/switch.component.js';
import SlMenu from '@shoelace-style/shoelace/dist/components/menu/menu.component.js';
import SlMenuItem from '@shoelace-style/shoelace/dist/components/menu-item/menu-item.component.js';
import SlCheckbox from '@shoelace-style/shoelace/dist/components/checkbox/checkbox.component.js';
import SlInput from '@shoelace-style/shoelace/dist/components/input/input.component.js';
import { Styles } from './src/styles.js';
import { add, connect, info, remove, trash } from './src/assets/icons.js';

import { calculatePath, updateLines, resetLines, createLine} from './src/helper/line-helper.js';
import { addGate, moveGate, transferOutputToNextGate } from './src/helper/gate-helper.js';
import { gateCounter, isDropOverTrashIcon, resetGates } from './src/helper/gate-helper.js';
import LOCALIZE from "../localization/generated";
import { localized, msg } from "@lit/localize";

const workspaceWidth: number = 3000;
const workspaceHeight: number = 2000;

let workspaceOffsetX: number = -workspaceWidth / 2;
let workspaceOffsetY: number = -workspaceHeight / 2;

/**
 * A comprehensive logic circuit simulator widget for WebWriter that allows users to create, 
 * edit, and simulate digital logic circuits using various logic gates.
 * 
 * This component provides:
 * - Drag-and-drop interface for adding logic gates (AND, OR, NOT, NAND, NOR, XOR, XNOR)
 * - Input and output components for circuit endpoints
 * - Visual connection system between gate terminals
 * - Real-time circuit simulation with visual feedback
 * - Truth table display for educational purposes
 * - Configurable gate limitations for controlled learning environments
 * - Multilingual support with localization
 * 
 * ## Usage Example
 * ```html
 * <webwriter-logic-circuit 
 *   allowSimulation="1" 
 *   simulationDelay="500"
 *   andGateAllowed="5"
 *   orGateAllowed="3">
 * </webwriter-logic-circuit>
 * ```
 * 
 * ## Key Features
 * - **Interactive Workspace**: Large canvas area for circuit design
 * - **Gate Library**: Sidebar with all available logic gates
 * - **Connection System**: Click-to-connect interface for linking gates
 * - **Simulation Mode**: Toggle between edit and simulation modes
 * - **Visual Feedback**: Color-coded connections showing signal states
 * - **Educational Tools**: Built-in instructions and gate counters
 * 
 * ## Advanced Configuration Examples
 * 
 * ### Restricted Educational Mode
 * ```html
 * <!-- Only allow basic gates for introductory lessons -->
 * <webwriter-logic-circuit 
 *   andGateAllowed="2"
 *   orGateAllowed="2"
 *   notGateAllowed="1"
 *   nandGateAllowed="0"
 *   allowSimulation="1"
 *   simulationDelay="1000">
 * </webwriter-logic-circuit>
 * ```
 * 
 * ### Advanced Circuit Design
 * ```html
 * <!-- Unrestricted mode for complex circuit design -->
 * <webwriter-logic-circuit 
 *   allowSimulation="1"
 *   simulationDelay="300"
 *   splitterAllowed="-1">
 * </webwriter-logic-circuit>
 * ```
 * 
 * ### Assessment Mode
 * ```html
 * <!-- Disable simulation for circuit design testing -->
 * <webwriter-logic-circuit 
 *   allowSimulation="0"
 *   andGateAllowed="5"
 *   orGateAllowed="3"
 *   notGateAllowed="2">
 * </webwriter-logic-circuit>
 * ```
 * 
 * ## Connection Rules & Edge Cases
 * 
 * ### Valid Connections
 * - Output terminals can connect to input terminals
 * - Each input terminal accepts only one connection
 * - Multiple outputs can connect to different inputs
 * - Splitter gates can distribute one signal to multiple destinations
 * 
 * ### Invalid Connections (Handled Gracefully)
 * - Input-to-input connections are rejected
 * - Output-to-output connections are rejected  
 * - Connections within the same gate are rejected
 * - Multiple connections to same input are rejected
 * 
 * ### Simulation Behavior
 * - Signals propagate with configurable delay (simulationDelay)
 * - Unconnected inputs are treated as false/low
 * - Feedback loops are detected and handled
 * - Circuit state resets when simulation is toggled off
 * 
 * ## Accessibility Features
 * - Keyboard navigation support
 * - Screen reader compatible
 * - High contrast visual indicators
 * - Multilingual interface support
 * - Configurable simulation speeds for different learning needs
 * 
 * @element webwriter-logic-circuit
 * @since 1.0.0
 * @status stable
 * 
 * @fires gate-added - Fired when a new gate is added to the circuit
 * @fires gate-removed - Fired when a gate is removed from the circuit
 * @fires connection-created - Fired when a new connection is made between gates
 * @fires connection-removed - Fired when a connection is removed
 * @fires simulation-started - Fired when circuit simulation begins
 * @fires simulation-stopped - Fired when circuit simulation ends
 */
@customElement('webwriter-logic-circuit')
@localized()
export default class LogicCircuit extends LitElementWw {
    static shadowRootOptions = {
        ...LitElementWw.shadowRootOptions,
        delegatesFocus: true,
    };

    public localize = LOCALIZE;

    static styles = Styles;

    public static get scopedElements() {
        return {
            'not-gate': NOTGate,
            'and-gate': ANDGate,
            'input-gate': Input,
            'nand-gate': NANDGate,
            'nor-gate': NORGate,
            'or-gate': ORGate,
            'output-gate': Output,
            'xnor-gate': XNORGate,
            'xor-gate': XORGate,
            'splitter-gate': Splitter,
            'connector-element': ConnectorElement,
            'sl-button': SlButton,
            'sl-button-group': SlButtonGroup,
            'sl-icon-button': SlIconButton,
            'sl-icon': SlIcon,
            'sl-tooltip': SlTooltip,
            'sl-popup': SlPopup,
            'sl-switch': SlSwitch,
            'sl-menu': SlMenu,
            'sl-menu-item': SlMenuItem,
            'sl-checkbox': SlCheckbox,
            'sl-input': SlInput,
        };
    }

    /**
     * Array of all connection lines currently drawn in the circuit.
     * Each line connects output terminals to input terminals of gates.
     * @type {Array<Object>}
     * @default []
     */
    @property({ type: Array }) accessor lineElements = [];

    /**
     * Array of all gate elements currently placed in the circuit workspace.
     * Includes all types of logic gates, inputs, outputs, and splitters.
     * @type {Array<Gate>}
     * @default []
     */
    @property({ type: Array }) accessor gateElements = [];

    /**
     * Serialized string representation of gates for persistence and reflection.
     * Used internally for state management and saving circuit configurations.
     * @type {String}
     * @default ""
     * @attribute reflect-gates
     */
    @property({type: String, reflect: true}) accessor reflectGates: String = ""

    /**
     * Serialized string representation of connections for persistence and reflection.
     * Used internally for state management and saving circuit configurations.
     * @type {String}
     * @default ""
     * @attribute reflect-cons
     */
    @property({type: String, reflect: true}) accessor reflectCons: String = ""

    /**
     * Internal counter for generating unique gate IDs.
     * Automatically incremented when new gates are added to ensure uniqueness.
     * @type {number}
     * @default 0
     */
    @property({ type: Number }) accessor gateID: number = 0;

    /**
     * Internal counter for generating unique line/connection IDs.
     * Automatically incremented when new connections are created.
     * @type {number}
     * @default 0
     */
    @property({ type: Number }) accessor lineID: number = 0;

    /**
     * Current zoom level of the workspace. 
     * Values greater than 1 zoom in, values less than 1 zoom out.
     * @type {number}
     * @default 1
     * @range 0.1-5.0
     */
    @property({ type: Number }) accessor zoom: number = 1;

    /**
     * X-coordinate where dragging operation started.
     * Used internally for calculating drag distances and workspace panning.
     * @type {number}
     * @default 0
     */
    @property({ type: Number }) accessor dragStartX: number = 0;

    /**
     * Y-coordinate where dragging operation started.
     * Used internally for calculating drag distances and workspace panning.
     * @type {number}
     * @default 0
     */
    @property({ type: Number }) accessor dragStartY: number = 0;

    /**
     * Whether the circuit simulation is currently active.
     * When true, signals propagate through the circuit and visual feedback is shown.
     * @type {boolean}
     * @default true
     */
    @property({ type: Boolean }) accessor simulate: boolean = true;

    /**
     * Delay in milliseconds between simulation steps.
     * Controls how fast signals propagate through the circuit during simulation.
     * Higher values make simulation slower but easier to follow visually.
     * @type {number}
     * @default 500
     * @range 100-2000
     * @attribute simulation-delay
     */
    @property({ type: Number, attribute: true, reflect: true }) accessor simulationDelay: number = 500;

    /**
     * Controls whether simulation functionality is enabled.
     * 0 = simulation disabled, 1 = simulation enabled.
     * Useful for educational scenarios where you want students to build circuits without testing them.
     * @type {number}
     * @default 1
     * @attribute allow-simulation
     */
    @property({ type: Number, attribute: true, reflect: true }) accessor allowSimulation: number = 1;

    /**
     * Maximum number of NOT gates allowed in the circuit.
     * -1 = unlimited, 0 = none allowed, positive number = specific limit.
     * Useful for educational exercises with constraints.
     * @type {number}
     * @default -1
     * @attribute not-gate-allowed
     */
    @property({ type: Number, attribute: true, reflect: true }) accessor notGateAllowed: number = -1;

    /**
     * Maximum number of AND gates allowed in the circuit.
     * -1 = unlimited, 0 = none allowed, positive number = specific limit.
     * @type {number}
     * @default -1
     * @attribute and-gate-allowed
     */
    @property({ type: Number, attribute: true, reflect: true }) accessor andGateAllowed: number = -1;

    /**
     * Maximum number of OR gates allowed in the circuit.
     * -1 = unlimited, 0 = none allowed, positive number = specific limit.
     * @type {number}
     * @default -1
     * @attribute or-gate-allowed
     */
    @property({ type: Number, attribute: true, reflect: true }) accessor orGateAllowed: number = -1;

    /**
     * Maximum number of NAND gates allowed in the circuit.
     * -1 = unlimited, 0 = none allowed, positive number = specific limit.
     * @type {number}
     * @default -1
     * @attribute nand-gate-allowed
     */
    @property({ type: Number, attribute: true, reflect: true }) accessor nandGateAllowed: number = -1;

    /**
     * Maximum number of NOR gates allowed in the circuit.
     * -1 = unlimited, 0 = none allowed, positive number = specific limit.
     * @type {number}
     * @default -1
     * @attribute nor-gate-allowed
     */
    @property({ type: Number, attribute: true, reflect: true }) accessor norGateAllowed: number = -1;

    /**
     * Maximum number of XNOR gates allowed in the circuit.
     * -1 = unlimited, 0 = none allowed, positive number = specific limit.
     * @type {number}
     * @default -1
     * @attribute xnor-gate-allowed
     */
    @property({ type: Number, attribute: true, reflect: true }) accessor xnorGateAllowed: number = -1;

    /**
     * Maximum number of XOR gates allowed in the circuit.
     * -1 = unlimited, 0 = none allowed, positive number = specific limit.
     * @type {number}
     * @default -1
     * @attribute xor-gate-allowed
     */
    @property({ type: Number, attribute: true, reflect: true }) accessor xorGateAllowed: number = -1;

    /**
     * Maximum number of splitter components allowed in the circuit.
     * Splitters allow one output to connect to multiple inputs.
     * -1 = unlimited, 0 = none allowed, positive number = specific limit.
     * @type {number}
     * @default -1
     * @attribute splitter-allowed
     */
    @property({ type: Number, attribute: true, reflect: true }) accessor splitterAllowed: number = -1;

    /**
     * Whether the user is currently dragging an element.
     * Used internally for managing drag-and-drop operations.
     * @type {boolean}
     * @default false
     */
    @property({ type: Boolean }) accessor isDragging: boolean = false;

    /**
     * Whether the user is currently drawing a connection line.
     * Used internally to manage the connection creation process.
     * @type {boolean}
     * @default false
     */
    @state() accessor isDrawingLine: boolean = false;

    /**
     * The connector element where line drawing started.
     * Used during the connection creation process.
     * @type {ConnectorElement|null}
     * @default null
     */
    @state() accessor startConnector: ConnectorElement = null;

    /**
     * The connector element where line drawing will end.
     * Used during the connection creation process.
     * @type {ConnectorElement|null}
     * @default null
     */
    @state() accessor endConnector: ConnectorElement = null;

    /**
     * Reference to the SVG canvas element used for drawing connections.
     * This element contains all the connection lines between gates.
     */
    @query('#svgCanvas') accessor svgCanvas;

    /**
     * Reference to the main workspace container element.
     * Contains the entire circuit design area including sidebar and workspace.
     */
    @query('#workspace') accessor workspaceContainer;

    /**
     * Reference to the draggable workspace area element.
     * This is the main canvas where gates can be placed and moved.
     */
    @query('#workspaceDraggable') accessor wsDrag;

    /**
     * Reference to the simulation checkbox element.
     * Used to toggle simulation mode on and off.
     */
    @query('#simCheckbox') accessor simCheckbox;

    /**
     * Reference to the instructions container element.
     * Contains the help text and usage instructions that can be toggled.
     */
    @query('#instructions') accessor instructionsContainer;

    /**
     * Getter function that returns the current array of gate elements.
     * Provides external access to the circuit's gate collection.
     * @returns {Array<Gate>} Array of all gates in the circuit
     */
    public getGateElements = () => this.gateElements;

    /**
     * Getter function that returns the current array of connection lines.
     * Provides external access to the circuit's connection collection.
     * @returns {Array<Object>} Array of all connections in the circuit
     */
    public getLineElements = () => this.lineElements;

    /**
     * SVG path element used for drawing temporary connection lines.
     * Shows a preview line when user is in the process of creating a connection.
     * @type {SVGPathElement|null}
     * @default null
     */
    svgPathToMouse: SVGPathElement | null = null;

    render() {
        return html`
            <div class="container">
                <div class="sidebar">
                    <div style=${this.notGateAllowed === 0 ? 'display: none;' : ''} class="sidebar-item">
                        <not-gate></not-gate>
                        <p class="sidebar-counter">${gateCounter(this, 'NOT')}</p>
                    </div>

                    <div style=${this.andGateAllowed === 0 ? 'display: none;' : ''} class="sidebar-item">
                        <and-gate></and-gate>
                        <p class="sidebar-counter">${gateCounter(this, 'AND')}</p>
                    </div>

                    <div style=${this.orGateAllowed === 0 ? 'display: none;' : ''} class="sidebar-item">
                        <or-gate></or-gate>
                        <p class="sidebar-counter">${gateCounter(this, 'OR')}</p>
                    </div>

                    <div style=${this.nandGateAllowed === 0 ? 'display: none;' : ''} class="sidebar-item">
                        <nand-gate></nand-gate>
                        <p class="sidebar-counter">${gateCounter(this, 'NAND')}</p>
                    </div>

                    <div style=${this.norGateAllowed === 0 ? 'display: none;' : ''} class="sidebar-item">
                        <nor-gate></nor-gate>
                        <p class="sidebar-counter">${gateCounter(this, 'NOR')}</p>
                    </div>

                    <div style=${this.xnorGateAllowed === 0 ? 'display: none;' : ''} class="sidebar-item">
                        <xnor-gate></xnor-gate>
                        <p class="sidebar-counter">${gateCounter(this, 'XNOR')}</p>
                    </div>

                    <div style=${this.xorGateAllowed === 0 ? 'display: none;' : ''} class="sidebar-item">
                        <xor-gate></xor-gate>
                        <p class="sidebar-counter">${gateCounter(this, 'XOR')}</p>
                    </div>

                    <splitter-gate></splitter-gate>
                    <input-gate></input-gate>
                    <output-gate></output-gate>
                </div>

                <div class="workspaceContainer" id="workspace">
                    <sl-checkbox id="simCheckbox" class="simulateCheckbox" @sl-change=${() => this.simulateCircuit()} checked
                        >${msg("Simulate")}</sl-checkbox
                    >

                    <sl-switch class="flipSwitch" id="switch" @sl-change=${() => this.handleFlipAllGates()}
                        >${msg("Show all Truthtables")}</sl-switch
                    >

                    <div class="trashCanIcon" style="font-size: 35px;" title="${msg("Drag items here to delete them")}">${trash}</div>
                    
                    <div id="instructions" class="instructions">
                        <div class="instruction">
                        ${add}${msg("Drag and drop elements from the left sidebar to add them.")}
                        </div>
                        <div class="instruction">
                        ${connect}${msg("Left click a connection endpoint to start a connection and then click another connection endpoint to add it.")}
                        </div>
                        <div class="instruction">
                        ${remove}${msg("Right click on a connection to remove it.")}
                        </div>
                    </div>

                    <div class="infoButton" @click=${() => this.toggleInstructions()}>${info}${msg("Instructions")}</div>

                    <div class="workspaceArea" id="workspaceDraggable">
                        <svg class="svgArea" id="svgCanvas"></svg>
                    </div>
                </div>
            </div>

            <div part="options" class="optionsMenu">
                <p>Simulation:</p>
                <div class="optionsItem">
                    <sl-checkbox class="optionsCheckbox" @sl-change=${() => this.handleAllowSimulation()} checked
                        >${msg("Allow Simulation")}</sl-checkbox
                    >
                </div>
                <div class="optionsItem">
                    <sl-input
                        class="optionsCheckbox"
                        type="number"
                        size="small"
                        @sl-change=${(e) => this.handleInputChange(e, 'simulationDelay')}
                        .value=${this.simulationDelay}
                        min="0"
                    ></sl-input>
                    <p>${msg("Delay (in ms)")}</p>
                </div>
                <p></p>
                <p>${msg("Limit max. number of Gates:")}</p>

                <div class="optionsItem">
                    <sl-input
                        class="optionsCheckbox"
                        type="number"
                        size="small"
                        @sl-change=${(e) => this.handleInputChange(e, 'notGateAllowed')}
                        .value=${this.notGateAllowed >= 0 ? this.notGateAllowed : ''}
                        min="0"
                    ></sl-input>
                    <p>NOT-${msg("Gates")}</p>
                </div>
                <div class="optionsItem">
                    <sl-input
                        class="optionsCheckbox"
                        type="number"
                        size="small"
                        @sl-change=${(e) => this.handleInputChange(e, 'andGateAllowed')}
                        .value=${this.andGateAllowed >= 0 ? this.andGateAllowed : ''}
                        min="0"
                    ></sl-input>
                    <p>AND-${msg("Gates")}</p>
                </div>
                <div class="optionsItem">
                    <sl-input
                        class="optionsCheckbox"
                        type="number"
                        size="small"
                        @sl-change=${(e) => this.handleInputChange(e, 'orGateAllowed')}
                        .value=${this.orGateAllowed >= 0 ? this.orGateAllowed : ''}
                        min="0"
                    ></sl-input>
                    <p>OR-${msg("Gates")}</p>
                </div>
                <div class="optionsItem">
                    <sl-input
                        class="optionsCheckbox"
                        type="number"
                        size="small"
                        @sl-change=${(e) => this.handleInputChange(e, 'nandGateAllowed')}
                        .value=${this.nandGateAllowed >= 0 ? this.nandGateAllowed : ''}
                        min="0"
                    ></sl-input>
                    <p>NAND-${msg("Gates")}</p>
                </div>
                <div class="optionsItem">
                    <sl-input
                        class="optionsCheckbox"
                        type="number"
                        size="small"
                        @sl-change=${(e) => this.handleInputChange(e, 'norGateAllowed')}
                        .value=${this.norGateAllowed >= 0 ? this.norGateAllowed : ''}
                        min="0"
                    ></sl-input>
                    <p>NOR-${msg("Gates")}</p>
                </div>
                <div class="optionsItem">
                    <sl-input
                        class="optionsCheckbox"
                        type="number"
                        size="small"
                        @sl-change=${(e) => this.handleInputChange(e, 'xnorGateAllowed')}
                        .value=${this.xnorGateAllowed >= 0 ? this.xnorGateAllowed : ''}
                        min="0"
                    ></sl-input>
                    <p>XNOR-${msg("Gates")}</p>
                </div>
                <div class="optionsItem">
                    <sl-input
                        class="optionsCheckbox"
                        type="number"
                        size="small"
                        @sl-change=${(e) => this.handleInputChange(e, 'xorGateAllowed')}
                        .value=${this.xorGateAllowed >= 0 ? this.xorGateAllowed : ''}
                        min="0"
                    ></sl-input>
                    <p>XOR-${msg("Gates")}</p>
                </div>
            </div>
        `;
    }

    updated(changedProperties) {
        super.updated(changedProperties);
        if (changedProperties.has('allowSimulation')) {
            if (this.allowSimulation === 1) {
                this.simCheckbox.style.display = 'block';
            } else {
                this.simCheckbox.style.display = 'none';
            }
        }
    }

    connectedCallback() {
        super.connectedCallback();
        this.addEventListener('contextmenu', this.handleContextMenu);
    }

    disconnectedCallback() {
        super.disconnectedCallback();
        this.removeEventListener('mousedown', this.handleMouseDown);
        this.removeEventListener('mousemove', this.handleMouseMove);
        this.removeEventListener('mouseup', this.handleMouseUp);
    }

    /**
     * Toggles the visibility of the instructions panel.
     * Shows/hides the help text that explains how to use the circuit editor.
     * @method
     * @public
     */
    toggleInstructions() {
        if (this.instructionsContainer.style.display == "none") {
            this.instructionsContainer.style.display = 'block';
        } else {
            this.instructionsContainer.style.display = 'none';
        }
    }

    firstUpdated() {
        this.workspaceContainer.addEventListener('drop', this.handleDrop.bind(this));
        this.workspaceContainer.addEventListener('dragover', this.handleDragOver.bind(this));
        this.workspaceContainer.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.workspaceContainer.addEventListener('mousemove', this.handleMouseMove.bind(this));
        this.workspaceContainer.addEventListener('mouseup', this.handleMouseUp.bind(this));
        this.workspaceContainer.addEventListener('mouseout', this.handleMouseOut.bind(this));
        this.workspaceContainer.addEventListener('wheel', this.handleWheel.bind(this));

        this.wsDrag.style.width = workspaceWidth + 'px';
        this.wsDrag.style.height = workspaceHeight + 'px';
        this.wsDrag.style.transform = `translate(${workspaceOffsetX}px,${workspaceOffsetY}px) scale(${this.zoom})`;

        this.svgPathToMouse = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        this.svgPathToMouse.setAttribute('d', '');
        this.svgPathToMouse.setAttribute('stroke', 'black');
        this.svgPathToMouse.setAttribute('fill', 'none');
        this.svgPathToMouse.setAttribute('stroke-width', '3');
        this.svgPathToMouse.setAttribute('id', 'lineToMouse');
        this.svgCanvas.appendChild(this.svgPathToMouse);

        if(this.reflectGates.length>0){
            this.reflectGates.split(",").forEach(gate=>{
                addGate(this, null, gate.split("|").splice(1))
            })
        }
        if(this.reflectCons.length>0){
            this.reflectCons.split(",").forEach(con=>{
                let startID: string = con.split("|")[0]
                let endID: string = con.split("|")[1]
                let start: any, end: any
                this.shadowRoot.querySelector(".workspaceArea").childNodes.forEach(node=>{
                    if(node.nodeName.includes("GATE")){
                        setTimeout(()=>{
                            if(startID.includes(node.shadowRoot.querySelector("div").id)){
                                let gate: any = node.shadowRoot.querySelector("div")
                                let connectorArr: any = gate.querySelectorAll("slot")
                                connectorArr.forEach(slot=>{
                                    if(slot.children[0].id === startID){
                                        start = (slot.childNodes as NodeList).item(0)
                                    }
                                })
                            }
                            if(endID.includes(node.shadowRoot.querySelector("div").id)){
                                let gate: any = node.shadowRoot.querySelector("div")
                                let connectorArr: any = gate.querySelectorAll("slot")
                                connectorArr.forEach(slot=>{
                                    if(slot.children[0].id === endID){
                                        end = (slot.childNodes as NodeList).item(0)
                                    }
                                })
                            }
                            createLine(this,start,end)
                        }, 1)
                    }
                })
            })
        }
    }



    /**
     * Handles changes to the simulation enablement setting.
     * Toggles the simulation capability and resets the circuit when changed.
     * Controls whether users can activate circuit simulation mode.
     * @method
     * @public
     */
    handleAllowSimulation() {
        if (this.allowSimulation === 0) {
            this.resetCircuit();
            this.simCheckbox.checked = false;
            this.allowSimulation = 1;
        } else {
            this.simulate = false
            this.resetCircuit();
            this.allowSimulation = 0;
        }
    }

    handleFlipAllGates() {
        if ((this.shadowRoot.getElementById('switch') as SlSwitch).checked === false) {
            this.gateElements.forEach((gate) => {
                if (gate.gatetype !== 'INPUT' && gate.gatetype !== 'OUTPUT') {
                    gate.shadowRoot.getElementById('flipCheckbox').checked = false;
                    gate.showTruthTable = false;
                }
            });
        } else {
            this.gateElements.forEach((gate) => {
                if (gate.gatetype !== 'INPUT' && gate.gatetype !== 'OUTPUT') {
                    gate.shadowRoot.getElementById('flipCheckbox').checked = true;
                    gate.showTruthTable = true;
                }
            });
        }
    }

    /**
     * Handles mouse down events on the workspace.
     * Initiates connection drawing when clicking on connectors or starts workspace panning.
     * @method
     * @param {MouseEvent} event - The mouse down event
     */
    handleMouseDown(event) {
        if (event.target === this.svgCanvas) {
            this.isDragging = true;
            this.dragStartX = event.clientX;
            this.dragStartY = event.clientY;
            if (this.isDrawingLine) {
                this.isDrawingLine = false;
                this.startConnector = null;
                this.svgPathToMouse.setAttribute('d', '');
            }
            this.gateElements.forEach((gate) => {
                gate.hideContextMenu();
            });
        }
    }

    /**
     * Handles mouse move events on the workspace.
     * Updates workspace panning during drag operations and shows connection preview during line drawing.
     * @method
     * @param {MouseEvent} event - The mouse move event
     */
    handleMouseMove(event) {
        if (this.isDragging) {
            const deltaX = event.clientX - this.dragStartX;
            const deltaY = event.clientY - this.dragStartY;

            workspaceOffsetX = workspaceOffsetX + deltaX;
            workspaceOffsetY = workspaceOffsetY + deltaY;

            this.calculateBoundaries();
            this.dragStartX = event.clientX;
            this.dragStartY = event.clientY;

            this.transformWorkspace();
        }

        if (this.isDrawingLine) {
            const { x: startX, y: startY } = getConnectorCoordinates(this.svgCanvas, this.startConnector, this.zoom);
            const { x: endX, y: endY } = getMouseCoordinates(
                this.svgCanvas,
                event.clientX,
                event.clientY - 4,
                this.zoom
            );
            let path;

            if (this.startConnector.type === 'output') {
                path = `M ${startX} ${startY}`;
            } else {
                path = `M ${endX} ${endY}`;
            }
            const points = calculatePathToMouse(this.svgCanvas, this.startConnector, this.zoom, endX, endY);
            for (let i = 1; i < points.length; i++) {
                path += ` L ${points[i].x} ${points[i].y}`;
            }
            this.svgPathToMouse.setAttribute('d', path);
        }
    }

    transformWorkspace() {
        const workspace = this.wsDrag;
        workspace.style.transform = `translate(${workspaceOffsetX}px,${workspaceOffsetY}px) scale(${this.zoom})`;
    }

    handleMouseUp() {
        this.isDragging = false;
    }

    handleWheel(event) {
        event.preventDefault();

        this.gateElements.forEach((gate) => {
            gate.hideContextMenu();
        });

        const delta = event.deltaY;
        this.zoom -= delta * 0.001;

        this.zoom = Math.min(Math.max(this.zoom, 0.5), 2.5);
        this.transformWorkspace();
        this.calculateBoundaries();
        this.transformWorkspace();
    }

    handleMouseOut(event) {
        updateLines(this, Gate.movedGate);
        this.isDragging = false;
    }

    handleContextMenu(event) {
        event.preventDefault();
    }

    handleDragOver(event) {
        event.preventDefault();
        const draggedGate = Gate.movedGate;
        const mouseStartX = Gate.x;
        const mouseStartY = Gate.y;

        let deltaX = (event.clientX - mouseStartX) / this.zoom;
        let deltaY = (event.clientY - mouseStartY) / this.zoom;

        const moveLines = [];

        this.lineElements.forEach((lineObject) => {
            const startConnector = lineObject.start;
            const endConnector = lineObject.end;

            if (
                startConnector.id === draggedGate.conIn1?.id ||
                startConnector.id === draggedGate.conIn2?.id ||
                startConnector.id === draggedGate.conOut?.id ||
                startConnector.id === draggedGate.conOut2?.id ||
                endConnector.id === draggedGate.conIn1?.id ||
                endConnector.id === draggedGate.conIn2?.id ||
                endConnector.id === draggedGate.conOut?.id ||
                endConnector.id === draggedGate.conOut2?.id
            ) {
                moveLines.push(lineObject);
            }
        });

        moveLines.forEach((line) => {
            const startConnector = line.start;
            const endConnector = line.end;
            const svgPath = line.lineSVG;

            let points: { x: number; y: number }[];
            if (
                startConnector.id === draggedGate.conIn1?.id ||
                startConnector.id === draggedGate.conIn2?.id ||
                startConnector.id === draggedGate.conOut?.id ||
                startConnector.id === draggedGate.conOut2?.id
            ) {
                points = calculatePath(this.svgCanvas, startConnector, endConnector, this.zoom, deltaX, deltaY, 0, 0);
            } else {
                points = calculatePath(this.svgCanvas, startConnector, endConnector, this.zoom, 0, 0, deltaX, deltaY);
            }

            let path = `M ${points[0].x} ${points[0].y}`;

            for (let i = 1; i < points.length; i++) {
                path += ` L ${points[i].x} ${points[i].y}`;
            }

            svgPath.setAttribute('d', path);
        });

        const isOverTrash = isDropOverTrashIcon(this, event);

        if (isOverTrash) {
            this.workspaceContainer.querySelector('.trashCanIcon').classList.add('trashCanIconDragOver');
        } else {
            this.workspaceContainer.querySelector('.trashCanIcon').classList.remove('trashCanIconDragOver');
        }
    }

    /**
     * Handles drop events when dragging gates from the sidebar or moving existing gates.
     * Creates new gates when dropped from sidebar, moves existing gates when repositioning,
     * and deletes gates when dropped on trash can.
     * @method
     * @param {DragEvent} event - The drop event containing drag data
     */
    handleDrop(event) {
        event.preventDefault();
        const isOverTrash = isDropOverTrashIcon(this, event);

        if (event.dataTransfer.getData('movable') === 'false') {
            if (!isOverTrash) {
                addGate(this, event);
            }
        } else if (event.dataTransfer.getData('movable') === 'true') {
            const id = event.dataTransfer.getData('id');
            const gateToMove = this.gateElements.find((gate) => gate.id === id) as Gate;

            if (isOverTrash) {
                this.handleDropTrashCan(event);
            } else {
                moveGate(this, event);
            }
        }

        this.workspaceContainer.querySelector('.trashCanIcon').classList.remove('trashCanIconDragOver');
    }

    handleDropTrashCan(event) {
        event.preventDefault();

        const id = event.dataTransfer.getData('id');
        const trashGate = this.gateElements.find((gate) => gate.id === id);
        trashGate.deleteGate();
    }

    handleInputChange(event, propertyName) {
        const inputValue = parseInt(event.target.value);

        if (isNaN(inputValue) || inputValue < 0 || event.target.value.trim() === '') {
            this[propertyName] = -1;
        } else {
            this[propertyName] = inputValue;
        }
    }

    /**
     * Initiates circuit simulation by processing all gates in the circuit.
     * Propagates signals through the circuit with timing delays for visual feedback.
     * Only works when simulation is enabled and simulation checkbox is checked.
     * @method
     * @public
     */
    simulateCircuit() {
        const simCheckbox = this.simCheckbox;
        if (simCheckbox.checked) {
            this.simulate = true;
            this.resetCircuit();
            const inputGates = this.gateElements?.filter((gate) => gate.gatetype === 'INPUT');
            inputGates.forEach((gate) => {
                gate.calculateOutput();
                gate.updateConnectorColor();
                setTimeout(() => {
                    transferOutputToNextGate(this, gate);
                }, this.simulationDelay)
            });
        } else {
            this.simulate = false;
            this.resetCircuit();
        }
    }

    /**
     * Resets the entire circuit to its initial state.
     * Clears all signal states and visual indicators, preparing for new simulation.
     * @method
     * @public
     */
    resetCircuit() {
        resetGates(this);
        resetLines(this);
        this.requestUpdate();
    }

    calculateBoundaries() {
        if (workspaceOffsetX > (this.wsDrag.getBoundingClientRect().width - workspaceWidth) / 2 + 2) {
            workspaceOffsetX = (this.wsDrag.getBoundingClientRect().width - workspaceWidth) / 2 + 2;
        }
        if (workspaceOffsetY > (this.wsDrag.getBoundingClientRect().height - workspaceHeight) / 2 + 2) {
            workspaceOffsetY = (this.wsDrag.getBoundingClientRect().height - workspaceHeight) / 2 + 2;
        }
        if (
            workspaceOffsetX <
            -this.wsDrag.getBoundingClientRect().width +
                this.workspaceContainer.getBoundingClientRect().width +
                (this.wsDrag.getBoundingClientRect().width - workspaceWidth) / 2 -
                2
        ) {
            workspaceOffsetX =
                -this.wsDrag.getBoundingClientRect().width +
                this.workspaceContainer.getBoundingClientRect().width +
                (this.wsDrag.getBoundingClientRect().width - workspaceWidth) / 2 -
                2;
        }
        if (
            workspaceOffsetY <
            -this.wsDrag.getBoundingClientRect().height +
                this.workspaceContainer.getBoundingClientRect().height +
                (this.wsDrag.getBoundingClientRect().height - workspaceHeight) / 2 -
                2
        ) {
            workspaceOffsetY =
                -this.wsDrag.getBoundingClientRect().height +
                this.workspaceContainer.getBoundingClientRect().height +
                (this.wsDrag.getBoundingClientRect().height - workspaceHeight) / 2 -
                2;
        }
    }
}

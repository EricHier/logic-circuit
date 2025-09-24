# Logic,Circuit (`@webwriter/logic-circuit@1.1.3`)
[License: MIT](LICENSE) | Version: 1.1.3

Create and simulate circuits with logic gates (AND, OR, XOR, etc.).

## Snippets
[Snippets](https://webwriter.app/docs/snippets/snippets/) are examples and templates using the package's widgets.

| Name | Import Path |
| :--: | :---------: |
| Halfadder | @webwriter/logic-circuit/snippets/halfadder.html |
| RS FlipFlop | @webwriter/logic-circuit/snippets/RS-FlipFlop.html |



## `LogicCircuit` (`<webwriter-logic-circuit>`)
A comprehensive logic circuit simulator widget for WebWriter that allows users to create, 
edit, and simulate digital logic circuits using various logic gates.

This component provides:
- Drag-and-drop interface for adding logic gates (AND, OR, NOT, NAND, NOR, XOR, XNOR)
- Input and output components for circuit endpoints
- Visual connection system between gate terminals
- Real-time circuit simulation with visual feedback
- Truth table display for educational purposes
- Configurable gate limitations for controlled learning environments
- Multilingual support with localization

## Usage Example
```html
<webwriter-logic-circuit 
  allowSimulation="1" 
  simulationDelay="500"
  andGateAllowed="5"
  orGateAllowed="3">
</webwriter-logic-circuit>
```

## Key Features
- **Interactive Workspace**: Large canvas area for circuit design
- **Gate Library**: Sidebar with all available logic gates
- **Connection System**: Click-to-connect interface for linking gates
- **Simulation Mode**: Toggle between edit and simulation modes
- **Visual Feedback**: Color-coded connections showing signal states
- **Educational Tools**: Built-in instructions and gate counters

## Advanced Configuration Examples

### Restricted Educational Mode
```html
<!-- Only allow basic gates for introductory lessons -->
<webwriter-logic-circuit 
  andGateAllowed="2"
  orGateAllowed="2"
  notGateAllowed="1"
  nandGateAllowed="0"
  allowSimulation="1"
  simulationDelay="1000">
</webwriter-logic-circuit>
```

### Advanced Circuit Design
```html
<!-- Unrestricted mode for complex circuit design -->
<webwriter-logic-circuit 
  allowSimulation="1"
  simulationDelay="300"
  splitterAllowed="-1">
</webwriter-logic-circuit>
```

### Assessment Mode
```html
<!-- Disable simulation for circuit design testing -->
<webwriter-logic-circuit 
  allowSimulation="0"
  andGateAllowed="5"
  orGateAllowed="3"
  notGateAllowed="2">
</webwriter-logic-circuit>
```

## Connection Rules & Edge Cases

### Valid Connections
- Output terminals can connect to input terminals
- Each input terminal accepts only one connection
- Multiple outputs can connect to different inputs
- Splitter gates can distribute one signal to multiple destinations

### Invalid Connections (Handled Gracefully)
- Input-to-input connections are rejected
- Output-to-output connections are rejected  
- Connections within the same gate are rejected
- Multiple connections to same input are rejected

### Simulation Behavior
- Signals propagate with configurable delay (simulationDelay)
- Unconnected inputs are treated as false/low
- Feedback loops are detected and handled
- Circuit state resets when simulation is toggled off

## Accessibility Features
- Keyboard navigation support
- Screen reader compatible
- High contrast visual indicators
- Multilingual interface support
- Configurable simulation speeds for different learning needs

### Usage

Use with a CDN (e.g. [jsdelivr](https://jsdelivr.com)):
```html
<link href="https://cdn.jsdelivr.net/npm/@webwriter/logic-circuit/widgets/webwriter-logic-circuit.css" rel="stylesheet">
<script type="module" src="https://cdn.jsdelivr.net/npm/@webwriter/logic-circuit/widgets/webwriter-logic-circuit.js"></script>
<webwriter-logic-circuit></webwriter-logic-circuit>
```

Or use with a bundler (e.g. [Vite](https://vite.dev)):

```
npm install @webwriter/logic-circuit
```

```html
<link href="@webwriter/logic-circuit/widgets/webwriter-logic-circuit.css" rel="stylesheet">
<script type="module" src="@webwriter/logic-circuit/widgets/webwriter-logic-circuit.js"></script>
<webwriter-logic-circuit></webwriter-logic-circuit>
```

## Fields
| Name (Attribute Name) | Type | Description | Default | Reflects |
| :-------------------: | :--: | :---------: | :-----: | :------: |
| `LogicCircuit.shadowRootOptions` | `object` | - | `{ ...LitElementWw.shadowRootOptions, delegatesFocus: true, }` | ✗ |
| `localize` | - | - | `LOCALIZE` | ✗ |
| `LogicCircuit.scopedElements` | - | - | - | ✗ |
| `lineElements` (`lineElements`) | `Array<Object>` | Array of all connection lines currently drawn in the circuit.<br>Each line connects output terminals to input terminals of gates. | `[]` | ✗ |
| `gateElements` (`gateElements`) | `Array<Gate>` | Array of all gate elements currently placed in the circuit workspace.<br>Includes all types of logic gates, inputs, outputs, and splitters. | `[]` | ✗ |
| `reflectGates` (`reflectGates`) | `String` | Serialized string representation of gates for persistence and reflection.<br>Used internally for state management and saving circuit configurations. | `""` | ✓ |
| `reflectCons` (`reflectCons`) | `String` | Serialized string representation of connections for persistence and reflection.<br>Used internally for state management and saving circuit configurations. | `""` | ✓ |
| `gateID` (`gateID`) | `number` | Internal counter for generating unique gate IDs.<br>Automatically incremented when new gates are added to ensure uniqueness. | `0` | ✗ |
| `lineID` (`lineID`) | `number` | Internal counter for generating unique line/connection IDs.<br>Automatically incremented when new connections are created. | `0` | ✗ |
| `zoom` (`zoom`) | `number` | Current zoom level of the workspace. <br>Values greater than 1 zoom in, values less than 1 zoom out. | `1` | ✗ |
| `dragStartX` (`dragStartX`) | `number` | X-coordinate where dragging operation started.<br>Used internally for calculating drag distances and workspace panning. | `0` | ✗ |
| `dragStartY` (`dragStartY`) | `number` | Y-coordinate where dragging operation started.<br>Used internally for calculating drag distances and workspace panning. | `0` | ✗ |
| `simulate` (`simulate`) | `boolean` | Whether the circuit simulation is currently active.<br>When true, signals propagate through the circuit and visual feedback is shown. | `true` | ✗ |
| `simulationDelay` (`simulationDelay`) | `number` | Delay in milliseconds between simulation steps.<br>Controls how fast signals propagate through the circuit during simulation.<br>Higher values make simulation slower but easier to follow visually. | `500` | ✓ |
| `allowSimulation` (`allowSimulation`) | `number` | Controls whether simulation functionality is enabled.<br>0 = simulation disabled, 1 = simulation enabled.<br>Useful for educational scenarios where you want students to build circuits without testing them. | `1` | ✓ |
| `notGateAllowed` (`notGateAllowed`) | `number` | Maximum number of NOT gates allowed in the circuit.<br>-1 = unlimited, 0 = none allowed, positive number = specific limit.<br>Useful for educational exercises with constraints. | `-1` | ✓ |
| `andGateAllowed` (`andGateAllowed`) | `number` | Maximum number of AND gates allowed in the circuit.<br>-1 = unlimited, 0 = none allowed, positive number = specific limit. | `-1` | ✓ |
| `orGateAllowed` (`orGateAllowed`) | `number` | Maximum number of OR gates allowed in the circuit.<br>-1 = unlimited, 0 = none allowed, positive number = specific limit. | `-1` | ✓ |
| `nandGateAllowed` (`nandGateAllowed`) | `number` | Maximum number of NAND gates allowed in the circuit.<br>-1 = unlimited, 0 = none allowed, positive number = specific limit. | `-1` | ✓ |
| `norGateAllowed` (`norGateAllowed`) | `number` | Maximum number of NOR gates allowed in the circuit.<br>-1 = unlimited, 0 = none allowed, positive number = specific limit. | `-1` | ✓ |
| `xnorGateAllowed` (`xnorGateAllowed`) | `number` | Maximum number of XNOR gates allowed in the circuit.<br>-1 = unlimited, 0 = none allowed, positive number = specific limit. | `-1` | ✓ |
| `xorGateAllowed` (`xorGateAllowed`) | `number` | Maximum number of XOR gates allowed in the circuit.<br>-1 = unlimited, 0 = none allowed, positive number = specific limit. | `-1` | ✓ |
| `splitterAllowed` (`splitterAllowed`) | `number` | Maximum number of splitter components allowed in the circuit.<br>Splitters allow one output to connect to multiple inputs.<br>-1 = unlimited, 0 = none allowed, positive number = specific limit. | `-1` | ✓ |
| `isDragging` (`isDragging`) | `boolean` | Whether the user is currently dragging an element.<br>Used internally for managing drag-and-drop operations. | `false` | ✗ |
| `isDrawingLine` | `boolean` | Whether the user is currently drawing a connection line.<br>Used internally to manage the connection creation process. | `false` | ✗ |
| `startConnector` | `ConnectorElement\|null` | The connector element where line drawing started.<br>Used during the connection creation process. | `null` | ✗ |
| `endConnector` | `ConnectorElement\|null` | The connector element where line drawing will end.<br>Used during the connection creation process. | `null` | ✗ |
| `svgCanvas` | - | Reference to the SVG canvas element used for drawing connections.<br>This element contains all the connection lines between gates. | - | ✗ |
| `workspaceContainer` | - | Reference to the main workspace container element.<br>Contains the entire circuit design area including sidebar and workspace. | - | ✗ |
| `wsDrag` | - | Reference to the draggable workspace area element.<br>This is the main canvas where gates can be placed and moved. | - | ✗ |
| `simCheckbox` | - | Reference to the simulation checkbox element.<br>Used to toggle simulation mode on and off. | - | ✗ |
| `instructionsContainer` | - | Reference to the instructions container element.<br>Contains the help text and usage instructions that can be toggled. | - | ✗ |
| `getGateElements` | - | Getter function that returns the current array of gate elements.<br>Provides external access to the circuit's gate collection. | - | ✗ |
| `getLineElements` | - | Getter function that returns the current array of connection lines.<br>Provides external access to the circuit's connection collection. | - | ✗ |
| `svgPathToMouse` | `SVGPathElement\|null` | SVG path element used for drawing temporary connection lines.<br>Shows a preview line when user is in the process of creating a connection. | `null` | ✗ |

*Fields including [properties](https://developer.mozilla.org/en-US/docs/Glossary/Property/JavaScript) and [attributes](https://developer.mozilla.org/en-US/docs/Glossary/Attribute) define the current state of the widget and offer customization options.*

## Methods
| Name | Description | Parameters |
| :--: | :---------: | :-------: |
| `toggleInstructions` | Toggles the visibility of the instructions panel.<br>Shows/hides the help text that explains how to use the circuit editor. | -
| `handleAllowSimulation` | Handles changes to the simulation enablement setting.<br>Toggles the simulation capability and resets the circuit when changed.<br>Controls whether users can activate circuit simulation mode. | -
| `handleFlipAllGates` | - | -
| `handleMouseDown` | Handles mouse down events on the workspace.<br>Initiates connection drawing when clicking on connectors or starts workspace panning. | `event: MouseEvent`
| `handleMouseMove` | Handles mouse move events on the workspace.<br>Updates workspace panning during drag operations and shows connection preview during line drawing. | `event: MouseEvent`
| `transformWorkspace` | - | -
| `handleMouseUp` | - | -
| `handleWheel` | - | `event`
| `handleMouseOut` | - | `event`
| `handleContextMenu` | - | `event`
| `handleDragOver` | - | `event`
| `handleDrop` | Handles drop events when dragging gates from the sidebar or moving existing gates.<br>Creates new gates when dropped from sidebar, moves existing gates when repositioning,<br>and deletes gates when dropped on trash can. | `event: DragEvent`
| `handleDropTrashCan` | - | `event`
| `handleInputChange` | - | `event`, `propertyName`
| `simulateCircuit` | Initiates circuit simulation by processing all gates in the circuit.<br>Propagates signals through the circuit with timing delays for visual feedback.<br>Only works when simulation is enabled and simulation checkbox is checked. | -
| `resetCircuit` | Resets the entire circuit to its initial state.<br>Clears all signal states and visual indicators, preparing for new simulation. | -
| `calculateBoundaries` | - | -

*[Methods](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Method_definitions) allow programmatic access to the widget.*

## Events
| Name | Description |
| :--: | :---------: |
| gate-added | Fired when a new gate is added to the circuit |
| gate-removed | Fired when a gate is removed from the circuit |
| connection-created | Fired when a new connection is made between gates |
| connection-removed | Fired when a connection is removed |
| simulation-started | Fired when circuit simulation begins |
| simulation-stopped | Fired when circuit simulation ends |

*[Events](https://developer.mozilla.org/en-US/docs/Web/Events) are dispatched by the widget after certain triggers.*

## Editing config
| Name | Value |
| :--: | :---------: |


*The [editing config](https://webwriter.app/docs/packages/configuring/#editingconfig) defines how explorable authoring tools such as [WebWriter](https://webwriter.app) treat the widget.*

*No public slots, custom CSS properties, or CSS parts.*


---
*Generated with @webwriter/build@1.8.1*
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
| `lineElements` (`lineElements`) | `array` | - | `[]` | ✗ |
| `gateElements` (`gateElements`) | `array` | - | `[]` | ✗ |
| `reflectGates` (`reflectGates`) | `String` | - | `""` | ✓ |
| `reflectCons` (`reflectCons`) | `String` | - | `""` | ✓ |
| `gateID` (`gateID`) | `number` | - | `0` | ✗ |
| `lineID` (`lineID`) | `number` | - | `0` | ✗ |
| `zoom` (`zoom`) | `number` | - | `1` | ✗ |
| `dragStartX` (`dragStartX`) | `number` | - | `0` | ✗ |
| `dragStartY` (`dragStartY`) | `number` | - | `0` | ✗ |
| `simulate` (`simulate`) | `boolean` | - | `true` | ✗ |
| `simulationDelay` (`simulationDelay`) | `number` | - | `500` | ✓ |
| `allowSimulation` (`allowSimulation`) | `number` | - | `1` | ✓ |
| `notGateAllowed` (`notGateAllowed`) | `number` | - | `-1` | ✓ |
| `andGateAllowed` (`andGateAllowed`) | `number` | - | `-1` | ✓ |
| `orGateAllowed` (`orGateAllowed`) | `number` | - | `-1` | ✓ |
| `nandGateAllowed` (`nandGateAllowed`) | `number` | - | `-1` | ✓ |
| `norGateAllowed` (`norGateAllowed`) | `number` | - | `-1` | ✓ |
| `xnorGateAllowed` (`xnorGateAllowed`) | `number` | - | `-1` | ✓ |
| `xorGateAllowed` (`xorGateAllowed`) | `number` | - | `-1` | ✓ |
| `splitterAllowed` (`splitterAllowed`) | `number` | - | `-1` | ✓ |
| `isDragging` (`isDragging`) | `boolean` | - | `false` | ✗ |
| `isDrawingLine` | `boolean` | - | `false` | ✗ |
| `startConnector` | `ConnectorElement` | - | `null` | ✗ |
| `endConnector` | `ConnectorElement` | - | `null` | ✗ |
| `svgCanvas` | - | - | - | ✗ |
| `workspaceContainer` | - | - | - | ✗ |
| `wsDrag` | - | - | - | ✗ |
| `simCheckbox` | - | - | - | ✗ |
| `instructionsContainer` | - | - | - | ✗ |
| `getGateElements` | - | - | - | ✗ |
| `getLineElements` | - | - | - | ✗ |
| `svgPathToMouse` | `SVGPathElement \| null` | - | `null` | ✗ |

*Fields including [properties](https://developer.mozilla.org/en-US/docs/Glossary/Property/JavaScript) and [attributes](https://developer.mozilla.org/en-US/docs/Glossary/Attribute) define the current state of the widget and offer customization options.*

## Methods
| Name | Description | Parameters |
| :--: | :---------: | :-------: |
| `toggleInstructions` | - | -
| `handleAllowSimulation` | - | -
| `handleFlipAllGates` | - | -
| `handleMouseDown` | - | `event`
| `handleMouseMove` | - | `event`
| `transformWorkspace` | - | -
| `handleMouseUp` | - | -
| `handleWheel` | - | `event`
| `handleMouseOut` | - | `event`
| `handleContextMenu` | - | `event`
| `handleDragOver` | - | `event`
| `handleDrop` | - | `event`
| `handleDropTrashCan` | - | `event`
| `handleInputChange` | - | `event`, `propertyName`
| `simulateCircuit` | - | -
| `resetCircuit` | - | -
| `calculateBoundaries` | - | -

*[Methods](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Method_definitions) allow programmatic access to the widget.*

## Editing config
| Name | Value |
| :--: | :---------: |


*The [editing config](https://webwriter.app/docs/packages/configuring/#editingconfig) defines how explorable authoring tools such as [WebWriter](https://webwriter.app) treat the widget.*

*No public slots, events, custom CSS properties, or CSS parts.*


---
*Generated with @webwriter/build@1.8.1*
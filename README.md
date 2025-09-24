# WebWriter Logic Circuit Widget

An interactive logic circuit designer that allows users to create, connect, and simulate digital logic circuits. This widget provides a drag-and-drop interface for building circuits with various logic gates.

## Features

- **Interactive Circuit Designer**: Drag and drop logic gates to build circuits
- **Multiple Gate Types**: AND, OR, NOT, NAND, NOR, XOR, XNOR gates
- **Input/Output Gates**: User-controllable inputs and result displays
- **Signal Splitter**: Distribute one signal to multiple destinations
- **Real-time Simulation**: Watch signals propagate through your circuit
- **Configurable Delays**: Control simulation speed
- **Gate Quantity Limits**: Educational constraints for specific learning objectives
- **Truth Table Display**: Show logic tables for individual gates
- **Workspace Controls**: Pan, zoom, and organize your circuit
- **Connection Management**: Visual connection system with right-click removal

## Basic Usage

### Simple Circuit
```html
<webwriter-logic-circuit></webwriter-logic-circuit>
```

### Educational Configuration
```html
<webwriter-logic-circuit 
  allow-simulation="1"
  and-gate-allowed="2"
  or-gate-allowed="1"
  not-gate-allowed="3"
  simulation-delay="1000">
</webwriter-logic-circuit>
```

### Restricted Environment
```html
<webwriter-logic-circuit 
  nand-gate-allowed="0"
  nor-gate-allowed="0"
  xor-gate-allowed="0"
  xnor-gate-allowed="0"
  splitter-allowed="1">
</webwriter-logic-circuit>
```

## Components

### Main Widget: `webwriter-logic-circuit`

The primary component that provides the circuit building interface.

**Key Attributes:**
- `simulation-delay`: Delay between simulation steps (default: 500ms)
- `allow-simulation`: Enable/disable simulation (0 or 1)
- `*-gate-allowed`: Limit specific gate types (-1=unlimited, 0=disabled, >0=limit)

**Methods:**
- `simulateCircuit()`: Start/stop circuit simulation
- `resetCircuit()`: Clear all signals and reset circuit
- `toggleInstructions()`: Show/hide help instructions

### Logic Gates

All logic gates extend the base `Gate` class and provide:
- Input/output connectors
- Truth table display capability
- Drag and drop functionality
- Context menu operations

#### Available Gates:

1. **Input Gate** (`input-gate`): User-controllable signal source
2. **Output Gate** (`output-gate`): Display circuit results
3. **AND Gate** (`and-gate`): Logical AND operation (A ∧ B)
4. **OR Gate** (`or-gate`): Logical OR operation (A ∨ B)
5. **NOT Gate** (`not-gate`): Logical NOT operation (¬A)
6. **NAND Gate** (`nand-gate`): NOT AND operation (¬(A ∧ B))
7. **NOR Gate** (`nor-gate`): NOT OR operation (¬(A ∨ B))
8. **XOR Gate** (`xor-gate`): Exclusive OR operation (A ⊕ B)
9. **XNOR Gate** (`xnor-gate`): Exclusive NOR operation (¬(A ⊕ B))
10. **Splitter** (`splitter-gate`): Signal distribution (1 input → 2 outputs)

### Connector System

**Connector Element** (`connector-element`): Connection points on gates
- Visual feedback for signal states
- Click-based connection creation
- Automatic signal propagation

## How to Build Circuits

1. **Add Gates**: Drag gates from the sidebar to the workspace
2. **Make Connections**: 
   - Left-click on an output connector
   - Left-click on an input connector to complete the connection
3. **Set Inputs**: Click on input gates to toggle their values
4. **Run Simulation**: Enable simulation to see signals propagate
5. **View Results**: Check output gates for circuit results
6. **Remove Elements**: Drag unwanted items to the trash can
7. **Remove Connections**: Right-click on connections to delete them

## Events

The widget fires custom events for integration:
- `gate-added`: When a gate is added
- `gate-deleted`: When a gate is removed
- `connection-made`: When gates are connected
- `connection-removed`: When connections are removed
- `simulation-started`: When simulation begins
- `simulation-stopped`: When simulation stops

## Educational Use Cases

### Basic Logic Gates
```html
<webwriter-logic-circuit 
  and-gate-allowed="3"
  or-gate-allowed="3"
  not-gate-allowed="2"
  nand-gate-allowed="0"
  nor-gate-allowed="0"
  xor-gate-allowed="0"
  xnor-gate-allowed="0">
</webwriter-logic-circuit>
```

### Advanced Circuits
```html
<webwriter-logic-circuit 
  simulation-delay="2000"
  splitter-allowed="2">
</webwriter-logic-circuit>
```

### Logic Puzzle Mode
```html
<webwriter-logic-circuit 
  allow-simulation="0"
  and-gate-allowed="1"
  or-gate-allowed="1"
  not-gate-allowed="1">
</webwriter-logic-circuit>
```

## CSS Customization

The widget provides CSS custom properties for styling:

```css
webwriter-logic-circuit {
  --logic-circuit-background: #f5f5f5;
  --logic-circuit-sidebar-width: 200px;
  --logic-circuit-gate-color: #ffffff;
  --logic-circuit-connection-color: #000000;
  --logic-circuit-active-connection-color: #ff0000;
}
```

## Truth Tables

All logic gates support truth table display. Right-click on a gate and select "Show Truth Table" to see its logic behavior.

## Example Circuits

### Half Adder Circuit
A half adder adds two single binary digits and produces a sum and carry output.

**Components needed**: 2 Input gates, 1 XOR gate, 1 AND gate, 2 Output gates

**Configuration**:
```html
<webwriter-logic-circuit 
  xor-gate-allowed="1"
  and-gate-allowed="1"
  simulation-delay="1000">
</webwriter-logic-circuit>
```

**Circuit Logic**:
- Sum = A XOR B
- Carry = A AND B

### Full Adder Circuit
A full adder adds three binary digits (including carry from previous addition).

**Components needed**: 3 Input gates, 2 XOR gates, 2 AND gates, 1 OR gate, 2 Output gates

**Configuration**:
```html
<webwriter-logic-circuit 
  xor-gate-allowed="2"
  and-gate-allowed="2"
  or-gate-allowed="1"
  simulation-delay="1500">
</webwriter-logic-circuit>
```

### SR Latch (Set-Reset Latch)
A basic memory element using NOR gates.

**Components needed**: 2 Input gates, 2 NOR gates, 2 Output gates, 1 Splitter

**Configuration**:
```html
<webwriter-logic-circuit 
  nor-gate-allowed="2"
  splitter-allowed="1"
  simulation-delay="800">
</webwriter-logic-circuit>
```

### 2-to-1 Multiplexer
Selects one of two inputs based on a control signal.

**Components needed**: 3 Input gates, 2 AND gates, 1 OR gate, 1 NOT gate, 1 Output gate

**Configuration**:
```html
<webwriter-logic-circuit 
  and-gate-allowed="2"
  or-gate-allowed="1"
  not-gate-allowed="1"
  simulation-delay="1200">
</webwriter-logic-circuit>
```

## Building Complex Circuits

The widget supports building complex circuits like:
- Half adders and full adders
- Flip-flops and latches
- Multiplexers and demultiplexers
- Encoders and decoders
- Custom combinational logic

## Troubleshooting

### Connection Issues

**Gates won't connect**: 
- Ensure you're connecting outputs to inputs, not input-to-input or output-to-output
- Check that the target input isn't already connected (most inputs accept only one connection)
- Verify both connectors are visible and clickable

**Connections disappear**: 
- Right-clicking removes connections - avoid accidental right-clicks
- Check that neither connected gate was deleted

### Simulation Issues

**Simulation not working**: 
- Check that `allow-simulation` is set to 1
- Ensure your circuit has input gates with defined values
- Verify all connections are properly made
- Check that there are no circular dependencies in the circuit

**Signals not propagating**: 
- Input gates need to be clicked to set their values
- Ensure the simulation delay isn't too fast to observe
- Check for broken connections in the signal path

**Unexpected output values**:
- Verify the logic gate truth tables
- Check for unconnected inputs (they may default to false or null)
- Ensure input gates are set to desired values

### Gate Management

**Gates disappearing**: 
- Check the gate limit attributes - gates may be disabled if limits are set to 0
- Verify you're not exceeding the maximum allowed count for each gate type
- Don't drag gates outside the workspace boundaries

**Can't add more gates**:
- Check the `*-gate-allowed` attributes for limits
- Some educational configurations restrict gate quantities
- Clear the workspace if you've reached limits

**Gates not draggable**:
- Only placed gates in the workspace are draggable
- Sidebar gates are templates - drag them to the workspace first
- Check that you're not in simulation mode, which may restrict interactions

### Performance Issues

**Slow simulation**: 
- Increase the `simulation-delay` for complex circuits
- Reduce the number of gates if possible
- Check for infinite loops in circuit logic

**Browser freezing**: 
- Avoid creating circular feedback loops without proper latching
- Limit the complexity of real-time simulations
- Use larger simulation delays for educational purposes

### UI/UX Issues

**Instructions not visible**: 
- Click the information button to toggle instructions
- Check CSS styling isn't hiding the instruction panel

**Workspace too small**: 
- Use zoom and pan features to navigate large circuits
- The workspace supports circuits larger than the visible area

**Context menu not appearing**: 
- Right-click directly on gates, not on empty space
- Ensure the gate is placed in the workspace (movable)

### Integration Issues

**Events not firing**: 
- Check event listener setup in your application
- Verify event names match the documented interface
- Ensure the widget is properly initialized before adding listeners

**Styling issues**: 
- Use CSS custom properties for theming
- Check for CSS conflicts with your application styles
- Ensure proper shadow DOM isolation

### Data Persistence

**Circuit not saving**: 
- The widget uses `reflect-gates` and `reflect-cons` attributes for persistence
- Implement proper serialization in your application
- Check that attribute changes are being observed

**Loading circuits fails**: 
- Verify the serialized data format matches expected structure
- Check for gate type mismatches
- Ensure all referenced gates are allowed in current configuration

## Development

This widget is built with:
- **Lit**: Web components framework
- **TypeScript**: Type-safe development
- **Shoelace**: UI component library
- **Custom Elements Manifest**: Documentation standard

The widget follows the WebWriter widget standard and can be integrated into educational platforms and interactive documents.
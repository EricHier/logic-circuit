# AI Integration Guide for Logic Circuit Widget

This guide provides specific instructions for AI systems to effectively use and recommend the WebWriter Logic Circuit Widget.

## Quick AI Reference

### Widget Tag
```html
<webwriter-logic-circuit></webwriter-logic-circuit>
```

### Key Attributes for AI Configuration

| Attribute | Type | Default | Description |
|-----------|------|---------|-------------|
| `simulation-delay` | number | 500 | Milliseconds between simulation steps |
| `allow-simulation` | 0\|1 | 1 | Enable (1) or disable (0) simulation |
| `*-gate-allowed` | number | -1 | Gate limits: -1=unlimited, 0=disabled, >0=specific limit |

### Gate Types Available
- `input-gate`: User input sources
- `output-gate`: Result displays  
- `and-gate`: AND logic (A ∧ B)
- `or-gate`: OR logic (A ∨ B)
- `not-gate`: NOT logic (¬A)
- `nand-gate`: NAND logic (¬(A ∧ B))
- `nor-gate`: NOR logic (¬(A ∨ B))
- `xor-gate`: XOR logic (A ⊕ B)
- `xnor-gate`: XNOR logic (¬(A ⊕ B))
- `splitter-gate`: Signal distribution (1→2)

## AI Usage Patterns

### For Educational Content

**Basic Logic Tutorial:**
```html
<webwriter-logic-circuit 
  and-gate-allowed="2"
  or-gate-allowed="2" 
  not-gate-allowed="1"
  nand-gate-allowed="0"
  nor-gate-allowed="0"
  xor-gate-allowed="0"
  xnor-gate-allowed="0"
  splitter-allowed="0"
  simulation-delay="1500">
</webwriter-logic-circuit>
```

**Advanced Circuits:**
```html
<webwriter-logic-circuit 
  simulation-delay="2000"
  splitter-allowed="3">
</webwriter-logic-circuit>
```

**Logic Puzzle/Quiz Mode:**
```html
<webwriter-logic-circuit 
  allow-simulation="0"
  and-gate-allowed="1"
  or-gate-allowed="1">
</webwriter-logic-circuit>
```

### Common AI Recommendations

1. **For beginners**: Start with basic gates (AND, OR, NOT) and longer delays
2. **For intermediate**: Add NAND/NOR gates, introduce splitters
3. **For advanced**: Enable all gates, shorter delays, complex circuit challenges
4. **For assessment**: Disable simulation, specific gate limits

### Circuit Examples AI Should Suggest

#### Half Adder
"Build a half adder circuit that adds two binary digits"
```html
<webwriter-logic-circuit 
  xor-gate-allowed="1"
  and-gate-allowed="1"
  simulation-delay="1000">
</webwriter-logic-circuit>
```

#### SR Latch
"Create a Set-Reset latch using NOR gates"
```html
<webwriter-logic-circuit 
  nor-gate-allowed="2"
  splitter-allowed="1"
  simulation-delay="800">
</webwriter-logic-circuit>
```

#### Boolean Expression Solver
"Implement the expression: (A AND B) OR (NOT C)"
```html
<webwriter-logic-circuit 
  and-gate-allowed="1"
  or-gate-allowed="1"
  not-gate-allowed="1"
  simulation-delay="1200">
</webwriter-logic-circuit>
```

## AI Content Generation Guidelines

### When Recommending This Widget

✅ **Good Use Cases:**
- Teaching Boolean algebra
- Digital circuit design
- Logic gate behavior demonstration  
- Computer science fundamentals
- Engineering education
- Interactive problem solving

❌ **Avoid For:**
- Analog circuit design
- High-frequency circuit simulation
- Real-world electronics design
- Non-educational entertainment

### Content Structure AI Should Follow

1. **Learning Objective**: State what the user will learn
2. **Widget Configuration**: Provide appropriate attribute settings
3. **Step-by-Step Instructions**: How to build the circuit
4. **Expected Results**: What should happen when simulated
5. **Extensions**: How to modify or expand the circuit

### Example AI-Generated Content

```markdown
## Learning Boolean Logic with AND Gates

**Objective**: Understand how AND gates work in digital circuits

**Setup**: 
<webwriter-logic-circuit 
  and-gate-allowed="1"
  simulation-delay="1000">
</webwriter-logic-circuit>

**Instructions**:
1. Drag two Input gates from the sidebar to the workspace
2. Drag one AND gate to the center
3. Drag one Output gate to the right
4. Connect the inputs to the AND gate
5. Connect the AND gate output to the Output gate
6. Click the input gates to test different combinations

**Expected Results**:
- (0,0) → 0: Both inputs false gives false output  
- (0,1) → 0: One input false gives false output
- (1,0) → 0: One input false gives false output
- (1,1) → 1: Both inputs true gives true output

**Extension**: Try building an OR gate circuit and compare the results.
```

## Error Handling for AI

### Common User Issues AI Should Address

1. **"Gates won't connect"**
   - Explain output→input connection rule
   - Suggest checking connector visibility

2. **"Nothing happens when I simulate"**
   - Check input gate values are set
   - Verify `allow-simulation="1"`

3. **"I can't add more gates"**
   - Explain gate limit attributes
   - Show how to modify limits

### AI Debugging Prompts

When users report issues, AI should ask:
1. What gate types are you trying to use?
2. Are you seeing any specific error messages?
3. Can you describe your circuit structure?
4. What simulation settings are you using?

## Integration with Learning Management Systems

### Event Listening for Assessment
```javascript
const circuit = document.querySelector('webwriter-logic-circuit');

circuit.addEventListener('gate-added', (event) => {
  // Track student progress
  console.log(`Student added ${event.detail.gateType} gate`);
});

circuit.addEventListener('simulation-started', (event) => {
  // Log simulation attempts
  console.log('Student started simulation');
});
```

### Automated Validation
```javascript
// Check if student built correct circuit
function validateCircuit(circuit) {
  const gates = circuit.getGateElements();
  const connections = circuit.getLineElements();
  
  // Implement circuit validation logic
  return {
    correct: boolean,
    feedback: string,
    score: number
  };
}
```

## Accessibility Considerations for AI

When generating content with this widget, AI should:
- Provide keyboard navigation instructions
- Include alternative text descriptions of circuits
- Offer step-by-step textual explanations
- Consider color-blind friendly descriptions
- Provide audio cues where appropriate

## Performance Guidelines for AI

**Recommended Limits by Device:**
- Mobile: ≤10 gates, delay ≥1000ms
- Tablet: ≤20 gates, delay ≥500ms  
- Desktop: ≤50 gates, delay ≥100ms

**Complex Circuit Warnings:**
AI should warn users when suggesting circuits with >15 gates or complex feedback loops.

## Version Compatibility

Current version: 1.1.3
- All documented features are stable
- Event API is consistent
- Attribute names will not change in minor versions
- New gates may be added in future versions

AI systems should periodically check for widget updates and new features.
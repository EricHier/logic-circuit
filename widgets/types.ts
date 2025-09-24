/**
 * Type definitions for the Logic Circuit Widget
 * 
 * This file defines the TypeScript interfaces and types used throughout
 * the logic circuit components for better documentation and type safety.
 */

/**
 * Possible gate types in the circuit
 */
export type GateType = 'AND' | 'OR' | 'NOT' | 'NAND' | 'NOR' | 'XOR' | 'XNOR' | 'INPUT' | 'OUTPUT' | 'SPLITTER';

/**
 * Signal value in the circuit
 */
export type SignalValue = boolean | null;

/**
 * Connector type for input/output endpoints
 */
export type ConnectorType = 'input' | 'output';

/**
 * Gate configuration for quantity limits
 */
export interface GateAllowanceConfig {
  /** Unlimited gates (-1), disabled (0), or specific limit (>0) */
  notGateAllowed?: number;
  /** Unlimited gates (-1), disabled (0), or specific limit (>0) */
  andGateAllowed?: number;
  /** Unlimited gates (-1), disabled (0), or specific limit (>0) */
  orGateAllowed?: number;
  /** Unlimited gates (-1), disabled (0), or specific limit (>0) */
  nandGateAllowed?: number;
  /** Unlimited gates (-1), disabled (0), or specific limit (>0) */
  norGateAllowed?: number;
  /** Unlimited gates (-1), disabled (0), or specific limit (>0) */
  xorGateAllowed?: number;
  /** Unlimited gates (-1), disabled (0), or specific limit (>0) */
  xnorGateAllowed?: number;
  /** Unlimited gates (-1), disabled (0), or specific limit (>0) */
  splitterAllowed?: number;
}

/**
 * Circuit simulation configuration
 */
export interface SimulationConfig {
  /** Whether simulation is enabled (1) or disabled (0) */
  allowSimulation?: 0 | 1;
  /** Delay in milliseconds between simulation steps */
  simulationDelay?: number;
}

/**
 * Complete configuration for the logic circuit widget
 */
export interface LogicCircuitConfig extends GateAllowanceConfig, SimulationConfig {
  /** Additional widget-specific configurations */
  [key: string]: any;
}

/**
 * Event detail for gate-related events
 */
export interface GateEventDetail {
  /** The gate element involved in the event */
  gate: HTMLElement;
  /** Type of gate */
  gateType: GateType;
  /** Unique ID of the gate */
  gateId: string;
}

/**
 * Event detail for connection-related events
 */
export interface ConnectionEventDetail {
  /** Source connector element */
  sourceConnector: HTMLElement;
  /** Target connector element */
  targetConnector: HTMLElement;
  /** Connection ID */
  connectionId: string;
}

/**
 * Event detail for simulation events
 */
export interface SimulationEventDetail {
  /** Whether simulation is starting (true) or stopping (false) */
  isRunning: boolean;
  /** Current simulation delay setting */
  delay: number;
}

/**
 * Custom event types fired by the logic circuit widget
 */
export interface LogicCircuitEventMap {
  'gate-added': CustomEvent<GateEventDetail>;
  'gate-deleted': CustomEvent<GateEventDetail>;
  'connection-made': CustomEvent<ConnectionEventDetail>;
  'connection-removed': CustomEvent<ConnectionEventDetail>;
  'simulation-started': CustomEvent<SimulationEventDetail>;
  'simulation-stopped': CustomEvent<SimulationEventDetail>;
}

/**
 * Truth table entry for logic gates
 */
export interface TruthTableEntry {
  /** Input values */
  inputs: SignalValue[];
  /** Expected output */
  output: SignalValue;
}

/**
 * Position coordinates for elements
 */
export interface Position {
  x: number;
  y: number;
}

/**
 * Gate placement information
 */
export interface GatePlacement {
  /** Gate type */
  type: GateType;
  /** Position in workspace */
  position: Position;
  /** Unique identifier */
  id: string;
  /** Whether gate is movable */
  movable: boolean;
}

/**
 * Connection information between gates
 */
export interface ConnectionInfo {
  /** Source gate ID */
  sourceGateId: string;
  /** Source connector type */
  sourceConnector: string;
  /** Target gate ID */
  targetGateId: string;
  /** Target connector type */
  targetConnector: string;
  /** Connection ID */
  id: string;
}
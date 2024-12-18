import { Edge } from "@xyflow/react";
import { ConditionBlockMap } from "./types";
import { useNodeStore } from "@/lib/store/nodeStore";

interface ConditionPayload {
  [nodeId: string]: {
    node: string;
    type: "entry" | "exit" | "adjustment";
    maxentries: number;
    conditions: Array<Array<[string, string, string | number]>>;
    check_when_position_open: boolean;
    check_when_trigger_open: boolean;
    actions: string[];
  };
}

// Operator mapping from UI to API format
const operatorMap: Record<string, string> = {
  "is_above": "greater_than",
  "is_below": "less_than",
  "above_or_equal": "greater_than_equal",
  "below_or_equal": "less_than_equal",
  "equals": "equal_to",
  "cross_above": "crosses_above",
  "cross_below": "crosses_below"
};

export const transformConditionToPayload = (
  state: ConditionBlockMap
): ConditionPayload => {
  const payload: ConditionPayload = {};
  const allEdges: Edge[] = useNodeStore.getState().edges;

  for (const [nodeId, nodeData] of Object.entries(state)) {
    // Get connected action nodes
    const actions = allEdges
      .filter(e => e.source === nodeId && e.target.startsWith('ac'))
      .map(e => e.target);

    // Initialize node data
    const nodePayload = {
      node: nodeId,
      type: nodeData.type,
      description: nodeData.name,
      maxentries: nodeData.maxEntries,
      conditions: [] as Array<Array<[string, string, string | number]>>,
      check_when_position_open: nodeData.type === "exit" ? false : nodeData.positionOpen,
      check_when_trigger_open: nodeData.type === "exit" ? false : nodeData.waitTrigger,
      actions
    };

    // Transform conditions
    const compiledConditions: Array<Array<[string, string, string | number]>> = [];
    
    nodeData.blocks.forEach((block) => {
      const blockConditions: Array<[string, string, string | number]> = [];
      
      block.subSections.forEach((section, idx) => {
        if (!section.lhs || !section.operator || !section.rhs) return;

        // Construct the LHS part
        let lhs = section.lhs;
        if (section.column) {
          lhs += `.${section.column}`;
        }
        if (section.selectedPeriod) {
          lhs += `.${section.selectedPeriod}`;
        }

        // Construct the RHS part
        let rhs: string | number = section.rhs;
        if (section.rhs === "value" && section._rhsValue) {
          const numValue = parseFloat(section._rhsValue);
          rhs = isNaN(numValue) ? section._rhsValue : numValue;
        }

        // Get mapped operator
        // const operator = operatorMap[section.operator] || section.operator;
        const operator = section.operator;

        blockConditions.push([lhs, operator, rhs]);

        // Add the AND/OR operator between conditions if not the last one
        if (idx < block.subSections.length - 1) {
          blockConditions.push([section.addBadge.toLowerCase()] as any);
        }
      });

      if (blockConditions.length > 0) {
        compiledConditions.push(blockConditions);
      }
    });

    nodePayload.conditions = compiledConditions;
    payload[nodeId] = nodePayload;
  }

  return payload;
};

// Helper function to validate a condition block
export const validateConditionBlock = (
  nodeId: string,
  block: ConditionBlockMap[string]
): boolean => {
  if (!block.type || !["entry", "exit", "adjustment"].includes(block.type)) {
    console.warn(`Invalid block type for node ${nodeId}`);
    return false;
  }

  if (!Array.isArray(block.blocks)) {
    console.warn(`Invalid blocks array for node ${nodeId}`);
    return false;
  }

  // Validate each block has valid subsections
  return block.blocks.every(b => 
    b.subSections.every(s => 
      s.lhs && s.operator && (s.rhs || s._rhsValue)
    )
  );
};

// Helper function to transform a single condition node
export const transformSingleCondition = (
  nodeId: string,
  block: ConditionBlockMap[string]
): ConditionPayload => {
  return transformConditionToPayload({ [nodeId]: block });
};
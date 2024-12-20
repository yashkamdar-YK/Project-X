import { Edge } from "@xyflow/react";
import { ConditionBlockMap } from "./types";
import { useNodeStore } from "@/lib/store/nodeStore";

interface ConditionPayload {
  [nodeId: string]: {
    node: string;
    type: "entry" | "exit" | "adjustment";
    maxentries: number;
    conditions: Array<Array<[string, string, string | number] | string> | string>;
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

// Format time to remove seconds
const formatTime = (time: string) => {
  if (time.includes(':')) {
    const parts = time.split(':');
    if (parts.length >= 2) {
      return `${parts[0]}:${parts[1]}`;
    }
  }
  return time;
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
      maxentries: nodeData.maxEntries,
      conditions: [] as Array<Array<[string, string, string | number] | string> | string>,
      check_when_position_open: nodeData.type === "exit" ? false : nodeData.positionOpen,
      check_when_trigger_open: nodeData.type === "exit" ? false : nodeData.waitTrigger,
      actions
    };

    // Transform conditions
    nodeData.blocks.forEach((block, blockIndex) => {
      const blockConditions: Array<[string, string, string | number] | string> = [];
      
      // Filter out empty sections first
      const validSections = block.subSections.filter(
        section => section.lhs && section.operator && section.rhs
      );

      validSections.forEach((section, idx) => {
        // Construct the LHS part
        let lhs = section.lhs;
        if (section.column) {
          lhs += `.${section.column}`;
        }
        if (section.selectedPeriod) {
          lhs += `.${section.selectedPeriod}`;
          if (section.selectedPeriod === 'prev-n' && section.nValue) {
            lhs += `.${section.nValue}`;
          }
        }

        // Construct the RHS part
        let rhs: string | number = section.rhs;
        if (section.rhs === "value" && section._rhsValue) {
          // Format time if the lhs is candle_close_time
          if (section.lhs === "candle_close_time") {
            rhs = formatTime(section._rhsValue);
          } else {
            const numValue = parseFloat(section._rhsValue);
            rhs = isNaN(numValue) ? section._rhsValue : numValue;
          }
        } else {
          if (section.rhs_column) {
            rhs += `.${section.rhs_column}`;
          }
          if (section.rhs_selectedPeriod) {
            rhs += `.${section.rhs_selectedPeriod}`;
            if (section.rhs_selectedPeriod === 'prev-n' && section.rhs_nValue) {
              rhs += `.${section.rhs_nValue}`;
            }
          }
        }

        // Map the operator
        // const operator = operatorMap[section.operator] || section.operator;
        const operator = section.operator;

        // Add condition
        blockConditions.push([lhs, operator, rhs]);

        // Add the AND/OR operator only if there's another valid condition following
        if (idx < validSections.length - 1) {
          blockConditions.push(section.addBadge.toLowerCase());
        }
      });

      if (blockConditions.length > 0) {
        nodePayload.conditions.push(blockConditions);

        // Add block relation if there's another block with conditions following
        if (blockIndex < nodeData.blocks.length - 1 && 
            nodeData.blocks[blockIndex + 1].subSections.some(s => s.lhs && s.operator && s.rhs) && 
            nodeData.blockRelations[blockIndex]) {
          nodePayload.conditions.push(nodeData.blockRelations[blockIndex].toLowerCase());
        }
      }
    });

    payload[nodeId] = nodePayload;
  }

  return payload;
};
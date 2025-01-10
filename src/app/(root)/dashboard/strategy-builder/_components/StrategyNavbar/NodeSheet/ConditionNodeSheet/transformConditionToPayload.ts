import { Edge } from "@xyflow/react";
import { ConditionBlockMap } from "./types";
import { useNodeStore } from "@/lib/store/nodeStore";
import { useDataPointsStore } from "@/lib/store/dataPointsStore";
import { useIndicatorStore } from "@/lib/store/IndicatorStore";
import { useApplyDataStore } from "@/lib/store/applyDataStore";
import { VALID_DAYS } from "./_const";

interface ConditionPayload {
  [nodeId: string]: {
    node: string;
    type: "entry" | "exit" | "adjustment";
    description?: string;
    maxentries: number;
    conditions: Array<Array<[string, string, string | number] | string> | string>;
    check_when_position_open: boolean;
    check_when_trigger_open: boolean;
    actions: string[];
  };
}

// Helper function to get element options and validate type
const getElementOptions = (
  elementName: string,
  datapoints: any[],
  indicators: any[],
  getData: any
) => {
  // Check in datapoints
  const dataPoint = datapoints.find(dp => dp.elementName === elementName);
  if (dataPoint) return dataPoint.options;
  
  // Check in indicators
  const indicator = indicators.find(ind => ind.elementName === elementName);
  if (indicator) return indicator.options;
  
  // Check in default options
  return getData(elementName);
};

// Helper function to check if columns are available
const hasColumns = (options: any) => {
  return options?.columnsAvailable && options.columnsAvailable.length > 0;
};

// Helper function to check if candle location is available
const hasCandleLocation = (options: any) => {
  return options?.candleLocation === true;
};

const isTimeOrDayField = (elementName: string) => {
  const timeFields = ['candle_time', 'candle_close_time', 'day_of_week'];
  return timeFields.includes(elementName);
};

// Helper function to construct path with validation
const constructPath = (
  base: string,
  options: any,
  column?: string,
  period?: string,
  nValue?: number
) => {
  let path = base;

  // Only add column if the element has columns available
  if (column && (hasColumns(options) || base?.includes("ac"))) {
    path += `.${column}`;
  }

  // Only add period if the element has candle location
  if (period && hasCandleLocation(options)) {
    if (period === "prev-n" && nValue) {
      path += `.prev-${nValue}`;
    } else {
      path += `.${period}`;
    }
  }

  return path;
};

// Helper function to handle RHS value based on type
const constructRhsValue = (
  rhs: string,
  rhsValue: string | undefined,
  lhsOptions: any,
  getDataFn: any
) => {
  // Handle special cases first
  if (lhsOptions?.type === "day_of_week" && VALID_DAYS.includes(rhs)) {
    return rhs;
  }

  if (rhs === "value" && rhsValue !== undefined) {
    if (lhsOptions?.type === "dte" || lhsOptions?.canComparedwith?.includes("int") ||  lhsOptions?.canComparedwith?.includes("values")) {
      const numValue = Number(rhsValue);
      return !isNaN(numValue) ? numValue : rhsValue;
    }
    return rhsValue;
  }

  return rhs;
};

export const transformConditionToPayload = (
  state: ConditionBlockMap
): ConditionPayload => {
  const payload: ConditionPayload = {};
  const allEdges: Edge[] = useNodeStore.getState().edges;
  const datapoints = useDataPointsStore.getState().dataPoints;
  const indicators = useIndicatorStore.getState().indicators;
  const getData = useApplyDataStore.getState().getData;

  for (const [nodeId, nodeData] of Object.entries(state)) {
    const actions = allEdges
      .filter((e) => e.source === nodeId && e.target.startsWith("ac"))
      .map((e) => e.target);

    const nodePayload = {
      node: nodeId,
      description: nodeData.name,
      type: nodeData.type,
      maxentries: nodeData.maxEntries,
      conditions: [] as Array<Array<[string, string, string | number] | string> | string>,
      check_when_position_open: nodeData.type === "exit" ? false : nodeData.positionOpen,
      check_when_trigger_open: nodeData.type === "exit" ? false : nodeData.waitTrigger,
      actions,
    };

    nodeData.blocks.forEach((block, blockIndex) => {
      const blockConditions: Array<[string, string, string | number] | string> = [];

      const validSections = block.subSections.filter(
        (section) => section.lhs && section.operator && (section.rhs || section._rhsValue)
      );

      validSections.forEach((section, idx) => {
        // Get options for LHS and validate
        const lhsOptions = getElementOptions(section.lhs, datapoints, indicators, getData);
        
        // Handle LHS path construction with validation
        const lhs = constructPath(
          section.lhs,
          lhsOptions,
          section.column,
          section.selectedPeriod,
          section.nValue
        );

        // Handle RHS value/path construction
        let rhs: string | number;
        
        if (section.rhs === "value") {
          // Handle direct value input
          rhs = constructRhsValue(section.rhs, section._rhsValue, lhsOptions, getData);
        } else if (isTimeOrDayField(section.lhs)) {
          // Handle time and day fields directly
          rhs = section.rhs;
        } else {
          // Handle RHS path construction
          const rhsOptions = getElementOptions(section.rhs, datapoints, indicators, getData);
          rhs = constructPath(
            section.rhs,
            rhsOptions,
            section.rhs_column,
            section.rhs_selectedPeriod,
            section.rhs_nValue
          );
        }

        blockConditions.push([lhs, section.operator, rhs]);

        if (idx < validSections.length - 1) {
          blockConditions.push(section.addBadge.toLowerCase());
        }
      });

      if (blockConditions.length > 0) {
        nodePayload.conditions.push(blockConditions);

        if (
          blockIndex < nodeData.blocks.length - 1 &&
          nodeData.blocks[blockIndex + 1].subSections.some(
            (s) => s.lhs && s.operator && s.rhs
          ) &&
          nodeData.blockRelations[blockIndex]
        ) {
          nodePayload.conditions.push(
            nodeData.blockRelations[blockIndex].toLowerCase()
          );
        }
      }
    });

    payload[nodeId] = nodePayload;
  }

  return payload;
};
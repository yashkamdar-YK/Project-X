// reformStrategy.ts
import {
  TStrategyInfo,
  DataPoint,
  Indicator,
  ActionNode,
  Condition,
  NodeLocation,
  EdgeLocation,
} from "./strategyTypes";
import { useActionStore } from "@/lib/store/actionStore";
import { useConditionStore } from "@/lib/store/conditionStore";
import { useDataPointsStore } from "@/lib/store/dataPointsStore";
import { useDataPointStore } from "@/lib/store/dataPointStore";
import { useIndicatorStore } from "@/lib/store/IndicatorStore";
import { useNodeStore } from "@/lib/store/nodeStore";
import { useSettingStore } from "@/lib/store/settingStore";
import {
  BlockRelation,
  ConditionBlockMap,
  SubSection,
} from "../_components/StrategyNavbar/NodeSheet/ConditionNodeSheet/types";

// Reform Data Points Store
const reformDataPoints = (data: DataPoint[]) => {
  const dataPointsStore = useDataPointsStore.getState();

  const dataPoints = data?.map((dp) => {
    // Base data point structure
    const baseDataPoint = {
      id: `dp-${Date.now()}-${Math.random()}`,
      elementName: dp.name,
      type: dp.type === "candleData" ? "candle-data" : "days-to-expire",
      options: dp.options,
    };

    // For days-to-expire data points
    if (dp.type === "dte") {
      return {
        ...baseDataPoint,
        //@ts-ignore
        expiryType: dp.params?.expType,
        //@ts-ignore
        expiryOrder: dp.params?.expNo?.toString(),
      };
    }

    // For candle data points
    const candleDataPoint = {
      ...baseDataPoint,
      dataType: dp.params.dataType.toUpperCase(),
      candleType: dp.params.candleType,
      duration: dp.params.dataLength.toString(),
    };

    // Add expiry and strike selection only for OPT and FUT
    if (dp.params.dataType !== "spot") {
      return {
        ...candleDataPoint,
        expiryType: dp.params.exp?.expType,
        expiryOrder: dp.params.exp?.expNo?.toString(),
        ...(dp.params.dataType === "opt"
          ? { optionType: dp.params?.opType }
          : {}),
        ...(dp.params.dataType === "opt" &&
          dp.params.strike && {
            strikeSelection: {
              mode: dp.params.strike.by,
              position: dp.params.strike.at,
            },
          }),
      };
    }

    return candleDataPoint;
  });
  //@ts-ignore
  dataPointsStore.setDataPoints(dataPoints);
};

// Reform Indicators Store
const reformIndicators = (indicators: Indicator[]) => {
  const indicatorStore = useIndicatorStore.getState();

  const reformedIndicators = indicators?.map((indicator) => ({
    id: `ind-${Date.now()}-${Math.random()}`,
    type: indicator.indicator,
    elementName: indicator.name,
    onData: indicator.onData,
    timeFrame: 0,
    settings: {
      length: indicator?.params?.length.toString(),
      source: indicator?.columns?.[0],
      offset: indicator?.params?.offset?.toString(),
      ...(indicator?.params?.multiplier && {
        multiplier: indicator.params.multiplier.toString(),
      }),
    },
    options: indicator.options,
  }));

  //@ts-ignore
  indicatorStore.setIndicators(reformedIndicators);
};

// Reform Actions Store
const reformActions = (actions: { [key: string]: ActionNode }) => {
  const actionStore = useActionStore.getState();
  const reformedActions: any = {};

  Object.entries(actions).forEach(([nodeId, actionData]) => {
    const items: any[] = [];

    // Convert actions in their original sequence
    actionData.act.forEach((action, index) => {
      if (action.func === "addLeg" && action.params) {
        // Position items
        const positionId = `position-${Date.now()}-${Math.random()}`;
        items.push({
          id: positionId,
          type: "position",
          order: index,
          data: {
            id: positionId, // Use same ID for both item and position
            settings: {
              legID: action.params.legID || index + 1, // Ensure legID is set
              segment: action.params.segment || "OPT",
              transactionType: action.params.transactionType || "buy",
              optionType: action.params.optionType || "CE",
              qty: action.params.qty || 0,
              strikeBy: action.params.strikeBy || "moneyness",
              strikeVal: action.params.strikeVal || 0,
              expType: action.params.expType || "weekly",
              expNo: action.params.expNo || 0,
              // Target settings
              isTarget: !!action.params.targetValue,
              targetOn: action.params.targetOn === 'val' ? "₹" : "%",
              targetValue: action.params.targetValue || 0,
              // Stop Loss settings
              isSL: !!action.params.SLvalue,
              SLon: action.params.SLon === 'val' ? "₹" : "%",
              SLvalue: action.params.SLvalue || 0,
              // Trail Stop Loss settings
              isTrailSL: action.params.isTrailSL || false,
              trailSLon: action.params.trailSLon === 'val' ? "₹" : "%",
              trailSL_X: action.params.trailSL_X || 0,
              trailSL_Y: action.params.trailSL_Y || 0,
              // Wait Trade settings
              isWT: !!action.params.wtVal,
              wtOn: action.params.wtOn || "val-up",
              wtVal: action.params.wtVal || 0,
              // Re-entry Target settings
              isReEntryTg: action.params.isReEntryTg || false,
              reEntryTgOn: action.params.reEntryTgOn || "asap",
              reEntryTgVal: action.params.reEntryTgVal || 0,
              reEntryTgMaxNo: action.params.reEntryTgMaxNo || 1,
              // Re-entry Stop Loss settings
              isReEntrySL: action.params.isReEntrySL || false,
              reEntrySLOn: action.params.reEntrySLOn || "asap",
              reEntrySLVal: action.params.reEntrySLVal || 0,
              reEntrySLMaxNo: action.params.reEntrySLMaxNo || 1,
            },
          },
        });
      } else {
        // Regular action items
        const actionId = `action-${Date.now()}-${Math.random()}`;
        items.push({
          id: actionId,
          type: "action",
          order: index,
          data: {
            func: action.func,
            id: actionId, // Add id to action data as well
          },
        });
      }
    });

    reformedActions[nodeId] = {
      nodeName: actionData.description,
      items: items,
    };
  });

  actionStore.setActionNodes(reformedActions);
};

// Helper to check if element has columns available
const hasColumns = (options: any): boolean => {
  return options?.columnsAvailable && options.columnsAvailable?.length > 0;
};

// Helper to check if element supports candle location
const hasCandleLocation = (options: any): boolean => {
  return options?.candleLocation === true;
};

// Helper to find element options
const getElementOptions = (
  elementName: string,
  data: DataPoint[],
  indicators: Indicator[],
) => {
  // Special time-related fields
  if (
    ["candle_time", "candle_close_time", "day_of_week"].includes(elementName)
  ) {
    return {
      type: elementName,
      candleLocation: false,
      canComparedwith: ["values"],
    };
  }

  // Check in data points
  const dataPoint = data.find((dp) => dp.name === elementName);
  if (dataPoint) return dataPoint.options;

  // Check in indicators
  const indicator = indicators.find((ind) => ind.name === elementName);
  if (indicator) return indicator.options;

  return null;
};

const PERIODS = [
  "current",
  "prev",
  "prev-1",
  "prev-2",
  "prev-3",
  "prev-4",
  "prev-5",
  "prev-6",
  "prev-7",
  "prev-8",
  "prev-9",
  "prev-10",
  "prev-11",
  "prev-12",
  "prev-13",
  "prev-14",
  "prev-15",
  "prev-16",
  "prev-17",
  "prev-18",
  "prev-19",
  "prev-20",
];
// Helper to parse condition string into components
const parseConditionString = (
  str: string
): {
  base: string;
  column?: string;
  period?: string;
  nValue?: number;
} => {
  const parts = str.split(".");
  // const lhsOptions = getElementOptions(parts[0], data, indicators);
  // const _hasColumns = hasColumns(lhsOptions);
  return {
    base: parts[0],
    column: parts[1],
    period: PERIODS?.includes(parts[1])
      ? parts[1]?.startsWith("prev")
        ? parts[1] === "prev"
          ? "prev"
          : "prev-n"
        : parts[1]
      : parts[2]?.startsWith("prev")
      ? parts[2] === "prev"
        ? "prev"
        : "prev-n"
      : parts[2],
    nValue: (PERIODS?.includes(parts[1]) ? parts[1] : parts[2])?.startsWith(
      "prev-"
    )
      ? parseInt(
          (PERIODS?.includes(parts[1]) ? parts[1] : parts[2]).split("-")[1]
        )
      : undefined,
  };
};

// Helper to construct valid subsection
const constructSubSection = (
  condition: [string, string, string | number],
  data: DataPoint[],
  indicators: Indicator[],
  id: number,
  addBadge: "AND" | "OR"
): SubSection => {
  const [lhs, operator, rhs] = condition;
  const lhsParsed = parseConditionString(lhs);
  const lhsOptions = getElementOptions(lhsParsed.base, data, indicators);

  let subsection: SubSection = {
    id,
    addBadge,
    lhs: lhsParsed.base,
    operator,
    rhs: typeof rhs === "string" ? parseConditionString(rhs).base : "value",
  };

  // Add LHS components if supported by options
  if ((hasColumns(lhsOptions) && lhsParsed.column ) || lhsParsed.base?.includes("ac")) {
    subsection.column = lhsParsed.column;
  }
  if (hasCandleLocation(lhsOptions)) {
    subsection.selectedPeriod = lhsParsed.period;
    subsection.nValue = lhsParsed.nValue;
  }

  // Handle RHS components
  if (typeof rhs === "string") {
    const rhsParsed = parseConditionString(rhs);
    const rhsOptions = getElementOptions(rhsParsed.base, data, indicators);

    if (hasColumns(rhsOptions) && rhsParsed.column) {
      subsection.rhs_column = rhsParsed.column;
    }
    if (hasCandleLocation(rhsOptions)) {
      subsection.rhs_selectedPeriod = rhsParsed.period;
      subsection.rhs_nValue = rhsParsed.nValue;
    }
  } else {
    subsection._rhsValue = rhs.toString();
  }

  return subsection;
};

// Main reform conditions function
export const reformConditions = (
  conditions: { [key: string]: Condition },
  data: DataPoint[],
  indicators: Indicator[]
) => {
  const conditionStore = useConditionStore.getState();
  const reformedConditions: ConditionBlockMap = {};

  Object.entries(conditions).forEach(([nodeId, conditionData]) => {
    const blocks = [];
    let currentBlock: {
      id: string;
      subSections: SubSection[];
      relation: BlockRelation;
    } = {
      id: `block-${Date.now()?.toString()?.slice(-6)}${Math.random()
        ?.toString()
        ?.slice(-6)}`,
      subSections: [],
      relation: "AND",
    };
    let blockRelations: BlockRelation[] = [];

    conditionData.conditions.forEach((condition, idx) => {
      if (typeof condition === "string") {
        // This is a relation between blocks
        blockRelations.push(condition.toUpperCase() as BlockRelation);
        blocks.push(currentBlock);
        currentBlock = {
          id: `block-${Date.now()}-${Math.random()}-${idx}`,
          subSections: [],
          relation: "AND",
        };
      } else {
        // Process condition array
        condition.forEach((subCondition, subIdx) => {
          if (Array.isArray(subCondition)) {
            currentBlock.subSections.push(
              constructSubSection(
                subCondition,
                data,
                indicators,
                currentBlock.subSections.length,
                //@ts-ignore
                subIdx < condition.length - 1 ? condition[subIdx + 1] : "AND"
              )
            );
          }
        });
      }
    });

    // Add the last block
    blocks.push(currentBlock);

    reformedConditions[nodeId] = {
      name: conditionData.description || "",
      maxEntries: conditionData.maxentries,
      waitTrigger: conditionData.check_when_trigger_open,
      positionOpen: conditionData.check_when_position_open,
      type: conditionData.type,
      blocks,
      blockRelations,
    };
  });

  conditionStore.setConditionBlocks(reformedConditions);
};

// Reform Nodes Store
const reformNodes = (
  conditions_loc: NodeLocation[],
  actions_loc: EdgeLocation[]
) => {
  const nodeStore = useNodeStore.getState();
  //@ts-ignore
  nodeStore.setNodes(conditions_loc);
  nodeStore.setEdges(actions_loc);
};

// Reform Settings Store
const reformSettings = (settings: TStrategyInfo["settings"]) => {
  const settingStore = useSettingStore.getState();
  settingStore.setStrategyType(
    settings.strategy_type === "Intraday" ? "Intraday" : "Positional"
  );
  settingStore.setProductType(
    settings.productType === "Intraday" ? "Intraday" : "Delivery"
  );
  settingStore.setOrderType(
    settings.orderType === "Market" ? "Market" : "Limit"
  );
  settingStore.setSquareOffTime(settings.squareoffTime || "");

  // Set trading days state
  if (settings.tradingDays === "all") {
    settingStore.setSelectorState("daily");
  } else if (settings.tradingDays === "exp") {
    settingStore.setSelectorState("exp");
    settingStore.setSelectedExp(
      settings.tradingDaysList.map((day) => Math.abs(day).toString())
    );
  } else if (settings.tradingDays === "days") {
    settingStore.setSelectorState("days");
    const dayMap: Record<number, string> = {
      0: "Mon",
      1: "Tue",
      2: "Wed",
      3: "Thu",
      4: "Fri",
    };
    settingStore.setSelectedDays(
      settings.tradingDaysList.map((day) => dayMap[day])
    );
  }

  // Set entry/exit operations
  if (Object.keys(settings.entryOperation).length > 0) {
    settingStore.setEntryOperation({
      timeLimit: settings.entryOperation.timeLimit?.toString() || "5",
      priceBuffer: settings.entryOperation.priceBuffer?.toString() || "0",
      shouldExecute: settings.entryOperation.shouldExecute ?? true,
    });
  }

  if (Object.keys(settings.exitOperation).length > 0) {
    settingStore.setExitOperation({
      timeLimit: settings.exitOperation.timeLimit?.toString() || "5",
      priceBuffer: settings.exitOperation.priceBuffer?.toString() || "0",
      shouldExecute: settings.exitOperation.shouldExecute ?? true,
    });
  }
};


// Main reform function
export const reformStrategy = (strategy: TStrategyInfo) => {
  console.log("Setting underlying symbol", strategy?.settings?.underlying);
  console.log("setting timeframe", strategy?.settings?.timeframe);
  useDataPointStore.getState().setSelectedSymbol(strategy?.settings?.underlying);
  useDataPointStore.getState().setSelectedTimeFrame(strategy?.settings?.timeframe);
  reformDataPoints(strategy.data);
  reformIndicators(strategy.indicators);
  reformActions(strategy.actions);
  reformConditions(strategy.conditions, strategy.data, strategy.indicators);
  reformNodes(strategy.conditions_loc, strategy.actions_loc);
  reformSettings(strategy.settings);
};

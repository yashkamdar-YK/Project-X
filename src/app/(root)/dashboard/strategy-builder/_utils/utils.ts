import { useActionStore } from "@/lib/store/actionStore";
import { useApplyDataStore } from "@/lib/store/applyDataStore";
import { useConditionStore } from "@/lib/store/conditionStore";
import { useDataPointsStore } from "@/lib/store/dataPointsStore";
import { useDataPointStore } from "@/lib/store/dataPointStore";
import { useIndicatorStore } from "@/lib/store/IndicatorStore";
import { useNodeStore } from "@/lib/store/nodeStore"
import { useSettingStore } from "@/lib/store/settingStore";
import { transformSettingsToPayload } from "../_components/StrategyNavbar/SettingSheet/transformSettingsToPayload";
import { transformDataPointsToPayload } from "../_components/DashboardSidebar/DatapointDialog/transformDataPointsToPayload";
import { transformIndicatorsToPayload } from "../_components/DashboardSidebar/Indicators/transformIndicatorsToPayload";
import { transformToActionPayload } from "../_components/StrategyNavbar/NodeSheet/ActionNodeSheet/transformToActionPayload";
import { transformConditionToPayload } from "../_components/StrategyNavbar/NodeSheet/ConditionNodeSheet/transformConditionToPayload";
import { NodeTypes } from "./nodeTypes";
import { Edge, Node } from "@xyflow/react";

export const clearStores = () => {
  useNodeStore.getState().clearNodesStore();
  useIndicatorStore.getState().clearIndicators();
  useDataPointsStore.getState().clearDataPoints();
  useConditionStore.getState().clearConditionNodes();
  useApplyDataStore.getState().clearData();
  useActionStore.getState().clearActionNodes();
  useDataPointStore.getState().reset();
  useSettingStore.getState().reset();

  sessionStorage.removeItem('strategy-node-store');
  sessionStorage.removeItem('strategy-indicator-store');
  sessionStorage.removeItem('strategy-datapoints-store');
  sessionStorage.removeItem('strategy-condition-store');
  sessionStorage.removeItem('strategy-apply-data-store');
  sessionStorage.removeItem('strategy-action-store');
  sessionStorage.removeItem('strategy-data-point-store');
  sessionStorage.removeItem('strategy-setting-store')
}

export const getSaveStrategyData = (strategyName: string, description: string = "", capital: string = "", isPublic: boolean = false, isCreateNew:boolean=false) => {
  return {
    strategyName: strategyName.trim(),
    settings: transformSettingsToPayload(
      useDataPointStore.getState().selectedSymbol || "",
      useDataPointStore.getState().selectedTimeFrame
    ),
    data: transformDataPointsToPayload(useDataPointsStore.getState().dataPoints),
    indicators: transformIndicatorsToPayload(useIndicatorStore.getState().indicators),
    actions: transformToActionPayload(useActionStore.getState().actionNodes),
    conditions: transformConditionToPayload(useConditionStore.getState().conditionBlocks),
    conditions_seq: getConditionSequence(useNodeStore.getState().nodes, useNodeStore.getState().edges),
    conditions_loc: useNodeStore.getState().nodes,
    actions_loc: useNodeStore.getState().edges,
    ...(isCreateNew ? {
      stratinfo: {
        description: description.trim(),
        capitalReq: parseInt(capital),
        visiblity: isPublic ? "public" : "private",
      }
    } : {}),
  }
}

function getConditionSequence(nodes: Node[], edges: Edge[]): string[] {
  const result: string[] = [];
  
  // Find the starting condition node (connected to 'start')
  const startEdge = edges.find(edge => 
    edge.source === 'start' && 
    edge.type === 'conditionEdge'
  );
  
  if (!startEdge) return result;
  
  // Add the first condition node
  let currentNodeId = startEdge.target;
  result.push(currentNodeId);
  
  // Keep finding next condition nodes by following the flow downwards
  while (true) {
    // Look specifically for edges where current node is the source
    const nextEdge = edges.find(edge => 
      edge.type === 'conditionEdge' && 
      (edge.source === currentNodeId || 
       (edge.source !== 'start' && edge.source === currentNodeId))
    );
    
    if (!nextEdge) break;
    
    // Always take the target as next node since we're going top to bottom
    const nextNodeId = nextEdge.target;
    
    // Check if this node is already in result to prevent infinite loops
    if (result.includes(nextNodeId)) break;
    
    // Verify that this is actually a condition node
    const isConditionNode = nodes.some(node => 
      node.id === nextNodeId && 
      node.type === 'CONDITION'
    );
    
    if (isConditionNode) {
      result.push(nextNodeId);
      currentNodeId = nextNodeId;
    } else {
      break;
    }
  }
  
  return result;
}
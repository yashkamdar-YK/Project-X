import React, { useEffect, useState } from "react";
import { DragEvent } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Accordion } from "@/components/ui/accordion";
import { Plus } from 'lucide-react';
import { Node } from "@xyflow/react";
import { useNodeStore } from "@/lib/store/nodeStore";
import { DataPointDialog } from "./DatapointDialog";
import { useDataPointsStore } from "@/lib/store/dataPointsStore";
import { DataPoint } from "./DatapointDialog/types";
import { Indicator } from "./Indicators/types";
import { useIndicatorStore } from "@/lib/store/IndicatorStore";
import IndicatorDialog from "./Indicators";
import { useDataPointStore } from "@/lib/store/dataPointStore";
import ActionDialog from "./ActionsDialog";
import ConditionDialog from "./AddConditionDialog";
import { useActionStore } from "@/lib/store/actionStore";
import { useSheetStore } from "@/lib/store/SheetStore";
import { useConditionStore } from "@/lib/store/conditionStore";

import { SidebarAccordionItem } from "./_chunks/SidebarAccordionItem";
import { DataPointItem } from "./_chunks/DataPointItem";
import { IndicatorItem } from "./_chunks/IndicatorItem";
import { ActionItem } from "./_chunks/ActionItem";
import { ConditionItem } from "./_chunks/ConditionItem";
import { handleAddNode, NodeTypes } from "../../_utils/nodeTypes";
import { SIDEBAR_SECTIONS } from "../../constants/menu";
import { handleNodeDeletion } from "../../_utils/nodeHandling";

const DashboardSidebar: React.FC = () => {
  const { nodes, setNodes, edges, setEdges } = useNodeStore();
  const [expandedItems, setExpandedItems] = useState<string[]>(["item-4"]);

  const [isDataPointModalOpen, setIsDataPointModalOpen] = useState(false);
  const [editingDataPoint, setEditingDataPoint] = useState<DataPoint | undefined>();

  const [isIndicatorsModalOpen, setIsIndicatorsModalOpen] = useState(false);
  const [editingIndicator, setEditingIndicator] = useState<Indicator | undefined>();

  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [isConditionModalOpen, setIsConditionModalOpen] = useState(false);
  
  const { dataPoints, removeDataPoint } = useDataPointsStore();
  const { symbolInfo, selectedSymbol } = useDataPointStore();
  const { indicators, removeIndicator } = useIndicatorStore();

  const { actionNodes, removeActionNode, createActionNode } = useActionStore();
  const { conditionBlocks, removeConditionBlock, createConditionBlock } = useConditionStore();

  const { openSheet } = useSheetStore();

  useEffect(() => {
    const missingActionNodes = nodes.filter(node => node.type === NodeTypes.ACTION && !actionNodes[node.id]);
    const missingConditionNodes = nodes.filter(node => node.type === NodeTypes.CONDITION && !conditionBlocks[node.id]);

    missingActionNodes.forEach(node => {
      //@ts-ignore
      createActionNode(node.id, node.data.label);
    });

    missingConditionNodes.forEach(node => {
      //@ts-ignore
      createConditionBlock(node.id, node.data.label);
    });
  }, [nodes, actionNodes, conditionBlocks, createActionNode, createConditionBlock]);

  const groupedDataPoints = React.useMemo(() => {
    return dataPoints.reduce((acc, dp) => {
      if (!acc[dp.type]) acc[dp.type] = [];
      acc[dp.type].push(dp);
      return acc;
    }, {} as Record<string, DataPoint[]>);
  }, [dataPoints]);

  const onDragStart = (event: DragEvent<HTMLDivElement>, item: Node) => {
    event.stopPropagation();
    event.dataTransfer.setData("application/reactflow", JSON.stringify({ item }));
    event.dataTransfer.effectAllowed = "move";
  };

  const onAdd = (event: React.MouseEvent, item: Node) => {
    event.preventDefault();
    event.stopPropagation();
    const { newNode, newEdges } = handleAddNode(nodes, edges, item);
    setNodes([...nodes, newNode]);
    setEdges(newEdges);
  };

  const handleAccordionChange = (value: string[]) => {
    setExpandedItems(value);
  };

  const handleAddDataPoint = (e: React.MouseEvent) => {
    e.preventDefault();
    setEditingDataPoint(undefined);
    setIsDataPointModalOpen(true);
  };

  const handleAddIndicators = (e: React.MouseEvent) => {
    e.preventDefault();
    setEditingIndicator(undefined);
    setIsIndicatorsModalOpen(true);
  };

  const handleAddAction = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsActionModalOpen(true);
  };

  const handleAddCondition = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsConditionModalOpen(true);
  };

  const handleEditDataPoint = (dataPoint: DataPoint) => {
    setEditingDataPoint(dataPoint);
    setIsDataPointModalOpen(true);
  };

  const handleEditActionNode = (nodeId: string) => {
    const actionNode = actionNodes[nodeId];
    openSheet("node", {
      id: nodeId,
      type: NodeTypes.ACTION,
      data: actionNode,
    });
  };

  const handleEditConditionNode = (nodeId: string) => {
    openSheet('node', { 
      id: nodeId, 
      type: NodeTypes.CONDITION
    });
  };

  useEffect(() => {
    if (dataPoints.length > 0) {
      setExpandedItems(prev => [...new Set([...prev, "item-0"])]);
    }
    if (indicators.length > 0) {
      setExpandedItems(prev => [...new Set([...prev, "item-1"])]);
    }
    if (Object.keys(actionNodes).length > 0) {
      setExpandedItems(prev => [...new Set([...prev, "item-2"])]);
    }
    if (Object.keys(conditionBlocks).length > 0) {
      setExpandedItems(prev => [...new Set([...prev, "item-3"])]);
    }
  }, [dataPoints, indicators, actionNodes, conditionBlocks]);

  const handleRemoveDataPoint = (id: string) => {
    removeDataPoint(id);
  };
 
  const handleRemoveActionNode = (nodeId: string) => {
    const nodeToDelete = nodes.find((node) => node.id === nodeId);
    if (nodeToDelete) {
      handleNodeDeletion([nodeToDelete], nodes, edges, setNodes, setEdges);
    }
  };

  const handleRemoveConditionNode = (nodeId: string) => {
    const nodeToDelete = nodes.find((node) => node.id === nodeId);
    if (nodeToDelete) {
      handleNodeDeletion([nodeToDelete], nodes, edges, setNodes, setEdges);
    }
  };

  const validateDataPoint = (dataPoint: DataPoint): { isValid: boolean; error: string } => {
    if (selectedSymbol === null) {
      return { isValid: false, error: "Symbol not selected" };
    }
    const currentSymbolInfo = symbolInfo[selectedSymbol];
    if (!currentSymbolInfo) {
      return { isValid: false, error: "Symbol information not available" };
    }

    // if (dataPoint.duration && !currentSymbolInfo.timeFrame.includes(Number(dataPoint.duration))) {
    //   return {
    //     isValid: false,
    //     error: `Time frame ${dataPoint.duration} is not supported for ${currentSymbolInfo.symbol}`,
    //   };
    // }

    switch (dataPoint.dataType) {
      case "OPT":
        if (dataPoint.expiryType === "weekly") {
          if (!currentSymbolInfo.isWeekly) {
            return {
              isValid: false,
              error: `Weekly expiry is not available for ${currentSymbolInfo.symbol}`,
            };
          }

          const weeklyOrders = currentSymbolInfo.OptExp.weekly;
          if (!weeklyOrders?.includes(Number(dataPoint.expiryOrder))) {
            return {
              isValid: false,
              error: `Invalid weekly expiry order ${dataPoint.expiryOrder} for ${currentSymbolInfo.symbol}`,
            };
          }
        }

        if (dataPoint.expiryType === "monthly") {
          if (!currentSymbolInfo.OptExp.monthly.includes(Number(dataPoint.expiryOrder))) {
            return {
              isValid: false,
              error: `Invalid monthly expiry order ${dataPoint.expiryOrder} for ${currentSymbolInfo.symbol}`,
            };
          }
        }

        if (dataPoint.strikeSelection) {
          if (dataPoint.strikeSelection.mode !== "strike") {
            return {
              isValid: false,
              error: "Invalid strike selection mode",
            };
          }

          const position = dataPoint.strikeSelection.position;
          if (position !== "atm") {
            // const [type, number] = position.split("_");
            const type = position.slice(0,3);
            const number = position.slice(3,position.length)
            if (
              !["itm", "otm"].includes(type) ||
              isNaN(Number(number)) ||
              Number(number) > 10
            ) {
              return {
                isValid: false,
                error: "Invalid strike position",
              };
            }
          }
        }
        break;

      case "FUT":
        if (dataPoint.expiryType !== "monthly") {
          return {
            isValid: false,
            error: "Futures only support monthly expiry",
          };
        }

        if (!currentSymbolInfo.FutExp.monthly.includes(Number(dataPoint.expiryOrder))) {
          return {
            isValid: false,
            error: `Invalid future expiry order ${dataPoint.expiryOrder} for ${currentSymbolInfo.symbol}`,
          };
        }
        break;

      case "SPOT":
        if (dataPoint.expiryType || dataPoint.expiryOrder || dataPoint.strikeSelection) {
          return {
            isValid: false,
            error: "Spot data should not have expiry or strike selection",
          };
        }
        break;

      default:
        if (dataPoint.dataType) {
          return {
            isValid: false,
            error: "Invalid data type",
          };
        }
    }

    if (dataPoint.candleType && !["candlestick", "heikenashi"].includes(dataPoint.candleType)) {
      return {
        isValid: false,
        error: "Invalid candle type",
      };
    }

    return { isValid: true, error: "" };
  };

  const renderDataPoints = () => {
    return Object.entries(groupedDataPoints).map(([type, points]) => (
      <div key={type} className="space-y-1 mb-2">
        <h4 className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400 pl-2">
          {type === "candle-data" ? "Candle Data" : "Days to Expire"}
        </h4>
        {points.map((point) => {
          const validation = validateDataPoint(point);
          return (
            <DataPointItem
              key={point.id}
              point={point}
              validation={validation}
              onEdit={handleEditDataPoint}
              onRemove={handleRemoveDataPoint}
            />
          );
        })}
      </div>
    ));
  };

  const renderIndicators = () =>
    indicators?.map((indicator) => {
      const isMissing = ![
        ...dataPoints?.map((v) => v.elementName),
        ...indicators?.map((v) => v.elementName),
      ].includes(indicator?.onData || "");

      return (
        <IndicatorItem
          key={indicator.id}
          indicator={indicator}
          isMissing={isMissing}
          onEdit={(indicator) => {
            setEditingIndicator(indicator);
            setIsIndicatorsModalOpen(true);
          }}
          onRemove={removeIndicator}
        />
      );
    });

  const renderActions = () =>
    Object.entries(actionNodes).map(([nodeId, actionNode]) => (
      <ActionItem
        key={nodeId}
        nodeId={nodeId}
        nodeName={actionNode.nodeName}
        onEdit={handleEditActionNode}
        onRemove={handleRemoveActionNode}
      />
    ));

  const renderConditions = () =>
    Object.keys(conditionBlocks).map((nodeId) => (
      <ConditionItem
        key={nodeId}
        nodeId={nodeId}
        name={conditionBlocks[nodeId].name}
        onEdit={handleEditConditionNode}
        onRemove={handleRemoveConditionNode}
      />
    ));

  const SidebarContent = () => (
    <div className="h-full overflow-y-auto mt-2 flex flex-col bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 overflow-y-auto">
        <Accordion
          type="multiple"
          className="space-y-2"
          value={expandedItems}
          onValueChange={handleAccordionChange}
        >
          {SIDEBAR_SECTIONS(
            handleAddDataPoint,
            handleAddIndicators,
            handleAddAction,
            handleAddCondition
          ).map((item, index) => (
            <SidebarAccordionItem
              key={index}
              index={index}
              item={item}
              renderContent={() => {
                switch (item.title) {
                  case "Data Points":
                    return renderDataPoints();
                  case "Indicators":
                    return renderIndicators();
                  case "Actions":
                    return renderActions();
                  case "Conditions":
                    return renderConditions();
                  default:
                    return null;
                }
              }}
            />
          ))}
        </Accordion>
      </div>
    </div>
  );

  return (
    <>
      <div className="hidden md:block w-64 border-r border-gray-200 dark:border-gray-700 flex-none overflow-y-hidden">
        <SidebarContent />
      </div>

      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <button
              className="fixed bottom-6 left-6 z-50 p-3 rounded-full bg-blue-500 dark:bg-blue-600 text-white shadow-lg hover:bg-blue-600 dark:hover:bg-blue-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
              aria-label="Open sidebar"
            >
              <Plus className="w-5 h-5" />
            </button>
          </SheetTrigger>
          <SheetContent
            side="left"
            className="w-[80%] sm:w-[385px] p-0 !pt-10"
          >
            <SidebarContent />
          </SheetContent>
        </Sheet>
      </div>

      <DataPointDialog
        open={isDataPointModalOpen}
        onOpenChange={(open) => {
          setIsDataPointModalOpen(open);
          if (!open) setEditingDataPoint(undefined);
        }}
        editingDataPoint={editingDataPoint}
      />

      <IndicatorDialog
        open={isIndicatorsModalOpen}
        onOpenChange={(open) => {
          setIsIndicatorsModalOpen(open);
          if (!open) setEditingIndicator(undefined);
        }}
        editingIndicator={editingIndicator}
      />
      <ActionDialog
        open={isActionModalOpen}
        onOpenChange={(open) => {
          setIsActionModalOpen(open);
        }}
      />
      <ConditionDialog
        open={isConditionModalOpen}
        onOpenChange={(open) => {
          setIsConditionModalOpen(open);
        }}
      />
    </>
  );
};

export default DashboardSidebar;

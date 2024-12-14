import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { DragEvent } from "react";
import { Search, ChevronDown, Plus, X, Edit2 } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AlertCircle } from "lucide-react";
import { SIDEBAR_SECTIONS } from "../../constants/menu";
import { Node } from "@xyflow/react";
import { handleAddNode, NodeTypes } from "../../_utils/nodeTypes";
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
import { ConditionBlock } from "../StrategyNavbar/NodeSheet/ConditionNodeSheet/types";

const DashboardSidebar: React.FC = () => {
  const { nodes, setNodes, edges, setEdges } = useNodeStore();
  const [expandedItems, setExpandedItems] = useState<string[]>(["item-4"]);

  const [isDataPointModalOpen, setIsDataPointModalOpen] = useState(false);
  const [editingDataPoint, setEditingDataPoint] = useState< DataPoint | undefined >();

  const [isIndicatorsModalOpen, setIsIndicatorsModalOpen] = useState(false);
  const [editingIndicator, setEditingIndicator] = useState< Indicator | undefined >();

  const [isActionModalOpen, setIsActionModalOpen] = useState(false);
  const [isConditionModalOpen, setIsConditionModalOpen] = useState(false);
  
  const { dataPoints, removeDataPoint } = useDataPointsStore();
  const { symbolInfo, selectedSymbol } = useDataPointStore();
  const { indicators, removeIndicator } = useIndicatorStore();

  const { actionNodes, removeActionNode } = useActionStore();

   // Add this new state for condition nodes
   const { conditionBlocks } = useConditionStore();
   const [conditionNodes, setConditionNodes] = useState<string[]>([]);

  // Add this from useSheetStore
  const { openSheet } = useSheetStore();

  const groupedDataPoints = React.useMemo(() => {
    return dataPoints.reduce((acc, dp) => {
      if (!acc[dp.type]) acc[dp.type] = [];
      acc[dp.type].push(dp);
      return acc;
    }, {} as Record<string, DataPoint[]>);
  }, [dataPoints]);

  const onDragStart = (event: DragEvent<HTMLDivElement>, item: Node) => {
    event.stopPropagation();
    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify({ item })
    );
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
 

  // Add DataPoint
  const handleAddDataPoint = (e: any) => {
    e.preventDefault();
    setEditingDataPoint(undefined);
    setIsDataPointModalOpen(true);
  };

  // Add Indicator
  const handleAddIndicators = (e: any) => {
    e.preventDefault();
    setEditingIndicator(undefined);
    setIsIndicatorsModalOpen(true);
  };

  // Add Action
  const handleAddAction = (e: any) => {
    e.preventDefault();
    setIsActionModalOpen(true);
  };

  // Add Condition
  const handleAddCondition = (e: any) => {
    e.preventDefault();
    setIsConditionModalOpen(true);
  };


  const handleEditDataPoint = (dataPoint: DataPoint) => {
    setEditingDataPoint(dataPoint);
    setIsDataPointModalOpen(true);
  };

  const handleEditActionNode = (nodeId: string) => {
    const actionNode = actionNodes[nodeId];
    console.log("Editing Action Node:", {
      id: nodeId,
      name: actionNode.nodeName,
      actions: actionNode.actions,
      positions: actionNode.positions,
    });
    openSheet("node", {
      id: nodeId,
      type: NodeTypes.ACTION,
      data: actionNode,
    });
  };

  const handleEditConditionNode = (nodeId: string) => {
    console.log("Editing Condition Node:", nodeId);
    openSheet('node', { 
      id: nodeId, 
      type: 'condition'
    });
  };


  useEffect(() => {
    const conditionNodesOnCanvas = nodes
      .filter(node => node.type === 'condition')
      .map(node => node.id);
    
    console.log("Condition nodes on canvas:", conditionNodesOnCanvas);
    setConditionNodes(conditionNodesOnCanvas);
  }, [nodes]);


  //handle accordion expand on datapoint add and indicator add
  useEffect(() => {
    if (dataPoints.length > 0) {
      setExpandedItems([...expandedItems, "item-0"]);
    }
    if (indicators.length > 0) {
      setExpandedItems([...expandedItems, "item-1"]);
    }
    if (Object.keys(actionNodes).length > 0) {
      setExpandedItems([...expandedItems, "item-2"]);
    }
    if (conditionNodes.length > 0) {
      setExpandedItems([...expandedItems, "item-3"]);
    }
  }, [dataPoints, indicators, actionNodes, conditionNodes]);

  const handleRemoveDataPoint = (event: React.MouseEvent, id: string) => {
    event.stopPropagation();
    removeDataPoint(id);
  };
 
  const handleRemoveActionNode = (nodeId: string, ) => {
    removeActionNode(nodeId);
     // Remove node from canvas
     setNodes(nodes.filter(node => node.id !== nodeId));
    
     // Remove connected edges
     setEdges(edges.filter(edge => 
       edge.source !== nodeId && edge.target !== nodeId
     ));
  };

   const handleRemoveConditionNode = (nodeId: string) => {
    // Remove node from canvas
    setNodes(nodes.filter(node => node.id !== nodeId));
    // Remove connected edges
    setEdges(edges.filter(edge => 
      edge.source !== nodeId && edge.target !== nodeId
    ));
    console.log("Removed Condition Node:", nodeId);
  };

  const validateDataPoint = (
    dataPoint: DataPoint
  ): { isValid: boolean; error: string } => {
    if (selectedSymbol === null) {
      return { isValid: false, error: "Symbol not selected" };
    }
    const currentSymbolInfo = symbolInfo[selectedSymbol];
    if (!currentSymbolInfo) {
      return { isValid: false, error: "Symbol information not available" };
    }

    // Validate timeFrame (duration should be available in symbol's timeFrame)
    if (
      dataPoint.duration &&
      !currentSymbolInfo.timeFrame.includes(Number(dataPoint.duration))
    ) {
      return {
        isValid: false,
        error: `Time frame ${dataPoint.duration} is not supported for ${currentSymbolInfo.symbol}`,
      };
    }

    // Validation based on data type
    switch (dataPoint.dataType) {
      case "OPT":
        // Validate weekly expiry availability
        if (dataPoint.expiryType === "weekly") {
          if (!currentSymbolInfo.isWeekly) {
            return {
              isValid: false,
              error: `Weekly expiry is not available for ${currentSymbolInfo.symbol}`,
            };
          }

          // Validate weekly expiry order
          const weeklyOrders = currentSymbolInfo.OptExp.weekly;
          if (!weeklyOrders?.includes(Number(dataPoint.expiryOrder))) {
            return {
              isValid: false,
              error: `Invalid weekly expiry order ${dataPoint.expiryOrder} for ${currentSymbolInfo.symbol}`,
            };
          }
        }

        // Validate monthly expiry order
        if (dataPoint.expiryType === "monthly") {
          if (
            !currentSymbolInfo.OptExp.monthly.includes(
              Number(dataPoint.expiryOrder)
            )
          ) {
            return {
              isValid: false,
              error: `Invalid monthly expiry order ${dataPoint.expiryOrder} for ${currentSymbolInfo.symbol}`,
            };
          }
        }

        // Validate strike selection for options
        if (dataPoint.strikeSelection) {
          if (dataPoint.strikeSelection.mode !== "strike-at") {
            return {
              isValid: false,
              error: "Invalid strike selection mode",
            };
          }

          // Validate strike position format
          const position = dataPoint.strikeSelection.position;
          if (position !== "ATM") {
            const [type, number] = position.split("_");
            if (
              !["ITM", "OTM"].includes(type) ||
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
        // Future can only have monthly expiry
        if (dataPoint.expiryType !== "monthly") {
          return {
            isValid: false,
            error: "Futures only support monthly expiry",
          };
        }

        // Validate future expiry order
        if (
          !currentSymbolInfo.FutExp.monthly.includes(
            Number(dataPoint.expiryOrder)
          )
        ) {
          return {
            isValid: false,
            error: `Invalid future expiry order ${dataPoint.expiryOrder} for ${currentSymbolInfo.symbol}`,
          };
        }
        break;

      case "SPOT":
        // SPOT shouldn't have expiry related fields
        if (
          dataPoint.expiryType ||
          dataPoint.expiryOrder ||
          dataPoint.strikeSelection
        ) {
          return {
            isValid: false,
            error: "Spot data should not have expiry or strike selection",
          };
        }
        break;

      default:
        // Invalid data type
        if (dataPoint.dataType) {
          return {
            isValid: false,
            error: "Invalid data type",
          };
        }
    }

    // Add validation for candleType if needed
    if (
      dataPoint.candleType &&
      !["candlestick", "heikenashi"].includes(dataPoint.candleType)
    ) {
      return {
        isValid: false,
        error: "Invalid candle type",
      };
    }

    // All validations passed
    return { isValid: true, error: "" };
  };

  const renderDataPoints = () => {
    return Object.entries(groupedDataPoints).map(([type, points]) => (
      <div key={type} className="space-y-1">
        <h4 className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400 pl-2">
          {type === "candle-data" ? "Candle Data" : "Days to Expire"}
        </h4>
        {points.map((point) => {
          const validation = validateDataPoint(point);

          return (
            <TooltipProvider key={point.id}>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className={`flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-md border 
                      ${
                        !validation.isValid
                          ? "border-red-500"
                          : "border-transparent"
                      }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-sm">{point.elementName}</span>
                      {!validation.isValid && (
                        <AlertCircle className="w-4 h-4 text-red-500" />
                      )}
                    </div>
                    <div className="flex items-center space-x-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditDataPoint(point);
                        }}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
                      >
                        <Edit2 className="w-4 h-4 text-gray-500" />
                      </button>
                      <button
                        onClick={(e) => handleRemoveDataPoint(e, point.id)}
                        className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
                      >
                        <X className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                  </div>
                </TooltipTrigger>
                {!validation.isValid && (
                  <TooltipContent>
                    <p>{validation.error}</p>
                  </TooltipContent>
                )}
              </Tooltip>
            </TooltipProvider>
          );
        })}
      </div>
    ));
  };

  const renderIndicators = () =>
    indicators?.map((indicator) => {
      //@ts-ignore
      const isMissing = ![
        ...dataPoints?.map((v) => v.elementName),
        ...indicators?.map((v) => v.elementName),
        //@ts-ignore
      ].includes(indicator?.onData);

      return (
        <TooltipProvider key={indicator.id}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div
                className={`flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-md border 
                  ${isMissing ? "border-red-500" : "border-transparent"}`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">{indicator.elementName}</span>
                  {isMissing && (
                    <AlertCircle className="w-4 h-4 text-red-500" />
                  )}
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setEditingIndicator(indicator);
                      setIsIndicatorsModalOpen(true);
                    }}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
                  >
                    <Edit2 className="w-4 h-4 text-gray-500" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeIndicator(indicator.id);
                    }}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </div>
            </TooltipTrigger>
            {isMissing && (
              <TooltipContent>
                <p>
                  Required data point{" "}
                  <span className="font-semibold">{indicator.onData}</span> is
                  missing
                </p>
              </TooltipContent>
            )}
          </Tooltip>
        </TooltipProvider>
      );
    });

  const renderActions = () =>
    Object.entries(actionNodes).map(([nodeId, actionNode]) => (
      <TooltipProvider key={nodeId}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
              <div className="flex items-center gap-2">
                <span className="text-sm">
                  {actionNode.nodeName || `Action Node ${nodeId}`}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                {/* Edit Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditActionNode(nodeId);
                  }}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  <Edit2 className="w-4 h-4 text-gray-500" />
                </button>
                {/* Remove Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveActionNode(nodeId);
                  }}
                  className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
                >
                  <X className="w-4 h-4 text-gray-500" />
                </button>
              </div>
            </div>
          </TooltipTrigger>
        </Tooltip>
      </TooltipProvider>
    ));


    const renderConditions = () => {
      console.log("Rendering condition nodes:", conditionNodes);
      return conditionNodes.map((nodeId) => (
        <TooltipProvider key={nodeId}>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-md">
                <div className="flex items-center gap-2">
                  <span className="text-sm">Condition Node {nodeId}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditConditionNode(nodeId);
                    }}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
                  >
                    <Edit2 className="w-4 h-4 text-gray-500" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveConditionNode(nodeId);
                    }}
                    className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full transition-colors"
                  >
                    <X className="w-4 h-4 text-gray-500" />
                  </button>
                </div>
              </div>
            </TooltipTrigger>
          </Tooltip>
        </TooltipProvider>
      ));
    };



  const SidebarContent = () => (
    <div className="h-full flex flex-col bg-gray-50 dark:bg-gray-900">
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500"
            />
            <Input
              className="pl-10 pr-4 border rounded-md w-full bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-gray-100 dark:placeholder-gray-400 transition-all duration-200"
              type="text"
              placeholder="Search..."
            />
          </div>
        </div>

        <div className="border-b border-gray-200 dark:border-gray-700 mb-4"></div>

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
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="flex items-center justify-between py-2 px-4 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-all duration-200 group">
                <div className="flex items-center">
                  {<item.icon size={16} />}
                  <span className="ml-2">{item.title}</span>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={item.onClick}
                    className="text-xs bg-blue-500 dark:bg-blue-600 text-white px-2 py-1 rounded-md hover:bg-blue-600 dark:hover:bg-blue-700 transition-all duration-200 mr-2"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                  <ChevronDown className="w-4 h-4 text-gray-400 dark:text-gray-500 group-data-[state=open]:rotate-180 transition-transform duration-200" />
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div className="mt-1 pl-4 pr-3 py-2 text-sm text-gray-600 dark:text-gray-300 bg-white rounded-md dark:bg-gray-900 shadow-sm transition-all duration-200">
                  <div className="mt-1 space-y-1">
                    {item?.items &&
                      item?.items.map((subItem, subIndex) => (
                        <div
                          key={subIndex}
                          draggable
                          onDragStart={(e) => onDragStart(e, subItem)}
                          className="pl-6 py-2 flex justify-between text-sm cursor-grab text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md shadow-sm transition-all duration-200 hover:bg-gray-200 dark:hover:bg-gray-600"
                        >
                          {/* @ts-ignore */}
                          <span>{subItem.data.label}</span>
                          <div className="flex items-center">
                            <button
                              onClick={(e) => onAdd(e, subItem)}
                              className="text-xs bg-blue-500 dark:bg-blue-600 text-white px-2 py-1 rounded-md hover:bg-blue-600 dark:hover:bg-blue-700 transition-all duration-200 mr-2"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                        </div>
                      ))}
                    {/* Data Points items */}
                    {item.title === "Data Points" && (
                      <div className="space-y-2">{renderDataPoints()}</div>
                    )}
                    {/*  Indicators items*/}
                    {item?.title === "Indicators" && (
                      <div className="space-y-2">{renderIndicators()}</div>
                    )}
                    {/*  Action items*/}
                    {item?.title === "Actions" && (
                      <div className="space-y-2">{renderActions()}</div>
                    )}
                    {/*  Condition items*/}
                    {item?.title === "Conditions" && (
                      <div className="space-y-2">{renderConditions()}</div>
                    )}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64 border-r border-gray-200 dark:border-gray-700 flex-none overflow-hidden">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar */}
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
            className="w-[80%] sm:w-[385px] p-0 !pt-10 bg-gray-50 dark:bg-gray-900"
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
function setEditingActionNodeId(nodeId: string) {
  throw new Error("Function not implemented.");
}

function openSheet(
  arg0: string,
  arg1: {
    id: string;
    type: string;
    data: {
      nodeName: string;
      actions: import("@/lib/store/actionStore").Action[];
      positions: import("../StrategyNavbar/NodeSheet/ActionNodeSheet/types").Position[];
    };
  }
) {
  throw new Error("Function not implemented.");
}

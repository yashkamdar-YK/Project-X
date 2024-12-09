"use client";

import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { DragEvent } from "react";
import { Search, ChevronDown, Plus, X, Pencil } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

import { SIDEBAR_SECTIONS } from "../../constants/menu";
import { Node } from "@xyflow/react";
import { handleAddNode, NodeTypes } from "../../_utils/nodeTypes";
import { useNodeStore } from "@/lib/store/nodeStore";
import { DataPointDialog } from "./DatapointDialog/index";
import { useDataPointsStore } from "@/lib/store/dataPointsStore";
import { DataPoint } from "./DatapointDialog/types";

const DashboardSidebar: React.FC = () => {
  const { nodes, setNodes, edges, setEdges } = useNodeStore();
  const [expandedItems, setExpandedItems] = useState<string[]>(["item-2"]);
  const [isDataPointModalOpen, setIsDataPointModalOpen] = useState(false);
  const dataPoints = useDataPointsStore((state) => state.dataPoints);
  const removeDataPoint = useDataPointsStore((state) => state.removeDataPoint);

  const [isEditDataPointModalOpen, setIsEditDataPointModalOpen] =
    useState(false);
  const [editingDataPoint, setEditingDataPoint] = useState<DataPoint | null>(
    null
  );

  const handleEditDataPoint = (dataPoint: DataPoint) => {
    setEditingDataPoint(dataPoint);
    setIsEditDataPointModalOpen(true);
  };

  const groupedDataPoints = dataPoints.reduce((acc, dp) => {
    if (!acc[dp.type]) acc[dp.type] = [];
    acc[dp.type].push(dp);
    return acc;
  }, {} as Record<string, DataPoint[]>);

  const onDragStart = (event: DragEvent<HTMLDivElement>, item: Node) => {
    event.stopPropagation();
    event.dataTransfer.setData(
      "application/reactflow",
      JSON.stringify({ item })
    );
    event.dataTransfer.effectAllowed = "move";
  };

  // Handler for adding node through button
  const onAdd = (event: React.MouseEvent, item: Node) => {
    event.preventDefault();
    event.stopPropagation();
    const { newNode, newEdges } = handleAddNode(nodes, edges, item);
    setNodes([...nodes, newNode]);
    setEdges(newEdges);
  };

  // Handler for accordion state changes
  const handleAccordionChange = (value: string[]) => {
    setExpandedItems(value);
  };
  const onDataPointAdd = () => setIsDataPointModalOpen(true);

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
          {SIDEBAR_SECTIONS(onDataPointAdd).map((item, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="flex items-center justify-between py-2 px-4 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-all duration-200 group">
                <div className="flex items-center">
                  {<item.icon size={16} />}
                  <span className="ml-2">{item.title}</span>
                </div>
                <div className="flex items-center">
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      item.onClick();
                    }}
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
                    {item.title === "Data Points" && (
                      <div className="space-y-2">
                        {Object.entries(groupedDataPoints).map(
                          ([type, points]) => (
                            <div key={type} className="space-y-1">
                              <h4 className="text-xs font-medium uppercase text-gray-500 dark:text-gray-400">
                                {type === "candle-data"
                                  ? "Candle Data"
                                  : "Days to Expire"}
                              </h4>
                              {points.map((point) => (
                                <div
                                  key={point.id}
                                  className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-800 rounded-md"
                                >
                                  <span className="text-sm">
                                    {point.elementName}
                                    {point.dataType && ` (${point.dataType})`}
                                  </span>

                                  {/* Edit Symbol Button */}
                                  <div>
                                    <button
                                      className="text-xs bg-blue-500 dark:bg-blue-600  text-white px-1 py-1 rounded-md hover:bg-blue-600 dark:hover:bg-blue-700 transition-all duration-200 ml-3"
                                      onClick={() => handleEditDataPoint(point)}
                                    >
                                      <Pencil className="w-3 h-3" />
                                    </button>

                                    {/* Delete Button */}
                                    <button
                                      onClick={() => removeDataPoint(point.id)}
                                      className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-full"
                                    >
                                      <X className="w-4 h-4 text-gray-500" />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )
                        )}
                      </div>
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

  // Rest of the component remains the same...
  return (
    <>
      {/* Desktop Sidebar */}
      <div className="hidden md:block w-64 border-r border-gray-200 dark:border-gray-700 flex-none overflow-hidden">
        <SidebarContent />
      </div>

      {/* Mobile Sidebar with Fixed Floating Trigger */}
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
        onOpenChange={() => setIsDataPointModalOpen(false)}
      />
      <DataPointDialog
        open={isEditDataPointModalOpen}
        onOpenChange={() => setIsEditDataPointModalOpen(false)}
        initialDataPoint={editingDataPoint}
      />
    </>
  );
};

export default DashboardSidebar;

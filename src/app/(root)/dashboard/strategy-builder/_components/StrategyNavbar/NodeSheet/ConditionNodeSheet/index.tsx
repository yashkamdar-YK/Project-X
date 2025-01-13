import React, { useEffect, useState } from "react";
import { Node } from "@xyflow/react";
import { NodeTypes } from "../../../../_utils/nodeTypes";
import { useSheetStore } from "@/lib/store/SheetStore";
import {
  X,
  Plus,
  Settings,
  Pencil,
  Minus,
  Trash2,
  ChevronDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDataPointsStore } from "@/lib/store/dataPointsStore";
import { useConditionStore } from "@/lib/store/conditionStore";
import { ConditionBlock } from "./ConditionBlock";
import { Input } from "@/components/ui/input";
import { validateName, validateNodeName } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { AndOrToggle } from "./ConditionSubSection";
import { useApplyDataStore } from "@/lib/store/applyDataStore";
import { defaultOptionsService, UrlMapping } from "../../../../_actions";
import { useDataPointStore } from "@/lib/store/dataPointStore";
import { MinusCircle, PlusCircle } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const ConditionNodeSheet = ({ node }: { node: Node }) => {
  const { closeSheet } = useSheetStore();
  const { dataPoints } = useDataPointsStore();
  const [showSettings, setShowSettings] = useState(true);
  const { selectedTimeFrame } = useDataPointStore();
  const [expandedBlock, setExpandedBlock] = useState<string | undefined>();
  const {
    conditionBlocks,
    addSubSection,
    updateSubSection,
    removeSubSection,
    toggleAddBadge,
    addBlock,
    removeBlock,
    updateBlockSettings,
    updateBlockRelation,
  } = useConditionStore();

  const currentNode = conditionBlocks[node.id];
  const toggleType = () => {
    const newType = currentNode.type === "entry" ? "exit" : "entry";
    updateBlockSettings(node.id, "type", newType);
  };

  const { setData, getData } = useApplyDataStore();

  useEffect(() => {
    if (currentNode?.blocks?.length > 0 && !expandedBlock) {
      setExpandedBlock(currentNode.blocks[0].id);
    }
  }, [currentNode?.blocks]);
  useEffect(() => {
    Object.keys(UrlMapping).map(async (key) => {
      //@ts-ignore
      const exist = getData(key);
      if (exist) return;
      //@ts-ignore
      const res = await defaultOptionsService.getApplyData(key);
      //@ts-ignore
      setData(key, res.data.data);
    });
  }, []);

  useEffect(() => {
    if (selectedTimeFrame) {
      defaultOptionsService.getCloseTime(selectedTimeFrame).then((res) => {
        setData("CloseTime", res.data.data);
      });
      defaultOptionsService
        .getTimeIntervalsData(selectedTimeFrame)
        .then((res) => {
          setData("OpenTime", res.data.data);
        });
    }
  }, [selectedTimeFrame]);

  if (!currentNode) return null;

  return (
    <div className="">
      <div className="flex justify-between items-center">
        <Badge>ID: {node.id}</Badge>
        <Button
          variant="ghost"
          size="icon"
          onClick={closeSheet}
          className="text-gray-400 hover:text-white hover:bg-gray-700 rounded-full"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      <div className="relative mb-8 rounded-lg p-3">
        <div className="flex items-center justify-center gap-2">
          <div className="relative">
            <Input
              id="condition-name"
              value={currentNode.name}
              onChange={(e) => {
                const validatedInput = e.target.value
                  .replace(/[^a-zA-Z0-9\s]/g, "")
                  .slice(0, 30);
                updateBlockSettings(node.id, "name", validatedInput);
              }}
              className="min-w-60 w-fit pr-12 text-center z-[2] bg-transparent relative font-semibold border-none !text-xl focus:ring-0"
            />
            <Pencil
              className={`
            w-4 h-4 cursor-pointer transition-colors z-[1]
            absolute right-2 top-[29%]
          `}
            />
          </div>
        </div>
        {currentNode?.name?.length === 30 && (
          <p className="absolute -bottom-6 left-0 text-xs text-orange-500">
            Maximum character limit reached (30)
          </p>
        )}
      </div>

      <div className="mb-4 flex justify-between items-center">
        <span>Condition Type:</span>
        <div className="flex items-center">
          <Button
            onClick={toggleType}
            className={`px-6 py-2 rounded-md hover:bg-blue-600 bg-blue-600 text-white`}
          >
            {currentNode.type.toUpperCase()}
          </Button>
          {currentNode.type != "exit" && (
            <Button
              variant="link"
              size="icon"
              onClick={() => setShowSettings(!showSettings)}
              className={`transition-transform ${
                showSettings ? "rotate-180" : ""
              }`}
            >
              <Settings className="w-5 h-5" />
            </Button>
          )}
        </div>
      </div>

      {showSettings && currentNode.type !== "exit" && (
        <div className="space-y-4 mb-6 bg-white dark:bg-[#1a1f2e] p-4 rounded-lg border border-gray-200 dark:border-[#2a2f3d]">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 text-sm dark:text-[#94a3b8]">
              Max Entries:
            </span>
            <div className="flex items-center border rounded-lg overflow-hidden">
              <Button
                onClick={() => {
                  const current = currentNode.maxEntries;
                  if (current > 0) {
                    updateBlockSettings(node.id, "maxEntries", current - 1);
                  }
                }}
                size="sm"
                className="bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-600 rounded-r-none dark:text-slate-400"
              >
                <Minus className="w-4 h-4" />
              </Button>
              <Input
                value={
                  currentNode.maxEntries === 0 ? "∞" : currentNode.maxEntries
                }
                className="w-12 h-7 text-center bg-transparent text-gray-800 dark:text-white border-none focus:ring-0"
                readOnly
              />
              <Button
                size="sm"
                onClick={() => {
                  const current = currentNode.maxEntries;
                  updateBlockSettings(node.id, "maxEntries", current + 1);
                }}
                className="bg-gray-100 hover:bg-gray-200 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-l-none text-gray-600 dark:text-slate-400"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-600 text-sm dark:text-[#94a3b8]">
              Check if any position is open:
            </span>
            <div className="flex gap-2">
              <Button
                size="sm"
                className={`w-16 transition-colors duration-200 ${
                  currentNode.positionOpen
                    ? "bg-green-500 dark:bg-[#22c55e] hover:bg-green-600 dark:hover:bg-[#16a34a] text-white"
                    : "bg-gray-100 hover:bg-gray-200 dark:bg-[#2a2f3d] dark:hover:bg-[#353b4d] text-gray-600 dark:text-[#94a3b8]"
                }`}
                onClick={() =>
                  updateBlockSettings(node.id, "positionOpen", true)
                }
              >
                YES
              </Button>
              <Button
                size="sm"
                className={`w-16 transition-colors duration-200 ${
                  !currentNode.positionOpen
                    ? "bg-red-500 dark:bg-[#ef4444] hover:bg-red-600 dark:hover:bg-[#dc2626] text-white"
                    : "bg-gray-100 hover:bg-gray-200 dark:bg-[#2a2f3d] dark:hover:bg-[#353b4d] text-gray-600 dark:text-[#94a3b8]"
                }`}
                onClick={() =>
                  updateBlockSettings(node.id, "positionOpen", false)
                }
              >
                NO
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-600 text-sm dark:text-[#94a3b8]">
              Check if any order trigger is pending:
            </span>
            <div className="flex gap-2">
              <Button
                size="sm"
                className={`w-16 transition-colors duration-200 ${
                  currentNode.waitTrigger
                    ? "bg-green-500 dark:bg-[#22c55e] hover:bg-green-600 dark:hover:bg-[#16a34a] text-white"
                    : "bg-gray-100 hover:bg-gray-200 dark:bg-[#2a2f3d] dark:hover:bg-[#353b4d] text-gray-600 dark:text-[#94a3b8]"
                }`}
                onClick={() =>
                  updateBlockSettings(node.id, "waitTrigger", true)
                }
              >
                YES
              </Button>
              <Button
                size="sm"
                className={`w-16 transition-colors duration-200 ${
                  !currentNode.waitTrigger
                    ? "bg-red-500 dark:bg-[#ef4444] hover:bg-red-600 dark:hover:bg-[#dc2626] text-white"
                    : "bg-gray-100 hover:bg-gray-200 dark:bg-[#2a2f3d] dark:hover:bg-[#353b4d] text-gray-600 dark:text-[#94a3b8]"
                }`}
                onClick={() =>
                  updateBlockSettings(node.id, "waitTrigger", false)
                }
              >
                NO
              </Button>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-0">
        <Accordion
          type="single"
          collapsible
          value={expandedBlock}
          onValueChange={setExpandedBlock}
        >
          {currentNode.blocks.map((block, index) => (
            <React.Fragment key={block?.id}>
              <div className="relative">
                <AccordionItem
                  value={block?.id}
                  className="border dark:border-gray-800 rounded-lg px-4"
                >
                  <AccordionTrigger
                    className="flex justify-between items-center py-4 w-full"
                    onClick={(e) => {
                      if ((e.target as HTMLElement).closest("button")) {
                        e.stopPropagation();
                        return;
                      }
                    }}
                  >
                    <span className="text-base font-medium">
                      Group{" "}
                      <span className="text-xs text-gray-500">
                        ({block?.id})
                      </span>
                    </span>
                    <div className="flex items-center gap-2">
                      {currentNode.blocks.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                          onClick={() => removeBlock(node.id, block?.id)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      )}
                      <ChevronDown
                        size={18}
                        className={`transition-transform duration-200 ${
                          expandedBlock === block?.id ? "rotate-180" : ""
                        }`}
                      />
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <ConditionBlock
                      block={block}
                      nodeId={node.id}
                      blockId={block?.id}
                      removeBlock={removeBlock}
                      currentNode={currentNode}
                      dataPoints={dataPoints}
                      addSubSection={(nodeId) =>
                        addSubSection(nodeId, block?.id)
                      }
                      updateSubSection={(nodeId, subSectionId, field, value) =>
                        updateSubSection(
                          nodeId,
                          block?.id,
                          subSectionId,
                          field,
                          value
                        )
                      }
                      removeSubSection={(nodeId, subSectionId) =>
                        removeSubSection(nodeId, block?.id, subSectionId)
                      }
                      toggleAddBadge={(nodeId, subSectionId) =>
                        toggleAddBadge(nodeId, block?.id, subSectionId)
                      }
                    />
                  </AccordionContent>
                </AccordionItem>
              </div>

              {index < currentNode.blocks.length - 1 && (
                <div className="flex justify-center">
                  <AndOrToggle
                    isGroup
                    value={currentNode.blockRelations[index] || "AND"}
                    onChange={() => updateBlockRelation(node.id, index)}
                  />
                </div>
              )}
            </React.Fragment>
          ))}
        </Accordion>
      </div>

      <div className="flex justify-center mt-8">
        <Button
          onClick={() => addBlock(node.id)}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Group
        </Button>
      </div>
    </div>
  );
};

export default ConditionNodeSheet;

import React, { useState } from "react";
import { Node } from "@xyflow/react";
import { NodeTypes } from "../../../../_utils/nodeTypes";
import { useSheetStore } from "@/lib/store/SheetStore";
import { X, Plus, Settings, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useDataPointsStore } from "@/lib/store/dataPointsStore";
import { useConditionStore } from "@/lib/store/conditionStore";
import { ConditionBlock } from "./ConditionBlock";
import { Input } from "@/components/ui/input";
import { validateName } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { AndOrToggle } from "./ConditionSubSection";

const ConditionNodeSheet = ({ node }: { node: Node }) => {
  const { closeSheet } = useSheetStore();
  const { dataPoints } = useDataPointsStore();
  const [showSettings, setShowSettings] = useState(true);
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
  if (!currentNode) return null;

  const toggleType = () => {
    const newType = currentNode.type === "entry" ? "exit" : "entry";
    updateBlockSettings(node.id, "type", newType);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
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
          <Input
            id="condition-name"
            value={currentNode.name}
            onChange={(e) =>
              updateBlockSettings(node.id, "name", e.target.value)
            }
            className="w-60 text-center bg-transparent font-semibold border-none !text-xl focus:ring-0"
          />
          <Pencil className="w-4 h-4" />
        </div>
      </div>

      <div className="mb-6 flex justify-between items-center">
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
            <span className="text-gray-600 dark:text-[#94a3b8]">
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
                className="bg-gray-100 hover:bg-gray-200 dark:bg-[#2a2f3d] dark:hover:bg-[#353b4d] text-gray-600 rounded-r-none dark:text-[#94a3b8]"
              >
                -
              </Button>
              <Input
                value={
                  currentNode.maxEntries === 0 ? "∞" : currentNode.maxEntries
                }
                className="w-12 text-center bg-transparent text-gray-800 dark:text-white border-none focus:ring-0"
                readOnly
              />
              <Button
                onClick={() => {
                  const current = currentNode.maxEntries;
                  updateBlockSettings(node.id, "maxEntries", current + 1);
                }}
                className="bg-gray-100 hover:bg-gray-200 dark:bg-[#2a2f3d] rounded-l-none dark:hover:bg-[#353b4d] text-gray-600 dark:text-[#94a3b8]"
              >
                +
              </Button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-gray-600 dark:text-[#94a3b8]">
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
            <span className="text-gray-600 dark:text-[#94a3b8]">
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
        {currentNode.blocks.map((block, index) => (
          <React.Fragment key={block.id}>
            <div className="relative">
              <ConditionBlock
                block={block}
                nodeId={node.id}
                blockId={block.id}
                removeBlock={removeBlock}
                currentNode={currentNode}
                dataPoints={dataPoints}
                addSubSection={(nodeId) => addSubSection(nodeId, block.id)}
                updateSubSection={(nodeId, subSectionId, field, value) =>
                  updateSubSection(nodeId, block.id, subSectionId, field, value)
                }
                removeSubSection={(nodeId, subSectionId) =>
                  removeSubSection(nodeId, block.id, subSectionId)
                }
                toggleAddBadge={(nodeId, subSectionId) =>
                  toggleAddBadge(nodeId, block.id, subSectionId)
                }
              />
            </div>

            {index < currentNode.blocks.length - 1 && (
              <div className="flex justify-center">
                {/* <Button
                  variant="secondary"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8"
                  onClick={() => updateBlockRelation(node.id, index)}
                >
                  {currentNode.blockRelations[index] || "AND"}
                </Button> */}
                <AndOrToggle
                  value={currentNode.blockRelations[index] || "AND"}
                  onChange={() => updateBlockRelation(node.id, index)}
                />
              </div>
            )}
          </React.Fragment>
        ))}
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

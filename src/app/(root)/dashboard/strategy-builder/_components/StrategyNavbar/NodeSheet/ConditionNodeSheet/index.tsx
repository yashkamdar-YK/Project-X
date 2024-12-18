import React, { useEffect, useState } from "react";
import { Node } from "@xyflow/react";
import { NodeTypes } from "../../../../_utils/nodeTypes";
import { useSheetStore } from "@/lib/store/SheetStore";
import { X, Plus, WandSparkles, Pencil, Settings, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useDataPointsStore } from "@/lib/store/dataPointsStore";
import { useConditionStore } from "@/lib/store/conditionStore";
import { ConditionBlock } from "./ConditionBlock";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { convertToMinutes, validateName } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { defaultOptionsService, UrlMapping } from "../../../../_actions";
import { useApplyDataStore } from "@/lib/store/applyDataStore";
import { useDataPointStore } from "@/lib/store/dataPointStore";

interface ConditionNodeSheetProps {
  node: Node & {
    type: typeof NodeTypes.CONDITION;
  };
}

const ConditionNodeSheet: React.FC<ConditionNodeSheetProps> = ({ node }) => {
  const { closeSheet } = useSheetStore();
  const { dataPoints } = useDataPointsStore();
  const { selectedTimeFrame } = useDataPointStore();
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

  const { setData, getData } = useApplyDataStore();

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
      defaultOptionsService
        .getCloseTime(convertToMinutes(selectedTimeFrame))
        .then((res) => {
          setData("CloseTime", res.data.data);
        });
      defaultOptionsService
        .getTimeIntervalsData(convertToMinutes(selectedTimeFrame))
        .then((res) => {
          setData("OpenTime", res.data.data);
        });
    }
  }, [selectedTimeFrame]);

  const currentNode = conditionBlocks[node.id];
  if (!currentNode) return null;

  return (
    <div className="dark:bg-gray-900 justify-center rounded-lg overflow-y-auto">
      <div className="flex justify-between items-center mb-6">
        <Badge>ID : {node.id}</Badge>

        <Button
          variant="ghost"
          size="icon"
          onClick={closeSheet}
          className="rounded-full hover:gb-gray-200 dark:hover:bg-gray-800"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      <div className="flex flex-col items-center justify-center space-y-4">
        <div className="relative w-70 max-w-md">
          <input
            id="condition-name"
            value={currentNode.name}
            onChange={(e) =>
              updateBlockSettings(node.id, "name", validateName(e.target.value))
            }
            type="text"
            className="w-full px-4 py-2 text-2xl font-normal text-center bg-transparent focus:border-2  rounded-lg focus:outline-none focus:border-gray-400 pr-8"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 transform -translate-y-1/2"
          >
            <Pencil className="h-5 w-5" />
          </Button>
        </div>
      </div>

      {currentNode.type !== "exit" && (
        <div className="space-y-4 text-lg text-gray-700 dark:text-gray-300  mt-6 px-4 md:px-6">
          <div className="flex items-center justify-between">
            <h1>Condition Type:</h1>
            <div className="flex">
            <Button 
              variant="ghost"
              className="px-4 py-1 text-base rounded-lg text-white border-2 border-gray-600">
                ENTRY
            </Button>
                <Button variant="ghost" size="icon">
                  <Settings className="h-8 w-8" />
                </Button>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <span>Max Entries:</span>
              <div className="flex items-center gap-2 bg-gray-600 rounded-lg">
                <Button variant="ghost" size="icon">
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="w-8 text-center">1</span>
                <Button variant="ghost" size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span>Check if any position is open:</span>
              <div className="flex items-center gap-2">
                <Button className="bg-green-700 hover:bg-green-600">YES</Button>
                <Button variant="destructive">NO</Button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span>Check if any order trigger is pending:</span>
              <div className="flex items-center gap-2">
                <Button className="bg-green-700 hover:bg-green-600">YES</Button>
                <Button variant="destructive">NO</Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Condition Block */}
      <div className="space-y-8 mt-8 ">
        {currentNode.blocks.map((block, index) => (
          <React.Fragment key={block.id}>
            <div className="relative">
              <ConditionBlock
                block={block}
                nodeId={node.id}
                blockId={block.id}
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
              {currentNode.blocks.length > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute -right-4 -top-4 text-red-500 hover:text-red-600 hover:bg-red-900/20"
                  onClick={() => removeBlock(node.id, block.id)}
                >
                  <X className="w-4 h-4" />
                </Button>
              )}
            </div>

            {index < currentNode.blocks.length - 1 && (
              <div className="flex justify-center">
                <Button
                  variant="secondary"
                  className="bg-blue-500 hover:bg-blue-600 text-white px-8"
                  onClick={() => updateBlockRelation(node.id, index)}
                >
                  {currentNode.blockRelations[index] || "AND"}
                </Button>
              </div>
            )}
          </React.Fragment>
        ))}
      </div>

      <div className="flex justify-center mt-8 pb-4">
        <Button
          onClick={() => addBlock(node.id)}
          className="bg-blue-500 hover:bg-blue-600 text-white"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Block
        </Button>
      </div>
    </div>
  );
};

export default ConditionNodeSheet;

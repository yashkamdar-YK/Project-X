import React, { useEffect } from "react";
import { Node } from "@xyflow/react";
import { NodeTypes } from "../../../../_utils/nodeTypes";
import { useSheetStore } from "@/lib/store/SheetStore";
import { X, Plus } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useDataPointsStore } from "@/lib/store/dataPointsStore";
import { useConditionStore } from "@/lib/store/conditionStore";
import { ConditionBlock } from './ConditionBlock';
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
      defaultOptionsService.getCloseTime(convertToMinutes(selectedTimeFrame)).then((res) => {
        setData("CloseTime", res.data.data);
      });
      defaultOptionsService.getTimeIntervalsData(convertToMinutes(selectedTimeFrame)).then((res) => {
        setData("OpenTime", res.data.data);
      });
    }
  }, [selectedTimeFrame]);

  const currentNode = conditionBlocks[node.id];
  if (!currentNode) return null;

  return (
    <div className="dark:bg-gray-900 rounded-lg">
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


      <Card className="dark:bg-gray-900 border-l mt-4 border-gray-200 dark:border-gray-800">
        <CardContent className="space-y-8 mt-6">
          <div className="flex items-center justify-center">
            <Input
              id="condition-name"
              value={currentNode.name}
              onChange={(e) => updateBlockSettings(node.id, "name", validateName(e.target.value))}
              className="w-60 text-center border-none focus:ring-1 !text-lg"
            />
          </div>

          <Tabs defaultValue={currentNode.type} className="w-full">
            <TabsList className="grid w-full grid-cols-3"  >
              <TabsTrigger
                value="entry"
                onClick={() => updateBlockSettings(node.id, "type", "entry")}
                className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
              >Entry</TabsTrigger>
              <TabsTrigger
                onClick={() => updateBlockSettings(node.id, "type", "exit")}
                className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                value="exit">Exit</TabsTrigger>
              <TabsTrigger
                onClick={() => updateBlockSettings(node.id, "type", "adjustment")}
                className="data-[state=active]:bg-blue-500 data-[state=active]:text-white"
                value="adjustment">Adjustment</TabsTrigger>
            </TabsList>
          </Tabs>
          {currentNode.type !== "exit" &&
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="max-entries">
                  Max Entries using this condition:
                </Label>
                <Input
                  id="max-entries"
                  value={currentNode.maxEntries}
                  onChange={(e) => updateBlockSettings(node.id, "maxEntries", e.target.value)}
                  className="w-20 text-right"
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="wait-trigger">
                  Check if any Wait Trade Trigger is open:
                </Label>
                <Switch
                  id="wait-trigger"
                  checked={currentNode.waitTrigger}
                  className="data-[state=checked]:bg-blue-500"
                  onCheckedChange={(checked) => updateBlockSettings(node.id, "waitTrigger", checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="position-open">
                  Check if any Position is Open:
                </Label>
                <div className="h-12">
                  <Switch
                    id="position-open"
                    checked={currentNode.positionOpen}
                    className="data-[state=checked]:bg-blue-500"
                    onCheckedChange={(checked) =>
                      updateBlockSettings(node.id, "positionOpen", checked)
                    }
                  />
                </div>
              </div>
            </div>}
        </CardContent>
      </Card>

      <div className="space-y-8  mt-8 -mx-4">
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
                  updateSubSection(nodeId, block.id, subSectionId, field, value)}
                removeSubSection={(nodeId, subSectionId) =>
                  removeSubSection(nodeId, block.id, subSectionId)}
                toggleAddBadge={(nodeId, subSectionId) =>
                  toggleAddBadge(nodeId, block.id, subSectionId)}
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

      <div className="flex justify-center mt-8">
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
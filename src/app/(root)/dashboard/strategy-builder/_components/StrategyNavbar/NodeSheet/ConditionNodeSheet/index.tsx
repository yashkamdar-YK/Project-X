import React from "react";
import { Node } from "@xyflow/react";
import { NodeTypes } from "../../../../_utils/nodeTypes";
import { useSheetStore } from "@/lib/store/SheetStore";
import { X } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useDataPointsStore } from "@/lib/store/dataPointsStore";
import { useConditionStore } from "@/lib/store/conditionStore";
import { ConditionBlock } from './ConditionBlock';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface ConditionNodeSheetProps {
  node: Node & {
    type: typeof NodeTypes.CONDITION;
    data: {
      label: string;
      settings?: {
        indicator?: string;
        period?: number;
        threshold?: number;
        comparison?: string;
      };
    };
  };
}

const ConditionNodeSheet: React.FC<ConditionNodeSheetProps> = ({ node }) => {
  const { closeSheet } = useSheetStore();
  const { dataPoints } = useDataPointsStore();
  const {
    conditionBlocks,
    addConditionBlock,
    addSubSection,
    updateSubSection,
    removeSubSection,
    toggleAddBadge,
    toggleBlockRelation,
    getBlockRelation,
  } = useConditionStore();

  const [maxEntries, setMaxEntries] = React.useState("1");
  const [waitTrigger, setWaitTrigger] = React.useState(false);
  const [positionOpen, setPositionOpen] = React.useState(false);

  return (
    <div className="bg-gray-900 p-6 rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold text-gray-100">
          Condition Builder
        </h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={closeSheet}
          className="rounded-full hover:bg-gray-800"
        >
          <X className="w-5 h-5" />
        </Button>
      </div>

      <Card className="dark:bg-gray-900 border-l mt-4 border-gray-200 dark:border-gray-800">
        <CardContent className="space-y-8 mt-6">
          <Tabs defaultValue="entry" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="entry">Entry</TabsTrigger>
              <TabsTrigger value="exit">Exit</TabsTrigger>
              <TabsTrigger value="adjustment">Adjustment</TabsTrigger>
            </TabsList>
          </Tabs>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label htmlFor="max-entries">
                Max Entries using this condition:
              </Label>
              <Input
                id="max-entries"
                value={maxEntries}
                onChange={(e) => setMaxEntries(e.target.value)}
                className="w-20 text-right"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="wait-trigger">
                Check if any Wait Trade Trigger is open:
              </Label>
              <Switch
                id="wait-trigger"
                checked={waitTrigger}
                className="data-[state=checked]:bg-blue-500"
                onCheckedChange={setWaitTrigger}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="position-open">
                Check if any Position is Open:
              </Label>
              <div className="h-12">
                <Switch
                  id="position-open"
                  checked={positionOpen}
                  className="data-[state=checked]:bg-blue-500"
                  onCheckedChange={setPositionOpen}
                />
              </div>
            </div>
          </div>
          </CardContent>
      </Card>

      <Card className="bg-gray-900 border-gray-800">
        <CardContent className="space-y-8 p-6">
          {conditionBlocks.map((block, blockIndex) => (
            <ConditionBlock
              key={block.id}
              block={block}
              blockIndex={blockIndex}
              totalBlocks={conditionBlocks.length}
              // @ts-ignore
              dataPoints={dataPoints}
              addSubSection={addSubSection}
              updateSubSection={updateSubSection}
              removeSubSection={removeSubSection}
              toggleAddBadge={toggleAddBadge}
              toggleBlockRelation={toggleBlockRelation}
              getBlockRelation={getBlockRelation}
              addConditionBlock={addConditionBlock}
            />
          ))}
        </CardContent>
      </Card>
    </div>
  );
};

export default ConditionNodeSheet;


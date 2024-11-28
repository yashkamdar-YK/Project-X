import React from 'react';
import { useSheetStore } from "@/lib/store/SheetStore";
import { X } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { NodeTypes } from "../../_utils/nodeTypes";
import { useNodeStore } from "@/lib/store/nodeStore";

const NodeSheet = () => {
  const { closeSheet, type, selectedItem } = useSheetStore();
  const { nodes, setNodes } = useNodeStore();

  if (type !== 'node' || !selectedItem) return null;

  const updateNodeSettings = (newSettings: any) => {
    const updatedNodes = nodes.map(node => {
      if (node.id === selectedItem.id) {
        return {
          ...node,
          data: {
            ...node.data,
            settings: {
              //@ts-ignore
              ...node.data.settings,
              ...newSettings
            }
          }
        };
      }
      return node;
    });
    setNodes(updatedNodes);
  };

  const renderConditionSettings = () => (
    <div className="space-y-4">
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label>Indicator Type</Label>
          <Select 
            defaultValue={selectedItem.data?.settings?.indicator || "MA"}
            onValueChange={(value) => updateNodeSettings({ indicator: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select indicator" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MA">Moving Average</SelectItem>
              <SelectItem value="RSI">RSI</SelectItem>
              <SelectItem value="MACD">MACD</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Period</Label>
          <Input 
            type="number" 
            defaultValue={selectedItem.data?.settings?.period || 14}
            onChange={(e) => updateNodeSettings({ period: parseInt(e.target.value) })}
          />
        </div>

        <div className="space-y-2">
          <Label>Threshold</Label>
          <Input 
            type="number" 
            defaultValue={selectedItem.data?.settings?.threshold || 30}
            onChange={(e) => updateNodeSettings({ threshold: parseInt(e.target.value) })}
          />
        </div>
      </div>
    </div>
  );

  const renderActionSettings = () => (
    <div className="space-y-4">
      <div className="grid gap-4">
        <div className="space-y-2">
          <Label>Order Type</Label>
          <Select 
            defaultValue={selectedItem.data?.settings?.orderType || "MARKET"}
            onValueChange={(value) => updateNodeSettings({ orderType: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select order type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="MARKET">Market</SelectItem>
              <SelectItem value="LIMIT">Limit</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Quantity</Label>
          <Input 
            type="number" 
            defaultValue={selectedItem.data?.settings?.quantity || 1}
            onChange={(e) => updateNodeSettings({ quantity: parseInt(e.target.value) })}
          />
        </div>

        <div className="flex items-center justify-between">
          <Label>Use Stop Loss</Label>
          <Switch 
            checked={selectedItem.data?.settings?.useStopLoss || false}
            onCheckedChange={(checked) => updateNodeSettings({ useStopLoss: checked })}
          />
        </div>
      </div>
    </div>
  );

  return (
    <div className="h-full md:w-[380px]">
      <Card className="h-full border-0 rounded-none">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-2xl font-bold">
            {selectedItem.data.label}
          </CardTitle>
          <Button
            variant="ghost"
            size="icon"
            onClick={closeSheet}
            className="rounded-full"
          >
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent>
          <CardDescription className="text-sm text-gray-500 dark:text-gray-400 mb-6">
            Configure the settings for this {selectedItem.type.toLowerCase()} node
          </CardDescription>

          {selectedItem.type === NodeTypes.CONDITION && renderConditionSettings()}
          {selectedItem.type === NodeTypes.ACTION && renderActionSettings()}
          
          <div className="mt-6">
            <Button 
              className="w-full"
              onClick={closeSheet}
            >
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NodeSheet;
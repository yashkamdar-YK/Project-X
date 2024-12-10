import React from "react";
import { Node } from "@xyflow/react";
import { NodeTypes } from "../../../_utils/nodeTypes";
import { useSheetStore } from "@/lib/store/SheetStore";
import { X, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
// Define an interface for the component props
interface ActionNodeSheetProps {
  node: Node & {
    type: typeof NodeTypes.ACTION;
    data: {
      label: string;
      settings?: {
        action?: string;
        quantity?: number;
        orderType?: string;
        priceOffset?: number;
      };
    };
  };
}

const ActionNodeSheet: React.FC<ActionNodeSheetProps> = ({ node }) => {
  const { closeSheet, selectedItem } = useSheetStore();

  return (
    <div>
      <div className="dark:text-gray-300 text-gray-500">
        <div className="flex justify-end items-center mb-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={closeSheet}
            className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        <h2 className="text-2xl text-center font-semibold">
          Action Node Details
        </h2>

        <Card className="dark:bg-gray-900 border-l mt-4 border-gray-200 dark:border-gray-800">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2"></CardHeader>
          <CardContent className="space-y-6">
            {/* Settings */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="max-entries">Action Name</Label>
                <Input
                  id="max-entries"
                  value={selectedItem?.data?.label}
                  className="w-60"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
export default ActionNodeSheet;

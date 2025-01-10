import React from "react";
import { Node } from "@xyflow/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NodeTypes } from "../../../../_utils/nodeTypes";
import { useSheetStore } from "@/lib/store/SheetStore";
import {
  X,
  Plus,
  PlusIcon,
  Trash2,
  AlertCircle,
  LayoutGrid,
  Pencil,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PositionCard from "./PositionCard";
import { Position, PositionSettings } from "./types";
import { Action, useActionStore } from "@/lib/store/actionStore";
import { validateNodeName } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface ActionNodeSheetProps {
  node: Node;
}

const ActionNodeSheet: React.FC<ActionNodeSheetProps> = ({ node }) => {
  const { closeSheet } = useSheetStore();
  const {
    actionNodes,
    updateNodeName,
    addAction,
    removeAction,
    addPosition,
    removePosition,
    updatePositionSetting,
    moveItemUp,
    moveItemDown,
  } = useActionStore();

  const currentNode = actionNodes[node.id] || {
    nodeName: "",
    items: [],
  };

  // Sort items by order
  const sortedItems = [...currentNode.items].sort((a, b) => a.order - b.order);

  const availableActions = [
    {
      label: "Square off all positions",
      func: "squareoff_all" as const,
      icon: Trash2,
    },
    {
      label: "Stop wait trade triggers",
      func: "stop_WaitTrade_triggers" as const,
      icon: AlertCircle,
    },
    {
      label: "Add new position",
      func: "addLeg" as const,
      icon: LayoutGrid,
    },
  ];

  const handleAddAction = (actionType: string) => {
    if (actionType === "addLeg") {
      addPosition(node.id);
    } else {
      addAction(node.id, {
        func: actionType as "squareoff_all" | "stop_WaitTrade_triggers",
      });
    }
  };

  const handleRemoveAction = (actionId: string) => {
    console.log("actionId", actionId);
    removeAction(node.id, actionId);
  };

  const handleRemovePosition = (positionId: string) => {
    removePosition(node.id, positionId);
  };

  const handlePositionSettingChange = (
    positionId: string,
    field: keyof PositionSettings,
    value: any
  ) => {
    updatePositionSetting(node.id, positionId, field, value);
  };

  return (
    <div>
      {/* Header section remains the same */}
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

      {/* Node name section remains the same */}
      <div className="relative mb-8 rounded-lg p-3">
        <div className="flex items-center justify-center gap-2">
          <div className="relative">
            <Input
              id="action-name"
              value={currentNode?.nodeName}
              onChange={(e) => {
                const validatedInput = e.target.value
                  .replace(/[^a-zA-Z0-9\s]/g, "")
                  .slice(0, 30);
                updateNodeName(node.id, validateNodeName(validatedInput));
              }}
              className="w-60 text-center z-[2] bg-transparent relative font-semibold border-none !text-xl focus:ring-0"
              placeholder="Enter action name"
            />
            <Pencil className="w-4 h-4 cursor-pointer transition-colors z-[1] absolute right-2 top-[29%]" />
          </div>
        </div>
        {currentNode?.nodeName?.length === 30 && (
          <p className="text-xs text-orange-500">
            Maximum character limit reached (30)
          </p>
        )}
      </div>

      <div className="grid gap-3 mb-3">
        {sortedItems.map((item, index) => {
          if (item.type === "position") {
            return (
              <PositionCard
                key={item.id}
                position={item.data as Position}
                isFirst={index === 0}
                isLast={index === sortedItems.length - 1}
                nodeId={node.id}
                onRemove={() => handleRemovePosition(item.id)}
                onSettingChange={(positionId, field, value) =>
                  handlePositionSettingChange(positionId, field, value)
                }
              />
            );
          } else {
            const actionConfig = availableActions.find(
              (a) => a.func === (item.data as Action).func
            );
            if (!actionConfig) return null;

            return (
              <div
                key={item.id}
                className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-700">
                    <actionConfig.icon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                  </div>
                  <p className="font-medium text-gray-900 dark:text-gray-100">
                    {actionConfig?.label}
                  </p>

                  {/* Reorder Buttons for Actions */}
                  <div className="flex gap-1 ml-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={index === 0}
                      onClick={() => moveItemUp(node.id, item.id)}
                      className="h-6 w-6 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                      <ArrowUp className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      disabled={index === sortedItems.length - 1}
                      onClick={() => moveItemDown(node.id, item.id)}
                      className="h-6 w-6 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                      <ArrowDown className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRemoveAction((item.data as Action).func)}
                  className="h-8 w-8 rounded-full hover:bg-red-100 dark:hover:bg-red-900 hover:text-red-600 dark:hover:text-red-400"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            );
          }
        })}
      </div>

      {/* Add Action Button */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="w-full bg-white dark:bg-gray-800 border-2 border-dashed border-gray-300 dark:border-gray-600 hover:border-gray-400 dark:hover:border-gray-500 shadow-sm"
          >
            <PlusIcon size={16} className="mr-2" />
            Add New Action
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          {availableActions.map(({ label, func, icon: Icon }) => (
            <DropdownMenuItem
              key={func}
              onClick={() => handleAddAction(func)}
              disabled={
                func !== "addLeg" &&
                sortedItems.some(
                  (item) =>
                    //@ts-ignore
                    item.type === "action" && item.data.func === func
                )
              }
              className={`
                flex items-center gap-3 p-3 rounded-md cursor-pointer
                ${
                  func !== "addLeg" &&
                  sortedItems.some(
                    (item) =>
                      //@ts-ignore
                      item.type === "action" && item.data.func === func
                  )
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-gray-100 dark:hover:bg-gray-700"
                }
              `}
            >
              <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 shrink-0">
                <Icon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
              </div>
              <span className="font-medium text-gray-900 dark:text-gray-100">
                {label}
              </span>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default ActionNodeSheet;

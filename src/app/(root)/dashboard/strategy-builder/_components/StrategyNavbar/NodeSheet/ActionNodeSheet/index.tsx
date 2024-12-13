import React, { useEffect } from "react";
import { Node } from "@xyflow/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NodeTypes } from "../../../../_utils/nodeTypes";
import { useSheetStore } from "@/lib/store/SheetStore";
import { X, Plus, PlusIcon, Trash2, AlertCircle, LayoutGrid } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import PositionCard from "./PositionCard";
import { Position, PositionSettings } from './types';
import { useActionStore } from "@/lib/store/actionStore";
import { transformToActionPayload } from "./transformToActionPayload ";

interface ActionNodeSheetProps {
  node: Node;
}

const ActionNodeSheet: React.FC<ActionNodeSheetProps> = ({ node }) => {
  const { closeSheet } = useSheetStore();
  const {
    actionNodes,
    createActionNode,
    updateNodeName,
    addAction,
    removeAction,
    addPosition,
    removePosition,
    updatePositionSetting,
  } = useActionStore();

  // Initialize the action node if it doesn't exist
  useEffect(() => {
    if (!actionNodes[node.id]) {
      createActionNode(node.id);
      updateNodeName(node.id, `Action ${Object.keys(actionNodes).length + 1}`);
    }
  }, [node.id, actionNodes, createActionNode]);

  const currentNode = actionNodes[node.id] || { nodeName: '', actions: [], positions: [] };

  const availableActions = [
    { 
      label: "Square off all positions",
      func: "squareoff_all" as const,
      icon: Trash2
    },
    { 
      label: "Stop wait trade triggers",
      func: "stop_WaitTrade_triggers" as const,
      icon: AlertCircle
    },
    { 
      label: "Add new position",
      func: "addLeg" as const,
      icon: LayoutGrid
    }
  ];

  const handleAddAction = (actionType: string) => {
    if (actionType === "addLeg") {
      addPosition(node.id);
    } else {
      addAction(node.id, { func: actionType as 'squareoff_all' | 'stop_WaitTrade_triggers' });
    }
  };

  const handleRemoveAction = (actionFunc: string) => {
    removeAction(node.id, actionFunc);
  };

  const handleRemovePosition = (positionId: string) => {
    removePosition(node.id, positionId);
  };

  const handlePositionSettingChange = (positionId: string, field: keyof PositionSettings, value: any) => {
    updatePositionSetting(node.id, positionId, field, value);
  };

  const handleSubmit = () => {
    const currentNode = useActionStore.getState().actionNodes[node.id];
    if (!currentNode) return;
  
    const payload = transformToActionPayload(currentNode.actions, currentNode.positions);
    console.log('Action Payload:', JSON.stringify(payload, null, 2));
  };

  return (
    <div className="p-6 max-h-[90vh] overflow-y-auto bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
            Action Settings
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={closeSheet}
            className="rounded-full hover:bg-gray-200 dark:hover:bg-gray-800"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        {/* Action Name Input */}
        <div className="space-y-2">
          <Label 
            htmlFor="action-name" 
            className="text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Action Name
          </Label>
          <Input
            id="action-name"
            value={currentNode.nodeName}
            onChange={(e) => updateNodeName(node.id, e.target.value)}
            className="bg-white dark:bg-gray-800"
            placeholder="Enter action name"
          />
        </div>

        {/* Active Actions */}
        {currentNode.actions.length > 0 && (
          <div className="space-y-3">
            {currentNode.actions.map((action) => {
              const actionConfig = availableActions.find(a => a.func === action.func);
              if (!actionConfig) return null;
              
              return (
                <div
                  key={action.func}
                  className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-700">
                      <actionConfig.icon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                    </div>
                    <p className="font-medium text-gray-900 dark:text-gray-100">
                      {actionConfig.label}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemoveAction(action.func)}
                    className="h-8 w-8 rounded-full hover:bg-red-100 dark:hover:bg-red-900 hover:text-red-600 dark:hover:text-red-400"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        )}

        {/* Position Cards */}
        {currentNode.positions.length > 0 && (
          <div className="space-y-4">
            <div className="space-y-4">
              {currentNode.positions.map((position) => (
                <PositionCard
                  key={position.id}
                  position={position}
                  onRemove={() => handleRemovePosition(position.id)}
                  onSettingChange={(positionId, field, value) =>
                    handlePositionSettingChange(positionId, field, value)
                  }
                />
              ))}
            </div>
          </div>
        )}

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
          <DropdownMenuContent 
            className="w-56 p-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700"
          >
            {availableActions.map(({ label, func, icon: Icon }) => (
              <DropdownMenuItem
                key={func}
                onClick={() => handleAddAction(func)}
                disabled={
                  func !== "addLeg" &&
                  currentNode.actions.some(action => action.func === func)
                }
                className={`
                  flex items-center gap-3 p-3 rounded-md cursor-pointer
                  ${func !== "addLeg" && currentNode.actions.some(action => action.func === func)
                    ? 'opacity-50 cursor-not-allowed'
                    : 'hover:bg-gray-100 dark:hover:bg-gray-700'}
                `}
              >
                <div className="p-2 rounded-full bg-gray-100 dark:bg-gray-700 shrink-0">
                  <Icon className="w-4 h-4 text-gray-600 dark:text-gray-300" />
                </div>
                <span className="font-medium text-gray-900 dark:text-gray-100">{label}</span>
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Submit Button */}
        <div className="pt-6 border-t border-gray-200 dark:border-gray-700">
          <Button
            onClick={handleSubmit}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white dark:bg-blue-500 dark:hover:bg-blue-600"
          >
            Submit Action
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ActionNodeSheet;
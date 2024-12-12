import React from "react";
import { Position } from "./types";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface ExpandableSectionProps {
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  onSettingChange: (field: string, value: any) => void;
  position: Position;
}

const ExpandableSection: React.FC<ExpandableSectionProps> = ({
  title,
  isExpanded,
  onToggle,
  onSettingChange,
  position,
}) => {
  const renderContent = () => {
    switch (title) {
      case "Target":
        return (
          <div className="space-y-2">
            <Label className="text-xs font-medium text-gray-600 dark:text-gray-300">
              Target Value
            </Label>
            <div className="flex gap-2">
              <div className="flex rounded-md bg-gray-100 dark:bg-gray-800 p-1">
                <button
                  onClick={() => onSettingChange("targetOn", "%")}
                  className={cn(
                    "text-xs font-medium px-3 py-1.5 rounded-md transition-colors min-w-[36px]",
                    position.settings.targetOn === "%"
                      ? "bg-white dark:bg-gray-700 shadow-sm"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                  )}
                >
                  %
                </button>
                <button
                  onClick={() => onSettingChange("targetOn", "₹")}
                  className={cn(
                    "text-xs font-medium px-3 py-1.5 rounded-md transition-colors min-w-[36px]",
                    position.settings.targetOn === "₹"
                      ? "bg-white dark:bg-gray-700 shadow-sm"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                  )}
                >
                  ₹
                </button>
              </div>
              <Input
                type="number"
                value={position.settings.targetValue}
                onChange={(e) =>
                  onSettingChange("targetValue", parseFloat(e.target.value))
                }
                className="flex-1 bg-white dark:bg-gray-900"
                placeholder={`Enter target ${position.settings.targetOn}`}
                step="0.01"
              />
            </div>
          </div>
        );
      case "Stop Loss":
        return (
          <div className="space-y-2">
            <Label className="text-xs font-medium text-gray-600 dark:text-gray-300">
              Stop Loss Value
            </Label>
            <div className="flex gap-2">
              <div className="flex rounded-md bg-gray-100 dark:bg-gray-800 p-1">
                <button
                  onClick={() => onSettingChange("SLon", "%")}
                  className={cn(
                    "text-xs font-medium px-3 py-1.5 rounded-md transition-colors min-w-[36px]",
                    position.settings.SLon === "%"
                      ? "bg-white dark:bg-gray-700 shadow-sm"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                  )}
                >
                  %
                </button>
                <button
                  onClick={() => onSettingChange("SLon", "₹")}
                  className={cn(
                    "text-xs font-medium px-3 py-1.5 rounded-md transition-colors min-w-[36px]",
                    position.settings.SLon === "₹"
                      ? "bg-white dark:bg-gray-700 shadow-sm"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                  )}
                >
                  ₹
                </button>
              </div>
              <Input
                type="number"
                value={position.settings.SLvalue}
                onChange={(e) =>
                  onSettingChange("SLvalue", parseFloat(e.target.value))
                }
                className="flex-1 bg-white dark:bg-gray-900"
                placeholder={`Enter stop loss ${position.settings.SLon}`}
                step="0.01"
              />
            </div>
          </div>
        );
      case "Trail Stop Loss":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs font-medium text-gray-600 dark:text-gray-300">
                Trail Stop Loss On
              </Label>
              <div className="flex rounded-md bg-gray-100 dark:bg-gray-800 p-1">
                <button
                  onClick={() => onSettingChange("trailSLon", "%")}
                  className={cn(
                    "text-xs font-medium px-3 py-1.5 rounded-md transition-colors min-w-[36px]",
                    position.settings.trailSLon === "%"
                      ? "bg-white dark:bg-gray-700 shadow-sm"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                  )}
                >
                  %
                </button>
                <button
                  onClick={() => onSettingChange("trailSLon", "₹")}
                  className={cn(
                    "text-xs font-medium px-3 py-1.5 rounded-md transition-colors min-w-[36px]",
                    position.settings.trailSLon === "₹"
                      ? "bg-white dark:bg-gray-700 shadow-sm"
                      : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                  )}
                >
                  ₹
                </button>
              </div>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium text-gray-600 dark:text-gray-300">
                Trail Stop Loss X
              </Label>
              <Input
                type="number"
                value={position.settings.trailSL_X}
                onChange={(e) =>
                  onSettingChange("trailSL_X", parseFloat(e.target.value))
                }
                className="w-full bg-white dark:bg-gray-900"
                placeholder="Enter trail stop loss X"
                step="0.01"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium text-gray-600 dark:text-gray-300">
                Trail Stop Loss Y
              </Label>
              <Input
                type="number"
                value={position.settings.trailSL_Y}
                onChange={(e) =>
                  onSettingChange("trailSL_Y", parseFloat(e.target.value))
                }
                className="w-full bg-white dark:bg-gray-900"
                placeholder="Enter trail stop loss Y"
                step="0.01"
              />
            </div>
          </div>
        );
      case "Re-Entry Target":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs font-medium text-gray-600 dark:text-gray-300">
                Re-Entry Target On
              </Label>
              <Select
                value={position.settings.reEntryTgOn}
                onValueChange={(value) => onSettingChange("reEntryTgOn", value)}
              >
                <SelectTrigger className="w-full bg-white dark:bg-gray-900">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asap">ASAP</SelectItem>
                  <SelectItem value="asap-rev">ASAP Reverse</SelectItem>
                  <SelectItem value="cost">Cost</SelectItem>
                  <SelectItem value="cost-rev">Cost Reverse</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium text-gray-600 dark:text-gray-300">
                Re-Entry Target Value
              </Label>
              <Input
                type="number"
                value={position.settings.reEntryTgVal}
                onChange={(e) =>
                  onSettingChange("reEntryTgVal", parseFloat(e.target.value))
                }
                className="w-full bg-white dark:bg-gray-900"
                placeholder="Enter re-entry target value"
                step="0.01"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium text-gray-600 dark:text-gray-300">
                Re-Entry Target Max No
              </Label>
              <Input
                type="number"
                value={position.settings.reEntryTgMaxNo}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (val > 20) return;
                  onSettingChange("reEntryTgMaxNo", val);
                }}
                className="w-full bg-white dark:bg-gray-900"
                placeholder="Enter re-entry target max no"
              />
            </div>
          </div>
        );
      case "Re-Entry Stop Loss":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs font-medium text-gray-600 dark:text-gray-300">
                Re-Entry Stop Loss On
              </Label>
              <Select
                value={position.settings.reEntrySLOn}
                onValueChange={(value) => onSettingChange("reEntrySLOn", value)}
              >
                <SelectTrigger className="w-full bg-white dark:bg-gray-900">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="asap">ASAP</SelectItem>
                  <SelectItem value="asap-rev">ASAP Reverse</SelectItem>
                  <SelectItem value="cost">Cost</SelectItem>
                  <SelectItem value="cost-rev">Cost Reverse</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium text-gray-600 dark:text-gray-300">
                Re-Entry Stop Loss Value
              </Label>
              <Input
                type="number"
                value={position.settings.reEntrySLVal}
                onChange={(e) =>
                  onSettingChange("reEntrySLVal", parseFloat(e.target.value))
                }
                className="w-full bg-white dark:bg-gray-900"
                placeholder="Enter re-entry stop loss value"
                step="0.01"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium text-gray-600 dark:text-gray-300">
                Re-Entry Stop Loss Max No
              </Label>
              <Input
                type="number"
                value={position.settings.reEntrySLMaxNo}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (val > 20) return;
                  onSettingChange("reEntrySLMaxNo", val);
                }}
                className="w-full bg-white dark:bg-gray-900"
                placeholder="Enter re-entry stop loss max no"
              />
            </div>
          </div>
        );
      case "Wait Trade":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs font-medium text-gray-600 dark:text-gray-300">
                Wait Trade On
              </Label>
              <Select
                value={position.settings.wtOn}
                onValueChange={(value) => onSettingChange("wtOn", value)}
              >
                <SelectTrigger className="w-full bg-white dark:bg-gray-900">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="val-up">Value Up</SelectItem>
                  <SelectItem value="val-down">Value Down</SelectItem>
                  <SelectItem value="%val-up">% Value Up</SelectItem>
                  <SelectItem value="%val-down">% Value Down</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs font-medium text-gray-600 dark:text-gray-300">
                Wait Trade Value
              </Label>
              <Input
                type="number"
                value={position.settings.wtVal}
                onChange={(e) =>
                  onSettingChange("wtVal", parseFloat(e.target.value))
                }
                className="w-full bg-white dark:bg-gray-900"
                placeholder="Enter wait trade value"
                step="0.01"
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <button
        onClick={onToggle}
        className="w-full text-left text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 py-1"
      >
        {isExpanded ? `- Remove ${title}` : `+ Add ${title}`}
      </button>
      {isExpanded && (
        <div className="mt-3 pl-4 space-y-4 border-l-2 border-blue-200 dark:border-blue-800">
          {renderContent()}
        </div>
      )}
    </div>
  );
};

export default ExpandableSection;
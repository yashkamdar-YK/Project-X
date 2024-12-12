import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Position,
  TransactionType,
  Segment,
  OptionType,
  ExpirationType,
} from "./types";
import { useDataPointStore } from "@/lib/store/dataPointStore";
import { cn } from "@/lib/utils";

interface PositionCardProps {
  position: Position;
  onRemove: (id: string) => void;
  onSettingChange: (id: string, field: string, value: any) => void;
}

const PositionCard: React.FC<PositionCardProps> = ({
  position,
  onRemove,
  onSettingChange,
}) => {
  const { selectedSymbol, symbolInfo } = useDataPointStore();
  const [showTarget, setShowTarget] = useState(false);
  const [showSL, setShowSL] = useState(false);
  const [showTrailSL, setShowTrailSL] = useState(false);
  const [showReEntryTarget, setShowReEntryTarget] = useState(false);
  const [showReEntrySL, setShowReEntrySL] = useState(false);
  const [showWT, setShowWT] = useState(false);

  const handleSLToggle = () => {
    if (!showSL) {
      onSettingChange(position.id, "isSL", true);
      onSettingChange(position.id, "SLon", "%");
      onSettingChange(position.id, "SLvalue", 0);
    } else {
      onSettingChange(position.id, "isSL", false);
      onSettingChange(position.id, "SLon", undefined);
      onSettingChange(position.id, "SLvalue", undefined);
    }
    setShowSL(!showSL);
  };

  const handleTrailSLToggle = () => {
    if (!showTrailSL) {
      onSettingChange(position.id, "isTrailSL", true);
      onSettingChange(position.id, "trailSLon", "%");
      onSettingChange(position.id, "trailSL_X", 0);
      onSettingChange(position.id, "trailSL_Y", 0);
    } else {
      onSettingChange(position.id, "isTrailSL", false);
      onSettingChange(position.id, "trailSLon", undefined);
      onSettingChange(position.id, "trailSL_X", undefined);
      onSettingChange(position.id, "trailSL_Y", undefined);
    }
    setShowTrailSL(!showTrailSL);
  };

  const handleReEntryTargetToggle = () => {
    if (!showReEntryTarget) {
      onSettingChange(position.id, "isReEntryTg", true);
      onSettingChange(position.id, "reEntryTgOn", "asap");
      onSettingChange(position.id, "reEntryTgVal", 0);
      onSettingChange(position.id, "reEntryTgMaxNo", 1);
    } else {
      onSettingChange(position.id, "isReEntryTg", false);
      onSettingChange(position.id, "reEntryTgOn", undefined);
      onSettingChange(position.id, "reEntryTgVal", undefined);
      onSettingChange(position.id, "reEntryTgMaxNo", undefined);
    }
    setShowReEntryTarget(!showReEntryTarget);
  };

  const handleReEntrySLToggle = () => {
    if (!showReEntrySL) {
      onSettingChange(position.id, "isReEntrySL", true);
      onSettingChange(position.id, "reEntrySLOn", "asap");
      onSettingChange(position.id, "reEntrySLVal", 0);
      onSettingChange(position.id, "reEntrySLMaxNo", 1);
    } else {
      onSettingChange(position.id, "isReEntrySL", false);
      onSettingChange(position.id, "reEntrySLOn", undefined);
      onSettingChange(position.id, "reEntrySLVal", undefined);
      onSettingChange(position.id, "reEntrySLMaxNo", undefined);
    }
    setShowReEntrySL(!showReEntrySL);
  };

  const handleWTToggle = () => {
    if (!showWT) {
      onSettingChange(position.id, "isWT", true);
      onSettingChange(position.id, "wtOn", "val-up");
      onSettingChange(position.id, "wtVal", 0);
    } else {
      onSettingChange(position.id, "isWT", false);
      onSettingChange(position.id, "wtOn", undefined);
      onSettingChange(position.id, "wtVal", undefined);
    }
    setShowWT(!showWT);
  };

  if (!selectedSymbol) return null;
  const currentSymbol = symbolInfo[selectedSymbol];

  const handleTargetToggle = () => {
    if (!showTarget) {
      onSettingChange(position.id, "isTarget", true);
      onSettingChange(position.id, "targetOn", "%");
      onSettingChange(position.id, "targetValue", 0);
    } else {
      onSettingChange(position.id, "isTarget", false);
      onSettingChange(position.id, "targetOn", undefined);
      onSettingChange(position.id, "targetValue", undefined);
    }
    setShowTarget(!showTarget);
  };

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm transition-all hover:shadow-md">
      {/* Header with Remove Button */}
      <div className="flex justify-between items-center px-4 py-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 rounded-t-lg">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-gray-700 dark:text-gray-200">
            Position Leg {position.settings.legID}
          </span>
          <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-100">
            {position.settings.segment}
          </span>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => onRemove(position.id)}
          className="h-8 w-8 rounded-full hover:bg-red-100 dark:hover:bg-red-900 hover:text-red-600 dark:hover:text-red-400"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>

      {/* Main Settings */}
      <div className="p-4 space-y-4">
        {/* First Row: Segment, Transaction, Option */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label className="text-xs font-medium text-gray-600 dark:text-gray-300">
              Segment
            </Label>
            <Select
              value={position.settings.segment}
              onValueChange={(value: Segment) =>
                onSettingChange(position.id, "segment", value)
              }
            >
              <SelectTrigger className="w-full bg-white dark:bg-gray-900">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {currentSymbol?.segments?.map((segment: string) => (
                  <SelectItem key={segment} value={segment}>
                    {segment}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium text-gray-600 dark:text-gray-300">
              Transaction
            </Label>
            <Select
              value={position.settings.transactionType}
              onValueChange={(value: TransactionType) =>
                onSettingChange(position.id, "transactionType", value)
              }
            >
              <SelectTrigger className="w-full bg-white dark:bg-gray-900">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="buy">
                  <span className="text-green-600 dark:text-green-400">
                    BUY
                  </span>
                </SelectItem>
                <SelectItem value="sell">
                  <span className="text-red-600 dark:text-red-400">SELL</span>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {position.settings.segment === "OPT" && (
            <div className="space-y-2">
              <Label className="text-xs font-medium text-gray-600 dark:text-gray-300">
                Option Type
              </Label>
              <Select
                value={position.settings.optionType}
                onValueChange={(value: OptionType) =>
                  onSettingChange(position.id, "optionType", value)
                }
              >
                <SelectTrigger className="w-full bg-white dark:bg-gray-900">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CE">Call (CE)</SelectItem>
                  <SelectItem value="PE">Put (PE)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Second Row: Quantity and Strike Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs font-medium text-gray-600 dark:text-gray-300">
              Quantity
            </Label>
            <Input
              type="number"
              value={position.settings.qty}
              onChange={(e) =>
                onSettingChange(position.id, "qty", parseInt(e.target.value))
              }
              className="w-full bg-white dark:bg-gray-900"
              placeholder="Enter quantity"
            />
          </div>

          {position.settings.segment === "OPT" && (
            <div className="space-y-2">
              <Label className="text-xs font-medium text-gray-600 dark:text-gray-300">
                Strike Selection (Moneyness)
              </Label>
              <Select
                value={position.settings.strikeVal.toString()}
                onValueChange={(value) =>
                  onSettingChange(position.id, "strikeVal", parseInt(value))
                }
              >
                <SelectTrigger className="w-full bg-white dark:bg-gray-900">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="-1">-1 (OTM)</SelectItem>
                  <SelectItem value="0">0 (ATM)</SelectItem>
                  <SelectItem value="1">+1 (ITM)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Third Row: Expiry Settings */}
        {(position.settings.segment === "OPT" ||
          position.settings.segment === "FUT") && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-medium text-gray-600 dark:text-gray-300">
                Expiry Type
              </Label>
              <Select
                value={position.settings.expType}
                onValueChange={(value: ExpirationType) =>
                  onSettingChange(position.id, "expType", value)
                }
              >
                <SelectTrigger className="w-full bg-white dark:bg-gray-900">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-gray-600 dark:text-gray-300">
                Expiry Number
              </Label>
              <Input
                type="number"
                value={position.settings.expNo}
                onChange={(e) =>
                  onSettingChange(
                    position.id,
                    "expNo",
                    parseInt(e.target.value)
                  )
                }
                min={0}
                className="w-full bg-white dark:bg-gray-900"
                placeholder="0 for current expiry"
              />
            </div>
          </div>
        )}
      </div>

      {/* Expandable Actions */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-4">
        <div className="space-y-4">
          <div>
            <button
              onClick={handleTargetToggle}
              className="w-full text-left text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 py-1"
            >
              {showTarget ? "- Remove Target" : "+ Add Target"}
            </button>
            {showTarget && (
              <div className="mt-3 pl-4 space-y-4 border-l-2 border-blue-200 dark:border-blue-800">
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-gray-600 dark:text-gray-300">
                    Target Value
                  </Label>
                  <div className="flex gap-2">
                    {/* Toggle Buttons */}
                    <div className="flex rounded-md bg-gray-100 dark:bg-gray-800 p-1">
                      <button
                        onClick={() =>
                          onSettingChange(position.id, "targetOn", "%")
                        }
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
                        onClick={() =>
                          onSettingChange(position.id, "targetOn", "₹")
                        }
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

                    {/* Input Field */}
                    <Input
                      type="number"
                      value={position.settings.targetValue}
                      onChange={(e) =>
                        onSettingChange(
                          position.id,
                          "targetValue",
                          parseFloat(e.target.value)
                        )
                      }
                      className="flex-1 bg-white dark:bg-gray-900"
                      placeholder={`Enter target ${position.settings.targetOn}`}
                      step="0.01"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div>
            <button
              onClick={handleSLToggle}
              className="w-full text-left text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 py-1"
            >
              {showSL ? "- Remove Stop Loss" : "+ Add Stop Loss"}
            </button>

            {showSL && (
              <div className="mt-3 pl-4 space-y-4 border-l-2 border-red-200 dark:border-red-800">
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-gray-600 dark:text-gray-300">
                    Stop Loss Value
                  </Label>
                  <div className="flex gap-2">
                    {/* Toggle Buttons */}
                    <div className="flex rounded-md bg-gray-100 dark:bg-gray-800 p-1">
                      <button
                        onClick={() =>
                          onSettingChange(position.id, "SLon", "%")
                        }
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
                        onClick={() =>
                          onSettingChange(position.id, "SLon", "₹")
                        }
                        className={cn(
                          "text-xs font-medium px-3 py-1.5 rounded-md transition-colors min-w-[36px]",
                          position.settings.SLon === "₹"
                            ? "bg-white dark:bg-gray-700 shadow-sm"
                            : "text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                        )}
                      >
                        ₹
                      </button>
                      {/* Input Field */}
                      <Input
                        type="number"
                        value={position.settings.SLvalue}
                        onChange={(e) =>
                          onSettingChange(
                            position.id,
                            "SLvalue",
                            parseFloat(e.target.value)
                          )
                        }
                        className="flex-1 bg-white dark:bg-gray-900"
                        placeholder={`Enter stop loss ${position.settings.SLon}`}
                        step="0.01"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div>
            <button
              onClick={handleTrailSLToggle}
              className="w-full text-left text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 py-1"
            >
              {showTrailSL
                ? "- Remove Trail Stop Loss"
                : "+ Add Trail Stop Loss"}
            </button>
            {showTrailSL && (
              <div className="mt-3 pl-4 space-y-4 border-l-2 border-yellow-200 dark:border-yellow-800">
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-gray-600 dark:text-gray-300">
                    Trail Stop Loss On
                  </Label>
                  <div className="flex gap-2">
                    {/* Toggle Buttons */}
                    <div className="flex rounded-md bg-gray-100 dark:bg-gray-800 p-1">
                      <button
                        onClick={() =>
                          onSettingChange(position.id, "trailSLon", "%")
                        }
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
                        onClick={() =>
                          onSettingChange(position.id, "trailSLon", "₹")
                        }
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
                </div>
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-gray-600 dark:text-gray-300">
                    Trail Stop Loss X
                  </Label>
                  <Input
                    type="number"
                    value={position.settings.trailSL_X}
                    onChange={(e) =>
                      onSettingChange(
                        position.id,
                        "trailSL_X",
                        parseFloat(e.target.value)
                      )
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
                      onSettingChange(
                        position.id,
                        "trailSL_Y",
                        parseFloat(e.target.value)
                      )
                    }
                    className="w-full bg-white dark:bg-gray-900"
                    placeholder="Enter trail stop loss Y"
                    step="0.01"
                  />
                </div>
              </div>
            )}
          </div>
          {/* <button className="w-full text-left text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 py-1">
            + Re-Entry Target
          </button> */}
          <div>
            <button
              onClick={handleReEntryTargetToggle}
              className="w-full text-left text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 py-1"
            >
              {showReEntryTarget
                ? "- Remove Re-Entry Target"
                : "+ Add Re-Entry Target"}
            </button>
            {showReEntryTarget && (
              <div className="mt-3 pl-4 space-y-4 border-l-2 border-green-200 dark:border-green-800">
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-gray-600 dark:text-gray-300">
                    Re-Entry Target On
                  </Label>
                  <Select
                    value={position.settings.reEntryTgOn}
                    onValueChange={(value) =>
                      onSettingChange(position.id, "reEntryTgOn", value)
                    }
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
                      onSettingChange(
                        position.id,
                        "reEntryTgVal",
                        parseFloat(e.target.value)
                      )
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
                      onSettingChange(position.id, "reEntryTgMaxNo", val);
                    }}
                    className="w-full bg-white dark:bg-gray-900"
                    placeholder="Enter re-entry target max no"
                  />
                </div>
              </div>
            )}
          </div>

          <div>
            <button
              onClick={handleReEntrySLToggle}
              className="w-full text-left text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 py-1"
            >
              {showReEntrySL
                ? "- Remove Re-Entry Stop Loss"
                : "+ Add Re-Entry Stop Loss"}
            </button>
            {showReEntrySL && (
              <div className="mt-3 pl-4 space-y-4 border-l-2 border-green-200 dark:border-green-800">
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-gray-600 dark:text-gray-300">
                    Re-Entry Stop Loss On
                  </Label>
                  <Select
                    value={position.settings.reEntrySLOn}
                    onValueChange={(value) =>
                      onSettingChange(position.id, "reEntrySLOn", value)
                    }
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
                      onSettingChange(
                        position.id,
                        "reEntrySLVal",
                        parseFloat(e.target.value)
                      )
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
                      onSettingChange(position.id, "reEntrySLMaxNo", val);
                    }}
                    className="w-full bg-white dark:bg-gray-900"
                    placeholder="Enter re-entry stop loss max no"
                  />
                </div>
              </div>
            )}
          </div>

          <div>
            <button
              onClick={handleWTToggle}
              className="w-full text-left text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 py-1"
            >
              {showWT ? "- Remove Wait Trade" : "+ Add Wait Trade"}
            </button>
            {showWT && (
              <div className="mt-3 pl-4 space-y-4 border-l-2 border-green-200 dark:border-green-800">
                <div className="space-y-2">
                  <Label className="text-xs font-medium text-gray-600 dark:text-gray-300">
                    Wait Trade On
                  </Label>
                  <Select
                    value={position.settings.wtOn}
                    onValueChange={(value) =>
                      onSettingChange(position.id, "wtOn", value)
                    }
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
                      onSettingChange(
                        position.id,
                        "wtVal",
                        parseFloat(e.target.value)
                      )
                    }
                    className="w-full bg-white dark:bg-gray-900"
                    placeholder="Enter wait trade value"
                    step="0.01"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PositionCard;

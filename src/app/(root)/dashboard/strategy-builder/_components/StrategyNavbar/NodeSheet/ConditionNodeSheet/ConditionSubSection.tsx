import React, { useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown, Minus, Plus, Trash2 } from "lucide-react";
import { SubSection } from "./types";
import { DataPoint } from "../../../DashboardSidebar/DatapointDialog/types";
import { ALLOWED_OPERATIONS, DEFAULT_OPTIONS, VALID_DAYS } from "./_const";
import { useIndicatorStore } from "@/lib/store/IndicatorStore";
import { useApplyDataStore } from "@/lib/store/applyDataStore";

interface ConditionSubSectionProps {
  subSection: SubSection;
  nodeId: string;
  blockId: string;
  dataPoints: DataPoint[];
  updateSubSection: (
    nodeId: string,
    subSectionId: number,
    field: keyof SubSection,
    value: string
  ) => void;
  toggleAddBadge: (nodeId: string, subSectionId: number) => void;
  removeSubSection: (nodeId: string, subSectionId: number) => void;
  addSubSection: (nodeId: string) => void;
  isLastSubSection: boolean;
}

export const ConditionSubSection: React.FC<ConditionSubSectionProps> = ({
  subSection,
  nodeId,
  blockId,
  dataPoints,
  updateSubSection,
  toggleAddBadge,
  removeSubSection,
  addSubSection,
  isLastSubSection,
}) => {
  const { indicators } = useIndicatorStore();
  const { getData } = useApplyDataStore();

  const lhsOptions = [
    ...dataPoints.map((dp) => dp.elementName),
    ...indicators.map((ind) => ind.elementName),
    ...DEFAULT_OPTIONS,
  ];
  const selectedLHS =
    dataPoints.find((dp) => dp.elementName === subSection.lhs) ||
    indicators.find((ind) => ind.elementName === subSection.lhs) ||
    subSection.lhs;

  const selectedRHS =
    dataPoints.find((dp) => dp.elementName === subSection.rhs) ||
    indicators.find((ind) => ind.elementName === subSection.rhs) ||
    subSection.rhs;

  //@ts-ignore
  const columns = selectedLHS?.options?.columnsAvailable || [];
  //@ts-ignore
  const RHSColumns = selectedRHS?.options?.columnsAvailable || [];
  //@ts-ignore
  const hasCandleLocation = selectedLHS?.options?.candleLocation || false;
  //@ts-ignore
  const hasRHSCandleLocation = selectedRHS?.options?.candleLocation || false;

  const operatorType =
    //@ts-ignore
    selectedLHS?.options?.type ||
    //@ts-ignore
    getData(subSection.lhs)?.type ||
    subSection.lhs;
  //@ts-ignore
  const allowedOperations = ALLOWED_OPERATIONS[operatorType] || [];

  const canCompareWith =
    //@ts-ignore
    selectedLHS?.options?.canComparedwith?.map((v) => v.toLowerCase()) ||
    //@ts-ignore
    getData(subSection.lhs)?.canComparedwith?.map((v) => v.toLowerCase());

  const getRHSOptions = useCallback(() => {
    const defaultOpts = DEFAULT_OPTIONS.filter((opt) => {
      //@ts-ignore
      const options = getData(opt);
      //@ts-ignore
      const type = options?.type;
      return type && canCompareWith?.includes(type.toLowerCase());
    });

    const options = [
      ...dataPoints
        .filter((dp) =>
          canCompareWith?.includes(dp.options?.type.toLowerCase())
        )
        .map((dp) => dp.elementName),
      ...indicators
        .filter((ind) =>
          canCompareWith?.includes(ind.options?.type.toLowerCase())
        )
        .map((ind) => ind.elementName),
      ...(canCompareWith?.includes("values") ? ["value"] : []),
      ...defaultOpts,
    ];

    return subSection.operator === "cross_above" ||
      subSection.operator === "cross_below"
      ? options.filter((opt) => opt !== subSection.lhs)
      : options;
  }, [canCompareWith, subSection.lhs, subSection.operator]);

  const selectClass = "text-sm py-1 px-2 h-8";

  return (
    <div className="py-3 border-y mb-8 last:mb-3 relative">
      <div className="flex flex-1 items-center flex-col  gap-2 justify-between">
        <div className="flex justify-evenly gap-2">
          <Select
            value={subSection.lhs}
            onValueChange={(v) =>
              updateSubSection(nodeId, subSection.id, "lhs", v)
            }
          >
            <SelectTrigger
              className={`${selectClass} max-w-32 w-fit`}
            >
              <SelectValue placeholder="Variable" />
            </SelectTrigger>
            <SelectContent>
              {lhsOptions.map((opt) => (
                <SelectItem key={opt} value={opt}>
                  {opt}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {columns.length > 0 && (
            <Select
              value={subSection.column}
              onValueChange={(v) =>
                updateSubSection(nodeId, subSection.id, "column", v)
              }
            >
              <SelectTrigger
                className={`${selectClass} max-w-28 w-fit`}
              >
                <SelectValue placeholder="Column" />
              </SelectTrigger>
              <SelectContent>
                {/* @ts-ignore */}
                {columns.map((col) => (
                  <SelectItem key={col} value={col}>
                    {col}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {hasCandleLocation && (
            <Select
              value={subSection.selectedPeriod}
              onValueChange={(v) => {
                if (v === "prev-n") {
                  updateSubSection(nodeId, subSection.id, "nValue", "1");
                }
                updateSubSection(
                  nodeId,
                  subSection.id,
                  "selectedPeriod",
                  v
                );
              }}
            >
              <SelectTrigger
                className={`${selectClass} max-w-28 w-fit`}
              >
                <SelectValue placeholder="Period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="current">Current</SelectItem>
                <SelectItem value="prev">Previous</SelectItem>
                <SelectItem value="prev-n">Previous (n)</SelectItem>
              </SelectContent>
            </Select>
          )}

          {subSection.selectedPeriod === "prev-n" && hasCandleLocation && (
            <div className="flex items-center border rounded-lg overflow-hidden">
              <Button
                onClick={() => {
                  const currentValue = Number(subSection.nValue) || 1;
                  if (currentValue > 1) {
                    updateSubSection(
                      nodeId,
                      subSection.id,
                      "nValue",
                      String(currentValue - 1)
                    );
                  }
                }}
                size="sm"
                className="bg-gray-100 hover:bg-gray-200 h-7 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-600 rounded-r-none dark:text-slate-400"
                disabled={Number(subSection.nValue) <= 1}
              >
                <Minus className="w-3 h-3" />
              </Button>
              <Input
                type="number"
                value={subSection.nValue || 1}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  if (!isNaN(value) && value >= 1 && value <= 20) {
                    updateSubSection(
                      nodeId,
                      subSection.id,
                      "nValue",
                      String(value)
                    );
                  }
                }}
                readOnly
                className="!text-center !text-xs h-6 px-0 w-8 ml-2 text-gray-800 dark:text-white border-none focus:ring-0"
                min={1}
                max={20}
              />
              <Button
                size="sm"
                onClick={() => {
                  const currentValue = Number(subSection.nValue) || 1;
                  if (currentValue < 20) {
                    updateSubSection(
                      nodeId,
                      subSection.id,
                      "nValue",
                      String(currentValue + 1)
                    );
                  }
                }}
                className="bg-gray-100 hover:bg-gray-200 h-7 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-l-none text-gray-600 dark:text-slate-400"
                disabled={Number(subSection.nValue) >= 20}
              >
                <Plus className="w-3 h-3" />
              </Button>
            </div>
          )}
        </div>

        <Select
          value={subSection.operator}
          onValueChange={(v) =>
            updateSubSection(nodeId, subSection.id, "operator", v)
          }
        >
          <SelectTrigger className={`${selectClass} w-fit`}>
            <SelectValue placeholder="Operator">
              {(() => {
                const selectedOperation = allowedOperations?.find(
                  //@ts-ignore
                  (op) => op.value === subSection.operator
                );
                if (!selectedOperation) return subSection.operator;

                if (typeof selectedOperation.label === "function") {
                  return (
                    <div className="flex items-center gap-2">
                      <span>{subSection.operator}</span>
                      {selectedOperation.label()}
                    </div>
                  );
                }

                return `${subSection.operator} (${selectedOperation.label})`;
              })()}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {/* @ts-ignore */}
            {allowedOperations.map((op) => (
              <SelectItem key={op.value} value={op.value}>
                {typeof op.label === "function" ? op.label() : op.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex items-center">
          <div className="flex justify-evenly gap-2">
            <Select
              value={subSection.rhs}
              onValueChange={(v) =>
                updateSubSection(nodeId, subSection.id, "rhs", v)
              }
            >
              <SelectTrigger
                className={`${selectClass} max-w-32 w-fit`}
              >
                <SelectValue placeholder="Compare with" />
              </SelectTrigger>
              <SelectContent>
                {(subSection.lhs === "candle_close_time"
                  ? getData("CloseTime")
                  : subSection.lhs === "candle_time"
                    ? getData("OpenTime")
                    : subSection.lhs === "day_of_week"
                      ? VALID_DAYS
                      : getRHSOptions()
                )
                  //@ts-ignore
                  ?.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>

            {RHSColumns.length > 0 && (
              <Select
                value={subSection.rhs_column}
                onValueChange={(v) =>
                  updateSubSection(nodeId, subSection.id, "rhs_column", v)
                }
              >
                <SelectTrigger
                  className={`${selectClass} max-w-28 w-fit`}
                >
                  <SelectValue placeholder="Column" />
                </SelectTrigger>
                <SelectContent>
                  {/* @ts-ignore */}
                  {RHSColumns.map((col) => (
                    <SelectItem key={col} value={col}>
                      {col}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}

            {hasRHSCandleLocation && (
              <Select
                value={subSection.rhs_selectedPeriod}
                onValueChange={(v) => {
                  if (v === "prev-n") {
                    updateSubSection(
                      nodeId,
                      subSection.id,
                      "rhs_nValue",
                      "1"
                    );
                  }
                  updateSubSection(
                    nodeId,
                    subSection.id,
                    "rhs_selectedPeriod",
                    v
                  );
                }}
              >
                <SelectTrigger
                  className={`${selectClass} max-w-28 w-fit`}
                >
                  <SelectValue placeholder="Period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current">Current</SelectItem>
                  <SelectItem value="prev">Previous</SelectItem>
                  <SelectItem value="prev-n">Previous (n)</SelectItem>
                </SelectContent>
              </Select>
            )}

            {subSection.rhs_selectedPeriod === "prev-n" && hasRHSCandleLocation && (
              <div className="flex items-center border rounded-lg overflow-hidden">
                <Button
                  onClick={() => {
                    const currentValue = Number(subSection.rhs_nValue) || 1;
                    if (currentValue > 1) {
                      updateSubSection(
                        nodeId,
                        subSection.id,
                        "rhs_nValue",
                        String(currentValue - 1)
                      );
                    }
                  }}
                  disabled={Number(subSection.rhs_nValue) <= 1}
                  size="sm"
                  className="bg-gray-100 hover:bg-gray-200 h-7 dark:bg-slate-800 dark:hover:bg-slate-700 text-gray-600 rounded-r-none dark:text-slate-400"
                >
                  <Minus className="w-3 h-3" />
                </Button>
                <Input
                  type="number"
                  value={subSection.rhs_nValue || 1}
                  onChange={(e) => {
                    const value = Number(e.target.value);
                    if (!isNaN(value) && value >= 1 && value <= 20) {
                      updateSubSection(
                        nodeId,
                        subSection.id,
                        "rhs_nValue",
                        String(value)
                      );
                    }
                  }}
                  readOnly
                  className="!text-center !text-xs h-6 px-0 w-8 ml-2 text-gray-800 dark:text-white border-none focus:ring-0"
                  min={1}
                  max={20}
                />
                <Button
                  size="sm"
                  onClick={() => {
                    const currentValue = Number(subSection.rhs_nValue) || 1;
                    if (currentValue < 20) {
                      updateSubSection(
                        nodeId,
                        subSection.id,
                        "rhs_nValue",
                        String(currentValue + 1)
                      );
                    }
                  }}
                  className="bg-gray-100 hover:bg-gray-200 h-7 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-l-none text-gray-600 dark:text-slate-400"
                  disabled={Number(subSection.rhs_nValue) >= 20}
                >
                  <Plus className="w-3 h-3" />
                </Button>
              </div>
            )}
            {subSection.rhs === "value" &&
              getRHSOptions()?.includes("value") && (
                <Input
                  type="text"
                  value={subSection._rhsValue}
                  onChange={(e) =>
                    updateSubSection(
                      nodeId,
                      subSection.id,
                      "_rhsValue",
                      e.target.value
                    )
                  }
                  className="w-24 rounded-l-none text-xs px-2 h-8"
                  placeholder="Value"
                />
              )}
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1">
        {!isLastSubSection &&
          <>
            <div className="absolute inset-x-0 -bottom-14 flex justify-center">
              <AndOrToggle
                value={subSection.addBadge}
                onChange={() => toggleAddBadge(nodeId, subSection.id)}
              />
            </div>
            <div className="absolute top-[40%] right-0">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => removeSubSection(nodeId, subSection.id)}
                className="p-1.5 h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-100/20 dark:hover:bg-red-900/20"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </>
        }
      </div>
    </div>
  );
};

export const AndOrToggle = ({
  value,
  onChange,
  isGroup=false
}: {
  value: "AND" | "OR";
  onChange: () => void;
  isGroup?: boolean;
}) => {
  return (
    <div className="relative flex flex-col items-center">
      <div className={` h-3
      ${!isGroup ? "bg-gray-300 dark:bg-gray-600 w-px" : "bg-blue-500 w-0.5"
        }
      `}
      />

      <div
        onClick={onChange}
        className="flex rounded-md overflow-hidden cursor-pointer border border-gray-300 dark:border-gray-600"
      >
        <div
          className={`px-3 py-1 text-sm font-medium transition-colors ${value === "AND"
            ? "bg-blue-500 text-white"
            : "bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500"
            }`}
        >
          AND
        </div>
        <div
          className={`px-4 py-1 text-sm font-medium transition-colors ${value === "OR"
            ? "bg-blue-500 text-white"
            : "bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500"
            }`}
        >
          OR
        </div>
      </div>

      <div className={`w-px h-3
      ${!isGroup ? "bg-gray-300 dark:bg-gray-600 w-px" : "bg-blue-500 w-0.5"
        }
      `}
      />
    </div>
  );
};

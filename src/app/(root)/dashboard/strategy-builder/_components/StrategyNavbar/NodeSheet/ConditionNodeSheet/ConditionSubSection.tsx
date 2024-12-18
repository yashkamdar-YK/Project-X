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
import { Plus, Trash2 } from "lucide-react";
import { SubSection } from "./types";
import { DataPoint } from "../../../DashboardSidebar/DatapointDialog/types";
import { ALLOWED_OPERATIONS, DEFAULT_OPTIONS, VALID_DAYS } from "./_const";
import { useIndicatorStore } from "@/lib/store/IndicatorStore";
import { useApplyDataStore } from "@/lib/store/applyDataStore";
import { useDataPointStore } from "@/lib/store/dataPointStore";

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

  //@ts-ignore
  const columns = selectedLHS?.options?.columnsAvailable || [];
  //@ts-ignore
  const hasCandleLocation = selectedLHS?.options?.candleLocation || false;

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

  const selectClass = "text-xs py-1 px-2 h-8";
  const buttonClass = "text-xs px-2 h-7";

  return (
    <div className="mb-4 pb-4 border-b border-gray-700 last:border-b-0 last:mb-0 last:pb-0">
      <div className="flex items-center gap-2">
      <div className="flex flex-1 items-center  gap-2 justify-between">
        <div className=" flex items-center">
          <div className="flex -space-x-px">
            <Select
              value={subSection.lhs}
              onValueChange={(v) =>
                updateSubSection(nodeId, subSection.id, "lhs", v)
              }
            >
              <SelectTrigger
                className={`${selectClass} max-w-32 w-fit border-r-0 ${
                  !columns.length && !hasCandleLocation
                    ? "rounded-r-md"
                    : "rounded-r-none"
                }`}
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
                  className={`${selectClass} max-w-28 w-fit rounded-none border-x-0 ${
                    !hasCandleLocation ? "rounded-r-md" : ""
                  }`}
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
                onValueChange={(v) =>
                  updateSubSection(nodeId, subSection.id, "selectedPeriod", v)
                }
              >
                <SelectTrigger
                  className={`${selectClass} max-w-28 w-fit border-x-0 ${
                    subSection.selectedPeriod !== "prev-n"
                      ? "rounded-r-md"
                      : "rounded-none"
                  }`}
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

            {subSection.selectedPeriod === "prev-n" && (
              <Input
                type="number"
                value={subSection.nValue}
                onChange={(e) =>
                  updateSubSection(
                    nodeId,
                    subSection.id,
                    "nValue",
                    e.target.value
                  )
                }
                className="max-w-16 w-fit rounded-l-none text-xs px-2 h-8"
                min="1"
                max="20"
              />
            )}
          </div>
        </div>


        <Select
          value={subSection.operator}
          onValueChange={(v) =>
            updateSubSection(nodeId, subSection.id, "operator", v)
          }
          >
          <SelectTrigger className={`${selectClass} max-w-24 w-fit`}>
            <SelectValue placeholder="Operator" />
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
          <div className="flex -space-x-px">
            <Select
              value={subSection.rhs}
              onValueChange={(v) =>
                updateSubSection(nodeId, subSection.id, "rhs", v)
              }
            >
              <SelectTrigger
                className={`${selectClass} max-w-32 w-fit ${
                  subSection.rhs === "value" ? "rounded-r-none border-r-0" : ""
                }`}
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
          {isLastSubSection ? (
            <Button
              size="sm"
              onClick={() => addSubSection(nodeId)}
              className={`${buttonClass} bg-blue-500 hover:bg-blue-600 text-white`}
            >
              <Plus className="w-3 h-3 mr-1" />
              Add
            </Button>
          ) : (
            <>
              <Button
                size="sm"
                variant="secondary"
                onClick={() => toggleAddBadge(nodeId, subSection.id)}
                className={`${buttonClass} bg-gray-700 hover:bg-gray-600 min-w-[60px]`}
              >
                {subSection.addBadge}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => removeSubSection(nodeId, subSection.id)}
                className={`${buttonClass} text-red-500 hover:text-red-600 hover:bg-red-900/20`}
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

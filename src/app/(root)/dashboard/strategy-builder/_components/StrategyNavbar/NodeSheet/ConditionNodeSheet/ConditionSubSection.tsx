import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2 } from 'lucide-react';
import { SubSection } from "./types";
import { DataPoint } from '../../../DashboardSidebar/DatapointDialog/types';

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
  isLastSubSection,
}) => {
  const lhsOptions = dataPoints.map((dataPoint) => dataPoint.elementName);
  const selectedDatapoint = dataPoints.find((dataPoint) => dataPoint.elementName === subSection.lhs);
  const columns = selectedDatapoint?.options?.columnsAvailable || [];
  const hasCandleLocation = selectedDatapoint?.options?.candleLocation || false;
  const allowedOperations = selectedDatapoint?.options?.allowedOperations || [];
  const canCompareWith = selectedDatapoint?.options?.canComparedwith || [];

  return (
    <div className="mb-6 last:mb-0 pb-6 border-b border-gray-700 last:border-b-0">
      <div className="flex items-center space-x-4 overflow-x-auto">
        <div className="flex-1 flex items-center -space-x-0.5">
          <Select
            value={subSection.lhs}
            onValueChange={(value) => updateSubSection(nodeId, subSection.id, "lhs", value)}
          >
            <SelectTrigger className="w-fit">
              <SelectValue placeholder="Select variable" />
            </SelectTrigger>
            <SelectContent>
              {lhsOptions.map((option) => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {columns.length > 0 && (
            <Select
              value={subSection.column}
              onValueChange={(value) => updateSubSection(nodeId, subSection.id, "column", value)}
            >
              <SelectTrigger className='w-fit'>
                <SelectValue placeholder="Select column" />
              </SelectTrigger>
              <SelectContent>
                {columns.map((option) => (
                  <SelectItem key={option} value={option}>{option}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {hasCandleLocation && (
            <Select
              value={subSection.selectedPeriod}
              onValueChange={(value) => updateSubSection(nodeId, subSection.id, "selectedPeriod", value)}
            >
              <SelectTrigger className="w-fit">
                <SelectValue placeholder="Select period" />
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
              onChange={(e) => updateSubSection(nodeId, subSection.id, "nValue", e.target.value)}
              placeholder="n (1-20)"
              className="w-20"
              min="1"
              max="20"
            />
          )}
        </div>

        <Select
          value={subSection.operator}
          onValueChange={(value) => updateSubSection(nodeId, subSection.id, "operator", value)}
        >
          <SelectTrigger className="w-[150px]">
            <SelectValue placeholder="Select operator" />
          </SelectTrigger>
          <SelectContent>
            {allowedOperations.map((option) => (
              <SelectItem key={option} value={option}>{option}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="flex-1 flex items-center space-x-2">
          <Select
            value={subSection.rhs}
            onValueChange={(value) => updateSubSection(nodeId, subSection.id, "rhs", value)}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select variable" />
            </SelectTrigger>
            <SelectContent>
              {canCompareWith.map((option) => (
                <SelectItem key={option} value={option}>{option}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {subSection.rhs === "values" && (
            <Input
              type="text"
              value={subSection._rhsValue}
              onChange={(e) => updateSubSection(nodeId, subSection.id, "_rhsValue", e.target.value)}
              placeholder="Enter value"
              className="w-[150px]"
            />
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={() => toggleAddBadge(nodeId, subSection.id)}
            className="bg-gray-700 hover:bg-gray-600"
          >
            {subSection.addBadge}
          </Button>
          {!isLastSubSection && (
            <Button
              size="sm"
              variant="ghost"
              onClick={() => removeSubSection(nodeId, subSection.id)}
              className="text-red-500 hover:text-red-600 hover:bg-red-900"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
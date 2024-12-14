import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import { ConditionSubSection } from './ConditionSubSection';
import { SubSection } from './types';
import { DataPoint } from '../../../DashboardSidebar/DatapointDialog/types';

interface ConditionBlockProps {
  block: {
    id: string;
    subSections: SubSection[];
    relation: "AND" | "OR";
  };
  nodeId: string;
  blockId: string;
  dataPoints: DataPoint[];
  addSubSection: (nodeId: string) => void;
  updateSubSection: (
    nodeId: string, 
    subSectionId: number, 
    field: keyof SubSection, 
    value: string
  ) => void;
  removeSubSection: (nodeId: string, subSectionId: number) => void;
  toggleAddBadge: (nodeId: string, subSectionId: number) => void;
}

export const ConditionBlock: React.FC<ConditionBlockProps> = ({
  block,
  nodeId,
  blockId,
  dataPoints,
  addSubSection,
  updateSubSection,
  removeSubSection,
  toggleAddBadge,
}) => {
  return (
    <div className="relative">
      <div className="border border-gray-800 rounded-lg p-6 bg-gray-900">
        {block.subSections.map((subSection, index) => (
          <ConditionSubSection
            key={subSection.id}
            subSection={subSection}
            nodeId={nodeId}
            blockId={blockId}
            dataPoints={dataPoints}
            updateSubSection={updateSubSection}
            toggleAddBadge={toggleAddBadge}
            removeSubSection={removeSubSection}
            isLastSubSection={index === block.subSections.length - 1}
          />
        ))}

        <div className="flex justify-end mt-4">
          <Button
            size="sm"
            onClick={() => addSubSection(nodeId)}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Condition
          </Button>
        </div>
      </div>
    </div>
  );
};
import React from 'react';
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
      <div className="border border-gray-800 rounded-lg p-2 bg-gray-900">
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
            addSubSection={addSubSection}
            isLastSubSection={index === block.subSections.length - 1}
          />
        ))}
      </div>
    </div>
  );
};
import React from "react";
import { ConditionSubSection } from "./ConditionSubSection";
import { ConditionNode, SubSection } from "./types";
import { DataPoint } from "../../../DashboardSidebar/DatapointDialog/types";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

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
    value: string | number
  ) => void;
  removeSubSection: (nodeId: string, subSectionId: number) => void;
  toggleAddBadge: (nodeId: string, subSectionId: number) => void;
  currentNode: ConditionNode;
  removeBlock: (id: string, _id: string) => void;
  moveBlock: (nodeId: string, blockId: string, direction: 'up' | 'down') => void;
  copyBlock: (nodeId: string, blockId: string) => void;
  moveSubSection: (nodeId: string, blockId: string, subSectionId: number, direction: 'up' | 'down') => void;
  copySubSection: (nodeId: string, blockId: string, subSectionId: number) => void;
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
  copyBlock, copySubSection, currentNode, moveBlock, moveSubSection
}) => {
  return (
    <div>
      <div className="grid gap-y-6 py-4">
        {block?.subSections.map((subSection, index) => (
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
            isLastSubSection={index === block?.subSections.length - 1}
            moveSubSection={moveSubSection}
            copySubSection={copySubSection}
            index={index}
          />
        ))}
      </div>
      <div className="flex -mt-4 justify-center">
        <Button
          size="sm"
          onClick={() => addSubSection(nodeId)}
          variant="secondary"
          className="w-fit mx-auto"
        >
          <Plus className="w-3 h-3 mr-1" />
          Add
        </Button>
      </div>
    </div>
  );
};

export default ConditionBlock;

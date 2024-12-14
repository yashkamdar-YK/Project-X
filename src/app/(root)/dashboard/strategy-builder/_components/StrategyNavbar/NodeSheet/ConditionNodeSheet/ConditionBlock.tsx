import React from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from 'lucide-react';
import { ConditionSubSection } from './ConditionSubSection';
import { BlockRelationButton } from './BlockRelationButton';
import { DataPoint,ConditionBlock as TConditionBlock, SubSection } from './types';

interface ConditionBlockProps {
  block: TConditionBlock;
  blockIndex: number;
  totalBlocks: number;
  dataPoints: DataPoint[];
  addSubSection: (blockId: number) => void;
  updateSubSection: (blockId: number, subSectionId: number, field: keyof SubSection, value: string) => void;
  removeSubSection: (blockId: number, subSectionId: number) => void;
  toggleAddBadge: (blockId: number, subSectionId: number) => void;
  toggleBlockRelation: (blockId: number) => void;
  getBlockRelation: (blockId: number) => "AND" | "OR" | undefined;
  addConditionBlock: () => void;
}

export const ConditionBlock: React.FC<ConditionBlockProps> = ({
  block,
  blockIndex,
  totalBlocks,
  dataPoints,
  addSubSection,
  updateSubSection,
  removeSubSection,
  toggleAddBadge,
  toggleBlockRelation,
  getBlockRelation,
  addConditionBlock
}) => {
  return (
    <div className="relative">
      <div className="border border-gray-800 rounded-lg p-6 -mb-6 bg-gray-900">
        {block.subSections.map((subSection, index) => (
          <ConditionSubSection
            key={subSection.id}
            subSection={subSection}
            blockId={block.id}
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
            onClick={() => addSubSection(block.id)}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            <Plus className="w-4 h-4 mr-1" />
            Add Condition
          </Button>
        </div>
      </div>
      
      {blockIndex < totalBlocks - 1 && (
        <BlockRelationButton
          relation={getBlockRelation(block.id) || "AND"}
          onClick={() => toggleBlockRelation(block.id)}
        />
      )}
      
      {blockIndex === totalBlocks - 1 && (
        <Button
          size="sm"
          onClick={addConditionBlock}
          className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 bg-blue-500 hover:bg-blue-600 text-white rounded-full px-4"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add Block
        </Button>
      )}
    </div>
  );
};


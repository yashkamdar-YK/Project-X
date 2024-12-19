import React from "react";
import { ConditionSubSection } from "./ConditionSubSection";
import { ConditionNode, SubSection } from "./types";
import { DataPoint } from "../../../DashboardSidebar/DatapointDialog/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ChevronDown, Trash, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";

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
  currentNode: ConditionNode;
  removeBlock: (id: string, _id: string) => void;
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
  currentNode,
  removeBlock,
}) => {
  return (
    <div className="relative border dark:border-gray-800 rounded-lg px-4">
      <Accordion type="single" collapsible>
        <AccordionItem value={blockId} className="border-b-0">
          <AccordionTrigger className="flex justify-between items-center">
            <span>Group <span className="text-xs" >({blockId})</span></span>
            <div className="flex gap-2 items-center">
              {currentNode.blocks.length > 1 && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-red-400 hover:text-red-300 hover:bg-red-900/20"
                  onClick={() => removeBlock(nodeId, block.id)}
                >
                  <Trash2 size={14} />
                </Button>
              )}
              <ChevronDown size={18} />
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid gap-y-6">
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
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

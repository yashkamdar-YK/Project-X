import React from "react";
import { ConditionSubSection } from "./ConditionSubSection";
import { SubSection } from "./types";
import { DataPoint } from "../../../DashboardSidebar/DatapointDialog/types";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ChevronDown } from "lucide-react";

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
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger>
          Group
          <ChevronDown className="w-4 h-4 text-gray-400 dark:text-gray-500 group-data-[state=open]:rotate-180 transition-transform duration-200" />
        </AccordionTrigger>
        <AccordionContent>
        <div className=" relative">
          <div className="border dark:border-gray-800 rounded-lg p-2 px-10 dark:bg-gray-900 ">
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
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

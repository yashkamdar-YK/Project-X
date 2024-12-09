import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { LayoutPanelTop } from "lucide-react";
import { useNodeStore } from "@/lib/store/nodeStore";
import { STRATEGY_TEMPLATES } from "../../constants/menu";
import { NodeTypes } from "../../_utils/nodeTypes";
import { Edge } from "@xyflow/react";

type TemplateKey = keyof typeof STRATEGY_TEMPLATES;

interface TemplateCardProps {
  name: string;
  description: string;
  onSelect: () => void;
}

const TemplateCard: React.FC<TemplateCardProps> = ({
  name,
  description,
  onSelect,
}) => (
  <div
    onClick={onSelect}
    className="p-4 border rounded-lg hover:border-blue-500 cursor-pointer transition-all duration-200 bg-white dark:bg-gray-800"
  >
    <h3 className="text-lg font-semibold mb-2 text-gray-900 dark:text-gray-100">
      {name}
    </h3>
    <p className="text-sm text-gray-500 dark:text-gray-400">{description}</p>
  </div>
);

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  templateName: string;
}

const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  templateName,
}) => (
  <Dialog open={isOpen} onOpenChange={onClose}>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Apply Template</DialogTitle>
        <DialogDescription>
          Are you sure you want to apply the {templateName} template? This will
          replace your current canvas.
        </DialogDescription>
      </DialogHeader>
      <DialogFooter>
        {/* <div className="flex flex-col space-y-3"> */}
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onConfirm}>Apply Template</Button>
        {/* </div> */}
      </DialogFooter>
    </DialogContent>
  </Dialog>
);

export const TemplateSelector = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [selectedTemplate, setSelectedTemplate] =
    React.useState<TemplateKey | null>(null);
  const { setNodes, setEdges } = useNodeStore();
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const handleTemplateSelect = (templateKey: TemplateKey) => {
    setSelectedTemplate(templateKey);
    setIsOpen(true);
  };

  const handleConfirm = () => {
    if (selectedTemplate) {
      const template = STRATEGY_TEMPLATES[selectedTemplate];
      setNodes(template.nodes);
      setEdges(template.edges);
      setIsOpen(false);
      setDialogOpen(false);
    }
  };

  return (
    <>
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" className="dark:bg-gray-900">
            <LayoutPanelTop size={14} className="mr-2" />
            Templates
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Strategy Templates</DialogTitle>
            <DialogDescription>
              Choose a template to quickly get started with your strategy
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {(
              Object.entries(STRATEGY_TEMPLATES) as [
                TemplateKey,
                (typeof STRATEGY_TEMPLATES)[TemplateKey]
              ][]
            ).map(([key, template]) => (
              <TemplateCard
                key={key}
                name={template.name}
                description={template.description}
                onSelect={() => handleTemplateSelect(key)}
              />
            ))}
          </div>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onConfirm={handleConfirm}
        templateName={
          selectedTemplate ? STRATEGY_TEMPLATES[selectedTemplate].name : ""
        }
      />
    </>
  );
};

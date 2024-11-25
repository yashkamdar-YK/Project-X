import React from "react";
import { Node } from "@xyflow/react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

// Define the type for node data
type NodeData = {
  label: string;
};

// Define the custom node type
type CustomNode = Node<NodeData>;

// Define props interface for NodeSheet
interface NodeSheetProps {
  isOpen: boolean;
  onClose: () => void;
  node: CustomNode | null;
}

const NodeSheet: React.FC<NodeSheetProps> = ({ isOpen, onClose, node }) => {
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>{node ? `Node ${node.data.label}` : 'Node Details'}</SheetTitle>
        </SheetHeader>
        {node && (
          <div className="mt-4">
            <p className="text-sm text-gray-500">Node ID: {node.id}</p>
            <p className="text-sm text-gray-500">
              Position: ({node.position.x}, {node.position.y})
            </p>
            <p className="text-sm text-gray-500">Label: {node.data.label}</p>
            {/* Add more node details as needed */}
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default NodeSheet;
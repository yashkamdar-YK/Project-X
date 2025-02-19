"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useActionStore } from "@/lib/store/actionStore";
import { useState } from "react";
import { useNodeStore } from "@/lib/store/nodeStore";
import { handleAddNode, NodeTypes } from "../../_utils/nodeTypes";

interface ActionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ActionDialog({ open, onOpenChange }: ActionDialogProps) {
  const { nodes, edges, setEdges, setNodes } = useNodeStore();
  
  const handleAction = () => {
    //@ts-ignore
    const { newEdges, newNode } = handleAddNode(nodes, edges, {
      type: NodeTypes.ACTION,
    });
    setNodes([...nodes, newNode]);
    setEdges(newEdges);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-w-[350px]">
        <DialogHeader>
          <DialogTitle className="text-xl">Create Action</DialogTitle>
        </DialogHeader>

        <div className="grid sm:grid-cols-2 gap-4 p-4 grid-cols-1">
          <Button
            variant="outline"
            size="lg"
            className="sm:h-48 h-28 border-2 border-dashed flex flex-col items-center justify-center hover:border-primary"
            onClick={handleAction}
          >
            <span className="text-base">Blank Action</span>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="sm:h-48 h-28 flex flex-col items-center justify-center"
            disabled
          >
            <span className="text-base">Select From Templates</span>
            <span className="text-sm text-muted-foreground pt-2">
              Coming Soon
            </span>
          </Button>
        </div>
        <div className="flex justify-end mr-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            DONE
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
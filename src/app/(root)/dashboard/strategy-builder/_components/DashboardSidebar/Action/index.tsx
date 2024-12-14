"use client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ActionDialogProps, ActionNode } from "./type";
import { useActionStore } from "@/lib/store/actionStore";
import { useState } from "react";

export default function ActionDialog({ open, onOpenChange, editingActionNode}: ActionDialogProps) {
  const handleAction = () => {
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl text-center">Create Action</DialogTitle>
        </DialogHeader>
       
        <div className="grid grid-cols-2 gap-4 px-4 pt-2">
          <Button
            variant="outline"
            size="lg"
            className="h-44 border-2 border-dashed flex flex-col items-center justify-center hover:border-primary"
            onClick={handleAction}
          >
            <span className="text-base">Blank Action</span>
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="h-44 flex flex-col items-center justify-center"
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

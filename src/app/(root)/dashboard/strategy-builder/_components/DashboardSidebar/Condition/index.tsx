"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AddConditionDialogProps } from "./type";

export default function ConditionDialog({
  open,
  onOpenChange,
}: AddConditionDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl text-center">
            Add Condition
          </DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-[2fr,3fr] gap-4 px-4">
          <div className="space-y-4">
            <Button
              variant="outline"
              size="lg"
              className="w-64 h-16 border-2 border-dashed flex flex-col items-center justify-center hover:border-primary"
              onClick={() => {
                // Handle entry condition click
                onOpenChange(false);
              }}
            >
              <span className="text-sm">Entry Condition</span>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-64 h-16 border-2 border-dashed flex flex-col items-center justify-center hover:border-primary"
              onClick={() => {
                // Handle exit condition click
                onOpenChange(false);
              }}
            >
              <span className="text-sm">Exit Condition</span>
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="w-64 h-16 border-2 border-dashed flex flex-col items-center justify-center"
              disabled
            >
              <span className="text-sm">Adjustments</span>
              <span className="text-xs text-muted-foreground absolute mt-10">Coming Soon</span>
            </Button>
          </div>
          <Button
            variant="outline"
            size="lg"
            className="h-full w-64 flex flex-col items-center justify-center"
            disabled
          >
            <span className="text-lg">Select From Templates</span>

            <span className="text-sm absolute text-muted-foreground mt-44">
              Coming Soon
            </span>
          </Button>
        </div>

        {/* Done */}
        <div className="flex justify-end mr-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            DONE
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ChevronDown, Pencil, Copy, Trash2 } from "lucide-react";
import Link from "next/link";

interface StrategyActionsProps {
  onEdit: () => void;
  onDelete: () => void;
  name: string;
}

export const DeleteConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  strategyName,
}: {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  strategyName: string;
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Strategy</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{strategyName}"? This action cannot
            be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="flex gap-2 justify-end mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onConfirm} variant="destructive">
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export const StrategyActions: React.FC<StrategyActionsProps> = ({
  onEdit,
  onDelete,
  name,
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="secondary"
            size="icon"
            className="rounded-l-none border-l border-gray-200 dark:border-gray-800"
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem
            onClick={onEdit}
            className="flex items-center cursor-pointer"
          >
            <Pencil className="mr-2 h-4 w-4" />
            <span>Edit</span>
          </DropdownMenuItem>
          <Link
            href={`/dashboard/strategy-builder?copy=${name}`}
            target="_blank"
          >
            <DropdownMenuItem className="flex items-center cursor-pointer">
              <Copy className="mr-2 h-4 w-4" />
              <span>Make a copy</span>
            </DropdownMenuItem>
          </Link>
          <DropdownMenuItem
            onClick={() => setIsDeleteDialogOpen(true)}
            className="flex items-center cursor-pointer text-red-600 focus:text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            <span>Delete</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={() => {
          onDelete();
          setIsDeleteDialogOpen(false);
        }}
        strategyName={name}
      />
    </>
  );
};

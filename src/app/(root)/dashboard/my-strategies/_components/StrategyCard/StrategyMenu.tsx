import { useState } from 'react';
import { Pencil, Trash2, CircleStop, MoreVertical, Settings } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TStrategy } from "../../types";
import { myStrategyService } from '../../_actions';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';

const StrategyMenu = ({ 
  strategy, 
  onEditInfo, 
  onDelete, 
  isScheduled, 
  isSettingsOpen, 
  setIsSettingsOpen 
}: {
  strategy: TStrategy;
  onEditInfo: () => void;
  onDelete: (name: string) => void;
  isScheduled: boolean;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (isOpen: boolean) => void;
}) => {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeactivateDialogOpen, setIsDeactivateDialogOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const queryClient = useQueryClient();

  const deactivateMutation = useMutation({
    mutationFn: ({ strategyName }: { strategyName: string; }) => 
      myStrategyService.deactivateStrategy(strategyName, true),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allStrategies"] });
      toast({ title: "Strategy stopped successfully" })
      setIsDeactivateDialogOpen(false);
    },
    onError: () => {
      toast({ title: "Failed to stop strategy", variant: "destructive" });
    },
  })

  const handleDelete = async () => {
    try {
      await onDelete(strategy.strategyName);
    } finally {
      setIsDeleteDialogOpen(false);
      setIsDropdownOpen(false);
    }
  };

  const handleDeactivate = () => {
    deactivateMutation.mutate({ strategyName: strategy.strategyName });
    setIsDeactivateDialogOpen(false);
    setIsDropdownOpen(false);
  };

  return (
    <>
      <DropdownMenu open={isDropdownOpen} onOpenChange={setIsDropdownOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {isScheduled && (
            <DropdownMenuItem 
              onSelect={(e) => {
                e.preventDefault();
                setIsDeactivateDialogOpen(true);
              }}
            >
              <CircleStop className="h-4 w-4 mr-2" />
              Deactivate
            </DropdownMenuItem>
          )}
          
          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              setIsDeleteDialogOpen(true);
            }}
            className="text-red-600"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </DropdownMenuItem>

          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              onEditInfo();
              setIsDropdownOpen(false);
            }}
          >
            <Pencil className="h-4 w-4 mr-2" />
            Edit Strategy Info
          </DropdownMenuItem>

          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              setIsSettingsOpen(true);
              setIsDropdownOpen(false);
            }}
          >
            <Settings className="h-4 w-4" />
            <span className="ml-2">Settings</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Deactivate Dialog */}
      {isScheduled && (
        <Dialog open={isDeactivateDialogOpen} onOpenChange={setIsDeactivateDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Deactivate Strategy</DialogTitle>
              <DialogDescription>
                Are you sure you want to deactivate this strategy?
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="gap-2 sm:gap-0">
              <Button
                variant="outline"
                onClick={() => setIsDeactivateDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeactivate}
                variant="destructive"
              >
                Deactivate
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This action will permanently delete the strategy "{strategy.strategyName}". This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              variant="destructive"
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default StrategyMenu;
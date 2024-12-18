import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Spinner from "@/components/shared/spinner";
import { validateName } from "@/lib/utils";

interface SaveStrategyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (strategyName: string) => Promise<void>;
  defaultName?: string;
}

const SaveStrategyDialog = ({ isOpen, onClose, onConfirm, defaultName = '' }: SaveStrategyDialogProps) => {
  const [isSaving, setIsSaving] = React.useState(false);
  const [strategyName, setStrategyName] = React.useState(defaultName);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      setStrategyName(defaultName);
      setError(null);
    }
  }, [isOpen, defaultName]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const validatedName = validateName(e.target.value);
    setStrategyName(validatedName);
    setError(null);
  };

  const handleSave = async () => {
    if (!strategyName.trim()) {
      setError('Strategy name is required');
      return;
    }

    try {
      setIsSaving(true);
      await onConfirm(strategyName.trim());
      onClose();
    } catch (error) {
      console.error('Failed to save strategy:', error);
      setError('Failed to save strategy. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Save Strategy</DialogTitle>
          <DialogDescription>
            Enter a name for your strategy and click save to continue.
          </DialogDescription>
        </DialogHeader>
        
        <div className="mt-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="strategy-name">Strategy Name</Label>
            <Input
              id="strategy-name"
              value={strategyName}
              onChange={handleNameChange}
              placeholder="Enter strategy name"
              className={error ? 'border-red-500' : ''}
              disabled={isSaving}
              autoFocus
            />
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
          </div>
        </div>

        <DialogFooter className="flex w-full sm:space-x-2 justify-end mt-6">
          <Button 
            variant="outline" 
            onClick={onClose} 
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSave} 
            disabled={isSaving || !strategyName.trim()}
          >
            {isSaving ? <Spinner size="16" className="mr-2" /> : null}
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SaveStrategyDialog;
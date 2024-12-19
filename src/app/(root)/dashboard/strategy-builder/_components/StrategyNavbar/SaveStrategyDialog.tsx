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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import Spinner from "@/components/shared/spinner";
import { validateName } from "@/lib/utils";

interface SaveStrategyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: { 
    name: string; 
    description: string; 
    isPublic: boolean; 
  }) => Promise<void>;
  defaultName?: string;
}

const SaveStrategyDialog = ({ isOpen, onClose, onConfirm, defaultName = '' }: SaveStrategyDialogProps) => {
  const [isSaving, setIsSaving] = React.useState(false);
  const [strategyName, setStrategyName] = React.useState(defaultName);
  const [description, setDescription] = React.useState('');
  const [isPublic, setIsPublic] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (isOpen) {
      setStrategyName(defaultName);
      setDescription('');
      setIsPublic(false);
      setError(null);
    }
  }, [isOpen, defaultName]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const validatedName = validateName(e.target.value);
    setStrategyName(validatedName);
    setError(null);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(e.target.value);
    setError(null);
  };

  const handleSave = async () => {
    if (!strategyName.trim()) {
      setError('Strategy name is required');
      return;
    }

    try {
      setIsSaving(true);
      await onConfirm({
        name: strategyName.trim(),
        description: description.trim(),
        isPublic,
      });
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
            Enter the details for your strategy and click save to continue.
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
          </div>

          <div className="space-y-2">
            <Label htmlFor="strategy-description">Description</Label>
            <Textarea
              id="strategy-description"
              value={description}
              onChange={handleDescriptionChange}
              placeholder="Enter strategy description"
              className="resize-none"
              disabled={isSaving}
              rows={3}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="strategy-visibility" className="cursor-pointer">
              Make this strategy public
            </Label>
            <Switch
              id="strategy-visibility"
              checked={isPublic}
              onCheckedChange={setIsPublic}
              disabled={isSaving}
            />
          </div>

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
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
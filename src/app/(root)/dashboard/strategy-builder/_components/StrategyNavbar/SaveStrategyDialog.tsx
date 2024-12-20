import React, { useCallback } from 'react';
import { Globe, IndianRupee, Lock } from 'lucide-react';
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
import { convertToMinutes, validateName } from "@/lib/utils";
import { useMutation } from '@tanstack/react-query';
import { strategyService } from '../../_actions';
import { useDataPointsStore } from '@/lib/store/dataPointsStore';
import { useDataPointStore } from '@/lib/store/dataPointStore';
import { useIndicatorStore } from '@/lib/store/IndicatorStore';
import { useConditionStore } from '@/lib/store/conditionStore';
import { useActionStore } from '@/lib/store/actionStore';
import { transformToActionPayload } from './NodeSheet/ActionNodeSheet/transformToActionPayload';
import { transformDataPointsToPayload } from '../DashboardSidebar/DatapointDialog/transformDataPointsToPayload';
import { transformSettingsToPayload } from './SettingSheet/transformSettingsToPayload';
import { transformIndicatorsToPayload } from '../DashboardSidebar/Indicators/transformIndicatorsToPayload';
import { transformConditionToPayload } from './NodeSheet/ConditionNodeSheet/transformConditionToPayload';
import { useNodeStore } from '@/lib/store/nodeStore';
import { NodeTypes } from '../../_utils/nodeTypes';

interface SaveStrategyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: {
    name: string;
    description: string;
    isPublic: boolean;
    capital: number;
  }) => Promise<void>;
  defaultName?: string;
}

const SaveStrategyDialog = ({ isOpen, onClose, onConfirm, defaultName = '' }: SaveStrategyDialogProps) => {
  const [isSaving, setIsSaving] = React.useState(false);
  const [strategyName, setStrategyName] = React.useState(defaultName);
  const [description, setDescription] = React.useState('');
  const [isPublic, setIsPublic] = React.useState(false);
  const [capital, setCapital] = React.useState<string>('10000');
  const [error, setError] = React.useState<string | null>(null);

  const saveStMutation = useMutation({
    mutationFn: ({ data, saveToSpark }: { data: any; saveToSpark: boolean }) =>
      strategyService.saveSt(data, saveToSpark),
    mutationKey: ['saveSt']
  })

  React.useEffect(() => {
    if (isOpen) {
      setStrategyName(defaultName);
      setDescription('');
      setIsPublic(false);
      setCapital('10000');
      setError(null);
    }
  }, [isOpen, defaultName]);

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const validatedName = validateName(e.target.value);
    setStrategyName(validatedName);
    setError(null);
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newDescription = e.target.value;
    if (newDescription.split(/\s+/).length <= 250) {
      setDescription(newDescription);
      setError(null);
    } else {
      setError('Description should not exceed 250 words');
    }
  };

  const handleCapitalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    setCapital(value);
    setError(null);
  };

  const { dataPoints } = useDataPointsStore();
  const { selectedSymbol, selectedTimeFrame } = useDataPointStore();
  const { indicators } = useIndicatorStore();
  const { conditionBlocks } = useConditionStore();
  const { actionNodes } = useActionStore();
  const { nodes, edges } = useNodeStore();

  const getConditionNodes = useCallback(() => {
    return nodes?.filter((node) => node.type === NodeTypes.CONDITION);
  }, [nodes]);


  const handleSave = async (spark: boolean = false) => {
    if (!strategyName.trim()) {
      setError('Strategy name is required');
      return;
    }

    if (!capital || parseInt(capital) <= 0) {
      setError('Required capital must be a positive number');
      return;
    }

    if (description.split(/\s+/).length > 250) {
      setError('Description should not exceed 250 words');
      return;
    }

    try {
      setIsSaving(true);
      await saveStMutation.mutateAsync({
        data: {
          strategyName: strategyName.trim(),
          settings: transformSettingsToPayload(
            selectedSymbol || "",
            convertToMinutes(selectedTimeFrame || "")
          ),
          data: transformDataPointsToPayload(dataPoints),
          "indicators": transformIndicatorsToPayload(indicators),
          "actions": transformToActionPayload(actionNodes),
          "conditions": transformConditionToPayload(conditionBlocks),
          "conditions_seq": [
            ...getConditionNodes().map((node) => node.id)
          ],
          "conditions_loc": nodes,
          "actions_loc": edges,
          "stratinfo": {
            "description": description.trim(),
            "capitalReq": parseInt(capital),
            "visiblity": isPublic ? "public" : "private"
          }
        },
        saveToSpark: spark
      })
      onClose();
    } catch (error) {
      console.error('Failed to save strategy:', error);
      setError('Failed to save strategy. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const wordCount = description.split(/\s+/).length;

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
              className={error && !strategyName.trim() ? 'border-red-500' : ''}
              disabled={isSaving}
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="required-capital">
              Required Capital
            </Label>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input
                id="required-capital"
                type="text"
                inputMode="numeric"
                value={capital}
                onChange={handleCapitalChange}
                placeholder="Enter required capital"
                className={`pl-9 ${error && (!capital || parseInt(capital) <= 0) ? 'border-red-500' : ''}`}
                disabled={isSaving}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="strategy-description">Description</Label>
            <Textarea
              id="strategy-description"
              value={description}
              onChange={handleDescriptionChange}
              placeholder="Enter strategy description (max 250 words)"
              className={`resize-none ${error && description.split(/\s+/).length > 250 ? 'border-red-500' : ''}`}
              disabled={isSaving}
              rows={3}
            />
            <p className="text-sm text-gray-500">
              {wordCount}/250 words
            </p>
          </div>

          <Button variant='outline' onClick={() => setIsPublic(!isPublic)} disabled={isSaving} className='mt-2' >
            {isPublic ? <Globe /> : <Lock />}
            {isPublic ? 'Public' : 'Private'}
          </Button>

          {error && (
            <p className="text-sm text-red-500">{error}</p>
          )}
        </div>

        <DialogFooter className="flex w-full sm:space-x-2 justify-end mt-6 sm:space-y-0 space-y-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSaving}
            className='sm:mt-0 mt-2'
          >
            Cancel
          </Button>
          <Button
            onClick={() => handleSave(false)}
            disabled={isSaving || !strategyName.trim() || !capital || parseInt(capital) <= 0 || description.split(/\s+/).length > 250}
          >
            {isSaving ? <Spinner size="16" className="mr-2" /> : null}
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
          <Button
            onClick={() => handleSave(true)}
            disabled={isSaving || !strategyName.trim() || !capital || parseInt(capital) <= 0 || description.split(/\s+/).length > 250}
            className="bg-blue-500 hover:bg-blue-600 text-white"
          >
            Save with Spark
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SaveStrategyDialog;


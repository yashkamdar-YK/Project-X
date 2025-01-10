import React, { useCallback } from "react";
import { Globe, IndianRupee, Lock } from "lucide-react";
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
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { strategyService } from "../../_actions";
import { useDataPointsStore } from "@/lib/store/dataPointsStore";
import { useDataPointStore } from "@/lib/store/dataPointStore";
import { useIndicatorStore } from "@/lib/store/IndicatorStore";
import { useConditionStore } from "@/lib/store/conditionStore";
import { useActionStore } from "@/lib/store/actionStore";
import { transformToActionPayload } from "./NodeSheet/ActionNodeSheet/transformToActionPayload";
import { transformDataPointsToPayload } from "../DashboardSidebar/DatapointDialog/transformDataPointsToPayload";
import { transformSettingsToPayload } from "./SettingSheet/transformSettingsToPayload";
import { transformIndicatorsToPayload } from "../DashboardSidebar/Indicators/transformIndicatorsToPayload";
import { transformConditionToPayload } from "./NodeSheet/ConditionNodeSheet/transformConditionToPayload";
import { useNodeStore } from "@/lib/store/nodeStore";
import { NodeTypes } from "../../_utils/nodeTypes";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";
import { TStrategyInfo } from "../../_utils/strategyTypes";
import { markChangesSaved } from "@/lib/store/unsavedChangesStore";
import { getSaveStrategyData } from "../../_utils/utils";

interface SaveStrategyDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: (data: {
    name: string;
    description: string;
    isPublic: boolean;
    capital: number;
  }) => Promise<void>;
  defaultName?: string;
  name?: string | null;
  stratinfo: TStrategyInfo["stratinfo"];
}

const SaveStrategyDialog = ({
  isOpen,
  onClose,
  onConfirm,
  defaultName = "",
  name = null,
  stratinfo,
}: SaveStrategyDialogProps) => {
  const [isSaving, setIsSaving] = React.useState(false);
  const [strategyName, setStrategyName] = React.useState(defaultName);
  const [description, setDescription] = React.useState("");
  const [isPublic, setIsPublic] = React.useState(false);
  const [capital, setCapital] = React.useState<string>("10000");
  const [error, setError] = React.useState<string | null>(null);
  const [saveWithSpark, setSaveWithSpark] = React.useState(true);
  const router = useRouter();
  const queryClient = useQueryClient();


  const saveStMutation = useMutation({
    mutationFn: ({ data}: { data: any }) =>
      strategyService.saveSt(data, saveWithSpark),
    mutationKey: ["saveSt"],
    onError: (error) => {
      toast({
        title: "Failed to save strategy",
        description: error.message,
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        title: "Strategy saved successfully",
        variant: "default",
      });
      markChangesSaved()
      queryClient.invalidateQueries({ queryKey: ["allStrategies"] });
      router.push(`/dashboard/strategy-builder?name=${strategyName}`);
    },
  });
  const updateInfo = useMutation({
    mutationFn: ({
      strategyName,
      data,
      add_to_spark,
    }: {
      strategyName: string;
      data: any;
      add_to_spark: boolean;
    }) => strategyService.updateStrategyInfo(strategyName, data,add_to_spark),
    mutationKey: ["updateInfo", name],
    onError: (error) => {
      toast({
        title: "Failed to update strategy",
        description: error.message,
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        title: "Strategy updated successfully",
        variant: "default",
      });
      queryClient.invalidateQueries({ queryKey: ["allStrategies"] });
      // router.push(`/dashboard/strategy-builder?name=${strategyName}`);
    },
  });

  React.useEffect(() => {
    if (stratinfo && defaultName) {
      setStrategyName(defaultName);
      setDescription(stratinfo?.description || "");
      setIsPublic(stratinfo?.visiblity == 'private' ? false : true)
      //@ts-ignore
      setCapital(stratinfo?.capitalReq?.toString());
      setError(null);
      setSaveWithSpark(true);
    }
  }, [stratinfo && defaultName]);

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    const newDescription = e.target.value;
    if (newDescription.length <= 250) {
      setDescription(newDescription);
      setError(null);
    } else {
      setError("Description should not exceed 250 words");
    }
  };

  const handleCapitalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "");
    setCapital(value);
    setError(null);
  };
  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const validatedName = validateName(e.target.value);
    if (validatedName.length <= 20) {
      setStrategyName(validatedName);
      setError(null);
    } else {
      setError("Strategy name should not exceed 20 characters");
    }
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

  const handleSave = async () => {
    if (!strategyName.trim()) {
      setError("Strategy name is required");
      return;
    }

    if (!capital || parseInt(capital) <= 0) {
      setError("Required capital must be a positive number");
      return;
    }

    if (description.split(/\s+/).length > 250) {
      setError("Description should not exceed 250 words");
      return;
    }

    try {
      setIsSaving(true);
      if (!!name) {
        await updateInfo.mutateAsync({
          data: {
            description: description.trim(),
            capitalReq: parseInt(capital),
            visiblity: isPublic ? "public" : "private",
          },
          strategyName: name,
          add_to_spark: saveWithSpark,
        });
        onClose();
        return;
      }
      await saveStMutation.mutateAsync({
        data: getSaveStrategyData(strategyName, description, capital, isPublic, true),
      });
      onClose();
    } catch (error) {
      console.error("Failed to save strategy:", error);
      setError("Failed to save strategy. Please try again.");
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
              className={
                error && (!strategyName.trim() || strategyName.length > 20)
                  ? "border-red-500"
                  : ""
              }
              disabled={isSaving || !!name}
              autoFocus
              maxLength={20}
            />
            <p className="text-sm text-gray-500">
              {strategyName.length}/20 characters
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="required-capital">Required Capital</Label>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
              <Input
                id="required-capital"
                type="text"
                inputMode="numeric"
                value={capital}
                onChange={handleCapitalChange}
                placeholder="Enter required capital"
                className={`pl-9 ${
                  error && (!capital || parseInt(capital) <= 0)
                    ? "border-red-500"
                    : ""
                }`}
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
              className={`resize-none ${
                error && description.split(/\s+/).length > 250
                  ? "border-red-500"
                  : ""
              }`}
              disabled={isSaving}
              rows={3}
            />
            <p className="text-sm text-gray-500">
              {description?.length}/250 words
            </p>
          </div>

          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={() => setIsPublic(!isPublic)}
              disabled={isSaving}
              className="mt-2"
            >
              {isPublic ? <Globe /> : <Lock />}
              {isPublic ? "Public" : "Private"}
            </Button>

            <div className="flex items-center space-x-2">
              <Switch
                id="save-with-spark"
                checked={saveWithSpark}
                onCheckedChange={setSaveWithSpark}
                disabled={isSaving}
              />
              <Label htmlFor="save-with-spark">Save with Spark</Label>
            </div>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}
        </div>

        <DialogFooter className="flex w-full sm:space-x-2 justify-end mt-6 sm:space-y-0 space-y-2">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSaving}
            className="sm:mt-0 mt-2"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={
              isSaving ||
              !strategyName.trim() ||
              !capital ||
              parseInt(capital) <= 0 ||
              description.split(/\s+/).length > 250
            }
          >
            {isSaving ? <Spinner size="16" className="mr-2" /> : null}
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default SaveStrategyDialog;

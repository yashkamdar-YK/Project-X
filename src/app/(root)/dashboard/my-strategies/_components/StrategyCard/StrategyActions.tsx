import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { TooltipProvider, Tooltip, TooltipTrigger } from "@/components/ui/tooltip";
import { Play, CircleStop } from 'lucide-react';
import { toast } from "@/hooks/use-toast";
import { myStrategyService } from "../../_actions";
import { TStrategy } from "../../types";
import { Alert, AlertDescription } from "@/components/ui/alert";

const StrategyActions = ({ strategy, isDeleting }: { strategy: TStrategy; isDeleting: boolean }) => {
  const [deactivate, setDeactivate] = useState(false);
  const [deploymentOption, setDeploymentOption] = useState<"now" | "next">("now");
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const deactivateMutation = useMutation({
    mutationFn: ({ strategyName, deactivate }: { strategyName: string; deactivate: boolean }) => 
      myStrategyService.deactivateStrategy(strategyName, deactivate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allStrategies"] });
      toast({ title: "Strategy stopped successfully" });
      setOpen(false);
    },
    onError: () => {
      toast({ title: "Failed to stop strategy", variant: "destructive" });
    },
  });

  const activateMutation = useMutation({
    mutationFn: ({ strategyName, runLive }: { strategyName: string; runLive: boolean }) => 
      myStrategyService.activateStrategy(strategyName, runLive),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["allStrategies"] });
      toast({ title: "Strategy deployed successfully" });
      setOpen(false);
    },
    onError: () => {
      toast({ title: "Failed to deploy strategy", variant: "destructive" });
    },
  });

  const handleDeploy = async () => {
    if (strategy.status === "active") {
      deactivateMutation.mutate({ strategyName: strategy.strategyName, deactivate });
    } else if (strategy.status === "inactive" || strategy.status === "scheduled") {
      activateMutation.mutate({ strategyName: strategy.strategyName, runLive: deploymentOption === "now" });
    }
  };

  const isLoading = deactivateMutation.isPending || activateMutation.isPending;

  const getDeployButtonLabel = () => {
    switch (strategy.status) {
      case "scheduled": return "Deploy Now";
      case "active": return "Stop";
      case "inactive":
      default: return "Deploy";
    }
  };

  const getDialogContent = () => {
    if (strategy.status === "active") {
      return (
        <div className="space-y-4">
          <DialogDescription>
            Are you sure you want to stop this strategy?
          </DialogDescription>
          <div className="flex items-center space-x-2">
            <Switch
              checked={deactivate}
              onCheckedChange={setDeactivate}
              disabled={isLoading}
            />
            <Label htmlFor="prevent-auto-start">
              Prevent auto-start in next trading session
            </Label>
          </div>
          <Alert variant="default">
            <AlertDescription>
              Stopping the strategy manually will not allow the system to store position details.
            </AlertDescription>
          </Alert>
        </div>
      );
    }

    if (strategy.status === "inactive") {
      return (
        <div className="space-y-6">
          <DialogDescription>
            When would you like to deploy this strategy?
          </DialogDescription>
          <RadioGroup
            value={deploymentOption}
            onValueChange={(value) => setDeploymentOption(value as "now" | "next")}
          >
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="now" id="deploy-now" />
              <Label htmlFor="deploy-now">Deploy Now</Label>
            </div>
            <div className="flex items-center space-x-2">
              <RadioGroupItem value="next" id="deploy-next" />
              <Label htmlFor="deploy-next">Deploy Next Trading Session</Label>
            </div>
          </RadioGroup>
        </div>
      );
    }

    if(strategy.status === "scheduled") {
      return (
        <div className="space-y-4">
          <DialogDescription>
            Are you sure you want to deploy this strategy now?
          </DialogDescription>
        </div>
      );
    }

    return <div className="space-y-4"></div>;
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div>
            <Dialog open={open} onOpenChange={setOpen}>
              <DialogTrigger asChild>
                <Button
                  size="sm"
                  disabled={isDeleting || isLoading}
                  variant={strategy.status === "active" ? "destructive" : "default"}
                >
                  {isLoading ? (
                    <>
                      <span className="animate-spin h-4 w-4 mr-1 border-2 border-gray-500 border-t-transparent rounded-full" />
                      {strategy.status === "active" ? "Stopping..." : "Deploying..."}
                    </>
                  ) : (
                    <>
                      {strategy.status === "active" ? (
                        <CircleStop className="h-4 w-4 mr-1" />
                      ) : (
                        <Play className="h-4 w-4 mr-1" />
                      )}
                      {getDeployButtonLabel()}
                    </>
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>
                    {strategy.status === "active" ? "Stop Strategy" : "Deploy Strategy"}
                  </DialogTitle>
                  {getDialogContent()}
                </DialogHeader>
                <DialogFooter className="gap-2 sm:gap-0">
                  <Button
                    variant="outline"
                    onClick={() => setOpen(false)}
                    disabled={isLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleDeploy}
                    variant={strategy.status === "active" ? "destructive" : "default"}
                    disabled={isLoading}
                  >
                    {strategy.status === "active" ? "Stop" : "Deploy"}
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </TooltipTrigger>
      </Tooltip>
    </TooltipProvider>
  );
};

export default StrategyActions;
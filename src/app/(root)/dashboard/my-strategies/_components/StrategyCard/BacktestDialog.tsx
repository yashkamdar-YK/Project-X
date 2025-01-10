import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FlaskConical, Calendar } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { backtestService } from "../../../backtests/_actions";
import { toast } from "@/hooks/use-toast";
import { subMonths, format } from "date-fns";

interface BacktestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (startDate: string, endDate: string) => void;
  isLoading?: boolean;
  underlying: string;
}

const BacktestDialog = ({
  open,
  onOpenChange,
  onSubmit,
  isLoading = false,
  underlying
}: BacktestDialogProps) => {
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const router = useRouter();

  const { data: durationLimits, isLoading: isLoadingLimits } = useQuery({
    queryKey: ['backtest-duration-limit', underlying],
    queryFn: () => backtestService.getBackTestDurationLimit(underlying),
    enabled: !!underlying && open,
  });

  useEffect(() => {
    if (durationLimits) {
      const endDateObj = new Date(durationLimits.endDate);
      const startDateObj = subMonths(endDateObj, 2);

      const minDateObj = new Date(durationLimits.startDate);
      const finalStartDate = startDateObj < minDateObj ? minDateObj : startDateObj;

      setStartDate(format(finalStartDate, 'yyyy-MM-dd'));
      setEndDate(format(endDateObj, 'yyyy-MM-dd'));
    }
  }, [durationLimits]);

  const validateDates = () => {
    if (!durationLimits) {
      toast({
        variant: "destructive",
        title: "Validation Error",
        description: "Duration limits are not available. Please try again.",
      });
      return false;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);
    const minDate = new Date(durationLimits.startDate);
    const maxDate = new Date(durationLimits.endDate);

    if (start < minDate || start > maxDate) {
      toast({
        variant: "destructive",
        title: "Invalid Start Date",
        description: `Start date must be between ${durationLimits.startDate} and ${durationLimits.endDate}`,
      });
      return false;
    }

    if (end < start || end > maxDate) {
      toast({
        variant: "destructive",
        title: "Invalid End Date",
        description: end < start 
          ? "End date cannot be before start date"
          : `End date must be before ${durationLimits.endDate}`,
      });
      return false;
    }

    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateDates()) {
      return;
    }

    onSubmit(startDate, endDate);
  };

  const handleGoToBacktesting = () => {
    onOpenChange(false);
    router.push("/dashboard/backtests");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>Configure Backtest</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4 w-fit mb-6">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="start-date" className="text-right">
                Start Date
              </Label>
              <div className="col-span-3 relative">
                <Input
                  id="start-date"
                  type="date"
                  className="pr-10" // Add padding for the calendar icon
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  required
                  min={durationLimits?.startDate}
                  max={durationLimits?.endDate}
                  disabled={isLoadingLimits}
                />
                <Button 
                  type="button"
                  variant="ghost" 
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-muted"
                  onClick={() => {
                    const input = document.getElementById('start-date');
                    if (input) {
                      //@ts-ignore
                      input.showPicker();
                    }
                  }}
                >
                  <Calendar className="h-4 w-4 text-primary" />
                </Button>
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="end-date" className="text-right">
                End Date
              </Label>
              <div className="col-span-3 relative">
                <Input
                  id="end-date"
                  type="date"
                  className="pr-10" 
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  required
                  min={startDate}
                  max={durationLimits?.endDate}
                  disabled={isLoadingLimits}
                />
                <Button 
                  type="button"
                  variant="ghost" 
                  size="icon"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-muted"
                  onClick={() => {
                    const input = document.getElementById('end-date');
                    if (input) {
                      //@ts-ignore
                      input.showPicker();
                    }
                  }}
                >
                  <Calendar className="h-4 w-4 text-primary" />
                </Button>
              </div>
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-2 sm:justify-between">
            <Button
              type="button"
              variant="outline"
              onClick={handleGoToBacktesting}
            >
              Go To Backtesting
            </Button>
            <div className="flex gap-3 flex-col sm:flex-row">
              <Button
                type="button"
                variant="secondary"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading || isLoadingLimits}>
                <FlaskConical className="h-4 w-4 mr-1" />
                {isLoading ? (
                  <>
                    <span className="animate-spin h-4 w-4 mr-2 border-2 border-b-transparent rounded-full" />
                    Starting Backtest...
                  </>
                ) : (
                  'Start Backtest'
                )}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BacktestDialog;
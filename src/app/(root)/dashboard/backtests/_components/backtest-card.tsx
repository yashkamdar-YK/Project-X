import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
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
import { Calendar, CalendarClock, Globe, Lock, MoreVertical, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { TBacktest } from "../type";
import Link from "next/link";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";
import { backtestService } from "../_actions";
import { useQueryClient } from "@tanstack/react-query";

interface BacktestCardProps {
  backtest: TBacktest;
}

export function BacktestCard({ backtest }: BacktestCardProps) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await backtestService.deleteBacktest(backtest.strategyName, backtest.runid);
      toast({
        title: "Success",
        description: "Backtest deleted successfully",
      });
      queryClient.invalidateQueries({
        queryKey: ["backtests"],
        exact: true,
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete backtest",
      });
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<
      string,
      {
        variant: "default" | "secondary" | "destructive";
        label: string;
        className: string;
      }
    > = {
      running: {
        variant: "secondary",
        label: "Running",
        className: "animate-pulse",
      },
      completed: { variant: "default", label: "Completed", className: "" },
      failed: { variant: "destructive", label: "Failed", className: "" },
    };

    const { variant, label, className } = variants[status] || {
      variant: "secondary",
      label: status,
      className: "",
    };
    return (
      <Badge variant={variant} className={`flex items-center ${className}`}>
        {label}
        {status === "running" && (
          <span className="ml-1 inline-flex">
            <span className="animate-ping">.</span>
            <span className="animate-ping delay-100">.</span>
            <span className="animate-ping delay-200">.</span>
          </span>
        )}
      </Badge>
    );
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "yyyy-MM-dd");
    } catch {
      return dateString;
    }
  };

  const formatMetricValue = (value: number | string) => {
    if (typeof value === "number") {
      return value.toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    }
    return value;
  };

  const getMetricColor = (label: string, value: number | string) => {
    if (typeof value !== "number") return "";

    switch (label) {
      case "Max DrawDown":
      case "Total Profit":
      case "Return to max DD":
        return value > 0 ? "text-green-500" : "text-red-500";
      default:
        return "";
    }
  };

  const metrics = backtest?.results
    ? [
        {
          label: "Total Trades",
          value: backtest?.results?.totalTrades?.toFixed(0) || "-",
        },
        {
          label: "Total Profit",
          value: backtest?.results?.totalreturns || "-",
        },
        { label: "Max DrawDown", value: backtest?.results?.drawdown || "-" },
        { label: "Return to max DD", value: backtest?.results?.rmdd || "-" },
      ]
    : [];

  return (
    <>
      <Card className="w-full">
        <CardHeader className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-semibold">{backtest.strategyName}</span>
              {backtest.visiblity === "private" ? (
                <Lock className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Globe className="h-4 w-4 text-muted-foreground" />
              )}
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge(backtest.status)}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    className="text-destructive focus:bg-destructive focus:text-destructive-foreground"
                    onClick={() => setIsDeleteDialogOpen(true)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className="flex gap-2">
            <Badge variant="outline">{backtest.info.underlying}</Badge>
            <Badge variant="outline">{backtest.info.productType}</Badge>
            <Badge variant="outline">{backtest.info.strategyType}</Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1 text-sm">
            <div className="text-muted-foreground flex items-center gap-x-1">
              <CalendarClock size={16} />
              <span>Duration :</span>
              <span>
                {formatDate(backtest.startDate)} TO {formatDate(backtest.endDate)}
              </span>
            </div>
            <div className="text-muted-foreground flex items-center gap-x-1">
              <Calendar size={16} />
              <span>Created :</span>
              <span>{formatDate(backtest.createdon)}</span>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4 rounded-lg bg-muted p-4">
            {metrics.map((metric, index) => (
              <div key={index} className="space-y-1">
                <p className="text-sm text-muted-foreground">{metric.label}</p>
                <p
                  className={`font-medium ${getMetricColor(
                    metric.label,
                    metric.value
                  )}`}
                >
                  {formatMetricValue(metric.value)}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
        <CardFooter>
          <Link
            className="w-full"
            href={
              backtest.status !== "completed"
                ? "#"
                : `/dashboard/backtests/${backtest.strategyName}/${backtest.runid}`
            }
          >
            <Button
              className="w-full"
              disabled={backtest.status !== "completed"}
              variant={backtest.status === "completed" ? "default" : "secondary"}
            >
              View Results
            </Button>
          </Link>
        </CardFooter>
      </Card>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Backtest</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this backtest? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="outline"
              disabled={isDeleting}
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDelete}
              disabled={isDeleting}
              variant="destructive"
            >
              {isDeleting ? (
                <>
                  <span className="animate-spin h-4 w-4 mr-2 border-2 border-b-transparent rounded-full" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
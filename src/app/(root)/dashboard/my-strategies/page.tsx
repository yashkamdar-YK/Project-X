"use client";
import React, { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ArrowRight, CheckCircle2, Beaker, Search } from "lucide-react";
import StrategyCard from "./_components/StrategyCard";
import { toast } from "@/hooks/use-toast";
import Spinner from "@/components/shared/spinner";
import { Badge } from "@/components/ui/badge";
import { TStrategy } from "./types";
import { useRouter } from "next/navigation";
import { clearStores } from "../strategy-builder/_utils/utils";
import { useNodeStore } from "@/lib/store/nodeStore";
import {
  INITIAL_EDGES,
  INITIAL_NODES,
} from "../strategy-builder/constants/menu";
import { strategyService } from "../strategy-builder/_actions";
import { backtestService } from "../backtests/_actions";
import { withAuth } from "@/components/shared/hoc/withAuth";

const MyStrategyPage = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const setNodes = useNodeStore((state) => state.setNodes);
  const setEdges = useNodeStore((state) => state.setEdges);

  // State Management
  const [searchQuery, setSearchQuery] = useState("");
  const [sortType, setSortType] = useState("newest");
  const [showSuccess, setShowSuccess] = useState(false);
  const [deletingStrategies, setDeletingStrategies] = useState<string[]>([]);
  const [backtestStrategies, setBacktestStrategies] = useState<string[]>([]);

  // Data Fetching
  const { data, isLoading, error } = useQuery({
    queryFn: strategyService.getAllSt,
    queryKey: ["allStrategies"],
  });

  // Mutations
  const deleteSt = useMutation({
    mutationFn: strategyService.deleteSt,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["allStrategies"],
        exact: true,
      });
      toast({
        title: "Strategy deleted successfully",
        variant: "default",
      });
    },
    onError: () => {
      toast({
        title: "Error deleting strategy",
        variant: "destructive",
      });
    },
  });

  const backtestSt = useMutation({
    mutationFn: ({
      strategyName,
      startDate,
      endDate,
    }: {
      strategyName: string;
      startDate: string;
      endDate: string;
    }) => backtestService.startBacktest(strategyName, startDate, endDate),
    onMutate: (variables) => {
      setBacktestStrategies((prev) => [...prev, variables.strategyName]);
    },
    onSuccess: () => {
      setShowSuccess(true);
    },
    onError: (error) => {
      toast({
        title: error.message || "Error starting backtest",
        variant: "destructive",
      });
    },
    onSettled: (_, __, variables) => {
      setBacktestStrategies((prev) =>
        prev.filter((name) => name !== variables.strategyName)
      );
    },
  });

  // Sorting and Filtering Logic
  const filteredStrategies = useMemo(() => {
    if (!data) return [];

    return data
      .filter((strategy: TStrategy) => {
        return (
          strategy.strategyName
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          strategy.description.toLowerCase().includes(searchQuery.toLowerCase())
        );
      })
      .sort((a: TStrategy, b: TStrategy) => {
        switch (sortType) {
          case "newest":
            return (
              new Date(b.createdon).getTime() - new Date(a.createdon).getTime()
            );
          case "oldest":
            return (
              new Date(a.createdon).getTime() - new Date(b.createdon).getTime()
            );
          case "bystatus":
            if (a.status === "active" && b.status !== "active") return -1;
            if (a.status !== "active" && b.status === "active") return 1;
            if (a.status === "scheduled" && b.status !== "scheduled") return -1;
            if (a.status !== "scheduled" && b.status === "scheduled") return 1;
            if (a.status === "inactive" && b.status !== "inactive") return -1;
            if (a.status !== "inactive" && b.status === "inactive") return 1;
            return (
              new Date(b.createdon).getTime() - new Date(a.createdon).getTime()
            );
          default:
            return 0;
        }
      });
  }, [data, searchQuery, sortType]);

  // Event Handlers
  const handleCreateNewSt = () => {
    clearStores();
    setNodes(INITIAL_NODES);
    setEdges(INITIAL_EDGES);
    router.push("/dashboard/strategy-builder");
  };

  const handleEdit = (name: string) => {
    clearStores();
    router.push(`/dashboard/strategy-builder?name=${name}`);
  };

  const handleDelete = async (name: string) => {
    try {
      setDeletingStrategies((prev) => [...prev, name]);
      await deleteSt.mutateAsync(name);
    } catch (error) {
      console.error("Error deleting strategy:", error);
    } finally {
      setDeletingStrategies((prev) => prev.filter((n) => n !== name));
    }
  };

  const handleBacktest = (
    strategyName: string,
    startDate: string,
    endDate: string
  ) => {
    backtestSt.mutate({ strategyName, startDate, endDate });
  };

  const handleGoToBacktests = () => {
    setShowSuccess(false);
    router.push("/dashboard/backtests");
  };

  // Loading States
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        <Spinner className="h-8 w-8 mb-2" />
        Fetching strategies...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full text-red-500">
        Error loading strategies
      </div>
    );
  }

  if (!data?.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full space-y-4">
        <p className="text-gray-500">No strategies found</p>
        <Button onClick={handleCreateNewSt}>Create New Strategy</Button>
      </div>
    );
  }

  return (
    <>
      <ScrollArea className="h-[calc(100vh-4rem)]">
        <div className="container md:px-8 px-2 mx-auto py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">My Strategies</h1>
            <Button onClick={handleCreateNewSt}>Create New Strategy</Button>
          </div>

          {/* Sorting and Filtering Section */}
          <div className="space-y-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search strategies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 max-w-lg"
                />
              </div>
              {/* Updated Sorting Select */}
              <Select value={sortType} onValueChange={setSortType}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Sort by" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bystatus">By Status</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                  <SelectItem value="oldest">Oldest First</SelectItem>
                  {/* <SelectItem value="scheduled">Scheduled First</SelectItem>
                  <SelectItem value="active">Active First</SelectItem>
                  <SelectItem value="inactive">Inactive First</SelectItem> */}
                </SelectContent>
              </Select>
            </div>

            {/* Results Summary */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{filteredStrategies.length} strategies found</span>
            </div>
          </div>

          {/* Strategy Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {filteredStrategies.map((strategy) => (
              <StrategyCard
                key={strategy.strategyName}
                strategy={strategy}
                onEdit={() => handleEdit(strategy.strategyName)}
                onDelete={handleDelete}
                deletingStrategies={deletingStrategies}
                onBacktest={(startDate, endDate) =>
                  handleBacktest(strategy.strategyName, startDate, endDate)
                }
                backtestStrategies={backtestStrategies}
              />
            ))}
          </div>
        </div>
      </ScrollArea>

      {/* Success Dialog */}
      <Dialog open={showSuccess} onOpenChange={setShowSuccess}>
        <DialogContent className="sm:max-w-[425px] text-center p-12">
          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              <div className="absolute -inset-1 rounded-full bg-primary/20 animate-pulse" />
              <div className="relative bg-background rounded-full p-3">
                <div className="relative animate-bounce">
                  <Beaker className="h-12 w-12 text-primary" />
                  <CheckCircle2 className="h-6 w-6 text-primary absolute -bottom-1 -right-1" />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-semibold tracking-tight">
                Backtest Started Successfully!
              </h2>
              <p className="text-muted-foreground">
                Your backtest has been initiated and is now processing. You can
                track its progress in the backtests section.
              </p>
            </div>
            <Button
              className="w-full mt-4 group"
              onClick={handleGoToBacktests}
              size="lg"
            >
              Go to My Backtests
              <ArrowRight className="transition-transform duration-200 group-hover:translate-x-1 h-4 w-4" />
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default withAuth(MyStrategyPage);
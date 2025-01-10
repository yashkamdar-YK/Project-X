"use client";
import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { format } from "date-fns";
import { debounce } from "lodash";

import { backtestService } from "../../_actions";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MetricCard } from "./_components/metric-card";
import { ReturnsChart } from "./_components/returns-chart";
import DetailedMetrics from "./_components/detailed-metrics";
import DrawdownChart from "./_components/drawdown-chart";
import TradesTable from "./_components/trades-table";
import MonthlyPerformance from "./_components/MonthlyPerformance";
import DrawdownPeriods from "./_components/DrawdownPeriods";
import Spinner from "@/components/shared/spinner";

import { Download, Eye, ArrowLeft } from "lucide-react";

import { withAuth } from "@/components/shared/hoc/withAuth";
import ShareDialog from "./_components/ShareDialog";

const getStoredSlippage = (strategy: string, runid: string): number => {
  if (typeof window === 'undefined') return 0;
  const stored = localStorage.getItem(`backtest-slippage`);
  return stored ? Number(stored) : 0;
};

const setStoredSlippage = (strategy: string, runid: string, value: number) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(`backtest-slippage`, value.toString());
};

function BacktestAnalyticsPage({
  params,
}: {
  params: { strategy: string; runid: string };
}) {
  const [inputSlippage, setInputSlippage] = useState(() => 
    getStoredSlippage(params.strategy, params.runid)
  );
  const [debouncedSlippage, setDebouncedSlippage] = useState(() => 
    getStoredSlippage(params.strategy, params.runid)
  );
  const router = useRouter();

  const debouncedSetSlippage = useMemo(
    () =>
      debounce((value: number) => {
        setDebouncedSlippage(value);
        setStoredSlippage(params.strategy, params.runid, value);
      }, 500),
    [params.strategy, params.runid]
  );

  const handleSlippageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = Number(e.target.value);
      setInputSlippage(value);
      debouncedSetSlippage(value);
    },
    [debouncedSetSlippage]
  );

  useEffect(() => {
    const storedValue = getStoredSlippage(params.strategy, params.runid);
    setInputSlippage(storedValue);
    setDebouncedSlippage(storedValue);
  }, [params.strategy, params.runid]);

  const { data, isLoading, error } = useQuery({
    queryKey: ["backtest-result", params.strategy, params.runid, debouncedSlippage],
    queryFn: () =>
      backtestService.getBackTestResults(
        params.strategy,
        params.runid,
        debouncedSlippage
      ),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full w-screen">
        <Spinner className="h-10 w-10" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 sm:p-6 space-y-4">
        <Alert variant="destructive">
          <AlertDescription>
            {error instanceof Error ? error.message : 'Failed to load backtest data. Please try again later.'}
          </AlertDescription>
        </Alert>
        <div className="flex justify-center items-center gap-2">
          <Button 
            size="sm" 
            onClick={() => router.back()}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="container mx-auto p-4 sm:p-6 space-y-4">
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => router.back()}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Go Back
          </Button>
        </div>
        <Alert>
          <AlertDescription>
            No backtest data found for this strategy.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const metrics = data.metrics;
  const formatDate = (date: string) => format(new Date(date), "yyyy-MM-dd");

  return (
    <ScrollArea className="h-[calc(100vh-4rem)]">
      <div className="container mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
        <div className="flex flex-col sm:flex-row sm:justify-between gap-4">
          <div className="flex items-center gap-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">{params.strategy}</h1>
              <p className="text-xs sm:text-sm text-muted-foreground">
                {formatDate(data.metrics.period.split(" to ")[0])} TO{" "}
                {formatDate(data.metrics.period.split(" to ")[1])}
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm whitespace-nowrap">Slippage %</span>
              <Input
                type="number"
                step={0.1}
                min={0}
                max={100}
                value={inputSlippage}
                onChange={handleSlippageChange}
                className="w-20"
              />
            </div>
            <div className="flex items-center gap-2">
              <Link href={"/dashboard/strategy-builder?name=" + params.strategy}>
                <Button variant="outline" className="flex-1 sm:flex-none">
                  <Eye className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">View Strategy</span>
                </Button>
              </Link>
              <Button variant="outline" className="flex-1 sm:flex-none">
                <Download className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Download</span>
              </Button>
              <ShareDialog
                strategy={params.strategy}
                runid={params.runid}
                visibility="public"
              />
            </div>
          </div>
        </div>

        <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
          <MetricCard
            title="Total Profit"
            value={metrics.totolReturns.toLocaleString()}
            prefix="₹"
          />
          <MetricCard
            title="Return to Max DD"
            value={metrics.returntoMaxDD.toFixed(2)}
            suffix="x"
          />
          <MetricCard
            title="Win Rate (daily)"
            value={metrics["winRate(daily)"].toFixed(1)}
            suffix="%"
          />
          <MetricCard
            title="Expectancy"
            value={metrics.expectancy.toFixed(2)}
          />
          <MetricCard
            title="Total Trades"
            value={metrics.totalTrades.toString()}
          />
        </div>

        <Tabs defaultValue="overview" className="space-y-4 sm:space-y-6">
          <TabsList className="grid w-fit grid-cols-2">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="trades">Trades</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 grid-cols-1">
              <Card>
                <CardContent className="pt-6">
                  <ReturnsChart data={data.returns} />
                </CardContent>
              </Card>

              <DrawdownChart data={data.ddChart} />
              <DetailedMetrics metrics={metrics} />
              <MonthlyPerformance data={data.monthly} />
              <DrawdownPeriods data={data.ddperiod} />
            </div>
          </TabsContent>

          <TabsContent value="trades">
            <TradesTable trades={data.trades} />
          </TabsContent>
        </Tabs>
      </div>
    </ScrollArea>
  );
}

export default withAuth(BacktestAnalyticsPage);
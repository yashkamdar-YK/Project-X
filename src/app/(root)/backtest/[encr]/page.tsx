"use client";

import React, { useState, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { debounce } from "lodash";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Share2, Download, Eye, Copy, Check, Phone, Linkedin, Twitter } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useToast } from "@/hooks/use-toast";
import Spinner from "@/components/shared/spinner";
import { backtestService } from "../../dashboard/backtests/_actions";
import { ReturnsChart } from "../../dashboard/backtests/[strategy]/[runid]/_components/returns-chart";
import DrawdownChart from "../../dashboard/backtests/[strategy]/[runid]/_components/drawdown-chart";
import DetailedMetrics from "../../dashboard/backtests/[strategy]/[runid]/_components/detailed-metrics";
import MonthlyPerformance from "../../dashboard/backtests/[strategy]/[runid]/_components/MonthlyPerformance";
import DrawdownPeriods from "../../dashboard/backtests/[strategy]/[runid]/_components/DrawdownPeriods";
import TradesTable from "../../dashboard/backtests/[strategy]/[runid]/_components/trades-table";
import { MetricCard } from "../../dashboard/backtests/[strategy]/[runid]/_components/metric-card";
import Image from "next/image";

const PublicBacktestPage = ({
  params,
}: {
  params: { encr: string };
}) => {
  const { toast } = useToast();
  const [inputSlippage, setInputSlippage] = useState<number>(0);
  const [debouncedSlippage, setDebouncedSlippage] = useState<number>(0);
  const [copied, setCopied] = useState<boolean>(false);

  const debouncedSetSlippage = useMemo(
    () =>
      debounce((value: number) => {
        setDebouncedSlippage(value);
      }, 500),
    []
  );

  const handleSlippageChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = Number(e.target.value);
      setInputSlippage(value);
      debouncedSetSlippage(value);
    },
    [debouncedSetSlippage]
  );

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast({
        title: "Copied!",
        description: "Link copied to clipboard",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to copy link to clipboard",
      });
    }
  };

  const shareToSocial = (platform: 'whatsapp' | 'twitter' | 'linkedin') => {
    const text = `Check out this trading strategy backtest results!`;
    const url = encodeURIComponent(window.location.href);
    
    const links = {
      whatsapp: `https://wa.me/?text=${encodeURIComponent(text + ' ' + window.location.href)}`,
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${url}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${url}`
    };

    window.open(links[platform], '_blank', 'noopener,noreferrer');
  };

  const { data, isLoading, error } = useQuery({
    queryKey: ["public-backtest", params.encr, debouncedSlippage],
    queryFn: () => backtestService.getPublicBacktest(params.encr, debouncedSlippage),
  });

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center h-screen w-screen">
        <Spinner className="h-10 w-10" />
        <p className="mt-4 text-muted-foreground">Loading backtest data...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="container mx-auto p-4 sm:p-6 space-y-4">
        <Alert variant="destructive">
          <AlertDescription>
            {error instanceof Error ? error.message : 'No backtest data found for this link.'}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  const { metrics, info } = data;
  const formatDate = (date: string) => format(new Date(date), "dd MMM yyyy");

  return (
    <ScrollArea className="h-[calc(100vh-4rem)]">
      <div className="container mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
        <Card className="p-6">
          <div className="flex flex-col lg:flex-row justify-between gap-6">
            <div className="space-y-4">
              <div>
                <h1 className="text-2xl font-bold mb-2">{info.strategyName}</h1>
                <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
                  <span className="px-2 py-1 bg-muted rounded-md">{info.info.underlying}</span>
                  <span className="px-2 py-1 bg-muted rounded-md">{info.info.productType}</span>
                  <span className="px-2 py-1 bg-muted rounded-md">{info.info.strategyType}</span>
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Created by</span>
                  <span className="font-medium text-foreground">{info.creator}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Created on</span>
                  <span className="font-medium text-foreground">{formatDate(info.createdon)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Backtest Period</span>
                  <span className="font-medium text-foreground">
                    {formatDate(metrics.period.split(" to ")[0])} - {formatDate(metrics.period.split(" to ")[1])}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 lg:items-start">
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
              
              <div className="flex gap-2">
                <Button variant="outline" className="flex-1 sm:flex-none gap-2">
                  <Eye className="h-4 w-4" />
                  <span className="hidden sm:inline">View Strategy</span>
                </Button>
                {/* <Button variant="outline" className="flex-1 sm:flex-none gap-2">
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">Download</span>
                </Button> */}
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" size="icon">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-56" align="end">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <div className="flex space-x-2">
                          <Input
                            value={window.location.href}
                            readOnly
                            className="flex-1"
                          />
                          <Button
                            size="icon"
                            variant="outline"
                            onClick={copyToClipboard}
                            className="shrink-0"
                          >
                            {copied ? (
                              <Check className="h-4 w-4" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>
                      <div className="flex justify-center space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => shareToSocial('whatsapp')}
                          className="bg-green-50 hover:bg-green-100"
                        >
                          <Image
                              src="/icons/whatsapp.svg"
                              alt="WhatsApp"
                              width={16}
                              height={16}
                              className="h-4 w-4 text-green-600"
                            />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => shareToSocial('twitter')}
                          className="bg-blue-50 hover:bg-blue-100"
                        >
                          <Twitter className="h-4 w-4 text-blue-600" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => shareToSocial('linkedin')}
                          className="bg-blue-50 hover:bg-blue-100"
                        >
                          <Linkedin className="h-4 w-4 text-blue-600" />
                        </Button>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
        </Card>

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
};

export default PublicBacktestPage;
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TBacktestResult } from '../../../type';
import { LineChart, Activity, BarChart2, TimerReset } from 'lucide-react';

interface DetailedMetricsProps {
  metrics: TBacktestResult['metrics'];
}

const DetailedMetrics = ({ metrics }: DetailedMetricsProps) => {
  const formatValue = (value: number) => {
    return value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const getValueColor = (value: number) => {
    return value > 0 ? 'text-green-500' : 'text-red-500';
  };

  const metricsGroups = [
    {
      title: "Performance Metrics",
      icon: <LineChart className="h-5 w-5 text-primary" />,
      items: [
        { label: "Total Returns", value: formatValue(metrics.totolReturns) },
        { label: "Average Monthly", value: formatValue(metrics.avgMonthly) },
        { label: "Return/Max DD", value: `${formatValue(metrics.returntoMaxDD)}x` },
        { label: "Max Drawdown", value: formatValue(metrics.maxDrawdown) },
      ]
    },
    {
      title: "Trade Statistics",
      icon: <BarChart2 className="h-5 w-5 text-primary" />,
      items: [
        { label: "Total Trades", value: metrics.totalTrades },
        { label: "Win Rate (Trades)", value: `${formatValue(metrics["winRate(trades)"])}%` },
        { label: "Win Rate (Daily)", value: `${formatValue(metrics["winRate(daily)"])}%` },
        { label: "Profit Factor", value: formatValue(metrics.profitFactor) },
      ]
    },
    {
      title: "Trade Analysis",
      icon: <Activity className="h-5 w-5 text-primary" />,
      items: [
        { label: "Avg Profit/Trade", value: formatValue(metrics["avgProfit/trade"]) },
        { label: "Avg Loss/Trade", value: formatValue(metrics["avgLoss/trade"]) },
        { label: "Expectancy", value: formatValue(metrics.expectancy) },
        { label: "Risk Reward Ratio", value: formatValue(metrics.rrRatio) },
      ]
    },
    {
      title: "Consecutive Trades",
      icon: <TimerReset className="h-5 w-5 text-primary" />,
      items: [
        { label: "Max Consecutive Wins", value: metrics.consecutiveWinsNo },
        { label: "Consecutive Wins P&L", value: formatValue(metrics.consecutiveWinsPnl) },
        { label: "Max Consecutive Losses", value: metrics.consecutiveLossNo },
        { label: "Consecutive Losses P&L", value: formatValue(metrics.consecutiveLossPnl) },
      ]
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {metricsGroups.map((group, index) => (
        <Card key={index}>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              {group.icon}
              {group.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {group.items.map((item, i) => {
                const value = typeof item.value === 'string' 
                  ? parseFloat(item.value.replace(/[x%]/g, ''))
                  : item.value;
                
                return (
                  <div key={i} className="space-y-1">
                    <p className="text-xs sm:text-sm text-muted-foreground">{item.label}</p>
                    <p className={`text-sm sm:text-base font-medium ${getValueColor(value)}`}>
                      {item.value}
                    </p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default DetailedMetrics;
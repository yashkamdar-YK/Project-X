import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { SimpleTooltip } from './custom-tooltip';
import { TBacktestResult } from '../../../type';

interface DrawdownChartProps {
  data: TBacktestResult['ddChart']
}

const DrawdownChart = ({ data }: DrawdownChartProps) => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Drawdown Analysis</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="h-[250px] sm:h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 5, left: 30, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="date"
                tickFormatter={(value) => new Date(value).toLocaleDateString()}
                className="text-[10px] sm:text-xs"
                minTickGap={20}
              />
              <YAxis 
                className="text-[10px] sm:text-xs"
                tickFormatter={(value) => `${value.toFixed(2)}%`}
                width={40}
              />
              <Tooltip content={<SimpleTooltip />} />
              <Line
                type="monotone"
                dataKey="drawdown"
                name="Drawdown"
                stroke="hsl(var(--destructive))"
                strokeWidth={2}
                dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default DrawdownChart;


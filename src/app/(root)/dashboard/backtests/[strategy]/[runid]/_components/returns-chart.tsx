import React from "react";
import {
  Line,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ComposedChart,
  Cell
} from "recharts";
import { CustomTooltip } from "./custom-tooltip";
import { TBacktestResult } from "../../../type";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ReturnsChartProps {
  data: TBacktestResult['returns']
}

export function ReturnsChart({ data }: ReturnsChartProps) {
  return (
    <div>
      <div>
     Returns Analysis
      </div>
      <div className="pt-4">
        <div className="h-[300px] sm:h-[400px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={data}
              margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="date"
                tickFormatter={(value) => new Date(value).toLocaleDateString()}
                className="text-[10px] sm:text-xs"
                minTickGap={20}
              />
              <YAxis
                yAxisId="left"
                className="text-[10px] sm:text-xs"
                tickFormatter={(value) =>
                  value.toLocaleString("en-IN", {
                    style: "currency",
                    currency: "INR",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  })
                }
                width={60}
              />
              <Tooltip content={<CustomTooltip />} />
              <Bar
                name="Daily P&L"
                dataKey="pnl"
                yAxisId="left"
                // maxBarSize={15}
                radius={[2, 2, 0, 0]}
              >
                {data.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`}
                    fill={entry.pnl >= 0 ? '#22c55e60' : '#ef444460'}
                    fillOpacity={0.8}
                  />
                ))}
              </Bar>
              <Line
                name="Cumulative Returns"
                type="monotone"
                dataKey="cumsum"
                yAxisId="left"
                stroke="#2563eb"
                strokeWidth={2}
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
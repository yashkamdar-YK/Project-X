import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { CustomTooltip } from './custom-tooltip';
import { TBacktestResult } from '../../../type';

const formatMonthName = (month:string) => {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return monthNames[parseInt(month) - 1];
};

const MonthlyPerformance = ({ data }:{
  data: TBacktestResult['monthly']
}) => {
  // Transform the nested data structure into an array format for Recharts
  const transformedData = Object.entries(data).flatMap(([year, months]) =>
    Object.entries(months).map(([month, value]) => ({
      month: `${formatMonthName(month)} ${year}`,
      value: value,
      rawValue: value // For sorting
    }))
  ).sort((a, b) => {
    // Sort by date
    const [aMonth, aYear] = a.month.split(' ');
    const [bMonth, bYear] = b.month.split(' ');
    return new Date(`${aMonth} 1, ${aYear}`).getTime() - new Date(`${bMonth} 1, ${bYear}`).getTime();
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Performance</CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={transformedData} margin={{ top: 5, right: 5, left: -30, bottom: 20 }}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis 
                dataKey="month"
                angle={-45}
                textAnchor="end"
                height={60}
                interval={0}
                className="text-xs"
              />
              <YAxis
                className="text-xs"
                tickFormatter={(value) => 
                  value.toLocaleString('en-IN', {
                    style: 'currency',
                    currency: 'INR',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                  })
                }
                width={80}
              />
              <Tooltip 
                content={<CustomTooltip 
                  labelFormatter={(label) => label}
                  valueFormatter={(value) => 
                    value.toLocaleString('en-IN', {
                      style: 'currency',
                      currency: 'INR',
                      minimumFractionDigits: 2
                    })
                  }
                />}
              />
              <Bar
                dataKey="value"
                name="P&L"
                radius={[4, 4, 0, 0]}
                maxBarSize={90}
              >
                {transformedData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`}
                    fill={entry.value >= 0 ? '#22c55e' : '#ef4444'} // green-500 for positive, red-500 for negative
                    fillOpacity={0.8}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
};

export default MonthlyPerformance;
import React from 'react';

interface TooltipData {
  label?: string;
  payload?: Array<{
    value: number;
    dataKey: string;
    color: string;
    name: string;
  }>;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipData["payload"];
  label?: string;
  labelFormatter?: (label: string) => string;
  valueFormatter?: (value: number) => string;
}

const getValueColor = (value: number) => {
  if (value > 0) return 'text-green-500';
  if (value < 0) return 'text-red-500';
  return 'text-foreground';
};

export const CustomTooltip = ({ 
  active, 
  payload, 
  label,
  labelFormatter = (label) => new Date(label).toLocaleDateString(),
  valueFormatter = (value) => value.toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
  })
}: CustomTooltipProps) => {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="rounded-lg bg-background border px-3 py-2 shadow-md">
      <div className="text-sm text-muted-foreground mb-2">
        {labelFormatter(label || '')}
      </div>
      <div className="space-y-1.5">
        {payload.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: item.color }}
            />
            <span className={`text-sm font-medium ${item.dataKey === 'pnl' ? getValueColor(item.value) : ''}`}>
              {item.name}: {valueFormatter(item.value)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const SimpleTooltip = ({ 
  active, 
  payload, 
  label,
  valueFormatter = (value) => value.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}: CustomTooltipProps) => {
  if (!active || !payload?.length) {
    return null;
  }

  return (
    <div className="rounded-lg bg-background border px-3 py-2 shadow-md">
      <div className="text-sm text-muted-foreground mb-1">
        {new Date(label || '').toLocaleDateString()}
      </div>
      <div className={`text-base font-medium ${getValueColor(payload[0].value)}`}>
        {valueFormatter(payload[0].value)}
      </div>
    </div>
  );
};
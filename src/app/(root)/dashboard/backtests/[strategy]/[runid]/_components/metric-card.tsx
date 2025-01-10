import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface MetricCardProps {
  title: string
  value: string
  prefix?: string
  suffix?: string
}

export function MetricCard({ title, value, prefix, suffix }: MetricCardProps) {
  const getColorForMetric = (title: string, value: string) => {
    // Parse the numeric value, removing currency symbols and other non-numeric characters
    const numericValue = parseFloat(value?.replace(/[^-\d.]/g, ''));

    // If we can't parse the value, return no color
    if (isNaN(numericValue)) return '';

    // Metrics that should be green when positive
    const positiveMetrics = [
      'Total Profit',
      'Return to Max DD',
      'Win Rate',
      'Expectancy'
    ];

    // Metrics that should be green when above a certain threshold
    const thresholdMetrics: Record<string, number> = {
      'Win Rate (daily)': 50, // Green if win rate > 50%
      'Expectancy': 0,      // Green if expectancy > 0
    };

    // Neutral metrics that don't need coloring
    const neutralMetrics = [
      'Total Trades'
    ];

    if (neutralMetrics.includes(title)) {
      return '';
    }

    // Check for threshold metrics
    if (title in thresholdMetrics) {
      return numericValue > thresholdMetrics[title] 
        ? 'text-green-500 dark:text-green-400' 
        : 'text-red-500 dark:text-red-400';
    }

    // For standard positive/negative metrics
    if (positiveMetrics.some(metric => title.includes(metric))) {
      return numericValue > 0 
        ? 'text-green-500 dark:text-green-400' 
        : 'text-red-500 dark:text-red-400';
    }

    return '';
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xs sm:text-sm font-medium">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className={`text-lg sm:text-2xl font-bold truncate ${getColorForMetric(title, value)}`}>
          {prefix}
          {value}
          {suffix}
        </div>
      </CardContent>
    </Card>
  )
}
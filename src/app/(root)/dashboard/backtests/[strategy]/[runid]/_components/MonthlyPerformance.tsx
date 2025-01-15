'use client'

import { InfoIcon } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import type { TBacktestResult } from '../../../type'

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

const MonthlyReturns = ({ data }: {
  data: TBacktestResult['monthly']
}) => {
  // Get unique years from data
  const YEARS = Object.keys(data || {}).sort()

  const getValue = (year: string, month: string) => {
    return data?.[year]?.[month] || 0
  }

  return (
    <Card className="w-full bg-white dark:bg-gray-900">
      <CardHeader className="pb-6">
        <div className="flex items-center gap-2">
          <CardTitle className="text-xl font-semibold text-gray-900 dark:text-gray-100">
            Monthly Returns
          </CardTitle>
          <TooltipProvider delayDuration={100}>
            <Tooltip>
              <TooltipTrigger className="focus:outline-none">
                <InfoIcon className="h-4 w-4 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400" />
              </TooltipTrigger>
              <TooltipContent className="bg-white dark:bg-gray-800 p-2 text-sm">
                Monthly performance returns
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>
      <CardContent className="overflow-x-auto pb-6">
        <div className="min-w-[768px]">
          {/* Months header */}
          <div className="grid sm:grid-cols-[120px_repeat(12,minmax(60px,1fr))] grid-cols-[38px_repeat(12,minmax(38px,1fr))] gap-2 mb-4">
            <div className="text-sm font-medium text-gray-400" />
            {MONTHS.map((month) => (
              <div 
                key={month} 
                className="text-sm font-medium text-gray-500 dark:text-gray-400"
              >
                {month}
              </div>
            ))}
          </div>
          
          {/* Years and cells grid */}
          <div className="space-y-2">
            {YEARS.map((year) => (
              <div 
                key={year} 
                className="grid sm:grid-cols-[120px_repeat(12,minmax(60px,1fr))] grid-cols-[38px_repeat(12,minmax(38px,1fr))] gap-2"
              >
                <div className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center">
                  {year}
                </div>
                {MONTHS.map((_, index) => {
                  const monthNum = (index + 1).toString().padStart(2, '0')
                  const value = getValue(year, monthNum)
                  const hasValue = value !== 0
                  const isNegative = value < 0
                  
                  return (
                    <TooltipProvider delayDuration={100} key={`${year}-${monthNum}`}>
                      <Tooltip>
                        <TooltipTrigger className="w-full">
                          <div
                            className={cn(
                              "aspect-square rounded-md transition-all duration-200",
                              "border border-gray-100 dark:border-gray-800",
                              hasValue && isNegative
                                ? "bg-red-600 hover:bg-red-700 dark:bg-red-600/90 dark:hover:bg-red-600"
                                : hasValue
                                ? "bg-green-600 hover:bg-green-700 dark:bg-green-600/90 dark:hover:bg-green-600"
                                : "bg-gray-50 hover:bg-gray-100 dark:bg-gray-800/50 dark:hover:bg-gray-800"
                            )}
                          />
                        </TooltipTrigger>
                        <TooltipContent 
                          className="bg-white dark:bg-gray-800 p-3 shadow-lg border border-gray-100 dark:border-gray-700"
                        >
                          <div className="text-sm">
                            <p className="text-gray-500 dark:text-gray-400 mb-1">
                              {`${MONTHS[index]} ${year}`}
                            </p>
                            <p className={cn(
                              "font-semibold",
                              isNegative 
                                ? "text-red-600 dark:text-red-400"
                                : hasValue 
                                ? "text-green-600 dark:text-green-400"
                                : "text-gray-900 dark:text-gray-100"
                            )}>
                              {value.toLocaleString('en-IN', {
                                style: 'currency',
                                currency: 'INR',
                                minimumFractionDigits: 2
                              })}
                            </p>
                          </div>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  )
                })}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default MonthlyReturns
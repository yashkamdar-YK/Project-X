import React, { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { format } from 'date-fns';
import { TBacktestResult } from '../../../type';

interface DrawdownPeriodsProps {
  data: TBacktestResult['ddperiod']
}

const DrawdownPeriods = ({ data }: DrawdownPeriodsProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const totalPages = Math.ceil(data.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, data.length);
  const currentData = data.slice(startIndex, endIndex);

  const handlePageSizeChange = (value: string) => {
    const newPageSize = parseInt(value);
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  const goToFirstPage = () => setCurrentPage(1);
  const goToPreviousPage = () => setCurrentPage((prev) => Math.max(1, prev - 1));
  const goToNextPage = () => setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  const goToLastPage = () => setCurrentPage(totalPages);

  return (
    <div className='rounded-xl sm:p-6 sm:border sm:bg-card sm:dark:bg-gray-800/30 text-card-foreground shadow' >
        <div className='text-base font-semibold mb-2' >Drawdown Periods Analysis</div>
      <div>
        <div className="overflow-hidden !rounded-xl border">
          <Table>
            <TableHeader className='bg-muted' >
              <TableRow>
                <TableHead>Period</TableHead>
                <TableHead className="text-right">Max Drawdown</TableHead>
                <TableHead className="text-right">DD Days</TableHead>
                <TableHead className="text-center">Trading Days</TableHead>
                <TableHead className="text-center">Total Trades</TableHead>
                <TableHead className="text-center">Max DD Date</TableHead>
                <TableHead className="text-right">Days to Max DD</TableHead>
                <TableHead className="text-right">Recovery Days</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentData.map((period, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium whitespace-nowrap">
                    {format(new Date(period.Start_Date), 'dd MMM yy')} -{' '}
                    {format(new Date(period.End_Date), 'dd MMM yy')}
                  </TableCell>
                  <TableCell className="text-right text-destructive font-medium">
                    {period.Max_Drawdown.toFixed(2)}%
                  </TableCell>
                  <TableCell className="text-right">
                    {period.Drawdown_days}
                  </TableCell>
                  <TableCell className="text-center">
                    {period.Trading_days}
                  </TableCell>
                  <TableCell className="text-center">
                    {period.Total_Trades}
                  </TableCell>
                  <TableCell className="text-center whitespace-nowrap">
                    {format(new Date(period.Max_Drawdown_Date), 'dd MMM yy')}
                  </TableCell>
                  <TableCell className="text-right">
                    {period.Time_for_max_drawdown}
                  </TableCell>
                  <TableCell className="text-right">
                    {period.Time_for_recovery}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4">
          <div className="text-xs sm:text-sm text-muted-foreground">
            Showing {startIndex + 1} to {endIndex} of {data.length} periods
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={goToFirstPage}
              disabled={currentPage === 1}
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={goToPreviousPage}
              disabled={currentPage === 1}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <div className="flex items-center gap-1">
              <div className="text-xs sm:text-sm font-medium">
                Page {currentPage} of {totalPages}
              </div>
            </div>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={goToNextPage}
              disabled={currentPage === totalPages}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="h-8 w-8"
              onClick={goToLastPage}
              disabled={currentPage === totalPages}
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="mt-4 flex  justify-between items-start sm:items-center gap-2">
          <div className="text-xs text-muted-foreground ">
            * DD = Drawdown, Trading Days = Number of market days in the period
          </div>
          <Select
            value={pageSize.toString()}
            onValueChange={handlePageSizeChange}
          >
            <SelectTrigger className="w-[70px] h-8 text-xs">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent>
              {[5, 10, 20, 50, 100].map((size) => (
                <SelectItem key={size} value={size.toString()} className="text-xs">
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default DrawdownPeriods;
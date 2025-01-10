import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Download } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";

interface Trade {
  symbol: string;
  transactionType: string;
  entryTime: string;
  exitTime: string;
  entryDate: string;
  exitDate: string;
  entryPrice: number;
  exitPrice: number;
  qty: number;
  pnl: number;
  entryRemarks: string;
  exitRemarks: string;
}

const formatDateTime = (dateTimeStr: string) => {
  try {
    const date = new Date(dateTimeStr);
    return format(date, "dd MMM yyyy HH:mm:ss");
  } catch {
    return dateTimeStr;
  }
};

const formatDateTimeForCSV = (dateTimeStr: string) => {
  try {
    const date = new Date(dateTimeStr);
    // Format that Excel can properly interpret
    return format(date, "yyyy-MM-dd HH:mm:ss");
  } catch {
    return dateTimeStr;
  }
};

const TradesTable: React.FC<{ trades: Trade[] }> = ({ trades }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const totalPages = Math.ceil(trades.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, trades.length);
  const currentTrades = trades.slice(startIndex, endIndex);

  const handlePageSizeChange = (value: string) => {
    const newPageSize = parseInt(value);
    setPageSize(newPageSize);
    setCurrentPage(1);
  };

  const goToFirstPage = () => setCurrentPage(1);
  const goToPreviousPage = () => setCurrentPage((prev) => Math.max(1, prev - 1));
  const goToNextPage = () => setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  const goToLastPage = () => setCurrentPage(totalPages);

  const downloadCSV = () => {
    // Create CSV headers
    const headers = [
      "Symbol",
      "Transaction Type",
      "Entry Date Time",
      "Exit Date Time",
      "Entry Price",
      "Exit Price",
      "Quantity",
      "P&L",
      "Entry Remarks",
      "Exit Remarks"
    ];

    // Convert trades data to CSV rows
    const csvRows = trades.map(trade => [
      `"${trade.symbol}"`,
      `"${trade.transactionType}"`,
      `"${formatDateTimeForCSV(trade.entryTime)}"`,
      `"${formatDateTimeForCSV(trade.exitTime)}"`,
      trade.entryPrice.toFixed(2),
      trade.exitPrice.toFixed(2),
      trade.qty,
      trade.pnl.toFixed(2),
      `"${trade.entryRemarks}"`,
      `"${trade.exitRemarks}"`
    ]);

    // Combine headers and rows
    const csvContent = [
      headers.join(","),
      ...csvRows.map(row => row.join(","))
    ].join("\n");

    // Create and trigger download
    const blob = new Blob(['\ufeff' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', 'trades.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full overflow-auto md:border md:p-4 rounded-xl">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Trade History</h2>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-2"
          onClick={downloadCSV}
        >
          <Download className="h-4 w-4" />
          Download CSV
        </Button>
      </div>

      <div className="md:min-w-[800px] lg:w-full w-[93vw] border overflow-hidden !rounded-xl">
        <Table>
          <TableHeader className="bg-muted">
            <TableRow>
              <TableHead className="text-center whitespace-nowrap">Symbol</TableHead>
              <TableHead className="text-center whitespace-nowrap">Type</TableHead>
              <TableHead className="text-center whitespace-nowrap">Entry Time</TableHead>
              <TableHead className="text-center whitespace-nowrap">Exit Time</TableHead>
              <TableHead className="text-center whitespace-nowrap">Entry</TableHead>
              <TableHead className="text-center whitespace-nowrap">Exit</TableHead>
              <TableHead className="text-center whitespace-nowrap">Qty</TableHead>
              <TableHead className="text-right whitespace-nowrap">P&L</TableHead>
              <TableHead className="text-center whitespace-nowrap">Remarks</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentTrades.map((trade, index) => (
              <TableRow key={index}>
                <TableCell className="text-center text-xs sm:text-sm whitespace-nowrap">
                  {trade.symbol}
                </TableCell>
                <TableCell className="text-center whitespace-nowrap">
                  <Badge
                    className={`uppercase text-white text-xs ${
                      trade.transactionType?.toLowerCase() === "buy"
                        ? "bg-green-600"
                        : "bg-red-600"
                    }`}
                  >
                    {trade.transactionType}
                  </Badge>
                </TableCell>
                <TableCell className="text-center text-xs sm:text-sm whitespace-nowrap">
                  {formatDateTime(trade.entryTime)}
                </TableCell>
                <TableCell className="text-center text-xs sm:text-sm whitespace-nowrap">
                  {formatDateTime(trade.exitTime)}
                </TableCell>
                <TableCell className="text-center text-xs sm:text-sm whitespace-nowrap">
                  {trade.entryPrice.toFixed(2)}
                </TableCell>
                <TableCell className="text-center text-xs sm:text-sm whitespace-nowrap">
                  {trade.exitPrice.toFixed(2)}
                </TableCell>
                <TableCell className="text-center text-xs sm:text-sm whitespace-nowrap">
                  {trade.qty}
                </TableCell>
                <TableCell
                  className={`text-right text-xs sm:text-sm whitespace-nowrap ${
                    trade.pnl >= 0 ? "text-green-500" : "text-red-500"
                  }`}
                >
                  {trade.pnl.toFixed(2)}
                </TableCell>
                <TableCell className="text-center text-xs sm:text-sm">
                  <div>{trade.entryRemarks}</div>
                  <div className="text-muted-foreground">{trade.exitRemarks}</div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 px-4 py-2">
        <div className="text-xs sm:text-sm text-muted-foreground">
          Showing {startIndex + 1} to {endIndex} of {trades.length} trades
        </div>
        <div className="flex items-center space-x-2">
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

      <div className="mt-4 flex justify-end px-4 pb-2">
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
  );
};

export default TradesTable;
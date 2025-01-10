"use client"

import { useQuery } from "@tanstack/react-query"
import { backtestService } from "./_actions"
import { Skeleton } from "@/components/ui/skeleton"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from 'lucide-react'
import { withAuth } from "@/components/shared/hoc/withAuth"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BacktestCard } from "./_components/backtest-card"
import { SearchBar } from "./_components/search-bar"
import { useState } from "react"

function BacktestPage() {
  const [searchQuery, setSearchQuery] = useState("")
  
  const { data: backtests, isLoading, error } = useQuery({
    queryKey: ["backtests"],
    queryFn: backtestService.getBacktests,
    refetchInterval: 5000,
  })

  const filteredBacktests = backtests?.filter(backtest => 
    backtest?.strategyName.toLowerCase().includes(searchQuery?.toLowerCase()) ||
    backtest?.info?.underlying?.toLowerCase().includes(searchQuery?.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex justify-between items-center">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-10 w-[300px]" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-[400px]" />
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Failed to load backtest data. Please try again later.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!backtests?.length) {
    return (
      <div className="container mx-auto p-6">
        <Alert>
          <AlertDescription>
            No backtest data found. Start a new backtest to see results here.
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <ScrollArea className="h-[calc(100vh-4rem)]">
      <div className="container mx-auto p-6 space-y-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Backtest Results</h1>
            <p className="text-muted-foreground">
              View and analyze backtest results
            </p>
          </div>
          <SearchBar onSearch={setSearchQuery} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBacktests?.map((backtest) => (
            <BacktestCard key={backtest.runid} backtest={backtest} />
          ))}
        </div>
      </div>
    </ScrollArea>
  )
}

export default withAuth(BacktestPage)

export type TBacktest = {
  strategyName: string;
  runid: string;
  createdon: string;
  status: string;
  creator: string;
  info: { underlying: string; productType: string; strategyType: string };
  startDate: string;
  endDate: string;
  visiblity: string;
  results: {
    rmdd: number;
    drawdown: number;
    totalTrades: number;
    totalreturns: number;
  };
};

export type TBacktestResult = {
  trades: {
    pnl: number;
    qty: number;
    symbol: string;
    exitDate: string;
    exitTime: string;
    entryDate: string;
    entryTime: string;
    exitPrice: number;
    entryPrice: number;
    exitRemarks: string;
    entryRemarks: string;
    transactionType: "sell";
  }[];
  metrics: {
    period: string;
    totalTrades: number;
    totolReturns: number;
    maxDrawdown: number;
    maxdrawdown_Date: string;
    returntoMaxDD: number;
    "avgProfit/trade": number;
    "avgLoss/trade": number;
    "winRate(trades)": number;
    "winRate(daily)": number;
    consecutiveWinsNo: number;
    consecutiveWinsPnl: number;
    consecutiveLossNo: number;
    consecutiveLossPnl: number;
    rrRatio: number;
    expectancy: number;
    profitFactor: number;
    avgMonthly: number;
  };
  monthly: {
    [year: string]: {
      [month: string]: number;
    };
  };
  dailyPnl: {
    date: string;
    pnl: number;
  }[];
  returns: {
    date: string;
    pnl: number;
    cumsum: number;
  }[];
  ddChart: {
    date: string;
    drawdown: number;
  }[];
  ddperiod: {
    Start_Date: string;
    End_Date: string;
    Drawdown_days: number;
    Trading_days: number;
    Total_Trades: number;
    Max_Drawdown: number;
    Max_Drawdown_Date: string;
    Time_for_max_drawdown: number;
    Time_for_recovery: number;
  }[];
  info:TBacktest
};

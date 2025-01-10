export type TStrategy = {
  strategyID?:string
  strategyName: string;
  settings: {
    orderType: string;
    timeframe: number;
    underlying: string;
    productType: string;
    tradingDays: string;
    exitOperation: any;
    squareoffTime: any;
    strategy_type: string;
    entryOperation: any;
    tradingDaysList: any[];
  };
  visiblity: string;
  description: string;
  capitalReq: number;
  createdon: string;
  status: string;
}
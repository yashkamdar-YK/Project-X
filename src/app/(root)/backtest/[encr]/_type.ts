import { TBacktest, TBacktestResult } from "../../dashboard/backtests/type";

export type TPublicBacktestdata = TBacktestResult & {
  info :TBacktest
}
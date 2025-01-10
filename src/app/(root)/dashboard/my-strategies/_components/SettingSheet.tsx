import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Settings2, Calendar, Briefcase, LayoutGrid, X } from "lucide-react";
import OrderOperation from "./OrderOperation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useDataPointStore } from "@/lib/store/dataPointStore";
import { useMutation, useQuery } from "@tanstack/react-query";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TStrategy } from "../types";
import DaySelector from "./DaySelector";
import {
  defaultOptionsService,
  strategyService,
} from "../../strategy-builder/_actions";
import { toast } from "@/hooks/use-toast";

interface SettingSheetProps {
  isOpen: boolean;
  onClose: () => void;
  strategy: TStrategy;
}
export interface Operation {
  timeLimit: string;
  priceBuffer: string;
  shouldExecute: boolean;
}

const SettingSheet = ({ isOpen, onClose, strategy }: SettingSheetProps) => {
  const { symbolInfo, selectedTimeFrame, selectedSymbol } = useDataPointStore();

  // Local state management for strategy settings
  const [strategyType, setStrategyType] = useState(
    strategy.settings.strategy_type
  );
  const [productType, setProductType] = useState(strategy.settings.productType);
  const [orderType, setOrderType] = useState(strategy.settings.orderType);
  const [squareOffTime, setSquareOffTime] = useState(
    strategy.settings.squareoffTime
  );

  const [selectorState, setSelectorState] = useState<"daily" | "days" | "exp">(
    "daily"
  );
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const [selectedExp, setSelectedExp] = useState<string[]>([]);

  const [entryOperation, setEntryOperation] = useState<Operation>({
    timeLimit: "",
    priceBuffer: "",
    shouldExecute: false,
  });
  const [exitOperation, setExitOperation] = useState<Operation>({
    timeLimit: "",
    priceBuffer: "",
    shouldExecute: false,
  });

  // Update local state when strategy prop changes
  useEffect(() => {
    setStrategyType(strategy.settings.strategy_type);
    setProductType(strategy.settings.productType);
    setOrderType(strategy.settings.orderType);
    setSquareOffTime(strategy.settings.squareoffTime);
    if (strategy.settings.tradingDaysList) {
      setSelectedDays(strategy.settings.tradingDaysList);
    }
    if (strategy.settings.entryOperation) {
      setEntryOperation(strategy.settings.entryOperation);
    }
    if (strategy.settings.exitOperation) {
      setExitOperation(strategy.settings.exitOperation);
    }
  }, [strategy]);

  const handleEntryOperationChange = (updates: Partial<Operation>) => {
    setEntryOperation((prev) => ({ ...prev, ...updates }));
  };

  const handleExitOperationChange = (updates: Partial<Operation>) => {
    setExitOperation((prev) => ({ ...prev, ...updates }));
  };

  const updateStrategyMutation = useMutation({
    mutationFn: ({ strategyName, data }: any) =>
      strategyService.updateStrategy(strategyName, data),
    mutationKey: ["updateStrategy"],
    onSuccess: () => {
      toast({
        title: "Strategy saved successfully",
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Failed to save strategy",
        description: error.message,
        variant: "destructive",
      });
    },
  });
  const { data, isLoading } = useQuery({
    queryFn: () => defaultOptionsService.getTimeIntervalsData(1),
    queryKey: ["1-timeIntervals"],
  });

  const currentSymbolInfo = selectedSymbol ? symbolInfo[selectedSymbol] : null;

  const availableProductTypes = currentSymbolInfo?.executionSettings
    ?.productType || ["Intraday", "Delivery"];
  const availableOrderTypes = currentSymbolInfo?.executionSettings
    ?.orderType || ["Market", "Limit"];

  const buttonClass =
    "h-9 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow-md dark:shadow-blue-500/20";
  const sectionClass =
    "space-y-4 md:p-6 bg-white dark:bg-gray-900 rounded-xl md:border border-gray-100 dark:border-gray-800";
  const labelClass =
    "text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2";

  const handleSave = async () => {
    //checks
    if (!selectedSymbol)
      return toast({
        title: "Please select a symbol first",
        variant: "destructive",
      });

    await updateStrategyMutation.mutateAsync({
      strategyName: strategy.strategyName,
      data: {
        settings: tranformToPayload(selectedSymbol || "", selectedTimeFrame, {
          strategyType,
          selectorState,
          selectedDays,
          selectedExp,
          productType,
          orderType,
          squareOffTime,
          entryOperation,
          exitOperation,
        }),
      },
    });

    onClose();
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="sm:max-w-xl p-0" side={"right"}>
        <div className="h-full border-l border-gray-200 dark:border-gray-800 overflow-y-auto bg-gray-50 dark:bg-gray-900">
          <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-800">
              <div className="flex items-center gap-3">
                <Settings2 className="w-5 h-5 text-blue-500" />
                <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  Settings - {strategy.strategyName}
                </h1>
              </div>
            </div>

            {!selectedSymbol && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Please select a symbol first to configure settings.
                </AlertDescription>
              </Alert>
            )}

            {/* Strategy Type Section */}
            <div className={sectionClass}>
              <div className="flex items-center justify-between">
                <span className={labelClass}>
                  <Briefcase className="w-4 h-4 text-gray-500" />
                  Strategy Type
                </span>
                <Button
                  onClick={() => {
                    setStrategyType(
                      strategyType === "Intraday" ? "Positional" : "Intraday"
                    );
                    if (strategyType === "Intraday") {
                      setProductType("Delivery");
                    }
                  }}
                  className={buttonClass}
                  disabled={!selectedSymbol}
                >
                  {strategyType}
                </Button>
              </div>
            </div>

            {/* Trade On Section */}
            <div className={sectionClass}>
              <div className="">
                <span className={labelClass}>
                  <Calendar className="w-4 h-4 text-gray-500" />
                  Trade On
                </span>
                <div className="flex justify-end mt-2">
                  <DaySelector
                    selectorState={selectorState}
                    setSelectorState={setSelectorState}
                    selectedDays={selectedDays}
                    setSelectedDays={setSelectedDays}
                    selectedExp={selectedExp}
                    setSelectedExp={setSelectedExp}
                  />
                </div>
              </div>
            </div>

            {/* Execution Section */}
            <div className={sectionClass}>
              <div className="flex items-center gap-2 mb-4">
                <LayoutGrid className="w-4 h-4 text-gray-500" />
                <h2 className="text-base font-medium text-gray-900 dark:text-gray-100">
                  Execution
                </h2>
              </div>

              <div className="space-y-4">
                {/* Product Type */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Product Type
                  </span>
                  <Button
                    onClick={() => {
                      const currentIndex =
                        availableProductTypes.indexOf(productType);
                      const nextIndex =
                        (currentIndex + 1) % availableProductTypes.length;
                      setProductType(availableProductTypes[nextIndex]);
                    }}
                    className={buttonClass}
                    disabled={
                      !selectedSymbol ||
                      availableProductTypes.length <= 1 ||
                      strategyType === "Positional"
                    }
                  >
                    {productType}
                  </Button>
                </div>

                {/* Order Type */}
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    Order Type
                  </span>
                  <Button
                    onClick={() => {
                      const currentIndex =
                        availableOrderTypes.indexOf(orderType);
                      const nextIndex =
                        (currentIndex + 1) % availableOrderTypes.length;
                      setOrderType(availableOrderTypes[nextIndex]);
                    }}
                    className={buttonClass}
                    disabled={!selectedSymbol}
                  >
                    {orderType}
                  </Button>
                </div>

                {/* Square-off time */}
                {strategyType === "Intraday" && (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                        Square-Off Time
                      </span>
                      <div className="flex gap-2 items-center">
                        <Select
                          value={squareOffTime}
                          onValueChange={(value: string) =>
                            setSquareOffTime(value)
                          }
                        >
                          <SelectTrigger className="w-full bg-white dark:bg-gray-900">
                            <SelectValue placeholder="Select time">
                              {squareOffTime || "Select time"}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {data?.data?.data?.map((segment: string) => (
                              <SelectItem key={segment} value={segment}>
                                {segment}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <div
                          className="cursor-pointer hover:text-red-700"
                          onClick={() => setSquareOffTime("")}
                        >
                          <X className="w-4 h-4" />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Operations */}
                {orderType === "Limit" && (
                  <div className="space-y-4 pt-2">
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Entry Order Operations
                      </h3>
                      <OrderOperation
                        type="entry"
                        disabled={!selectedSymbol}
                        operation={entryOperation}
                        onOperationChange={handleEntryOperationChange}
                      />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                        Exit Order Operations
                      </h3>
                      <OrderOperation
                        type="exit"
                        disabled={!selectedSymbol}
                        operation={exitOperation}
                        onOperationChange={handleExitOperationChange}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="p-6 w-full">
              <Button
                onClick={handleSave}
                className={"w-full bg-blue-600 hover:bg-blue-500 text-white"}
                disabled={!selectedSymbol || updateStrategyMutation.isPending}
              >
                {updateStrategyMutation.isPending ? "Saving..." : "Save"}
              </Button>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SettingSheet;

const tranformToPayload = (
  underlying: string,
  timeframe: number = 5,
  data: any
) => {
  const {
    strategyType,
    selectorState,
    selectedDays,
    selectedExp,
    productType,
    orderType,
    squareOffTime,
    entryOperation,
    exitOperation,
  } = data;
  // Transform trading days list based on selector state
  const getTradingDaysList = (): number[] => {
    switch (selectorState) {
      case "daily":
        return [];
      case "exp":
        //@ts-ignore
        return selectedExp.map((day) => -parseInt(day));
        case "days":
        //@ts-ignore
        return selectedDays.map((day) => {
          const dayMap: Record<string, number> = {
            Mon: 0,
            Tue: 1,
            Wed: 2,
            Thu: 3,
            Fri: 4,
          };
          return dayMap[day] || 0;
        });
      default:
        return [];
    }
  };

  // Transform operations by converting string values to numbers
  const transformOperation = (operation: typeof entryOperation) => {
    if (orderType === "Limit" && operation.shouldExecute) {
      return {
        timeLimit: parseInt(operation.timeLimit) || 0,
        shouldExecute: operation.shouldExecute,
        priceBuffer: parseFloat(operation.priceBuffer) || 0,
      };
    } else {
      return {};
    }
  };

  return {
    underlying,
    strategy_type: strategyType,
    timeframe: Number(timeframe),
    tradingDays:
      selectorState === "daily"
        ? "all"
        : selectorState === "exp"
        ? "exp"
        : "days",
    tradingDaysList: getTradingDaysList(),
    productType,
    entryOperation: transformOperation(entryOperation),
    exitOperation: transformOperation(exitOperation),
    orderType,
    ...( strategyType == "Intraday" ? {squareoffTime: squareOffTime || null} : {}),
  };
};

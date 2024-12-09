import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import DaySelector from "./DaySelector";
import { useSheetStore } from "@/lib/store/SheetStore";
import { X, Settings2, Calendar, Briefcase, LayoutGrid } from "lucide-react";
import OrderOperation from "./OrderOperation";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { useDataPointStore } from "@/lib/store/dataPointStore";

const SettingSheet = () => {
  const { closeSheet, type } = useSheetStore();
  const { symbolInfo, selectedSymbol } = useDataPointStore();
  
  // Get the current symbol's info
  const currentSymbolInfo = selectedSymbol ? symbolInfo[selectedSymbol] : null;
  
  const [strategyType, setStrategyType] = useState<"Intraday" | "Positional">("Intraday");
  const [productType, setProductType] = useState<"Intraday" | "Delivery">(
    (currentSymbolInfo?.executionSettings?.productType[0] as "Intraday" | "Delivery") || "Intraday"
  );
  const [orderType, setOrderType] = useState<"Limit" | "Market">(
    (currentSymbolInfo?.executionSettings?.orderType[0] as "Limit" | "Market") || "Limit"
  );

  // Available options from API or defaults
  const availableProductTypes = currentSymbolInfo?.executionSettings?.productType || ["Intraday", "Delivery"];
  const availableOrderTypes = currentSymbolInfo?.executionSettings?.orderType || ["Market", "Limit"];

  if (type !== "settings") return null;

  const buttonClass = "h-9 px-4 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-all duration-200 shadow-sm hover:shadow-md dark:shadow-blue-500/20";
  const sectionClass = "space-y-4 md:p-6 bg-white dark:bg-gray-900 rounded-xl md:border border-gray-100 dark:border-gray-800";
  const labelClass = "text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center gap-2";

  return (
    <div className="h-full md:w-[480px] w-full">
      <div className="h-full border-l border-gray-200 dark:border-gray-800 overflow-y-auto bg-gray-50 dark:bg-gray-900">
        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-800">
            <div className="flex items-center gap-3">
              <Settings2 className="w-5 h-5 text-blue-500" />
              <h1 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                Settings {selectedSymbol ? `- ${selectedSymbol}` : ''}
              </h1>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={closeSheet}
              className="rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <X className="w-5 h-5" />
            </Button>
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
                onClick={() => setStrategyType(prev => prev === "Intraday" ? "Positional" : "Intraday")}
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
                  // onStateChange={setTradeState}
                  // showDaysInDaily={true}
                  // disabled={!selectedSymbol}
                  // isWeekly={currentSymbolInfo?.isWeekly}
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
                    const currentIndex = availableProductTypes.indexOf(productType);
                    const nextIndex = (currentIndex + 1) % availableProductTypes.length;
                    setProductType(availableProductTypes[nextIndex] as "Intraday" | "Delivery");
                  }}
                  className={buttonClass}
                  disabled={!selectedSymbol || availableProductTypes.length <= 1}
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
                    const currentIndex = availableOrderTypes.indexOf(orderType);
                    const nextIndex = (currentIndex + 1) % availableOrderTypes.length;
                    setOrderType(availableOrderTypes[nextIndex] as "Limit" | "Market");
                  }}
                  className={buttonClass}
                  disabled={!selectedSymbol}
                >
                  {orderType}
                </Button>
              </div>

              {/* Operations */}
              {orderType === "Limit" && (
                <div className="space-y-4 pt-2">
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Entry Order Operations
                    </h3>
                    <OrderOperation type="entry" disabled={!selectedSymbol} />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                      Exit Order Operations
                    </h3>
                    <OrderOperation type="exit" disabled={!selectedSymbol} />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingSheet;
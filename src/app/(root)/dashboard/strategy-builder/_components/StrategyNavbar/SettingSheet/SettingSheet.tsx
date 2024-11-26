import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import DaySelector from "./DaySelector";
import OrderOperation from "./OrderOperaction";
import { useSheetStore } from "@/lib/store/SheetStore"; // Import the store

interface StrategyCodeSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingSheet = () => {
  const { isOpen, closeSheet, type } = useSheetStore(); // Use the sheet store

  const [strategyType, setStrategyType] = useState<"Intraday" | "Positional">(
    "Intraday"
  );
  const [productType, setProductType] = useState<"Intraday" | "Delivery">(
    "Intraday"
  );
  const [orderType, setOrderType] = useState<"Limit" | "Market">("Limit");
  const [tradeState, setTradeState] = useState<"days" | "daily" | "exp">(
    "days"
  );

  const toggleStrategy = () =>
    setStrategyType((prev) =>
      prev === "Intraday" ? "Positional" : "Intraday"
    );
  const toggleProduct = () =>
    setProductType((prev) => (prev === "Intraday" ? "Delivery" : "Intraday"));
  const toggleOrder = () =>
    setOrderType((prev) => (prev === "Limit" ? "Market" : "Limit"));

  const buttonClass =
    "transition-colors font-medium mt-0 bg-blue-500 hover:bg-blue-600 text-white";

  // Only render if the sheet type is 'settings'
  if (type !== "settings") return null;

  return (
    <div className="">
      <Sheet open={isOpen} onOpenChange={closeSheet}>
        <SheetContent
          side="right"
          className="w-full sm:max-w-[400px] bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800"
        >
          <div className="text-gray-900 dark:text-gray-100">
            {/* Title */}
            <div className="items-center flex font-medium justify-center text-2xl mt-6">
              <h1>Settings</h1>
            </div>

            <div className="mt-8 space-y-6">
              {/* Strategy Type */}
              <div className="flex justify-between items-center">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Strategy Type:{" "}
                </p>
                <Button
                  onClick={toggleStrategy}
                  variant="outline"
                  className={buttonClass}
                >
                  {strategyType}
                </Button>
              </div>

              {/* Trade On */}
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Trade On:{" "}
                </p>
                <div className="flex items-center gap-2">
                  <DaySelector
                    onStateChange={setTradeState}
                    showDaysInDaily={true}
                  />
                </div>
              </div>

              {/* Execution Section */}
              <div className="">
                <p className="text-sm font-medium mt-4 text-gray-700 dark:text-gray-300">
                  Execution
                </p>
                <div className="bg-gray-50 space-y-6 dark:bg-gray-800 mt-4 rounded-lg px-6 pt-3 pb-6">
                  {/* Product Type */}
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Product Type:{" "}
                    </p>
                    <Button
                      onClick={toggleProduct}
                      variant="outline"
                      className={buttonClass}
                    >
                      {productType}
                    </Button>
                  </div>

                  {/* Order Type */}
                  <div className="flex justify-between items-center">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Order Type:{" "}
                    </p>
                    <Button
                      onClick={toggleOrder}
                      variant="outline"
                      className={buttonClass}
                    >
                      {orderType}
                    </Button>
                  </div>

                  {/* Operations */}
                  {orderType === "Limit" && (
                    <>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Entry Order Operations
                        </p>
                        <div className="pl-0">
                          <OrderOperation type="entry" />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          Exit Order Operations
                        </p>
                        <div className="pl-0">
                          <OrderOperation type="exit" />
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default SettingSheet;

'use client'
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import DaySelector from "./DaySelector";
import OrderOperation from "./OrderOperaction";
import { useSheetStore } from "@/lib/store/SheetStore";

const SettingSheet = () => {
  const { isOpen, closeSheet, type } = useSheetStore();

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

  const toggleStrategy = () => {
    setStrategyType((prev) =>
      prev === "Intraday" ? "Positional" : "Intraday"
    );
  };

  const toggleProduct = () => {
    setProductType((prev) => (prev === "Intraday" ? "Delivery" : "Intraday"));
  };

  const toggleOrder = () => {
    setOrderType((prev) => (prev === "Limit" ? "Market" : "Limit"));
  };

  const buttonClass =
    "transition-colors font-medium mt-0 bg-blue-500 hover:bg-blue-600 text-white";

  if (type !== "settings") return null;

  return (
    <div
      className={`
        h-full w-[400px]
      `}
    >
      <div className="h-full border-l-2 overflow-y-auto">
        <div className="p-6 text-gray-900 dark:text-gray-100">
          {/* Close button */}
          <button
            onClick={closeSheet}
            className="absolute right-4 top-4 p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full"
            aria-label="Close settings"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>

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
                  onStateChange={(state) => {
                    setTradeState(state);
                  }}
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
                        <OrderOperation
                          type="entry"
                        // onComplete={closeSheet}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Exit Order Operations
                      </p>
                      <div className="pl-0">
                        <OrderOperation
                          type="exit"
                        // onComplete={closeSheet}
                        />
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingSheet;

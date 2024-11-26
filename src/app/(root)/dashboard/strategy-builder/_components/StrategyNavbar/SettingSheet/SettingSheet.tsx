import React, { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTheme } from "@/components/providers/theme-provider";
import { Highlight, themes } from "prism-react-renderer";
import { Button } from "@/components/ui/button";
import DaySelector from "./DaySelector";
import OrderOperaction from "./OrderOperaction";

interface StrategyCodeSheetProps {
  isOpen: boolean;
  onClose: () => void;
}

const SettingSheet = ({ isOpen, onClose }: StrategyCodeSheetProps) => {
  const { theme } = useTheme();
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

  // Toggle strategy type
  const strategyToggle = () => {
    setStrategyType((prev: string) =>
      prev === "Intraday" ? "Positional" : "Intraday"
    );
  };

  // Toggle Product type
  const productToggle = () => {
    setProductType((prev: string) =>
      prev === "Intraday" ? "Delivery" : "Intraday"
    );
  };

  // Toggle Order type
  const orderToggle = () => {
    setOrderType((prev: string) => (prev === "Limit" ? "Market" : "Limit"));
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent
        side="right"
        className=" sm:max-w-[380px] dark:bg-gray-900 overflow-y-auto"
      >
        <div className="text-gray-700 dark:text-gray-300">
          <div>
            <div className="items-center flex font-medium justify-center text-2xl mt-6">
              <h1>Settings</h1>
            </div>
          </div>
          <div className="">
            {/* Strategy Type */}
            <div className="mt-4 flex justify-between">
              <p>Strategy Type:</p>
              <Button onClick={strategyToggle}>
                {strategyType} {/* Button text changes based on state */}
              </Button>
            </div>
            {/* Tread On */}
            <div className="mt-2 flex items-center justify-between ">
              <p className="text-start">Trade On :</p>
              <div className="flex items-center gap-2">
                <DaySelector onStateChange={setTradeState} />
              </div>
            </div>
            {/* Execution Section */}
            <div className="mt-6">
              <p>Execution :</p>
              <div className="dark:bg-gray-800 bg-gray-100 mt-2 rounded-lg h-[400px]">
                {/* Product Type */}
                <div className="pt-6 flex justify-between">
                  <p className="ml-4">Strategy Type :</p>
                  <Button onClick={productToggle}>{productType}</Button>
                </div>
                {/* Order Type */}
                <div className="pt-3 flex justify-between  ">
                  <p className="ml-4">Order Type :</p>
                  <Button onClick={orderToggle}>{orderType}</Button>
                </div>
                {/* Entry Order Operations */}
                <div className="pt-3 flex justify-between ">
                  <p className="ml-4">Entry Order Operations :</p>
                  <OrderOperaction />
                </div>
                {/* Exit Order Operations */}
                <div className="pt-3 flex justify-between ">
                  <p className="ml-4">Exit Order Operations :</p>
                  <OrderOperaction />
                </div>
              </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default SettingSheet;

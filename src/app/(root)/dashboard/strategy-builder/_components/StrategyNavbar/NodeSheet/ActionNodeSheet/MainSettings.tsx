import React from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Position,
  TransactionType,
  Segment,
  OptionType,
  ExpirationType,
  PositionSettings,
} from "./types";
import { useDataPointStore } from "@/lib/store/dataPointStore";

interface MainSettingsProps {
  position: Position;
  onSettingChange: (
    id: string,
    field: keyof PositionSettings,
    value: any
  ) => void;
  currentSymbol: any;
}

const MainSettings: React.FC<MainSettingsProps> = ({
  position,
  onSettingChange,
  currentSymbol,
}) => {
  const { selectedSymbol, symbolInfo } = useDataPointStore();
  if (!selectedSymbol) return null;

  const currentSymbolInfo = symbolInfo[selectedSymbol];
  const availableExpiryTypes =
    position?.settings?.segment == "FUT"
      ? currentSymbolInfo?.FutExp
      : currentSymbolInfo?.OptExp;

  return (
    <div className="p-4 space-y-4">
      {/* First Row: Segment, Transaction, Option */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <Label className="text-xs font-medium text-gray-600 dark:text-gray-300">
            Segment
          </Label>
          <Select
            value={position.settings.segment}
            onValueChange={(value: Segment) =>
              onSettingChange(position.id, "segment", value)
            }
          >
            <SelectTrigger className="w-full bg-white dark:bg-gray-900">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {currentSymbol?.segments?.map((segment: string) => (
                <SelectItem key={segment} value={segment}>
                  {segment}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-xs font-medium text-gray-600 dark:text-gray-300">
            Transaction
          </Label>
          <Select
            value={position.settings.transactionType}
            onValueChange={(value: TransactionType) =>
              onSettingChange(position.id, "transactionType", value)
            }
          >
            <SelectTrigger className="w-full bg-white dark:bg-gray-900">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="buy">
                <span className="text-green-600 dark:text-green-400">BUY</span>
              </SelectItem>
              <SelectItem value="sell">
                <span className="text-red-600 dark:text-red-400">SELL</span>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {position.settings.segment === "OPT" && (
          <div className="space-y-2">
            <Label className="text-xs font-medium text-gray-600 dark:text-gray-300">
              Option Type
            </Label>
            <Select
              value={position.settings.optionType}
              onValueChange={(value: OptionType) =>
                onSettingChange(position.id, "optionType", value)
              }
            >
              <SelectTrigger className="w-full bg-white dark:bg-gray-900">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="CE">Call (CE)</SelectItem>
                <SelectItem value="PE">Put (PE)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Second Row: Quantity and Strike Selection */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label className="text-xs font-medium text-gray-600 dark:text-gray-300">
            Quantity
          </Label>
          <Input
            type="number"
            value={position.settings.qty}
            onChange={(e) =>
              onSettingChange(position.id, "qty", parseInt(e.target.value))
            }
            className="w-full bg-white dark:bg-gray-900"
            placeholder="Enter quantity"
          />
        </div>

        {position.settings.segment === "OPT" && (
          <div className="space-y-2">
            <Label className="text-xs font-medium text-gray-600 dark:text-gray-300">
              Strike Selection (Moneyness)
            </Label>
            <Select
              value={position.settings.strikeVal.toString()}
              onValueChange={(value) =>
                onSettingChange(position.id, "strikeVal", parseInt(value))
              }
            >
              <SelectTrigger className="w-full bg-white dark:bg-gray-900">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                  <SelectItem value="10">ITM 10</SelectItem> 
                  <SelectItem value="9">ITM 9</SelectItem>
                  <SelectItem value="8">ITM 8</SelectItem>
                  <SelectItem value="7">ITM 7</SelectItem>
                  <SelectItem value="6">ITM 6</SelectItem>
                  <SelectItem value="5">ITM 5</SelectItem>
                  <SelectItem value="4">ITM 4</SelectItem>
                  <SelectItem value="3">ITM 3</SelectItem>
                  <SelectItem value="2">ITM 2</SelectItem>
                  <SelectItem value="1">ITM 1</SelectItem>
                  <SelectItem value="0">ATM</SelectItem>
                  <SelectItem value="-1">OTM 1</SelectItem>
                  <SelectItem value="-2">OTM 2</SelectItem>
                  <SelectItem value="-3">OTM 3</SelectItem>
                  <SelectItem value="-4">OTM 4</SelectItem>
                  <SelectItem value="-5">OTM 5</SelectItem>
                  <SelectItem value="-6">OTM 6</SelectItem>
                  <SelectItem value="-7">OTM 7</SelectItem>
                  <SelectItem value="-8">OTM 8</SelectItem>
                  <SelectItem value="-9">OTM 9</SelectItem>
                  <SelectItem value="-10">OTM 10</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Third Row: Expiry Settings */}
      {(position.settings.segment === "OPT" ||
        position.settings.segment === "FUT") && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-xs font-medium text-gray-600 dark:text-gray-300">
              Expiry Type
            </Label>
            <Select
              value={position.settings.expType}
              onValueChange={(value: ExpirationType) =>
                onSettingChange(position.id, "expType", value)
              }
            >
              <SelectTrigger className="w-full bg-white dark:bg-gray-900">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(availableExpiryTypes).map((expiryType: string) => (
                  <SelectItem key={expiryType} value={expiryType}>
                    {expiryType}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-xs font-medium text-gray-600 dark:text-gray-300">
              Expiry Number
            </Label>
            <Select
              value={position.settings.expNo.toString()}
              onValueChange={(value) =>
                onSettingChange(position.id, "expNo", parseInt(value))
              }
            >
              <SelectTrigger className="w-full bg-white dark:bg-gray-900">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {/* @ts-ignore */}
                {availableExpiryTypes[position.settings.expType].map(
                  (expiryNo: number) => (
                    <SelectItem key={expiryNo} value={expiryNo.toString()}>
                      {`${expiryNo === 0 ? "Current" : `Next ${expiryNo}`}`}
                    </SelectItem>
                  )
                )}
              </SelectContent>
            </Select>
            {/* <Input
              type="number"
              value={position.settings.expNo}
              onChange={(e) =>
                onSettingChange(position.id, "expNo", parseInt(e.target.value))
              }
              min={0}
              className="w-full bg-white dark:bg-gray-900"
              placeholder="0 for current expiry"
            /> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default MainSettings;

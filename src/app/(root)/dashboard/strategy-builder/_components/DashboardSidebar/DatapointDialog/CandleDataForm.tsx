import React, { useState, useEffect } from "react";
import { WandSparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "@/components/ui/select";
import { useDataPointStore } from "@/lib/store/datapointStore";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { DataType, StrikeMode, StrikePosition, StrikeSelection } from "./types";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

// Constants
const CANDLE_TYPES = ["ohlc", "hlc"] as const;
const DURATION_DAYS = Array.from({ length: 11 }, (_, i) => i); // 0 to 10
const ITM_OTM_RANGE = Array.from({ length: 11 }, (_, i) => i); // 0 to 10

interface CandleDataFormProps {
  dataType: DataType;
  setDataType: (type: DataType) => void;
  onGenerateElementName: () => void;
  elementName: string;
}

export const CandleDataForm: React.FC<CandleDataFormProps> = ({
  dataType,
  setDataType,
  onGenerateElementName,
  elementName,
}) => {
  const { symbolInfo, selectedSymbol } = useDataPointStore();
  const currentSymbolInfo = selectedSymbol ? symbolInfo[selectedSymbol] : null;

  const [candleType, setCandleType] = useState<string>("ohlc");
  const [duration, setDuration] = useState<string>("2");
  const [expiryType, setExpiryType] = useState<"weekly" | "monthly">("weekly");
  const [expiryOrder, setExpiryOrder] = useState<string>("0");
  const [strikeSelection, setStrikeSelection] = useState<StrikeSelection>({
    mode: "at",
    position: "ATM"
  });

  // Effect to handle expiry type when data type changes
  useEffect(() => {
    if (dataType === "FUT") {
      setExpiryType("monthly");
    }
  }, [dataType]);

  if (!selectedSymbol || !currentSymbolInfo) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Please select a symbol first to configure data points.
        </AlertDescription>
      </Alert>
    );
  }

  const isWeeklyEnabled = currentSymbolInfo.isWeekly;
  const availableExpiryTypes = isWeeklyEnabled ? ["weekly", "monthly"] : ["monthly"];

  return (
    <div className="space-y-6">
      {/* Underlying and Time Frame row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Underlying:</label>
          <div className="rounded-lg bg-accent px-4 py-2 text-center text-muted-foreground">
            {selectedSymbol}
          </div>
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Time Frame:</label>
          <div className="rounded-lg bg-accent px-4 py-2 text-center text-muted-foreground">
            15m
          </div>
        </div>
      </div>

      {/* Data Type row */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Data Type:</label>
        <ToggleGroup
          className="border rounded-lg p-1 justify-start"
          type="single"
          value={dataType}
          onValueChange={(value: any) => value && setDataType(value)}
        >
          <ToggleGroupItem value="SPOT" className="flex-1">SPOT</ToggleGroupItem>
          <ToggleGroupItem value="FUT" className="flex-1">FUT</ToggleGroupItem>
          <ToggleGroupItem value="OPT" className="flex-1">OPT</ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Candle Type and Duration row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Candle Type:</label>
          <Select value={candleType} onValueChange={setCandleType}>
            <SelectTrigger className="text-base h-11">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {CANDLE_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  Candle ({type})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Duration:</label>
          <Select value={duration} onValueChange={setDuration}>
            <SelectTrigger className="text-base h-11">
              <SelectValue placeholder="Select duration" />
            </SelectTrigger>
            <SelectContent>
              {DURATION_DAYS.map((day) => (
                <SelectItem key={day} value={day.toString()}>
                  {day} {day === 1 ? 'Day' : 'Days'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Conditional Expiry Fields */}
      {(dataType === "FUT" || dataType === "OPT") && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Expiry:</label>
            <div className="flex gap-2">
              <Select
                value={dataType === "FUT" ? "monthly" : expiryType}
                onValueChange={(value: any) => value && setExpiryType(value)}
                disabled={dataType === "FUT"}
              >
                <SelectTrigger className="flex-1 text-base h-11">
                  <SelectValue placeholder="Select expiry" />
                </SelectTrigger>
                <SelectContent>
                  {(dataType === "FUT"
                    ? ["monthly"]
                    : availableExpiryTypes
                  ).map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={expiryOrder} onValueChange={setExpiryOrder}>
                <SelectTrigger className="flex-1 text-base h-11">
                  <SelectValue placeholder="Select order" />
                </SelectTrigger>
                <SelectContent>
                  {dataType === "FUT"
                    ? currentSymbolInfo.FutExp.monthly.map((order) => (
                      <SelectItem key={order} value={order.toString()}>
                        {order === 0 ? 'Current' : order === 1 ? 'Next' : `Next ${order}`}
                      </SelectItem>
                    ))
                    : expiryType === 'monthly'
                      ? currentSymbolInfo.OptExp.monthly.map((order) => (
                        <SelectItem key={order} value={order.toString()}>
                          {order === 0 ? 'Current' : order === 1 ? 'Next' : `Next ${order}`}
                        </SelectItem>
                      ))
                      : currentSymbolInfo.OptExp.weekly?.map((order) => (
                        <SelectItem key={order} value={order.toString()}>
                          {order === 0 ? 'Current' : order === 1 ? 'Next' : `Next ${order}`}
                        </SelectItem>
                      ))
                  }
                </SelectContent>
              </Select>
            </div>
          </div>


          {/* Strike Selection for Options only */}
          {dataType === "OPT" && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Strike Selection:</label>
              <div className="flex gap-2">
                <Select
                  value={strikeSelection.mode}
                  onValueChange={(value: StrikeMode) =>
                    setStrikeSelection(prev => ({ ...prev, mode: value }))
                  }
                >
                  <SelectTrigger className="flex-1 text-base h-11">
                    <SelectValue placeholder="Select strike" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="at">Strike at</SelectItem>
                    <SelectItem value="near">Strike near</SelectItem>
                  </SelectContent>
                </Select>
                <Select
                  value={strikeSelection.position}
                  onValueChange={(value: StrikePosition) =>
                    setStrikeSelection(prev => ({ ...prev, position: value }))
                  }
                >
                  <SelectTrigger className="flex-1 text-base h-11">
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ATM">ATM</SelectItem>
                    <SelectGroup>
                      <SelectLabel>ITM</SelectLabel>
                      {ITM_OTM_RANGE.map((num) => (
                        <SelectItem key={`itm-${num}`} value={`ITM_${num}`}>
                          ITM {num}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                    <SelectGroup>
                      <SelectLabel>OTM</SelectLabel>
                      {ITM_OTM_RANGE.map((num) => (
                        <SelectItem key={`otm-${num}`} value={`OTM_${num}`}>
                          OTM {num}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Element Name */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Element Name:</label>
        <div className="relative">
          <Input
            value={elementName}
            className="rounded-lg bg-accent pr-10"
            readOnly
          />
          <Button
            size="icon"
            variant="ghost"
            className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-accent"
            onClick={onGenerateElementName}
          >
            <WandSparkles className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
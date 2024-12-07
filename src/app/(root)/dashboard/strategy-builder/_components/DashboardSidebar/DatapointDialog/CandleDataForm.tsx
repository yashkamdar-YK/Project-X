import React, { useState } from "react";
import { WandSparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  CANDLE_TYPES,
  DURATION_DAYS,
  STRIKE_TYPES,
  ITM_OTM_RANGE,
  EXPIRY_TYPES,
  EXPIRY_ORDERS
} from "./constants";
import { CandleDataFormProps, StrikeType } from "./types";

type StrikeMode = "at" | "near";
type StrikePosition = "ATM" | "ITM" | "OTM";

interface StrikeSelection {
  mode: StrikeMode;
  position: StrikePosition;
}


export const CandleDataForm: React.FC<CandleDataFormProps> = ({
  dataType,
  setDataType,
  onGenerateElementName,
  elementName,
}) => {
  const [candleType, setCandleType] = useState("ohlc");
  const [duration, setDuration] = useState("2");
  const [expiryType, setExpiryType] = useState("weekly");
  const [expiryOrder, setExpiryOrder] = useState("first");
  const [strikeSelection, setStrikeSelection] = useState<StrikeSelection>({
    mode: "at",
    position: "ATM"
  });

  return (
    <div className="space-y-6">
      {/* Underlying and Time Frame row */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Underlying:</label>
          <div className="rounded-lg bg-accent px-4 py-2 text-center text-muted-foreground">
            NIFTY
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
            <SelectTrigger>
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
            <SelectTrigger>
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
                value={expiryType}
                onValueChange={setExpiryType}
                disabled={dataType === "FUT"} // Disabled for futures - only monthly
              >
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select expiry" />
                </SelectTrigger>
                <SelectContent>
                  {EXPIRY_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={expiryOrder} onValueChange={setExpiryOrder}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="Select order" />
                </SelectTrigger>
                <SelectContent>
                  {EXPIRY_ORDERS.map((order) => (
                    <SelectItem key={order} value={order}>{order}</SelectItem>
                  ))}
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
                  <SelectTrigger className="flex-1">
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
                  <SelectTrigger className="flex-1">
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ATM">ATM</SelectItem>
                    <SelectItem value="ITM">ITM</SelectItem>
                    <SelectItem value="OTM">OTM</SelectItem>
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
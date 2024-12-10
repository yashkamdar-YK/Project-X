import React, { useState, useEffect } from "react";
import { WandSparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, SelectGroup, SelectLabel } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { DataType, StrikeMode, StrikePosition, DataPoint } from "./types";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useDataPointStore } from "@/lib/store/dataPointStore";

// Constants
const CANDLE_TYPES = ["candlestick", "heikenashi"] as const;
const DURATION_DAYS = Array.from({ length: 11 }, (_, i) => i);
const ITM_OTM_RANGE = Array.from({ length: 11 }, (_, i) => i);

interface CandleDataFormProps {
  initialData?: DataPoint;
  onSave: (data: Partial<DataPoint>) => void;
  onClose?: () => void;
}

export const CandleDataForm: React.FC<CandleDataFormProps> = ({
  initialData,
  onSave,
  onClose
}) => {
  const { symbolInfo, selectedSymbol } = useDataPointStore();
  const currentSymbolInfo = selectedSymbol ? symbolInfo[selectedSymbol] : null;

  const [formData, setFormData] = useState({
    dataType: initialData?.dataType || "SPOT" as DataType,
    candleType: initialData?.candleType || "candlestick",
    duration: initialData?.duration || "2",
    expiryType: initialData?.expiryType || "weekly",
    expiryOrder: initialData?.expiryOrder || "0",
    elementName: initialData?.elementName || `spotNF_ohlc_2d`,
    strikeSelection: initialData?.strikeSelection || {
      mode: "at" as StrikeMode,
      position: "ATM" as StrikePosition
    }
  });

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  useEffect(() => {
    if (formData.dataType === "FUT") {
      updateFormData("expiryType", "monthly");
    }
  }, [formData.dataType]);

  const handleGenerateElementName = () => {
    const prefix = formData.dataType.toLowerCase();
    const timestamp = Date.now().toString().slice(-4);
    const newName = `${prefix}NF_${timestamp}`;
    updateFormData("elementName", newName);
  };

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

  const handleSubmit = () => {
    const formDataToSubmit = {
      elementName: formData.elementName,
      dataType: formData.dataType,
      candleType: formData.candleType,
      duration: formData.duration,
      expiryType: 
        formData.dataType === "SPOT" ? undefined : formData.expiryType,
      expiryOrder: 
        formData.dataType === "SPOT" ? undefined : formData.expiryOrder,
      strikeSelection: 
        formData.dataType === "OPT" ? formData.strikeSelection : undefined,
      type: "candle-data"
    };
  
    //@ts-ignore
    onSave(formDataToSubmit);
  };

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
          value={formData.dataType}
          onValueChange={(value: any) => value && updateFormData("dataType", value)}
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
          <Select 
            value={formData.candleType} 
            onValueChange={(value) => updateFormData("candleType", value)}
          >
            <SelectTrigger className="text-base h-11">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {CANDLE_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Duration:</label>
          <Select 
            value={formData.duration} 
            onValueChange={(value) => updateFormData("duration", value)}
          >
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
      {(formData.dataType === "FUT" || formData.dataType === "OPT") && (
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Expiry:</label>
            <div className="flex gap-2">
              <Select
                value={formData.dataType === "FUT" ? "monthly" : formData.expiryType}
                onValueChange={(value: any) => updateFormData("expiryType", value)}
                disabled={formData.dataType === "FUT"}
              >
                <SelectTrigger className="flex-1 text-base h-11">
                  <SelectValue placeholder="Select expiry" />
                </SelectTrigger>
                <SelectContent>
                  {(formData.dataType === "FUT"
                    ? ["monthly"]
                    : availableExpiryTypes
                  ).map((type) => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select 
                value={formData.expiryOrder}
                onValueChange={(value) => updateFormData("expiryOrder", value)}
              >
                <SelectTrigger className="flex-1 text-base h-11">
                  <SelectValue placeholder="Select order" />
                </SelectTrigger>
                <SelectContent>
                  {formData.dataType === "FUT"
                    ? currentSymbolInfo.FutExp.monthly.map((order) => (
                      <SelectItem key={order} value={order.toString()}>
                        {order === 0 ? 'Current' : order === 1 ? 'Next' : `Next ${order}`}
                      </SelectItem>
                    ))
                    : formData.expiryType === 'monthly'
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
          {formData.dataType === "OPT" && (
            <div className="space-y-2">
              <label className="text-sm font-medium">Strike Selection:</label>
              <div className="flex gap-2">
                <Select
                  value={formData.strikeSelection.mode}
                  onValueChange={(value: StrikeMode) =>
                    updateFormData("strikeSelection", { ...formData.strikeSelection, mode: value })
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
                  value={formData.strikeSelection.position}
                  onValueChange={(value: StrikePosition) =>
                    updateFormData("strikeSelection", { ...formData.strikeSelection, position: value })
                  }
                >
                  <SelectTrigger className="flex-1 text-base h-11">
                    <SelectValue placeholder="Select position" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectLabel>ITM</SelectLabel>
                      {ITM_OTM_RANGE.map((num) => (
                        <SelectItem key={`itm-${num}`} value={`ITM_${num}`}>
                          ITM {num}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                    <SelectItem value="ATM">ATM</SelectItem>
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
            value={formData.elementName}
            onChange={(e) => updateFormData("elementName", e.target.value)}
            className="rounded-lg bg-accent pr-10"
          />
          <Button
            size="icon"
            variant="ghost"
            className="absolute right-2 top-1/2 -translate-y-1/2 hover:bg-accent"
            onClick={handleGenerateElementName}
          >
            <WandSparkles className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-2 mt-6">
        {onClose && (
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        )}
        <Button onClick={handleSubmit}>
          {initialData ? 'Update' : 'Add'}
        </Button>
      </div>
    </div>
  );
};
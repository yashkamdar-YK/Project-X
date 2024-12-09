import React, { useState, useMemo, useEffect } from "react";
import { Search, WandSparkles, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InitialOptions } from "./InitialOptions";
import { CandleDataForm } from "./CandleDataForm";
import { DATA_POINT_OPTIONS } from "./constants";
import {
  DataPointDialogProps,
  DataType,
  SelectedOption,
  DataPoint,
  StrikeSelection,
} from "./types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useDataPointsStore } from "@/lib/store/dataPointsStore";
import { log } from "console";

export function DataPointDialog({
  open,
  onOpenChange,
  initialDataPoint,
}: DataPointDialogProps) {
  const [selectedOption, setSelectedOption] = useState<SelectedOption>(null);
  const [dataType, setDataType] = useState<DataType>("SPOT");
  const [searchQuery, setSearchQuery] = useState("");
  const [elementName, setElementName] = useState("spotNF_ohlc_2d");
  const [expiryType, setExpiryType] = useState("weekly");
  const [expiryOrder, setExpiryOrder] = useState("0");
  const [candleType, setCandleType] = useState("ohlc");
  const [duration, setDuration] = useState("2");
  const [strikeSelection, setStrikeSelection] = useState<StrikeSelection>({
    mode: "at",
    position: "ATM",
  });

  const addDataPoint = useDataPointsStore((state) => state.addDataPoint);
  const updateDataPoint = useDataPointsStore((state) => state.updateDataPoint);

  // Effect to populate form when editing
  useEffect(() => {
    if (initialDataPoint) {
      setSelectedOption(initialDataPoint.type as SelectedOption);
      setSearchQuery(
        DATA_POINT_OPTIONS.find((item) => item.option === initialDataPoint.type)
          ?.title || ""
      );
      if (initialDataPoint.type === "candle-data") {
        setDataType(initialDataPoint.dataType || "SPOT");
        setElementName(initialDataPoint.elementName);
        setCandleType(initialDataPoint.candleType || "ohlc");
        setDuration(initialDataPoint.duration || "2");
        setExpiryType(initialDataPoint.expiryType || "weekly");
        setExpiryOrder(initialDataPoint.expiryOrder || "0");
        setStrikeSelection(
          initialDataPoint.strikeSelection || { mode: "at", position: "ATM" }
        );
      } else if (initialDataPoint.type === "days-to-expire") {
        setExpiryType(initialDataPoint.expiryType || "weekly");
        setExpiryOrder(initialDataPoint.expiryOrder || "0");
      }
    }
  }, [initialDataPoint]);

  const filteredOptions = useMemo(() => {
    return DATA_POINT_OPTIONS.filter((option) =>
      option.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleOptionSelect = (option: SelectedOption) => {
    setSelectedOption(option);
    setSearchQuery(
      DATA_POINT_OPTIONS.find((item) => item.option === option)?.title || ""
    );
  };

  const handleSearchClear = () => {
    setSearchQuery("");
    setSelectedOption(null);
    setDataType("SPOT");
  };

  const handleGenerateElementName = () => {
    const prefix = dataType.toLowerCase();
    const timestamp = Date.now().toString().slice(-4);
    const newName = `${prefix}NF_${timestamp}`;
    setElementName(newName);
  };

  // Update handleSaveDataPoint
  const handleSaveDataPoint = () => {
    const dataPoint: DataPoint =
      selectedOption === "candle-data"
        ? {
            id: initialDataPoint?.id || Date.now().toString(),
            type: "candle-data",
            dataType,
            elementName,
            candleType,
            duration,
            expiryType,
            expiryOrder,
            strikeSelection,
          }
        : {
            id: initialDataPoint?.id || Date.now().toString(),
            type: "days-to-expire",
            elementName: "dte",
            expiryType,
            expiryOrder,
          };

    if (initialDataPoint) {
      updateDataPoint(initialDataPoint.id, dataPoint);
    } else {
      addDataPoint(dataPoint);
    }

    handleSearchClear();
    onOpenChange(false);
    // console.log("Data of Symbole",candleType, duration, expiryType, expiryOrder);
  };

  const renderDaysToExpire = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Underlying:</label>
          <div className="rounded-lg bg-accent px-4 py-2 text-center">
            NIFTY
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Expiry:</label>
          <div className="flex gap-2">
            <Select value={expiryType} onValueChange={setExpiryType}>
              <SelectTrigger className="text-base h-11">
                <SelectValue placeholder="Select expiry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
            <Select value={expiryOrder} onValueChange={setExpiryOrder}>
              <SelectTrigger className="text-base h-11">
                <SelectValue placeholder="Select order" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">Current</SelectItem>
                <SelectItem value="1">Next</SelectItem>
                <SelectItem value="2">Next 2</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Element Name:</label>
        <div className="relative">
          <Input value="dte" className="rounded-lg bg-accent pr-10" readOnly />
          <Button
            size="icon"
            variant="ghost"
            className="absolute right-2 top-1/2 -translate-y-1/2"
            onClick={handleGenerateElementName}
          >
            <WandSparkles className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Alert>
        <AlertDescription>
          Selected Expiry date is compared with current date to find the days to
          expiry. Holidays and events are ignored while calculating Days to
          Expiry.
        </AlertDescription>
      </Alert>
    </div>
  );

  const renderContent = () => {
    switch (selectedOption) {
      case "candle-data":
        return (
          <CandleDataForm
            dataType={dataType}
            setDataType={setDataType}
            onGenerateElementName={handleGenerateElementName}
            elementName={elementName}
            candleType={candleType}
            setCandleType={setCandleType}
            duration={duration}
            setDuration={setDuration}
            expiryType={expiryType}
            setExpiryType={setExpiryType}
            expiryOrder={expiryOrder}
            setExpiryOrder={setExpiryOrder}
            strikeSelection={strikeSelection}
            setStrikeSelection={setStrikeSelection}
          />
        );
      case "days-to-expire":
        return renderDaysToExpire();
      default:
        return (
          <InitialOptions
            onSelect={handleOptionSelect}
            filteredOptions={filteredOptions}
          />
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {initialDataPoint ? "Edit Data" : "Add Data"}
          </DialogTitle>
        </DialogHeader>

        <div className="relative mb-6">
          {initialDataPoint ? (
            "Save"
          ) : (
            <div>
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                className="pl-9 pr-9 rounded-full"
                placeholder="Search"
                value={searchQuery}
                disabled={selectedOption !== null}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <Button
                  size="icon"
                  variant="ghost"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={handleSearchClear}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          )}
        </div>

        {renderContent()}

        {selectedOption && (
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveDataPoint}>
              {initialDataPoint ? "Save" : "Add"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default DataPointDialog;

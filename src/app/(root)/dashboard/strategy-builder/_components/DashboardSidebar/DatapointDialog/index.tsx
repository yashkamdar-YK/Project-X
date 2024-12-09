import React, { useState, useMemo } from "react";
import { Search, WandSparkles, X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { InitialOptions } from "./InitialOptions";
import { CandleDataForm } from "./CandleDataForm";
import { DATA_POINT_OPTIONS } from "./constants";
import { DataPointDialogProps, DataType, SelectedOption, DataPoint } from "./types";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDataPointsStore } from "@/lib/store/dataPointsStore";

export function DataPointDialog({ open, onOpenChange }: DataPointDialogProps) {
  const [selectedOption, setSelectedOption] = useState<SelectedOption>(null);
  const [dataType, setDataType] = useState<DataType>("SPOT");
  const [searchQuery, setSearchQuery] = useState("");
  const [elementName, setElementName] = useState("spotNF_ohlc_2d");
  const [expiryType, setExpiryType] = useState("weekly");
  const [expiryOrder, setExpiryOrder] = useState("0");

  const addDataPoint = useDataPointsStore((state) => state.addDataPoint);

  const filteredOptions = useMemo(() => {
    return DATA_POINT_OPTIONS.filter(option => 
      option.title.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const handleOptionSelect = (option: SelectedOption) => {
    setSelectedOption(option);
    setSearchQuery(DATA_POINT_OPTIONS.find(item => item.option === option)?.title || "");
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

  const handleSaveDataPoint = () => {
    if (selectedOption === "candle-data") {
      // Get form data from CandleDataForm via ref or state
      const newDataPoint: DataPoint = {
        id: Date.now().toString(),
        type: "candle-data",
        dataType,
        elementName,
      };
      addDataPoint(newDataPoint);
    } else if (selectedOption === "days-to-expire") {
      const newDataPoint: DataPoint = {
        id: Date.now().toString(),
        type: "days-to-expire",
        elementName: "dte",
        expiryType,
        expiryOrder,
      };
      addDataPoint(newDataPoint);
    }

    handleSearchClear();
    onOpenChange(false);
  };

  const renderDaysToExpire = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Underlying:</label>
          <div className="rounded-lg bg-accent px-4 py-2 text-center">NIFTY</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Expiry:</label>
          <div className="flex gap-2">
            <Select value={expiryType} onValueChange={setExpiryType}>
              <SelectTrigger>
                <SelectValue placeholder="Select expiry" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
            <Select value={expiryOrder} onValueChange={setExpiryOrder}>
              <SelectTrigger>
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
          <Input 
            value="dte" 
            className="rounded-lg bg-accent pr-10" 
            readOnly 
          />
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
          Selected Expiry date is compared with current date to find the days to expiry.
          Holidays and events are ignored while calculating Days to Expiry.
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
          <DialogTitle className="text-2xl font-bold">Add Data</DialogTitle>
        </DialogHeader>
        
        <div className="relative mb-6">
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

        {renderContent()}

        {selectedOption && (
          <div className="flex justify-end gap-2 mt-6">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveDataPoint}>
              Add
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default DataPointDialog;
import React, { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DataPoint, SelectedOption } from "./types";
import { useDataPointsStore } from "@/lib/store/dataPointsStore";
import { CandleDataForm } from "./CandleDataForm";
import DaysToExpire from "./DaysToExpire";
import { InitialOptions } from "./InitialOptions";
import { DATA_POINT_OPTIONS } from "./constants";

interface DataPointDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingDataPoint?: DataPoint;
}

// Define a type for the form data
type DataPointFormData = {
  elementName: string;
  dataType?: DataPoint['dataType'];
  candleType?: DataPoint['candleType'];
  duration?: DataPoint['duration'];
  expiryType?: DataPoint['expiryType'];
  expiryOrder?: DataPoint['expiryOrder'];
  strikeSelection?: DataPoint['strikeSelection'];
};

export function DataPointDialog({ 
  open, 
  onOpenChange,
  editingDataPoint 
}: DataPointDialogProps) {
  const addDataPoint = useDataPointsStore((state) => state.addDataPoint);
  const updateDataPoint = useDataPointsStore((state) => state.updateDataPoint);

  const [selectedOption, setSelectedOption] = useState<SelectedOption>(
    editingDataPoint?.type || null
  );

  const handleOptionSelect = (option: SelectedOption) => {
    setSelectedOption(option);
  };

  const handleSave = (formData: DataPointFormData) => {
    if (editingDataPoint) {
      // Update existing data point with partial data
      updateDataPoint(editingDataPoint.id, formData);
    } else if (selectedOption) {
      // Create new data point with complete data
      const newDataPoint: DataPoint = {
        id: Date.now().toString(),
        type: selectedOption,
        elementName: formData.elementName,
        dataType: formData.dataType,
        candleType: formData.candleType,
        duration: formData.duration,
        expiryType: formData.expiryType,
        expiryOrder: formData.expiryOrder,
        strikeSelection: formData.strikeSelection
      };
      addDataPoint(newDataPoint);
    }
    handleClose();
  };

  const handleClose = () => {
    setSelectedOption(null);
    onOpenChange(false);
  };

  const renderContent = () => {
    // When editing, show the appropriate form directly
    if (editingDataPoint) {
      return editingDataPoint.type === "candle-data" ? (
        <CandleDataForm
          initialData={editingDataPoint}
          //@ts-ignore
          onSave={handleSave}
          onClose={handleClose}
        />
      ) : (
        <DaysToExpire
          initialData={editingDataPoint}
          //@ts-ignore
          onSave={handleSave}
          onClose={handleClose}
        />
      );
    }

    // When creating new, show options first then form
    if (!selectedOption) {
      return (
        <InitialOptions
          onSelect={handleOptionSelect}
          filteredOptions={DATA_POINT_OPTIONS.filter(opt => !opt.comingSoon)}
        />
      );
    }

    return selectedOption === "candle-data" ? (
      <CandleDataForm
      //@ts-ignore
        onSave={handleSave}
        onClose={handleClose}
      />
    ) : (
      <DaysToExpire
      //@ts-ignore
        onSave={handleSave}
        onClose={handleClose}
      />
    );
  };

  return (
    <Dialog 
      open={open} 
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          setSelectedOption(null);
        }
        onOpenChange(isOpen);
      }}
    >
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">
            {editingDataPoint ? 'Edit Data Point' : 'Add Data Point'}
          </DialogTitle>
        </DialogHeader>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
}
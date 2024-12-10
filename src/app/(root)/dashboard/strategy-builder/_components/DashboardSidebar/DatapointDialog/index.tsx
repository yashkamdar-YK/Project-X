import React, { useState, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DataPoint, DataType, SelectedOption } from "./types";
import { useDataPointsStore } from "@/lib/store/dataPointsStore";
import { CandleDataForm } from "./CandleDataForm";
import DaysToExpire from "./DaysToExpire";
import { InitialOptions } from "./InitialOptions";
import { DATA_POINT_OPTIONS } from "../constants";
import { useMutation } from "@tanstack/react-query";
import { symbolService } from "../../../_actions";
import { toast } from "@/hooks/use-toast";

interface DataPointDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingDataPoint?: DataPoint;
}

// Define a type for the form data
// type DataPointFormData = DataPoint & {
//   elementName: string;
// };

export function DataPointDialog({ 
  open, 
  onOpenChange,
  editingDataPoint 
}: DataPointDialogProps) {
  const addDataPoint = useDataPointsStore((state) => state.addDataPoint);
  const updateDataPoint = useDataPointsStore((state) => state.updateDataPoint);

  const getCandleOptions = useMutation({
    mutationFn: (dataType:DataType) => symbolService.getCandleDataPointsOptions(dataType),
    mutationKey: ['dataPointOptions' + editingDataPoint?.dataType],
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch data points options',
        variant:"destructive"
      })
    }
  })
  const getDTEDataPointsOptions = useMutation({
    mutationFn: () => symbolService.getDTEDataPointsOptions(),
    mutationKey: ['dataPointOptions' + editingDataPoint?.dataType],
    onError: (error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to fetch data points options',
        variant:"destructive"
      })
    }
  })

  const [selectedOption, setSelectedOption] = useState<SelectedOption>(
    editingDataPoint?.type || null
  );

  const handleOptionSelect = (option: SelectedOption) => {
    setSelectedOption(option);
  };

  const handleSave = async (formData: DataPoint) => {
    if (editingDataPoint) {
      // Update existing data point with partial data
      updateDataPoint(editingDataPoint.id, formData);
      //@ts-ignore
      const res= formData.type == 'candle-data' ? await getCandleOptions.mutateAsync(formData?.dataType) : await getDTEDataPointsOptions.mutateAsync();
      const updatedDataPoint = {
        ...formData,
        options: res
      }
      updateDataPoint(editingDataPoint.id, updatedDataPoint);
    } else if (selectedOption) {
      const newId = Date.now().toString();
      // Create new data point with complete data
      const newDataPoint: DataPoint = {
        id: newId,
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
      //@ts-ignore
      const res= formData.type == 'candle-data' ? await getCandleOptions.mutateAsync(formData?.dataType) : await getDTEDataPointsOptions.mutateAsync();
      const updatedDataPoint = {
        ...newDataPoint,
        options: res
      }
      updateDataPoint(newId, updatedDataPoint);
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
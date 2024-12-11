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
import { Search } from "lucide-react";

interface DataPointDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingDataPoint?: DataPoint;
}

export function DataPointDialog({ 
  open, 
  onOpenChange,
  editingDataPoint 
}: DataPointDialogProps) {
  // Move all hooks to the top level
  const [searchValue, setSearchValue] = useState("");
  const [selectedOption, setSelectedOption] = useState<SelectedOption>(
    editingDataPoint?.type || null
  );

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
  });

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
  });

  // Memoize filtered options
  const filteredOptions = useMemo(() => {
    return DATA_POINT_OPTIONS.filter(option =>
      option.title.toLowerCase().includes(searchValue.toLowerCase()) ||
      option.option?.toLowerCase().includes(searchValue.toLowerCase())
    );
  }, [searchValue]);

  const handleOptionSelect = (option: SelectedOption) => {
    setSelectedOption(option);
  };

  const handleSave = async (formData: DataPoint) => {
    if(!formData?.dataType){
      return toast({
        title: 'Error',
        description: 'Please select a data type',
        variant:"destructive"
      })
    };

    if (editingDataPoint) {
      updateDataPoint(editingDataPoint.id, formData);
      const res = formData.type === 'candle-data' 
        ? await getCandleOptions.mutateAsync(formData?.dataType) 
        : await getDTEDataPointsOptions.mutateAsync();
      const updatedDataPoint = {
        ...formData,
        options: res
      }
      updateDataPoint(editingDataPoint.id, updatedDataPoint);
    } else if (selectedOption) {
      const newId = Date.now().toString();
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
      const res = formData.type === 'candle-data' 
        ? await getCandleOptions.mutateAsync(formData?.dataType) 
        : await getDTEDataPointsOptions.mutateAsync();
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
    setSearchValue(""); // Reset search when closing
    onOpenChange(false);
  };

  const renderContent = () => {
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

    if (!selectedOption) {
      return (
        <div>
          <div className="relative mb-4">
            <input
              type="text"
              placeholder="Search options..."
              className="w-full p-2 pl-10 rounded-lg border bg-white dark:bg-gray-800 
                       border-gray-300 dark:border-gray-700 
                       text-gray-900 dark:text-white 
                       placeholder-gray-500 dark:placeholder-gray-400
                       focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
            />
            <Search 
              size={20} 
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400" 
            />
          </div>
          <InitialOptions
            onSelect={handleOptionSelect}
            filteredOptions={filteredOptions}
          />
        </div>
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
          setSearchValue(""); // Reset search when dialog closes
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
import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useDataPointStore } from "@/lib/store/dataPointStore";
import { WandSparkles } from "lucide-react";
import { DataPoint } from './types';
import { AlertCircle } from 'lucide-react';
import Spinner from '@/components/shared/spinner';
import { generateDTEName } from '../../../_utils/elementNaming';

interface DaysToExpireProps {
  initialData?: DataPoint;
  onSave: (data: Partial<DataPoint>) => void;
  onClose?: () => void;
  isLoading: boolean;
}

const DaysToExpire = ({
  initialData,
  onSave,
  onClose,
  isLoading = false
}: DaysToExpireProps) => {
  const { symbolInfo, selectedSymbol } = useDataPointStore();
  const currentSymbolInfo = selectedSymbol ? symbolInfo[selectedSymbol] : null;

  // Initialize form data with default values
  const [formData, setFormData] = useState({
    expiryType: initialData?.expiryType || "weekly",
    expiryOrder: initialData?.expiryOrder || "0",
    elementName: initialData 
      ? initialData.elementName 
      : "dte_weekly_0",
      type: "days-to-expire"
  });


    // Helper function to update form data state
  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };  

  // Check if weekly expiry is enabled for the selected symbol
  const isWeeklyEnabled = currentSymbolInfo?.isWeekly;

  useEffect(() => {
    if (!isWeeklyEnabled && formData.expiryType === "weekly") {
      updateFormData("expiryType", "monthly");
    }
  }, [isWeeklyEnabled]);

  // Regenerate element name when expiry type changes
  useEffect(() => {
    if (!!initialData?.elementName) return
      const newName = generateDTEName(formData);
      updateFormData("elementName", newName);
  }, [formData?.expiryType, formData?.expiryOrder]);

    // Handle form submission and pass data back to parent
    const handleSubmit = () => {
      const formDataToSubmit = {
        elementName: formData.elementName,
        expiryType: formData.expiryType,
        expiryOrder: formData.expiryOrder,
        type: "days-to-expire"
      };
    
      //@ts-ignore
      onSave(formDataToSubmit);
    };

    // Manually regenerate element name
  const handleGenerateElementName = () => {
    const newName = generateDTEName(formData);
    updateFormData("elementName", newName);
  };
  

  // If no symbol is selected, show an alert message
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

  return (
    <div className="space-y-6">
       {/* Display Selected Symbol */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Underlying:</label>
          <div className="rounded-lg bg-accent px-4 py-2 text-center">
            {selectedSymbol}
          </div>
        </div>
      </div>

      {/* Expiry Type and Order Selection */}
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Expiry:</label>
          <div className="flex gap-2">
            <Select 
              value={formData.expiryType} 
              onValueChange={(value) => updateFormData("expiryType", value)}
            >
              <SelectTrigger className="text-base h-11">
                <SelectValue placeholder="Select expiry" />
              </SelectTrigger>
              <SelectContent>
                {isWeeklyEnabled && <SelectItem value="weekly">Weekly</SelectItem>}
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>

            <Select 
              value={formData.expiryOrder} 
              onValueChange={(value) => updateFormData("expiryOrder", value)}
            >
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
          <Input
            value={formData.elementName}
            disabled={!!initialData?.elementName}
            onChange={(e) => updateFormData("elementName", e.target.value)}
            className="rounded-lg bg-accent pr-10"
          />
          {/* Generate Unique Name Button */}
          <Button
          disabled={!!initialData?.elementName}
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

      {/* Action Buttons */}
      <div className="flex justify-end gap-2 mt-6">
        {onClose && (
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        )}
        <Button onClick={handleSubmit}>
          {isLoading && <Spinner className="w-5 h-5 mr-2" />}
          {initialData ? 'Update' : 'Add'}
        </Button>
      </div>
    </div>
  );
};

export default DaysToExpire;
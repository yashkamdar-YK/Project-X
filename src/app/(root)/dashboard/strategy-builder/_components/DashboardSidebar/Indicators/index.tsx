import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { useDataPointStore } from "@/lib/store/dataPointStore";
import { INDICATOR_OPTIONS } from "../constants";
import EMAForm from "./EMAForm";
import SMAForm from "./SMAForm";
import SuperTrendForm from "./SuperTrendForm";
import { Indicator } from "./types";
import { useIndicatorStore } from "@/lib/store/IndicatorStore";
import Spinner from "@/components/shared/spinner";

interface IndicatorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingIndicator?: Indicator;
}

const IndicatorDialog: React.FC<IndicatorDialogProps> = ({ 
  open, 
  onOpenChange,
  editingIndicator,
}) => {
  const [selectedIndicator, setSelectedIndicator] = useState<typeof INDICATOR_OPTIONS[number] | null>(
    editingIndicator ? INDICATOR_OPTIONS.find(opt => opt.option === editingIndicator.type) || null : null
  );
  const [searchValue, setSearchValue] = useState("");
  const { selectedSymbol } = useDataPointStore();
  const { indicators } = useIndicatorStore();

  const filteredOptions = INDICATOR_OPTIONS.filter(
    option => option.title.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleClose = () => {
    setSelectedIndicator(null);
    setSearchValue("");
    onOpenChange(false);
  };

  const renderIndicatorForm = () => {
    if (editingIndicator) {
      switch (editingIndicator.type) {
        case 'ema':
          return <EMAForm initialData={editingIndicator} onClose={handleClose} />;
        case 'sma':
          return <SMAForm initialData={editingIndicator} onClose={handleClose} />;
        case 'supertrend':
          return <SuperTrendForm initialData={editingIndicator} onClose={handleClose} />;
      }
    }

    switch (selectedIndicator?.option) {
      case 'ema':
        return <EMAForm onClose={handleClose} />;
      case 'sma':
        return <SMAForm onClose={handleClose} />;
      case 'supertrend':
        return <SuperTrendForm onClose={handleClose} />;
      default:
        return (
          <div className="space-y-4">
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <Input
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="pl-10"
                placeholder="Search indicators..."
              />
            </div>
            <div className="grid gap-2">
              {filteredOptions.map((option) => (
                <Button
                  key={option.option}
                  variant="outline"
                  className="justify-start h-auto py-4 px-4"
                  onClick={() => setSelectedIndicator(option)}
                >
                  <div className="text-left">
                    <div className="font-medium">{option.title}</div>
                  </div>
                </Button>
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {editingIndicator 
              ? `Edit ${editingIndicator.type.toUpperCase()}`
              : selectedIndicator 
                ? selectedIndicator.title 
                : "Add Indicator"}
          </DialogTitle>
        </DialogHeader>
        {renderIndicatorForm()}
      </DialogContent>
    </Dialog>
  );
};

export interface IndicatorFormWrapperProps {
  children: React.ReactNode;
  onClose: () => void;
  isEdit: boolean;
  isLoading: boolean;
}

export const IndicatorFormWrapper: React.FC<IndicatorFormWrapperProps> = ({ children, onClose , isEdit, isLoading}) => (
  <div className="space-y-4">
    {children}
    <div className="flex justify-end space-x-2 mt-4">
      <Button variant="outline" onClick={onClose}>
        Cancel
      </Button>
      <Button type="submit"
       disabled={isLoading}>
        {isLoading && <Spinner className="w-5 h-5 mr-2" />}     
        {isEdit ? "Save" : "Add"}
      </Button>
    </div>
  </div>
);

export default IndicatorDialog;
// SuperTrendForm.tsx
import { useDataPointStore } from "@/lib/store/dataPointStore";
import { useState, useEffect } from "react";
import { IndicatorFormWrapper } from ".";
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { WandSparkles } from "lucide-react";
import { SuperTrendIndicator } from "./types";
import { useIndicatorStore } from "@/lib/store/IndicatorStore";

interface SuperTrendFormProps {
  initialData?: SuperTrendIndicator;
  onClose: () => void;
}

const SuperTrendForm: React.FC<SuperTrendFormProps> = ({ initialData, onClose }) => {
  const { selectedSymbol } = useDataPointStore();
  const { addIndicator, updateIndicator } = useIndicatorStore();

  const [formData, setFormData] = useState({
    elementName: initialData?.elementName || "st10",
    settings: {
      length: initialData?.settings.length || "10",
      multiplier: initialData?.settings.multiplier || "1"
    }
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        elementName: initialData.elementName,
        settings: initialData.settings
      });
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const indicatorData: SuperTrendIndicator = {
      id: initialData?.id || `st-${Date.now()}`,
      type: 'supertrend',
      elementName: formData.elementName,
      onData: selectedSymbol,
      timeFrame: 15,
      settings: {
        length: formData.settings.length,
        multiplier: formData.settings.multiplier
      }
    };

    if (initialData) {
      updateIndicator(initialData.id, indicatorData);
    } else {
      addIndicator(indicatorData);
    }
    onClose();
  };

  return (
    <form onSubmit={handleSubmit}>
      <IndicatorFormWrapper onClose={onClose}>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">On Data</label>
              <Select value={selectedSymbol || ""} disabled>
                <SelectTrigger>
                  <SelectValue placeholder="Select data" />
                </SelectTrigger>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Time Frame</label>
              <Input value="15" disabled />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Length</label>
              <Input
                value={formData.settings.length}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  settings: { ...prev.settings, length: e.target.value }
                }))}
                type="number"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Multiplier</label>
              <Input
                value={formData.settings.multiplier}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  settings: { ...prev.settings, multiplier: e.target.value }
                }))}
                type="number"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Element Name</label>
            <div className="relative">
              <Input
                value={formData.elementName}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  elementName: e.target.value
                }))}
                className="pr-10"
              />
              <Button
                type="button"
                size="icon"
                variant="ghost"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                onClick={() => setFormData(prev => ({
                  ...prev,
                  elementName: `st${prev.settings.length}_${Date.now().toString().slice(-4)}`
                }))}
              >
                <WandSparkles className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </IndicatorFormWrapper>
    </form>
  );
};

export default SuperTrendForm;
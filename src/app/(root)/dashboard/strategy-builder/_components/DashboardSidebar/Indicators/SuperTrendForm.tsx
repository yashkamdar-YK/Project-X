import { useState, useEffect, useMemo } from "react";
import { WandSparkles } from "lucide-react";
import { useDataPointStore } from "@/lib/store/dataPointStore";
import { IndicatorFormWrapper } from ".";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IndicatorFormData, SuperTrendIndicator, IndicatorOption } from "./types";
import { useIndicatorStore } from "@/lib/store/IndicatorStore";
import { useQuery } from "@tanstack/react-query";
import { symbolService } from "../../../_actions";
import { useDataPointsStore } from "@/lib/store/dataPointsStore";
import { convertToMinutes } from "@/lib/utils";

interface SuperTrendFormProps {
  initialData?: SuperTrendIndicator;
  onClose: () => void;
}

const SuperTrendForm: React.FC<SuperTrendFormProps> = ({ initialData, onClose }) => {
  const { selectedSymbol, selectedTimeFrame } = useDataPointStore();
  const { dataPoints } = useDataPointsStore();
  const { addIndicator, updateIndicator, indicators } = useIndicatorStore();

  const generateUniqueElementName = (formData: any) => {
    const parts = ["st"];
    if(formData.onData) parts.push(formData.onData);
    if(formData.settings.multiplier) parts.push(formData.settings.multiplier);
    return parts.join("_");
  };

  const [formData, setFormData] = useState<IndicatorFormData>({
    elementName: initialData?.elementName || "st",
    onData: initialData?.onData || "",
    settings: {
      length: initialData?.settings.length || "10",
      multiplier: initialData?.settings.multiplier || "1"
    }
  });

  const { data } = useQuery<IndicatorOption>({
    queryFn: () => symbolService.getIndicatorAbility('supertrend'),
    queryKey: ['supertrend']
  });

  useEffect(() => {
    if (initialData) {
      setFormData({
        elementName: initialData.elementName,
        onData: initialData.onData,
        settings: initialData.settings
      });
    }
  }, [initialData]);

  // Fixed type checking for matchesWithReq
  const matchesWithReq = useMemo(() => {
    if (!data?.requirements.type || !dataPoints) return [];
    return dataPoints.filter(v => {
      const pointType = v.options?.type;
      return pointType && data.requirements.type.includes(pointType as "candleData" | "indicator");
    });
  }, [dataPoints, data]);

  // Fixed type checking for matchedIndicator
  const matchedIndicator = useMemo(() => {
    if (!indicators || !data?.requirements.type) return [];
    return indicators.filter(v => {
      if (v.id === initialData?.id) return false;
      return v.options?.type && data.requirements.type.includes(v.options.type as "candleData" | "indicator");
    });
  }, [initialData, indicators, data]);

  const onDataOptions = [...matchedIndicator?.map(v => v.elementName), ...matchesWithReq.map(v => v.elementName)];

  // Handle settings changes with element name update
  const handleSettingsChange = (field: 'length' | 'multiplier', value: string) => {
    setFormData(prev => ({
      ...prev,
      settings: { ...prev.settings, [field]: value },
    }));
  };

  // Handle generate new name
  const handleGenerateElementName = () => {
    setFormData(prev => ({
      ...prev,
      elementName: generateUniqueElementName(formData)
    }));
  };
  useEffect(() => {
    if (formData) {
      setFormData(prev => ({
        ...prev,
        elementName: generateUniqueElementName(formData)
      }));
    }
  }, [formData?.onData, formData?.settings.multiplier]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const indicatorData: SuperTrendIndicator = {
      id: initialData?.id || `st-${Date.now()}`,
      type: 'supertrend',
      elementName: formData.elementName,
      onData: formData.onData,
      timeFrame: convertToMinutes(selectedTimeFrame || ""),
      settings: {
        length: formData.settings.length,
        multiplier: formData.settings.multiplier as string
      }
    };

    if (initialData) {
      updateIndicator(initialData.id, {...indicatorData, options: data});
    } else {
      addIndicator({
        ...indicatorData,
        options: data
      });
    }
    onClose();
  };

  if (!selectedTimeFrame || !selectedSymbol) {
    return (
      <p className="dark:text-gray-700 text-gray-200">
        Please select a symbol and time frame first to configure indicators.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit}>
      <IndicatorFormWrapper onClose={onClose} isEdit={!!initialData}>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">On Data</label>
              <Select
                value={formData?.onData || ""} 
                onValueChange={(value) => setFormData(prev => ({
                  ...prev,
                  onData: value
                }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select data" />
                </SelectTrigger>
                <SelectContent>
                  {onDataOptions.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Time Frame</label>
              <Input value={selectedTimeFrame} disabled />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Length</label>
              <Input
                value={formData.settings.length}
                onChange={(e) => handleSettingsChange('length', e.target.value)}
                type="number"
                min="1"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Multiplier</label>
              <Input
                value={formData.settings.multiplier}
                onChange={(e) => handleSettingsChange('multiplier', e.target.value)}
                type="number"
                min="0.1"
                step="0.1"
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
                className="pr-10 bg-accent"
                disabled={!!initialData} // Disable during edit mode
              />
              {!initialData && ( // Only show generate button in add mode
                <Button
                  type="button"
                  size="icon"
                  variant="ghost"
                  className="absolute right-2 top-1/2 -translate-y-1/2"
                  onClick={handleGenerateElementName}
                >
                  <WandSparkles className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </IndicatorFormWrapper>
    </form>
  );
};

export default SuperTrendForm;
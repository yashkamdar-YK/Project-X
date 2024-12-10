import { useState, useEffect, useCallback, useMemo } from "react";
import { WandSparkles } from "lucide-react";
import { useDataPointStore } from "@/lib/store/dataPointStore";
import { IndicatorFormWrapper } from ".";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { IndicatorFormData, MovingAverageIndicator } from "./types";
import { useIndicatorStore } from "@/lib/store/IndicatorStore";
import { useQuery } from "@tanstack/react-query";
import { symbolService } from "../../../_actions";
import { useDataPointsStore } from "@/lib/store/dataPointsStore";

interface EMAFormProps {
  initialData?: MovingAverageIndicator;
  onClose: () => void;
}

const EMAForm: React.FC<EMAFormProps> = ({ initialData, onClose }) => {
  const { selectedSymbol, selectedTimeFrame } = useDataPointStore();
  const { dataPoints } = useDataPointsStore();
  const { addIndicator, updateIndicator, indicators } = useIndicatorStore();

  const [formData, setFormData] = useState<IndicatorFormData>({
    elementName: initialData?.elementName || "ema9",
    onData: initialData?.onData || "",
    settings: {
      length: initialData?.settings.length || "9",
      source: initialData?.settings.source || "high",
      offset: initialData?.settings.offset || "0",
    }
  });

  const { data } = useQuery({
    queryFn: () => symbolService.getIndicatorAbility('ema'),
    queryKey: ['ema']
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

  const machesWithReq = useMemo(() => {
    if (!data) return []
    if (!dataPoints) return [];
    //@ts-ignore
    return dataPoints.filter(v => data?.requirements.type.includes(v.options?.type));
  }, [dataPoints, data]);

  const matchedIndicator = useMemo(() => {
    if (!indicators) return [];
    if (!data) return [];
    return indicators.filter(v => {
      if(v.id === initialData?.id) return false;
      //@ts-ignore
      return data?.requirements.type.includes(v.options?.type);
    });
  }, [initialData, indicators]);

  const onDataOptions = [...matchedIndicator?.map(v => v.elementName),...machesWithReq.map(v => v.elementName)];
  const sourceOptions = useMemo(() => {
    if (!formData.onData) return [];
    const selectedDataPoint = machesWithReq.find(v => v.elementName === formData.onData);
    return selectedDataPoint?.options?.columnsAvailable || [];
  }, [formData?.onData]);


  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const indicatorData: MovingAverageIndicator = {
      id: initialData?.id || `ema-${Date.now()}`,
      type: 'ema',
      elementName: formData.elementName,
      onData: formData?.onData,
      timeFrame: 15, // This should come from your time frame selector
      settings: {
        length: formData.settings.length,
        source: formData.settings.source as 'high' | 'low' | 'close',
        offset: formData.settings.offset || "0"
      }
    };

    if (initialData) {
      updateIndicator(initialData.id, {...indicatorData,options: data});
    } else {
      addIndicator({
        ...indicatorData,
        options: data
      });
    }
    onClose();
  };

  if (!selectedTimeFrame || !selectedSymbol) return <p className="dark:text-gray-700 text-gray-200" >
    Please select a symbol and time frame first to configure indicators.
  </p>

  return (
    <form onSubmit={handleSubmit}>
      <IndicatorFormWrapper onClose={onClose} isEdit={!!initialData}>
        <div className="grid gap-4">
          {/* Rest of your form JSX remains the same */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">On Data</label>
              <Select value={formData?.onData || ""} onValueChange={
                (value) => setFormData(prev => ({
                  ...prev,
                  onData: value
                }))
              } > 
                <SelectTrigger>
                  <SelectValue placeholder="Select data " />
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

          {/* Form fields for length, source, offset */}
          <div className="grid grid-cols-3 gap-4">
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
            {/* Similar updates for other fields */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Source</label>
              <Select
                disabled={!sourceOptions?.length}
                value={formData.settings.source}
                //@ts-ignore
                onValueChange={(value) => setFormData(prev => ({
                  ...prev,
                  settings: { ...prev.settings, source: value }
                }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sourceOptions?.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Offset</label>
              <Input
                value={formData.settings.offset}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  settings: { ...prev.settings, offset: e.target.value }
                }))}
                type="number"
              />
            </div>
          </div>

          {/* Element name field */}
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
                  elementName: `ema${prev.settings.length}_${Date.now().toString().slice(-4)}`
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

export default EMAForm;
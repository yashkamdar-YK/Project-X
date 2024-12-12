import React from "react";
import { Position } from "./types";
import ExpandableSection from "./ExpandableSection";
import { useExpandableSections } from "./useExpandableSections";

interface ExpandableActionsProps {
  position: Position;
  onSettingChange: (id: string, field: string, value: any) => void;
}

const ExpandableActions: React.FC<ExpandableActionsProps> = ({
  position,
  onSettingChange,
}) => {
  const {
    sections,
    toggleSection,
    handleTargetToggle,
    handleSLToggle,
    handleTrailSLToggle,
    handleReEntryTargetToggle,
    handleReEntrySLToggle,
    handleWTToggle,
  } = useExpandableSections(position, onSettingChange);

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 p-4">
      <div className="space-y-4">
        <ExpandableSection
          title="Target"
          isExpanded={sections.target}
          onToggle={() => toggleSection("target")}
          onSettingChange={handleTargetToggle}
          position={position}
        />
        <ExpandableSection
          title="Stop Loss"
          isExpanded={sections.stopLoss}
          onToggle={() => toggleSection("stopLoss")}
          onSettingChange={handleSLToggle}
          position={position}
        />
        <ExpandableSection
          title="Trail Stop Loss"
          isExpanded={sections.trailStopLoss}
          onToggle={() => toggleSection("trailStopLoss")}
          onSettingChange={handleTrailSLToggle}
          position={position}
        />
        <ExpandableSection
          title="Re-Entry Target"
          isExpanded={sections.reEntryTarget}
          onToggle={() => toggleSection("reEntryTarget")}
          onSettingChange={handleReEntryTargetToggle}
          position={position}
        />
        <ExpandableSection
          title="Re-Entry Stop Loss"
          isExpanded={sections.reEntryStopLoss}
          onToggle={() => toggleSection("reEntryStopLoss")}
          onSettingChange={handleReEntrySLToggle}
          position={position}
        />
        <ExpandableSection
          title="Wait Trade"
          isExpanded={sections.waitTrade}
          onToggle={() => toggleSection("waitTrade")}
          onSettingChange={handleWTToggle}
          position={position}
        />
      </div>
    </div>
  );
};

export default ExpandableActions;


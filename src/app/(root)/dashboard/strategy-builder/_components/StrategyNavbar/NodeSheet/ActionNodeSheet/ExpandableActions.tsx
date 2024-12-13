import React from "react";
import { Position, PositionSettings } from "./types";
import ExpandableSection from "./ExpandableSection";

interface ExpandableActionsProps {
  position: Position;
  onSettingChange: (id: string, field: keyof PositionSettings, value: any) => void;
}

const ExpandableActions: React.FC<ExpandableActionsProps> = ({
  position,
  onSettingChange,
}) => {
  // Handle toggle for each section by directly updating the corresponding boolean field
  const handleTargetToggle = () => {
    onSettingChange(position.id, "isTarget", !position.settings.isTarget);
  };

  const handleSLToggle = () => {
    onSettingChange(position.id, "isSL", !position.settings.isSL);
  };

  const handleTrailSLToggle = () => {
    onSettingChange(position.id, "isTrailSL", !position.settings.isTrailSL);
  };

  const handleReEntryTargetToggle = () => {
    onSettingChange(position.id, "isReEntryTg", !position.settings.isReEntryTg);
  };

  const handleReEntrySLToggle = () => {
    onSettingChange(position.id, "isReEntrySL", !position.settings.isReEntrySL);
  };

  const handleWTToggle = () => {
    onSettingChange(position.id, "isWT", !position.settings.isWT);
  };

  return (
    <div className="border-t border-gray-200 dark:border-gray-700 p-4">
      <div className="space-y-4">
        <ExpandableSection
          title="Target"
          isExpanded={position.settings.isTarget}
          onToggle={handleTargetToggle}
          onSettingChange={(field, value) => onSettingChange(position.id, field, value)}
          position={position}
        />
        <ExpandableSection
          title="Stop Loss"
          isExpanded={position.settings.isSL}
          onToggle={handleSLToggle}
          onSettingChange={(field, value) => onSettingChange(position.id, field, value)}
          position={position}
        />
        <ExpandableSection
          title="Trail Stop Loss"
          isExpanded={position.settings.isTrailSL}
          onToggle={handleTrailSLToggle}
          onSettingChange={(field, value) => onSettingChange(position.id, field, value)}
          position={position}
        />
        <ExpandableSection
          title="Re-Entry Target"
          isExpanded={position.settings.isReEntryTg}
          onToggle={handleReEntryTargetToggle}
          onSettingChange={(field, value) => onSettingChange(position.id, field, value)}
          position={position}
        />
        <ExpandableSection
          title="Re-Entry Stop Loss"
          isExpanded={position.settings.isReEntrySL}
          onToggle={handleReEntrySLToggle}
          onSettingChange={(field, value) => onSettingChange(position.id, field, value)}
          position={position}
        />
        <ExpandableSection
          title="Wait Trade"
          isExpanded={position.settings.isWT}
          onToggle={handleWTToggle}
          onSettingChange={(field, value) => onSettingChange(position.id, field, value)}
          position={position}
        />
      </div>
    </div>
  );
};

export default ExpandableActions;
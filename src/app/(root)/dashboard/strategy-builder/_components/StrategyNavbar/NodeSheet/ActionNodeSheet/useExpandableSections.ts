import { useState } from "react";
import { Position, PositionSettings } from "./types";

export const useExpandableSections = (
  position: Position,
  onSettingChange: (id: string, field: keyof PositionSettings, value: any) => void
) => {
  const [sections, setSections] = useState({
    target: false,
    stopLoss: false,
    trailStopLoss: false,
    reEntryTarget: false,
    reEntryStopLoss: false,
    waitTrade: false,
  });

  const toggleSection = (section: keyof typeof sections) => {
    setSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const handleTargetToggle = (field: keyof PositionSettings, value: any) => {
    if (!sections.target) {
      onSettingChange(position.id, "isTarget", true);
      onSettingChange(position.id, "targetOn", "%");
      onSettingChange(position.id, "targetValue", 0);
    } else {
      onSettingChange(position.id, "isTarget", false);
      onSettingChange(position.id, "targetOn", undefined);
      onSettingChange(position.id, "targetValue", undefined);
    }
    onSettingChange(position.id, field, value);
  };

  const handleSLToggle = (field: keyof PositionSettings, value: any) => {
    if (!sections.stopLoss) {
      onSettingChange(position.id, "isSL", true);
      onSettingChange(position.id, "SLon", "%");
      onSettingChange(position.id, "SLvalue", 0);
    } else {
      onSettingChange(position.id, "isSL", false);
      onSettingChange(position.id, "SLon", undefined);
      onSettingChange(position.id, "SLvalue", undefined);
    }
    onSettingChange(position.id, field, value);
  };

  const handleTrailSLToggle = (field: keyof PositionSettings, value: any) => {
    if (!sections.trailStopLoss) {
      onSettingChange(position.id, "isTrailSL", true);
      onSettingChange(position.id, "trailSLon", "%");
      onSettingChange(position.id, "trailSL_X", 0);
      onSettingChange(position.id, "trailSL_Y", 0);
    } else {
      onSettingChange(position.id, "isTrailSL", false);
      onSettingChange(position.id, "trailSLon", undefined);
      onSettingChange(position.id, "trailSL_X", undefined);
      onSettingChange(position.id, "trailSL_Y", undefined);
    }
    onSettingChange(position.id, field, value);
  };

  const handleReEntryTargetToggle = (field: keyof PositionSettings, value: any) => {
    if (!sections.reEntryTarget) {
      onSettingChange(position.id, "isReEntryTg", true);
      onSettingChange(position.id, "reEntryTgOn", "asap");
      onSettingChange(position.id, "reEntryTgVal", 0);
      onSettingChange(position.id, "reEntryTgMaxNo", 1);
    } else {
      onSettingChange(position.id, "isReEntryTg", false);
      onSettingChange(position.id, "reEntryTgOn", undefined);
      onSettingChange(position.id, "reEntryTgVal", undefined);
      onSettingChange(position.id, "reEntryTgMaxNo", undefined);
    }
    onSettingChange(position.id, field, value);
  };

  const handleReEntrySLToggle = (field: keyof PositionSettings, value: any) => {
    if (!sections.reEntryStopLoss) {
      onSettingChange(position.id, "isReEntrySL", true);
      onSettingChange(position.id, "reEntrySLOn", "asap");
      onSettingChange(position.id, "reEntrySLVal", 0);
      onSettingChange(position.id, "reEntrySLMaxNo", 1);
    } else {
      onSettingChange(position.id, "isReEntrySL", false);
      onSettingChange(position.id, "reEntrySLOn", undefined);
      onSettingChange(position.id, "reEntrySLVal", undefined);
      onSettingChange(position.id, "reEntrySLMaxNo", undefined);
    }
    onSettingChange(position.id, field, value);
  };

  const handleWTToggle = (field: keyof PositionSettings, value: any) => {
    if (!sections.waitTrade) {
      onSettingChange(position.id, "isWT", true);
      onSettingChange(position.id, "wtOn", "val-up");
      onSettingChange(position.id, "wtVal", 0);
    } else {
      onSettingChange(position.id, "isWT", false);
      onSettingChange(position.id, "wtOn", undefined);
      onSettingChange(position.id, "wtVal", undefined);
    }
    onSettingChange(position.id, field, value);
  };

  return {
    sections,
    toggleSection,
    handleTargetToggle,
    handleSLToggle,
    handleTrailSLToggle,
    handleReEntryTargetToggle,
    handleReEntrySLToggle,
    handleWTToggle,
  };
};


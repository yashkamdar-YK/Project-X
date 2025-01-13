import { ConditionNode, SubSection } from "./types";
import { DataPoint } from "../../../DashboardSidebar/DatapointDialog/types";
import { useApplyDataStore } from "@/lib/store/applyDataStore";

export const validateSubSection = (
  subSection: SubSection,
  dataPoints: DataPoint[],
  indicators: any[],
  actionOptions: any
): boolean => {
  const getData = useApplyDataStore.getState().getData;
  // Basic validation - check if LHS and operator exist
  if (!subSection.lhs || !subSection.operator) {
    return false;
  }

  // Find selected LHS
  const selectedLHS = 
    dataPoints.find((dp) => dp.elementName === subSection.lhs) ||
    indicators.find((ind) => ind.elementName === subSection.lhs) ||
    subSection.lhs;

  // Get columns if it's an action or from selectedLHS
  const columns = subSection?.lhs?.includes("ac") 
    ? getData("action") 
    //@ts-ignore
    : selectedLHS?.options?.columnsAvailable || [];

  // Check if column is required and exists
  if (columns?.length > 0 && !subSection?.column) {
    return false;
  }

  // Get candle location requirement
  //@ts-ignore
  const hasCandleLocation = selectedLHS?.options?.candleLocation || false;

  // Validate candle location fields if required
  if (hasCandleLocation) {
    if (!subSection.selectedPeriod) {
      return false;
    }
    if (subSection.selectedPeriod === "prev-n" && (!subSection.nValue || Number(subSection.nValue) < 1)) {
      return false;
    }
  }

  // Get comparison type
  const canCompareWith = 
    actionOptions?.canComparedwith ||
    //@ts-ignore
    selectedLHS?.options?.canComparedwith?.map((v) => v.toLowerCase()) ||
    //@ts-ignore
    getData(subSection.lhs)?.canComparedwith?.map((v) => v.toLowerCase());

  // Special handling for integer comparison
  if (canCompareWith?.[0] === "int") {
    return subSection._rhsValue !== undefined && subSection?._rhsValue !== "";
  }

  // Validate RHS based on comparison type
  if (!subSection.rhs) {
    return false;
  }

  // Find selected RHS
  const selectedRHS = 
    dataPoints.find((dp) => dp.elementName === subSection.rhs) ||
    indicators.find((ind) => ind.elementName === subSection.rhs);

  // Get RHS columns if available
  //@ts-ignore
  const RHSColumns = selectedRHS?.options?.columnsAvailable || [];

  // Check if RHS column is required and exists
  if (RHSColumns?.length > 0 && !subSection.rhs_column) {
    return false;
  }

  // Check RHS candle location
  //@ts-ignore
  const hasRHSCandleLocation = selectedRHS?.options?.candleLocation || false;

  // Validate RHS candle location fields if required
  if (hasRHSCandleLocation) {
    if (!subSection.rhs_selectedPeriod) {
      return false;
    }
    if (subSection.rhs_selectedPeriod === "prev-n" && (!subSection.rhs_nValue || Number(subSection.rhs_nValue) < 1)) {
      return false;
    }
  }

  // Validate value input if RHS is "value"
  if (subSection.rhs === "value" && subSection._rhsValue === undefined) {
    return false;
  }

  return true;
};

export const validateConditionBlocks = (
  node: ConditionNode,
  dataPoints: DataPoint[],
  indicators: any[],
  actionOptions: any
): string | null => {
  // Check if node has blocks
  if (!node.blocks?.length) {
    return "At least one condition block is required";
  }

  // Check each block and its subsections
  for (const block of node.blocks) {
    if (!block.subSections?.length) {
      return "Block must contain at least one condition";
    }

    // Validate all subsections in the block
    for (const subSection of block.subSections) {
      const isValid = validateSubSection(subSection, dataPoints, indicators, actionOptions);
      if (!isValid) {
        return "Please fill all required fields in condition blocks";
      }
    }
  }

  return null;
};
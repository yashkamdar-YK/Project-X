export type AddBadge = "AND" | "OR";
export type BlockRelation = "AND" | "OR";

export interface SubSection {
  id: number;
  addBadge: AddBadge;
  lhs: string;
  column?: string;
  selectedPeriod?: string;
  nValue?: string;
  operator: string;
  rhs: string;
  _rhsValue?: string;
}

export interface ConditionBlock {
  subSections: SubSection[];
  relation: BlockRelation;
}

export interface ConditionBlockMap {
  [nodeId: string]: ConditionBlock;
}

// export interface DataPointOption {
//   applyIndicators: boolean;
//   candleLocation: boolean;
//   type: "candleData" | "dte";
//   columnsAvailable: string[];
//   allowedOperations: string[];
// }

// export interface DataPoint {
//   id: string;
//   elementName: string;
//   options?: DataPointOption;
// }

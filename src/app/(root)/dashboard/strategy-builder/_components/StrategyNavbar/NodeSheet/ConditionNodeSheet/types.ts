export type AddBadge = "AND" | "OR";
export type BlockRelation = "AND" | "OR";

export interface SubSection {
  id: number;
  addBadge: AddBadge;
  lhs: string;
  column?: string;
  selectedPeriod?: string;
  nValue?: number;
  operator: string;
  rhs: string;
  _rhsValue?: number;
}

export interface ConditionBlock {
  id: number;
  subSections: SubSection[];
  relation?: BlockRelation;
}

export interface ConditionState {
  blocks: ConditionBlock[];
  getBlockRelation: (blockId: number) => BlockRelation | undefined;
  toggleBlockRelation: (blockId: number) => void;
}

export interface DataPointOption {
  applyIndicators: boolean;
  candleLocation: boolean;
  type: "candleData" | "dte";
  columnsAvailable: string[];
  canComparedwith: ['candleData', 'values', 'indicators'];
  allowedOperations: string[];
}

export interface DataPoint {
  id: string;
  elementName: string;
  options?: DataPointOption;
}


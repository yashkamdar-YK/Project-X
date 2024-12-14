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


export interface ConditionBlockMap {
  [nodeId: string]: ConditionNode;
}

interface ConditionNode {
  name:string
  blocks: {
    id: string;
    subSections: SubSection[];
    relation: BlockRelation;
  }[];
  blockRelations: BlockRelation[];
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

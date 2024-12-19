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
  _rhsValue?: string;
  rhs_column?: string;
  rhs_selectedPeriod?: string;
  rhs_nValue?: number;
}

export interface ConditionBlockMap {
  [nodeId: string]: ConditionNode;
}

export interface ConditionNode {
  name:string
  maxEntries: number;
  waitTrigger: boolean;
  positionOpen: boolean;
  type: "entry" | "exit" | "adjustment";
  blocks: {
    id: string;
    subSections: SubSection[];
    relation: BlockRelation;
  }[];
  blockRelations: BlockRelation[];
}
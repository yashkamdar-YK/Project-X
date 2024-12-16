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

export interface ConditionNode {
  name:string
  maxEntries: number;
  waitTrigger: boolean;
  positionOpen: boolean;
  blocks: {
    id: string;
    subSections: SubSection[];
    relation: BlockRelation;
  }[];
  blockRelations: BlockRelation[];
}
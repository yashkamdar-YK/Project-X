import { ConditionBlockMap , SubSection, BlockRelation} from '@/app/(root)/dashboard/strategy-builder/_components/StrategyNavbar/NodeSheet/ConditionNodeSheet/types';
import { create } from 'zustand';

interface ConditionStore {
  conditionBlocks: ConditionBlockMap;
  createConditionBlock: (nodeId: string) => void;
  addSubSection: (nodeId: string) => void;
  updateSubSection: (
    nodeId: string,
    subSectionId: number,
    field: keyof SubSection,
    value: string
  ) => void;
  removeSubSection: (nodeId: string, subSectionId: number) => void;
  toggleAddBadge: (nodeId: string, subSectionId: number) => void;
  toggleBlockRelation: (nodeId: string) => void;
  getBlockRelation: (nodeId: string) => BlockRelation;
}

export const useConditionStore = create<ConditionStore>((set, get) => ({
  conditionBlocks: {},

  createConditionBlock: (nodeId: string) =>
    set((state) => ({
      conditionBlocks: {
        ...state.conditionBlocks,
        [nodeId]: {
          subSections: [
            {
              id: 0,
              addBadge: "AND",
              lhs: "",
              operator: "",
              rhs: "",
            },
          ],
          relation: "AND",
        },
      },
    })),

  addSubSection: (nodeId: string) =>
    set((state) => {
      const currentBlock = state.conditionBlocks[nodeId];
      if (!currentBlock) return state;

      return {
        conditionBlocks: {
          ...state.conditionBlocks,
          [nodeId]: {
            ...currentBlock,
            subSections: [
              ...currentBlock.subSections,
              {
                id: currentBlock.subSections.length,
                addBadge: "AND",
                lhs: "",
                operator: "",
                rhs: "",
              },
            ],
          },
        },
      };
    }),

  updateSubSection: (nodeId, subSectionId, field, value) =>
    set((state) => {
      const currentBlock = state.conditionBlocks[nodeId];
      if (!currentBlock) return state;

      return {
        conditionBlocks: {
          ...state.conditionBlocks,
          [nodeId]: {
            ...currentBlock,
            subSections: currentBlock.subSections.map((subSection) =>
              subSection.id === subSectionId
                ? { ...subSection, [field]: value }
                : subSection
            ),
          },
        },
      };
    }),

  removeSubSection: (nodeId, subSectionId) =>
    set((state) => {
      const currentBlock = state.conditionBlocks[nodeId];
      if (!currentBlock) return state;

      return {
        conditionBlocks: {
          ...state.conditionBlocks,
          [nodeId]: {
            ...currentBlock,
            subSections: currentBlock.subSections.filter(
              (subSection) => subSection.id !== subSectionId
            ),
          },
        },
      };
    }),

  toggleAddBadge: (nodeId, subSectionId) =>
    set((state) => {
      const currentBlock = state.conditionBlocks[nodeId];
      if (!currentBlock) return state;

      return {
        conditionBlocks: {
          ...state.conditionBlocks,
          [nodeId]: {
            ...currentBlock,
            subSections: currentBlock.subSections.map((subSection) =>
              subSection.id === subSectionId
                ? {
                    ...subSection,
                    addBadge: subSection.addBadge === "AND" ? "OR" : "AND",
                  }
                : subSection
            ),
          },
        },
      };
    }),

  toggleBlockRelation: (nodeId) =>
    set((state) => {
      const currentBlock = state.conditionBlocks[nodeId];
      if (!currentBlock) return state;

      return {
        conditionBlocks: {
          ...state.conditionBlocks,
          [nodeId]: {
            ...currentBlock,
            relation: currentBlock.relation === "AND" ? "OR" : "AND",
          },
        },
      };
    }),

  getBlockRelation: (nodeId) => {
    const block = get().conditionBlocks[nodeId];
    return block?.relation || "AND";
  },
}));
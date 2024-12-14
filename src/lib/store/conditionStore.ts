import { BlockRelation, ConditionBlock, SubSection } from '@/app/(root)/dashboard/strategy-builder/_components/StrategyNavbar/NodeSheet/ConditionNodeSheet/types';
import { create } from 'zustand';

interface ConditionStore {
  conditionBlocks: ConditionBlock[];
  addConditionBlock: () => void;
  addSubSection: (blockId: number) => void;
  updateSubSection: (blockId: number, subSectionId: number, field: keyof SubSection, value: string) => void;
  removeSubSection: (blockId: number, subSectionId: number) => void;
  toggleAddBadge: (blockId: number, subSectionId: number) => void;
  toggleBlockRelation: (blockId: number) => void;
  getBlockRelation: (blockId: number) => BlockRelation | undefined;
}

export const useConditionStore = create<ConditionStore>((set, get) => ({
  conditionBlocks: [
    {
      id: 0,
      subSections: [{ id: 0, addBadge: "AND", lhs: "", operator: "", rhs: "" }],
      relation: "AND"
    },
  ],  

  addConditionBlock: () => set((state) => ({
    conditionBlocks: [
      ...state.conditionBlocks,
      {
        id: state.conditionBlocks.length,
        subSections: [{ id: 0, addBadge: "AND", lhs: "", operator: "", rhs: "" }],
        relation: "AND"
      },
    ],
  })),

  addSubSection: (blockId) => set((state) => ({
    conditionBlocks: state.conditionBlocks.map((block) =>
      block.id === blockId
        ? {
            ...block,
            subSections: [
              ...block.subSections,
              {
                id: block.subSections.length,
                addBadge: "AND",
                lhs: "",
                operator: "",
                rhs: "",
              },
            ],
          }
        : block
    ),
  })),

  updateSubSection: (blockId, subSectionId, field, value) => set((state) => ({
    conditionBlocks: state.conditionBlocks.map((block) =>
      block.id === blockId
        ? {
            ...block,
            subSections: block.subSections.map((subSection) =>
              subSection.id === subSectionId
                ? { ...subSection, [field]: value }
                : subSection
            ),
          }
        : block
    ),
  })),

  removeSubSection: (blockId, subSectionId) => set((state) => ({
    conditionBlocks: state.conditionBlocks.map((block) =>
      block.id === blockId
        ? {
            ...block,
            subSections: block.subSections.filter(
              (subSection) => subSection.id !== subSectionId
            ),
          }
        : block
    ),
  })),

  toggleAddBadge: (blockId, subSectionId) => set((state) => ({
    conditionBlocks: state.conditionBlocks.map((block) =>
      block.id === blockId
        ? {
            ...block,
            subSections: block.subSections.map((subSection) =>
              subSection.id === subSectionId
                ? {
                    ...subSection,
                    addBadge: subSection.addBadge === "AND" ? "OR" : "AND",
                  }
                : subSection
            ),
          }
        : block
    ),
  })),

  toggleBlockRelation: (blockId) => set((state) => ({
    conditionBlocks: state.conditionBlocks.map((block) =>
      block.id === blockId
        ? {
            ...block,
            relation: block.relation === "AND" ? "OR" : "AND",
          }
        : block
    ),
  })),

  getBlockRelation: (blockId) => {
    const block = get().conditionBlocks.find((b) => b.id === blockId);
    return block?.relation;
  },
}));
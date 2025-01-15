import {
  ConditionBlockMap,
  SubSection,
  BlockRelation,
  ConditionNode,
} from "@/app/(root)/dashboard/strategy-builder/_components/StrategyNavbar/NodeSheet/ConditionNodeSheet/types";
import { create } from "zustand";
import { devtools, persist, createJSONStorage } from "zustand/middleware";
import { markUnsavedChanges, useUnsavedChangesStore } from "./unsavedChangesStore";

interface ConditionStore {
  conditionBlocks: ConditionBlockMap;
  setConditionBlocks: (conditionBlocks: ConditionBlockMap) => void;
  createConditionBlock: (nodeId: string, name: string, conditionType: "entry" | "exit") => void;
  copyConditionBlock: (nodeId: string, newNodeId: string, label: string) => void;
  updateBlockSettings: (nodeId: string, field: keyof ConditionNode, value: any) => void;
  removeConditionBlock: (nodeId: string) => void;
  addBlock: (nodeId: string) => void;
  removeBlock: (nodeId: string, blockId: string) => void;
  addSubSection: (nodeId: string, blockId: string) => void;
  clearConditionNodes: () => void;
  updateSubSection: (
    nodeId: string,
    blockId: string,
    subSectionId: number,
    field: keyof SubSection,
    value: string | number
  ) => void;
  removeSubSection: (nodeId: string, blockId: string, subSectionId: number) => void;
  toggleAddBadge: (nodeId: string, blockId: string, subSectionId: number) => void;
  updateBlockRelation: (nodeId: string, index: number) => void;
  copyBlock: (nodeId: string, blockId: string) => void;
  moveBlock: (nodeId: string, blockId: string, direction: 'up' | 'down') => void;
  copySubSection: (nodeId: string, blockId: string, subSectionId: number) => void;
  moveSubSection: (nodeId: string, blockId: string, subSectionId: number, direction: 'up' | 'down') => void;
}

const checkEditPermission = () => {
  const canEdit = useUnsavedChangesStore.getState().canEdit;
  if (!canEdit) {
    console.warn('Edit operation blocked: User does not have edit permission');
    return false;
  }
  return true;
};

export const useConditionStore = create<ConditionStore>()(
  devtools(
    persist(
      (set) => ({
        conditionBlocks: {},
        
        setConditionBlocks: (conditionBlocks) => {
          if (!checkEditPermission()) return;
          set({ conditionBlocks: { ...conditionBlocks } });
        },

        createConditionBlock: (nodeId: string, name: string, conditionType: "entry" | "exit") => {
          if (!checkEditPermission()) return;
          set((state) => {
            markUnsavedChanges();
            return {
              conditionBlocks: {
                ...state.conditionBlocks,
                [nodeId]: {
                  name,
                  maxEntries: 0,
                  waitTrigger: false,
                  positionOpen: false,
                  type: conditionType || "entry",
                  blocks: [
                    {
                      id: `block-${Date.now()}`,
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
                  ],
                  blockRelations: [],
                },
              },
            };
          });
        },

        copyConditionBlock: (nodeId, newNodeId, label) => {
          if (!checkEditPermission()) return;
          set((state) => {
            const currentNode = state.conditionBlocks[nodeId];
            if (!currentNode) return state;
            markUnsavedChanges();
            return {
              conditionBlocks: {
                ...state.conditionBlocks,
                [newNodeId]: {
                  name: label,
                  maxEntries: currentNode.maxEntries,
                  waitTrigger: currentNode.waitTrigger,
                  positionOpen: currentNode.positionOpen,
                  type: currentNode.type,
                  blocks: currentNode.blocks,
                  blockRelations: currentNode.blockRelations,
                },
              },
            };
          });
        },

        updateBlockSettings: (nodeId: string, field: keyof ConditionNode, value: any) => {
          if (!checkEditPermission()) return;
          set((state) => {
            const currentNode = state.conditionBlocks[nodeId];
            if (!currentNode) return state;
            markUnsavedChanges();
            return {
              conditionBlocks: {
                ...state.conditionBlocks,
                [nodeId]: {
                  ...currentNode,
                  [field]: value,
                },
              },
            };
          });
        },

        removeConditionBlock: (nodeId: string) => {
          if (!checkEditPermission()) return;
          set((state) => {
            markUnsavedChanges();
            const { [nodeId]: _, ...conditionBlocks } = state.conditionBlocks;
            return { conditionBlocks };
          });
        },

        addBlock: (nodeId: string) => {
          if (!checkEditPermission()) return;
          set((state) => {
            markUnsavedChanges();
            const currentNode = state.conditionBlocks[nodeId];
            if (!currentNode) return state;
            return {
              conditionBlocks: {
                ...state.conditionBlocks,
                [nodeId]: {
                  ...currentNode,
                  blocks: [
                    ...currentNode.blocks,
                    {
                      id: `block-${Date.now()}`,
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
                  ],
                  blockRelations: [...currentNode.blockRelations, "AND"],
                },
              },
            };
          });
        },

        removeBlock: (nodeId: string, blockId: string) => {
          if (!checkEditPermission()) return;
          set((state) => {
            markUnsavedChanges();
            const currentNode = state.conditionBlocks[nodeId];
            if (!currentNode) return state;

            const blockIndex = currentNode.blocks.findIndex(
              (block) => block.id === blockId
            );
            const newBlocks = currentNode.blocks.filter(
              (block) => block.id !== blockId
            );
            const newBlockRelations = [...currentNode.blockRelations];
            if (blockIndex !== -1) {
              newBlockRelations.splice(blockIndex - 1, 1);
            }

            return {
              conditionBlocks: {
                ...state.conditionBlocks,
                [nodeId]: {
                  ...currentNode,
                  blocks: newBlocks,
                  blockRelations: newBlockRelations,
                },
              },
            };
          });
        },

        addSubSection: (nodeId: string, blockId: string) => {
          if (!checkEditPermission()) return;
          set((state) => {
            markUnsavedChanges();
            const currentNode = state.conditionBlocks[nodeId];
            if (!currentNode) return state;
            return {
              conditionBlocks: {
                ...state.conditionBlocks,
                [nodeId]: {
                  ...currentNode,
                  blocks: currentNode.blocks.map((block) =>
                    block.id === blockId
                      ? {
                          ...block,
                          subSections: [
                            ...block.subSections,
                            {
                              id: new Date().getTime(),
                              addBadge: "AND",
                              lhs: "",
                              operator: "",
                              rhs: "",
                            },
                          ],
                        }
                      : block
                  ),
                },
              },
            };
          });
        },

        updateSubSection: (nodeId, blockId, subSectionId, field, value) => {
          if (!checkEditPermission()) return;
          set((state) => {
            markUnsavedChanges();
            const currentNode = state.conditionBlocks[nodeId];
            if (!currentNode) return state;
            return {
              conditionBlocks: {
                ...state.conditionBlocks,
                [nodeId]: {
                  ...currentNode,
                  blocks: currentNode.blocks.map((block) =>
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
                },
              },
            };
          });
        },

        removeSubSection: (nodeId: string, blockId: string, subSectionId: number) => {
          if (!checkEditPermission()) return;
          set((state) => {
            markUnsavedChanges();
            const currentNode = state.conditionBlocks[nodeId];
            if (!currentNode) return state;
            return {
              conditionBlocks: {
                ...state.conditionBlocks,
                [nodeId]: {
                  ...currentNode,
                  blocks: currentNode.blocks.map((block) =>
                    block.id === blockId
                      ? {
                          ...block,
                          subSections: block.subSections.filter(
                            (subSection) => subSection.id !== subSectionId
                          ),
                        }
                      : block
                  ),
                },
              },
            };
          });
        },

        toggleAddBadge: (nodeId: string, blockId: string, subSectionId: number) => {
          if (!checkEditPermission()) return;
          set((state) => {
            markUnsavedChanges();
            const currentNode = state.conditionBlocks[nodeId];
            if (!currentNode) return state;
            return {
              conditionBlocks: {
                ...state.conditionBlocks,
                [nodeId]: {
                  ...currentNode,
                  blocks: currentNode.blocks.map((block) =>
                    block.id === blockId
                      ? {
                          ...block,
                          subSections: block.subSections.map((subSection) =>
                            subSection.id === subSectionId
                              ? {
                                  ...subSection,
                                  addBadge:
                                    subSection.addBadge === "AND"
                                      ? "OR"
                                      : "AND",
                                }
                              : subSection
                          ),
                        }
                      : block
                  ),
                },
              },
            };
          });
        },

        updateBlockRelation: (nodeId: string, index: number) => {
          if (!checkEditPermission()) return;
          set((state) => {
            markUnsavedChanges();
            const currentNode = state.conditionBlocks[nodeId];
            if (!currentNode) return state;

            const newBlockRelations = [...currentNode.blockRelations];
            newBlockRelations[index] =
              newBlockRelations[index] === "AND" ? "OR" : "AND";

            return {
              conditionBlocks: {
                ...state.conditionBlocks,
                [nodeId]: {
                  ...currentNode,
                  blockRelations: newBlockRelations,
                },
              },
            };
          });
        },
        copyBlock: (nodeId: string, blockId: string) => {
          if (!checkEditPermission()) return;
          set((state) => {
            const currentNode = state.conditionBlocks[nodeId];
            if (!currentNode) return state;

            const blockToCopy = currentNode.blocks.find((block) => block.id === blockId);
            if (!blockToCopy) return state;

            markUnsavedChanges();
            const newBlock = {
              ...blockToCopy,
              id: `block-${Date.now()}`,
              subSections: blockToCopy.subSections.map(subSection => ({
                ...subSection,
                id: Date.now() + Math.random()
              }))
            };

            const blockIndex = currentNode.blocks.findIndex((block) => block.id === blockId);
            const newBlocks = [...currentNode.blocks];
            newBlocks.splice(blockIndex + 1, 0, newBlock);

            // Add a new relation if we're inserting between blocks
            const newBlockRelations = [...currentNode.blockRelations];
            if (blockIndex < currentNode.blocks.length - 1) {
              newBlockRelations.splice(blockIndex, 0, currentNode.blockRelations[blockIndex] || "AND");
            }

            return {
              conditionBlocks: {
                ...state.conditionBlocks,
                [nodeId]: {
                  ...currentNode,
                  blocks: newBlocks,
                  blockRelations: newBlockRelations,
                },
              },
            };
          });
        },

        moveBlock: (nodeId: string, blockId: string, direction: 'up' | 'down') => {
          if (!checkEditPermission()) return;
          set((state) => {
            const currentNode = state.conditionBlocks[nodeId];
            if (!currentNode) return state;

            const blockIndex = currentNode.blocks.findIndex((block) => block.id === blockId);
            if (blockIndex === -1) return state;

            const newIndex = direction === 'up' ? blockIndex - 1 : blockIndex + 1;
            if (newIndex < 0 || newIndex >= currentNode.blocks.length) return state;

            markUnsavedChanges();
            const newBlocks = [...currentNode.blocks];
            const newBlockRelations = [...currentNode.blockRelations];

            // Swap blocks
            [newBlocks[blockIndex], newBlocks[newIndex]] = [newBlocks[newIndex], newBlocks[blockIndex]];

            // Handle block relations
            if (blockIndex > 0 && newIndex > 0) {
              [newBlockRelations[blockIndex - 1], newBlockRelations[newIndex - 1]] = 
                [newBlockRelations[newIndex - 1], newBlockRelations[blockIndex - 1]];
            }

            return {
              conditionBlocks: {
                ...state.conditionBlocks,
                [nodeId]: {
                  ...currentNode,
                  blocks: newBlocks,
                  blockRelations: newBlockRelations,
                },
              },
            };
          });
        },

        copySubSection: (nodeId: string, blockId: string, subSectionId: number) => {
          if (!checkEditPermission()) return;
          set((state) => {
            const currentNode = state.conditionBlocks[nodeId];
            if (!currentNode) return state;

            markUnsavedChanges();
            return {
              conditionBlocks: {
                ...state.conditionBlocks,
                [nodeId]: {
                  ...currentNode,
                  blocks: currentNode.blocks.map((block) => {
                    if (block.id !== blockId) return block;

                    const subSectionToCopy = block.subSections.find(
                      (sub) => sub.id === subSectionId
                    );
                    if (!subSectionToCopy) return block;

                    const subSectionIndex = block.subSections.findIndex(
                      (sub) => sub.id === subSectionId
                    );

                    const newSubSections = [...block.subSections];
                    newSubSections.splice(subSectionIndex + 1, 0, {
                      ...subSectionToCopy,
                      id: Date.now() + Math.random()
                    });

                    return {
                      ...block,
                      subSections: newSubSections,
                    };
                  }),
                },
              },
            };
          });
        },

        moveSubSection: (nodeId: string, blockId: string, subSectionId: number, direction: 'up' | 'down') => {
          if (!checkEditPermission()) return;
          set((state) => {
            const currentNode = state.conditionBlocks[nodeId];
            if (!currentNode) return state;

            markUnsavedChanges();
            return {
              conditionBlocks: {
                ...state.conditionBlocks,
                [nodeId]: {
                  ...currentNode,
                  blocks: currentNode.blocks.map((block) => {
                    if (block.id !== blockId) return block;

                    const subSectionIndex = block.subSections.findIndex(
                      (sub) => sub.id === subSectionId
                    );
                    if (subSectionIndex === -1) return block;

                    const newIndex = direction === 'up' ? subSectionIndex - 1 : subSectionIndex + 1;
                    if (newIndex < 0 || newIndex >= block.subSections.length) return block;

                    const newSubSections = [...block.subSections];
                    [newSubSections[subSectionIndex], newSubSections[newIndex]] = 
                      [newSubSections[newIndex], newSubSections[subSectionIndex]];

                    return {
                      ...block,
                      subSections: newSubSections,
                    };
                  }),
                },
              },
            };
          });
        },

        clearConditionNodes: () => {
          if (!checkEditPermission()) return;
          set({ conditionBlocks: {} });
        },
      }),
      {
        name: "strategy-condition-store",
        storage: createJSONStorage(() => sessionStorage),
      }
    )
  )
);
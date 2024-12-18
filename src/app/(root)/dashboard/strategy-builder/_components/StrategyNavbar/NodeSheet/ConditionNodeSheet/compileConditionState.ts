import { Edge } from "@xyflow/react";
import { ConditionBlockMap } from "./types";
import { useNodeStore } from "@/lib/store/nodeStore";

const compileConditionState = (state: ConditionBlockMap) => {
  const output: any[] = [];
  const allEdges: Edge[] = useNodeStore.getState().edges;
  
  for (const [nodeId, nodeData] of Object.entries(state)) {
    const compiledNode: any = {
      node: nodeId,
      type: nodeData.name.toLowerCase(),
      maxentries: nodeData.maxEntries,
      conditions: []
    };

    compiledNode.check_when_position_open = nodeData.positionOpen;
    compiledNode.wait_trigger = nodeData.waitTrigger;

    //actions
    const actions:string[] = [];
    allEdges.forEach(e => {
      //source should start with ct and target should start with ac
      if(e.source.startsWith('ct') && e.target.startsWith('ac') && e.source === nodeId){
        actions.push(e.target);
      }
    })
    compiledNode.actions = actions;

    const compiledConditions: any[] = [];

    nodeData.blocks.forEach((block, blockIndex) => {
      const validSubSections = block.subSections.filter(
        sub => sub.lhs && sub.operator && sub.rhs
      );

      if (validSubSections.length === 0) return;

      const compiledBlock: any[] = [];

      validSubSections.forEach((subSection, subIndex) => {
        const condition = [
          `${subSection.lhs}${subSection.column ? `.${subSection.column}` : ''}${subSection.selectedPeriod ? `.${subSection.selectedPeriod}` : ''
          }`,
          subSection.operator,
          subSection.rhs.startsWith('$') ?
            subSection.rhs.slice(1) :
            isNaN(Number(subSection.rhs)) ?
              subSection.rhs :
              Number(subSection.rhs)
        ];

        compiledBlock.push(condition);

        if (subIndex < validSubSections.length - 1) {
          compiledBlock.push(validSubSections[subIndex].addBadge.toLowerCase());
        }
      });

      if (compiledBlock.length > 0) {
        compiledConditions.push(compiledBlock);

        if (blockIndex < nodeData.blocks.length - 1 && nodeData.blockRelations[blockIndex]) {
          compiledConditions.push(nodeData.blockRelations[blockIndex].toLowerCase());
        }
      }
    });

    if (compiledConditions.length > 0) {
      compiledNode.conditions = compiledConditions;
      output.push(compiledNode);
    }
  }

  return output;
};

export default compileConditionState;
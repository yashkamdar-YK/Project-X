import { ConditionBlockMap } from "./types";


const compileConditionState = (state: ConditionBlockMap) => {
  const output: Record<string, any[]> = {};

  for (const [nodeId, nodeData] of Object.entries(state)) {
    const compiledBlocks: any[] = [];

    // Process each block
    nodeData.blocks.forEach((block, blockIndex) => {
      const validSubSections = block.subSections.filter(
        sub => sub.lhs && sub.operator && sub.rhs
      );

      if (validSubSections.length === 0) return;

      const compiledBlock: any[] = [];

      // Process subsections within a block
      validSubSections.forEach((subSection, subIndex) => {
        // Create the condition array for this subsection
        const condition = [
          `${subSection.lhs}${subSection.column ? `.${subSection.column}` : ''}${
            subSection.selectedPeriod ? `.${subSection.selectedPeriod}` : ''
          }`,
          subSection.operator,
          `${subSection.rhs}${subSection._rhsValue ? `.${subSection._rhsValue}` : ''}`
        ];

        // Add the condition to the block
        compiledBlock.push(condition);

        // Add the relation if there's a next subsection
        if (subIndex < validSubSections.length - 1) {
          compiledBlock.push(validSubSections[subIndex].addBadge);
        }
      });

      if (compiledBlock.length > 0) {
        // Add the compiled block
        compiledBlocks.push(compiledBlock);

        // Add block relation if there's a next block
        if (blockIndex < nodeData.blocks.length - 1 && nodeData.blockRelations[blockIndex]) {
          compiledBlocks.push(nodeData.blockRelations[blockIndex]);
        }
      }
    });

    // Only add non-empty nodes to the output
    if (compiledBlocks.length > 0) {
      output[nodeId] = compiledBlocks;
    }
  }

  return output;
};

export default compileConditionState;
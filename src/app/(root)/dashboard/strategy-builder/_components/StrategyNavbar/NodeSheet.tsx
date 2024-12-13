
import { useSheetStore } from "@/lib/store/SheetStore";
import ConditionNodeSheet from "./NodeSheet/ConditionNodeSheet";
import ActionNodeSheet from "./NodeSheet/ActionNodeSheet";

const NodeSheet = () => {
  const { closeSheet, type, selectedItem, nodeType } = useSheetStore();

  if (type !== 'node' || !selectedItem) return null;

  return (
    <div className="h-full md:w-[480px] w-full">
      <div className="h-full border-l border-gray-200 dark:border-gray-800 overflow-y-auto bg-gray-50 dark:bg-gray-900">
        <div className="p-6 space-y-6">
      {nodeType === 'ACTION' ? (
        <ActionNodeSheet node={selectedItem} />
      ) : nodeType === 'CONDITION' ? (
        <ConditionNodeSheet node={selectedItem} />
      ) : null}
    </div>
    </div>
    </div>
  );
};

export default NodeSheet;
